'use client';

import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function VerifySuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Email Verified Successfully!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Your email has been verified. You can now sign in to your account.
                    </p>
                </div>
                <div>
                    <Link
                        href="/auth/signin"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
} 