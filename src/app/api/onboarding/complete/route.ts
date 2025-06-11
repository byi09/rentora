import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { users, customers, renters, landlords, userPreferences } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { OnboardingPayload } from '@/src/db/queries';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: OnboardingPayload = await request.json();
    console.log('🔍 Received onboarding payload:', JSON.stringify(payload, null, 2));

    // guarantee users row
    const userRow = await db.query.users.findFirst({ where: eq(users.id, user.id) });
    if (!userRow) {
      const fallbackUsername = payload.username || user.email?.split('@')[0] || 'user';
      await db.insert(users).values({ id: user.id, email: user.email ?? '', username: fallbackUsername });
    } else if (payload.username) {
      await db.update(users).set({ username: payload.username }).where(eq(users.id, user.id));
    }

    const existing = await db.query.customers.findFirst({ where: eq(customers.userId, user.id) });

    const dob = payload.dateOfBirth && payload.dateOfBirth.trim() !== '' ? payload.dateOfBirth : null;

    // Normalize gender to match DB enum values (male, female, other, prefer_not_to_say)
    type GenderEnum = 'male' | 'female' | 'other' | 'prefer_not_to_say';
    let gender: GenderEnum | null = null;
    if (payload.gender && payload.gender.trim() !== '') {
      const normalized = payload.gender.trim().toLowerCase().replace(/\s+/g, '_');
      const allowed: GenderEnum[] = ['male', 'female', 'other', 'prefer_not_to_say'];
      if (allowed.includes(normalized as GenderEnum)) {
        gender = normalized as GenderEnum;
      }
    }

    // Use new separate location fields if provided, otherwise fallback to parsing legacy fields
    let currentCity = payload.currentCity ?? null;
    let currentState = payload.currentState ?? null;
    let currentZip = payload.currentZipCode ?? null;
    let interestCity = payload.interestCity ?? null;
    let interestState = payload.interestState ?? null;
    let interestZip = payload.interestZipCode ?? null;

    console.log('🏠 Location fields from payload:', {
      currentCity, currentState, currentZip,
      interestCity, interestState, interestZip
    });

    // Fallback to parsing legacy currentLocation field if new fields aren't provided
    if (!currentCity && !currentState && !currentZip && payload.currentLocation) {
      console.log('📍 Using legacy currentLocation field:', payload.currentLocation);
      const [cityPart, stateZipPart] = payload.currentLocation.split(',').map(s => s.trim());
      currentCity = cityPart || null;
      if (stateZipPart) {
        const [statePart, zipPart] = stateZipPart.split(' ').map(s => s.trim());
        currentState = statePart || null;
        currentZip = zipPart || null;
      }
    }

    // Fallback to parsing legacy locationOfInterest field if new fields aren't provided
    if (!interestCity && !interestState && !interestZip && payload.locationOfInterest) {
      console.log('🎯 Using legacy locationOfInterest field:', payload.locationOfInterest);
      const [cityPart, stateZipPart] = payload.locationOfInterest.split(',').map(s => s.trim());
      interestCity = cityPart || null;
      if (stateZipPart) {
        const [statePart, zipPart] = stateZipPart.split(' ').map(s => s.trim());
        interestState = statePart || null;
        interestZip = zipPart || null;
      }
    }

    const customerData = { 
      firstName: payload.firstName,
      lastName: payload.lastName,
      dateOfBirth: dob,
      phoneNumber: payload.phoneNumber ?? null,
      currentCity,
      currentState,
      currentZipCode: currentZip,
      interestCity,
      interestState,
      interestZipCode: interestZip,
      gender,
    };

    console.log('💾 Final customerData to save:', JSON.stringify(customerData, null, 2));

    if (existing) {
      await db.update(customers).set(customerData).where(eq(customers.userId, user.id));
    } else {
      await db.insert(customers).values({ userId: user.id, ...customerData });
    }

    // create role row
    const customer = await db.query.customers.findFirst({ where: eq(customers.userId, user.id) });
    if (customer) {

      const rentRow = await db.query.renters.findFirst({ where: eq(renters.customerId, customer.id) });
      if (!rentRow) await db.insert(renters).values({ customerId: customer.id });
      const landRow = await db.query.landlords.findFirst({ where: eq(landlords.customerId, customer.id) });
      if (!landRow) await db.insert(landlords).values({ customerId: customer.id });
    
    }

    // Upsert user_preferences
    if (
      'updatesSavedPropertiesEmail' in payload ||
      'updatesSavedPropertiesPush' in payload
    ) {
      const prefRow = await db.query.userPreferences.findFirst({ where: eq(userPreferences.userId, user.id) });
      const prefData = {
        userId: user.id,
        updatesSavedPropertiesEmail: payload.updatesSavedPropertiesEmail ?? true,
        updatesSavedPropertiesPush: payload.updatesSavedPropertiesPush ?? true,
        newPropertiesEmail: payload.newPropertiesEmail ?? true,
        newPropertiesPush: payload.newPropertiesPush ?? true,
        newsEmail: payload.newsEmail ?? true,
        newsPush: payload.newsPush ?? true,
      };
      if (prefRow) {
        await db.update(userPreferences).set(prefData).where(eq(userPreferences.userId, user.id));
      } else {
        await db.insert(userPreferences).values(prefData);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Onboarding complete error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 