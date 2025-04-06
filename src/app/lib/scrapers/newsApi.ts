// Define types locally since they're not exported from the NewsMap component
type Category = "conflict" | "politics" | "disaster" | "economy" | "social";

type Region = "all" | "north_america" | "central_america" | "south_america" | "caribbean" |
    "western_europe" | "eastern_europe" | "northern_europe" | "southern_europe" |
    "east_asia" | "southeast_asia" | "south_asia" | "central_asia" | "middle_east" |
    "north_africa" | "west_africa" | "east_africa" | "central_africa" | "southern_africa" |
    "australia" | "pacific_islands";

interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: {
        source: {
            id: string | null;
            name: string;
        };
        author: string | null;
        title: string;
        description: string;
        url: string;
        urlToImage: string | null;
        publishedAt: string;
        content: string;
    }[];
}

interface GeocodingResponse {
    results: {
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
    }[];
}

export interface NewsEvent {
    id: number;
    title: string;
    description: string;
    lat: number;
    lng: number;
    category: Category;
    date: string;
    source?: string;
    importance: "high" | "medium" | "low";
    region: Region;
}

// Map country/region names to our Region type
const countryToRegionMap: Record<string, Region> = {
    'United States': 'north_america',
    'Canada': 'north_america',
    'Mexico': 'central_america',
    'Brazil': 'south_america',
    'Argentina': 'south_america',
    'United Kingdom': 'western_europe',
    'France': 'western_europe',
    'Germany': 'western_europe',
    'Spain': 'southern_europe',
    'Italy': 'southern_europe',
    'Russia': 'eastern_europe',
    'Ukraine': 'eastern_europe',
    'Poland': 'eastern_europe',
    'Sweden': 'northern_europe',
    'Norway': 'northern_europe',
    'China': 'east_asia',
    'Japan': 'east_asia',
    'South Korea': 'east_asia',
    'India': 'south_asia',
    'Pakistan': 'south_asia',
    'Australia': 'australia',
    // Add more as needed
};

// Keywords to categorize news
const categoryKeywords: Record<Category, string[]> = {
    'conflict': ['war', 'attack', 'conflict', 'military', 'fighting', 'troops', 'assault', 'bomb', 'missile', 'combat'],
    'politics': ['election', 'government', 'president', 'minister', 'parliament', 'senate', 'democracy', 'vote', 'political', 'policy'],
    'disaster': ['earthquake', 'flood', 'hurricane', 'tsunami', 'landslide', 'wildfire', 'tornado', 'volcano', 'disaster', 'emergency'],
    'economy': ['economy', 'inflation', 'market', 'stock', 'recession', 'interest rate', 'finance', 'banking', 'trade', 'fiscal'],
    'social': ['health', 'education', 'welfare', 'protest', 'demonstration', 'climate', 'environment', 'rights', 'community', 'social']
};

// Simple geocoder that uses a mapping of country/city names to coordinates
const geocodeLocation = async (text: string): Promise<{ lat: number, lng: number, region: Region } | null> => {
    // Extract location names from text
    // This is a simplified approach - in a real app, you'd use a proper NLP library

    // Dictionary of key locations and their coordinates + regions
    const locationMap: Record<string, { lat: number, lng: number, region: Region }> = {
        'New York': { lat: 40.7128, lng: -74.0060, region: 'north_america' },
        'Washington': { lat: 38.9072, lng: -77.0369, region: 'north_america' },
        'London': { lat: 51.5074, lng: -0.1278, region: 'western_europe' },
        'Paris': { lat: 48.8566, lng: 2.3522, region: 'western_europe' },
        'Berlin': { lat: 52.5200, lng: 13.4050, region: 'western_europe' },
        'Beijing': { lat: 39.9042, lng: 116.4074, region: 'east_asia' },
        'Tokyo': { lat: 35.6762, lng: 139.6503, region: 'east_asia' },
        'Moscow': { lat: 55.7558, lng: 37.6173, region: 'eastern_europe' },
        'Kyiv': { lat: 50.4501, lng: 30.5234, region: 'eastern_europe' },
        'Sydney': { lat: -33.8688, lng: 151.2093, region: 'australia' },
        // Add more as needed
    };

    // Check if any location name appears in the text
    for (const [location, coords] of Object.entries(locationMap)) {
        if (text.includes(location)) {
            return coords;
        }
    }

    // If no specific location is found, check for country mentions
    for (const [country, region] of Object.entries(countryToRegionMap)) {
        if (text.includes(country)) {
            // Use a central point for each country (simplified)
            switch (region) {
                case 'north_america': return { lat: 40, lng: -100, region };
                case 'south_america': return { lat: -20, lng: -60, region };
                case 'western_europe': return { lat: 48, lng: 8, region };
                case 'eastern_europe': return { lat: 50, lng: 25, region };
                case 'east_asia': return { lat: 35, lng: 115, region };
                // Add more as needed
                default: return { lat: 0, lng: 0, region };
            }
        }
    }

    // Default to a random location if no location is detected
    // In a real app, you would use a proper geocoding service
    return { lat: 0, lng: 0, region: 'all' };
};

// Determine news category based on title and description
const determineCategory = (title: string, description: string): Category => {
    const text = (title + ' ' + description).toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywords) as [Category, string[]][]) {
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }

    // Default category if no keywords match
    return 'politics';
};

// Determine importance based on certain keywords
const determineImportance = (title: string, description: string): "high" | "medium" | "low" => {
    const text = (title + ' ' + description).toLowerCase();

    const highImportanceKeywords = ['crisis', 'urgent', 'breaking', 'major', 'critical', 'emergency'];
    const mediumImportanceKeywords = ['important', 'significant', 'develops', 'update'];

    for (const keyword of highImportanceKeywords) {
        if (text.includes(keyword)) return 'high';
    }

    for (const keyword of mediumImportanceKeywords) {
        if (text.includes(keyword)) return 'medium';
    }

    return 'low';
};

export const fetchNewsFromAPI = async (): Promise<NewsEvent[]> => {
    try {
        // Use a free news API
        // Note: In production, you would need to get an API key
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY');
        const data = await response.json() as NewsApiResponse;

        if (data.status !== 'ok') {
            throw new Error('Failed to fetch news data');
        }

        // Process the news articles
        const newsEvents: NewsEvent[] = [];

        for (let i = 0; i < data.articles.length; i++) {
            const article = data.articles[i];

            // Skip articles without description
            if (!article.description) continue;

            // Geocode the location from the text
            const location = await geocodeLocation(article.title + ' ' + article.description);

            if (!location) continue;

            const category = determineCategory(article.title, article.description);
            const importance = determineImportance(article.title, article.description);

            newsEvents.push({
                id: i + 1,
                title: article.title,
                description: article.description,
                lat: location.lat,
                lng: location.lng,
                category,
                date: article.publishedAt,
                source: article.source.name,
                importance,
                region: location.region
            });
        }

        return newsEvents;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};

// Function that uses fallback sources if the main API fails
export const fetchNewsWithFallback = async (): Promise<NewsEvent[]> => {
    try {
        return await fetchNewsFromAPI();
    } catch (error) {
        console.error('Error fetching from primary news source:', error);

        // Mock data as a last resort
        return mockNewsEvents();
    }
};

// Generate some mock news events in case all APIs fail
const mockNewsEvents = (): NewsEvent[] => {
    return [
        {
            id: 1,
            title: "Global Climate Summit Concludes with New Agreements",
            description: "World leaders reached consensus on new emissions targets after days of intense negotiations.",
            lat: 48.8566,
            lng: 2.3522,
            category: "politics",
            date: new Date().toISOString(),
            source: "Global News Network",
            importance: "high",
            region: "western_europe"
        },
        {
            id: 2,
            title: "Major Tech Company Announces New AI Platform",
            description: "The new platform promises breakthroughs in natural language processing and image recognition.",
            lat: 37.7749,
            lng: -122.4194,
            category: "economy",
            date: new Date().toISOString(),
            source: "Tech Today",
            importance: "medium",
            region: "north_america"
        },
        {
            id: 3,
            title: "Humanitarian Crisis Worsens in Conflict Zone",
            description: "Aid organizations report critical shortages of food and medicine as fighting continues.",
            lat: 33.8869,
            lng: 35.5131,
            category: "conflict",
            date: new Date().toISOString(),
            source: "International Aid Monitor",
            importance: "high",
            region: "middle_east"
        },
        // Add more mock events as needed
    ];
}; 