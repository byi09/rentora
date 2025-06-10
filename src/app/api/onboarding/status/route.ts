import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';
import { db } from '../../../../db';
import { users, customers } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
      return NextResponse.json({ 
        onboarded: false, 
        user: null,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Check if user exists in our database and is onboarded
    const [userRow, customerRow] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, user.id),
        columns: { id: true }
      }),
      db.query.customers.findFirst({
        where: eq(customers.userId, user.id),
        columns: { id: true }
      })
    ]);

    const onboarded = !!userRow && !!customerRow;
    
    return NextResponse.json({ 
      onboarded,
      user: {
        id: user.id,
        email: user.email
      }
    });
    
  } catch (err) {
    console.error('Onboarding status error:', err);
    return NextResponse.json({ 
      onboarded: false,
      user: null,
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 