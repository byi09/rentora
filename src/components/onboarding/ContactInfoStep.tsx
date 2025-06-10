import React, { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';

const ContactInfoStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [phone, setPhone] = useState(data.phoneNumber ?? '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!phone.trim()) {
      setError('Phone number required');
      return;
    }
    onUpdate({ phoneNumber: phone });
    onNext?.();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center">Contact info</h3>
      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input id="phone" value={phone} onChange={e=>{setPhone(e.target.value); setError('')}} placeholder="555-123-4567" />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};
export default ContactInfoStep; 