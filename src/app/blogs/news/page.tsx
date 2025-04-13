"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaSearch, FaCalendarAlt, FaUser, FaArrowRight, FaGlobe, FaTag } from "react-icons/fa";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  subcategory?: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  subBlog?: string;
}

// News categories with their counts and colors
const newsCategories = [
  { id: "world-politics", name: "World & Politics", color: "bg-blue-600", icon: "📰" },
  { id: "wars", name: "WARS", color: "bg-red-600", icon: "⚔️" },
  { id: "science-tech", name: "Science & Tech", color: "bg-purple-600", icon: "🧠" },
  { id: "planet-people", name: "Planet & People", color: "bg-green-600", icon: "🌿" },
  { id: "culture-curiosities", name: "Culture & Curiosities", color: "bg-pink-600", icon: "🎭" },
];

// Sub-blogs data
const subBlogs = [
  {
    id: "ukraine",
    name: "Ukraine Conflict",
    description: "Ongoing coverage of the Ukraine-Russia war and its global impact",
    imageUrl: "/images/blog/ukraine.jpg",
    color: "from-blue-700 to-yellow-500",
  },
  {
    id: "palestine",
    name: "Palestine Crisis",
    description: "Updates on the humanitarian situation and peace efforts in Gaza",
    imageUrl: "/images/blog/palestine.jpg",
    color: "from-green-700 to-red-600 to-black",
  }
];

export default function NewsBlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Filter posts based on search query and selected category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured posts
  const featuredPosts = posts.filter(post => post.featured);

  // Get posts for each sub-blog
  const ukrainePosts = posts.filter(post => post.subBlog === "ukraine").slice(0, 3);
  const palestinePosts = posts.filter(post => post.subBlog === "palestine").slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[50vh]"
        style={{ backgroundImage: "url('/images/enhanced/news-blog-preview.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-white"
          >
            Global News & Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-200"
          >
            Comprehensive coverage of world events, politics, and breaking stories
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
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-12 rounded-full bg-white bg-opacity-95 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </motion.div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-gray-100 border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
            >
              All Topics
            </button>

            {newsCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id
                  ? `${category.color} text-white`
                  : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
              >
                <span className="mr-1">{category.icon}</span> {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Articles */}
        {featuredPosts.length > 0 && selectedCategory === "all" && searchQuery === "" && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Link href={`/blogs/news/${post.slug}`} key={post.slug} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="relative h-48 lg:h-56">
                      <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                      {/* Replace with actual image when available */}
                      {/* <Image 
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      /> */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md text-white ${newsCategories.find(c => c.id === post.category)?.color || 'bg-gray-700'}`}>
                          {newsCategories.find(c => c.id === post.category)?.icon} {newsCategories.find(c => c.id === post.category)?.name || post.category}
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
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">{post.excerpt}</p>
                      <div className="flex items-center mt-auto">
                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                        <span className="text-sm font-medium text-gray-900">{post.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sub-blogs Section */}
        {selectedCategory === "all" && searchQuery === "" && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Special Coverage</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ukraine Sub-blog */}
              <div className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col">
                <div className={`p-6 bg-gradient-to-r ${subBlogs[0].color} text-white`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{subBlogs[0].name}</h3>
                    <span className="text-sm bg-white bg-opacity-20 rounded-full px-3 py-1">
                      {ukrainePosts.length} articles
                    </span>
                  </div>
                  <p className="mt-2 text-white text-opacity-90">{subBlogs[0].description}</p>
                </div>
                <div className="p-6 flex-grow">
                  <ul className="space-y-4">
                    {ukrainePosts.map(post => (
                      <li key={post.slug}>
                        <Link href={`/blogs/news/${post.slug}`} className="flex space-x-3 group">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                            {/* Replace with actual image when available */}
                            {/* <Image 
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                            /> */}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h4>
                            <div className="flex items-center mt-1">
                              <FaCalendarAlt className="text-gray-500 mr-1" size={10} />
                              <span className="text-xs text-gray-500">{post.date}</span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link href="/blogs/news/ukraine" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      View all Ukraine coverage
                      <FaArrowRight className="ml-2" size={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Palestine Sub-blog */}
              <div className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col">
                <div className={`p-6 bg-gradient-to-r ${subBlogs[1].color} text-white`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{subBlogs[1].name}</h3>
                    <span className="text-sm bg-white bg-opacity-20 rounded-full px-3 py-1">
                      {palestinePosts.length} articles
                    </span>
                  </div>
                  <p className="mt-2 text-white text-opacity-90">{subBlogs[1].description}</p>
                </div>
                <div className="p-6 flex-grow">
                  <ul className="space-y-4">
                    {palestinePosts.map(post => (
                      <li key={post.slug}>
                        <Link href={`/blogs/news/${post.slug}`} className="flex space-x-3 group">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                            {/* Replace with actual image when available */}
                            {/* <Image 
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                            /> */}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h4>
                            <div className="flex items-center mt-1">
                              <FaCalendarAlt className="text-gray-500 mr-1" size={10} />
                              <span className="text-xs text-gray-500">{post.date}</span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link href="/blogs/news/palestine" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      View all Palestine coverage
                      <FaArrowRight className="ml-2" size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Major Conflicts Section - only shown when wars category is selected */}
        {selectedCategory === "wars" && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">⚔️ Major Conflicts</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Ukraine War */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 relative bg-gradient-to-r from-blue-500 to-yellow-400">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Ukraine War</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">Ongoing Russian invasion of Ukraine that began in February 2022, marking the largest conventional military attack in Europe since World War II.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 font-medium">Active Conflict</span>
                    <Link href="/blogs/news/ukraine" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Latest Updates <FaArrowRight className="ml-2" size={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Gaza/Israel Conflict */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 relative bg-gradient-to-r from-green-700 to-red-600 to-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Gaza-Israel Conflict</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">Intense conflict between Israel and Hamas that escalated in October 2023, resulting in thousands of casualties and a severe humanitarian crisis in Gaza.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 font-medium">Active Conflict</span>
                    <Link href="/blogs/news/palestine" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Latest Updates <FaArrowRight className="ml-2" size={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sudan Civil War */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 relative bg-gradient-to-r from-blue-900 via-white to-green-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Sudan Civil War</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">Ongoing conflict between the Sudanese Armed Forces and the paramilitary Rapid Support Forces since April 2023, causing mass displacement and a humanitarian crisis.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 font-medium">Active Conflict</span>
                    <Link href="/blogs/news/sudan" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Latest Updates <FaArrowRight className="ml-2" size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Myanmar Civil War */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 relative bg-gradient-to-r from-yellow-500 via-green-600 to-red-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Myanmar Civil War</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">Escalating conflict following the 2021 military coup, with multiple ethnic armed organizations and pro-democracy groups fighting against the military junta.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 font-medium">Active Conflict</span>
                    <Link href="/blogs/news/myanmar" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Latest Updates <FaArrowRight className="ml-2" size={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Ethiopia Conflicts */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 relative bg-gradient-to-r from-green-600 via-yellow-500 to-red-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Ethiopian Conflicts</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">Multiple regional conflicts in Ethiopia, including tensions in Tigray, Amhara, and Oromia regions, causing widespread displacement and humanitarian concerns.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 font-medium">Ongoing Instability</span>
                    <Link href="/blogs/news/ethiopia" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Latest Updates <FaArrowRight className="ml-2" size={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Taiwan Tensions */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 relative bg-gradient-to-r from-red-600 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Taiwan Strait Tensions</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">Escalating military tensions in the Taiwan Strait, with increased Chinese military activities including naval exercises, air incursions, and diplomatic pressure.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-600 font-medium">High Tension Zone</span>
                    <Link href="/blogs/news/taiwan" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Latest Updates <FaArrowRight className="ml-2" size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            {selectedCategory
              ? `${newsCategories.find(c => c.id === selectedCategory)?.icon || ''} ${newsCategories.find(c => c.id === selectedCategory)?.name || 'Category'} News`
              : searchQuery
                ? 'Search Results'
                : 'Latest News'
            }
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-4">No articles found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View all articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Link href={`/blogs/news/${post.slug}`} key={post.slug} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="relative h-48">
                      <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                      {/* Replace with actual image when available */}
                      {/* <Image 
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      /> */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md text-white ${newsCategories.find(c => c.id === post.category)?.color || 'bg-gray-700'}`}>
                          {newsCategories.find(c => c.id === post.category)?.icon} {newsCategories.find(c => c.id === post.category)?.name || post.category}
                        </span>
                      </div>
                      {post.subBlog && (
                        <div className="absolute top-3 right-3">
                          <span className="text-xs font-bold px-2 py-1 rounded-md bg-black text-white">
                            {post.subBlog.charAt(0).toUpperCase() + post.subBlog.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 flex items-center">
                          <FaCalendarAlt className="mr-1" size={10} />
                          {post.date}
                        </span>
                        <span className="text-xs text-gray-600">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-grow">{post.excerpt}</p>
                      <div className="flex items-center mt-auto pt-3 border-t border-gray-100">
                        <div className="w-7 h-7 rounded-full bg-gray-300 mr-2"></div>
                        <span className="text-sm text-gray-700">{post.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1">
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">Previous</button>
                <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">2</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">3</button>
                <span className="px-1">...</span>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">10</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">Next</button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Stay Informed</h2>
            <p className="text-lg text-gray-600 mb-8">Get the latest news and analysis delivered to your inbox weekly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow max-w-md"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>

      {/* Map CTA */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-8 md:p-12 md:w-1/2">
                <h2 className="text-3xl font-bold mb-4 text-white">Explore the News Map</h2>
                <p className="text-blue-100 text-lg mb-6">
                  Visualize global news and events with our interactive News Map. Track developments in real time across the world.
                </p>
                <Link href="/maps/news" className="inline-block px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                  View Global News Map
                </Link>
              </div>
              <div className="md:w-1/2 h-64 md:h-80 relative">
                <div className="absolute inset-0 bg-blue-300 animate-pulse"></div>
                {/* Replace with actual image when available */}
                {/* <Image 
                  src="/images/news-map-preview.jpg" 
                  alt="News Map Preview" 
                  fill
                  className="object-cover"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 