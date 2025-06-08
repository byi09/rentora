import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { messages, conversationParticipants, users, customers } from '@/src/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = request.nextUrl.searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Critical: Check if the user is a participant in this conversation
    const participation = await db
      .select({ id: conversationParticipants.id })
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, user.id),
          eq(conversationParticipants.isActive, true)
        )
      )
      .limit(1);

    if (participation.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // User is authorized, so fetch the messages
    const conversationMessages = await db
      .select({
        id: messages.id,
        content: messages.content,
        messageType: messages.messageType,
        senderId: messages.senderId,
        createdAt: messages.createdAt,
        isEdited: messages.isEdited,
        replyToId: messages.replyToId,
        sender: {
          id: users.id,
          username: users.username,
          firstName: customers.firstName,
          lastName: customers.lastName,
        }
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .innerJoin(customers, eq(users.id, customers.userId))
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.isDeleted, false)
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(50); // Add pagination

    return NextResponse.json(conversationMessages);

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
