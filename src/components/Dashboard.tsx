import {
  HiCalendarDays,
  HiMapPin,
  HiCalculator,
  HiChatBubbleLeftRight,
  HiCreditCard,
  HiDocumentText
} from "react-icons/hi2";
import PropertySearch from "./PropertySearch";
import Catalog from "./home/Catalog";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Perfect Rental
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Discover amazing properties in your ideal location with our
              comprehensive search tools
            </p>
          </div>

          {/* Search Form */}
          <PropertySearch />
        </div>
      </section>

      <Catalog />

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for your rental journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Rent Calculator */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCalculator className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Rent Calculator
              </h3>
              <p className="text-gray-600 mb-4">Calculate affordability</p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                Get Started
              </button>
            </div>

            {/* Neighborhood Guide */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiMapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Neighborhood Guide
              </h3>
              <p className="text-gray-600 mb-4">Explore local areas</p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                Get Started
              </button>
            </div>

            {/* Rental Application */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiDocumentText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Rental Application
              </h3>
              <p className="text-gray-600 mb-4">Apply for properties</p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                Get Started
              </button>
            </div>

            {/* Contact Landlord */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiChatBubbleLeftRight className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Contact Landlord
              </h3>
              <p className="text-gray-600 mb-4">Get in touch quickly</p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                Get Started
              </button>
            </div>

            {/* Schedule Tour */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCalendarDays className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Schedule Tour
              </h3>
              <p className="text-gray-600 mb-4">Book a viewing</p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                Get Started
              </button>
            </div>

            {/* Pay Rent */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCreditCard className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pay Rent</h3>
              <p className="text-gray-600 mb-4">Make payments online</p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
