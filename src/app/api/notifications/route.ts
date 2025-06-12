import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { notifications } from '@/src/db/schema';
import { eq, isNull, or, and, desc, inArray } from 'drizzle-orm';

// GET /api/notifications – returns latest notifications for user with unread count
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch notifications addressed to this user or broadcast (receiver_id null)
    const items = await db
      .select()
      .from(notifications)
      .where(or(eq(notifications.receiverId, user.id), isNull(notifications.receiverId)))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    const unreadCount = items.filter(n => !n.readAt).length;

    return NextResponse.json({ notifications: items, unreadCount });
  } catch (err) {
    console.error('Notifications GET error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/notifications – mark notifications read
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json(); // array of notification ids to mark read
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No ids supplied' }, { status: 400 });
    }

    await db.update(notifications)
      .set({ readAt: new Date() })
      .where(and(or(eq(notifications.receiverId, user.id), isNull(notifications.receiverId)), inArray(notifications.id, ids)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Notifications POST error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 