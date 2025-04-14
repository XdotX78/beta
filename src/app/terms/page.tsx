"use client";

import { FaGavel, FaUserShield, FaExclamationTriangle, FaCopyright, FaEnvelope } from 'react-icons/fa';

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <FaGavel className="text-3xl text-purple-600" />
                    <h1 className="text-4xl font-bold">Terms of Service</h1>
                </div>
                <p className="text-lg text-gray-600">
                    Please read these terms and conditions carefully before using our service.
                </p>
            </header>

            <div className="prose prose-lg max-w-none">
                <section className="mb-12">
                    <h2>1. Agreement to Terms</h2>
                    <p>
                        By accessing or using our website, you agree to be bound by these Terms of Service.
                        If you disagree with any part of the terms, you may not access the service.
                    </p>
                </section>

                <section className="mb-12">
                    <h2>2. Intellectual Property</h2>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <FaCopyright className="text-2xl text-purple-600 mt-1" />
                        <div>
                            <p className="text-gray-600">
                                The service and its original content, features, and functionality are owned by
                                Gaia Explorer and are protected by international copyright, trademark, patent,
                                trade secret, and other intellectual property or proprietary rights laws.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2>3. User Accounts</h2>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <FaUserShield className="text-2xl text-blue-600 mt-1" />
                        <div>
                            <p className="text-gray-600">
                                When you create an account with us, you must provide accurate, complete, and
                                up-to-date information. Failure to do so constitutes a breach of the Terms,
                                which may result in immediate termination of your account.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2>4. Acceptable Use</h2>
                    <p>You agree not to use the Service:</p>
                    <ul>
                        <li>In any way that violates any applicable laws or regulations</li>
                        <li>To transmit or send any harmful or malicious code</li>
                        <li>To impersonate or attempt to impersonate another person or entity</li>
                        <li>To interfere with or disrupt the service or servers</li>
                        <li>To collect or track personal information of others</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2>5. Content Guidelines</h2>
                    <p>
                        Users may post, upload, or share content through our service. By doing so, you grant us
                        a non-exclusive, worldwide, royalty-free license to use, copy, modify, and display the content
                        in connection with the service.
                    </p>
                </section>

                <section className="mb-12">
                    <h2>6. Termination</h2>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <FaExclamationTriangle className="text-2xl text-yellow-600 mt-1" />
                        <div>
                            <p className="text-gray-600">
                                We may terminate or suspend your account immediately, without prior notice or liability,
                                for any reason, including breach of these Terms. Upon termination, your right to use
                                the service will immediately cease.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2>7. Limitation of Liability</h2>
                    <p>
                        In no event shall Gaia Explorer, nor its directors, employees, partners, agents, suppliers,
                        or affiliates, be liable for any indirect, incidental, special, consequential, or punitive
                        damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                        losses.
                    </p>
                </section>

                <section className="mb-12">
                    <h2>8. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify or replace these Terms at any time. If a revision is material,
                        we will try to provide at least 30 days' notice prior to any new terms taking effect.
                    </p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us:
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <FaEnvelope className="text-purple-600" />
                        <a href="mailto:legal@gaiaexplorer.com" className="text-purple-600 hover:text-purple-700">
                            legal@gaiaexplorer.com
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
} 