'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface PropertyListing {
  id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  listing_title?: string;
  monthly_rent?: number;
  listing_status?: string;
  listing_created?: string;
  square_footage?: number;
}

export default function PropertyDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const supabase = createClient();
      
      // Get the authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setError('Please sign in to view your properties');
        setIsLoading(false);
        return;
      }

      // Get the landlord_id by joining users -> customers -> landlords
      const { data: landlordData, error: landlordError } = await supabase
        .from('users')
        .select(`
          customers!inner(
            landlords!inner(
              id
            )
          )
        `)
        .eq('id', user.id)
        .single();

      if (landlordError || !landlordData?.customers?.[0]?.landlords?.[0]?.id) {
        setError('Landlord profile not found. Please complete your onboarding.');
        setIsLoading(false);
        return;
      }

      const landlordId = landlordData.customers[0].landlords[0].id;

      const {error } = await supabase
        .from('properties')
        .select(`
          id,
          address_line_1,
          address_line_2,
          city,
          state,
          property_type,
          bedrooms,
          bathrooms,
          square_footage,
          property_listings!inner(
            listing_title,
            monthly_rent,
            listing_status,
            created_at
          )
        `)
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Failed to fetch properties');
        console.error('Error fetching properties:', error);
        return;
      }

      // Also fetch properties without listings
      const { data: allProperties, error: allError } = await supabase
        .from('properties')
        .select(`
          id,
          address_line_1,
          address_line_2,
          city,
          state,
          property_type,
          bedrooms,
          bathrooms,
          square_footage,
          created_at,
          property_listings(
            listing_title,
            monthly_rent,
            listing_status,
            created_at
          )
        `)
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });

      if (allError) {
        setError('Failed to fetch properties');
        console.error('Error fetching all properties:', allError);
        return;
      }

      // Transform data to flat structure
      const formattedProperties = allProperties?.map(property => ({
        id: property.id,
        address_line_1: property.address_line_1,
        address_line_2: property.address_line_2,
        city: property.city,
        state: property.state,
        property_type: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_footage: property.square_footage,
        listing_title: property.property_listings?.[0]?.listing_title,
        monthly_rent: property.property_listings?.[0]?.monthly_rent,
        listing_status: property.property_listings?.[0]?.listing_status,
        listing_created: property.property_listings?.[0]?.created_at,
      })) || [];

      setProperties(formattedProperties);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (property: PropertyListing) => {
    return `${property.address_line_1}${property.address_line_2 ? `, ${property.address_line_2}` : ''}, ${property.city}, ${property.state}`;
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Draft
        </span>
      );
    }

    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchProperties}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Property Listings</h1>
          <p className="mt-2 text-gray-600">Manage your rental properties and listings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{properties.length}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                    <dd className="text-lg font-medium text-gray-900">{properties.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {properties.filter(p => p.listing_status === 'active').length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Listings</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {properties.filter(p => p.listing_status === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {properties.filter(p => !p.listing_status || p.listing_status !== 'active').length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Draft Listings</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {properties.filter(p => !p.listing_status || p.listing_status !== 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Properties</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Click on a property to edit or continue setting it up
            </p>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-16-4c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first property listing.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {properties.map((property) => (
                <li key={property.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                  // If the property has a listing, go to edit mode, otherwise continue creation
                  if (property.listing_status) {
                    // TODO: Navigate to edit/view page
                    console.log('Edit property', property.id);
                  } else {
                    // Continue creation flow
                    router.push(`/sell/create/rent-details?property_id=${property.id}`);
                  }
                }}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {property.bedrooms}BR
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {property.listing_title || formatAddress(property)}
                            </p>
                            <div className="ml-2">
                              {getStatusBadge(property.listing_status)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatAddress(property)} • {property.bedrooms} bed, {property.bathrooms} bath
                            {property.square_footage && ` • ${property.square_footage} sq ft`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(property.monthly_rent)}/month
                          </p>
                          {property.listing_created && (
                            <p className="text-sm text-gray-500">
                              Listed {new Date(property.listing_created).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create New Listing Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/sell/create')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Property Listing
          </button>
        </div>
      </div>
    </main>
  );
} 