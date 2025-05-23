'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUpNewUser(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const school = formData.get('school') as string
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { school }
    }
  })
  if (error) {
    redirect('/error')
  }
  redirect('/confirm-email')
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.log('Sign in error:', error) // Debug log
    
    // Check specific error types
    if (error.message === 'Email not confirmed') {
      redirect('/error?type=email_not_confirmed')
    } else if (error.message === 'Invalid login credentials') {
      redirect('/error?type=invalid_credentials')
    } else {
      redirect('/error?type=unknown')
    }
  }
  
  // Success - redirect to home
  redirect('/')
}