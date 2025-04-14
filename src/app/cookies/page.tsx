"use client";

import { useState } from 'react';
import CookiePreferences from '../components/CookiePreferences';
import { FaCookieBite, FaShieldAlt, FaChartBar, FaCog } from 'react-icons/fa';

export default function CookiesPage() {
    const [showPreferences, setShowPreferences] = useState(false);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <FaCookieBite className="text-3xl text-purple-600" />
                    <h1 className="text-4xl font-bold">Cookie Policy</h1>
                </div>
                <p className="text-lg text-gray-600">
                    We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience.
                </p>
            </header>

            <div className="prose prose-lg max-w-none">
                <section className="mb-12">
                    <h2>What are Cookies?</h2>
                    <p>
                        Cookies are small text files that are placed on your device when you visit a website.
                        They are widely used to make websites work more efficiently, provide a better user experience,
                        and give website owners information about how their site is being used.
                    </p>
                </section>

                <section className="mb-12">
                    <h2>How We Use Cookies</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <FaShieldAlt className="text-2xl text-green-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Essential Cookies</h3>
                                <p className="text-gray-600">
                                    These cookies are necessary for the website to function properly. They enable basic
                                    functions like page navigation, access to secure areas, and maintaining your preferences.
                                    The website cannot function properly without these cookies.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <FaChartBar className="text-2xl text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Analytics Cookies</h3>
                                <p className="text-gray-600">
                                    These cookies help us understand how visitors interact with our website by collecting
                                    and reporting information anonymously. This helps us improve our website and your experience.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <FaCog className="text-2xl text-purple-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Preference Cookies</h3>
                                <p className="text-gray-600">
                                    These cookies enable the website to remember choices you make (such as your preferred
                                    language or the region you are in) and provide enhanced, more personal features.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2>Managing Your Cookie Preferences</h2>
                    <p>
                        You can manage your cookie preferences at any time. Click the button below to open the cookie
                        preferences panel and customize your settings.
                    </p>
                    <button
                        onClick={() => setShowPreferences(true)}
                        className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        <FaCog />
                        Manage Cookie Preferences
                    </button>
                </section>

                <section className="mb-12">
                    <h2>Browser Settings</h2>
                    <p>
                        You can also control cookies through your browser settings. Most browsers allow you to:
                    </p>
                    <ul>
                        <li>View cookies stored on your device</li>
                        <li>Block or allow cookies by default</li>
                        <li>Delete existing cookies</li>
                        <li>Set preferences for certain websites</li>
                    </ul>
                    <p>
                        Please note that blocking some types of cookies may impact your experience on our website
                        and the services we are able to offer.
                    </p>
                </section>

                <section>
                    <h2>Updates to This Policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time to reflect changes in technology,
                        legislation, or our data practices. We encourage you to periodically review this page
                        for the latest information on our cookie practices.
                    </p>
                </section>
            </div>

            <CookiePreferences
                isOpen={showPreferences}
                onClose={() => setShowPreferences(false)}
            />
        </div>
    );
} 