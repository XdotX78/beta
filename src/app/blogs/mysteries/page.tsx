"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaSearch, FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";

// Sample mystery blog posts data
const mysteryPosts = [
  {
    id: 7,
    title: "Jack the Ripper: The Enduring Mystery of Victorian London",
    excerpt: "London's most infamous serial killer remains unidentified over a century later, despite modern forensic analysis and countless investigations...",
    imageUrl: "/images/blog/jack-the-ripper.jpg",
    category: "historical",
    author: "xdotx",
    date: "March 5, 2025",
    readTime: "12 min read",
    featured: true
  },
  {
    id: 1,
    title: "The Voynich Manuscript: History's Most Mysterious Text",
    excerpt: "Explore the enigmatic 15th century manuscript that has confounded linguists, cryptographers and historians for centuries...",
    imageUrl: "/images/blog/voynich-manuscript.jpg",
    category: "ancient-mysteries",
    author: "Dr. Elena Fortham",
    date: "February 28, 2025",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "Bermuda Triangle: New Theories on the World's Deadliest Waters",
    excerpt: "Recent scientific investigations offer compelling explanations for the mysterious disappearances that have made this region infamous...",
    imageUrl: "/images/blog/bermuda-triangle.jpg",
    category: "unexplained-phenomena",
    author: "Marcus Chen",
    date: "February 25, 2025",
    readTime: "6 min read",
    featured: true
  },
  {
    id: 3,
    title: "The Nazca Lines: Messages to the Sky Gods?",
    excerpt: "New drone footage reveals previously undiscovered patterns in Peru's ancient geoglyphs, raising questions about their true purpose...",
    imageUrl: "/images/blog/nazca-lines.jpg",
    category: "ancient-mysteries",
    author: "Sofia Rodriguez",
    date: "February 21, 2025",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 4,
    title: "The Dyatlov Pass Incident: Case Reopened",
    excerpt: "Russian investigators have uncovered new evidence about the mysterious deaths of nine hikers in the Ural Mountains in 1959...",
    imageUrl: "/images/blog/dyatlov-pass.jpg",
    category: "unexplained-phenomena",
    author: "Ivan Petrov",
    date: "February 18, 2025",
    readTime: "10 min read",
    featured: false
  },
  {
    id: 5,
    title: "The Search for Cryptids: Science Meets Folklore",
    excerpt: "How modern scientific methods are being used to investigate legendary creatures from around the world...",
    imageUrl: "/images/blog/cryptids.jpg",
    category: "cryptids",
    author: "Dr. James Woodward",
    date: "February 15, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    id: 6,
    title: "Easter Island's Moai: The Statues That Walked?",
    excerpt: "Archaeological experiments demonstrate how ancient Polynesians might have transported the massive stone figures...",
    imageUrl: "/images/blog/easter-island.jpg",
    category: "ancient-mysteries",
    author: "Dr. Laura Hansen",
    date: "February 12, 2025",
    readTime: "9 min read",
    featured: false
  },
];

// Mystery categories with icons and descriptions
const categories = [
  { name: "Ancient Mysteries", slug: "ancient-mysteries", count: 42 },
  { name: "Unexplained Phenomena", slug: "unexplained-phenomena", count: 38 },
  { name: "Cryptids & Legends", slug: "cryptids", count: 27 },
  { name: "Paranormal", slug: "paranormal", count: 31 },
  { name: "Conspiracy Theories", slug: "conspiracy", count: 24 },
  { name: "Historical Enigmas", slug: "historical", count: 35 },
];

export default function MysteriesBlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter posts based on search query and selected category
  const filteredPosts = mysteryPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured posts (for the hero section)
  const featuredPosts = mysteryPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section with Featured Posts */}
      <div className="relative bg-cover bg-center h-[60vh]"
        style={{
          backgroundImage: "url('/images/blog/mysteries-background.svg')",
          backgroundPosition: "center 20%"
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/30 to-gray-900/90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: "url('/images/blog/fog-overlay.svg')",
          backgroundSize: "cover",
          opacity: 0.4,
          mixBlendMode: "screen"
        }}></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
          >
            Mysteries of the Unknown
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-300 drop-shadow-md"
          >
            Exploring the unexplained, the enigmatic, and the extraordinary from around the world
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-md"
          >
            <input
              type="text"
              placeholder="Search for mysteries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-12 rounded-full bg-gray-800/80 backdrop-blur-sm text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row">
          {/* Main Content */}
          <div className="w-full md:w-2/3 md:pr-8">
            {/* Featured Articles Carousel */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-purple-300 border-b border-purple-800 pb-2">Featured Mysteries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map(post => (
                    <Link href={`/blogs/mysteries/${post.id}`} key={post.id}>
                      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.01] hover:shadow-purple-900/30 hover:shadow-lg">
                        <div className="relative h-48">
                          <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                          {/* Replace with actual image when available */}
                          {/* <Image 
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                          /> */}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center mb-3">
                            <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-purple-900 text-purple-300">
                              {post.category.split('-').join(' ')}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center">
                              <FaCalendarAlt className="mr-1" size={10} />
                              {post.date}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-white">{post.title}</h3>
                          <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400 flex items-center">
                              <FaUser className="mr-1" size={12} />
                              {post.author}
                            </span>
                            <span className="text-sm text-purple-400">{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles Grid */}
            <h2 className="text-2xl font-bold mb-6 text-purple-300 border-b border-purple-800 pb-2">Latest Articles</h2>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-400">No mysteries found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <Link href={`/blogs/mysteries/${post.id}`} key={post.id}>
                    <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col transition-transform hover:scale-[1.01] hover:shadow-purple-900/30 hover:shadow-lg">
                      <div className="relative h-40">
                        <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                        {/* Replace with actual image when available */}
                        {/* <Image 
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        /> */}
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-medium mr-2 px-2 py-0.5 rounded bg-purple-900 text-purple-300">
                            {post.category.split('-').join(' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">{post.title}</h3>
                        <p className="text-gray-400 mb-3 text-sm line-clamp-2 flex-grow">{post.excerpt}</p>
                        <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" size={10} />
                            {post.date}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded border border-purple-700 text-purple-400 hover:bg-purple-900 transition-colors">Previous</button>
                <button className="px-3 py-1 rounded bg-purple-700 text-white">1</button>
                <button className="px-3 py-1 rounded border border-purple-700 text-purple-400 hover:bg-purple-900 transition-colors">2</button>
                <button className="px-3 py-1 rounded border border-purple-700 text-purple-400 hover:bg-purple-900 transition-colors">3</button>
                <button className="px-3 py-1 rounded border border-purple-700 text-purple-400 hover:bg-purple-900 transition-colors">Next</button>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3 mt-10 md:mt-0">
            {/* Categories */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-white">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex justify-between items-center ${selectedCategory === "" ? "bg-purple-900 text-white" : "text-gray-300 hover:bg-gray-700"
                      }`}
                  >
                    <span>All Categories</span>
                    <span className="text-sm bg-gray-700 px-2 py-0.5 rounded-full">
                      {mysteryPosts.length}
                    </span>
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.slug}>
                    <button
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors flex justify-between items-center ${selectedCategory === category.slug ? "bg-purple-900 text-white" : "text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm bg-gray-700 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-white">Popular Posts</h3>
              <ul className="space-y-4">
                {mysteryPosts.slice(0, 3).map(post => (
                  <li key={post.id} className="flex space-x-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                      <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                      {/* Replace with actual image when available */}
                      {/* <Image 
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200">{post.title}</h4>
                      <span className="text-xs text-gray-400">{post.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-white">Subscribe to Mysteries</h3>
              <p className="text-gray-300 text-sm mb-4">Get the latest unexplained phenomena delivered to your inbox.</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full py-2 px-4 rounded bg-gray-800 bg-opacity-50 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-600 text-white rounded font-medium transition-colors flex justify-center items-center">
                  Subscribe
                  <FaArrowRight className="ml-2" size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Related Content - Map Link */}
      <div className="bg-gray-800 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-10">
              <h3 className="text-2xl font-bold mb-2 text-white">Explore the Mystery Map</h3>
              <p className="text-gray-400 max-w-xl">
                See the locations of the world&apos;s greatest mysteries with our interactive global explorer.
              </p>
            </div>
            <Link href="/maps/mysteries" className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center">
              View Mystery Map
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 