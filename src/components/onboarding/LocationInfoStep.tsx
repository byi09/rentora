import React, { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';

const LocationInfoStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [currentLocation, setCurrentLocation] = useState(data.currentLocation ?? '');
  const [interestLocation, setInterestLocation] = useState(data.locationOfInterest ?? '');

  const handleNext = () => {
    onUpdate({ currentLocation, locationOfInterest: interestLocation });
    onNext?.();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center">Location Preferences</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="currentLoc">Current Location (Optional)</Label>
          <Input id="currentLoc" placeholder="City, State or ZIP code" value={currentLocation} onChange={e=>setCurrentLocation(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="interestLoc">Location of Interest (Optional)</Label>
          <Input id="interestLoc" placeholder="City, State or ZIP code" value={interestLocation} onChange={e=>setInterestLocation(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
        🎉 <strong>Almost done!</strong><br />
        You're all set! Click "Complete Setup" to start exploring properties and connecting with others.
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>Previous</Button>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleNext}>Complete&nbsp;Setup</Button>
      </div>
    </div>
  );
};
export default LocationInfoStep; 