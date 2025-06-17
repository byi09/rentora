'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import InteractiveProgressBar from '@/src/components/ui/InteractiveProgressBar';

export default function CreateListingPage() {
  const router = useRouter();
  const [beds, setBeds] = useState('1');
  const [baths, setBaths] = useState('1');
  const [squareFootage, setSquareFootage] = useState('1500');
  const [propertyType, setPropertyType] = useState('apartment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const supabase = createClient();
      
      // Get the authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        alert('Please sign in to create a property');
        setIsSubmitting(false);
        return;
      }

      // Step 1: find the customer record linked to the signed-in user
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError || !customerData) {
        console.error('Customer record not found:', customerError);
        alert('Account profile not found. Please finish onboarding.');
        setIsSubmitting(false);
        return;
      }

      // Step 2: fetch the landlord record for that customer
      const { data: landlordRow, error: landlordRowError } = await supabase
        .from('landlords')
        .select('id')
        .eq('customer_id', customerData.id)
        .single();

      if (landlordRowError || !landlordRow) {
        console.error('Landlord profile not found:', landlordRowError);
        alert('Landlord profile not found. Please complete your onboarding.');
        setIsSubmitting(false);
        return;
      }

      const landlordId = landlordRow.id;
      
      // Extract form data
      const propertyData = {
        landlord_id: landlordId,
        address_line_1: formData.get('address_line_1') as string,
        address_line_2: formData.get('address_line_2') as string || null,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip_code: formData.get('zip_code') as string,
        property_type: formData.get('property_type') as string || 'apartment',
        bedrooms: parseInt(formData.get('bedrooms') as string),
        bathrooms: parseFloat(formData.get('bathrooms') as string),
        square_footage: parseInt(formData.get('square_footage') as string),
        description: formData.get('description') as string || null,
        year_built: formData.get('year_built') ? parseInt(formData.get('year_built') as string) : null,
      };

      // Insert the property
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select();

      if (error) {
        console.error('Error creating property:', error);
        alert('Error creating property. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Property created successfully:', data);
      
      // Client-side redirect - much more reliable
      router.push(`/sell/create/rent-details?property_id=${data[0].id}`);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-28 pb-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Property Information</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Save and Exit
          </button>
        </div>

        {/* Progress Bar */}
        <InteractiveProgressBar currentStep={0} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Basic Details */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Basic Details</h2>
              
              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  name="property_type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                  required
                  disabled={isSubmitting}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="studio">Studio</option>
                  <option value="room">Room</option>
                  <option value="duplex">Duplex</option>
                </select>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="address_line_1"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                  placeholder="Enter street address"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address_line_2"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                  placeholder="Apt, suite, etc. (optional)"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                    placeholder="Enter city"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                    placeholder="State"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip_code"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                  placeholder="Enter ZIP code"
                  required
                  disabled={isSubmitting}
                />
              </div>
            
            {/* Beds */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beds
              </label>
              <div className="relative">
                <select
                    name="bedrooms"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                    required
                    disabled={isSubmitting}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <div className="relative">
                <select
                    name="bathrooms"
                  value={baths}
                  onChange={(e) => setBaths(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                    required
                    disabled={isSubmitting}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Square Footage */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage
              </label>
              <input
                type="number"
                  name="square_footage"
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                placeholder="Enter square footage"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Year Built */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built (Optional)
                </label>
                <input
                  type="number"
                  name="year_built"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                  placeholder="Enter year built"
                  disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Right Column - Property Description */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Describe Your Property</h2>
            <p className="text-gray-600 mb-4">What makes your place unique?</p>
            <textarea
                name="description"
              className="w-full h-[250px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
              placeholder="Describe your property..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-8">
          <button 
              type="submit"
              disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? 'Creating Property...' : 'Next'}
          </button>
        </div>
        </form>
      </div>
    </main>
  );
}