import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@supabase/supabase-js';
import { db } from './db';
import { customers } from './db/schema';
import { eq } from 'drizzle-orm';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: request.headers.get('Authorization')! },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Logic for authenticated users
  if (user) {
    // If a logged-in user tries to access the sign-in page, redirect them to the dashboard.
    if (pathname === '/sign-in') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check onboarding status
    const customerRecord = await db.query.customers.findFirst({
      where: eq(customers.userId, user.id),
      columns: { id: true }
    });
    const isOnboarded = !!customerRecord;

    // If not onboarded and not on the dashboard, force redirect to the dashboard for the popup.
    if (!isOnboarded && pathname !== '/') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } 
  // Logic for unauthenticated users
  else {
    // Allow access to the landing page and the sign-in page without redirects
    if (pathname !== '/' && pathname !== '/sign-in') {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * - auth/ (auth routes like sign-in, callback, error)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|auth).*)',
  ],
}; 