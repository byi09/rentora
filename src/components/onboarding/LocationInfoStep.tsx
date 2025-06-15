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
    <div className="space-y-8 lg:space-y-12">
      <div className="text-center mb-8 lg:mb-12">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">Location Preferences</h3>
        <p className="text-base lg:text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
          Help us connect you with properties in the right areas and personalize your experience
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
        {/* Current Location Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm">
          <div className="mb-6 lg:mb-8">
            <h4 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1">Current Location</h4>
            <p className="text-sm lg:text-base text-gray-600">Where are you currently living? (Optional)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div>
              <Label htmlFor="currentCity" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
                City
              </Label>
              <Input 
                id="currentCity" 
                placeholder="San Francisco" 
                value={currentCity} 
                onChange={e => setCurrentCity(e.target.value)}
                className="h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="currentState" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
                State
              </Label>
              <Input 
                id="currentState" 
                placeholder="CA" 
                value={currentState} 
                onChange={e => setCurrentState(e.target.value)}
                maxLength={2}
                className="h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="currentZip" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
                ZIP Code
              </Label>
              <Input 
                id="currentZip" 
                placeholder="94102" 
                value={currentZipCode} 
                onChange={e => setCurrentZipCode(e.target.value)}
                maxLength={10}
                className="h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Interest Location Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm">
          <div className="mb-6 lg:mb-8">
            <h4 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1">Location of Interest</h4>
            <p className="text-sm lg:text-base text-gray-600">Where are you looking for properties? (Optional)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div>
              <Label htmlFor="interestCity" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
                City
              </Label>
              <Input 
                id="interestCity" 
                placeholder="Los Angeles" 
                value={interestCity} 
                onChange={e => setInterestCity(e.target.value)}
                className="h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="interestState" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
                State
              </Label>
              <Input 
                id="interestState" 
                placeholder="CA" 
                value={interestState} 
                onChange={e => setInterestState(e.target.value)}
                maxLength={2}
                className="h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="interestZip" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
                ZIP Code
              </Label>
              <Input 
                id="interestZip" 
                placeholder="90210" 
                value={interestZipCode} 
                onChange={e => setInterestZipCode(e.target.value)}
                maxLength={10}
                className="h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Completion Message */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 lg:p-8 text-center shadow-sm">
          <h4 className="text-lg lg:text-xl font-bold text-green-800 mb-2 lg:mb-3">Almost Done!</h4>
          <p className="text-sm lg:text-base text-green-700 leading-relaxed max-w-md mx-auto">
            You're all set! Click "Complete Setup" to start exploring properties and connecting with the Rentora community.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 lg:pt-12 max-w-md mx-auto">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="h-12 lg:h-14 px-6 lg:px-8 text-base lg:text-lg font-medium rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
        >
          <span className="mr-2">←</span>
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          className="h-12 lg:h-14 px-8 lg:px-12 text-base lg:text-lg font-bold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Complete Setup
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default LocationInfoStep; 