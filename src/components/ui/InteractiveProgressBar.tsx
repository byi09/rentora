'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface InteractiveProgressBarProps {
  currentStep: number;
  propertyId?: string | null;
  /** optional callback before we change page – parent can save form */
  beforeNavigate?: () => Promise<void> | void;
}

const InteractiveProgressBar: React.FC<InteractiveProgressBarProps> = ({ 
  currentStep, 
  propertyId,
  beforeNavigate
}) => {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [allowedSteps, setAllowedSteps] = useState<boolean[]>([]);

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
        // Before first DB insert only step 0 reachable
        const completedArr = steps.map(() => false);
        completedArr[0] = true; // property info treated as completed while filling
        setCompletedSteps(completedArr);
        const allowedArr = steps.map((_, idx) => idx <= currentStep); // current & previous
        setAllowedSteps(allowedArr);
        return;
      }

      // With a propertyId, check DB to see which sections have data
      try {
        const supabase = createClient();

        // basic presence of property means step0 complete
        const { data: listing } = await supabase
          .from('property_listings')
          .select('id')
          .eq('property_id', propertyId)
          .single();

        const { count: imageCount } = await supabase
          .from('property_images')
          .select('id', { count: 'exact', head: true })
          .eq('property_id', propertyId);

        const { count: featureCount } = await supabase
          .from('property_features')
          .select('id', { count: 'exact', head: true })
          .eq('property_id', propertyId);

        const completed = [
          true, // property info exists by definition
          !!listing, // rent details
          (imageCount ?? 0) > 0, // media
          (featureCount ?? 0) > 0, // amenities
          false, // screening (placeholder)
          false, // costs & fees
          false, // final details
          false, // review
          false  // publish
        ];

        // determine allowed: a step is allowed if all previous completed OR it is currentStep
        const allowed: boolean[] = [];
        let allPrevComplete = true;
        for (let i = 0; i < steps.length; i++) {
          if (i === 0) {
            allowed[i] = true;
          } else {
            allPrevComplete = allPrevComplete && completed[i - 1];
            allowed[i] = allPrevComplete;
          }
        }

        setCompletedSteps(completed);
        setAllowedSteps(allowed);
      } catch (err) {
        console.error('Step completion check failed:', err);
        // Fallback – only allow current & previous
        const fallbackAllowed = steps.map((_, idx) => idx <= currentStep);
        setAllowedSteps(fallbackAllowed);
      }
    };

    checkCompletedSteps();
  }, [propertyId, currentStep, steps.length]);

  const handleStepClick = async (stepIndex: number) => {
    // Only allow navigation if allowedSteps true
    if (!allowedSteps[stepIndex]) {
      return;
    }

    if (beforeNavigate) {
      try {
        await beforeNavigate();
      } catch (err) {
        console.error('beforeNavigate error', err);
        // still navigate to avoid blocking user
      }
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
    <div className="mb-12 relative sticky top-24 z-20 bg-white/80 backdrop-blur">
      {/* Step Circles */}
      <div className="flex justify-between relative w-full">
        {steps.map((step, index) => (
          <div key={step.label} className="relative flex flex-col items-center">
            <button
              onClick={() => handleStepClick(index)}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-200 ${getStepClassName(index)} relative z-10`}
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
      
      {/* Progress Bar Background - centered behind circles */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-100">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
};

export default InteractiveProgressBar; 