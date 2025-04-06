"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

// Define category types with more specific news events
type Category = "wars" | "world-politics" | "economy" | "disaster" | "science-tech" | "planet-people" | "culture-curiosities";

// Define region types based on the documentation
type Region = "all" | "north_america" | "central_america" | "south_america" | "caribbean" |
  "western_europe" | "eastern_europe" | "northern_europe" | "southern_europe" |
  "east_asia" | "southeast_asia" | "south_asia" | "central_asia" | "middle_east" |
  "north_africa" | "west_africa" | "east_africa" | "central_africa" | "southern_africa" |
  "australia" | "pacific_islands";

// Define continent groups for better organization
type Continent = "all" | "americas" | "europe" | "asia" | "africa" | "oceania";

// Types for news events
interface NewsEvent {
  id: string | number;
  title: string;
  content?: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
    name?: string;
  };
  category?: string;
  type?: string; // Added type as an alternative to category
  date: string;
  timestamp?: number; // Added timestamp property
  source: string;
  importance?: string;
  region: string;
  url?: string;
  showOnMap?: boolean; // Flag to determine if event should be shown on map
}

// Sample news data - in a real application, this would come from an API
const sampleNewsEvents: NewsEvent[] = [
  {
    id: 1,
    title: "Peace Negotiations Resume",
    description: "International mediators gather to restart peace negotiations following months of deadlock.",
    location: { lat: 48.8566, lng: 2.3522 },
    category: "world-politics",
    date: "2023-06-15",
    source: "Global News",
    importance: "high",
    region: "western_europe"
  },
  {
    id: 2,
    title: "Humanitarian Aid Delivered",
    description: "Aid organizations successfully deliver critical supplies to affected regions after weeks of restricted access.",
    location: { lat: 33.8869, lng: 35.5131 },
    category: "planet-people",
    date: "2023-06-16",
    source: "Relief Monitor",
    importance: "high",
    region: "middle_east"
  },
  {
    id: 3,
    title: "Major Infrastructure Damaged in Severe Flooding",
    description: "Severe flooding has damaged critical infrastructure and displaced thousands in the region.",
    location: { lat: 23.6345, lng: 102.5528 },
    category: "disaster",
    date: "2023-06-17",
    source: "Weather Network",
    importance: "high",
    region: "central_america"
  },
  {
    id: 4,
    title: "Economic Sanctions Extended",
    description: "International body votes to extend economic sanctions for another six months citing ongoing concerns.",
    location: { lat: 50.4501, lng: 30.5234 },
    category: "economy",
    date: "2023-06-18",
    source: "Financial Times",
    importance: "medium",
    region: "eastern_europe"
  },
  {
    id: 5,
    title: "Ceasefire Violations Reported",
    description: "Multiple ceasefire violations reported along the contested border, raising tensions in the region.",
    location: { lat: 40.4168, lng: 3.7038 },
    category: "wars",
    date: "2023-06-14",
    source: "Security Observer",
    importance: "high",
    region: "southern_europe"
  },
  // Additional events for other regions
  {
    id: 6,
    title: "Major Trade Agreement Signed",
    description: "Regional powers finalize trade agreement after months of negotiations, aiming to boost economic growth.",
    location: { lat: 35.6762, lng: 139.6503 },
    category: "economy",
    date: "2023-06-13",
    source: "Economic Review",
    importance: "high",
    region: "east_asia"
  },
  {
    id: 7,
    title: "New Conservation Initiative Launched",
    description: "International organizations partner to protect endangered species in biodiversity hotspot.",
    location: { lat: -6.2088, lng: 106.8456 },
    category: "planet-people",
    date: "2023-06-12",
    source: "Environmental Chronicle",
    importance: "medium",
    region: "southeast_asia"
  },
  {
    id: 8,
    title: "Tech Summit Addresses AI Regulation",
    description: "Industry leaders and policymakers meet to discuss regulatory frameworks for artificial intelligence.",
    location: { lat: 37.7749, lng: -122.4194 },
    category: "world-politics",
    date: "2023-06-11",
    source: "Tech Insights",
    importance: "medium",
    region: "north_america"
  },
  {
    id: 9,
    title: "Clean Water Initiative Expands Reach",
    description: "NGO-led program brings clean water access to 50 new communities, benefiting over 100,000 people.",
    location: { lat: 6.5244, lng: 3.3792 },
    category: "planet-people",
    date: "2023-06-10",
    source: "Development News",
    importance: "high",
    region: "west_africa"
  },
  {
    id: 10,
    title: "Drought Emergency Declared",
    description: "Government declares state of emergency as drought conditions worsen, threatening crops and water supplies.",
    location: { lat: -33.8688, lng: 151.2093 },
    category: "disaster",
    date: "2023-06-09",
    source: "Climate Watch",
    importance: "high",
    region: "australia"
  }
];

// Define region data with names and map coordinates
const regionData = {
  // Global view
  all: { name: "Global View", center: [30, 10], zoom: 2 },

  // Americas
  north_america: { name: "North America", center: [40, -100], zoom: 3 },
  central_america: { name: "Central America", center: [17, -88], zoom: 5 },
  south_america: { name: "South America", center: [-15, -60], zoom: 3 },
  caribbean: { name: "Caribbean", center: [20, -75], zoom: 5 },

  // Europe
  western_europe: { name: "Western Europe", center: [48, 5], zoom: 4 },
  eastern_europe: { name: "Eastern Europe", center: [50, 25], zoom: 4 },
  northern_europe: { name: "Northern Europe", center: [60, 15], zoom: 4 },
  southern_europe: { name: "Southern Europe", center: [40, 15], zoom: 4 },

  // Asia
  east_asia: { name: "East Asia", center: [35, 115], zoom: 4 },
  southeast_asia: { name: "Southeast Asia", center: [12, 105], zoom: 4 },
  south_asia: { name: "South Asia", center: [25, 80], zoom: 4 },
  central_asia: { name: "Central Asia", center: [43, 70], zoom: 4 },
  middle_east: { name: "Middle East", center: [30, 45], zoom: 4 },

  // Africa
  north_africa: { name: "North Africa", center: [30, 10], zoom: 4 },
  west_africa: { name: "West Africa", center: [10, 0], zoom: 4 },
  east_africa: { name: "East Africa", center: [5, 35], zoom: 4 },
  central_africa: { name: "Central Africa", center: [0, 20], zoom: 4 },
  southern_africa: { name: "Southern Africa", center: [-25, 25], zoom: 4 },

  // Oceania
  australia: { name: "Australia", center: [-25, 135], zoom: 4 },
  pacific_islands: { name: "Pacific Islands", center: [-15, 170], zoom: 4 }
};

// Group regions by continent for the dropdown menu
const continentGroups = {
  americas: ["north_america", "central_america", "south_america", "caribbean"],
  europe: ["western_europe", "eastern_europe", "northern_europe", "southern_europe"],
  asia: ["east_asia", "southeast_asia", "south_asia", "central_asia", "middle_east"],
  africa: ["north_africa", "west_africa", "east_africa", "central_africa", "southern_africa"],
  oceania: ["australia", "pacific_islands"]
};

// Provide human-readable names for continents
const continentNames = {
  all: "Global View",
  americas: "Americas",
  europe: "Europe",
  asia: "Asia",
  africa: "Africa",
  oceania: "Oceania"
};

const NewsMap = () => {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | Category>("all");
  const [mapStyle, setMapStyle] = useState<"light" | "satellite">("light");
  const [isMapStyleChanging, setIsMapStyleChanging] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<Continent>("all");
  const [selectedRegion, setSelectedRegion] = useState<Region>("all");
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  // Fetch news data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // First try to fetch from our API
        try {
          const apiResponse = await fetch('/api/news');
          if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            if (apiData.success && Array.isArray(apiData.data) && apiData.data.length > 0) {
              console.log('Using news from API', apiData.timestamp);
              console.log('API returned', apiData.data.length, 'news items');

              // Process data if needed but maintain location structure
              const processedData = apiData.data.map((event: any) => ({
                ...event,
                // Ensure location is an object with numeric lat/lng
                location: event.location ? {
                  lat: Number(event.location.lat),
                  lng: Number(event.location.lng)
                } : undefined
              }));

              setNewsEvents(processedData);
              setLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.warn('API fetch failed, falling back to static data', apiError);
        }

        // Fallback to static file if API fails
        const response = await fetch('/news/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch news data');
        }
        const data = await response.json();
        console.log('Using static JSON data with', data.length, 'news items');

        // Process data if needed but maintain location structure
        const processedData = data.map((event: any) => ({
          ...event,
          // Ensure location is an object with numeric lat/lng
          location: event.location ? {
            lat: Number(event.location.lat),
            lng: Number(event.location.lng)
          } : undefined
        }));

        setNewsEvents(processedData);
      } catch (err) {
        console.error('Error fetching news data:', err);
        setError('Failed to load news data. Using sample data instead.');
        console.log('Using sample data with', sampleNewsEvents.length, 'news items');
        setNewsEvents(sampleNewsEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fix for default marker icons in Leaflet with Next.js
  useEffect(() => {
    // This is a workaround for the Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  // Add effect to set max bounds on the map when it's mounted
  useEffect(() => {
    if (mapRef.current) {
      // Set max bounds to prevent excessive dragging
      // These coordinates represent roughly the world bounds with some padding
      const southWest = L.latLng(-85, -180);
      const northEast = L.latLng(85, 180);
      const bounds = L.latLngBounds(southWest, northEast);

      mapRef.current.setMaxBounds(bounds);
      mapRef.current.on('drag', () => {
        mapRef.current?.panInsideBounds(bounds, { animate: false });
      });
    }
  }, []);

  // Function to handle region selection
  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);

    // If a specific region is selected, update the map view
    if (region !== "all" && mapRef.current) {
      const { center, zoom } = regionData[region];
      mapRef.current.setView(center as L.LatLngExpression, zoom);
    } else if (region === "all" && mapRef.current) {
      // Reset to world view
      mapRef.current.setView([30, 10], 2);
    }

    // Close the region selector after selection
    setShowRegionSelector(false);
  };

  // Function to handle continent selection
  const handleContinentChange = (continent: Continent) => {
    setSelectedContinent(continent);
    setSelectedRegion("all"); // Reset region selection when continent changes

    // If a continent is selected, update the map to show that continent
    if (continent !== "all" && mapRef.current) {
      let center: [number, number];
      let zoom: number;

      switch (continent) {
        case "americas":
          center = [0, -80];
          zoom = 2;
          break;
        case "europe":
          center = [50, 10];
          zoom = 3;
          break;
        case "asia":
          center = [30, 100];
          zoom = 2;
          break;
        case "africa":
          center = [0, 20];
          zoom = 2;
          break;
        case "oceania":
          center = [-20, 150];
          zoom = 3;
          break;
        default:
          center = [30, 10];
          zoom = 2;
      }

      mapRef.current.setView(center, zoom);
    } else if (continent === "all" && mapRef.current) {
      // Reset to world view
      mapRef.current.setView([30, 10], 2);
    }
  };

  // Function to handle map style changes
  const handleMapStyleChange = (style: "light" | "satellite") => {
    setIsMapStyleChanging(true);
    setTimeout(() => {
      setMapStyle(style);
      setTimeout(() => {
        setIsMapStyleChanging(false);
      }, 300);
    }, 150);
  };

  // Popup and marker functions
  // Format date for display
  const formatDate = (dateStr: string | number | undefined): string => {
    if (!dateStr) return 'Unknown date';

    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get category color based on category type
  function getCategoryColor(category: string | undefined): string {
    if (!category) return 'bg-amber-200 text-amber-800';

    switch (category) {
      case 'wars':
        return 'bg-red-200 text-red-800';
      case 'world-politics':
        return 'bg-blue-200 text-blue-800';
      case 'disaster':
        return 'bg-orange-200 text-orange-800';
      case 'economy':
        return 'bg-green-200 text-green-800';
      case 'science-tech':
        return 'bg-purple-200 text-purple-800';
      case 'planet-people':
        return 'bg-emerald-200 text-emerald-800';
      case 'culture-curiosities':
        return 'bg-pink-200 text-pink-800';
      default:
        return 'bg-amber-200 text-amber-800';
    }
  }

  // Get category icon properties
  function getCategoryIcon(category: Category | string | undefined, importance: "high" | "medium" | "low" | undefined): { size: number, color: string } {
    // Default values
    if (!category) category = "world-politics";
    if (!importance) importance = "medium";

    // Icon size based on importance
    let size = 20;
    switch (importance) {
      case "high":
        size = 28;
        break;
      case "medium":
        size = 22;
        break;
      case "low":
        size = 18;
        break;
    }

    // Icon color based on category
    let color = "#4A5568"; // Default gray
    switch (category) {
      case "wars":
        color = "#E53E3E"; // Red
        break;
      case "world-politics":
        color = "#3182CE"; // Blue
        break;
      case "disaster":
        color = "#DD6B20"; // Orange
        break;
      case "economy":
        color = "#38A169"; // Green
        break;
      case "science-tech":
        color = "#805AD5"; // Purple
        break;
      case "planet-people":
        color = "#10B981"; // Emerald
        break;
      case "culture-curiosities":
        color = "#EC4899"; // Pink
        break;
    }

    return { size, color };
  }

  // Filter events based on selected category and region
  const filteredEvents = newsEvents.filter(event => {
    // Check if event has coordinates in the location object
    if (!event.location ||
      event.location.lat === undefined ||
      event.location.lng === undefined ||
      isNaN(Number(event.location.lat)) ||
      isNaN(Number(event.location.lng)) ||
      event.location.lat === null ||
      event.location.lng === null) {
      console.warn(`Skipping event with invalid location:`, event.title);
      return false;
    }

    // Check if the event is flagged to be shown on map
    // If the flag is explicitly set to false, skip this event
    if (event.showOnMap === false) {
      // Skip this event for map display but keep it for the news feed
      // By returning false here, we exclude it from the map markers
      return false;
    }

    // Apply category filter - check both category and type fields since our data uses type
    const eventCategory = event.category || event.type;
    const categoryMatch = selectedCategory === "all" || eventCategory === selectedCategory;

    // Apply region filter
    let regionMatch = true;
    if (selectedRegion !== "all") {
      regionMatch = event.region === selectedRegion;
    } else if (selectedContinent !== "all") {
      // If only continent is selected, match all regions in that continent
      if (continentGroups[selectedContinent]) {
        regionMatch = continentGroups[selectedContinent].includes(event.region as any);
      } else {
        console.warn(`Unknown continent: ${selectedContinent}`);
      }
    }

    // Debug log for filtering
    if (!categoryMatch) {
      console.log(`Event filtered out by category: ${event.title}, event category: ${eventCategory}, selected: ${selectedCategory}`);
    }
    if (!regionMatch) {
      console.log(`Event filtered out by region: ${event.title}, event region: ${event.region}, selected region: ${selectedRegion}, continent: ${selectedContinent}`);
    }

    return categoryMatch && regionMatch;
  });

  // Debug output
  console.log(`Total events: ${newsEvents.length}, Filtered events: ${filteredEvents.length}`);
  if (filteredEvents.length === 0 && newsEvents.length > 0) {
    console.log('Category filter:', selectedCategory);
    console.log('Region filter:', selectedRegion);
    console.log('Continent filter:', selectedContinent);
    console.log('Sample event structure:', JSON.stringify(newsEvents[0], null, 2));
  }

  // Map tile layers based on style
  const mapTiles = {
    light: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Toggle timeline visibility
  const toggleTimeline = () => {
    setShowTimeline(!showTimeline);
  };

  // Toggle region selector
  const toggleRegionSelector = () => {
    setShowRegionSelector(!showRegionSelector);
  };

  // Toggle debug panel
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  return (
    <div className="h-full w-full relative">
      {/* Debug panel */}
      {showDebug && (
        <div className="absolute bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-md shadow-lg p-4 max-w-md max-h-80 overflow-y-auto">
          <h4 className="font-bold mb-2 text-sm">Debug Info</h4>
          <div className="space-y-1 text-xs">
            <p>Total news events: {newsEvents.length}</p>
            <p>Filtered events: {filteredEvents.length}</p>
            <p>Selected category: {selectedCategory}</p>
            <p>Selected region: {selectedRegion}</p>
            <p>Selected continent: {selectedContinent}</p>
            <p>Data source: {newsEvents === sampleNewsEvents ? 'Sample data' : 'Real data'}</p>
            <div>
              <p className="font-medium">First 3 events:</p>
              <ul className="pl-4 list-disc">
                {filteredEvents.slice(0, 3).map(event => (
                  <li key={event.id}>{event.title} ({event.category}, {event.region})</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map data...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-16 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md shadow-md max-w-sm">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* The Map - Moved to the top of the return but with a lower z-index */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <MapContainer
          center={[30, 10]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={false}
          ref={mapRef}
          maxBoundsViscosity={1.0}
          worldCopyJump={true}
          minZoom={2}
          maxZoom={18}
          preferCanvas={true}
          maxBounds={[[-85, -180], [85, 180]]}
        >
          <ZoomControl position="bottomright" />

          {/* Use standard OpenStreetMap tiles with better error handling */}
          {mapStyle === "light" ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={false}
              eventHandlers={{
                tileerror: (error) => {
                  console.log("Tile error handled gracefully", error);
                }
              }}
              keepBuffer={8}
              minZoom={2}
              maxZoom={18}
              className={isMapStyleChanging ? "opacity-50 transition-opacity duration-300" : "transition-opacity duration-300"}
            />
          ) : (
            <TileLayer
              attribution={mapTiles[mapStyle].attribution}
              url={mapTiles[mapStyle].url}
              noWrap={false}
              eventHandlers={{
                tileerror: (error) => {
                  console.log("Tile error handled gracefully", error);
                }
              }}
              keepBuffer={8}
              minZoom={2}
              maxZoom={18}
              className={isMapStyleChanging ? "opacity-50 transition-opacity duration-300" : "transition-opacity duration-300"}
            />
          )}

          {filteredEvents.map((event) => {
            // Use either category or type property
            const eventCategory = (event.category || event.type || "world-politics") as Category;
            const { size, color } = getCategoryIcon(eventCategory, event.importance as "high" | "medium" | "low");

            // Additional safety check to prevent Leaflet errors
            if (!event.location ||
              typeof event.location.lat !== 'number' ||
              typeof event.location.lng !== 'number' ||
              isNaN(event.location.lat) ||
              isNaN(event.location.lng)) {
              return null;
            }

            return (
              <CircleMarker
                key={event.id}
                center={[event.location.lat, event.location.lng]}
                radius={size / 2}
                pathOptions={{
                  fillColor: color,
                  color: "white",
                  weight: 1,
                  fillOpacity: 0.8,
                }}
              >
                <Popup>
                  <div className="max-w-xs">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="opacity-80">{event.source || "Unknown Source"}</div>
                      <div className="opacity-60 text-[10px]">{formatDate(event.date || event.timestamp?.toString() || "")}</div>
                      <span className={`mt-1 rounded px-2 py-0.5 text-[10px] font-medium inline-block ${getCategoryColor(eventCategory)}`}>
                        {(eventCategory).charAt(0).toUpperCase() + (eventCategory).slice(1)}
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Top Control Bar - highest z-index */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          <button
            onClick={toggleFilters}
            className="text-sm bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 mr-2 flex items-center"
          >
            <span className="mr-1">☰</span> Filters
          </button>

          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => handleMapStyleChange("light")}
              className={`px-2 py-1 text-xs ${mapStyle === "light" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
              disabled={isMapStyleChanging}
            >
              Light
            </button>
            <button
              onClick={() => handleMapStyleChange("satellite")}
              className={`px-2 py-1 text-xs ${mapStyle === "satellite" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
              disabled={isMapStyleChanging}
            >
              Satellite
            </button>
          </div>

          <div className="relative ml-2">
            <button
              onClick={toggleRegionSelector}
              className="text-sm bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 flex items-center"
            >
              <span className="mr-1">🌐</span>
              {selectedRegion !== "all"
                ? regionData[selectedRegion as keyof typeof regionData]?.name
                : selectedContinent !== "all"
                  ? continentNames[selectedContinent]
                  : "Global View"}
            </button>

            {/* Region Selector Dropdown */}
            {showRegionSelector && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg p-3 z-50 w-64 max-h-96 overflow-y-auto">
                <h4 className="font-medium text-sm border-b pb-2 mb-2">Select Region</h4>

                {/* Global option */}
                <button
                  onClick={() => {
                    handleContinentChange("all");
                    handleRegionChange("all");
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-sm mb-1 ${selectedContinent === "all" ? "bg-blue-100 text-blue-800 font-medium" : "hover:bg-gray-100"
                    }`}
                >
                  🌎 Global View
                </button>

                {/* Continent sections */}
                {Object.entries(continentGroups).map(([continent, regions]) => (
                  <div key={continent} className="mb-3">
                    <button
                      onClick={() => handleContinentChange(continent as Continent)}
                      className={`w-full text-left px-2 py-1 rounded text-sm font-medium mb-1 ${selectedContinent === continent ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                        }`}
                    >
                      {continentNames[continent as Continent]}
                    </button>

                    {/* Show regions if this continent is selected */}
                    {selectedContinent === continent && (
                      <div className="pl-2 border-l-2 border-gray-200 ml-2">
                        {regions.map(region => (
                          <button
                            key={region}
                            onClick={() => handleRegionChange(region as Region)}
                            className={`w-full text-left px-2 py-1 rounded text-sm mb-1 ${selectedRegion === region ? "bg-blue-50 text-blue-800 font-medium" : "hover:bg-gray-50"
                              }`}
                          >
                            {regionData[region as keyof typeof regionData]?.name || "Global"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-sm">
          <span className="font-medium">Showing:</span> {filteredEvents.length} events
          <button
            onClick={toggleDebug}
            className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 rounded px-2 py-0.5"
            title="Toggle debug panel"
          >
            🐞
          </button>
        </div>

        <button
          onClick={toggleTimeline}
          className="text-sm bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 flex items-center"
        >
          <span className="mr-1">📰</span> News Feed
        </button>
      </div>

      {/* Category Filter - higher z-index */}
      {showFilters && (
        <div className="absolute top-12 left-4 z-50 bg-white rounded-md shadow-lg p-3 max-w-xs">
          <h4 className="font-medium text-sm border-b pb-2 mb-2">Event Categories</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "all"}
                onChange={() => setSelectedCategory("all")}
                className="mr-2"
              />
              <span className="text-sm">All Events</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "wars"}
                onChange={() => setSelectedCategory("wars")}
                className="mr-2"
              />
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm">Wars</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "world-politics"}
                onChange={() => setSelectedCategory("world-politics")}
                className="mr-2"
              />
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-sm">World Politics</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "disaster"}
                onChange={() => setSelectedCategory("disaster")}
                className="mr-2"
              />
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span className="text-sm">Disasters</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "economy"}
                onChange={() => setSelectedCategory("economy")}
                className="mr-2"
              />
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm">Economy</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "science-tech"}
                onChange={() => setSelectedCategory("science-tech")}
                className="mr-2"
              />
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
              <span className="text-sm">Science & Tech</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "planet-people"}
                onChange={() => setSelectedCategory("planet-people")}
                className="mr-2"
              />
              <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
              <span className="text-sm">Planet & People</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "culture-curiosities"}
                onChange={() => setSelectedCategory("culture-curiosities")}
                className="mr-2"
              />
              <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
              <span className="text-sm">Culture & Curiosities</span>
            </label>
          </div>
        </div>
      )}

      {showTimeline && (
        <div className="absolute top-12 right-0 z-50 bg-white shadow-lg border-l border-gray-200 h-[calc(100%-3rem)] w-72 overflow-y-auto">
          <div className="sticky top-0 z-20 bg-gray-50 p-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-800">Recent Events</h4>
            <p className="text-xs text-gray-500 mt-1">Latest news and updates</p>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredEvents.map(event => (
              <div key={event.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getCategoryIcon((event.category || event.type || "world-politics") as Category, event.importance as "high" | "medium" | "low").color }}
                      ></span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(event.category || event.type || "")}`}>
                        {event.category || event.type || "world-politics"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(event.date || event.timestamp?.toString() || "")}</span>
                </div>
                <h5 className="font-medium text-sm">{event.title}</h5>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{event.source}</span>
                  <div className="mt-1 text-xs text-gray-600">
                    <div className="flex items-center">
                      <span className="mr-1">
                        {/* Replace GlobeIcon with a simple emoji */}
                        🌍
                      </span>
                      <span>
                        {regionData[event.region as keyof typeof regionData]?.name || "Global"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsMap;