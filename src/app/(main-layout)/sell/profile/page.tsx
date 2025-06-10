'use client';
import { useState, useEffect } from 'react';
import { updateLandlordProfile, checkLandlordSetup } from '@/utils/supabase/actions';

export default function LandlordProfilePage() {
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [acceptsPets, setAcceptsPets] = useState(false);
  const [allowsSmoking, setAllowsSmoking] = useState(false);
  const [minCreditScore, setMinCreditScore] = useState('');
  const [minIncomeMultiplier, setMinIncomeMultiplier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData();
    formData.append('business_name', businessName);
    formData.append('business_phone', businessPhone);
    formData.append('business_email', businessEmail);
    formData.append('accepts_pets', acceptsPets.toString());
    formData.append('allows_smoking', allowsSmoking.toString());
    formData.append('minimum_credit_score', minCreditScore);
    formData.append('minimum_income_multiplier', minIncomeMultiplier);

    try {
      const result = await updateLandlordProfile(formData);
      if (result.success) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Error updating profile. Please try again.');
      }
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Landlord Profile</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name (Optional)
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Phone
            </label>
            <input
              type="tel"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Business phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Email
            </label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Business email address"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="accepts_pets"
                checked={acceptsPets}
                onChange={(e) => setAcceptsPets(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="accepts_pets" className="ml-2 block text-sm text-gray-900">
                Accept pets
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allows_smoking"
                checked={allowsSmoking}
                onChange={(e) => setAllowsSmoking(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allows_smoking" className="ml-2 block text-sm text-gray-900">
                Allow smoking
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Credit Score
            </label>
            <input
              type="number"
              value={minCreditScore}
              onChange={(e) => setMinCreditScore(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 650"
              min="300"
              max="850"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Income Multiplier
            </label>
            <input
              type="number"
              step="0.1"
              value={minIncomeMultiplier}
              onChange={(e) => setMinIncomeMultiplier(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2.5 (2.5x rent)"
              min="1"
              max="10"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </main>
  );
} 