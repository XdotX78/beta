"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight, FaClock, FaMap, FaTag, FaSearch, FaHistory } from "react-icons/fa";

// Sample Palestine crisis posts
const palestinePosts = [
  {
    id: 8,
    title: "Humanitarian Aid Reaches Gaza as Ceasefire Holds",
    excerpt: "Aid convoys have successfully delivered critical supplies to civilians in Gaza as the temporary ceasefire enters its second week...",
    imageUrl: "/images/blog/gaza-aid.jpg",
    category: "humanitarian",
    author: "Tariq Masri",
    date: "February 22, 2025",
    readTime: "5 min read",
    location: "Gaza City",
    featured: true
  },
  {
    id: 12,
    title: "UN Security Council Votes on New Resolution for Gaza Reconstruction",
    excerpt: "A United Nations resolution for comprehensive rebuilding efforts in Gaza has received widespread support in the Security Council...",
    imageUrl: "/images/blog/gaza-reconstruction.jpg",
    category: "diplomacy",
    author: "Layla Hassan",
    date: "February 18, 2025",
    readTime: "6 min read",
    location: "New York",
    featured: true
  },
  {
    id: 21, // New article not in main list
    title: "Water Infrastructure Restoration Project Launches in Southern Gaza",
    excerpt: "International NGOs begin work on critical water treatment facilities to address ongoing public health concerns...",
    imageUrl: "/images/blog/gaza-water.jpg",
    category: "infrastructure",
    author: "Mohammed Khalil",
    date: "February 15, 2025",
    readTime: "4 min read",
    location: "Rafah",
    featured: false
  },
  {
    id: 22, // New article not in main list
    title: "Medical Supplies Shortage Persists Despite Aid Deliveries",
    excerpt: "Hospitals report continued difficulties obtaining specialized equipment and medications despite increased aid flow...",
    imageUrl: "/images/blog/gaza-medical.jpg",
    category: "healthcare",
    author: "Dr. Sarah Ahmad",
    date: "February 12, 2025",
    readTime: "7 min read",
    location: "Khan Younis",
    featured: false
  },
  {
    id: 23, // New article not in main list
    title: "Regional Summit on Palestinian-Israeli Peace Negotiations Set for March",
    excerpt: "Egypt announces diplomatic conference aimed at establishing framework for comprehensive peace talks...",
    imageUrl: "/images/blog/palestine-peace.jpg",
    category: "diplomacy",
    author: "Ibrahim Maalouf",
    date: "February 8, 2025",
    readTime: "5 min read",
    location: "Cairo",
    featured: false
  },
  {
    id: 24, // New article not in main list
    title: "Refugee Return Program Pilot Launched in Northern Gaza",
    excerpt: "First phase of coordinated resettlement begins for families displaced during recent conflict...",
    imageUrl: "/images/blog/gaza-return.jpg",
    category: "rehabilitation",
    author: "Fatima Nour",
    date: "February 5, 2025",
    readTime: "6 min read",
    location: "Northern Gaza",
    featured: false
  },
  {
    id: 25, // New article not in main list
    title: "Education Emergency: Schools Struggle to Reopen Across Gaza",
    excerpt: "UNICEF reports that over 70% of educational facilities remain damaged or repurposed as shelters...",
    imageUrl: "/images/blog/gaza-education.jpg",
    category: "education",
    author: "Hana Jabari",
    date: "January 30, 2025",
    readTime: "5 min read",
    location: "Gaza City",
    featured: false
  },
  {
    id: 26, // New article not in main list
    title: "Agricultural Recovery Plan Unveiled for Gaza Strip",
    excerpt: "FAO and Palestinian Authority announce joint initiative to restore farming capacity and food security...",
    imageUrl: "/images/blog/gaza-agriculture.jpg",
    category: "economy",
    author: "Omar Suleiman",
    date: "January 26, 2025",
    readTime: "4 min read",
    location: "Ramallah",
    featured: false
  }
];

// Timeline events
const timelineEvents = [
  {
    date: "February 2025",
    events: [
      {
        day: "22",
        title: "Humanitarian Aid Convoys Enter Gaza",
        description: "Multiple aid organizations deliver food, medicine, and fuel as ceasefire holds."
      },
      {
        day: "18",
        title: "UN Security Council Resolution",
        description: "New framework for Gaza reconstruction gains international support."
      },
      {
        day: "15",
        title: "Water Infrastructure Project Begins",
        description: "Work starts on critical water treatment facilities in southern Gaza."
      },
      {
        day: "12",
        title: "Medical Crisis Report Published",
        description: "WHO assessment details ongoing healthcare challenges despite aid deliveries."
      },
      {
        day: "8",
        title: "Regional Peace Summit Announced",
        description: "Egypt to host diplomatic conference in March for comprehensive peace talks."
      },
      {
        day: "5",
        title: "Refugee Return Program Launched",
        description: "First phase of coordinated resettlement begins in northern Gaza."
      }
    ]
  },
  {
    date: "January 2025",
    events: [
      {
        day: "30",
        title: "Education Emergency Declared",
        description: "UNICEF reports majority of schools remain closed or damaged across Gaza."
      },
      {
        day: "26",
        title: "Agricultural Recovery Plan Unveiled",
        description: "Joint initiative announced to restore farming capacity and food security."
      },
      {
        day: "20",
        title: "Extended Ceasefire Agreement",
        description: "Parties agree to three-month extension of temporary cessation of hostilities."
      },
      {
        day: "12",
        title: "Infrastructure Damage Assessment",
        description: "UN-led assessment concludes 60% of critical infrastructure requires rebuilding."
      }
    ]
  }
];

// Categories for filtering
const categories = [
  { id: "all", name: "All Updates", count: palestinePosts.length },
  { id: "humanitarian", name: "Humanitarian Aid", count: 1 },
  { id: "diplomacy", name: "Diplomatic Efforts", count: 2 },
  { id: "infrastructure", name: "Infrastructure", count: 1 },
  { id: "healthcare", name: "Healthcare Crisis", count: 1 },
  { id: "rehabilitation", name: "Rehabilitation", count: 1 },
  { id: "education", name: "Education", count: 1 },
  { id: "economy", name: "Economic Recovery", count: 1 },
];

export default function PalestineCrisisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Filter posts based on search query and selected category
  const filteredPosts = palestinePosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Get featured posts
  const featuredPosts = palestinePosts.filter(post => post.featured);
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[50vh]" 
           style={{ backgroundImage: "url('/images/blog/palestine-hero.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/60 to-red-800/50"></div>
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
            className="text-xl md:text-2xl mb-8 max-w-2xl text-green-100"
          >
            In-depth coverage of the humanitarian situation, peace efforts, and reconstruction
          </motion.p>
          
          <div className="flex flex-wrap gap-4 text-sm text-white">
            <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
              <FaHistory className="mr-2" />
              <span>Updates since October 2023</span>
            </div>
            <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
              <FaMap className="mr-2" />
              <Link href="/maps/news?region=palestine" className="hover:underline">
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
                            <span className="text-xs font-bold px-2 py-1 rounded-md text-white bg-green-700">
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
                          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors">{post.title}</h3>
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
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Crisis Timeline</h2>
                <div className="border-l-2 border-green-700 pl-6 ml-3 space-y-10">
                  {timelineEvents.map((month, monthIndex) => (
                    <div key={monthIndex}>
                      <h3 className="text-xl font-bold text-gray-900 -ml-8 bg-white py-1 inline-block">{month.date}</h3>
                      <div className="space-y-6 mt-4">
                        {month.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="relative">
                            <div className="absolute -left-9 w-4 h-4 rounded-full bg-green-700"></div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <div className="text-xl font-bold text-green-700 sm:w-12">{event.day}</div>
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
                  : "All Palestine Coverage"
                }
              </h2>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <p className="text-xl text-gray-600 mb-4">No articles found matching your search.</p>
                  <button 
                    onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}
                    className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
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
                            <span className="text-xs font-bold px-2 py-1 rounded-md text-white bg-green-700">
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
                          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-green-700 transition-colors">{post.title}</h3>
                          <p className="text-gray-600 mb-3 text-sm">{post.excerpt}</p>
                          <div className="mt-auto text-green-700 text-sm font-medium flex items-center group-hover:text-green-800 transition-colors">
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
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">About This Coverage</h3>
              <p className="text-gray-700 mb-4">
                Our Palestine Crisis coverage provides balanced reporting on humanitarian, diplomatic, and reconstruction efforts related to the ongoing situation in Gaza and the West Bank.
              </p>
              <p className="text-gray-700 mb-4">
                Our team of correspondents in the Middle East delivers timely updates and in-depth analysis on both immediate humanitarian needs and long-term peace prospects.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Link 
                  href="/maps/news?region=palestine" 
                  className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-green-700 hover:bg-green-700 hover:text-white transition-colors"
                >
                  <FaMap className="mr-1" size={10} />
                  Interactive Map
                </Link>
                <Link 
                  href="/blogs/news?tag=palestine-analysis" 
                  className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-green-700 hover:bg-green-700 hover:text-white transition-colors"
                >
                  <FaTag className="mr-1" size={10} />
                  Analysis
                </Link>
                <Link 
                  href="/blogs/news?tag=palestine-opinion" 
                  className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-green-700 hover:bg-green-700 hover:text-white transition-colors"
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
                  <p className="text-sm text-gray-500">Current Ceasefire Status</p>
                  <p className="text-lg font-semibold">In effect since January 20</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Humanitarian Aid (2024-25)</p>
                  <p className="text-lg font-semibold">$1.2 billion pledged</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Displaced Persons</p>
                  <p className="text-lg font-semibold">1.9 million (internal)</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Infrastructure Damage</p>
                  <p className="text-lg font-semibold">60% of critical facilities</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Peace Talks Status</p>
                  <p className="text-lg font-semibold">Summit scheduled for March</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Source: UN, UNRWA, WHO (updated February 2025)
              </div>
            </div>
            
            {/* Related Coverage */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Related Coverage</h3>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <Link href="/blogs/news/ukraine" className="block group">
                  <div className="relative h-32">
                    <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                    {/* Replace with actual image when available */}
                    {/* <Image 
                      src="/images/blog/ukraine-hero.jpg"
                      alt="Ukraine Conflict"
                      fill
                      className="object-cover"
                    /> */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                    <div className="absolute bottom-0 w-full p-4">
                      <h4 className="text-lg font-bold text-white group-hover:text-green-300 transition-colors">Ukraine Conflict</h4>
                      <p className="text-sm text-gray-300">Coverage of the ongoing situation in Eastern Europe</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-green-700 to-red-700 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Palestine Updates</h3>
              <p className="text-white text-opacity-90 text-sm mb-4">Get regular briefings on the humanitarian situation and peace process.</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full py-2 px-4 rounded bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 border border-white border-opacity-40 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" id="weeklyUpdates" className="rounded text-green-800" />
                  <label htmlFor="weeklyUpdates">I agree to receive weekly updates</label>
                </div>
                <button className="w-full py-2 px-4 bg-white text-green-700 hover:bg-green-100 rounded font-medium transition-colors">
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
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Explore Gaza on the News Map</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Visualize the latest developments in Gaza and the West Bank with our interactive map. Track humanitarian aid, reconstruction efforts, and diplomatic initiatives.
                </p>
                <Link href="/maps/news?region=palestine" className="inline-block px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors">
                  View Palestine News Map
                </Link>
              </div>
              <div className="md:w-1/2 h-64 md:h-80 relative">
                <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                {/* Replace with actual image when available */}
                {/* <Image 
                  src="/images/palestine-map-preview.jpg" 
                  alt="Palestine News Map Preview" 
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