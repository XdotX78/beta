/**
 * Environment variable utilities for safer access
 */

// Basic environment variables with fallbacks
export const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Gaia Explorer';
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

// API keys - returns undefined if not set
export const getApiKeys = () => ({
    openWeatherApiKey: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
    newsApiKey: process.env.NEWS_API_KEY,
    mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
});

// Function to check if required API keys are available
export const checkRequiredApiKeys = () => {
    const keys = getApiKeys();
    const missing: string[] = [];

    if (!keys.openWeatherApiKey) missing.push('OpenWeather API Key');
    if (!keys.newsApiKey) missing.push('News API Key');

    return {
        allKeysPresent: missing.length === 0,
        missingKeys: missing
    };
};

// Analytics
export const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID; 