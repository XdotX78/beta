'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa';

export default function TwoFactorSetupPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [qrCode, setQrCode] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    useEffect(() => {
        // Check if 2FA is already enabled
        fetch('/api/auth/2fa/status')
            .then(res => res.json())
            .then(data => {
                setIs2FAEnabled(data.enabled);
            })
            .catch(console.error);
    }, []);

    const setupTwoFactor = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/2fa/setup', {
                method: 'POST'
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setQrCode(data.qrCode);
            setSecret(data.secret);
        } catch (err: any) {
            setError(err.message || 'Failed to set up 2FA');
        } finally {
            setLoading(false);
        }
    };

    const verifySetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/2fa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setSuccess('Two-factor authentication has been enabled successfully');
            setIs2FAEnabled(true);
            setQrCode('');
            setSecret('');
            setToken('');
        } catch (err: any) {
            setError(err.message || 'Failed to verify 2FA setup');
        } finally {
            setLoading(false);
        }
    };

    const disableTwoFactor = async () => {
        if (!confirm('Are you sure you want to disable two-factor authentication?')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/2fa/setup', {
                method: 'DELETE'
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setSuccess('Two-factor authentication has been disabled');
            setIs2FAEnabled(false);
        } catch (err: any) {
            setError(err.message || 'Failed to disable 2FA');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Please sign in to access this page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center">
                    <FaShieldAlt className="mx-auto h-12 w-12 text-indigo-600" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Two-Factor Authentication
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Add an extra layer of security to your account
                    </p>
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 p-4 rounded-md">
                        <div className="flex">
                            <FaTimes className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mt-4 bg-green-50 p-4 rounded-md">
                        <div className="flex">
                            <FaCheck className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    {!is2FAEnabled ? (
                        <div>
                            {!qrCode ? (
                                <button
                                    onClick={setupTwoFactor}
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {loading ? 'Setting up...' : 'Set up 2FA'}
                                </button>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm text-gray-700 mb-4">
                                            1. Scan this QR code with your authenticator app:
                                        </p>
                                        <div className="flex justify-center">
                                            <Image
                                                src={qrCode}
                                                alt="QR Code"
                                                width={200}
                                                height={200}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            2. Or manually enter this code in your app:
                                        </p>
                                        <code className="block p-3 bg-gray-100 rounded text-center font-mono">
                                            {secret}
                                        </code>
                                    </div>

                                    <form onSubmit={verifySetup} className="space-y-4">
                                        <div>
                                            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                                                3. Enter the verification code from your app:
                                            </label>
                                            <input
                                                type="text"
                                                id="token"
                                                value={token}
                                                onChange={(e) => setToken(e.target.value)}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Enter 6-digit code"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {loading ? 'Verifying...' : 'Verify and Enable 2FA'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="bg-green-50 p-4 rounded-md mb-4">
                                <div className="flex">
                                    <FaCheck className="h-5 w-5 text-green-400" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            Two-factor authentication is enabled
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={disableTwoFactor}
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                {loading ? 'Disabling...' : 'Disable 2FA'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 