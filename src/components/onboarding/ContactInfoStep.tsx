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
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center">Contact Information</h3>
      <div>
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input id="phone" value={phone} onChange={e=>{setPhone(e.target.value); setError('')}} placeholder="555-123-4567" />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium mb-2">Why we ask for your phone number</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Quick communication with property managers</li>
          <li>Emergency contact for property issues</li>
          <li>SMS notifications for important updates</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};
export default ContactInfoStep; 