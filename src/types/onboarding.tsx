export interface OnboardingData {
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    userType: string;
    phoneNumber: string;
    gender: string;
    currentLocation: string;
    locationOfInterest: string;
  }
  
  export interface StepProps {
    data: OnboardingData;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    onComplete?: () => void;
  }
  