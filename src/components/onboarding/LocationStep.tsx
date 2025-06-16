import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { MapPin } from 'lucide-react';
import { StepProps } from '@/src/types/onboarding';

const LocationStep: React.FC<StepProps> = ({ data, onUpdate, onComplete, onPrevious }) => {
  const [formData, setFormData] = useState({
    currentLocation: data.currentLocation,
    locationOfInterest: data.locationOfInterest
  });

  const handleComplete = () => {
    onUpdate(formData);
    onComplete?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Location Preferences</h3>
        <p className="text-sm text-gray-600">Help us show you relevant properties</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="currentLocation">Current Location (Optional)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="currentLocation"
              value={formData.currentLocation}
              onChange={(e) => handleInputChange('currentLocation', e.target.value)}
              placeholder="City, State or ZIP code"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Where are you currently located?
          </p>
        </div>

        <div>
          <Label htmlFor="locationOfInterest">Location of Interest (Optional)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="locationOfInterest"
              value={formData.locationOfInterest}
              onChange={(e) => handleInputChange('locationOfInterest', e.target.value)}
              placeholder="City, State or ZIP code"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Where are you looking for properties?
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Almost done!</h4>
          <p className="text-sm text-green-800">
            You&apos;re all set! Click &quot;Complete Setup&quot; to start exploring properties and connecting with others.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleComplete} className="px-8 bg-green-600 hover:bg-green-700">
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;
