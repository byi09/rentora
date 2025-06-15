import React, { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';

const ContactInfoStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [phone, setPhone] = useState(data.phoneNumber ?? '');
  const [error, setError] = useState('');

  const handleNext = () => {
    // optional phone
    onUpdate({ phoneNumber: phone.trim() });
    onNext?.();
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4 lg:space-y-6">
        <div>
          <Label htmlFor="phone" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
            Phone Number (Optional)
          </Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={e => {setPhone(e.target.value); setError('')}} 
            placeholder="(555) 123-4567" 
            className="h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
          />
          {error && <p className="text-sm lg:text-base text-red-500 mt-2">{error}</p>}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 lg:p-8">
          <h4 className="text-lg lg:text-xl font-semibold text-blue-900 mb-3 lg:mb-4">
            Stay Connected
          </h4>
          <p className="text-sm lg:text-base text-blue-800 mb-4 leading-relaxed">
            Adding your phone number helps us provide a better experience:
          </p>
          <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base text-blue-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Direct communication with property managers and landlords</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Instant SMS alerts for new property matches</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Emergency contact for urgent property matters</span>
            </li>
          </ul>
          <p className="text-xs lg:text-sm text-blue-600 mt-4 italic">
            Don't worry - you can always update this later in your profile settings.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 lg:pt-8 max-w-md mx-auto">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="h-12 lg:h-14 px-6 lg:px-8 text-base lg:text-lg font-medium rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
        >
          <span className="mr-2">←</span>
          Back
        </Button>
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
export default ContactInfoStep; 