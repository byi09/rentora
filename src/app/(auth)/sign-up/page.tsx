import Image from 'next/image';
import Link from 'next/link';
import { signUpNewUser } from '@/utils/supabase/actions';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-10 h-10 mr-2">
            <Image
              src="/rentora-logo.svg"
              alt="Rentora Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-gray-900">Rentora</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create your account</h1>
        <form method="POST" className="flex flex-col gap-5" autoComplete="off">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
            <input id="email" name="email" type="email" required className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <input id="password" name="password" type="password" required className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Create a password" />
          </div>
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School*</label>
            <input id="school" name="school" type="text" required className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your school" />
          </div>
          <button formAction={signUpNewUser} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded mt-2">Sign up</button>
        </form>
        <div className="mt-5 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">Sign in</Link>
          </p>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By submitting, I accept Rentora's <a href="/terms" className="text-blue-600 hover:text-blue-800">terms of use</a>
          </p>
        </div>
      </div>
    </div>
  );
} 