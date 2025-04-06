import { NextResponse } from 'next/server';
import { fetchNewsWithFallback } from '@/app/lib/scrapers/newsApi';

// Set revalidation time to refresh the data every hour
export const revalidate = 3600;

export async function GET() {
    try {
        const newsEvents = await fetchNewsWithFallback();

        // Cache the response for 1 hour
        return NextResponse.json(
            {
                success: true,
                data: newsEvents,
                timestamp: new Date().toISOString(),
                source: 'API'
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
                }
            }
        );
    } catch (error) {
        console.error('Error in news API route:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch news data' },
            { status: 500 }
        );
    }
} 