import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { users, customers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

const ONBOARDING_COOKIE_NAME = 'onboarding-status'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function GET() {
  console.log('🔍 GET /api/onboarding/check-status called');
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
      return NextResponse.json({ 
        onboarded: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Check if user exists in our database and is onboarded
    const [userRow, customerRow] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, user.id),
        columns: { id: true }
      }),
      db.query.customers.findFirst({
        where: eq(customers.userId, user.id),
        columns: { id: true }
      })
    ]);

    const onboarded = !!userRow && !!customerRow;
    
    // Create response and set the onboarding cookie
    const response = NextResponse.json({ onboarded });
    response.cookies.set(ONBOARDING_COOKIE_NAME, onboarded.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/'
    });

    return response;
    
  } catch (err) {
    console.error('Onboarding status error:', err);
    return NextResponse.json({ 
      onboarded: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 