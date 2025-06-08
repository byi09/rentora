
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PersonalInfoStep from './onboarding/PersonalInfoStep';
import UserTypeStep from './onboarding/UserTypeStep';
import ContactStep from './onboarding/ContactStep';
import LocationStep from './onboarding/LocationStep';
import { OnboardingData } from '../types/onboarding';

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    username: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    userType: '',
    phoneNumber: '',
    gender: '',
    currentLocation: '',
    locationOfInterest: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    'Personal Information',
    'Account Type',
    'Contact Details',
    'Location Preferences'
  ];

  const updateFormData = (stepData: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <UserTypeStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <ContactStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <LocationStep
            data={formData}
            onUpdate={updateFormData}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent 
        className="max-w-md mx-auto" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Welcome! Let's set up your profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm font-medium text-gray-700">
              {stepTitles[currentStep - 1]}
            </p>
          </div>

          {/* Current step content */}
          <div className="min-h-[300px]">
            {renderCurrentStep()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
