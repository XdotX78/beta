"use client";

import { useState, useEffect } from 'react';
import { FaCog, FaChartBar, FaCookieBite, FaShieldAlt } from 'react-icons/fa';

interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    preferences: boolean;
}

export default function CookiePreferences({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true, // Essential cookies can't be disabled
        analytics: false,
        preferences: false,
    });

    useEffect(() => {
        // Load saved preferences
        const savedPreferences = localStorage.getItem('cookiePreferences');
        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
        localStorage.setItem('cookieConsent', 'true');

        // Initialize analytics if enabled
        if (preferences.analytics) {
            // Initialize analytics tracking
            initializeAnalytics();
        } else {
            // Disable analytics tracking
            disableAnalytics();
        }

        onClose();
    };

    const initializeAnalytics = () => {
        // We'll implement this in the next step
        console.log('Analytics enabled');
    };

    const disableAnalytics = () => {
        // We'll implement this in the next step
        console.log('Analytics disabled');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FaCog className="text-purple-600" />
                            Cookie Preferences
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Essential Cookies */}
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <FaShieldAlt className="text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                                </div>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="appearance-none w-9 h-5 rounded-full bg-gray-200 cursor-not-allowed"
                                    />
                                    <div className="absolute inset-0 flex items-center pointer-events-none">
                                        <div className="w-4 h-4 rounded-full bg-green-600 ml-0.5 transform translate-x-4"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Required for the website to function properly. These cannot be disabled.
                            </p>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <FaChartBar className="text-blue-600" />
                                    <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                                </div>
                                <label className="relative inline-block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                        className="appearance-none w-9 h-5 rounded-full bg-gray-200 cursor-pointer transition-colors duration-200 ease-in-out checked:bg-purple-600"
                                    />
                                    <div className="absolute inset-0 flex items-center pointer-events-none">
                                        <div className={`w-4 h-4 rounded-full bg-white ml-0.5 transform transition-transform duration-200 ease-in-out ${preferences.analytics ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                            <p className="text-sm text-gray-600">
                                Help us understand how visitors interact with our website by collecting anonymous information.
                            </p>
                        </div>

                        {/* Preference Cookies */}
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <FaCookieBite className="text-purple-600" />
                                    <h3 className="font-semibold text-gray-900">Preference Cookies</h3>
                                </div>
                                <label className="relative inline-block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.preferences}
                                        onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                                        className="appearance-none w-9 h-5 rounded-full bg-gray-200 cursor-pointer transition-colors duration-200 ease-in-out checked:bg-purple-600"
                                    />
                                    <div className="absolute inset-0 flex items-center pointer-events-none">
                                        <div className={`w-4 h-4 rounded-full bg-white ml-0.5 transform transition-transform duration-200 ease-in-out ${preferences.preferences ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                            <p className="text-sm text-gray-600">
                                Remember your settings and preferences for a better experience.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 