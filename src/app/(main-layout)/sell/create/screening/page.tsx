'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InteractiveProgressBar from '@/src/components/ui/InteractiveProgressBar';

export default function ScreeningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('property_id');
  const [incomeRatio, setIncomeRatio] = useState('1.5X');
  const [creditScore, setCreditScore] = useState('850');

  const incomeRatioOptions = ['1.5X', '2X', '2.5X', '3X'];

  return (
    <main className="min-h-screen bg-white pt-28 pb-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Screening Requirements</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Save and Exit
          </button>
        </div>

        {/* Progress Bar */}
        <InteractiveProgressBar currentStep={4} propertyId={propertyId} />

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">What Do You Expect From Renters?</h2>

          {/* Income to Rent Ratio */}
          <div className="mb-12">
            <label className="block text-lg font-semibold mb-3">
              Income to Rent Ratio
            </label>
            <div className="relative">
              <select
                value={incomeRatio}
                onChange={(e) => setIncomeRatio(e.target.value)}
                className="block w-48 pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-blue-50 appearance-none"
              >
                {incomeRatioOptions.map((ratio) => (
                  <option key={ratio} value={ratio}>
                    {ratio}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Credit Score */}
          <div className="mb-12">
            <label className="block text-lg font-semibold mb-3">
              Credit Score
            </label>
            <input
              type="number"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              min="300"
              max="850"
              className="block w-48 pl-4 pr-4 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-blue-50"
              placeholder="Enter minimum credit score"
            />
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => router.push(`/sell/create/costs-and-fees?property_id=${propertyId}`)}
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
