'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

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
        // For new properties, only allow current step and previous steps
        const newCompletedSteps = steps.map((_, index) => index <= currentStep);
        setCompletedSteps(newCompletedSteps);
        return;
      }

      try {
        const supabase = createClient();
        
        // Check if property exists (step 0 completed)
        const { data: property } = await supabase
          .from('properties')
          .select('id')
          .eq('id', propertyId)
          .single();

        // Check if rent details exist (step 1 completed)
        const { data: listing } = await supabase
          .from('property_listings')
          .select('id')
          .eq('property_id', propertyId)
          .single();

        // Check if media exists (step 2 completed)
        const { data: images } = await supabase
          .from('property_images')
          .select('id')
          .eq('property_id', propertyId)
          .limit(1);

        // Check if amenities exist (step 3 completed)
        const { data: amenities } = await supabase
          .from('property_features')
          .select('id')
          .eq('property_id', propertyId)
          .limit(1);

        const stepCompletionStatus = [
          !!property, // Step 0: Property Info
          !!listing,  // Step 1: Rent Details
          !!(images && images.length > 0), // Step 2: Media
          !!(amenities && amenities.length > 0), // Step 3: Amenities
          true, // Step 4: Screening (always allow once property exists)
          true, // Step 5: Costs and Fees (always allow once property exists)
          true, // Step 6: Final Details (always allow once property exists)
          true, // Step 7: Review (always allow once property exists)
          true  // Step 8: Publish (always allow once property exists)
        ];

        // Also allow current step and any step that's been reached
        const finalCompletionStatus = stepCompletionStatus.map((completed, index) => 
          completed || index <= currentStep
        );

        setCompletedSteps(finalCompletionStatus);
      } catch (error) {
        console.error('Error checking step completion:', error);
        // Fallback: allow current step and previous steps
        const fallbackSteps = steps.map((_, index) => index <= currentStep);
        setCompletedSteps(fallbackSteps);
      }
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