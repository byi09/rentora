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
    <div className="space-y-4 lg:space-y-5 max-w-lg mx-auto">
      <div className="text-center mb-4 lg:mb-5">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">Contact Information</h3>
        <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
          Add your phone number to receive SMS notifications (optional)
        </p>
      </div>

      <div className="space-y-3 lg:space-y-4">
        <div>
          <Label htmlFor="phone" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
            Phone Number (Optional)
          </Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={e => {setPhone(e.target.value); setError('')}} 
            placeholder="(555) 123-4567" 
            className="h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
          {error && <p className="text-xs lg:text-sm text-red-500 mt-1.5">{error}</p>}
        </div>

        <div className="bg-blue-50/80 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-blue-100">
          <div className="flex items-start gap-2 lg:gap-3">
            <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs lg:text-sm font-bold">i</span>
            </div>
            <div>
              <h4 className="text-xs lg:text-sm font-semibold text-blue-900 mb-1">Why do we ask for your phone?</h4>
              <ul className="text-xs lg:text-sm text-blue-800 space-y-0.5 leading-relaxed">
                <li>• Get instant SMS alerts for new property matches</li>
                <li>• Receive important updates about saved properties</li>
                <li>• Quick communication with landlords and tenants</li>
                <li>• Enhanced account security (optional 2FA)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 lg:pt-5">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="h-9 md:h-10 lg:h-11 px-4 lg:px-6 text-sm lg:text-base font-medium rounded-lg border-2 hover:bg-gray-50 transition-all duration-200"
        >
          <span className="mr-2">←</span>
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="h-9 md:h-10 lg:h-11 px-6 lg:px-8 text-sm lg:text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};
export default ContactInfoStep; 