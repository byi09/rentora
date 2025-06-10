"use client";
import React, { useState } from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import { OnboardingPayload } from '@/src/db/queries';
import ContactInfoStep from './ContactInfoStep';
import LocationInfoStep from './LocationInfoStep';
import UserTypeStep from './UserTypeStep';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [direction, setDirection] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  const handleUpdate = (partial: Partial<OnboardingPayload>) => {
    setData((prev: any) => ({ ...prev, ...partial }));
  };

  const handleNext = () => {
    setDirection(1);
    setTransitioning(true);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finish();
    }
    setTimeout(() => setTransitioning(false), 180);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setTransitioning(true);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    setTimeout(() => setTransitioning(false), 180);
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-8 pt-8">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            />
          </div>
        </div>
        
        <div className="relative overflow-hidden px-8 pb-8 pt-2">
          {transitioning && <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"/></div>}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full"
            >
              <CurrentStepComponent
                data={data}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </motion.div>
          </AnimatePresence>
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