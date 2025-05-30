import React from "react";
import { createClient } from '@/utils/supabase/server';
import Dashboard from '@/src/components/Dashboard';

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, show the dashboard
  if (user) {
    return <Dashboard />;
  }

  // Otherwise, show the marketing page
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