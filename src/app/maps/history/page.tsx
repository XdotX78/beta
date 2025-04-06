"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "../../components/LoadingSpinner";

// MapComponent needs to be loaded dynamically (client-side only) due to Leaflet and Three.js requiring window
const HistoryMap = dynamic(() => import("../../components/maps/HistoryMap"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-[70vh] bg-gray-100">
      <LoadingSpinner size="lg" color="purple" text="Loading historical map..." />
    </div>
  ),
});

export default function HistoryMapPage() {
  // Add a console message to help debug font and texture loading issues
  if (typeof window !== 'undefined') {
    console.log(
      'HistoryMap is loading with optimized font configuration and texture preloading. ' +
      'The 3D/2D hybrid approach allows viewing global historical patterns and detailed regional events.'
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Page Header */}
      <div className="bg-purple-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Historical Timeline Map</h1>
          <p className="text-lg max-w-3xl">
            Explore significant historical events, civilizations, and discoveries throughout human history through our interactive timeline map.
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-grow relative">
        <div className="h-[calc(100vh-180px)] min-h-[500px]">
          <Suspense fallback={<LoadingSpinner size="lg" color="purple" />}>
            <HistoryMap />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 