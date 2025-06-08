import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { pusherServer } from '@/src/lib/pusher';
import { userHasConversationAccess } from '@/src/db/queries';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.formData();
    const socketId = body.get('socket_id') as string;
    const channel = body.get('channel_name') as string;

    if (!socketId || !channel) {
      return NextResponse.json({ error: 'socket_id and channel_name are required' }, { status: 400 });
    }

    const conversationId = channel.replace('private-conversation-', '');

    // For presence channels, the channel name is 'presence-conversation-{id}'
    const presenceConversationId = channel.replace('presence-conversation-', '');

    if (conversationId === channel && presenceConversationId === channel) {
        return NextResponse.json({ error: 'Invalid channel name' }, { status: 400 });
    }

    const finalConversationId = conversationId !== channel ? conversationId : presenceConversationId;

    const hasAccess = await userHasConversationAccess(user.id, finalConversationId);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userData = {
      user_id: user.id,
      user_info: {
        email: user.email,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, userData);
    
    return NextResponse.json(authResponse);

  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 