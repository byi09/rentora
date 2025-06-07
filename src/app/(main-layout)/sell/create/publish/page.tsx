'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PublishPage() {
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

  const buildingAmenities = [
    { category: 'Other', items: ['Laundry: Shared'] },
    { category: 'Security', items: ['Controlled Access'] },
    { category: 'Services & facilities', items: [
      'Bicycle Storage',
      'Online Maintenance Portal',
      'Online Rent Payment'
    ]}
  ];

  const unitFeatures = [
    { 
      category: 'Appliances',
      items: [
        'Microwave Oven',
        'Oven',
        'Range',
        'Refrigerator'
      ]
    },
    {
      category: 'Flooring',
      items: [
        'Hardwood',
        'Tile'
      ]
    },
    {
      category: 'Heating',
      items: [
        'Gas'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Publish Listing</h1>
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
            <div className="h-full w-full bg-blue-600 rounded-full"></div>
          </div>
          <div className="flex justify-between absolute w-full" style={{ top: '-8px' }}>
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`w-4 h-4 rounded-full ${index <= 8 ? 'bg-blue-600' : 'bg-blue-200'}`}
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
          {/* What's Unique Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">What's Unique</h2>
            <p className="text-lg mb-2">Spacious Student Housing Available - Prime Location in Berkeley!</p>
            <p className="text-gray-600 mb-2">2317 Hearst Ave (Between Scenic Ave & Le Conte Ave)</p>
            <p className="text-gray-600 mb-2">Large 1BR/1BA: $2,595/month</p>
            <p className="text-gray-600 mb-4">Available from July 1st or August 1st</p>
            <button className="text-blue-600 font-medium">See more</button>
          </section>

          {/* Listed by Management Company */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Listed by Management Company</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-2xl">D</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Domingo Properties</h3>
                <p className="text-gray-600">310-259-6251</p>
              </div>
            </div>
          </section>

          {/* Facts, Features, and Properties */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">Facts, Features, and Properties</h2>
            
            {/* Building Amenities */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-3">Building Amenities</h3>
              {buildingAmenities.map((category) => (
                <div key={category.category} className="mb-4">
                  <p className="text-gray-600 mb-2">{category.category}</p>
                  <ul className="list-disc pl-8">
                    {category.items.map((item) => (
                      <li key={item} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Unit Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-3">Unit Features</h3>
              {unitFeatures.map((category) => (
                <div key={category.category} className="mb-4">
                  <p className="text-gray-600 mb-2">{category.category}</p>
                  <ul className="list-disc pl-8">
                    {category.items.map((item) => (
                      <li key={item} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation Buttons */}
          <div className="flex justify-end items-center gap-4 mt-12">
            <button 
              onClick={() => router.push('/sell/create/review')}
              className="px-8 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Go Back
            </button>
            <button 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publish Listing
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
