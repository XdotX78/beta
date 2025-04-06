"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "../../components/LoadingSpinner";

// Dynamically import the MysteriesMap component
// This is needed because the Globe component uses browser-only APIs
const MysteriesMap = dynamic(
  () => import("@/app/components/maps/MysteriesMap"),
  { 
    ssr: false,
    loading: () => <LoadingSpinner size="lg" />
  }
);

export default function MysteriesPage() {
  // Add a console message to help debug font loading issues
  if (typeof window !== 'undefined') {
    console.log(
      'MysteriesMap is loading with Google Fonts (Inter and Fira Mono). ' +
      'Font warnings should be resolved.'
    );
  }

  return (
    <main className="flex flex-col w-full h-full">
      {/* Header */}
      <header className="p-6 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <h1 className="text-3xl font-bold mb-2">Mysteries of the World</h1>
        <p className="text-lg max-w-3xl">
          Explore unexplained phenomena, ancient mysteries, conspiracy theories,
          and legendary creatures from around the globe. Click on markers to learn more.
        </p>
      </header>

      {/* Map Container with full viewport height minus header */}
      <div className="flex-grow relative h-[calc(100vh-180px)] min-h-[500px]">
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <MysteriesMap />
        </Suspense>
      </div>

      {/* Categories Section */}
      <section className="p-6 bg-gray-100 flex flex-wrap gap-4 justify-center">
        <div className="p-4 bg-white rounded-lg shadow-md max-w-xs">
          <h3 className="text-lg font-bold text-red-600 mb-2">Unexplained Phenomena</h3>
          <p className="text-sm text-gray-700">
            Events that defy conventional explanation, from mysterious disappearances to anomalous natural occurrences.
          </p>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-md max-w-xs">
          <h3 className="text-lg font-bold text-purple-600 mb-2">Ancient Mysteries</h3>
          <p className="text-sm text-gray-700">
            Archeological enigmas and historical puzzles that challenge our understanding of human history.
          </p>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-md max-w-xs">
          <h3 className="text-lg font-bold text-yellow-600 mb-2">Conspiracy Theories</h3>
          <p className="text-sm text-gray-700">
            Alternative explanations for events, suggesting secret plots by powerful groups or cover-ups.
          </p>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-md max-w-xs">
          <h3 className="text-lg font-bold text-green-600 mb-2">Cryptids & Legends</h3>
          <p className="text-sm text-gray-700">
            Creatures from folklore and cryptozoology that have been reported but never confirmed by science.
          </p>
        </div>
      </section>
    </main>
  );
} 