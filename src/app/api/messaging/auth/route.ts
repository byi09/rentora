import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/src/lib/pusher';
import { createClient } from '@/utils/supabase/server';
import { userHasConversationAccess } from '@/src/db/queries';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const socketId = data.get('socket_id') as string;
    const channel = data.get('channel_name') as string;

    if (!socketId || !channel) {
      return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
    }

    // --- Authorization Logic ---
    let isAuthorized = false;
    
    if (channel.startsWith('private-user-')) {
        const channelUserId = channel.replace('private-user-', '');
        // Users can only subscribe to their own private channel
        if(channelUserId === user.id) {
            isAuthorized = true;
        }
    } else if (channel.startsWith('private-conversation-')) {
        const conversationId = channel.replace('private-conversation-', '');
        // Users can only subscribe if they are a participant in the conversation
        isAuthorized = await userHasConversationAccess(user.id, conversationId);
    }
    
    if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const authResponse = pusherServer.authorizeChannel(socketId, channel);

    return NextResponse.json(authResponse);

  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 