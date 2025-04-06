#!/usr/bin/env node

/**
 * News Web Scraper
 * 
 * This script scrapes news directly from various news websites,
 * processes the content, and formats it for our news map.
 */

const path = require('path');
const fs = require('fs/promises');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');

// Configure RSS parser with custom fields
const rssParser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent', { keepArray: true }],
            ['media:thumbnail', 'mediaThumbnail'],
            ['content:encoded', 'contentEncoded'],
            ['dc:creator', 'creator'],
            ['dc:date', 'dcDate']
        ]
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8'
    }
});

// Configuration for RSS feeds with advanced options
const rssFeeds = [
    // Economy News
    {
        name: 'Reuters Economy',
        url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
        category: 'economy',
        retries: 2,
        defaultLocation: { lat: 40.7128, lng: -74.0060, region: 'North America' } // New York
    },
    {
        name: 'BBC Business',
        url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
        category: 'economy',
        retries: 2,
        defaultLocation: { lat: 51.5074, lng: -0.1278, region: 'Europe' } // London
    },
    {
        name: 'CNBC Economy',
        url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html',
        category: 'economy',
        retries: 2,
        defaultLocation: { lat: 40.7128, lng: -74.0060, region: 'North America' } // New York
    },

    // Ukraine Conflict
    {
        name: 'Reuters Ukraine',
        url: 'https://www.reutersagency.com/feed/?best-topics=war-in-ukraine&post_type=best',
        category: 'conflict',
        retries: 3,
        defaultLocation: { lat: 50.4501, lng: 30.5234, region: 'Europe' } // Kyiv
    },
    {
        name: 'Kyiv Independent',
        url: 'https://kyivindependent.com/feed',
        category: 'conflict',
        retries: 3,
        defaultLocation: { lat: 50.4501, lng: 30.5234, region: 'Europe' } // Kyiv
    },

    // Middle East
    {
        name: 'Al Jazeera Middle East',
        url: 'https://www.aljazeera.com/xml/rss/all.xml',
        category: 'conflict',
        retries: 2,
        defaultLocation: { lat: 31.7683, lng: 35.2137, region: 'Middle East' } // Jerusalem
    },
    {
        name: 'BBC Middle East',
        url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
        category: 'conflict',
        retries: 2,
        defaultLocation: { lat: 31.7683, lng: 35.2137, region: 'Middle East' } // Jerusalem
    },

    // General World News
    {
        name: 'BBC World',
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
        category: 'general',
        retries: 2
    },
    {
        name: 'Reuters World',
        url: 'https://www.reutersagency.com/feed/?best-topics=reuters-select&post_type=best',
        category: 'general',
        retries: 2
    },

    // Disaster News
    {
        name: 'ReliefWeb Disasters',
        url: 'https://reliefweb.int/updates/rss.xml?theme=4591',
        category: 'disaster',
        retries: 2
    },

    // Asia News
    {
        name: 'Taiwan News',
        url: 'https://www.taiwannews.com.tw/en/rss/index.xml',
        category: 'general',
        retries: 2,
        defaultLocation: { lat: 23.6978, lng: 120.9605, region: 'Asia' } // Taiwan
    },
    {
        name: 'South China Morning Post',
        url: 'https://www.scmp.com/rss/91/feed',
        category: 'general',
        retries: 2,
        defaultLocation: { lat: 22.3193, lng: 114.1694, region: 'Asia' } // Hong Kong
    },
    {
        name: 'The Myanmar Times',
        url: 'https://www.mmtimes.com/rss.xml',
        category: 'general',
        retries: 3,
        defaultLocation: { lat: 16.8661, lng: 96.1951, region: 'Asia' } // Yangon
    }
];

// List of news sources to scrape
const newsSources = [
    {
        name: 'Reuters World',
        url: 'https://www.reuters.com/world/',
        selector: 'article',
        titleSelector: 'h3',
        contentSelector: 'p',
        linkSelector: 'a',
        baseUrl: 'https://www.reuters.com'
    },
    {
        name: 'BBC World',
        url: 'https://www.bbc.com/news/world',
        selector: '.gs-c-promo',
        titleSelector: '.gs-c-promo-heading__title',
        contentSelector: '.gs-c-promo-summary',
        linkSelector: 'a',
        baseUrl: 'https://www.bbc.com'
    },
    {
        name: 'Al Jazeera',
        url: 'https://www.aljazeera.com/news/',
        selector: '.gc__content',
        titleSelector: '.gc__title',
        contentSelector: '.gc__excerpt',
        linkSelector: 'a',
        baseUrl: 'https://www.aljazeera.com'
    },
    // Add specialized sources for our focus areas
    {
        name: 'Al Jazeera Economy',
        url: 'https://www.aljazeera.com/economy/',
        selector: '.gc__content',
        titleSelector: '.gc__title',
        contentSelector: '.gc__excerpt',
        linkSelector: 'a',
        baseUrl: 'https://www.aljazeera.com'
    },
    {
        name: 'BBC Ukraine',
        url: 'https://www.bbc.com/news/topics/c1nx6rkdgjdt',
        selector: '.gs-c-promo',
        titleSelector: '.gs-c-promo-heading__title',
        contentSelector: '.gs-c-promo-summary',
        linkSelector: 'a',
        baseUrl: 'https://www.bbc.com'
    },
    {
        name: 'Al Jazeera Palestine',
        url: 'https://www.aljazeera.com/where/palestine/',
        selector: '.gc__content',
        titleSelector: '.gc__title',
        contentSelector: '.gc__excerpt',
        linkSelector: 'a',
        baseUrl: 'https://www.aljazeera.com'
    },
    {
        name: 'Al Jazeera Gaza',
        url: 'https://www.aljazeera.com/tag/gaza/',
        selector: '.gc__content',
        titleSelector: '.gc__title',
        contentSelector: '.gc__excerpt',
        linkSelector: 'a',
        baseUrl: 'https://www.aljazeera.com'
    },
    {
        name: 'Reuters Business',
        url: 'https://www.reuters.com/business/',
        selector: 'article',
        titleSelector: 'h3',
        contentSelector: 'p',
        linkSelector: 'a',
        baseUrl: 'https://www.reuters.com'
    },
    {
        name: 'Taiwan News',
        url: 'https://www.taiwannews.com.tw/en/index',
        selector: '.block-title',
        titleSelector: 'h3',
        contentSelector: 'p',
        linkSelector: 'a',
        baseUrl: 'https://www.taiwannews.com.tw'
    },
    // Add more specialized sources for Taiwan
    {
        name: 'Focus Taiwan',
        url: 'https://focustaiwan.tw/latest',
        selector: '.headline-wrapper',
        titleSelector: '.headline-text',
        contentSelector: '.headline-subtitle',
        linkSelector: 'a',
        baseUrl: 'https://focustaiwan.tw'
    },
    {
        name: 'Taiwan Today',
        url: 'https://taiwantoday.tw/list_eng.php?cate=5',
        selector: '.list',
        titleSelector: 'h3',
        contentSelector: 'p',
        linkSelector: 'a',
        baseUrl: 'https://taiwantoday.tw/'
    },
    // Add more economy sources
    {
        name: 'Financial Times',
        url: 'https://www.ft.com/world-economy',
        selector: '.o-teaser',
        titleSelector: '.o-teaser__heading',
        contentSelector: '.o-teaser__standfirst',
        linkSelector: 'a',
        baseUrl: 'https://www.ft.com'
    },
    {
        name: 'Bloomberg Economy',
        url: 'https://www.bloomberg.com/economics',
        selector: '.story-list-story',
        titleSelector: '.story-list-story__headline',
        contentSelector: '.story-list-story__summary',
        linkSelector: 'a',
        baseUrl: 'https://www.bloomberg.com'
    },
    // Add Ukraine specific sources
    {
        name: 'Kyiv Independent',
        url: 'https://kyivindependent.com/news',
        selector: '.article-card',
        titleSelector: '.article-card__title',
        contentSelector: '.article-card__description',
        linkSelector: 'a',
        baseUrl: 'https://kyivindependent.com'
    }
];

/**
 * Fetch HTML content from a URL
 */
async function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to load ${url}: ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Process Reuters articles
 */
function processReutersArticle(element, source) {
    const titleElement = element.querySelector('h3, .heading');
    const descriptionElement = element.querySelector('p.text-body-small, .description');

    if (!titleElement) return null;

    const title = titleElement.textContent.trim();
    const description = descriptionElement ? descriptionElement.textContent.trim() : '';

    return {
        title,
        description: description || 'No description available',
        source: 'Reuters'
    };
}

/**
 * Process BBC articles
 */
function processBBCArticle(element, source) {
    const titleElement = element.querySelector('.gs-c-promo-heading__title');
    const descriptionElement = element.querySelector('.gs-c-promo-summary');

    if (!titleElement) return null;

    const title = titleElement.textContent.trim();
    const description = descriptionElement ? descriptionElement.textContent.trim() : '';

    return {
        title,
        description: description || 'No description available',
        source: 'BBC News'
    };
}

/**
 * Process Al Jazeera articles
 */
function processAlJazeeraArticle(element, source) {
    const titleElement = element.querySelector('h3, .gc__title');
    const descriptionElement = element.querySelector('p, .gc__excerpt');

    if (!titleElement) return null;

    const title = titleElement.textContent.trim();
    const description = descriptionElement ? descriptionElement.textContent.trim() : '';

    return {
        title,
        description: description || 'No description available',
        source: 'Al Jazeera'
    };
}

/**
 * Scrape news articles from a website
 */
async function scrapeNewsSource(source) {
    try {
        console.log(`Scraping ${source.name}...`);
        const response = await fetch(source.url);

        if (!response.ok) {
            throw new Error(`Failed to load ${source.url}: ${response.status}`);
        }

        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Find all article elements
        const articleElements = document.querySelectorAll(source.selector);
        const articles = [];

        for (let element of articleElements) {
            // Extract the title
            const titleElement = element.querySelector(source.titleSelector);
            if (!titleElement) continue;
            const title = titleElement.textContent.trim();

            // Extract the content/summary
            const contentElement = element.querySelector(source.contentSelector);
            const content = contentElement ? contentElement.textContent.trim() : '';

            // Get the link element
            const linkElement = element.querySelector(source.linkSelector) || titleElement.closest('a');
            const relativeUrl = linkElement ? linkElement.getAttribute('href') : '';
            let url = '';

            // Construct full URL
            if (relativeUrl) {
                if (relativeUrl.startsWith('http')) {
                    url = relativeUrl;
                } else {
                    url = `${source.baseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
                }
            }

            // Skip articles without sufficient information
            if (!title || title.length < 5) continue;

            // Combine title and content for better detection
            const fullText = `${title} ${content}`;

            // Use our improved detection functions
            const location = detectLocation(fullText);
            const type = detectNewsType(fullText);

            // Create the article object
            const article = {
                id: generateId(title),
                title: title,
                content: content || 'No description available',
                source: source.name,
                url: url,
                date: new Date().toISOString(),
                timestamp: Date.now(),
                location: {
                    lat: location.lat,
                    lng: location.lng
                },
                type: type,
                region: location.region
            };

            articles.push(article);
        }

        console.log(`Found ${articles.length} articles on ${source.name}`);
        return articles;
    } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        return [];
    }
}

// Location detection functions
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
    'Gaza': { lat: 31.5017, lng: 34.4668, region: 'middle_east' },
    'Jerusalem': { lat: 31.7683, lng: 35.2137, region: 'middle_east' },
    'Tel Aviv': { lat: 32.0853, lng: 34.7818, region: 'middle_east' },
    'Cairo': { lat: 30.0444, lng: 31.2357, region: 'north_africa' },
    'Nigeria': { lat: 9.0820, lng: 8.6753, region: 'west_africa' },
    'Iran': { lat: 32.4279, lng: 53.6880, region: 'middle_east' },
    'Iraq': { lat: 33.2232, lng: 43.6793, region: 'middle_east' },
    'Syria': { lat: 34.8021, lng: 38.9968, region: 'middle_east' },
    'Saudi Arabia': { lat: 23.8859, lng: 45.0792, region: 'middle_east' },
    'UAE': { lat: 23.4241, lng: 53.8478, region: 'middle_east' },
    'India': { lat: 20.5937, lng: 78.9629, region: 'south_asia' },
    'Pakistan': { lat: 30.3753, lng: 69.3451, region: 'south_asia' },
    'Afghanistan': { lat: 33.9391, lng: 67.7100, region: 'south_asia' },
    'Brazil': { lat: -14.2350, lng: -51.9253, region: 'south_america' },
    'Argentina': { lat: -38.4161, lng: -63.6167, region: 'south_america' },
    'Chile': { lat: -35.6751, lng: -71.5430, region: 'south_america' },
    'Peru': { lat: -9.1900, lng: -75.0152, region: 'south_america' },
    'Colombia': { lat: 4.5709, lng: -74.2973, region: 'south_america' },
    'Mexico': { lat: 23.6345, lng: -102.5528, region: 'central_america' },
    'Canada': { lat: 56.1304, lng: -106.3468, region: 'north_america' },
    'United States': { lat: 37.0902, lng: -95.7129, region: 'north_america' },
    'US': { lat: 37.0902, lng: -95.7129, region: 'north_america' },
    'UK': { lat: 55.3781, lng: -3.4360, region: 'western_europe' },
    'Britain': { lat: 55.3781, lng: -3.4360, region: 'western_europe' },
    'France': { lat: 46.6034, lng: 1.8883, region: 'western_europe' },
    'Germany': { lat: 51.1657, lng: 10.4515, region: 'western_europe' },
    'Italy': { lat: 41.8719, lng: 12.5674, region: 'southern_europe' },
    'Spain': { lat: 40.4637, lng: -3.7492, region: 'southern_europe' },
    'Russia': { lat: 61.5240, lng: 105.3188, region: 'eastern_europe' },
    'China': { lat: 35.8617, lng: 104.1954, region: 'east_asia' },
    'Japan': { lat: 36.2048, lng: 138.2529, region: 'east_asia' },
    'Australia': { lat: -25.2744, lng: 133.7751, region: 'australia' },
    'Africa': { lat: 8.7832, lng: 34.5085, region: 'central_africa' },
    // Add Myanmar and its major cities with accurate coordinates
    'Myanmar': { lat: 19.7633, lng: 96.0785, region: 'southeast_asia' },
    'Burma': { lat: 19.7633, lng: 96.0785, region: 'southeast_asia' },
    'Yangon': { lat: 16.8661, lng: 96.1951, region: 'southeast_asia' },
    'Naypyidaw': { lat: 19.7633, lng: 96.0785, region: 'southeast_asia' },
    'Mandalay': { lat: 21.9588, lng: 96.0891, region: 'southeast_asia' },
    'Thailand': { lat: 15.8700, lng: 100.9925, region: 'southeast_asia' },
    'Philippines': { lat: 12.8797, lng: 121.7740, region: 'southeast_asia' },
    'Indonesia': { lat: -0.7893, lng: 113.9213, region: 'southeast_asia' },
    'Malaysia': { lat: 4.2105, lng: 101.9758, region: 'southeast_asia' },
    'Vietnam': { lat: 14.0583, lng: 108.2772, region: 'southeast_asia' },
    'Cambodia': { lat: 12.5657, lng: 104.9910, region: 'southeast_asia' },
    'Laos': { lat: 19.8563, lng: 102.4955, region: 'southeast_asia' }
};

// Country to region mapping
const countryToRegionMap = {
    'United States': 'north_america',
    'USA': 'north_america',
    'US': 'north_america',
    'America': 'north_america',
    'Canada': 'north_america',
    'Mexico': 'central_america',
    'Guatemala': 'central_america',
    'Honduras': 'central_america',
    'Nicaragua': 'central_america',
    'Costa Rica': 'central_america',
    'Panama': 'central_america',
    'Brazil': 'south_america',
    'Argentina': 'south_america',
    'Chile': 'south_america',
    'Peru': 'south_america',
    'Colombia': 'south_america',
    'Venezuela': 'south_america',
    'Ecuador': 'south_america',
    'Bolivia': 'south_america',
    'Paraguay': 'south_america',
    'Uruguay': 'south_america',
    'Cuba': 'caribbean',
    'Haiti': 'caribbean',
    'Dominican Republic': 'caribbean',
    'Jamaica': 'caribbean',
    'Trinidad': 'caribbean',
    'Bahamas': 'caribbean',
    'United Kingdom': 'western_europe',
    'UK': 'western_europe',
    'Britain': 'western_europe',
    'England': 'western_europe',
    'Scotland': 'western_europe',
    'Wales': 'western_europe',
    'Ireland': 'western_europe',
    'France': 'western_europe',
    'Germany': 'western_europe',
    'Belgium': 'western_europe',
    'Netherlands': 'western_europe',
    'Luxembourg': 'western_europe',
    'Switzerland': 'western_europe',
    'Austria': 'western_europe',
    'Italy': 'southern_europe',
    'Spain': 'southern_europe',
    'Portugal': 'southern_europe',
    'Greece': 'southern_europe',
    'Malta': 'southern_europe',
    'Cyprus': 'southern_europe',
    'Turkey': 'southern_europe',
    'Russia': 'eastern_europe',
    'Ukraine': 'eastern_europe',
    'Poland': 'eastern_europe',
    'Romania': 'eastern_europe',
    'Hungary': 'eastern_europe',
    'Czech Republic': 'eastern_europe',
    'Slovakia': 'eastern_europe',
    'Bulgaria': 'eastern_europe',
    'Sweden': 'northern_europe',
    'Norway': 'northern_europe',
    'Finland': 'northern_europe',
    'Denmark': 'northern_europe',
    'Iceland': 'northern_europe',
    'Estonia': 'northern_europe',
    'Latvia': 'northern_europe',
    'Lithuania': 'northern_europe',
    'China': 'east_asia',
    'Japan': 'east_asia',
    'South Korea': 'east_asia',
    'North Korea': 'east_asia',
    'Taiwan': 'east_asia',
    'Mongolia': 'east_asia',
    'Vietnam': 'southeast_asia',
    'Thailand': 'southeast_asia',
    'Indonesia': 'southeast_asia',
    'Malaysia': 'southeast_asia',
    'Philippines': 'southeast_asia',
    'Singapore': 'southeast_asia',
    'Myanmar': 'southeast_asia',
    'Cambodia': 'southeast_asia',
    'Laos': 'southeast_asia',
    'Brunei': 'southeast_asia',
    'India': 'south_asia',
    'Pakistan': 'south_asia',
    'Bangladesh': 'south_asia',
    'Nepal': 'south_asia',
    'Sri Lanka': 'south_asia',
    'Maldives': 'south_asia',
    'Kazakhstan': 'central_asia',
    'Uzbekistan': 'central_asia',
    'Turkmenistan': 'central_asia',
    'Kyrgyzstan': 'central_asia',
    'Tajikistan': 'central_asia',
    'Afghanistan': 'central_asia',
    'Iran': 'middle_east',
    'Iraq': 'middle_east',
    'Saudi Arabia': 'middle_east',
    'Israel': 'middle_east',
    'Palestine': 'middle_east',
    'Gaza': 'middle_east',
    'Syria': 'middle_east',
    'Jordan': 'middle_east',
    'Lebanon': 'middle_east',
    'UAE': 'middle_east',
    'Qatar': 'middle_east',
    'Kuwait': 'middle_east',
    'Bahrain': 'middle_east',
    'Oman': 'middle_east',
    'Yemen': 'middle_east',
    'Egypt': 'north_africa',
    'Libya': 'north_africa',
    'Tunisia': 'north_africa',
    'Algeria': 'north_africa',
    'Morocco': 'north_africa',
    'Sudan': 'north_africa',
    'Nigeria': 'west_africa',
    'Ghana': 'west_africa',
    'Ivory Coast': 'west_africa',
    'Senegal': 'west_africa',
    'Mali': 'west_africa',
    'Guinea': 'west_africa',
    'Sierra Leone': 'west_africa',
    'Liberia': 'west_africa',
    'Burkina Faso': 'west_africa',
    'Kenya': 'east_africa',
    'Tanzania': 'east_africa',
    'Uganda': 'east_africa',
    'Ethiopia': 'east_africa',
    'Somalia': 'east_africa',
    'Rwanda': 'east_africa',
    'Burundi': 'east_africa',
    'Congo': 'central_africa',
    'DRC': 'central_africa',
    'Cameroon': 'central_africa',
    'Central African Republic': 'central_africa',
    'Gabon': 'central_africa',
    'Chad': 'central_africa',
    'South Africa': 'southern_africa',
    'Namibia': 'southern_africa',
    'Botswana': 'southern_africa',
    'Zimbabwe': 'southern_africa',
    'Mozambique': 'southern_africa',
    'Angola': 'southern_africa',
    'Zambia': 'southern_africa',
    'Malawi': 'southern_africa',
    'Madagascar': 'southern_africa',
    'Australia': 'australia',
    'New Zealand': 'pacific_islands',
    'Fiji': 'pacific_islands',
    'Papua New Guinea': 'pacific_islands',
    'Solomon Islands': 'pacific_islands',
    'Vanuatu': 'pacific_islands',
    'Hawaii': 'pacific_islands'
};

/**
 * Detect location from the news text
 */
function detectLocation(text) {
    const normalizedText = text.toLowerCase();

    // Focus areas with top priority

    // Ukraine-Russia conflict detection
    if (normalizedText.includes('ukraine') ||
        normalizedText.includes('kyiv') ||
        normalizedText.includes('kharkiv') ||
        normalizedText.includes('donbas') ||
        normalizedText.includes('crimea') ||
        normalizedText.includes('zelensky')) {
        return { lat: 49.4871, lng: 31.2718, region: 'eastern_europe' };
    }

    // Russia (when not about Ukraine)
    if (normalizedText.includes('russia') ||
        normalizedText.includes('moscow') ||
        normalizedText.includes('putin') ||
        normalizedText.includes('kremlin')) {
        if (!normalizedText.includes('ukraine') &&
            !normalizedText.includes('kyiv') &&
            !normalizedText.includes('zelensky')) {
            return { lat: 55.7558, lng: 37.6173, region: 'eastern_europe' };
        }
    }

    // Gaza conflict
    if (normalizedText.includes('gaza') ||
        normalizedText.includes('gaza strip') ||
        normalizedText.includes('hamas') ||
        normalizedText.includes('rafah') ||
        normalizedText.includes('khan younis')) {
        return { lat: 31.5017, lng: 34.4668, region: 'middle_east' };
    }

    // Palestine/West Bank
    if (normalizedText.includes('palestine') ||
        normalizedText.includes('west bank') ||
        normalizedText.includes('ramallah') ||
        normalizedText.includes('bethlehem') ||
        normalizedText.includes('hebron')) {
        return { lat: 31.9474, lng: 35.3027, region: 'middle_east' };
    }

    // Israel (when not specifically about Gaza/Palestine)
    if (normalizedText.includes('israel') ||
        normalizedText.includes('tel aviv') ||
        normalizedText.includes('jerusalem') ||
        normalizedText.includes('netanyahu')) {
        if (!normalizedText.includes('gaza') &&
            !normalizedText.includes('palestine') &&
            !normalizedText.includes('west bank')) {
            return { lat: 31.7683, lng: 35.2137, region: 'middle_east' };
        }
    }

    // Taiwan conflict
    if (normalizedText.includes('taiwan') ||
        normalizedText.includes('taipei')) {
        return { lat: 23.6978, lng: 120.9605, region: 'east_asia' };
    }

    // Check for specific country/city names in our location map
    for (const location in locationMap) {
        if (normalizedText.includes(location.toLowerCase())) {
            return locationMap[location];
        }
    }

    // Check for Myanmar/Burma specific news
    if (normalizedText.includes('myanmar') ||
        normalizedText.includes('burma') ||
        normalizedText.includes('yangon') ||
        normalizedText.includes('naypyidaw')) {
        return { lat: 19.7633, lng: 96.0785, region: 'southeast_asia' };
    }

    // Check for other Southeast Asian countries
    if (normalizedText.includes('thailand') ||
        normalizedText.includes('bangkok') ||
        normalizedText.includes('phuket')) {
        return { lat: 15.8700, lng: 100.9925, region: 'southeast_asia' };
    }

    if (normalizedText.includes('philippines') ||
        normalizedText.includes('manila') ||
        normalizedText.includes('cebu')) {
        return { lat: 12.8797, lng: 121.7740, region: 'southeast_asia' };
    }

    if (normalizedText.includes('vietnam') ||
        normalizedText.includes('hanoi') ||
        normalizedText.includes('ho chi minh')) {
        return { lat: 14.0583, lng: 108.2772, region: 'southeast_asia' };
    }

    // Detect economy news locations for major financial centers
    if (normalizedText.includes('economy') ||
        normalizedText.includes('economic') ||
        normalizedText.includes('finance') ||
        normalizedText.includes('market')) {

        // Check for specific regional economic news
        if (normalizedText.includes('us') ||
            normalizedText.includes('united states') ||
            normalizedText.includes('america') ||
            normalizedText.includes('fed') ||
            normalizedText.includes('federal reserve')) {
            return { lat: 40.7128, lng: -74.0060, region: 'north_america' }; // New York
        }

        if (normalizedText.includes('eu') ||
            normalizedText.includes('europe') ||
            normalizedText.includes('euro') ||
            normalizedText.includes('european')) {
            return { lat: 50.8503, lng: 4.3517, region: 'western_europe' }; // Brussels
        }

        if (normalizedText.includes('china') ||
            normalizedText.includes('chinese') ||
            normalizedText.includes('yuan') ||
            normalizedText.includes('beijing')) {
            return { lat: 39.9042, lng: 116.4074, region: 'east_asia' }; // Beijing
        }

        if (normalizedText.includes('japan') ||
            normalizedText.includes('japanese') ||
            normalizedText.includes('yen') ||
            normalizedText.includes('tokyo')) {
            return { lat: 35.6762, lng: 139.6503, region: 'east_asia' }; // Tokyo
        }
    }

    // Region-based detection as a fallback
    if (normalizedText.includes('middle east')) {
        return { lat: 31.3546, lng: 34.9594, region: 'middle_east' };
    }

    if (normalizedText.includes('europe')) {
        return { lat: 50.0755, lng: 14.4378, region: 'western_europe' };
    }

    if (normalizedText.includes('asia')) {
        return { lat: 34.0479, lng: 100.6197, region: 'east_asia' };
    }

    if (normalizedText.includes('africa')) {
        return { lat: 8.7832, lng: 34.5085, region: 'central_africa' };
    }

    if (normalizedText.includes('latin america') || normalizedText.includes('south america')) {
        return { lat: -13.6894, lng: -65.7500, region: 'south_america' };
    }

    if (normalizedText.includes('north america')) {
        return { lat: 37.0902, lng: -95.7129, region: 'north_america' };
    }

    // Default fallback for unlocated news
    return { lat: 0, lng: 0, region: 'global' };
}

// Keywords to categorize news
const categoryKeywords = {
    'wars': ['war', 'attack', 'conflict', 'military', 'fighting', 'troops', 'assault', 'bomb', 'missile', 'combat', 'violence', 'kill', 'invasion', 'airstrikes', 'artillery', 'rebellion', 'insurgent', 'terrorist', 'battle', 'siege'],
    'disaster': ['earthquake', 'flood', 'hurricane', 'tsunami', 'landslide', 'wildfire', 'tornado', 'volcano', 'disaster', 'emergency', 'storm', 'drought', 'famine', 'epidemic', 'pandemic', 'catastrophe', 'contamination', 'avalanche', 'blizzard'],
    'economy': ['economy', 'inflation', 'market', 'stock', 'recession', 'interest rate', 'finance', 'banking', 'trade', 'fiscal', 'economic', 'global market', 'currency', 'exchange rate', 'tariff', 'investment', 'gdp', 'debt crisis', 'financial market', 'commodity prices'],
    'world-politics': ['sanctions', 'summit', 'treaty', 'alliance', 'diplomatic', 'geopolitical', 'global relations', 'international agreement', 'trade war', 'energy crisis', 'nuclear', 'security council', 'international court', 'united nations', 'nato', 'g20', 'g7', 'eu', 'opec', 'brics'],
};

// Topics that are important enough to show on maps
const mapImportanceTopics = [
    // War-related important topics
    'invasion', 'major offensive', 'nuclear', 'missile strike', 'capital attacked',
    // Disaster topics that should be on maps
    'major earthquake', 'devastating flood', 'deadly hurricane', 'tsunami', 'severe volcanic eruption',
    // Economy topics significant enough for maps
    'global recession', 'stock market crash', 'currency collapse', 'major tariffs', 'trade war',
    'oil price shock', 'financial crisis', 'bank collapse', 'global inflation',
    // Geopolitical events for maps
    'international sanctions', 'diplomatic crisis', 'major summit', 'territorial dispute', 'international conflict'
];

/**
 * Determine news category based on text
 */
function determineCategory(text) {
    text = text.toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }

    // Default category if no keywords match
    return 'world-politics';
}

/**
 * Determine if news is important enough to display on the map
 */
function determineMapImportance(text) {
    text = text.toLowerCase();

    // Check for high importance keywords that should appear on maps
    for (const topic of mapImportanceTopics) {
        if (text.includes(topic.toLowerCase())) {
            return true;
        }
    }

    // High casualty events should appear on maps
    const casualtyRegex = /(\d+)\s+(killed|dead|deaths|casualties|fatalities)/i;
    const match = text.match(casualtyRegex);
    if (match && parseInt(match[1]) >= 50) {
        return true;
    }

    // Major economic events should appear on maps
    const economicImpactRegex = /(\$\d+\s+(billion|trillion))/i;
    if (economicImpactRegex.test(text)) {
        return true;
    }

    // Default to not showing on map
    return false;
}

/**
 * Process a news article into our required format
 */
function processArticle(article, index) {
    const combinedText = `${article.title} ${article.content || article.description || ''}`;
    const location = detectLocation(combinedText);
    const category = determineCategory(combinedText);
    const importance = determineImportance(combinedText);
    const showOnMap = determineMapImportance(combinedText);

    return {
        id: generateId(article.title),
        title: article.title,
        content: article.content || article.description || '',
        source: article.source,
        url: article.url || article.link,
        date: article.date || new Date().toISOString(),
        timestamp: article.timestamp || Date.now(),
        location: {
            name: location.name,
            lat: location.lat,
            lng: location.lng
        },
        category,
        region: location.region || 'global',
        importance,
        showOnMap // New flag to determine if this should be shown on the map
    };
}

/**
 * Generate fallback news in case scraping fails
 */
function generateFallbackNews() {
    return [
        {
            id: 1,
            title: "Climate Conference Results in New Global Commitments",
            description: "World leaders agreed to more ambitious carbon reduction targets at the latest global climate summit in Paris.",
            lat: 48.8566,
            lng: 2.3522,
            category: "politics",
            date: new Date().toISOString(),
            source: "Reuters",
            importance: "high",
            region: "western_europe"
        },
        {
            id: 2,
            title: "Tech Giants Announce Collaboration on AI Safety Standards",
            description: "Major technology companies have formed a coalition to develop shared safety protocols for advanced AI systems.",
            lat: 37.7749,
            lng: -122.4194,
            category: "economy",
            date: new Date().toISOString(),
            source: "Tech Chronicle",
            importance: "medium",
            region: "north_america"
        },
        {
            id: 3,
            title: "Humanitarian Aid Reaches Conflict-Affected Areas After Negotiations",
            description: "Relief organizations have successfully delivered critical supplies following a temporary ceasefire agreement.",
            lat: 33.8869,
            lng: 35.5131,
            category: "conflict",
            date: new Date().toISOString(),
            source: "Al Jazeera",
            importance: "high",
            region: "middle_east"
        },
        {
            id: 4,
            title: "New Trade Agreement to Boost Regional Economic Integration",
            description: "Countries across East Asia have signed a comprehensive trade deal eliminating tariffs on most goods and services.",
            lat: 35.6762,
            lng: 139.6503,
            category: "economy",
            date: new Date().toISOString(),
            source: "BBC News",
            importance: "medium",
            region: "east_asia"
        },
        {
            id: 5,
            title: "Mass Protests Demand Environmental Policy Reform",
            description: "Thousands have gathered in major cities across Brazil to protest against deforestation and call for stronger conservation measures.",
            lat: -23.5505,
            lng: -46.6333,
            category: "social",
            date: new Date().toISOString(),
            source: "Reuters",
            importance: "medium",
            region: "south_america"
        },
        {
            id: 6,
            title: "Severe Flooding Displaces Communities in Southeast Asia",
            description: "Heavy monsoon rains have caused widespread flooding, affecting over 100,000 people and damaging critical infrastructure.",
            lat: 13.7563,
            lng: 100.5018,
            category: "disaster",
            date: new Date().toISOString(),
            source: "AP News",
            importance: "high",
            region: "southeast_asia"
        },
    ];
}

/**
 * Detect the type/category of the news article
 */
function detectNewsType(text) {
    const normalizedText = text.toLowerCase();

    // Economy detection - prioritize economic news
    if (normalizedText.includes('economy') ||
        normalizedText.includes('economic') ||
        normalizedText.includes('finance') ||
        normalizedText.includes('market') ||
        normalizedText.includes('stock') ||
        normalizedText.includes('inflation') ||
        normalizedText.includes('recession') ||
        normalizedText.includes('gdp') ||
        normalizedText.includes('growth forecast') ||
        normalizedText.includes('central bank') ||
        normalizedText.includes('interest rate') ||
        normalizedText.includes('trade') ||
        normalizedText.includes('currency') ||
        normalizedText.includes('investment') ||
        normalizedText.includes('debt') ||
        normalizedText.includes('deficit') ||
        normalizedText.includes('fiscal') ||
        normalizedText.includes('monetary policy') ||
        normalizedText.includes('treasury') ||
        normalizedText.includes('wall street') ||
        normalizedText.includes('dow jones') ||
        normalizedText.includes('nasdaq') ||
        normalizedText.includes('s&p 500')) {
        return 'economy';
    }

    // Conflict detection - prioritize key conflict areas 
    if (normalizedText.includes('war') ||
        normalizedText.includes('attack') ||
        normalizedText.includes('military') ||
        normalizedText.includes('missile') ||
        normalizedText.includes('strike') ||
        normalizedText.includes('troop') ||
        normalizedText.includes('soldier') ||
        normalizedText.includes('killed') ||
        normalizedText.includes('casualty') ||
        normalizedText.includes('hostage') ||
        normalizedText.includes('ceasefire') ||
        normalizedText.includes('bombing') ||
        normalizedText.includes('combat') ||
        // Our focus conflict areas
        normalizedText.includes('ukraine') ||
        normalizedText.includes('russia') ||
        normalizedText.includes('gaza') ||
        normalizedText.includes('hamas') ||
        normalizedText.includes('israel') ||
        normalizedText.includes('idf') ||
        normalizedText.includes('palestine') ||
        normalizedText.includes('west bank') ||
        normalizedText.includes('taiwan strait') ||
        normalizedText.includes('taiwan china')) {
        return 'conflict';
    }

    // Politics detection
    if (normalizedText.includes('president') ||
        normalizedText.includes('government') ||
        normalizedText.includes('congress') ||
        normalizedText.includes('parliament') ||
        normalizedText.includes('election') ||
        normalizedText.includes('vote') ||
        normalizedText.includes('prime minister') ||
        normalizedText.includes('cabinet') ||
        normalizedText.includes('democracy') ||
        normalizedText.includes('campaign') ||
        normalizedText.includes('policy') ||
        normalizedText.includes('politician') ||
        normalizedText.includes('diplomatic') ||
        normalizedText.includes('administration') ||
        normalizedText.includes('lawmaker') ||
        normalizedText.includes('senate') ||
        normalizedText.includes('house of representatives')) {
        return 'politics';
    }

    // Disaster detection
    if (normalizedText.includes('disaster') ||
        normalizedText.includes('earthquake') ||
        normalizedText.includes('flood') ||
        normalizedText.includes('hurricane') ||
        normalizedText.includes('tornado') ||
        normalizedText.includes('tsunami') ||
        normalizedText.includes('wildfire') ||
        normalizedText.includes('eruption') ||
        normalizedText.includes('drought') ||
        normalizedText.includes('avalanche') ||
        normalizedText.includes('landslide') ||
        normalizedText.includes('typhoon') ||
        normalizedText.includes('cyclone')) {
        return 'disaster';
    }

    // Social/cultural detection
    if (normalizedText.includes('protest') ||
        normalizedText.includes('march') ||
        normalizedText.includes('demonstration') ||
        normalizedText.includes('rally') ||
        normalizedText.includes('culture') ||
        normalizedText.includes('festival') ||
        normalizedText.includes('celebration') ||
        normalizedText.includes('heritage') ||
        normalizedText.includes('tradition') ||
        normalizedText.includes('social media') ||
        normalizedText.includes('social unrest') ||
        normalizedText.includes('movement')) {
        return 'social';
    }

    // Default to politics if nothing else matches
    return 'politics';
}

// Helper to generate a unique ID
function generateId(text) {
    return crypto.createHash('md5').update(text).digest('hex').substring(0, 10);
}

// Utility function for delay between retries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to scrape an RSS feed with retry logic
async function scrapeRssFeed(source) {
    // Set default retry count if not specified
    const maxRetries = source.retries || 1;
    let retryCount = 0;
    let lastError = null;

    while (retryCount <= maxRetries) {
        try {
            if (retryCount > 0) {
                console.log(`Retry attempt ${retryCount}/${maxRetries} for ${source.name}...`);
                // Exponential backoff: wait longer between each retry
                await delay(1000 * Math.pow(2, retryCount - 1));
            }

            console.log(`Scraping RSS feed from ${source.name}...`);

            // Fetch and parse the feed
            let feed;
            try {
                // Use a separate timeout wrapper to avoid issues with callback errors
                const fetchPromise = rssParser.parseURL(source.url);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), 15000)
                );

                feed = await Promise.race([fetchPromise, timeoutPromise]);

                if (!feed || !feed.items) {
                    throw new Error('Invalid feed structure');
                }
            } catch (error) {
                console.error(`Error fetching RSS feed ${source.name}: ${error.message}`);
                lastError = error;
                retryCount++;
                continue;
            }

            console.log(`Found ${feed.items.length} items in ${source.name}`);

            // Time-based filtering - skip articles older than X hours
            const maxAgeHours = 72; // Configure this as needed - default 72 hours (3 days)
            const oldestAllowed = new Date();
            oldestAllowed.setHours(oldestAllowed.getHours() - maxAgeHours);

            // Process each item
            const articles = [];
            for (const item of feed.items) {
                try {
                    // Check publication date if available
                    if (item.pubDate) {
                        const pubDate = new Date(item.pubDate);
                        if (pubDate < oldestAllowed) {
                            // Skip older articles
                            continue;
                        }
                    }

                    // Get content from various possible fields
                    const content = item.contentEncoded ||
                        item.content ||
                        item.description ||
                        item['content:encoded'] ||
                        '';

                    // Skip if no content or title
                    if (!item.title) {
                        continue;
                    }

                    // Strip HTML tags for cleaner content and trim whitespace
                    const strippedContent = content ? content.replace(/<[^>]*>?/gm, '')
                        .replace(/\s+/g, ' ')
                        .trim() : '';

                    // Create the combined text for location and type detection
                    const fullText = `${item.title} ${strippedContent}`;

                    // Detect location and category
                    const location = detectLocation(fullText);

                    // Skip if no location detected and it's required
                    if (!location.lat || !location.lng) {
                        // For some sources, we might want to use a default location
                        if (source.defaultLocation) {
                            location.lat = source.defaultLocation.lat;
                            location.lng = source.defaultLocation.lng;
                            location.region = source.defaultLocation.region || '';
                        } else {
                            // Skip articles without locations for map visualization
                            console.log(`Skipping article with no location: ${item.title}`);
                            continue;
                        }
                    }

                    // Use source category as default if detection fails
                    const type = detectNewsType(fullText) || source.category;

                    // Try to extract image from the feed item
                    let imageUrl = null;
                    if (item.enclosure && item.enclosure.url) {
                        imageUrl = item.enclosure.url;
                    } else if (item.image && item.image.url) {
                        imageUrl = item.image.url;
                    } else if (item.mediaContent && item.mediaContent.length > 0) {
                        for (const media of item.mediaContent) {
                            if (media.medium === 'image' || (media.url && media.url.match(/\.(jpg|jpeg|png|gif)$/i))) {
                                imageUrl = media.url;
                                break;
                            }
                        }
                    }

                    // Create article object
                    articles.push({
                        id: generateId(item.title),
                        title: item.title,
                        content: strippedContent.substring(0, 300) + (strippedContent.length > 300 ? '...' : ''),
                        source: source.name,
                        url: item.link || '',
                        date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        timestamp: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
                        location: {
                            lat: location.lat,
                            lng: location.lng
                        },
                        type: type,
                        region: location.region || '',
                        imageUrl: imageUrl
                    });
                } catch (itemError) {
                    console.error(`Error processing RSS item from ${source.name}: ${itemError.message}`);
                    // Continue with next item
                }
            }

            console.log(`Successfully processed ${articles.length} articles from ${source.name}`);
            return articles;

        } catch (error) {
            console.error(`Error scraping RSS feed ${source.name} (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
            lastError = error;
            retryCount++;
        }
    }

    // After all retries failed
    console.error(`Failed to scrape RSS feed ${source.name} after ${maxRetries + 1} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
    return [];
}

/**
 * Determine news importance
 */
function determineImportance(text) {
    text = text.toLowerCase();

    const highImportanceKeywords = ['crisis', 'urgent', 'breaking', 'major', 'critical', 'emergency', 'dramatic', 'severe'];
    const mediumImportanceKeywords = ['important', 'significant', 'develops', 'update', 'new'];

    for (const keyword of highImportanceKeywords) {
        if (text.includes(keyword)) return 'high';
    }

    for (const keyword of mediumImportanceKeywords) {
        if (text.includes(keyword)) return 'medium';
    }

    return 'low';
}

// Keywords for conflict detection and categorization
const conflictCategories = {
    ukraine: {
        keywords: ['ukraine', 'russia', 'kyiv', 'moscow', 'zelensky', 'putin', 'donbas', 'crimea', 'kharkiv', 'odesa', 'mariupol', 'donetsk', 'luhansk'],
        location: { lat: 49.4871968, lng: 31.2718321, name: 'Ukraine', country: 'Ukraine' }
    },
    palestine: {
        keywords: ['gaza', 'israel', 'palestine', 'hamas', 'west bank', 'jerusalem', 'netanyahu', 'idf', 'rafah', 'tel aviv', 'ceasefire', 'humanitarian'],
        location: { lat: 31.5, lng: 34.45, name: 'Gaza Strip', country: 'Palestine' }
    },
    sudan: {
        keywords: ['sudan', 'khartoum', 'rsf', 'rapid support forces', 'sudanese armed forces', 'darfur', 'hemedti', 'burhan'],
        location: { lat: 15.5007, lng: 32.5599, name: 'Khartoum', country: 'Sudan' }
    },
    myanmar: {
        keywords: ['myanmar', 'burma', 'rohingya', 'tatmadaw', 'aung san suu kyi', 'yangon', 'nug', 'naypyidaw', 'ethnic armed organizations'],
        location: { lat: 21.9162, lng: 95.956, name: 'Myanmar', country: 'Myanmar' }
    },
    ethiopia: {
        keywords: ['ethiopia', 'tigray', 'amhara', 'oromia', 'addis ababa', 'abiy ahmed', 'tplf'],
        location: { lat: 9.145, lng: 40.4897, name: 'Ethiopia', country: 'Ethiopia' }
    },
    taiwan: {
        keywords: ['taiwan', 'taipei', 'taiwan strait tensions', 'china military', 'pla', 'tsai ing-wen', 'chinese military', 'taiwan strait', 'cross-strait'],
        location: { lat: 23.6978, lng: 120.9605, name: 'Taiwan', country: 'Taiwan' }
    }
};

// Function to detect the conflict type of an article
function detectConflictType(title, content) {
    const text = (title + ' ' + content).toLowerCase();

    for (const [conflict, data] of Object.entries(conflictCategories)) {
        if (data.keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
            return {
                conflict,
                location: data.location,
                showOnMap: true // Important conflicts should show on map
            };
        }
    }

    return null;
}

// Function to determine article category and determine whether to show on map
function categorizeArticle(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    let category = 'world-politics'; // default category
    let showOnMap = false;
    let location = null;

    // First check for specific conflicts
    const conflictInfo = detectConflictType(title, content);
    if (conflictInfo) {
        category = 'wars';
        showOnMap = true;
        location = conflictInfo.location;
        return { category, showOnMap, location };
    }

    // Economy keywords
    const economyKeywords = ['economy', 'economic', 'inflation', 'recession', 'gdp', 'unemployment',
        'federal reserve', 'interest rate', 'stock market', 'financial', 'trade war', 'tariff',
        'market crash', 'dow jones', 'nasdaq', 'currency', 'debt', 'deficit', 'banking'];

    // Disaster keywords
    const disasterKeywords = ['hurricane', 'earthquake', 'tsunami', 'tornado', 'flood', 'wildfire',
        'volcanic', 'eruption', 'drought', 'famine', 'landslide', 'cyclone', 'typhoon', 'blizzard',
        'disaster', 'emergency', 'catastrophe'];

    // Science & Tech keywords
    const scienceTechKeywords = ['ai', 'artificial intelligence', 'technology', 'innovation', 'research',
        'discovery', 'space', 'nasa', 'spacex', 'quantum', 'biotech', 'digital', 'robot', 'machine learning',
        'computer', 'internet', 'cyber', 'science', 'scientific'];

    // Environment & People keywords
    const environmentPeopleKeywords = ['climate', 'environment', 'pollution', 'species', 'conservation',
        'renewable', 'sustainable', 'biodiversity', 'ecosystem', 'wildlife', 'forest', 'ocean',
        'carbon', 'emissions', 'green energy', 'fossil fuel'];

    // Culture & Curiosities keywords
    const cultureCuriositiesKeywords = ['culture', 'art', 'music', 'film', 'movie', 'book', 'travel',
        'tourism', 'cuisine', 'sport', 'entertainment', 'celebrity', 'fashion', 'lifestyle',
        'social media', 'viral', 'trend'];

    // Check for major wars and conflicts
    const warKeywords = ['war', 'conflict', 'military', 'troops', 'combat', 'battle', 'invasion',
        'airstrike', 'missile', 'attack', 'bombing', 'army', 'soldier', 'defense', 'weapon',
        'violence', 'fighting', 'ceasefire', 'peace talks', 'hostage'];

    if (warKeywords.some(keyword => text.includes(keyword))) {
        category = 'wars';
        showOnMap = true;
    } else if (economyKeywords.some(keyword => text.includes(keyword))) {
        category = 'economy';
        // Show on map if it's a major economic event
        showOnMap = text.includes('market crash') || text.includes('recession') ||
            text.includes('trade war') || text.includes('inflation crisis');
    } else if (disasterKeywords.some(keyword => text.includes(keyword))) {
        category = 'disaster';
        showOnMap = true; // Always show disasters on map
    } else if (scienceTechKeywords.some(keyword => text.includes(keyword))) {
        category = 'science-tech';
        // Only show major science/tech news on map
        showOnMap = text.includes('breakthrough') || text.includes('discovery') ||
            text.includes('historic') || text.includes('launch');
    } else if (environmentPeopleKeywords.some(keyword => text.includes(keyword))) {
        category = 'planet-people';
        // Show major environmental news on map
        showOnMap = text.includes('crisis') || text.includes('emergency') ||
            text.includes('historic') || text.includes('catastrophic');
    } else if (cultureCuriositiesKeywords.some(keyword => text.includes(keyword))) {
        category = 'culture-curiosities';
        // Rarely show on map
        showOnMap = text.includes('historic') || text.includes('unprecedented');
    } else {
        // Default to world politics
        category = 'world-politics';
        showOnMap = text.includes('president') || text.includes('election') ||
            text.includes('summit') || text.includes('treaty') ||
            text.includes('diplomatic crisis') || text.includes('protest');
    }

    return { category, showOnMap, location };
}

// Main function
async function main() {
    console.log("Starting news scraping process...");

    let allArticles = [];

    try {
        // Scrape RSS feeds first
        for (const feed of rssFeeds) {
            const articles = await scrapeRssFeed(feed);
            allArticles = [...allArticles, ...articles];
        }

        // Then scrape traditional news sources
        for (const source of newsSources) {
            const articles = await scrapeNewsSource(source);
            allArticles = [...allArticles, ...articles];
        }

        // Scrape HTTP sources that don't need JavaScript rendering
        try {
            const httpScraper = require('./http-scraper');
            const httpArticles = await httpScraper.scrapeAllHttpSources();
            allArticles = [...allArticles, ...httpArticles];
            console.log(`Scraped ${httpArticles.length} articles using HTTP scraper`);
        } catch (error) {
            console.error("Error scraping with HTTP scraper:", error);
        }

        // Finally, scrape sources that require JavaScript rendering
        try {
            // Dynamically import the Puppeteer scraper
            const puppeteerScraper = require('./puppeteer-scraper');
            const puppeteerArticles = await puppeteerScraper.scrapeAllPuppeteerSources();
            allArticles = [...allArticles, ...puppeteerArticles];
            console.log(`Scraped ${puppeteerArticles.length} articles using Puppeteer`);
        } catch (error) {
            console.error("Error scraping with Puppeteer:", error);
        }

        console.log(`Scraped ${allArticles.length} articles in total`);

        // If we got no articles, use sample data
        if (allArticles.length === 0) {
            console.log("No articles found, using sample data");
            try {
                allArticles = require('../public/news/sample-data.json');
            } catch (error) {
                console.log("No sample data found, generating fresh sample data");
                // Try to use the generator
                try {
                    const generateSampleNews = require('./generate-sample-news');
                    allArticles = generateSampleNews.generateSampleArticles(50);
                } catch (genError) {
                    console.error("Error generating sample data:", genError);
                    allArticles = [];
                }
            }
        }

        // Process all articles to ensure proper categorization
        allArticles = allArticles.map(article => {
            // Skip articles that already have a properly assigned category and showOnMap flag
            if (article.category && (article.showOnMap === true || article.showOnMap === false)) {
                return article;
            }

            const { category, showOnMap, location } = categorizeArticle(article.title, article.content);

            return {
                ...article,
                category: category || 'world-politics',
                showOnMap: showOnMap || false,
                location: location || article.location
            };
        });

        // Filter out duplicates based on title
        const uniqueArticles = [];
        const titles = new Set();

        for (const article of allArticles) {
            if (!titles.has(article.title)) {
                titles.add(article.title);
                uniqueArticles.push(article);
            }
        }

        // Sort by timestamp (newest first)
        uniqueArticles.sort((a, b) => b.timestamp - a.timestamp);

        // Filter articles to focus on our priority categories
        const priorityCategories = ['wars', 'disaster', 'economy', 'world-politics'];

        // First, get articles in our priority categories
        let priorityArticles = uniqueArticles.filter(article =>
            priorityCategories.includes(article.category)
        );

        // If we have too few articles, include others
        if (priorityArticles.length < 30) {
            const nonPriorityArticles = uniqueArticles.filter(article =>
                !priorityCategories.includes(article.category)
            );

            // Add remaining articles to reach at least 30 total if possible
            priorityArticles = [
                ...priorityArticles,
                ...nonPriorityArticles.slice(0, 30 - priorityArticles.length)
            ];
        }

        // Take the most recent 50 articles but maintain priority order
        const recentArticles = priorityArticles.slice(0, 50);

        // Ensure at least 10 articles show on map
        let mapCount = recentArticles.filter(article => article.showOnMap).length;
        if (mapCount < 10) {
            // If fewer than 10 articles are set to show on map, force some more important ones
            recentArticles.forEach(article => {
                if (!article.showOnMap && mapCount < 10 &&
                    (article.category === 'wars' || article.category === 'disaster')) {
                    article.showOnMap = true;
                    mapCount++;
                }
            });
        }

        // Log stats on what will be shown on the map
        const mapArticles = recentArticles.filter(article => article.showOnMap);
        console.log(`Articles to be shown on map: ${mapArticles.length}`);
        console.log(`Articles by category: 
            Wars: ${recentArticles.filter(a => a.category === 'wars').length}
            Disasters: ${recentArticles.filter(a => a.category === 'disaster').length}
            Economy: ${recentArticles.filter(a => a.category === 'economy').length}
            World Politics: ${recentArticles.filter(a => a.category === 'world-politics').length}
            Other: ${recentArticles.filter(a => !priorityCategories.includes(a.category)).length}
        `);

        // Write to file
        const outputPath = path.join(__dirname, '../public/news/data.json');
        await fs.writeFile(outputPath, JSON.stringify(recentArticles, null, 2));
        console.log(`Successfully wrote ${recentArticles.length} news events to ${outputPath}`);

    } catch (error) {
        console.error("Error in main function:", error);
    }
}

// Run the main function
main();