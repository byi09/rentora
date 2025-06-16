'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('An unknown error occurred.');

  useEffect(() => {
    const message = searchParams.get('message');
    const type = searchParams.get('type');
    
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    } else if (type) {
      switch (type) {
        case 'oauth_error':
          setErrorMessage('OAuth authentication failed. Please try again.');
          break;
        case 'email_not_confirmed':
          setErrorMessage('Please verify your email address before signing in.');
          break;
        case 'invalid_credentials':
          setErrorMessage('Invalid email or password. Please try again.');
          break;
        case 'weak_password':
          setErrorMessage('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.');
          break;
        default:
          setErrorMessage('An authentication error occurred. Please try again.');
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-10 h-10 mr-2">
            <Image
              src="/rentora-logo.svg"
              alt="Livaro Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-gray-900">Livaro</span>
        </div>

        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="text-gray-700">{errorMessage}</p>
        
        <div className="space-y-3">
          <button 
            onClick={() => router.push(searchParams.get('type') === 'weak_password' ? '/sign-up' : '/sign-in')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push('/')} 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 