import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md border-b border-gray-800"></div>
      <div className="relative w-full px-1">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Menu button for mobile */}
            <button 
              className="text-white p-1 focus:outline-none" 
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/" className="flex items-center ml-1 group">
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src="/rentora-logo.svg"
                  alt="Rentora Logo"
                  fill
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Rentora</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 pr-1">
            <Link
              href="/sign-in"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              href="/partner"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 focus:outline-none"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 