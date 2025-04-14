export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>

                <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Cookie Policy</h2>
                    <p className="text-gray-700 mb-4">
                        This website uses cookies to enhance your browsing experience. Cookies are small text files that are stored on your device when you visit our website.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Types of Cookies We Use</h3>
                    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                        <li>
                            <strong>Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.
                        </li>
                        <li>
                            <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information.
                        </li>
                        <li>
                            <strong>Preference Cookies:</strong> Remember your settings and preferences for a better experience.
                        </li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">How We Use Cookies</h3>
                    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                        <li>To remember your preferences and settings</li>
                        <li>To improve our website's performance and user experience</li>
                        <li>To analyze how our website is used and optimize our services</li>
                        <li>To personalize your experience</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Managing Cookies</h3>
                    <p className="text-gray-700 mb-4">
                        You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our website and some services and functionalities may not work.
                    </p>
                </section>

                <section className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Data Collection and Usage</h2>
                    <p className="text-gray-700 mb-4">
                        We collect and process your data when you:
                    </p>
                    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                        <li>Visit our website</li>
                        <li>Use our interactive features</li>
                        <li>Subscribe to our newsletter</li>
                        <li>Contact us</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Your Rights</h3>
                    <p className="text-gray-700 mb-4">
                        Under data protection laws, you have rights including:
                    </p>
                    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                        <li>Your right of access</li>
                        <li>Your right to rectification</li>
                        <li>Your right to erasure</li>
                        <li>Your right to restrict processing</li>
                        <li>Your right to data portability</li>
                        <li>Your right to object</li>
                    </ul>
                </section>
            </div>
        </div>
    );
} 