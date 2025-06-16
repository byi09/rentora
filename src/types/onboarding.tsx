export interface OnboardingData {
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    userType: 'renter' | 'landlord';
    phoneNumber: string;
    gender: string;
    
    // Current location details
    currentCity: string;
    currentState: string;
    currentZipCode: string;
    
    // Interest location details
    interestCity: string;
    interestState: string;
    interestZipCode: string;
    
    // Legacy fields for backward compatibility
    currentLocation: string;
    locationOfInterest: string;

    // Notification preferences
    updatesSavedPropertiesEmail?: boolean;
    updatesSavedPropertiesPush?: boolean;
    newPropertiesEmail?: boolean;
    newPropertiesPush?: boolean;
    newsEmail?: boolean;
    newsPush?: boolean;
  }
  
  export interface StepProps {
    data: Partial<OnboardingData>;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    onComplete?: () => void;
  }
  