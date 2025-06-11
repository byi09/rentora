import React, { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';

const LocationInfoStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  // Current location state
  const [currentCity, setCurrentCity] = useState(data.currentCity ?? '');
  const [currentState, setCurrentState] = useState(data.currentState ?? '');
  const [currentZipCode, setCurrentZipCode] = useState(data.currentZipCode ?? '');
  
  // Interest location state
  const [interestCity, setInterestCity] = useState(data.interestCity ?? '');
  const [interestState, setInterestState] = useState(data.interestState ?? '');
  const [interestZipCode, setInterestZipCode] = useState(data.interestZipCode ?? '');

  const handleNext = () => {
    const updateData = { 
      currentCity, 
      currentState, 
      currentZipCode,
      interestCity,
      interestState,
      interestZipCode,
      // Keep legacy fields for backward compatibility
      currentLocation: `${currentCity}, ${currentState} ${currentZipCode}`.trim(),
      locationOfInterest: `${interestCity}, ${interestState} ${interestZipCode}`.trim()
    };
    
    console.log('🏠 LocationInfoStep sending data:', JSON.stringify(updateData, null, 2));
    onUpdate(updateData);
    onNext?.();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Location Preferences</h3>
        <p className="text-sm text-gray-600">Help us connect you with properties in the right areas</p>
      </div>

      {/* Current Location Section */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Current Location (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="currentCity">City</Label>
              <Input 
                id="currentCity" 
                placeholder="San Francisco" 
                value={currentCity} 
                onChange={e => setCurrentCity(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="currentState">State</Label>
              <Input 
                id="currentState" 
                placeholder="CA" 
                value={currentState} 
                onChange={e => setCurrentState(e.target.value)}
                maxLength={2}
              />
            </div>
            <div>
              <Label htmlFor="currentZip">ZIP Code</Label>
              <Input 
                id="currentZip" 
                placeholder="94102" 
                value={currentZipCode} 
                onChange={e => setCurrentZipCode(e.target.value)}
                maxLength={10}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interest Location Section */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Location of Interest (Optional)</h4>
          <p className="text-sm text-gray-600 mb-3">Where are you looking for properties?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="interestCity">City</Label>
              <Input 
                id="interestCity" 
                placeholder="Los Angeles" 
                value={interestCity} 
                onChange={e => setInterestCity(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="interestState">State</Label>
              <Input 
                id="interestState" 
                placeholder="CA" 
                value={interestState} 
                onChange={e => setInterestState(e.target.value)}
                maxLength={2}
              />
            </div>
            <div>
              <Label htmlFor="interestZip">ZIP Code</Label>
              <Input 
                id="interestZip" 
                placeholder="90210" 
                value={interestZipCode} 
                onChange={e => setInterestZipCode(e.target.value)}
                maxLength={10}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
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