import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/src/db'
import { users, customers } from '@/src/db/schema'
import { eq } from 'drizzle-orm'

export async function middleware(request: NextRequest) {
  // keep the Supabase session in sync
  const response = await updateSession(request)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: request.headers.get('Authorization')! },
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

  // logged in users - verify onboarding
  const userRow = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: { id: true },
  })
  const customerRow = await db.query.customers.findFirst({
    where: eq(customers.userId, user.id),
    columns: { id: true },
  })
  const onboarded = !!userRow && !!customerRow

  // Non-onboarded users should go to home page for onboarding
  if (!onboarded && pathname !== '/') {
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