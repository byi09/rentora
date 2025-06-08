import { NextRequest, NextResponse } from 'next/server';
import { getUserConversationsComplete } from '@/src/db/queries';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { conversations, conversationParticipants, users } from '@/src/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!user || error) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Loading conversations for user:', user.id);

        const userConversations = await getUserConversationsComplete(user.id);

        console.log(`Found ${userConversations.length} conversations for user`);

        return NextResponse.json(userConversations);

    } catch (error) {
        console.error('Error in GET /api/messaging/conversation:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!user || error) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { 
            conversation_type = 'direct', 
            participant_ids = [], 
            content, 
            property_id, 
            title 
        } = body;

        // --- Start of Validation ---
        // 1. Validate that all participant_ids are valid users
        if (participant_ids.length > 0) {
            const usersExist = await db.select({ id: users.id }).from(users).where(inArray(users.id, participant_ids));
            if (usersExist.length !== participant_ids.length) {
                return NextResponse.json({ error: 'One or more participant IDs are invalid.' }, { status: 400 });
            }
        }

        // 2. Validation based on conversation type
        if (conversation_type === 'direct') {
            if (participant_ids.length !== 1) {
                return NextResponse.json({ 
                    error: 'Direct chat needs exactly 1 other participant' 
                }, { status: 400 });
            }
        } else if (conversation_type === 'group') {
            if (participant_ids.length < 2) {
                return NextResponse.json({ 
                    error: 'Group chat needs at least 2 other participants' 
                }, { status: 400 });
            }
            if (!title) {
                return NextResponse.json({ 
                    error: 'Group chat requires a title' 
                }, { status: 400 });
            }
        }

        // Create conversation using Supabase client (respects RLS)
        const { data: newConversation, error: convError } = await supabase
            .from('conversations')
            .insert({
                conversation_type,
                property_id: property_id || null,
                title: conversation_type === 'group' ? title : null,
            })
            .select()
            .single();

        if (convError) {
            console.error('Error creating conversation:', convError);
            throw convError;
        }

        // Prepare participants array
        const participants = [
            // Creator as admin for groups, member for direct
            { 
                conversation_id: newConversation.id, 
                user_id: user.id, 
                role: conversation_type === 'group' ? 'admin' : 'member' 
            },
            // Other participants as members
            ...participant_ids.map((participantId: string) => ({
                conversation_id: newConversation.id,
                user_id: participantId,
                role: 'member'
            }))
        ];

        // Add all participants using Supabase client
        const { error: participantsError } = await supabase
            .from('conversation_participants')
            .insert(participants);

        if (participantsError) {
            console.error('Error adding participants:', participantsError);
            throw participantsError;
        }

        // If initial message provided, add it
        if (content) {
            const { error: messageError } = await supabase
                .from('messages')
                .insert({
                    conversation_id: newConversation.id,
                    sender_id: user.id,
                    content,
                    message_type: 'text'
                });

            if (messageError) {
                console.error('Error adding initial message:', messageError);
                // Don't throw - conversation was created successfully
            }
        }

        return NextResponse.json({ 
            conversation: newConversation,
            participants_count: participants.length,
            success: true
        });

    } catch (error) {
        console.error('Error in POST /api/messaging/conversation:', error);
        return NextResponse.json({ 
            error: 'Failed to create conversation',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 