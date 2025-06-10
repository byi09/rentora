"use client";
import React, { useState } from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import { OnboardingPayload } from '@/src/db/queries';
import ContactInfoStep from './ContactInfoStep';
import LocationInfoStep from './LocationInfoStep';
import UserTypeStep from './UserTypeStep';

interface Props {
  onComplete: () => void;
}

const steps = [
  { component: PersonalInfoStep, label: "Personal Info" },
  { component: ContactInfoStep, label: "Contact" },
  { component: LocationInfoStep, label: "Location" },
  { component: UserTypeStep, label: "Account Type" },
];

const OnboardingFlow: React.FC<Props> = ({ onComplete }) => {
  const [data, setData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = (partial: Partial<OnboardingPayload>) => {
    setData((prev: any) => ({ ...prev, ...partial }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finish = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        onComplete();
      } else {
        console.error('Onboarding failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-8 pt-8">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="relative overflow-hidden px-8 pb-8 pt-2">
          <div className="w-full">
            <CurrentStepComponent
              data={data}
              onUpdate={handleUpdate}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        </div>

        {submitting && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <p className="text-lg">Saving your profile...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow; 