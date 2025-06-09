import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { users, customers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRow = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { id: true }
    })
    const customerRow = await db.query.customers.findFirst({
      where: eq(customers.userId, user.id),
      columns: { id: true }
    })

    const onboarded = !!userRow && !!customerRow
    return NextResponse.json({ onboarded })
  } catch (err) {
    console.error('Onboarding status error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 