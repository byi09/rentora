import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Keep the Supabase session in sync and get the updated response
  const response = await updateSession(request)
  
  const { pathname } = request.nextUrl

  // Create the same server client that updateSession uses for consistency
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // We don't need to set cookies here since updateSession handles it
        },
        remove(name: string, options: any) {
          // We don't need to remove cookies here since updateSession handles it
        },
      },
    }
  )

  // Get user from the server client
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  // Define allowed paths for unauthenticated users
  const publicPaths = ['/', '/map', '/sign-in', '/sign-up', '/callback', '/error', '/confirm-email']
  
  // Handle unauthenticated users
  if (!user || error) {
    if (!publicPaths.includes(pathname)) {
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  // For authenticated users, we'll handle onboarding check client-side
  // to avoid database queries in middleware and improve performance
  
  // Authenticated users can access all pages
  // Onboarding logic should be handled in page components or layouts
  
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
     * - Static assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}