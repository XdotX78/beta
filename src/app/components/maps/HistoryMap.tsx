"use client";

import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJSON } from "react-leaflet";

// Define types for historical data
type HistoricalEra = "ancient" | "classical" | "medieval" | "renaissance" | "industrial" | "modern";

interface HistoricalEvent {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  year: number; // BCE years are negative, CE years are positive
  era: HistoricalEra;
  category: "political" | "military" | "cultural" | "scientific" | "religious";
  importance: "high" | "medium" | "low";
}

// New interface for historical voyages/journeys
interface HistoricalVoyage {
  id: number;
  title: string;
  description: string;
  explorer: string;
  year: number;
  era: HistoricalEra;
  // Array of [lat, lng] coordinates representing the voyage path
  path: Array<[number, number]>;
  color: string;
}

interface HistoricalEmpire {
  id: number;
  name: string;
  description: string;
  color: string; // HEX color for the empire
  startYear: number;
  endYear: number;
  // This would be a GeoJSON or simplified representation of boundaries at different time points
  territoryByYear: Record<number, any>; 
}

// Time periods definition
const historicalEras = [
  { id: "ancient", name: "Ancient", startYear: -3000, endYear: 500, color: "#8B4513" },
  { id: "classical", name: "Classical", startYear: -800, endYear: 500, color: "#DAA520" },
  { id: "medieval", name: "Medieval", startYear: 500, endYear: 1400, color: "#4682B4" },
  { id: "renaissance", name: "Renaissance", startYear: 1400, endYear: 1700, color: "#9370DB" },
  { id: "industrial", name: "Industrial", startYear: 1700, endYear: 1900, color: "#708090" },
  { id: "modern", name: "Modern", startYear: 1900, endYear: 2025, color: "#2F4F4F" }
];

// Sample historical events - in a real application, this would be a larger dataset
const sampleHistoricalEvents: HistoricalEvent[] = [
  {
    id: 1,
    title: "Founding of Rome",
    description: "According to tradition, Rome was founded by Romulus in 753 BCE.",
    lat: 41.9028,
    lng: 12.4964,
    year: -753,
    era: "ancient",
    category: "political",
    importance: "high"
  },
  {
    id: 2,
    title: "Construction of the Great Pyramid",
    description: "The Great Pyramid of Giza, built as a tomb for Pharaoh Khufu, was completed around 2560 BCE.",
    lat: 29.9792,
    lng: 31.1342,
    year: -2560,
    era: "ancient",
    category: "cultural",
    importance: "high"
  },
  {
    id: 3,
    title: "Fall of Constantinople",
    description: "The Byzantine Empire falls as Constantinople is captured by Ottoman forces led by Mehmed II in 1453 CE.",
    lat: 41.0082,
    lng: 28.9784,
    year: 1453,
    era: "medieval",
    category: "military",
    importance: "high"
  },
  {
    id: 4,
    title: "Invention of the Printing Press",
    description: "Johannes Gutenberg introduces the printing press with movable type in Europe around 1439 CE.",
    lat: 49.9929,
    lng: 8.2473,
    year: 1439,
    era: "renaissance",
    category: "scientific",
    importance: "high"
  },
  {
    id: 5,
    title: "First Steam Engine",
    description: "James Watt improves the steam engine, helping to power the Industrial Revolution in 1776.",
    lat: 55.8642,
    lng: -4.2518,
    year: 1776,
    era: "industrial",
    category: "scientific",
    importance: "high"
  },
  {
    id: 6,
    title: "First Moon Landing",
    description: "Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon in 1969.",
    lat: 28.4594,
    lng: -80.5322,
    year: 1969,
    era: "modern",
    category: "scientific",
    importance: "high"
  }
];

// Sample historical voyages - in a real application, this would be a larger dataset
const sampleHistoricalVoyages: HistoricalVoyage[] = [
  {
    id: 1,
    title: "Columbus's First Voyage",
    description: "Christopher Columbus's first voyage across the Atlantic Ocean, funded by Queen Isabella of Spain.",
    explorer: "Christopher Columbus",
    year: 1492,
    era: "renaissance",
    path: [
      [36.5, -6.3], // Palos de la Frontera, Spain
      [28.1, -15.4], // Canary Islands
      [23.1, -82.4], // Cuba 
      [19.9, -75.8], // Hispaniola
      [38.9, -77.0], // Return route
      [36.5, -6.3]  // Return to Spain
    ],
    color: "#e74c3c"
  },
  {
    id: 2,
    title: "Vespucci's Voyages to the Americas",
    description: "Amerigo Vespucci's voyages to the New World, after which the Americas were named.",
    explorer: "Amerigo Vespucci",
    year: 1499,
    era: "renaissance",
    path: [
      [43.8, 7.9], // Genoa, Italy
      [36.5, -6.3], // Palos de la Frontera, Spain
      [28.1, -15.4], // Canary Islands
      [11.0, -74.8], // Northern South America
      [5.0, -55.0], // Along South American coast
      [-8.0, -35.0], // Brazil
      [43.8, 7.9]  // Return to Italy
    ],
    color: "#3498db"
  },
  {
    id: 3,
    title: "Magellan's Circumnavigation",
    description: "First circumnavigation of the Earth, led by Ferdinand Magellan and completed by Juan Sebastián Elcano.",
    explorer: "Ferdinand Magellan",
    year: 1519,
    era: "renaissance",
    path: [
      [37.4, -6.0], // Seville, Spain
      [28.1, -15.4], // Canary Islands
      [-23.0, -43.2], // Rio de Janeiro
      [-34.6, -58.4], // Buenos Aires
      [-52.7, -70.9], // Strait of Magellan
      [-33.4, -70.6], // Along the Pacific
      [9.0, 126.0], // Philippines
      [7.0, 79.9], // Indian Ocean
      [-34.4, 19.3], // Cape of Good Hope
      [37.4, -6.0]  // Return to Spain
    ],
    color: "#9b59b6"
  }
];

// Sample historical empires (simplified for prototype)
const sampleHistoricalEmpires: HistoricalEmpire[] = [
  {
    id: 1,
    name: "Roman Empire",
    description: "One of the largest empires in history, centered around the Mediterranean Sea.",
    color: "#8B0000", // Dark red
    startYear: -27, // 27 BCE
    endYear: 476, // 476 CE
    territoryByYear: {} // Would contain GeoJSON for different years
  },
  {
    id: 2,
    name: "Byzantine Empire",
    description: "The continuation of the Roman Empire in the East.",
    color: "#9370DB", // Medium purple
    startYear: 395,
    endYear: 1453,
    territoryByYear: {}
  },
  {
    id: 3,
    name: "Mongol Empire",
    description: "The largest contiguous land empire in history.",
    color: "#006400", // Dark green
    startYear: 1206,
    endYear: 1368,
    territoryByYear: {}
  }
];

// Component to handle map synchronization
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Function to preload marker images
const preloadMarkerImages = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  
  const imagePaths = [
    '/icons/ancient-marker.png',
    '/icons/classical-marker.png',
    '/icons/medieval-marker.png',
    '/icons/renaissance-marker.png',
    '/icons/industrial-marker.png',
    '/icons/modern-marker.png',
  ];
  
  return Promise.all(
    imagePaths.map(path => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(path);
        img.onerror = () => reject(`Failed to load ${path}`);
        img.src = path;
      });
    })
  );
};

// Function to preload globe textures
const preloadGlobeTextures = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  
  const texturePaths = [
    '/textures/earth_texture.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.jpg',
  ];
  
  return Promise.all(
    texturePaths.map(path => {
      return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          path,
          (texture) => resolve(texture),
          undefined,
          (error) => reject(`Failed to load ${path}: ${error}`)
        );
      });
    })
  );
};

// Update the text shadow style definition
const textShadowStyle = `
  .text-shadow-lg {
    text-shadow: 
      0 0 5px rgba(0,0,0,0.8),
      0 0 10px rgba(0,0,0,0.8),
      0 0 15px rgba(0,0,0,0.8),
      0 0 20px rgba(0,0,0,0.8);
  }
`;

const HistoryMap = () => {
  // CHANGED: Default to detail (2D) view instead of globe view
  const [viewMode, setViewMode] = useState<"globe" | "detail">("detail");
  
  // Added state for the PIP (Picture-in-Picture) globe view
  const [showGlobePIP, setShowGlobePIP] = useState<boolean>(true);
  
  // Added state for selected voyage
  const [selectedVoyage, setSelectedVoyage] = useState<HistoricalVoyage | null>(null);
  
  // Timeline state
  const [currentYear, setCurrentYear] = useState<number>(1000); // Default to 1000 CE
  const [timelineRange, setTimelineRange] = useState({ min: -3000, max: 2000 });
  
  // Selected era and category filters
  const [selectedEra, setSelectedEra] = useState<HistoricalEra | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  
  // Selected event for detail view
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  
  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([30, 20]);
  const [mapZoom, setMapZoom] = useState(2);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HistoricalEvent[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  
  // Three.js related refs
  const pipMountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  // Add custom CSS to ensure map panes don't cover our UI
  const mapStyles = `
    .leaflet-map-pane {
      z-index: 1 !important;
    }
    .leaflet-tile-pane {
      z-index: 2 !important;
    }
    .leaflet-overlay-pane {
      z-index: 3 !important;
    }
    .leaflet-shadow-pane {
      z-index: 4 !important;
    }
    .leaflet-marker-pane {
      z-index: 5 !important;
    }
    .leaflet-tooltip-pane {
      z-index: 6 !important;
    }
    .leaflet-popup-pane {
      z-index: 7 !important;
    }
    .leaflet-zoom-animated {
      z-index: 7 !important;
    }
    .leaflet-control {
      z-index: 8 !important;
    }
  `;
  
  // State variables for filtering events
  const [filteredEra, setFilteredEra] = useState<HistoricalEra | "all">("all");
  const [filteredCategory, setFilteredCategory] = useState<string>("all");
  const [filteredEvents, setFilteredEvents] = useState<HistoricalEvent[]>(sampleHistoricalEvents);
  const [filteredVoyages, setFilteredVoyages] = useState<HistoricalVoyage[]>(sampleHistoricalVoyages);
  
  // Update displayed empires based on the timeline
  const [activeEmpires, setActiveEmpires] = useState<HistoricalEmpire[]>(sampleHistoricalEmpires);
  
  useEffect(() => {
    // Filter empires that exist at the selected year
    const empiresByYear = sampleHistoricalEmpires.filter(
      empire => empire.startYear <= currentYear && empire.endYear >= currentYear
    );
    setActiveEmpires(empiresByYear);
  }, [currentYear]);
  
  // Handle timeline slider change
  const handleTimelineChange = (year: number) => {
    setCurrentYear(year);
    
    // Update map visualization based on new year
    // Filter events relevant to this time period
    const relevantEvents = sampleHistoricalEvents.filter(event => {
      // Consider events within 50 years of the selected year
      return Math.abs(event.year - year) <= 50;
    });
    setFilteredEvents(relevantEvents);
    
    // Update displayed voyages
    const relevantVoyages = sampleHistoricalVoyages.filter(voyage => {
      // Show voyages that happened around the selected year
      return Math.abs(voyage.year - year) <= 30;
    });
    setFilteredVoyages(relevantVoyages);
  };
  
  // Preload marker images and initialize
  useLayoutEffect(() => {
    // Load fonts and marker images
      preloadMarkerImages(),
      preloadGlobeTextures()
    ])
      .then(() => {
        console.log("Fonts, markers, and textures preloaded successfully");
      })
      .catch(error => {
        console.warn("Error preloading assets:", error);
      });
  }, []);
  
  // Format the year display for BCE/CE notation
  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    } else {
      return `${year} CE`;
    }
  };
  
  // Get the color for a specific era
  const getEraColor = (era: HistoricalEra): string => {
    const eraObj = historicalEras.find(e => e.id === era);
    return eraObj ? eraObj.color : "#999999";
  };
  
  // Get category icon or color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "political":
        return "#4682B4"; // Steel Blue
      case "military":
        return "#B22222"; // Firebrick
      case "cultural":
        return "#9370DB"; // Medium Purple
      case "scientific":
        return "#3CB371"; // Medium Sea Green
      case "religious":
        return "#DAA520"; // Goldenrod
      default:
        return "#808080"; // Gray
    }
  };
  
  // Handle searching for historical events
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = sampleHistoricalEvents.filter(
      event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
    setShowSearch(true);
  };
  
  // Handle selecting a search result
  const handleSelectSearchResult = (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setCurrentYear(event.year);
    setViewMode("detail");
    setShowSearch(false);
    setSearchQuery("");
  };
  
  // Create default icon for fallback
  const defaultIcon = new L.Icon({
    iconUrl: "/leaflet/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/leaflet/marker-shadow.png",
    shadowSize: [41, 41],
  });
  
  // Era-specific icons
  const eraIcons: Record<HistoricalEra | 'default', L.Icon> = {
    ancient: new L.Icon({
      iconUrl: "/icons/ancient-marker.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    classical: new L.Icon({
      iconUrl: "/icons/classical-marker.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    medieval: new L.Icon({
      iconUrl: "/icons/medieval-marker.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    renaissance: new L.Icon({
      iconUrl: "/icons/renaissance-marker.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    industrial: new L.Icon({
      iconUrl: "/icons/industrial-marker.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    modern: new L.Icon({
      iconUrl: "/icons/modern-marker.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    default: defaultIcon,
  };
  
  // Render the empire territories
  const renderEmpireTerritories = () => {
    return activeEmpires.map(empire => {
      // Find the closest year in the available territory data
      const availableYears = Object.keys(empire.territoryByYear).map(Number);
      const closestYear = availableYears.reduce((prev, curr) => {
        return Math.abs(curr - currentYear) < Math.abs(prev - currentYear) ? curr : prev;
      }, availableYears[0]);
      
      // Get the GeoJSON for the closest year
      const territoryData = empire.territoryByYear[closestYear];
      
      if (!territoryData) return null;
      
      return (
        <GeoJSON 
          key={`empire-${empire.id}-${closestYear}`}
          data={territoryData}
          style={() => ({
            color: empire.color,
            weight: 2,
            opacity: 0.7,
            fillColor: empire.color,
            fillOpacity: 0.2
          })}
        />
      );
    });
  };
  
  return (
    <div className="w-full h-full relative">
      {/* Inject the text shadow style */}
      <style dangerouslySetInnerHTML={{ __html: textShadowStyle }} />
      
      {/* Inject the custom map styles */}
      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
      
      {/* Main 2D Map View */}
      <div className="absolute inset-0">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={false}
          worldCopyJump={false}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
            bounds={[[-90, -180], [90, 180]]}
          />
          
          <MapController center={mapCenter} zoom={mapZoom} />
          
          {/* Render Empire Territories */}
          {renderEmpireTerritories()}
          
          {/* Show event markers filtered by the current year and other filters */}
          {filteredEvents.map((event) => (
            <Marker 
              key={event.id}
              position={[event.lat, event.lng]}
              icon={eraIcons[event.era] || eraIcons.default}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-medium text-base">{event.title}</h3>
                  <p className="my-2 text-sm">{event.description}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>Era: {event.era}</span>
                    <span>Year: {formatYear(event.year)}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span 
                      className="px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: getCategoryColor(event.category) }}
                    >
                      {event.category}
                    </span>
                    <span>{event.importance} importance</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Display voyage paths on the map */}
          {filteredVoyages.map((voyage) => (
            <div key={voyage.id}>
              <Polyline
                positions={voyage.path}
                pathOptions={{ color: voyage.color, weight: 3, opacity: 0.7 }}
                eventHandlers={{
                  click: () => setSelectedVoyage(voyage)
                }}
              />
              
              {/* Add markers for the start and end points */}
              <Marker
                position={voyage.path[0]}
                icon={eraIcons[voyage.era] || eraIcons.default}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-medium text-base">{voyage.title} (Start)</h3>
                    <p className="my-2 text-sm">{voyage.description}</p>
                    <div className="mt-2 text-xs text-gray-600">
                      <span>Explorer: {voyage.explorer}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      <span>Year: {formatYear(voyage.year)}</span>
                    </div>
                    <button
                      onClick={() => setSelectedVoyage(voyage)}
                      className="mt-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Show full voyage
                    </button>
                  </div>
                </Popup>
              </Marker>
              
              <Marker
                position={voyage.path[voyage.path.length - 1]}
                icon={eraIcons[voyage.era] || eraIcons.default}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-medium text-base">{voyage.title} (End)</h3>
                    <p className="my-2 text-sm">{voyage.description}</p>
                    <div className="mt-2 text-xs text-gray-600">
                      <span>Explorer: {voyage.explorer}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      <span>Year: {formatYear(voyage.year)}</span>
                    </div>
                    <button
                      onClick={() => setSelectedVoyage(voyage)}
                      className="mt-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Show full voyage
                    </button>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>
        
        {/* Picture-in-Picture 3D Globe View */}
        {showGlobePIP && (
          <div 
            ref={pipMountRef}
            className="absolute top-1/2 -translate-y-1/2 right-12 w-[330px] h-[330px] rounded-lg border-2 border-indigo-300 bg-black bg-opacity-75 shadow-lg z-[1000]"
            style={{ boxShadow: '0 0 15px rgba(80, 120, 255, 0.5)' }}
          >
            {/* Loading indicator for the globe */}
            <div className="absolute inset-0 flex items-center justify-center text-white z-[999] pointer-events-none">
              <span className="animate-pulse">Loading globe...</span>
            </div>
            
            {/* Toggle button for the PIP view */}
            <button
              onClick={() => setShowGlobePIP(false)}
              className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 z-[1001]"
              title="Hide globe view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* If a voyage is selected, show info */}
            {selectedVoyage && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs z-[1001]">
                <p className="font-medium">{selectedVoyage.title}</p>
                <p>{selectedVoyage.explorer} ({formatYear(selectedVoyage.year)})</p>
              </div>
            )}
          </div>
        )}
        
        {/* Show PIP button if it's hidden */}
        {!showGlobePIP && (
          <button
            onClick={() => setShowGlobePIP(true)}
            className="absolute bottom-6 right-6 bg-white rounded-lg shadow-xl p-3 z-[1000]"
            title="Show 3D globe view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
        
        {/* Timeline Control */}
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-md mx-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <h5 className="font-medium text-gray-700">Timeline: {formatYear(currentYear)}</h5>
              <span className="text-sm text-gray-500">Drag to explore different time periods</span>
            </div>
            <div className="relative w-full h-8">
              {/* Era markers below the timeline */}
              {historicalEras.map(era => (
                <div 
                  key={era.id}
                  className="absolute h-2 rounded-full opacity-70"
                  style={{
                    backgroundColor: era.color,
                    left: `${((era.startYear - timelineRange.min) / (timelineRange.max - timelineRange.min)) * 100}%`,
                    width: `${((era.endYear - era.startYear) / (timelineRange.max - timelineRange.min)) * 100}%`,
                    top: '6px'
                  }}
                  title={`${era.name}: ${formatYear(era.startYear)} to ${formatYear(era.endYear)}`}
                />
              ))}
              <input 
                type="range" 
                min={timelineRange.min} 
                max={timelineRange.max} 
                value={currentYear}
                onChange={(e) => handleTimelineChange(parseInt(e.target.value))}
                className="w-full absolute top-0"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatYear(timelineRange.min)}</span>
              <span>{formatYear(0)}</span>
              <span>{formatYear(timelineRange.max)}</span>
            </div>
          </div>
        </div>
        
        {/* Era Filter Control */}
        <div className="absolute top-4 right-4 z-[900] bg-white rounded-lg shadow-md">
          <div className="p-2">
            <label htmlFor="era-filter" className="text-sm font-medium text-gray-700 mr-2">Era:</label>
            <select 
              id="era-filter"
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value as HistoricalEra | "all")}
              className="border border-gray-300 rounded-md shadow-sm p-1 text-sm bg-white"
            >
              <option value="all">All Eras</option>
              <option value="ancient">Ancient</option>
              <option value="classical">Classical</option>
              <option value="medieval">Medieval</option>
              <option value="renaissance">Renaissance</option>
              <option value="industrial">Industrial</option>
              <option value="modern">Modern</option>
            </select>
          </div>
        </div>
        
        {/* Category Filter Control */}
        <div className="absolute top-16 right-4 z-[900] bg-white rounded-lg shadow-md">
          <div className="p-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 mr-2">Category:</label>
            <select 
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm p-1 text-sm bg-white"
            >
              <option value="all">All Categories</option>
              <option value="political">Political</option>
              <option value="military">Military</option>
              <option value="cultural">Cultural</option>
              <option value="scientific">Scientific</option>
              <option value="religious">Religious</option>
            </select>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="absolute top-4 left-4 z-[900] bg-white rounded-lg shadow-md">
          <div className="flex items-center p-2">
            <input
              type="text"
              placeholder="Search historical events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="p-2 text-sm border rounded-l bg-white text-gray-700 w-64"
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
          
          {/* Search Results */}
          {showSearch && searchResults.length > 0 && (
            <div className="max-h-96 overflow-y-auto bg-white rounded-b-lg shadow-md border-t">
              <h5 className="p-2 text-sm font-medium text-gray-700 border-b">
                Search Results ({searchResults.length})
              </h5>
              <ul>
                {searchResults.map(event => (
                  <li 
                    key={event.id}
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectSearchResult(event)}
                  >
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="text-xs text-gray-500">{formatYear(event.year)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Year Display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold opacity-70 pointer-events-none z-[800] text-shadow-lg bg-black bg-opacity-30 px-6 py-2 rounded-full">
          {formatYear(currentYear)}
        </div>
        
        {/* Active Empires Legend */}
        {activeEmpires.length > 0 && (
          <div className="absolute bottom-32 left-4 z-[900] bg-white p-3 rounded-lg shadow-md max-w-xs">
            <h5 className="font-medium text-gray-700 mb-1">Active Empires:</h5>
            <ul className="text-sm">
              {activeEmpires.map(empire => (
                <li key={empire.id} className="flex items-center mt-1">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: empire.color }}
                  />
                  <span>{empire.name} ({formatYear(empire.startYear)} - {formatYear(empire.endYear)})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryMap; 