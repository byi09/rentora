import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST() {
  try {
    // Use regular client to check user authentication
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client for bucket operations (bypasses RLS)
    const adminSupabase = await createAdminClient();

    // Check existing buckets
    const { data: buckets, error: listError } = await adminSupabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json({ error: 'Failed to list buckets' }, { status: 500 });
    }

    const results = {
      propertyImages: { exists: false, created: false, error: null as string | null },
      property3DTours: { exists: false, created: false, error: null as string | null }
    };

    // Check if buckets exist (they should be pre-created)
    const propertyImagesBucket = buckets?.find(bucket => bucket.name === 'property-images');
    if (propertyImagesBucket) {
      results.propertyImages.exists = true;
    } else {
      results.propertyImages.error = 'Property images bucket not found';
    }

    const property3DToursBucket = buckets?.find(bucket => bucket.name === 'property-3d-tours');
    if (property3DToursBucket) {
      results.property3DTours.exists = true;
    } else {
      results.property3DTours.error = 'Property 3D tours bucket not found';
    }

    return NextResponse.json({ 
      success: true, 
      results 
    });

  } catch (error) {
    console.error('Storage initialization error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 