"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight, FaClock, FaMap, FaTag, FaSearch, FaHistory, FaHeartbeat, FaHandsHelping } from "react-icons/fa";
import type { Post } from "./page";

// Categories for filtering
const categories = [
    { id: "all", name: "All Updates" },
    { id: "humanitarian", name: "Humanitarian Crisis" },
    { id: "diplomacy", name: "Peace Initiatives" },
    { id: "aid", name: "Aid & Relief" },
    { id: "health", name: "Healthcare" },
    { id: "society", name: "Society & Culture" },
    { id: "development", name: "Development" },
];

interface PalestineCrisisContentProps {
    initialPosts: Post[];
}

export function PalestineCrisisContent({ initialPosts }: PalestineCrisisContentProps) {
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
                style={{ backgroundImage: "url('/images/blog/palestine-hero.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-black/60 to-red-500/30"></div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-10">
                    <div className="flex items-center text-white text-sm mb-4">
                        <Link href="/blogs/news" className="hover:underline">News</Link>
                        <span className="mx-2">/</span>
                        <span>Palestine Crisis</span>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold mb-4 text-white"
                    >
                        Palestine Crisis
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-100"
                    >
                        In-depth coverage of humanitarian developments, peace initiatives, and ongoing situation
                    </motion.p>

                    <div className="flex flex-wrap gap-4 text-sm text-white">
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                            <FaHeartbeat className="mr-2" />
                            <span>Humanitarian Updates</span>
                        </div>
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                            <FaMap className="mr-2" />
                            <Link href="/maps/news?region=palestine" className="hover:underline">
                                View on News Map
                            </Link>
                        </div>
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                            <FaHandsHelping className="mr-2" />
                            <Link href="/aid-initiatives" className="hover:underline">
                                Aid Initiatives
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
                                    placeholder="Search Palestine updates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2 px-4 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                                {categoriesWithCounts.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} ({category.count})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Featured Articles - Only show when not filtering */}
                        {searchQuery === "" && selectedCategory === "all" && featuredPosts.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">Latest Developments</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredPosts.map(post => (
                                        <Link href={`/blogs/news/palestine/${post.slug}`} key={post.slug} className="group">
                                            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                                                <div className="relative h-48">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <span className="text-xs font-bold px-2 py-1 rounded-md text-white bg-green-600">
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
                                                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">{post.title}</h3>
                                                    <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-grow">{post.excerpt}</p>
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
                                    : "All Palestine Coverage"
                                }
                            </h2>

                            {filteredPosts.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-xl">
                                    <p className="text-xl text-gray-600 mb-4">No articles found matching your search.</p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        View all articles
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {filteredPosts.map(post => (
                                        <Link href={`/blogs/news/palestine/${post.slug}`} key={post.slug} className="group">
                                            <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                                                <div className="relative h-48 sm:h-auto sm:w-48 sm:min-w-[12rem]">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="p-6 flex-grow">
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <FaCalendarAlt size={12} />
                                                            {post.date}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FaClock size={12} />
                                                            {post.readTime}
                                                        </span>
                                                        {post.location && (
                                                            <span className="flex items-center gap-1">
                                                                <FaMap size={12} />
                                                                {post.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                                                            Read more <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
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

                    {/* Right Column - Additional Content */}
                    <div className="lg:w-1/3">
                        {/* Quick Stats */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-bold mb-4">Crisis Overview</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaHeartbeat className="text-red-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Humanitarian Aid Needed</p>
                                        <p className="font-semibold">2.2M People</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaHandsHelping className="text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Aid Organizations Active</p>
                                        <p className="font-semibold">150+ Organizations</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Resources */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold mb-4">Related Resources</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/aid-initiatives" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
                                        <FaHandsHelping />
                                        <span>How to Help</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/maps/news?region=palestine" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
                                        <FaMap />
                                        <span>Interactive Crisis Map</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/timeline" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
                                        <FaHistory />
                                        <span>Crisis Timeline</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 