export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold">Livaro</span>
            </div>
            <p className="text-gray-400 mb-4">
              Find your perfect rental with the most comprehensive search tools and premium property listings.
            </p>
          </div>

          {/* For Renters */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Renters</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Search Rentals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Neighborhood Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rent Calculator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rental Application</a></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Landlords</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">List Property</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Manage Rentals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tenant Screening</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Collect Rent</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Livaro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
