"use client";
import React, { useEffect, useState } from 'react';
import OnboardingFlow from './OnboardingFlow'; // assume this component exists to handle steps

interface Props {
  children: React.ReactNode;
}

const OnboardingGate: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/onboarding/status');
        if (res.ok) {
          const { onboarded } = await res.json();
          setShowOnboarding(!onboarded);
        }
      } catch (err) {
        console.error('Onboarding status error', err);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  // lock scroll when modal open
  useEffect(() => {
    if (showOnboarding) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [showOnboarding]);

  if (loading) return null;

  return (
    <>
      {children}
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  );
};

export default OnboardingGate; 