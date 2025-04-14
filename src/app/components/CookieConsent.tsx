"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCookieBite, FaTimesCircle } from 'react-icons/fa';
import CookiePreferences from './CookiePreferences';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookieConsent');
        if (!hasConsented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        // Accept all cookies by default
        const preferences = {
            essential: true,
            analytics: true,
            preferences: true
        };
        localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        // Only accept essential cookies
        const preferences = {
            essential: true,
            analytics: false,
            preferences: false
        };
        localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
        localStorage.setItem('cookieConsent', 'false');
        setIsVisible(false);
    };

    if (!isVisible && !showPreferences) return null;

    return (
        <>
            {isVisible && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
                    <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <FaCookieBite className="text-2xl text-purple-400" />
                            <p className="text-sm">
                                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
                                <button
                                    onClick={() => setShowPreferences(true)}
                                    className="text-purple-400 hover:text-purple-300 underline"
                                >
                                    Customize preferences
                                </button>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDecline}
                                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                            >
                                Accept All
                            </button>
                        </div>
                        <button
                            onClick={handleDecline}
                            className="absolute top-2 right-2 sm:hidden text-gray-400 hover:text-gray-300"
                        >
                            <FaTimesCircle />
                        </button>
                    </div>
                </div>
            )}

            <CookiePreferences
                isOpen={showPreferences}
                onClose={() => setShowPreferences(false)}
            />
        </>
    );
} 