'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InteractiveProgressBar from '@/src/components/ui/InteractiveProgressBar';

export default function FinalDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('property_id');
  const [leasePolicy, setLeasePolicy] = useState('');
  const [rentersInsurance, setRentersInsurance] = useState<'Yes' | 'No' | ''>('');

  return (
    <main className="min-h-screen bg-white pt-28 pb-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Final Details</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Save and Exit
          </button>
        </div>

        {/* Progress Bar */}
        <InteractiveProgressBar currentStep={6} propertyId={propertyId} />

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">What should renters know about the lease</h2>
          <p className="text-gray-600 mb-8 text-center">Describe your extra policies</p>

          {/* Lease Policy Description */}
          <div className="mb-12">
            <textarea
              value={leasePolicy}
              onChange={(e) => setLeasePolicy(e.target.value)}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-blue-50"
              placeholder="Enter your lease policies and any additional information renters should know..."
            />
          </div>

          {/* Renters Insurance Required */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4 text-center">Renters Insurance Required</h3>
            <div className="flex justify-center gap-8">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="insurance"
                  value="Yes"
                  checked={rentersInsurance === 'Yes'}
                  onChange={(e) => setRentersInsurance(e.target.value as 'Yes')}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="insurance"
                  value="No"
                  checked={rentersInsurance === 'No'}
                  onChange={(e) => setRentersInsurance(e.target.value as 'No')}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.push(`/sell/create/costs-and-fees?property_id=${propertyId}`)}
              className="px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
            >
              <span className="mr-2">←</span>
              Back
            </button>
            <button 
              onClick={() => router.push(`/sell/create/review?property_id=${propertyId}`)}
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
