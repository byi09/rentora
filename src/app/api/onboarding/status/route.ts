import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { customers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const onboarded = (await db.query.customers.findFirst({ where: eq(customers.userId, user.id) })) !== undefined;
    return NextResponse.json({ onboarded });
  } catch (err) {
    console.error('Onboarding status error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 