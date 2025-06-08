import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { properties } from '@/src/db/schema';
import { ilike, or } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (!user || authError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json([]);
        }

        const foundProperties = await db
            .select()
            .from(properties)
            .where(
                or(
                    ilike(properties.addressLine1, `%${query}%`),
                    ilike(properties.city, `%${query}%`),
                    ilike(properties.zipCode, `%${query}%`)
                )
            )
            .limit(10);

        return NextResponse.json(foundProperties);

    } catch (error) {
        console.error('Error searching properties:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 