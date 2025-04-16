'use client';

import Link from 'next/link';
import { FaTimesCircle } from 'react-icons/fa';

export default function VerifyErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <FaTimesCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Verification Failed
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We were unable to verify your email address. The verification link may be expired or invalid.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Try signing up again
                        </Link>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                        If you believe this is an error, please{' '}
                        <Link href="/contact" className="font-medium text-red-600 hover:text-red-500">
                            contact support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 