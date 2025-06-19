import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { messages, conversationParticipants, users, customers, conversations } from '@/src/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { pusherServer } from '@/src/lib/pusher';
import { userHasConversationAccess } from '@/src/db/queries';

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

    const participation = await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, user.id),
        eq(conversationParticipants.isActive, true)
      ),
    });

    if (!participation) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const conversationMessages = await db.select({
        id: messages.id, content: messages.content, messageType: messages.messageType,
        senderId: messages.senderId, createdAt: messages.createdAt, isEdited: messages.isEdited,
        replyToId: messages.replyToId,
        sender: { id: users.id, username: users.username, firstName: customers.firstName, lastName: customers.lastName }
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .innerJoin(customers, eq(users.id, customers.userId))
      .where(and(eq(messages.conversationId, conversationId), eq(messages.isDeleted, false)))
      .orderBy(desc(messages.createdAt))
      .limit(50);

    return NextResponse.json(conversationMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, content, clientId } = await request.json();

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Missing conversationId or content' }, { status: 400 });
    }

    if (!(await userHasConversationAccess(user.id, conversationId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [newMessage] = await db.insert(messages).values({
      conversationId,
      senderId: user.id,
      content,
      messageType: 'text',
    }).returning();

    const messageWithSender = await db.query.messages.findFirst({
        where: eq(messages.id, newMessage.id),
        with: { sender: { with: { customer: true } } }
    });

    // Add clientId to the broadcast payload if it exists
    const broadcastPayload = { ...messageWithSender, clientId };

    // 1. Trigger event for the active conversation channel
    await pusherServer.trigger(
      `private-conversation-${conversationId}`,
      'new-message',
      broadcastPayload
    );

    // 2. Get all participants to notify them (including the sender for multi-device sync)
    const allParticipants = await db.query.conversationParticipants.findMany({
      where: eq(conversationParticipants.conversationId, conversationId),
    });

    // 3. Trigger an event for each participant so their conversation list updates
    for (const participant of allParticipants) {
        await pusherServer.trigger(
            `private-user-${participant.userId}`,
            'conversation-update',
            {
                conversationId: conversationId,
                lastMessage: broadcastPayload,
            }
        );
    }
    
    // Also update the conversation's "updatedAt" to move it to the top of the list
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json(messageWithSender);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
