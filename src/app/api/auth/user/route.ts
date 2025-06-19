import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ 
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata
        });

    } catch (error) {
        console.error('Error in GET /api/auth/user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 