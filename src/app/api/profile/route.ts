import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { users, customers, userPreferences, landlords } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/profile - Fetch user profile data
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user data with customer and preferences
    const userData = await db
      .select({
        // User fields
        id: users.id,
        email: users.email,
        username: users.username,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        
        // Customer fields
        firstName: customers.firstName,
        lastName: customers.lastName,
        phone: customers.phoneNumber,
        dateOfBirth: customers.dateOfBirth,
        profilePictureUrl: customers.profileImageS3Key,
        
        // Address fields (using current location from customers)
        city: customers.currentCity,
        state: customers.currentState,
        zipCode: customers.currentZipCode,
        
        // Preferences
        emailNotifications: userPreferences.updatesSavedPropertiesEmail,
        smsNotifications: userPreferences.updatesSavedPropertiesPush,
        pushNotifications: userPreferences.newPropertiesPush,
        marketingEmails: userPreferences.newsEmail,
        
        // Verification status (from landlords table if exists)
        identityVerified: landlords.identityVerified,
        backgroundCheckStatus: landlords.backgroundCheckCompleted,
      })
      .from(users)
      .leftJoin(customers, eq(users.id, customers.userId))
      .leftJoin(userPreferences, eq(users.id, userPreferences.userId))
      .leftJoin(landlords, eq(customers.id, landlords.customerId))
      .where(eq(users.id, user.id))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = userData[0];
    
    // Transform and add default values for missing fields
    const profileData = {
      ...profile,
      // Add default values for fields not in database
      phoneVerified: false, // Not in current schema
      bio: null, // Not in current schema
      streetAddress: null, // Not in current schema
      country: 'United States', // Default value
      
      // Transform profile picture URL if it exists
      profilePictureUrl: profile.profilePictureUrl ? `/api/images/${profile.profilePictureUrl}` : null,
      
      // Set default notification preferences if not set
      emailNotifications: profile.emailNotifications ?? true,
      smsNotifications: profile.smsNotifications ?? false,
      pushNotifications: profile.pushNotifications ?? false,
      marketingEmails: profile.marketingEmails ?? false,
      
      // Set verification defaults
      identityVerified: profile.identityVerified ?? false,
      backgroundCheckStatus: profile.backgroundCheckStatus ? 'completed' : 'pending',
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/profile - Update user profile data
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      username,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      bio, // Will be ignored since not in schema
      streetAddress, // Will be ignored since not in schema
      city,
      state,
      zipCode,
      country, // Will be ignored since not in schema
      emailNotifications,
      smsNotifications,
      pushNotifications,
      marketingEmails,
    } = body;

    // Start a transaction to update multiple tables
    await db.transaction(async (tx) => {
      // Update users table
      if (username !== undefined) {
        await tx
          .update(users)
          .set({ 
            username,
            updatedAt: new Date().toISOString()
          })
          .where(eq(users.id, user.id));
      }

      // Update or insert customer data
      const existingCustomer = await tx
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.userId, user.id))
        .limit(1);

      const customerData = {
        firstName: firstName || null,
        lastName: lastName || null,
        phoneNumber: phone || null,
        dateOfBirth: dateOfBirth || null,
        // Note: bio and streetAddress are not in current schema, so we skip them
        currentCity: city || null,
        currentState: state || null,
        currentZipCode: zipCode || null,
        updatedAt: new Date().toISOString(),
      };

      if (existingCustomer.length > 0) {
        // Update existing customer
        await tx
          .update(customers)
          .set(customerData)
          .where(eq(customers.userId, user.id));
      } else {
        // Insert new customer
        await tx
          .insert(customers)
          .values({
            ...customerData,
            userId: user.id,
            preferredContactMethod: 'email',
            createdAt: new Date().toISOString(),
          });
      }

      // Update or insert user preferences
      const existingPreferences = await tx
        .select({ id: userPreferences.id })
        .from(userPreferences)
        .where(eq(userPreferences.userId, user.id))
        .limit(1);

      const preferencesData = {
        updatesSavedPropertiesEmail: emailNotifications ?? true,
        updatesSavedPropertiesPush: smsNotifications ?? false,
        newPropertiesEmail: emailNotifications ?? true,
        newPropertiesPush: pushNotifications ?? false,
        newsEmail: marketingEmails ?? false,
        newsPush: pushNotifications ?? false,
        updatedAt: new Date().toISOString(),
      };

      if (existingPreferences.length > 0) {
        // Update existing preferences
        await tx
          .update(userPreferences)
          .set(preferencesData)
          .where(eq(userPreferences.userId, user.id));
      } else {
        // Insert new preferences
        await tx
          .insert(userPreferences)
          .values({
            ...preferencesData,
            userId: user.id,
            createdAt: new Date().toISOString(),
          });
      }
    });

    // Fetch and return updated profile data
    const updatedProfile = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        firstName: customers.firstName,
        lastName: customers.lastName,
        phone: customers.phoneNumber,
        dateOfBirth: customers.dateOfBirth,
        profilePictureUrl: customers.profileImageS3Key,
        city: customers.currentCity,
        state: customers.currentState,
        zipCode: customers.currentZipCode,
        emailNotifications: userPreferences.updatesSavedPropertiesEmail,
        smsNotifications: userPreferences.updatesSavedPropertiesPush,
        pushNotifications: userPreferences.newPropertiesPush,
        marketingEmails: userPreferences.newsEmail,
        identityVerified: landlords.identityVerified,
        backgroundCheckStatus: landlords.backgroundCheckCompleted,
      })
      .from(users)
      .leftJoin(customers, eq(users.id, customers.userId))
      .leftJoin(userPreferences, eq(users.id, userPreferences.userId))
      .leftJoin(landlords, eq(customers.id, landlords.customerId))
      .where(eq(users.id, user.id))
      .limit(1);

    const profile = updatedProfile[0];
    
    // Transform and add default values
    const profileData = {
      ...profile,
      phoneVerified: false,
      bio: null,
      streetAddress: null,
      country: 'United States',
      profilePictureUrl: profile.profilePictureUrl ? `/api/images/${profile.profilePictureUrl}` : null,
      emailNotifications: profile.emailNotifications ?? true,
      smsNotifications: profile.smsNotifications ?? false,
      pushNotifications: profile.pushNotifications ?? false,
      marketingEmails: profile.marketingEmails ?? false,
      identityVerified: profile.identityVerified ?? false,
      backgroundCheckStatus: profile.backgroundCheckStatus ? 'completed' : 'pending',
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 