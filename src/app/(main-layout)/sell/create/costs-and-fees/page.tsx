'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InteractiveProgressBar from '@/src/components/ui/InteractiveProgressBar';

export default function CostsAndFeesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('property_id');
  const [administrativeFee, setAdministrativeFee] = useState('850');
  const [parkingFee, setParkingFee] = useState('850');
  const [utilitiesFee, setUtilitiesFee] = useState('850');
  const [otherFee, setOtherFee] = useState('850');

  return (
    <main className="min-h-screen bg-white pt-28 pb-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Costs and Fees</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Save and Exit
          </button>
        </div>

        {/* Progress Bar */}
        <InteractiveProgressBar currentStep={5} propertyId={propertyId} />

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">Additional Fees</h2>

          {/* Administrative Fee */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3">
              Administrative
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={administrativeFee}
                onChange={(e) => setAdministrativeFee(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-blue-50"
                placeholder="Enter administrative fee"
              />
            </div>
          </div>

          {/* Parking Fee */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3">
              Parking
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={parkingFee}
                onChange={(e) => setParkingFee(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-blue-50"
                placeholder="Enter parking fee"
              />
            </div>
          </div>

          {/* Utilities Fee */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3">
              Utilities
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={utilitiesFee}
                onChange={(e) => setUtilitiesFee(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-blue-50"
                placeholder="Enter utilities fee"
              />
            </div>
          </div>

          {/* Other Fee */}
          <div className="mb-12">
            <label className="block text-lg font-semibold mb-3">
              Other
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={otherFee}
                onChange={(e) => setOtherFee(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-blue-50"
                placeholder="Enter other fees"
              />
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => router.push(`/sell/create/final-details?property_id=${propertyId}`)}
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

export const dynamic = 'force-dynamic';
