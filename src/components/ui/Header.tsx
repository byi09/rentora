'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiHeart, HiBell, HiUser, HiChevronDown, HiCog, HiChat, HiUserCircle } from 'react-icons/hi';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  toggleSidebar?: () => void;
  user?: User | null;
}

const Header = ({ toggleSidebar, user }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push('/');
  };

  // Different header styles based on user authentication
  if (!user) {
    // Header for non-logged in users (dark glass style)
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md border-b border-gray-800"></div>
        <div className="relative w-full px-1">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Menu button for mobile */}
              {toggleSidebar && (
                <button
                  className="text-white p-1 focus:outline-none"
                  onClick={toggleSidebar}
                  aria-label="Toggle menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              <Link href="/" className="flex items-center ml-1 group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 transition-transform duration-200 group-hover:scale-110">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Rentora</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 pr-1">
              <Link
                href="/sign-in"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors duration-200 rounded-md"
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
  }

  // Header for logged in users (white style)
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rentora</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/buy" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Buy
            </Link>
            <Link href="/rent" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Rent
            </Link>
            <Link href="/sell" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Sell
            </Link>
            <Link href="/manage" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Manage Rentals
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Saved properties */}
            <Link href="/saved" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
              <HiHeart className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Saved</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <HiBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <HiUser className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:inline font-medium text-gray-900">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
                <HiChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    {/* Profile */}
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HiUserCircle className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-medium">Profile</span>
                    </Link>

                    {/* Messages */}
                    <Link
                      href="/messages"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HiChat className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-medium">Messages</span>
                    </Link>

                    {/* Saved Properties */}
                    <Link
                      href="/saved"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HiHeart className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-medium">Saved Properties</span>
                    </Link>

                    {/* Settings */}
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HiCog className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-medium">Settings</span>
                    </Link>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <HiArrowRightOnRectangle className="w-5 h-5 mr-3" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            {toggleSidebar && (
              <button
                className="md:hidden text-gray-700 p-1 focus:outline-none"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 