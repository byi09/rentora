import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';

const OPTIONS: Array<{ value: 'renter' | 'landlord' | 'both'; title: string; desc: string }> = [
  { value: 'renter', title: 'Renter', desc: 'Looking for properties to rent' },
  { value: 'landlord', title: 'Landlord', desc: 'Have properties to lease' },
  { value: 'both', title: 'Both', desc: 'Both renting and leasing properties' },
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
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">What brings you here?</h3>
        <p className="text-sm text-gray-600">Help us customize your experience</p>
      </div>

      <div>
        <p className="font-medium mb-2">I am a: <span className="text-red-600">*</span></p>
        <div className="space-y-3">
          {OPTIONS.map(o => (
            <label
              key={o.value}
              className={`flex items-center border rounded-lg p-3 cursor-pointer transition-colors ${type === o.value ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            >
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600 mr-3"
                checked={type === o.value}
                onChange={() => { setType(o.value); setErr(''); }}
              />
              <div>
                <p className="font-medium text-gray-900">{o.title}</p>
                <p className="text-sm text-gray-600">{o.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {err && <p className="text-sm text-red-500 mt-1">{err}</p>}
      </div>

      <div>
        <label htmlFor="gender" className="block font-medium text-sm mb-1">Gender (Optional)</label>
        <select
          id="gender"
          value={gender}
          onChange={e => setGender(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {GENDERS.map(g => (
            <option key={g} value={g}>{g === '' ? 'Select gender' : g}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};

export default UserTypeStep;