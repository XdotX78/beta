import { NextResponse } from 'next/server';
import { getApiKeys } from '@/app/lib/env';

export async function GET() {
    try {
        const { newsApiKey } = getApiKeys();

        // Check if the API key is defined
        const ready = !!newsApiKey;

        return NextResponse.json({
            ready,
            message: ready
                ? 'News API service is ready'
                : 'News API key is missing in environment variables',
        });
    } catch (error) {
        return NextResponse.json(
            {
                ready: false,
                message: 'Failed to check News API service',
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
} 