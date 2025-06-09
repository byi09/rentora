import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { users, customers, renters, landlords } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: OnboardingPayload = await request.json();

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

    const customerData = { firstName: payload.firstName, lastName: payload.lastName, dateOfBirth: dob, phoneNumber: payload.phoneNumber ?? null, currentCity: payload.currentCity ?? null, currentState: payload.currentState ?? null, currentZipCode: payload.currentZipCode ?? null };

    if (existing) {
      await db.update(customers).set(customerData).where(eq(customers.userId, user.id));
    } else {
      await db.insert(customers).values({ userId: user.id, ...customerData });
    }

    // create role row
    const customer = await db.query.customers.findFirst({ where: eq(customers.userId, user.id) });
    if (customer) {
      if (payload.userType === 'renter') {
        const rentRow = await db.query.renters.findFirst({ where: eq(renters.customerId, customer.id) });
        if (!rentRow) await db.insert(renters).values({ customerId: customer.id });
      } else if (payload.userType === 'landlord') {
        const landRow = await db.query.landlords.findFirst({ where: eq(landlords.customerId, customer.id) });
        if (!landRow) await db.insert(landlords).values({ customerId: customer.id });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Onboarding complete error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface OnboardingPayload {
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber?: string;
  currentCity?: string;
  currentState?: string;
  currentZipCode?: string;
  userType: 'renter' | 'landlord';
} 