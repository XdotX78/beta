"use client";

import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const navigation = {
        main: [
            { name: 'Home', href: '/' },
            { name: 'Mysteries', href: '/mysteries' },
            { name: 'About', href: '/about' },
            { name: 'Contact', href: '/contact' },
        ],
        categories: [
            { name: 'True Crime', href: '/category/true-crime' },
            { name: 'Cold Cases', href: '/category/cold-cases' },
            { name: 'Historical Mysteries', href: '/category/historical' },
            { name: 'Unsolved Disappearances', href: '/category/disappearances' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Use', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
        ],
    };

    const social = [
        { name: 'Twitter', href: 'https://twitter.com/mysterychronicles', icon: FaTwitter },
        { name: 'Instagram', href: 'https://instagram.com/mysterychronicles', icon: FaInstagram },
        { name: 'GitHub', href: 'https://github.com/mysterychronicles', icon: FaGithub },
        { name: 'LinkedIn', href: 'https://linkedin.com/company/mysterychronicles', icon: FaLinkedin },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand and Description */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-purple-400">Mystery Chronicles</h2>
                        <p className="text-gray-400 text-sm">
                            Exploring the world's most intriguing mysteries, unsolved cases, and
                            true crime stories. Join us on a journey through the unexplained.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {navigation.main.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {navigation.categories.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social and Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4 mb-6">
                            {social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-purple-400 transition-colors"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                        <ul className="space-y-2">
                            {navigation.legal.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Mystery Chronicles. All rights reserved.
                        </p>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="mt-4 md:mt-0 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Back to top ↑
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
} 