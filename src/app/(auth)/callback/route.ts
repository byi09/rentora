import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('Auth callback received:', { token_hash, type, code, next })

  const supabase = await createClient()

  // Handle OAuth callback (Google, etc.)
  if (code) {
    console.log('Processing OAuth code:', code)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('OAuth exchange error:', error)
      return NextResponse.redirect(`${origin}/error?type=oauth_error`)
    }
    
    if (data.session) {
      console.log('OAuth success, redirecting to homepage')
      // Always redirect to homepage for OAuth
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // Handle email confirmation
  if (token_hash && type) {
    console.log('Processing email confirmation:', { token_hash, type })
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      console.log('Email confirmation success, redirecting to:', next)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('Email confirmation error:', error)
    }
  }

  console.log('No valid auth data, redirecting to error')
  return NextResponse.redirect(`${origin}/error`)
}