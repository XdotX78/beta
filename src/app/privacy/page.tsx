"use client";

import { FaShieldAlt, FaUserSecret, FaDatabase, FaEnvelope } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <FaShieldAlt className="text-3xl text-purple-600" />
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </div>
                <p className="text-lg text-gray-600">
                    Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
                </p>
            </header>

            <div className="prose prose-lg max-w-none">
                <section className="mb-12">
                    <h2>Information We Collect</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <FaUserSecret className="text-2xl text-purple-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Personal Information</h3>
                                <p className="text-gray-600">
                                    We may collect personal information such as your name, email address, and profile information
                                    when you create an account or interact with our services.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <FaDatabase className="text-2xl text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Usage Data</h3>
                                <p className="text-gray-600">
                                    We collect information about how you use our website, including pages visited,
                                    time spent on pages, and other analytics data to improve our services.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2>How We Use Your Information</h2>
                    <p>We use the collected information for various purposes:</p>
                    <ul>
                        <li>To provide and maintain our services</li>
                        <li>To notify you about changes to our services</li>
                        <li>To provide customer support</li>
                        <li>To gather analysis or valuable information to improve our services</li>
                        <li>To monitor the usage of our services</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2>Data Protection</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information.
                        However, no method of transmission over the Internet or electronic storage is 100% secure,
                        and we cannot guarantee absolute security.
                    </p>
                </section>

                <section className="mb-12">
                    <h2>Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Correct inaccurate personal data</li>
                        <li>Request deletion of your personal data</li>
                        <li>Object to processing of your personal data</li>
                        <li>Request restriction of processing your personal data</li>
                        <li>Request transfer of your personal data</li>
                        <li>Withdraw consent</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2>Third-Party Services</h2>
                    <p>
                        Our service may contain links to other websites that are not operated by us. We have no control over
                        and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                    </p>
                </section>

                <section className="mb-12">
                    <h2>Children's Privacy</h2>
                    <p>
                        Our services are not intended for use by children under the age of 13. We do not knowingly collect
                        personal information from children under 13.
                    </p>
                </section>

                <section className="mb-12">
                    <h2>Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                        the new Privacy Policy on this page and updating the "last updated" date.
                    </p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <FaEnvelope className="text-purple-600" />
                        <a href="mailto:privacy@gaiaexplorer.com" className="text-purple-600 hover:text-purple-700">
                            privacy@gaiaexplorer.com
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
} 