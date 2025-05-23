'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const errorType = searchParams.get('type')

  const getErrorContent = () => {
    switch (errorType) {
      case 'email_not_confirmed':
        return {
          title: 'Email Not Verified',
          message: 'Please check your email and click the confirmation link before signing in.',
          action: (
            <div className="space-y-2">
              <Link href="/resend-confirmation" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Resend Confirmation Email
              </Link>
              <Link href="/sign-in" className="block w-full text-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Back to Sign In
              </Link>
            </div>
          )
        }
      case 'invalid_credentials':
        return {
          title: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect. Please try again.',
          action: (
            <div className="space-y-2">
              <Link href="/sign-in" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Try Again
              </Link>
              <Link href="/forgot-password" className="block w-full text-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Forgot Password?
              </Link>
            </div>
          )
        }
      default:
        return {
          title: 'Something went wrong',
          message: 'An unexpected error occurred. Please try again.',
          action: (
            <Link href="/sign-in" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Back to Sign In
            </Link>
          )
        }
    }
  }

  const { title, message, action } = getErrorContent()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        {action}
      </div>
    </div>
  )
}