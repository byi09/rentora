'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface InteractiveProgressBarProps {
  currentStep: number;
  propertyId?: string | null;
}

const InteractiveProgressBar: React.FC<InteractiveProgressBarProps> = ({ 
  currentStep, 
  propertyId 
}) => {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);

  const steps = [
    { label: 'Property Info', path: '/sell/create' },
    { label: 'Rent Details', path: '/sell/create/rent-details' },
    { label: 'Media', path: '/sell/create/media' },
    { label: 'Amenities', path: '/sell/create/amenities' },
    { label: 'Screening', path: '/sell/create/screening' },
    { label: 'Costs and Fees', path: '/sell/create/costs-and-fees' },
    { label: 'Final details', path: '/sell/create/final-details' },
    { label: 'Review', path: '/sell/create/review' },
    { label: 'Publish', path: '/sell/create/publish' }
  ];

  // Check which steps have been completed
  useEffect(() => {
    const checkCompletedSteps = async () => {
      if (!propertyId) {
        // No property yet – only allow current and previous
        const restricted = steps.map((_, idx) => idx <= currentStep);
        setCompletedSteps(restricted);
        return;
      }

      // Once a propertyId exists we unlock ALL steps so the user can jump freely.
      // This avoids blocking navigation when they return to the first page.
      setCompletedSteps(steps.map(() => true));
    };

    checkCompletedSteps();
  }, [propertyId, currentStep, steps.length]);

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to completed steps or current step
    if (!completedSteps[stepIndex] && stepIndex !== currentStep) {
      return;
    }

    const step = steps[stepIndex];
    let url = step.path;
    if (propertyId) {
      url += `?property_id=${propertyId}`;
    }
    router.push(url);
  };

  const getStepClassName = (stepIndex: number) => {
    if (stepIndex === currentStep) {
      return 'bg-blue-600 cursor-pointer';
    }
    if (completedSteps[stepIndex]) {
      return 'bg-green-500 hover:bg-green-600 transition-colors cursor-pointer';
    }
    return 'bg-gray-300 cursor-not-allowed';
  };

  const getStepTextClassName = (stepIndex: number) => {
    if (stepIndex === currentStep) {
      return 'text-gray-800 font-semibold';
    }
    if (completedSteps[stepIndex]) {
      return 'text-gray-800 font-medium';
    }
    return 'text-gray-500';
  };

  // Calculate progress bar width - only fill up to current step circle
  const progressWidth = currentStep === 0 ? 0 : (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="mb-12 relative">
      {/* Step Circles */}
      <div className="flex justify-between relative w-full">
        {steps.map((step, index) => (
          <div key={step.label} className="relative flex flex-col items-center">
            <button
              onClick={() => handleStepClick(index)}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${getStepClassName(index)} relative z-10`}
              title={completedSteps[index] || index === currentStep ? `Go to ${step.label}` : `Complete previous steps to unlock ${step.label}`}
              disabled={!completedSteps[index] && index !== currentStep}
            >
              {/* Add checkmark for completed steps */}
              {completedSteps[index] && index !== currentStep && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
            
            {/* Step Label */}
            <div className={`text-xs mt-6 -ml-4 w-20 text-center transition-colors ${getStepTextClassName(index)}`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Bar Background - positioned behind circles */}
      <div className="absolute top-2 left-0 right-0 h-0.5 bg-blue-100">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
};

export default InteractiveProgressBar; 