"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import Globe, { GlobeMethods } from 'react-globe.gl';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import CloudTransition from "../effects/CloudTransition";
import { loadFonts } from '@/app/lib/fontLoader';

// Define mystery types
type MysteryCategory = "unexplained" | "ancient" | "conspiracy" | "cryptid";
type ViewMode = "globe" | "detail";

interface MysteryLocation {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  category: MysteryCategory;
  year?: number; // Optional year of discovery or occurrence
  // Add fields for connections between mysteries
  relatedTo?: number; // ID of related mystery location
  // Fields for detailed view
  detailedLocations?: DetailedLocation[];
}

interface DetailedLocation {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  date?: string;
}

interface MysteryArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

// Detailed locations example for Jack the Ripper
const jackTheRipperLocations: DetailedLocation[] = [
  {
    id: 101,
    title: "Mary Ann Nichols",
    description: "First canonical victim, found on Buck's Row (now Durward Street), Whitechapel on August 31, 1888.",
    lat: 51.5204,
    lng: -0.0630,
    date: "August 31, 1888"
  },
  {
    id: 102,
    title: "Annie Chapman",
    description: "Second canonical victim, found in the backyard of 29 Hanbury Street, Spitalfields on September 8, 1888.",
    lat: 51.5193,
    lng: -0.0743,
    date: "September 8, 1888"
  },
  {
    id: 103,
    title: "Elizabeth Stride",
    description: "Third canonical victim, found in Dutfield's Yard, off Berner Street (now Henriques Street), Whitechapel on September 30, 1888.",
    lat: 51.5142,
    lng: -0.0702,
    date: "September 30, 1888"
  },
  {
    id: 104,
    title: "Catherine Eddowes",
    description: "Fourth canonical victim, found in Mitre Square, Aldgate on September 30, 1888.",
    lat: 51.5138,
    lng: -0.0776,
    date: "September 30, 1888"
  },
  {
    id: 105,
    title: "Mary Jane Kelly",
    description: "Fifth canonical victim, found at 13 Miller's Court, off Dorset Street, Spitalfields on November 9, 1888.",
    lat: 51.5186,
    lng: -0.0770,
    date: "November 9, 1888"
  }
];

// Sample mystery locations - in a real application, this would be a larger dataset
const sampleMysteryLocations: MysteryLocation[] = [
  {
    id: 1,
    title: "Bermuda Triangle",
    description: "A region in the western part of the North Atlantic Ocean where a number of aircraft and ships are said to have disappeared under mysterious circumstances.",
    lat: 25.0000,
    lng: -71.0000,
    category: "unexplained",
    relatedTo: 7 // Related to Roswell (example of a connection)
  },
  {
    id: 2,
    title: "Nazca Lines",
    description: "Enormous geoglyphs carved into the ground in the Nazca Desert in southern Peru, created between 500 BCE and 500 CE.",
    lat: -14.7167,
    lng: -75.1333,
    category: "ancient",
    year: -200,
    relatedTo: 5 // Related to Easter Island
  },
  {
    id: 3,
    title: "Area 51",
    description: "A highly classified United States Air Force facility in Nevada, long associated with conspiracy theories about UFOs and extraterrestrial technology.",
    lat: 37.2350,
    lng: -115.8111,
    category: "conspiracy",
    relatedTo: 7 // Related to Roswell
  },
  {
    id: 4,
    title: "Loch Ness",
    description: "A large, deep freshwater lake in the Scottish Highlands, famous for alleged sightings of the Loch Ness Monster.",
    lat: 57.3229,
    lng: -4.4244,
    category: "cryptid",
  },
  {
    id: 5,
    title: "Easter Island",
    description: "A remote Chilean island in the southeastern Pacific Ocean, known for its nearly 1,000 extant monumental statues called moai.",
    lat: -27.1127,
    lng: -109.3497,
    category: "ancient",
  },
  {
    id: 6,
    title: "Tunguska Event Site",
    description: "Location of a massive explosion that occurred near the Podkamennaya Tunguska River in Russia in 1908, flattening an estimated 80 million trees.",
    lat: 60.9167,
    lng: 101.9167,
    category: "unexplained",
    year: 1908,
  },
  {
    id: 7,
    title: "Roswell",
    description: "Site of an alleged UFO crash in 1947, which has become a focus of conspiracy theories and speculation about government cover-ups.",
    lat: 33.3943,
    lng: -104.5230,
    category: "conspiracy",
    year: 1947,
  },
  {
    id: 8,
    title: "Jack the Ripper",
    description: "Series of unsolved murders in the Whitechapel district of London in 1888. The identity of the killer remains one of history's most infamous mysteries.",
    lat: 51.5167,
    lng: -0.0700,
    category: "unexplained",
    year: 1888,
    detailedLocations: jackTheRipperLocations
  },
];

// Component to center map on selected mystery
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Preload marker images to avoid warnings
const preloadMarkerImages = () => {
  const markerUrls = [
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
  ];
  
  markerUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

const MysteriesMap = () => {
  // Use 'any' type to bypass type checking for the ref
  const globeEl = useRef<any>(null);
  const [mysteryLocations, setMysteryLocations] = useState<MysteryLocation[]>(sampleMysteryLocations);
  const [selectedCategory, setSelectedCategory] = useState<MysteryCategory | "all">("all");
  const [arcs, setArcs] = useState<MysteryArc[]>([]);
  const [globeReady, setGlobeReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("globe");
  const [selectedMystery, setSelectedMystery] = useState<MysteryLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MysteryLocation[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  
  // New state for transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingMystery, setPendingMystery] = useState<MysteryLocation | null>(null);

  // Setup once when component is mounted
  useLayoutEffect(() => {
    preloadMarkerImages();
    
    try {
      // Load fonts explicitly
      loadFonts();
    } catch (error) {
      console.warn('Font loading skipped:', error);
    }
  }, []);

  // Preload globe textures
  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = [
        "//unpkg.com/three-globe/example/img/earth-night.jpg",
        "//unpkg.com/three-globe/example/img/night-sky.png"
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url.startsWith('//') ? `https:${url}` : url;
      });
    };
    
    if (typeof window !== 'undefined') {
      preloadImages();
    }
  }, []);

  // Get a human-readable category name
  const getCategoryName = (category: MysteryCategory): string => {
    const names = {
      unexplained: "Unexplained Phenomena",
      ancient: "Ancient Mysteries",
      conspiracy: "Conspiracy Theories",
      cryptid: "Cryptids & Legends",
    };
    return names[category];
  };

  // Get category color
  const getCategoryColor = (category: MysteryCategory): string => {
    const colors = {
      unexplained: "rgba(239, 68, 68, 0.8)", // red-500
      ancient: "rgba(147, 51, 234, 0.8)",    // purple-500
      conspiracy: "rgba(234, 179, 8, 0.8)",  // yellow-500
      cryptid: "rgba(34, 197, 94, 0.8)",     // green-500
    };
    return colors[category];
  };

  // Create arcs for connected mysteries
  useEffect(() => {
    // Filter locations based on selected category
    const filteredLocations = selectedCategory === "all" 
      ? mysteryLocations 
      : mysteryLocations.filter(location => location.category === selectedCategory);
    
    // Create arcs (conspiracy connections)
    const newArcs: MysteryArc[] = [];
    filteredLocations.forEach(location => {
      if (location.relatedTo) {
        const relatedLocation = mysteryLocations.find(l => l.id === location.relatedTo);
        if (relatedLocation && (selectedCategory === "all" || relatedLocation.category === selectedCategory)) {
          newArcs.push({
            startLat: location.lat,
            startLng: location.lng,
            endLat: relatedLocation.lat,
            endLng: relatedLocation.lng,
            color: getCategoryColor(location.category)
          });
        }
      }
    });
    setArcs(newArcs);
  }, [selectedCategory, mysteryLocations]);

  // Auto-rotate when globe is ready
  useEffect(() => {
    if (globeReady && globeEl.current && viewMode === "globe") {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      
      // Initial animation
      const globe = globeEl.current;
      setTimeout(() => {
        globe.pointOfView({ altitude: 2.5 }, 1000);
      }, 100);
    }
  }, [globeReady, viewMode]);

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const results = mysteryLocations.filter(mystery => 
      mystery.title.toLowerCase().includes(query) || 
      mystery.description.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
  };

  // Modified handleSelectSearchResult for transition effect
  const handleSelectSearchResult = (mystery: MysteryLocation) => {
    setSelectedMystery(mystery);
    setSearchResults([]);
    setSearchQuery("");
    
    if (mystery.detailedLocations && mystery.detailedLocations.length > 0) {
      // Store the mystery during transition
      setPendingMystery(mystery);
      
      // Start zoom animation on globe
      if (globeEl.current) {
        const currentPosition = globeEl.current.pointOfView();
        
        // Calculate new position - much closer to target
        globeEl.current.pointOfView({
          lat: mystery.lat,
          lng: mystery.lng,
          altitude: 0.15 // Much closer zoom
        }, 2000); // 2 second zoom
        
        // Start transition after zoom begins
        setTimeout(() => {
          setIsTransitioning(true);
        }, 1500);
      }
    } else {
      // If no detailed locations, just focus the globe on this location
      if (globeEl.current) {
        globeEl.current.pointOfView({
          lat: mystery.lat,
          lng: mystery.lng,
          altitude: 0.5
        }, 1000);
      }
    }
  };

  // Handle transition complete
  const handleTransitionComplete = () => {
    // Change view mode to detail
    setViewMode("detail");
    setIsTransitioning(false);
    // Reset pending mystery
    setPendingMystery(null);
  };

  // Reset to globe view with transition effect
  const handleResetView = () => {
    // Start transition back to globe
    setIsTransitioning(true);
    
    // After partial transition, swap views
    setTimeout(() => {
      setViewMode("globe");
      
      // Reset globe position after switching
      if (globeEl.current) {
        globeEl.current.pointOfView({ altitude: 2.5 }, 1000);
      }
      
      // End transition after a delay
      setTimeout(() => {
        setIsTransitioning(false);
        setSelectedMystery(null);
      }, 1000);
    }, 1000);
  };

  // Filter locations based on selected category
  const filteredLocations = selectedCategory === "all" 
    ? mysteryLocations 
    : mysteryLocations.filter(location => location.category === selectedCategory);

  // Create category icons for Leaflet map
  const categoryIcons: Record<MysteryCategory, L.Icon> = {
    unexplained: new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }),
    ancient: new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }),
    conspiracy: new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }),
    cryptid: new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  };

  // Create detailed marker icon
  const detailIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="relative w-full h-full">
      {/* Cloud Transition Effect */}
      <CloudTransition 
        isActive={isTransitioning}
        onTransitionComplete={handleTransitionComplete}
        duration={3000}
      />
      
      {/* Search Bar */}
      <div className="absolute top-4 left-4 z-20">
        {showSearch ? (
          <div className="bg-slate-800/90 p-2 rounded-lg shadow-md backdrop-blur-sm flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search mysteries..."
              className="p-2 w-64 border rounded-l outline-none text-gray-800 bg-white"
            />
            <button 
              onClick={handleSearch} 
              className="bg-indigo-600 text-white p-2 rounded-r"
            >
              <FaSearch />
            </button>
            <button 
              onClick={() => setShowSearch(false)} 
              className="ml-2 p-2 text-white hover:text-gray-300"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowSearch(true)} 
            className="bg-slate-800/90 p-3 rounded-lg shadow-md backdrop-blur-sm text-white hover:bg-slate-700"
          >
            <FaSearch />
          </button>
        )}
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 bg-slate-800/90 p-2 rounded-lg shadow-md backdrop-blur-sm max-h-60 overflow-y-auto">
            <h5 className="font-medium text-white text-xs mb-2">Results:</h5>
            <ul className="space-y-1">
              {searchResults.map(mystery => (
                <li 
                  key={mystery.id} 
                  className="p-2 hover:bg-slate-700 rounded cursor-pointer text-white"
                  onClick={() => handleSelectSearchResult(mystery)}
                >
                  <div className="font-medium">{mystery.title}</div>
                  <div className="text-xs text-gray-300">{getCategoryName(mystery.category)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Category Filter Controls */}
      <div className="absolute top-4 right-4 z-10 bg-slate-800/90 p-3 rounded-lg shadow-md backdrop-blur-sm">
        <div className="flex flex-col space-y-2">
          <h5 className="font-medium text-white text-xs mb-1">Filter Category:</h5>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MysteryCategory | "all")}
            className="p-2 border rounded bg-white text-gray-700"
          >
            <option value="all">All Mysteries</option>
            <option value="unexplained">Unexplained Phenomena</option>
            <option value="ancient">Ancient Mysteries</option>
            <option value="conspiracy">Conspiracy Theories</option>
            <option value="cryptid">Cryptids & Legends</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-800/90 p-3 rounded-lg shadow-md backdrop-blur-sm">
        <div className="flex flex-col space-y-1">
          <h5 className="font-medium text-white text-xs mb-1">Legend:</h5>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-white">Unexplained Phenomena</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-xs text-white">Ancient Mysteries</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs text-white">Conspiracy Theories</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-white">Cryptids & Legends</span>
          </div>
        </div>
      </div>

      {/* Back to Globe Button - Moved from conditional to always render in 2D mode */}
      {viewMode === "detail" && (
        <button 
          onClick={handleResetView} 
          className="absolute top-4 right-1/2 transform translate-x-1/2 z-50 bg-indigo-600 px-4 py-2 rounded-full shadow-lg text-white hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <span>Return to Globe</span>
        </button>
      )}

      {/* The Map Views */}
      {viewMode === "globe" ? (
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          width={typeof window !== 'undefined' ? window.innerWidth : 800}
          height={typeof window !== 'undefined' ? window.innerHeight : 600}
          
          // Mystery points
          pointsData={filteredLocations}
          pointLat="lat"
          pointLng="lng"
          pointColor={(d) => getCategoryColor((d as MysteryLocation).category)}
          pointAltitude={0.07}
          pointRadius={0.5}
          pointsMerge={false}
          onPointClick={(point) => handleSelectSearchResult(point as MysteryLocation)}
          pointLabel={(d) => {
            const mystery = d as MysteryLocation;
            return `
              <div class="bg-black/80 text-white p-2 rounded shadow-lg max-w-xs">
                <div class="font-medium text-sm mb-1">${mystery.title}</div>
                <div class="text-xs mb-1">${mystery.description}</div>
                <div class="text-xs opacity-75">${getCategoryName(mystery.category)}</div>
                ${mystery.year ? `<div class="text-xs mt-1 opacity-75">Year: ${mystery.year < 0 ? `${Math.abs(mystery.year)} BCE` : mystery.year}</div>` : ''}
                <div class="mt-1 flex justify-end">
                  <span class="text-xs px-2 py-1 bg-teal-600 rounded cursor-pointer">Read More</span>
                </div>
              </div>
            `;
          }}
          
          // Conspiracy connections (arcs)
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcStroke={0.5}
          
          // Atmosphere & effects
          atmosphereColor="rgb(70, 107, 176)"
          
          // Events
          onGlobeReady={() => setGlobeReady(true)}
        />
      ) : (
        <div className="w-full h-full">
          {selectedMystery && (
            <MapContainer
              center={[selectedMystery.lat, selectedMystery.lng]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
              maxBounds={[[-90, -180], [90, 180]]}
              maxBoundsViscosity={1.0}
              worldCopyJump={true}
              minZoom={3}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                noWrap={true}
              />
              
              <MapController 
                center={[selectedMystery.lat, selectedMystery.lng]} 
                zoom={14} 
              />
              
              {/* Main Mystery Marker */}
              <Marker 
                position={[selectedMystery.lat, selectedMystery.lng]}
                icon={categoryIcons[selectedMystery.category]}
              >
                <Popup>
                  <div className="min-w-[250px]">
                    <h3 className="font-medium text-base">{selectedMystery.title}</h3>
                    <div className="my-1 text-xs inline-block px-2 py-1 rounded-full bg-teal-100 text-teal-800">
                      {getCategoryName(selectedMystery.category)}
                    </div>
                    <p className="my-2 text-sm">{selectedMystery.description}</p>
                    {selectedMystery.year && (
                      <div className="mt-2 text-xs text-gray-600">
                        <span>Year: {selectedMystery.year < 0 ? `${Math.abs(selectedMystery.year)} BCE` : selectedMystery.year}</span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
              
              {/* Detailed Location Markers */}
              {selectedMystery.detailedLocations?.map(location => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={detailIcon}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-medium text-base">{location.title}</h3>
                      <p className="my-2 text-sm">{location.description}</p>
                      {location.date && (
                        <div className="mt-2 text-xs text-gray-600">
                          <span>Date: {location.date}</span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default MysteriesMap; 