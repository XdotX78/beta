"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight, FaClock, FaMap, FaTag, FaSearch, FaHistory } from "react-icons/fa";
import { PostMetadata } from '@/app/lib/mdx';

// Static data for demonstration - replace with actual data from API
const STATIC_POSTS = [
  {
    slug: "gaza-humanitarian-crisis",
    title: "Gaza Humanitarian Crisis Deepens",
    description: "Analysis of the growing humanitarian challenges in Gaza and international aid efforts.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1705367094846-3263f7d3a776",
    date: "2024-04-15",
    author: "Sarah Ahmed",
    readTime: "7 min read",
    location: "Gaza City",
    category: "humanitarian",
    tags: ["gaza", "humanitarian", "aid", "crisis"],
    featured: true
  },
  {
    slug: "peace-talks-developments",
    title: "Latest Developments in Peace Negotiations",
    description: "Updates on diplomatic efforts and peace initiatives in the region.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1705367094846-3263f7d3a776",
    date: "2024-04-14",
    author: "Michael Cohen",
    readTime: "5 min read",
    location: "Cairo",
    category: "diplomacy",
    tags: ["peace-talks", "diplomacy", "negotiations"],
    featured: true
  }
];

export default function PalestineCoveragePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [posts, setPosts] = useState(STATIC_POSTS);

  const categories = Array.from(new Set(posts.map(post => post.category)));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Palestine Crisis Coverage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl"
          >
            In-depth reporting and analysis of events, humanitarian issues, and peace initiatives in the region.
          </motion.p>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category?.charAt(0).toUpperCase() + category?.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Featured Coverage</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <Link href={`/blogs/news/palestine/${post.slug}`} key={post.slug} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:transform group-hover:scale-[1.02]">
                    <div className="relative h-64">
                      <Image
                        src={post.imageUrl || 'https://images.unsplash.com/photo-1584535352018-8c5d5f666de4'}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        quality={75}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {post.readTime}
                        </span>
                        {post.location && (
                          <span className="flex items-center gap-1">
                            <FaMap />
                            {post.location}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags?.map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <FaArrowRight className="text-blue-600 transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Latest Updates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <Link href={`/blogs/news/palestine/${post.slug}`} key={post.slug} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:transform group-hover:scale-[1.02]">
                  <div className="relative h-48">
                    <Image
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1584535352018-8c5d5f666de4'}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      quality={75}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        By {post.author}
                      </span>
                      <FaArrowRight className="text-blue-600 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">No articles found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Right Column - Additional Information */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Key Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Key Statistics</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FaHistory className="text-blue-600" />
                <span>Latest Update: April 15, 2024</span>
              </li>
              {/* Add more statistics as needed */}
            </ul>
          </div>

          {/* Related Coverage */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Related Coverage</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/blogs/news/middle-east" className="text-blue-600 hover:underline">
                  Middle East Analysis
                </Link>
              </li>
              {/* Add more related links */}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get the latest updates delivered to your inbox.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 