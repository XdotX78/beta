/**
 * News API Service
 * Handles fetching data from the News API
 */

import { getApiKeys } from '../env';

export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    content: string;
    author: string;
    publishedAt: string;
    url: string;
    urlToImage: string;
    source: {
        id: string;
        name: string;
    };
    // Add geo data for map integration
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

/**
 * Fetch top headlines from the News API
 */
export async function fetchTopHeadlines(
    country: string = 'us',
    category?: string,
    pageSize: number = 10,
    page: number = 1
): Promise<NewsApiResponse> {
    try {
        const { newsApiKey } = getApiKeys();

        if (!newsApiKey) {
            throw new Error('News API key is not defined in environment variables');
        }

        // Build query parameters
        const params = new URLSearchParams({
            country,
            pageSize: pageSize.toString(),
            page: page.toString(),
            apiKey: newsApiKey,
        });

        if (category) {
            params.append('category', category);
        }

        // Make the API request
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?${params.toString()}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour (3600 seconds)
        );

        if (!response.ok) {
            throw new Error(`News API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Add some random coordinates for map display (in a real app, you would use geolocation services)
        const articlesWithCoordinates = data.articles.map((article: NewsArticle) => ({
            ...article,
            id: article.url, // Use URL as a unique ID
            coordinates: {
                lat: Math.random() * 180 - 90, // Random latitude between -90 and 90
                lng: Math.random() * 360 - 180, // Random longitude between -180 and 180
            },
        }));

        return {
            ...data,
            articles: articlesWithCoordinates,
        };
    } catch (error) {
        console.error('Error fetching news data:', error);

        // Return a fallback response
        return {
            status: 'error',
            totalResults: 0,
            articles: [],
        };
    }
} 