import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🚨 SIMPLE MIDDLEWARE CALLED:', request.nextUrl.pathname);
  
  // For now, just redirect all /messages requests to /sign-in
  if (request.nextUrl.pathname === '/messages') {
    console.log('🚨 REDIRECTING /messages to /sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/messages', '/']
}