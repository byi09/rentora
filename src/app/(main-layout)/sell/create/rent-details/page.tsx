'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RentDetailsPage() {
  const router = useRouter();
  const [rent, setRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');

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
          <h1 className="text-2xl font-semibold">Rent Details</h1>
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
            <div className="h-full w-2/9 bg-blue-600 rounded-full"></div>
          </div>
          <div className="flex justify-between absolute w-full" style={{ top: '-8px' }}>
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`w-4 h-4 rounded-full ${index <= 1 ? 'bg-blue-600' : 'bg-blue-200'}`}
              >
                <div className="text-xs text-gray-600 mt-6 -ml-4 w-20 text-center">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">How Much is the Rent and Security Deposit?</h2>
          
          {/* Rent Input */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Rent
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white"
                placeholder="Enter monthly rent"
              />
            </div>
          </div>

          {/* Security Deposit Input */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Security Deposit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white"
                placeholder="Enter security deposit amount"
              />
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-12">
          <button 
            onClick={() => router.push('/sell/create/media')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
