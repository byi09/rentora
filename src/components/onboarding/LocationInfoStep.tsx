import React, { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';

const LocationInfoStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [city, setCity] = useState(data.currentCity ?? '');
  const [state, setState] = useState(data.currentState ?? '');
  const [zip, setZip] = useState(data.currentZipCode ?? '');
  const [err, setErr] = useState('');

  const handleNext = () => {
    if (!city || !state || !zip) {
      setErr('All fields required');
      return;
    }
    onUpdate({ currentCity: city, currentState: state, currentZipCode: zip });
    onNext?.();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center">Location</h3>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input id="city" value={city} onChange={e=>{setCity(e.target.value); setErr('')}} />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input id="state" value={state} onChange={e=>{setState(e.target.value); setErr('')}} />
        </div>
        <div>
          <Label htmlFor="zip">Zip *</Label>
          <Input id="zip" value={zip} onChange={e=>{setZip(e.target.value); setErr('')}} />
        </div>
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};
export default LocationInfoStep; 