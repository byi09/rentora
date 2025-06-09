import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  if (error) {
    // If the user cancels the OAuth flow, Google redirects back with an `error` query param.
    // We can redirect to a dedicated error page.
    console.error('OAuth Error:', requestUrl.searchParams.get('error_description'));
    return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=Authentication was cancelled or failed.`);
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
        console.error('Supabase session exchange error:', error.message);
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=${encodeURIComponent(error.message)}`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
} 