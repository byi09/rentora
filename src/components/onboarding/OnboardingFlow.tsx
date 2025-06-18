"use client";
import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PersonalInfoStep from './PersonalInfoStep';
import { OnboardingData } from '@/src/types/onboarding';
import ContactInfoStep from './ContactInfoStep';
import LocationInfoStep from './LocationInfoStep';
import UserTypeStep from './UserTypeStep';
import NotificationPreferencesStep from './NotificationPreferencesStep';
import Spinner from '@/src/components/ui/Spinner';
import { useToast } from '@/src/components/ui/Toast';
import { createRoot } from 'react-dom/client';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

// Step order: 1) Personal, 2) Account type, 3) Contact, 4) Notifications, 5) Location
const steps = [
  { component: PersonalInfoStep, label: "Personal Information" },
  { component: UserTypeStep, label: "Account Type" },
  { component: ContactInfoStep, label: "Contact Details" },
  { component: NotificationPreferencesStep, label: "Notification Preferences" },
  { component: LocationInfoStep, label: "Location Preferences" },
];

interface OnboardingError {
  type: 'network' | 'validation' | 'server' | 'auth' | 'unknown';
  message: string;
  retryable: boolean;
  step?: number;
}

const OnboardingFlow: React.FC = () => {
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const dataRef = useRef<Partial<OnboardingData>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<OnboardingError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { error: showToastError, success: showToastSuccess } = useToast();
  
  const maxRetries = 3;
  const retryDelay = 1000; // Start with 1 second

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (error?.type === 'network') {
        setError(null);
        showToastSuccess('Connection restored', 'You can continue with the onboarding process.');
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setError({
        type: 'network',
        message: 'No internet connection. Please check your network and try again.',
        retryable: true
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, showToastSuccess]);

  // Prevent body scrolling when modal is active
  useEffect(() => {
    // Store original overflow style
    const originalOverflow = document.body.style.overflow;
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const createError = (type: OnboardingError['type'], message: string, retryable = true, step?: number): OnboardingError => ({
    type,
    message,
    retryable,
    step
  });

  const handleError = (error: unknown, context: string) => {
    console.error(`Onboarding error in ${context}:`, error);
    
    if (!isOnline) {
      setError(createError('network', 'No internet connection. Please check your network and try again.'));
      return;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      setError(createError('network', 'Network error. Please check your connection and try again.'));
      return;
    }

    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setError(createError('auth', 'Your session has expired. Please sign in again.', false));
        return;
      }
      
      if (error.message.includes('400') || error.message.includes('validation')) {
        setError(createError('validation', 'Please check your information and try again.', false));
        return;
      }
      
      if (error.message.includes('500') || error.message.includes('server')) {
        setError(createError('server', 'Server error. Please try again in a moment.'));
        return;
      }
      
      setError(createError('unknown', error.message || 'An unexpected error occurred.'));
    } else {
      setError(createError('unknown', 'An unexpected error occurred. Please try again.'));
    }
  };

  const handleSignOut = async () => {
    try {
      // Immediately show full-page loading overlay with React rendering for consistency
      const container = document.createElement('div');
      container.id = 'signout-overlay';
      document.body.appendChild(container);
      const root = createRoot(container);
      root.render(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
          <Spinner size={32} label="Signing out…" />
        </div>
      );

      // Disable rendering of onboarding UI while we sign out
      setSigningOut(true);

      // Then call our logout API to clear cookies
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to sign out');
      }

      // After server session/cookies cleared, sign out on client
      const supabase = createClient();
      await supabase.auth.signOut();

      // Always redirect to home (or sign-in) afterward
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      showToastError('Sign out failed', 'Please try refreshing the page.');
      // Fallback: force reload to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  const validateStepData = (stepIndex: number, stepData: Partial<OnboardingData>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    switch (stepIndex) {
      case 0: // Personal Info
        if (!stepData.username?.trim()) errors.username = 'Username is required';
        if (!stepData.firstName?.trim()) errors.firstName = 'First name is required';
        if (!stepData.lastName?.trim()) errors.lastName = 'Last name is required';
        if (!stepData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        break;
      case 1: // User Type
        if (!stepData.userType) errors.userType = 'Please select your account type';
        break;
      // Other steps are optional or have their own validation
    }
    
    return errors;
  };

  const handleUpdate = (partial: Partial<OnboardingData>) => {
    console.log('🔄 OnboardingFlow updating data with:', JSON.stringify(partial, null, 2));
    
    // Clear any validation errors for updated fields
    const updatedErrors = { ...validationErrors };
    Object.keys(partial).forEach(key => {
      delete updatedErrors[key];
    });
    setValidationErrors(updatedErrors);
    
    setData((prev: Partial<OnboardingData>) => {
      const newData = { ...prev, ...partial };
      console.log('🔄 OnboardingFlow total data now:', JSON.stringify(newData, null, 2));
      dataRef.current = newData;
      return newData;
    });
  };

  const handleNext = () => {
    // Validate current step data
    const stepErrors = validateStepData(currentStep, dataRef.current);
    if (Object.keys(stepErrors).length > 0) {
      setValidationErrors(stepErrors);
      showToastError('Please fix the errors', 'Check the highlighted fields and try again.');
      return;
    }

    setValidationErrors({});
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({}); // Clear validation errors when going back
    }
  };

  const retryWithBackoff = async (operation: () => Promise<void>, attempt = 0): Promise<void> => {
    try {
      await operation();
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`Retrying operation in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithBackoff(operation, attempt + 1);
      } else {
        throw error;
      }
    }
  };

  const finish = async () => {
    if (!isOnline) {
      showToastError('No internet connection', 'Please check your network and try again.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setRetryCount(0);
    
    const payload = dataRef.current;
    console.log('🚀 OnboardingFlow finishing with data:', JSON.stringify(payload, null, 2));
    
    try {
      await retryWithBackoff(async () => {
        const response = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `Server error (${response.status})`;
          throw new Error(errorMessage);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Onboarding completion failed');
        }
      });

      // Success
      showToastSuccess('Welcome to Rentora!', 'Your profile has been set up successfully.');
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        // Use window.location.href for a clean page reload instead of router.push
        // This prevents glitching and ensures the server renders the dashboard properly
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      handleError(error, 'finish');
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
    
    if (submitting) {
      // Retry the finish operation
      finish();
    }
  };

  const getCurrentStepComponent = () => {
    const CurrentStepComponent = steps[currentStep].component;
    const progress = ((currentStep + 1) / steps.length) * 100;
    const stepNumber = currentStep + 1;

    return (
      <>
        {/* Header - Enhanced */}
        <div className="px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-5 pb-3 sm:pb-4 lg:pb-5 text-center border-b border-gray-100 relative bg-white/90 backdrop-blur-sm">
          {/* Sign-out link */}
          <button
            onClick={handleSignOut}
            disabled={submitting}
            className="absolute right-4 sm:right-6 lg:right-8 top-4 sm:top-6 lg:top-8 text-sm text-gray-500 hover:text-red-600 focus:outline-none transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign out
          </button>

          {/* Network status indicator */}
          {!isOnline && (
            <div className="absolute left-4 sm:left-6 lg:left-8 top-4 sm:top-6 lg:top-8 flex items-center text-red-500">
              <WifiOff className="w-4 h-4 mr-1" />
              <span className="text-xs">Offline</span>
            </div>
          )}

          {/* Welcome message - Enhanced */}
          <div className="mb-3 sm:mb-4 lg:mb-5">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-gray-800 leading-tight">
              Welcome to Rentora!
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Let&apos;s set up your profile to find the perfect rental or tenant for you
            </p>
          </div>

          {/* Step info - Enhanced */}
          <div className="flex justify-between items-center text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 text-gray-600 font-medium max-w-sm mx-auto">
            <span>{`Step ${stepNumber} of ${steps.length}`}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>

          {/* Progress bar - Enhanced */}
          <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-1.5 sm:h-2 lg:h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-1.5 sm:h-2 lg:h-3 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Section label - Enhanced */}
          <div className="mt-3 sm:mt-4 lg:mt-5">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-1 sm:mb-2">
              {steps[currentStep].label}
            </h2>
            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Step content - responsive spacing */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 lg:py-6 xl:py-8 bg-white/90 backdrop-blur-sm min-h-[240px] lg:min-h-[320px] flex items-center">
          <div className="w-full max-w-2xl mx-auto">
            <CurrentStepComponent
              data={data}
              onUpdate={handleUpdate}
              onNext={handleNext}
              onPrevious={handlePrevious}
              validationErrors={validationErrors}
            />
          </div>
        </div>
      </>
    );
  };

  // If signing out, render nothing – overlay covers the screen
  if (signingOut) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 xl:p-8 overflow-hidden">
      {/* Background with enhanced gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.08) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
      </div>
      
      {/* Modal content - responsive height */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl overflow-hidden max-h-[85vh] overflow-y-auto">
        
        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-10">
            <div className="text-center p-8 max-w-md">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {error.type === 'network' ? 'Connection Problem' :
                   error.type === 'auth' ? 'Session Expired' :
                   error.type === 'validation' ? 'Invalid Information' :
                   error.type === 'server' ? 'Server Error' :
                   'Something Went Wrong'}
                </h3>
                <p className="text-lg text-gray-600 mb-6">{error.message}</p>
              </div>
              
              <div className="space-y-3">
                {error.retryable && (
                  <button
                    onClick={handleRetry}
                    disabled={!isOnline && error.type === 'network'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : 'Try Again'}
                  </button>
                )}
                
                {error.type === 'auth' && (
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Sign In Again
                  </button>
                )}
                
                <button
                  onClick={() => setError(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Continue Anyway
                </button>
              </div>
              
              {error.type === 'network' && (
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 mr-1 text-green-500" />
                      Connection restored
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 mr-1 text-red-500" />
                      No internet connection
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Normal content */}
        {!error && getCurrentStepComponent()}

        {/* Enhanced loading state */}
        {submitting && !error && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center">
            <div className="text-center p-8">
              <div className="mb-6">
                <Spinner size={32} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Almost there!</h3>
              <p className="text-lg text-gray-600">Saving your profile and setting up your account...</p>
              
              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Attempt {retryCount + 1} of {maxRetries + 1}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow; 