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
    
    console.log('LocationInfoStep sending data:', JSON.stringify(updateData, null, 2));
    onUpdate(updateData);
    onNext?.();
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="text-center mb-5 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 lg:mb-3">Location Preferences</h3>
        <p className="text-sm lg:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
          Help us connect you with properties in the right areas and personalize your experience
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-5 lg:space-y-6">
        {/* Current Location Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 lg:p-5 border border-gray-100 shadow-sm">
          <div className="mb-4 lg:mb-5">
            <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-1">Current Location</h4>
            <p className="text-xs lg:text-sm text-gray-600">Where are you currently living? (Optional)</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
            <div>
              <Label htmlFor="currentCity" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
                City
              </Label>
              <Input 
                id="currentCity" 
                placeholder="San Francisco" 
                value={currentCity} 
                onChange={e => setCurrentCity(e.target.value)}
                className="h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="currentState" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
                State
              </Label>
              <Input 
                id="currentState" 
                placeholder="CA" 
                value={currentState} 
                onChange={e => setCurrentState(e.target.value)}
                maxLength={2}
                className="h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="currentZipCode" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
                Zip Code
              </Label>
              <Input 
                id="currentZipCode" 
                placeholder="94102" 
                value={currentZipCode} 
                onChange={e => setCurrentZipCode(e.target.value)}
                maxLength={5}
                className="h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Interest Location Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 lg:p-5 border border-gray-100 shadow-sm">
          <div className="mb-4 lg:mb-5">
            <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-1">Location of Interest</h4>
            <p className="text-xs lg:text-sm text-gray-600">Where are you looking to rent or lease properties?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
            <div>
              <Label htmlFor="interestCity" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
                City
              </Label>
              <Input 
                id="interestCity" 
                placeholder="Los Angeles" 
                value={interestCity} 
                onChange={e => setInterestCity(e.target.value)}
                className="h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="interestState" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
                State
              </Label>
              <Input 
                id="interestState" 
                placeholder="CA" 
                value={interestState} 
                onChange={e => setInterestState(e.target.value)}
                maxLength={2}
                className="h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="interestZipCode" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
                Zip Code
              </Label>
              <Input 
                id="interestZipCode" 
                placeholder="90210" 
                value={interestZipCode} 
                onChange={e => setInterestZipCode(e.target.value)}
                maxLength={5}
                className="h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 lg:pt-5 max-w-lg mx-auto">
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
          className="h-9 md:h-10 lg:h-11 px-6 lg:px-8 text-sm lg:text-base font-bold rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Finish Setup
          <span className="ml-2">✓</span>
        </Button>
      </div>
    </div>
  );
};

export default LocationInfoStep; 