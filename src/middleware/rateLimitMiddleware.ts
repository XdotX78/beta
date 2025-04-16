import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

interface RateLimitConfig {
    limit: number;
    window: number; // in seconds
}

const redis = new Redis({
    url: process.env.REDIS_URL || '',
    token: process.env.REDIS_TOKEN || ''
});

// Rate limit configurations for different endpoints
const rateLimits: { [key: string]: RateLimitConfig } = {
    login: { limit: 5, window: 300 }, // 5 attempts per 5 minutes
    register: { limit: 3, window: 3600 }, // 3 attempts per hour
    refreshToken: { limit: 10, window: 60 }, // 10 attempts per minute
    passwordReset: { limit: 3, window: 3600 }, // 3 attempts per hour
    api: { limit: 100, window: 60 } // 100 requests per minute for general API endpoints
};

export async function rateLimit(
    request: NextRequest,
    type: keyof typeof rateLimits = 'api'
): Promise<NextResponse | null> {
    try {
        const ip = request.ip || 'anonymous';
        const key = `rate-limit:${type}:${ip}`;
        const config = rateLimits[type];

        // Get the current count and timestamp
        const [count, timestamp] = await Promise.all([
            redis.get<number>(key),
            redis.get<number>(`${key}:timestamp`)
        ]);

        const now = Math.floor(Date.now() / 1000);

        // If this is a new window or the first request
        if (!count || !timestamp || (now - timestamp) >= config.window) {
            await Promise.all([
                redis.set(key, 1),
                redis.set(`${key}:timestamp`, now),
                redis.expire(key, config.window),
                redis.expire(`${key}:timestamp`, config.window)
            ]);
            return null;
        }

        // If within the window but exceeded limit
        if (count >= config.limit) {
            const timeRemaining = timestamp + config.window - now;
            return NextResponse.json({
                message: `Too many requests. Please try again in ${timeRemaining} seconds.`
            }, { status: 429 });
        }

        // Increment the counter
        await redis.incr(key);
        return null;

    } catch (error) {
        console.error('Rate limit error:', error);
        // Allow the request to proceed if rate limiting fails
        return null;
    }
}

// Specific rate limiting middlewares
export async function loginRateLimit(request: NextRequest) {
    return rateLimit(request, 'login');
}

export async function registerRateLimit(request: NextRequest) {
    return rateLimit(request, 'register');
}

export async function refreshTokenRateLimit(request: NextRequest) {
    return rateLimit(request, 'refreshToken');
}

export async function passwordResetRateLimit(request: NextRequest) {
    return rateLimit(request, 'passwordReset');
}

// Example usage in an API route:
/*
export async function POST(request: NextRequest) {
    const rateLimitResult = await loginRateLimit(request);
    if (rateLimitResult) {
        return rateLimitResult;
    }
    // Continue with the login logic
}
*/ 