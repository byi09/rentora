import PropertySearch from "./PropertySearch";
import Catalog from "./home/Catalog";
import React from "react";

function Dashboard() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Perfect Rental
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Discover amazing properties in your ideal location with our
              comprehensive search tools
            </p>
          </div>

          {/* Search Form - Add stable key to prevent re-renders */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <PropertySearch key="dashboard-search" />
          </div>
        </div>
      </section>

      <Catalog />
    </main>
  );
}

export default React.memo(Dashboard);
