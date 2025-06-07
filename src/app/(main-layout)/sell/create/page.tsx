'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateListingPage() {
  const router = useRouter();
  const [beds, setBeds] = useState('1');
  const [baths, setBaths] = useState('1');
  const [squareFootage, setSquareFootage] = useState('1500');

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
          <h1 className="text-2xl font-semibold">Property Information</h1>
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
            <div className="h-full w-1/9 bg-blue-600 rounded-full"></div>
          </div>
          <div className="flex justify-between absolute w-full" style={{ top: '-8px' }}>
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-blue-200'}`}
              >
                <div className="text-xs text-gray-600 mt-6 -ml-4 w-20 text-center">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Basic Details */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Basic Details</h2>
            
            {/* Beds */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beds
              </label>
              <div className="relative">
                <select
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
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
                  value={baths}
                  onChange={(e) => setBaths(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
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
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-blue-50"
                placeholder="Enter square footage"
              />
            </div>
          </div>

          {/* Right Column - Property Description */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Describe Your Property</h2>
            <p className="text-gray-600 mb-4">What makes your place unique?</p>
            <textarea
              className="w-full h-[250px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
              placeholder="Describe your property..."
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-8">
          <button 
            onClick={() => router.push('/sell/create/rent-details')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}