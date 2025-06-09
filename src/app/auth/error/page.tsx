'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('An unknown error occurred.');

    useEffect(() => {
        const message = searchParams.get('message');
        if (message) {
            setErrorMessage(message);
        }
    }, [searchParams]);

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
                <p className="text-gray-700">
                    {errorMessage}
                </p>
                <p className="text-sm text-gray-500">
                    Please try signing in again. If the problem persists, please contact support.
                </p>
                <Button onClick={() => router.push('/auth/sign-in')} className="w-full">
                    Back to Sign In
                </Button>
            </div>
        </div>
    );
} 