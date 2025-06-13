"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingFlow from './onboarding/OnboardingFlow';
import Dashboard from './Dashboard';

const OnboardingChecker: React.FC = () => {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Prevent body scrolling when modal/loading is active
  useEffect(() => {
    // Store original overflow style
    const originalOverflow = document.body.style.overflow;
    
    // Prevent scrolling when loading or showing onboarding
    if (loading || isOnboarded === false) {
      document.body.style.overflow = 'hidden';
    }
    
    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [loading, isOnboarded]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch('/api/onboarding/check-status');
        if (response.ok) {
          const data = await response.json();
          setIsOnboarded(data.onboarded);
          
          // If user is onboarded, redirect to messages (middleware should handle this but just in case)
          if (data.onboarded) {
            router.push('/messages');
          }
        } else {
          // If API fails, assume not onboarded and show onboarding flow
          setIsOnboarded(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If API fails, assume not onboarded and show onboarding flow
        setIsOnboarded(false);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (isOnboarded === false) {
    return <OnboardingFlow />;
  }

  // This shouldn't happen due to middleware redirect, but just in case
  return <Dashboard />;
};

export default OnboardingChecker; 