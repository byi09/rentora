import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';

const OPTIONS: Array<{ value: 'renter' | 'landlord' | 'both'; title: string; desc: string; gradient: string }> = [
  { 
    value: 'renter', 
    title: 'Renter', 
    desc: 'Looking for the perfect place to call home', 
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    value: 'landlord', 
    title: 'Landlord', 
    desc: 'Have properties to lease and manage', 
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    value: 'both', 
    title: 'Both', 
    desc: 'Renting and leasing properties', 
    gradient: 'from-purple-500 to-pink-500'
  },
];

const GENDERS = ['', 'Male', 'Female', 'Other', 'Prefer not to say'];

const UserTypeStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [type, setType] = useState<'renter' | 'landlord' | 'both' | ''>(data.userType as any || '');
  const [gender, setGender] = useState<string>(data.gender || '');
  const [err, setErr] = useState('');

  const handleNext = () => {
    if (!type) { setErr('Please select an option'); return; }
    // Map "both" to "renter" as primary role (backend creates both roles anyway)
    const userType = type === 'both' ? 'renter' : type;
    onUpdate({ userType, gender });
    onNext?.();
  };

  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="text-center mb-8 lg:mb-12">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">What brings you here?</h3>
        <p className="text-base lg:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          Help us customize your experience and show you what matters most
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-lg lg:text-xl font-semibold mb-6 lg:mb-8 text-center text-gray-800">
          I am a: <span className="text-red-500">*</span>
        </p>
        <div className="space-y-4 lg:space-y-6">
          {OPTIONS.map(o => (
            <label
              key={o.value}
              className={`group flex items-center border-2 rounded-2xl p-6 lg:p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                type === o.value 
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg ring-4 ring-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={type === o.value}
                onChange={() => { setType(o.value); setErr(''); }}
              />
              <div className="flex-1">
                <p className="text-lg lg:text-xl font-semibold text-gray-900 mb-1 lg:mb-2">{o.title}</p>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{o.desc}</p>
              </div>
              <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                type === o.value 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 group-hover:border-gray-400'
              }`}>
                {type === o.value && (
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full"></div>
                )}
              </div>
            </label>
          ))}
        </div>
        {err && (
          <p className="text-sm lg:text-base text-red-500 mt-4 flex items-center justify-center">
            <span className="mr-2">⚠</span>
            {err}
          </p>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <label htmlFor="gender" className="block text-base lg:text-lg font-medium text-gray-700 mb-3 lg:mb-4">
          Gender (Optional)
        </label>
        <div className="relative">
          <select
            id="gender"
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white appearance-none cursor-pointer"
          >
            {GENDERS.map(g => (
              <option key={g} value={g}>{g === '' ? 'Select gender' : g}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 lg:pt-12 max-w-md mx-auto">
        {onPrevious ? (
          <Button 
            variant="outline" 
            onClick={onPrevious}
            className="h-12 lg:h-14 px-6 lg:px-8 text-base lg:text-lg font-medium rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
          >
            <span className="mr-2">←</span>
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        <Button 
          onClick={handleNext}
          className="h-12 lg:h-14 px-8 lg:px-12 text-base lg:text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default UserTypeStep;