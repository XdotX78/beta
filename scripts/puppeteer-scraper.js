/**
 * Puppeteer-based scraper for JavaScript-heavy news sites
 * This scraper can handle dynamic content that requires browser rendering
 */
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const crypto = require('crypto');

// Import location detection functions from the main scraper
const { detectLocation, detectNewsType } = require('./news-scraper');

// Function to generate unique ID from text
function generateId(text) {
    return crypto.createHash('md5').update(text).digest('hex').substring(0, 10);
}

// Sources that require browser rendering
const puppeteerSources = [
    {
        name: 'Kyiv Independent',
        url: 'https://kyivindependent.com/news',
        articleSelector: '.article-card',
        titleSelector: '.article-card__title',
        contentSelector: '.article-card__description',
        linkSelector: 'a',
        linkAttribute: 'href',
        baseUrl: 'https://kyivindependent.com',
        category: 'conflict',
        defaultLocation: { lat: 50.4501, lng: 30.5234, region: 'Europe' } // Kyiv
    },
    {
        name: 'Taiwan Today',
        url: 'https://taiwantoday.tw/news.php?unit=2,6,10,15,18&post=',
        articleSelector: '.list-topic-type',
        titleSelector: 'h3',
        contentSelector: 'p',
        linkSelector: 'a.d-block',
        linkAttribute: 'href',
        baseUrl: 'https://taiwantoday.tw/',
        category: 'politics',
        defaultLocation: { lat: 23.6978, lng: 120.9605, region: 'Asia' } // Taiwan
    }
];

/**
 * Scrape a news source using Puppeteer
 * @param {Object} source - The source configuration
 * @returns {Promise<Array>} - Array of news articles
 */
async function scrapePuppeteerSource(source) {
    console.log(`Scraping ${source.name} with Puppeteer...`);
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set a user agent to avoid bot detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36');

        // Set viewport size
        await page.setViewport({ width: 1920, height: 1080 });

        // Add timeout for page load
        await page.goto(source.url, { timeout: 30000, waitUntil: 'domcontentloaded' });

        // Wait for the content to load
        try {
            await page.waitForSelector(source.articleSelector, { timeout: 10000 });
        } catch (error) {
            console.error(`Timeout waiting for ${source.articleSelector} on ${source.name}:`, error.message);
            return [];
        }

        // Extract articles from the page
        const articles = await page.evaluate((source) => {
            const articleElements = document.querySelectorAll(source.articleSelector);
            const results = [];

            articleElements.forEach((element) => {
                try {
                    // Extract title
                    const titleElement = element.querySelector(source.titleSelector);
                    if (!titleElement) return;
                    const title = titleElement.textContent.trim();

                    // Extract content
                    const contentElement = element.querySelector(source.contentSelector);
                    const content = contentElement ? contentElement.textContent.trim() : '';

                    // Extract link
                    const linkElement = element.querySelector(source.linkSelector);
                    if (!linkElement) return;

                    let link = linkElement.getAttribute(source.linkAttribute || 'href');

                    // Add base URL if link is relative
                    if (link && !link.startsWith('http')) {
                        link = source.baseUrl + (link.startsWith('/') ? link : '/' + link);
                    }

                    if (title && link) {
                        results.push({
                            title,
                            content,
                            link,
                            date: new Date().toISOString()
                        });
                    }
                } catch (e) {
                    console.error('Error extracting article:', e);
                }
            });

            return results;
        }, source);

        console.log(`Found ${articles.length} articles on ${source.name}`);

        // Process articles and add metadata
        const processedArticles = articles.map(article => {
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

        return processedArticles;
    } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        return [];
    } finally {
        await browser.close();
    }
}

/**
 * Scrape all sources that require Puppeteer
 * @returns {Promise<Array>} - Array of all articles from all sources
 */
async function scrapeAllPuppeteerSources() {
    let allArticles = [];

    for (const source of puppeteerSources) {
        try {
            const articles = await scrapePuppeteerSource(source);
            allArticles = [...allArticles, ...articles];
        } catch (error) {
            console.error(`Error scraping source ${source.name}:`, error);
        }
    }

    return allArticles;
}

// Export for use in the main scraper
module.exports = {
    scrapeAllPuppeteerSources
}; 