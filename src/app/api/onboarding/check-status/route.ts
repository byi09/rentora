import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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

    // Retrieve onboarded flag from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('onboarded')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    const onboarded = !!profile?.onboarded;
    
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