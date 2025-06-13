import React from "react";
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Dashboard from '@/src/components/Dashboard';
import OnboardingFlow from '@/src/components/onboarding/OnboardingFlow';
import OnboardingChecker from '@/src/components/OnboardingChecker';

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, check onboarding status
  if (user) {
    const cookieStore = await cookies();
    const onboardingCookie = cookieStore.get('onboarding-status');
    
    if (onboardingCookie) {
      // Use cached value from cookie
      const isOnboarded = onboardingCookie.value === 'true';
      
      if (!isOnboarded) {
        // Show onboarding flow with dashboard as background
        return (
          <main className="relative min-h-screen overflow-hidden">
            {/* Dashboard as background - blurred and non-interactive */}
            <div className="absolute inset-0 blur-sm pointer-events-none">
              <Dashboard />
            </div>
            {/* Onboarding modal overlay */}
            <OnboardingFlow />
          </main>
        );
      }
      
      // User is onboarded, show dashboard normally
      return <Dashboard />;
    } else {
      // No cookie exists, need to check database and set cookie
      // Show dashboard as background while checking
      return (
        <main className="relative min-h-screen overflow-hidden">
          {/* Dashboard as background - blurred and non-interactive */}
          <div className="absolute inset-0 blur-sm pointer-events-none">
            <Dashboard />
          </div>
          {/* Onboarding checker overlay */}
          <OnboardingChecker />
        </main>
      );
    }
  }

  // Otherwise, show the marketing page for unauthenticated users
  return (
    <main className="min-h-screen">
      <section className="hero-section">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center pt-20 lg:pt-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              Student Renting Made Social
            </h1>
            
            {/* Search Input */}
            <div className="max-w-xl mx-auto mt-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your school"
                  className="w-full px-6 py-4 text-lg rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 bg-white/95 backdrop-blur-sm"
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                >
                  Search
                </button>
              </div>
              <p className="text-white/80 text-sm mt-4">
                Popular: NYU, Columbia, Berkeley, Stanford
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}  