'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewPage() {
  const router = useRouter();

  const steps = [
    'Property Info',
    'Rent Details',
    'Media',
    'Amenities',
    'Screening',
    'Costs and Fees',
    'Final details',
    'Review',
    'Publish'
  ];

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Review Listing</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Save and Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="h-2 bg-blue-100 rounded-full">
            <div className="h-full w-8/9 bg-blue-600 rounded-full"></div>
          </div>
          <div className="flex justify-between absolute w-full" style={{ top: '-8px' }}>
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`w-4 h-4 rounded-full ${index <= 7 ? 'bg-blue-600' : 'bg-blue-200'}`}
              >
                <div className="text-xs text-gray-600 mt-6 -ml-4 w-20 text-center">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Property Summary */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">1111 Address Ave</h2>
            <p className="text-gray-600 mb-1">94709 Berkeley California</p>
            <p className="text-gray-600">$1500 /mo | 2 Bd | 2 Ba | 800 sqft</p>
          </div>

          {/* Section Navigation */}
          <div>
            <h3 className="text-2xl font-bold mb-8">Return to any previous sections</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href="/sell/create"
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-center font-semibold"
              >
                Property Info
              </Link>
              <Link 
                href="/sell/create/rent-details"
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-center font-semibold"
              >
                Rent Details
              </Link>
              <Link 
                href="/sell/create/media"
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-center font-semibold"
              >
                Media
              </Link>
              <Link 
                href="/sell/create/amenities"
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-center font-semibold"
              >
                Amenities
              </Link>
              <Link 
                href="/sell/create/screening"
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-center font-semibold"
              >
                Screening
              </Link>
              <Link 
                href="/sell/create/costs-and-fees"
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-center font-semibold"
              >
                Costs and Fees
              </Link>
              <Link 
                href="/sell/create/final-details"
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-center font-semibold"
              >
                Final Details
              </Link>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end mt-12">
            <button 
              onClick={() => router.push('/sell/create/publish')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
