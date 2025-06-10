import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { db } from '@/src/db'
import { users, customers } from '@/src/db/schema'
import { eq } from 'drizzle-orm'

export async function middleware(request: NextRequest) {
  // keep the Supabase session in sync
  const response = await updateSession(request)

  // Use the same cookie-based auth strategy as updateSession so that
  // supabase.auth.getUser() correctly identifies the logged-in user.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Forward any cookie updates to the response so they reach the browser
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // unauthenticated users
  if (!user) {
    const allowed = ['/', '/map', '/sign-in', '/sign-up', '/callback', '/error', '/confirm-email']
    if (!allowed.includes(pathname)) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    return response
  }

  // logged-in users – check onboarding status by querying Supabase via REST
  const { data: onboardUserRow } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  const { data: onboardCustomerRow } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const onboarded = !!onboardUserRow && !!onboardCustomerRow

  // Pages that require full onboarding
  const requiresOnboarding = ['/sell', '/rent', '/profile', '/settings']
  const requiresOnboardingAccess = requiresOnboarding.some(path => pathname.startsWith(path))

  // Non-onboarded users can't access certain protected pages
  if (!onboarded && requiresOnboardingAccess) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * - (auth)/ (route group auth pages)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|\\(auth\\)/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}