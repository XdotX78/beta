#!/usr/bin/env node

/**
 * This script fetches news data from multiple sources,
 * processes it, and saves it to the public directory.
 * 
 * It can be run manually or scheduled as a cron job.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Countries to fetch news from
const countries = ['us', 'gb', 'fr', 'de', 'in', 'au', 'jp', 'br', 'za'];

// Mock API key for demonstration - replace with a real one
const API_KEY = 'YOUR_API_KEY';

/**
 * Basic geocoding function - in production, use a real geocoding service
 */
function geocodeLocation(text) {
    // Dictionary of key locations and their coordinates + regions
    const locationMap = {
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
    };

    // Country to region mapping
    const countryToRegionMap = {
        'United States': 'north_america',
        'UK': 'western_europe',
        'Britain': 'western_europe',
        'England': 'western_europe',
        'France': 'western_europe',
        'Germany': 'western_europe',
        'Spain': 'southern_europe',
        'Italy': 'southern_europe',
        'Russia': 'eastern_europe',
        'Ukraine': 'eastern_europe',
        'China': 'east_asia',
        'Japan': 'east_asia',
        'India': 'south_asia',
        'Brazil': 'south_america',
        'South Africa': 'southern_africa',
        'Australia': 'australia',
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
                case 'south_asia': return { lat: 20, lng: 80, region };
                case 'australia': return { lat: -25, lng: 135, region };
                case 'southern_africa': return { lat: -30, lng: 25, region };
                default: return { lat: 0, lng: 0, region: 'all' };
            }
        }
    }

    // Default to a random location if no location is detected
    return { lat: 0, lng: 0, region: 'all' };
}

// Keywords to categorize news
const categoryKeywords = {
    'conflict': ['war', 'attack', 'conflict', 'military', 'fighting', 'troops', 'assault', 'bomb', 'missile', 'combat'],
    'politics': ['election', 'government', 'president', 'minister', 'parliament', 'senate', 'democracy', 'vote', 'political', 'policy'],
    'disaster': ['earthquake', 'flood', 'hurricane', 'tsunami', 'landslide', 'wildfire', 'tornado', 'volcano', 'disaster', 'emergency'],
    'economy': ['economy', 'inflation', 'market', 'stock', 'recession', 'interest rate', 'finance', 'banking', 'trade', 'fiscal'],
    'social': ['health', 'education', 'welfare', 'protest', 'demonstration', 'climate', 'environment', 'rights', 'community', 'social']
};

// Determine news category based on title and description
function determineCategory(title, description) {
    const text = (title + ' ' + description).toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }

    // Default category if no keywords match
    return 'politics';
}

// Determine importance based on certain keywords
function determineImportance(title, description) {
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
}

/**
 * Fetch news from NewsAPI
 */
function fetchNews(country) {
    return new Promise((resolve, reject) => {
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Process news articles into the format needed for the map
 */
function processArticles(articles) {
    if (!articles || !Array.isArray(articles)) {
        return [];
    }

    return articles
        .filter(article => article.title && article.description)
        .map((article, index) => {
            const location = geocodeLocation(article.title + ' ' + article.description);
            const category = determineCategory(article.title, article.description);
            const importance = determineImportance(article.title, article.description);

            return {
                id: index + 1,
                title: article.title,
                description: article.description || 'No description available',
                lat: location.lat,
                lng: location.lng,
                category,
                date: article.publishedAt || new Date().toISOString(),
                source: article.source?.name || 'Unknown Source',
                importance,
                region: location.region
            };
        });
}

/**
 * Generate fallback news in case API fails
 */
function generateFallbackNews() {
    // Current events with geographic distribution
    return [
        {
            id: 1,
            title: "Global Climate Summit Concludes with New Agreements",
            description: "World leaders reached consensus on new emissions targets after days of intense negotiations in Paris.",
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
            description: "Silicon Valley's latest AI breakthrough promises to transform industries with advanced neural networks.",
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
            description: "Aid organizations report critical shortages as diplomatic efforts to resolve the crisis continue.",
            lat: 33.8869,
            lng: 35.5131,
            category: "conflict",
            date: new Date().toISOString(),
            source: "International Aid Monitor",
            importance: "high",
            region: "middle_east"
        },
        {
            id: 4,
            title: "New Trade Agreement Between Pacific Nations",
            description: "The comprehensive agreement will reduce tariffs and increase trade between participating countries.",
            lat: 35.6762,
            lng: 139.6503,
            category: "economy",
            date: new Date().toISOString(),
            source: "Business Daily",
            importance: "medium",
            region: "east_asia"
        },
        {
            id: 5,
            title: "Protests Against New Labor Laws in Brazil",
            description: "Thousands gather in major cities to demonstrate against controversial reforms to labor legislation.",
            lat: -23.5505,
            lng: -46.6333,
            category: "social",
            date: new Date().toISOString(),
            source: "South American Press",
            importance: "medium",
            region: "south_america"
        },
        {
            id: 6,
            title: "Record Flooding in Southeast Asia",
            description: "Monsoon rains cause widespread flooding, displacing communities and damaging infrastructure.",
            lat: 13.7563,
            lng: 100.5018,
            category: "disaster",
            date: new Date().toISOString(),
            source: "Weather Network",
            importance: "high",
            region: "southeast_asia"
        },
    ];
}

/**
 * Main function that orchestrates the process
 */
async function main() {
    let allNewsEvents = [];

    console.log('Starting news data update...');

    try {
        // If using a real API key, uncomment this code:
        /*
        for (const country of countries) {
          try {
            console.log(`Fetching news for ${country}...`);
            const newsData = await fetchNews(country);
            
            if (newsData.status === 'ok' && newsData.articles) {
              const processedNews = processArticles(newsData.articles);
              allNewsEvents = [...allNewsEvents, ...processedNews];
              console.log(`Added ${processedNews.length} articles from ${country}`);
            } else {
              console.log(`No valid data received for ${country}`);
            }
            
            // Short delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.error(`Error fetching news for ${country}:`, error.message);
          }
        }
        */

        // If no news found or API key not available, use fallback data
        if (allNewsEvents.length === 0) {
            console.log('Using fallback news data...');
            allNewsEvents = generateFallbackNews();
        }

        // Assign unique IDs
        allNewsEvents = allNewsEvents.map((event, index) => ({
            ...event,
            id: index + 1
        }));

        // Create output directory if it doesn't exist
        const outputDir = path.resolve(process.cwd(), 'public/news');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write to JSON file
        const outputPath = path.join(outputDir, 'data.json');
        fs.writeFileSync(
            outputPath,
            JSON.stringify(allNewsEvents, null, 2)
        );

        console.log(`Successfully wrote ${allNewsEvents.length} news events to ${outputPath}`);
    } catch (error) {
        console.error('Error in news update process:', error);
        process.exit(1);
    }
}

// Run the main function
main(); 