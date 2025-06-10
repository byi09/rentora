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

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  
  try {
    // Extract form data
    const propertyData = {
      // Using existing landlord_id - you'll need to replace this with actual user's landlord_id
      landlord_id: 'b7ee8ae5-686c-48a7-9a45-df7fb9b2ab3f', // TODO: Get from current user
      address_line_1: formData.get('address_line_1') as string,
      address_line_2: formData.get('address_line_2') as string || null,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip_code: formData.get('zip_code') as string,
      property_type: formData.get('property_type') as string || 'apartment',
      bedrooms: parseInt(formData.get('bedrooms') as string),
      bathrooms: parseFloat(formData.get('bathrooms') as string),
      square_footage: parseInt(formData.get('square_footage') as string),
      description: formData.get('description') as string || null,
      year_built: formData.get('year_built') ? parseInt(formData.get('year_built') as string) : null,
    }

    // Insert the property
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()

    if (error) {
      console.error('Error creating property:', error)
      redirect('/error?type=unknown')
    }

    console.log('Property created successfully:', data)
    
    // Redirect to the next step in the form or to a success page
    revalidatePath('/sell/create', 'layout')
    redirect('/sell/create/rent-details')
    
  } catch (error) {
    console.error('Unexpected error:', error)
    redirect('/error?type=unknown')
  }
}