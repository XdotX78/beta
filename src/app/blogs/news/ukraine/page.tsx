"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight, FaClock, FaMap, FaTag, FaSearch, FaHistory } from "react-icons/fa";

// Sample Ukraine conflict posts
const ukrainePosts = [
  {
    id: 1,
    title: "Major Breakthrough: Peace Talks Progress as Sides Agree to Comprehensive Negotiation Framework",
    excerpt: "Ukrainian and Russian negotiators have reached preliminary agreement on key discussion points for future peace negotiations...",
    imageUrl: "/images/blog/ukraine-peace-talks.jpg",
    category: "diplomacy",
    author: "Natalia Kovalenko",
    date: "March 5, 2025",
    readTime: "5 min read",
    location: "Geneva",
    featured: true
  },
  {
    id: 8,
    title: "Ukraine's Historical Context: From Kyivan Rus to Modern Nation",
    excerpt: "Understanding the complex historical forces that shaped Ukraine helps illuminate the current conflict and the nation's struggle for sovereignty...",
    imageUrl: "/images/blog/ukraine-history.jpg",
    category: "historical",
    author: "xdotdx",
    date: "March 2, 2025",
    readTime: "10 min read",
    location: "Kyiv",
    featured: true
  },
  {
    id: 7,
    title: "Ukraine Peace Talks Resume After Military Stalemate",
    excerpt: "Diplomatic negotiations have restarted following a prolonged stalemate on the eastern front, with cautious optimism from international observers...",
    imageUrl: "/images/blog/ukraine-talks.jpg",
    category: "diplomacy",
    author: "Olena Kovalenko",
    date: "February 23, 2025",
    readTime: "6 min read",
    location: "Geneva",
    featured: true
  },
  {
    id: 11,
    title: "Russian Forces Withdraw from Key Ukrainian Border Region",
    excerpt: "Strategic redeployment signals a shift in Russian military strategy as international sanctions continue to impact logistics...",
    imageUrl: "/images/blog/russian-withdrawal.jpg",
    category: "military",
    author: "Viktor Petrov",
    date: "February 19, 2025",
    readTime: "7 min read",
    location: "Kharkiv",
    featured: true
  },
  {
    id: 13, // New article not in main list
    title: "Ukrainian Energy Infrastructure Rebuilding Efforts Show Progress",
    excerpt: "International funding has helped restore 70% of damaged power generation capacity despite ongoing security challenges...",
    imageUrl: "/images/blog/ukraine-energy.jpg",
    category: "infrastructure",
    author: "Taras Shevchenko",
    date: "February 15, 2025",
    readTime: "5 min read",
    location: "Kyiv",
    featured: false
  },
  {
    id: 14, // New article not in main list
    title: "New EU Aid Package for Ukraine Includes Advanced Defense Systems",
    excerpt: "European Union announces €5 billion in military aid with a focus on air defense and communication technology...",
    imageUrl: "/images/blog/eu-ukraine-aid.jpg",
    category: "international",
    author: "Marie Dubois",
    date: "February 12, 2025",
    readTime: "4 min read",
    location: "Brussels",
    featured: false
  },
  {
    id: 15, // New article not in main list
    title: "Humanitarian Corridors Established in Eastern Ukraine Regions",
    excerpt: "UN-brokered agreement allows civilian evacuations from contested territories as winter conditions worsen...",
    imageUrl: "/images/blog/ukraine-humanitarian.jpg",
    category: "humanitarian",
    author: "Olena Kovalenko",
    date: "February 8, 2025",
    readTime: "6 min read",
    location: "Donbas",
    featured: false
  },
  {
    id: 16, // New article not in main list
    title: "Ukraine's Agricultural Exports Reach Pre-War Levels",
    excerpt: "Grain corridor agreement extension enables record shipping volumes, boosting the war-torn country's economy...",
    imageUrl: "/images/blog/ukraine-agriculture.jpg",
    category: "economy",
    author: "Iryna Fedorova",
    date: "February 4, 2025",
    readTime: "5 min read",
    location: "Odesa",
    featured: false
  },
  {
    id: 17, // New article not in main list
    title: "International Criminal Court Issues New Warrants Related to Ukraine Conflict",
    excerpt: "The Hague announces indictments for alleged war crimes committed during the offensive in eastern Ukraine...",
    imageUrl: "/images/blog/icc-ukraine.jpg",
    category: "legal",
    author: "Willem van der Berg",
    date: "January 30, 2025",
    readTime: "8 min read",
    location: "The Hague",
    featured: false
  },
  {
    id: 18, // New article not in main list
    title: "Russian Cyber Operations Against Ukrainian Infrastructure Intensify",
    excerpt: "Security experts report increased digital attacks targeting power grids and communication networks...",
    imageUrl: "/images/blog/ukraine-cyber.jpg",
    category: "technology",
    author: "Alex Kowalski",
    date: "January 27, 2025",
    readTime: "6 min read",
    location: "Kyiv",
    featured: false
  }
];

// Timeline events
const timelineEvents = [
  {
    date: "February 2025",
    events: [
      {
        day: "23",
        title: "Peace Talks Resume in Geneva",
        description: "Representatives from Ukraine, Russia, and international mediators meet in Switzerland."
      },
      {
        day: "19",
        title: "Russian Forces Withdraw from Border Region",
        description: "Significant redeployment observed in northeastern territories."
      },
      {
        day: "15",
        title: "Energy Infrastructure Restoration Milestone",
        description: "70% of damaged power generation capacity restored across Ukraine."
      },
      {
        day: "12",
        title: "New EU Aid Package Announced",
        description: "€5 billion in military aid approved by European Commission."
      },
      {
        day: "8",
        title: "Humanitarian Corridors Established",
        description: "UN-brokered agreement to allow civilian evacuations from contested areas."
      },
      {
        day: "4",
        title: "Agricultural Exports Reach Pre-War Levels",
        description: "Grain corridor enables record shipping volumes from Ukrainian ports."
      }
    ]
  },
  {
    date: "January 2025",
    events: [
      {
        day: "30",
        title: "ICC Issues New Warrants",
        description: "International Criminal Court announces indictments for alleged war crimes."
      },
      {
        day: "27",
        title: "Cyber Attacks Intensify",
        description: "Increase in digital operations against Ukrainian infrastructure reported."
      },
      {
        day: "18",
        title: "Diplomatic Summit in Warsaw",
        description: "NATO and EU representatives discuss long-term security architecture."
      },
      {
        day: "7",
        title: "Eastern Front Stalemate Declared",
        description: "Military analysts confirm static positions after winter offensive fails."
      }
    ]
  }
];

// Categories for filtering
const categories = [
  { id: "all", name: "All Updates", count: ukrainePosts.length },
  { id: "historical", name: "Historical Context", count: 1 },
  { id: "diplomacy", name: "Diplomatic Developments", count: 2 },
  { id: "military", name: "Military Operations", count: 1 },
  { id: "humanitarian", name: "Humanitarian Crisis", count: 1 },
  { id: "infrastructure", name: "Infrastructure", count: 1 },
  { id: "economy", name: "Economic Impact", count: 1 },
  { id: "international", name: "International Support", count: 1 },
  { id: "legal", name: "Legal Proceedings", count: 1 },
  { id: "technology", name: "Cyber & Technology", count: 1 },
];

export default function UkraineConflictPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Filter posts based on search query and selected category
  const filteredPosts = ukrainePosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Get featured posts
  const featuredPosts = ukrainePosts.filter(post => post.featured);
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[50vh]" 
           style={{ backgroundImage: "url('/images/blog/ukraine-hero.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-yellow-500/30"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-10">
          <div className="flex items-center text-white text-sm mb-4">
            <Link href="/blogs/news" className="hover:underline">News</Link>
            <span className="mx-2">/</span>
            <span>Ukraine Conflict</span>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-white"
          >
            Ukraine Conflict
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl text-blue-100"
          >
            Comprehensive coverage of the ongoing conflict, peace efforts, and humanitarian situation
          </motion.p>
          
          <div className="flex flex-wrap gap-4 text-sm text-white">
            <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
              <FaHistory className="mr-2" />
              <span>Updates since February 2022</span>
            </div>
            <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
              <FaMap className="mr-2" />
              <Link href="/maps/news?region=ukraine" className="hover:underline">
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
                  placeholder="Search Ukraine updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map(category => (
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
                    <Link href={`/blogs/news/${post.id}`} key={post.id} className="group">
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
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
                            <span className="text-xs font-bold px-2 py-1 rounded-md text-white bg-blue-600">
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
                          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
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
            
            {/* Timeline - Only show when not filtering */}
            {searchQuery === "" && selectedCategory === "all" && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Conflict Timeline</h2>
                <div className="border-l-2 border-blue-500 pl-6 ml-3 space-y-10">
                  {timelineEvents.map((month, monthIndex) => (
                    <div key={monthIndex}>
                      <h3 className="text-xl font-bold text-gray-900 -ml-8 bg-white py-1 inline-block">{month.date}</h3>
                      <div className="space-y-6 mt-4">
                        {month.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="relative">
                            <div className="absolute -left-9 w-4 h-4 rounded-full bg-blue-500"></div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <div className="text-xl font-bold text-blue-600 sm:w-12">{event.day}</div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                                <p className="text-gray-600">{event.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* All Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {searchQuery !== "" || selectedCategory !== "all" 
                  ? `${filteredPosts.length} Articles Found` 
                  : "All Ukraine Coverage"
                }
              </h2>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <p className="text-xl text-gray-600 mb-4">No articles found matching your search.</p>
                  <button 
                    onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View all articles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredPosts.map(post => (
                    <Link href={`/blogs/news/${post.id}`} key={post.id} className="group">
                      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                        <div className="relative h-48 sm:h-auto sm:w-48 sm:min-w-[12rem]">
                          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                          {/* Replace with actual image when available */}
                          {/* <Image 
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                          /> */}
                        </div>
                        <div className="p-5 flex flex-col">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-xs font-bold px-2 py-1 rounded-md text-white bg-blue-600">
                              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <FaCalendarAlt className="mr-1" size={10} />
                              {post.date}
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <FaClock className="mr-1" size={10} />
                              {post.readTime}
                            </span>
                            {post.location && (
                              <span className="text-xs text-gray-600 flex items-center">
                                <FaMap className="mr-1" size={10} />
                                {post.location}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                          <p className="text-gray-600 mb-3 text-sm">{post.excerpt}</p>
                          <div className="mt-auto text-blue-600 text-sm font-medium flex items-center group-hover:text-blue-800 transition-colors">
                            Read full story
                            <FaArrowRight className="ml-1" size={12} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Info and Resources */}
          <div className="lg:w-1/3 mt-10 lg:mt-0">
            {/* About This Coverage */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">About This Coverage</h3>
              <p className="text-gray-700 mb-4">
                Our Ukraine Conflict coverage provides comprehensive reporting on diplomatic, military, humanitarian, and economic developments related to the ongoing conflict in Ukraine.
              </p>
              <p className="text-gray-700 mb-4">
                Our team of correspondents across Europe, including within Ukraine, delivers timely updates and in-depth analysis of this complex international crisis.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Link 
                  href="/maps/news?region=ukraine" 
                  className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <FaMap className="mr-1" size={10} />
                  Interactive Map
                </Link>
                <Link 
                  href="/blogs/news?tag=ukraine-analysis" 
                  className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <FaTag className="mr-1" size={10} />
                  Analysis
                </Link>
                <Link 
                  href="/blogs/news?tag=ukraine-opinion" 
                  className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <FaTag className="mr-1" size={10} />
                  Opinion
                </Link>
              </div>
            </div>
            
            {/* Key Statistics */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Key Facts</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Conflict Duration</p>
                  <p className="text-lg font-semibold">3 years</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">International Aid (2024-25)</p>
                  <p className="text-lg font-semibold">$48.7 billion</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Displaced Persons</p>
                  <p className="text-lg font-semibold">6.7 million (internal)</p>
                  <p className="text-lg font-semibold">5.9 million (external)</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Territory Status</p>
                  <p className="text-lg font-semibold">18% under occupation</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Peace Talks Status</p>
                  <p className="text-lg font-semibold">Ongoing in Geneva</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Source: UN, World Bank, OSCE (updated February 2025)
              </div>
            </div>
            
            {/* Related Coverage */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Related Coverage</h3>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <Link href="/blogs/news/palestine" className="block group">
                  <div className="relative h-32">
                    <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                    {/* Replace with actual image when available */}
                    {/* <Image 
                      src="/images/blog/palestine-hero.jpg"
                      alt="Palestine Crisis"
                      fill
                      className="object-cover"
                    /> */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                    <div className="absolute bottom-0 w-full p-4">
                      <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">Palestine Crisis</h4>
                      <p className="text-sm text-gray-300">Coverage of the ongoing situation in Gaza</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600 to-yellow-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Ukraine Updates</h3>
              <p className="text-white text-opacity-90 text-sm mb-4">Get daily briefings on the Ukraine conflict and peace process.</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full py-2 px-4 rounded bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 border border-white border-opacity-40 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" id="dailyUpdates" className="rounded text-blue-800" />
                  <label htmlFor="dailyUpdates">I agree to receive daily updates</label>
                </div>
                <button className="w-full py-2 px-4 bg-white text-blue-700 hover:bg-blue-100 rounded font-medium transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map CTA */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-8 md:p-12 md:w-1/2">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Explore Ukraine on the News Map</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Visualize the latest developments across Ukraine with our interactive map. Track military movements, humanitarian efforts, and diplomatic initiatives.
                </p>
                <Link href="/maps/news?region=ukraine" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  View Ukraine News Map
                </Link>
              </div>
              <div className="md:w-1/2 h-64 md:h-80 relative">
                <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                {/* Replace with actual image when available */}
                {/* <Image 
                  src="/images/ukraine-map-preview.jpg" 
                  alt="Ukraine News Map Preview" 
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