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

// Step order: 1) Personal, 2) Account type, 3) Contact, 4) Location
const steps = [
  { component: PersonalInfoStep, label: "Personal Information" },
  { component: UserTypeStep, label: "Account Type" },
  { component: ContactInfoStep, label: "Contact Details" },
  { component: LocationInfoStep, label: "Location Preferences" },
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
  const stepNumber = currentStep + 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden relative">
        {/* Close button handled by OnboardingGate backdrop so omitted */}

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-transparent">
          <h2 className="text-xl font-semibold mb-4">Welcome! Let's set up your profile</h2>

          {/* Step info */}
          <div className="flex justify-between items-center text-xs mb-1 text-gray-600 font-medium">
            <span>{`Step ${stepNumber} of ${steps.length}`}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-900 h-1.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Section label */}
          <p className="mt-4 text-sm font-medium text-gray-700">{steps[currentStep].label}</p>
        </div>

        {/* Step content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <CurrentStepComponent
            data={data}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
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