import { HiLocationMarker, HiHeart } from 'react-icons/hi';
import { HiCalendarDays, HiMapPin, HiCalculator, HiChatBubbleLeftRight, HiCreditCard, HiDocumentText } from 'react-icons/hi2';
import { BsCarFront } from 'react-icons/bs';
import PropertySearch from './PropertySearch';
import OnboardingGate from './onboarding/OnboardingGate';

export default function Dashboard() {
  return (
    <OnboardingGate>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Find Your Perfect Rental
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Discover amazing properties in your ideal location with our comprehensive search tools
              </p>
            </div>

            {/* Search Form */}
            <PropertySearch />
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked rentals that offer exceptional value and prime locations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Property Card 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    New
                  </span>
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <HiHeart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">$2,200/mo</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      Pet OK
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <HiLocationMarker className="w-4 h-4 mr-1" />
                    567 Maple St, Venice Beach
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="font-medium">2 beds</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium">1 bath</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium">950 sqft</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Card 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-green-400 to-teal-600"></div>
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <HiHeart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">$2,750/mo</h3>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                      Furnished
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <HiLocationMarker className="w-4 h-4 mr-1" />
                    890 Cedar Ave, Hollywood
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="font-medium">2 beds</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium">2 baths</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium">1,100 sqft</span>
                    </span>
                    <span className="flex items-center">
                      <BsCarFront className="w-4 h-4 mr-1" />
                      <span className="font-medium">Parking</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Card 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-600"></div>
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <HiHeart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">$3,400/mo</h3>
                  </div>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <HiLocationMarker className="w-4 h-4 mr-1" />
                    234 Willow Dr, Culver City
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="font-medium">3 beds</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium">2 baths</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium">1,400 sqft</span>
                    </span>
                    <span className="flex items-center">
                      <BsCarFront className="w-4 h-4 mr-1" />
                      <span className="font-medium">Parking</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Card 4 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-red-600"></div>
                  <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    New
                  </span>
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <HiHeart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">$2,900/mo</h3>
                  </div>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <HiLocationMarker className="w-4 h-4 mr-1" />
                    456 Oak Street, Santa Monica
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="font-medium">2 beds</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium">2 baths</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium">1,200 sqft</span>
                    </span>
                    <span className="flex items-center">
                      <BsCarFront className="w-4 h-4 mr-1" />
                      <span className="font-medium">Parking</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Neighborhoods */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Neighborhoods
              </h2>
              <p className="text-xl text-gray-600">
                Explore trending areas with the best rental opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Neighborhood 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">West Hollywood</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">$3,600</p>
                      <p className="text-gray-600">Avg. rent</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">+4.7%</p>
                      <p className="text-gray-600">156 properties</p>
                    </div>
                  </div>
                  <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                    <HiMapPin className="w-4 h-4 mr-1" />
                    View available rentals
                  </button>
                </div>
              </div>

              {/* Neighborhood 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Culver City</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">$2,900</p>
                      <p className="text-gray-600">Avg. rent</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">+6.3%</p>
                      <p className="text-gray-600">134 properties</p>
                    </div>
                  </div>
                  <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                    <HiMapPin className="w-4 h-4 mr-1" />
                    View available rentals
                  </button>
                </div>
              </div>

              {/* Neighborhood 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-pink-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Manhattan Beach</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">$4,200</p>
                      <p className="text-gray-600">Avg. rent</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">+1.9%</p>
                      <p className="text-gray-600">78 properties</p>
                    </div>
                  </div>
                  <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                    <HiMapPin className="w-4 h-4 mr-1" />
                    View available rentals
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Explore All Neighborhoods
              </button>
            </div>
          </div>
        </section>

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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rent Calculator</h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Neighborhood Guide</h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rental Application</h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Landlord</h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Tour</h3>
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
    </OnboardingGate>
  );
} 