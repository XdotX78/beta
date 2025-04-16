interface RateLimitOptions {
    interval: number;
    uniqueTokenPerInterval: number;
}

interface TokenBucket {
    tokens: number;
    lastRefill: number;
}

class RateLimiter {
    private tokenStore: Map<string, TokenBucket>;
    private interval: number;
    private maxTokens: number;

    constructor(options: RateLimitOptions) {
        this.tokenStore = new Map();
        this.interval = options.interval;
        this.maxTokens = options.uniqueTokenPerInterval;
    }

    async check(limit: number, identifier: string): Promise<void> {
        const now = Date.now();
        let bucket = this.tokenStore.get(identifier);

        if (!bucket) {
            bucket = {
                tokens: this.maxTokens,
                lastRefill: now
            };
            this.tokenStore.set(identifier, bucket);
        }

        // Calculate tokens to add based on time passed
        const timePassed = now - bucket.lastRefill;
        const tokensToAdd = Math.floor(timePassed / this.interval) * this.maxTokens;

        // Refill tokens
        bucket.tokens = Math.min(bucket.tokens + tokensToAdd, this.maxTokens);
        bucket.lastRefill = now;

        // Check if enough tokens are available
        if (bucket.tokens < limit) {
            throw new Error('Rate limit exceeded');
        }

        // Consume tokens
        bucket.tokens -= limit;
        this.tokenStore.set(identifier, bucket);
    }

    // Clean up old entries
    cleanup() {
        const now = Date.now();
        for (const [identifier, bucket] of this.tokenStore.entries()) {
            if (now - bucket.lastRefill > this.interval * 2) {
                this.tokenStore.delete(identifier);
            }
        }
    }
}

export function rateLimit(options: RateLimitOptions) {
    return new RateLimiter(options);
} 