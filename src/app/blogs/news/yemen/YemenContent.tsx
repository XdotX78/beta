"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight, FaClock, FaMap, FaTag, FaSearch, FaHistory } from "react-icons/fa";
import type { Post } from "./types";

// Categories for filtering
const categories = [
    { id: "all", name: "All Updates" },
    { id: "military", name: "Military Operations" },
    { id: "diplomacy", name: "Peace Initiatives" },
    { id: "humanitarian", name: "Humanitarian Aid" },
    { id: "politics", name: "Politics" },
    { id: "society", name: "Society & Impact" },
    { id: "economy", name: "Economy" },
];

interface YemenContentProps {
    initialPosts: Post[];
}

export default function YemenContent({ initialPosts }: YemenContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [posts] = useState(initialPosts);

    // Filter posts based on search query and selected category
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get featured posts
    const featuredPosts = posts.filter(post => post.featured);

    // Update category counts
    const categoriesWithCounts = categories.map(cat => ({
        ...cat,
        count: cat.id === "all" ? posts.length : posts.filter(post => post.category === cat.id).length
    }));

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-[50vh]"
                style={{ backgroundImage: "url('/images/blog/yemen-hero.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-red-900/60 to-black/30"></div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-10">
                    <div className="flex items-center text-white text-sm mb-4">
                        <Link href="/blogs/news" className="hover:underline">News</Link>
                        <span className="mx-2">/</span>
                        <span>Yemen Crisis</span>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold mb-4 text-white"
                    >
                        Yemen Crisis
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl mb-8 max-w-2xl text-red-100"
                    >
                        In-depth coverage of humanitarian developments, peace initiatives, and ongoing situation
                    </motion.p>

                    <div className="flex flex-wrap gap-4 text-sm text-white">
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                            <FaHistory className="mr-2" />
                            <span>Crisis Updates</span>
                        </div>
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                            <FaMap className="mr-2" />
                            <Link href="/maps/news?region=yemen" className="hover:underline">
                                View on News Map
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column - Timeline and Articles */}
                    <div className="lg:w-2/3">
                        {/* Search and Filter Bar */}
                        <div className="mb-10 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search Yemen updates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2 px-4 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                            >
                                {categoriesWithCounts.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} ({category.count})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Featured Articles */}
                        {searchQuery === "" && selectedCategory === "all" && featuredPosts.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">Latest Developments</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredPosts.map(post => (
                                        <Link href={`/blogs/news/yemen/${post.slug}`} key={post.slug} className="group">
                                            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                                                <div className="relative h-48">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <span className="text-xs font-bold px-2 py-1 rounded-md text-white bg-red-600">
                                                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5 flex-grow flex flex-col">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs text-gray-600 flex items-center">
                                                            <FaCalendarAlt className="mr-1" size={10} />
                                                            {post.date}
                                                        </span>
                                                        <span className="text-xs text-gray-600">{post.readTime}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-grow">
                                                        {post.excerpt}
                                                    </p>
                                                    {post.location && (
                                                        <div className="flex items-center text-xs text-gray-500 mb-3">
                                                            <FaMap className="mr-1" size={10} />
                                                            {post.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Articles */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">
                                {searchQuery !== "" || selectedCategory !== "all"
                                    ? `${filteredPosts.length} Articles Found`
                                    : "All Yemen Coverage"
                                }
                            </h2>

                            {filteredPosts.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-xl">
                                    <p className="text-xl text-gray-600 mb-4">No articles found matching your search.</p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        View all articles
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {filteredPosts.map(post => (
                                        <Link href={`/blogs/news/yemen/${post.slug}`} key={post.slug} className="group">
                                            <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                                                <div className="relative h-48 sm:h-auto sm:w-48 sm:min-w-[12rem]">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="p-5 flex-grow">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs text-gray-600 flex items-center">
                                                            <FaCalendarAlt className="mr-1" size={10} />
                                                            {post.date}
                                                        </span>
                                                        <span className="text-xs text-gray-600">{post.readTime}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{post.excerpt}</p>
                                                    <div className="flex items-center justify-between">
                                                        {post.location && (
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <FaMap className="mr-1" size={10} />
                                                                {post.location}
                                                            </div>
                                                        )}
                                                        <span className="text-xs font-bold px-2 py-1 rounded-full text-red-600 bg-red-50">
                                                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:w-1/3">
                        {/* About This Coverage */}
                        <div className="bg-red-50 rounded-xl p-6 mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">About This Coverage</h3>
                            <p className="text-gray-700 mb-4">
                                Our Yemen coverage provides comprehensive reporting on humanitarian developments,
                                peace initiatives, and the ongoing situation affecting millions of people.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Our team of correspondents across the region delivers timely updates and in-depth analysis
                                of this complex humanitarian crisis.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <Link
                                    href="/maps/news?region=yemen"
                                    className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                >
                                    <FaMap className="mr-1" size={10} />
                                    Interactive Map
                                </Link>
                                <Link
                                    href="/blogs/news?tag=yemen-analysis"
                                    className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                >
                                    <FaTag className="mr-1" size={10} />
                                    Analysis
                                </Link>
                            </div>
                        </div>

                        {/* Key Facts */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Key Facts</h3>
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-3">
                                    <p className="text-sm text-gray-500">Humanitarian Need</p>
                                    <p className="text-lg font-semibold">21.6 million people</p>
                                </div>
                                <div className="border-b border-gray-200 pb-3">
                                    <p className="text-sm text-gray-500">Displaced Population</p>
                                    <p className="text-lg font-semibold">4.5 million people</p>
                                </div>
                                <div className="border-b border-gray-200 pb-3">
                                    <p className="text-sm text-gray-500">Aid Organizations</p>
                                    <p className="text-lg font-semibold">120+ active NGOs</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Required Aid</p>
                                    <p className="text-lg font-semibold">$4.3 billion (2024)</p>
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-500">
                                Source: UN OCHA, UNHCR (2024)
                            </div>
                        </div>

                        {/* Related Coverage */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Related Coverage</h3>
                            <div className="space-y-4">
                                <Link href="/blogs/news/sudan" className="block group">
                                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="relative h-32">
                                            <Image
                                                src="/images/blog/sudan-hero.jpg"
                                                alt="Sudan Crisis"
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                                            <div className="absolute bottom-0 w-full p-4">
                                                <h4 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
                                                    Sudan Crisis
                                                </h4>
                                                <p className="text-sm text-gray-300">Latest developments in Sudan</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 