import {NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const ONBOARDING_COOKIE_NAME = 'onboarding-status'

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Sign out the user
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create response and clear the onboarding cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete(ONBOARDING_COOKIE_NAME);

    return response;
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 