/**
 * HTTP scraper for news sites with simple HTML structure
 * This scraper uses direct HTTP requests (via Axios) and Cheerio for parsing
 */
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

// Import location detection functions from the main scraper
const { detectLocation, detectNewsType } = require('./news-scraper');

// Function to generate unique ID from text
function generateId(text) {
    return crypto.createHash('md5').update(text).digest('hex').substring(0, 10);
}

// Sources for HTTP scraping
const httpSources = [
    {
        name: 'Reuters Ukraine',
        url: 'https://www.reuters.com/world/europe/ukraine/',
        articleSelector: 'article.story',
        titleSelector: '.story-content h3',
        contentSelector: '.story-content p',
        linkSelector: 'a',
        linkAttribute: 'href',
        baseUrl: 'https://www.reuters.com',
        category: 'conflict',
        defaultLocation: { lat: 50.4501, lng: 30.5234, region: 'Europe' } // Kyiv
    },
    {
        name: 'BBC Asia',
        url: 'https://www.bbc.com/news/world/asia',
        articleSelector: '.gs-c-promo',
        titleSelector: '.gs-c-promo-heading__title',
        contentSelector: '.gs-c-promo-summary',
        linkSelector: '.gs-c-promo-heading',
        linkAttribute: 'href',
        baseUrl: 'https://www.bbc.com',
        category: 'general',
        defaultLocation: { lat: 34.0479, lng: 100.6197, region: 'Asia' } // Asia general
    }
];

/**
 * Scrape a news source using HTTP requests and Cheerio
 * @param {Object} source - The source configuration
 * @returns {Promise<Array>} - Array of news articles
 */
async function scrapeHttpSource(source) {
    console.log(`Scraping ${source.name} with HTTP...`);

    try {
        // Set timeout and headers for the request
        const response = await axios.get(source.url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        if (response.status !== 200) {
            console.error(`Failed to fetch ${source.name}: ${response.status}`);
            return [];
        }

        const html = response.data;
        const $ = cheerio.load(html);
        const articles = [];

        // Find all article elements
        $(source.articleSelector).each((i, element) => {
            try {
                // Extract title
                const titleElement = $(element).find(source.titleSelector);
                if (!titleElement.length) return;
                const title = titleElement.text().trim();

                // Extract content
                const contentElement = $(element).find(source.contentSelector);
                const content = contentElement.length ? contentElement.text().trim() : '';

                // Extract link
                const linkElement = $(element).find(source.linkSelector);
                if (!linkElement.length) return;

                let link = linkElement.attr(source.linkAttribute || 'href');

                // Add base URL if link is relative
                if (link && !link.startsWith('http')) {
                    link = source.baseUrl + (link.startsWith('/') ? link : '/' + link);
                }

                if (title && link) {
                    articles.push({
                        title,
                        content,
                        link,
                        date: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.error(`Error processing article from ${source.name}:`, error);
            }
        });

        console.log(`Found ${articles.length} articles on ${source.name}`);

        // Process articles and add metadata
        return articles.map(article => {
            // Create the combined text for location and type detection
            const fullText = `${article.title} ${article.content}`;

            // Detect location and category
            const location = detectLocation(fullText);

            // Use default location if none detected
            if (!location.lat || !location.lng) {
                if (source.defaultLocation) {
                    location.lat = source.defaultLocation.lat;
                    location.lng = source.defaultLocation.lng;
                    location.region = source.defaultLocation.region || '';
                }
            }

            // Use source category as default if detection fails
            const type = detectNewsType(fullText) || source.category;

            return {
                id: generateId(article.title),
                title: article.title,
                content: article.content.substring(0, 300) + (article.content.length > 300 ? '...' : ''),
                source: source.name,
                url: article.link,
                date: article.date,
                timestamp: new Date(article.date).getTime(),
                location: {
                    lat: location.lat,
                    lng: location.lng
                },
                type: type,
                region: location.region || ''
            };
        });

    } catch (error) {
        console.error(`Error scraping ${source.name}:`, error.message);
        return [];
    }
}

/**
 * Scrape all HTTP sources
 * @returns {Promise<Array>} - Array of news articles from all HTTP sources
 */
async function scrapeAllHttpSources() {
    let allArticles = [];

    for (const source of httpSources) {
        try {
            const articles = await scrapeHttpSource(source);
            allArticles = [...allArticles, ...articles];
        } catch (error) {
            console.error(`Error scraping ${source.name}:`, error);
        }
    }

    return allArticles;
}

// Export for use in the main scraper
module.exports = {
    scrapeAllHttpSources
}; 