import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { users, customers } from '@/src/db/schema';
import { ilike, or, sql, ne, and, eq } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

    if (!currentUser || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]); // Return empty array if no query
    }

    const foundUsers = await db
      .select({
        id: users.id,
        username: users.username,
        firstName: customers.firstName,
        lastName: customers.lastName,
      })
      .from(users)
      .leftJoin(customers, eq(users.id, customers.userId))
      .where(
        and(
          ne(users.id, currentUser.id), // Exclude self from search results
          or(
            ilike(users.username, `%${query}%`),
            ilike(customers.firstName, `%${query}%`),
            ilike(customers.lastName, `%${query}%`),
            ilike(sql`concat(${customers.firstName}, ' ', ${customers.lastName})`, `%${query}%`)
          )
        )
      )
      .limit(10);
      
    return NextResponse.json(foundUsers);

  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 