"use client";
import React from 'react';
import OnboardingGate from '@/src/components/onboarding/OnboardingGate';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <OnboardingGate>{children}</OnboardingGate>;
} 