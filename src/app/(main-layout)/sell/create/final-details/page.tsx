'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FinalDetailsPage() {
  const router = useRouter();
  const [leasePolicy, setLeasePolicy] = useState('');
  const [rentersInsurance, setRentersInsurance] = useState<'Yes' | 'No' | ''>('');

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
          <h1 className="text-2xl font-semibold">Final Details</h1>
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
            <div className="h-full w-7/9 bg-blue-600 rounded-full"></div>
          </div>
          <div className="flex justify-between absolute w-full" style={{ top: '-8px' }}>
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`w-4 h-4 rounded-full ${index <= 6 ? 'bg-blue-600' : 'bg-blue-200'}`}
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

          {/* Next Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => router.push('/sell/create/review')}
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
