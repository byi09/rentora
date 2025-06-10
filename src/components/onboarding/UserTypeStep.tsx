import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';

const UserTypeStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [type, setType] = useState<'renter' | 'landlord' | ''>(data.userType as any || '');
  const [err,setErr] = useState('');

  const handleNext = () => {
    if (!type) {setErr('Select one'); return;}
    onUpdate({ userType: type });
    onNext?.();
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="text-lg font-medium">What best describes you?</h3>
      <div className="flex justify-center gap-4">
        <Button variant={type==='renter'?'default':'outline'} onClick={()=>{setType('renter');setErr('')}}>Renter</Button>
        <Button variant={type==='landlord'?'default':'outline'} onClick={()=>{setType('landlord');setErr('')}}>Landlord</Button>
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>Previous</Button>
        <Button onClick={handleNext}>Finish</Button>
      </div>
    </div>
  );
};
export default UserTypeStep;