"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function NewsMapPage() {
  // MapComponent needs to be loaded dynamically (client-side only) due to Leaflet requiring window
  const MapComponent = dynamic(() => import("../../../app/components/maps/NewsMap"), {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    ),
  });

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Minimal Page Header */}
      <div className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between z-20">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4">
            <FaArrowLeft className="mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Real-Time News Map</h1>
        </div>
        <div className="text-sm text-gray-500">
          Explore global events as they unfold
        </div>
      </div>

      {/* Full-height Map Container */}
      <div className="flex-grow relative">
        <MapComponent />
      </div>
    </div>
  );
} 