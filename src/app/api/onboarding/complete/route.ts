import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/onboarding/complete called');
  
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    if (!user) {
      console.error('❌ No authenticated user');
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Invalid JSON in request body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    console.log('📝 Onboarding data received:', JSON.stringify(body, null, 2));

    // Validate required fields
    const requiredFields = ['username', 'firstName', 'lastName', 'dateOfBirth', 'userType'];
    const missingFields = requiredFields.filter(field => !body[field]?.toString().trim());
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(body.username)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Username can only contain letters, numbers, and underscores' 
        },
        { status: 400 }
      );
    }

    // Validate user type
    if (!['renter', 'landlord'].includes(body.userType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid user type. Must be either renter or landlord' 
        },
        { status: 400 }
      );
    }

    // Validate date of birth (must be at least 18 years old)
    const birthDate = new Date(body.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      // Birthday hasn't occurred this year, subtract 1 from age
    }
    
    if (age < 18) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You must be at least 18 years old to use this service' 
        },
        { status: 400 }
      );
    }

    // Check if username is already taken
    try {
      const { data: existingUsers, error: searchError } = await supabase
        .from('users')
        .select('id')
        .eq('username', body.username)
        .neq('id', user.id);

      if (searchError) {
        console.error('❌ Username check error:', searchError);
        return NextResponse.json(
          { success: false, error: 'Failed to validate username' },
          { status: 500 }
        );
      }

      if (existingUsers && existingUsers.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Username is already taken' },
          { status: 409 }
        );
      }
    } catch (usernameError) {
      console.error('❌ Username validation error:', usernameError);
      return NextResponse.json(
        { success: false, error: 'Failed to validate username' },
        { status: 500 }
      );
    }

    // Prepare user data for update
    const userData = {
      username: body.username.trim(),
      first_name: body.firstName.trim(),
      last_name: body.lastName.trim(),
      date_of_birth: body.dateOfBirth,
      user_type: body.userType,
      phone_number: body.phoneNumber?.trim() || null,
      gender: body.gender?.trim() || null,
      current_city: body.currentCity?.trim() || null,
      current_state: body.currentState?.trim() || null,
      current_zip_code: body.currentZipCode?.trim() || null,
      interest_city: body.interestCity?.trim() || null,
      interest_state: body.interestState?.trim() || null,
      interest_zip_code: body.interestZipCode?.trim() || null,
      updates_saved_properties_email: body.updatesSavedPropertiesEmail ?? true,
      updates_saved_properties_push: body.updatesSavedPropertiesPush ?? false,
      new_properties_email: body.newPropertiesEmail ?? true,
      new_properties_push: body.newPropertiesPush ?? false,
      news_email: body.newsEmail ?? true,
      news_push: body.newsPush ?? false,
      onboarded: true,
      updated_at: new Date().toISOString(),
    };

    console.log('💾 Updating user with data:', JSON.stringify(userData, null, 2));

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(userData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ User update error:', updateError);
      
      // Handle specific database errors
      if (updateError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { success: false, error: 'Username is already taken' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save profile information',
          details: updateError.message 
        },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      console.error('❌ No user returned after update');
      return NextResponse.json(
        { success: false, error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    console.log('✅ User updated successfully:', updatedUser.id);

    // Create user roles based on user type
    try {
      const rolesToCreate = [];
      
      if (body.userType === 'renter' || body.userType === 'both') {
        rolesToCreate.push({ user_id: user.id, role: 'renter' });
      }
      
      if (body.userType === 'landlord' || body.userType === 'both') {
        rolesToCreate.push({ user_id: user.id, role: 'landlord' });
      }

      if (rolesToCreate.length > 0) {
        const { error: rolesError } = await supabase
          .from('user_roles')
          .upsert(rolesToCreate, { 
            onConflict: 'user_id,role',
            ignoreDuplicates: true 
          });

        if (rolesError) {
          console.error('❌ User roles creation error:', rolesError);
          // Don't fail the entire operation for role creation errors
          console.warn('⚠️ Continuing despite role creation error');
        } else {
          console.log('✅ User roles created successfully');
        }
      }
    } catch (rolesError) {
      console.error('❌ User roles creation failed:', rolesError);
      // Don't fail the entire operation for role creation errors
      console.warn('⚠️ Continuing despite role creation error');
    }

    console.log('🎉 Onboarding completed successfully for user:', user.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding completed successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        userType: updatedUser.user_type
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error in onboarding completion:', error);
    
    // Provide different error messages based on error type
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 503 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred during onboarding',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
} 