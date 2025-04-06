"use client";

import Link from "next/link";
import { useState } from "react";
import { FaGlobe, FaHistory, FaUserSecret, FaArrowRight, FaNewspaper } from "react-icons/fa";

export default function MapsIndexPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const mapOptions = [
    {
      id: "mysteries",
      title: "Mysteries Map",
      description: "Explore unexplained phenomena, cryptids, and unsolved mysteries around the world.",
      icon: <FaUserSecret className="text-5xl text-purple-600" />,
      href: "/maps/mysteries",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-300",
      hoverBorderColor: "border-purple-500",
      textColor: "text-purple-900"
    },
    {
      id: "history",
      title: "History Map",
      description: "Journey through time with our interactive historical map featuring civilizations and key events.",
      icon: <FaHistory className="text-5xl text-indigo-600" />,
      href: "/maps/history",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-300",
      hoverBorderColor: "border-indigo-500",
      textColor: "text-indigo-900"
    },
    {
      id: "news",
      title: "News Map",
      description: "Stay updated with global events and news coverage visualized geographically.",
      icon: <FaNewspaper className="text-5xl text-teal-600" />,
      href: "/maps/news",
      bgColor: "bg-gradient-to-br from-teal-50 to-teal-100",
      borderColor: "border-teal-300",
      hoverBorderColor: "border-teal-500",
      textColor: "text-teal-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Maps</h1>
            <p className="text-xl text-gray-600">
              Explore our collection of interactive maps that visualize mysteries, 
              historical events, and global phenomena
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {mapOptions.map((option) => (
              <div 
                key={option.id}
                className={`${option.bgColor} ${
                  hoveredCard === option.id ? option.hoverBorderColor : option.borderColor
                } border-2 rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full flex flex-col`}
                onMouseEnter={() => setHoveredCard(option.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-center mb-6">
                    {option.icon}
                  </div>
                  <h2 className={`${option.textColor} text-2xl font-bold mb-3 text-center`}>{option.title}</h2>
                  <p className="text-gray-700 text-center">{option.description}</p>
                </div>
                
                <div className="mt-auto p-4 border-t border-gray-200 bg-white">
                  <Link href={option.href}>
                    <div className="flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 text-center">
                      <span>Explore Now</span>
                      <FaArrowRight className="ml-2" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 