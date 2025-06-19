const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

console.log('🔍 Supabase Configuration Diagnostic');
console.log('=====================================');

// Check environment variables
console.log('Environment Variables:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}

console.log('\n🧪 Testing Supabase Connection...');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Test connection
async function testConnection() {
  try {
    console.log('Testing auth status...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth Error:', authError.message);
      console.log('  This is expected if no user is logged in');
    } else {
      console.log('✅ Auth connection successful');
      console.log('User:', user ? 'Authenticated' : 'Not authenticated');
    }

    console.log('\nTesting storage buckets...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.log('❌ Storage Error:', storageError.message);
      console.log('  Error details:', storageError);
    } else {
      console.log('✅ Storage connection successful');
      console.log('Available buckets:', buckets?.map(b => b.name) || []);
      
      // Check for required buckets
      const requiredBuckets = ['property-images', 'property-tours'];
      const existingBuckets = buckets?.map(b => b.name) || [];
      
      console.log('\nRequired buckets check:');
      requiredBuckets.forEach(bucketName => {
        const exists = existingBuckets.includes(bucketName);
        console.log(`- ${bucketName}: ${exists ? '✅ Exists' : '❌ Missing'}`);
      });
    }

    console.log('\nTesting database connection...');
    const { data, error: dbError } = await supabase
      .from('properties')
      .select('count')
      .limit(1);
    
    if (dbError) {
      console.log('❌ Database Error:', dbError.message);
      console.log('  Error details:', dbError);
    } else {
      console.log('✅ Database connection successful');
    }

    // Test property_images table
    console.log('\nTesting property_images table...');
    const { data: imagesData, error: imagesError } = await supabase
      .from('property_images')
      .select('count')
      .limit(1);
    
    if (imagesError) {
      console.log('❌ Property Images Table Error:', imagesError.message);
    } else {
      console.log('✅ Property images table accessible');
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection(); 