import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export enum LogCategory {
    AUTH = 'AUTH',
    SECURITY = 'SECURITY',
    API = 'API',
    SYSTEM = 'SYSTEM'
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    category: LogCategory;
    message: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}

const redis = new Redis({
    url: process.env.REDIS_URL || '',
    token: process.env.REDIS_TOKEN || ''
});

class Logger {
    private static readonly LOG_KEY = 'system:logs';
    private static readonly MAX_LOGS = 1000;

    static async log(
        level: LogLevel,
        category: LogCategory,
        message: string,
        request?: NextRequest,
        metadata?: Record<string, any>
    ) {
        try {
            const entry: LogEntry = {
                timestamp: new Date().toISOString(),
                level,
                category,
                message,
                ip: request?.ip,
                userAgent: request?.headers.get('user-agent') || undefined,
                metadata
            };

            // Add to Redis list
            await redis.lpush(this.LOG_KEY, JSON.stringify(entry));
            // Trim to keep only recent logs
            await redis.ltrim(this.LOG_KEY, 0, this.MAX_LOGS - 1);

            // Console logging for development
            if (process.env.NODE_ENV === 'development') {
                console.log(`[${entry.level}][${entry.category}] ${entry.message}`);
                if (metadata) {
                    console.log('Metadata:', metadata);
                }
            }
        } catch (error) {
            console.error('Logging error:', error);
        }
    }

    static async getRecentLogs(limit: number = 100): Promise<LogEntry[]> {
        try {
            const logs = await redis.lrange(this.LOG_KEY, 0, limit - 1);
            return logs.map(log => JSON.parse(log));
        } catch (error) {
            console.error('Error fetching logs:', error);
            return [];
        }
    }

    static async getLogsByCategory(category: LogCategory, limit: number = 100): Promise<LogEntry[]> {
        try {
            const allLogs = await this.getRecentLogs(this.MAX_LOGS);
            return allLogs
                .filter(log => log.category === category)
                .slice(0, limit);
        } catch (error) {
            console.error('Error fetching logs by category:', error);
            return [];
        }
    }

    // Convenience methods for common logging scenarios
    static async logAuthAttempt(success: boolean, request: NextRequest, userId?: string) {
        const message = success ? 'Successful authentication' : 'Failed authentication attempt';
        await this.log(
            success ? LogLevel.INFO : LogLevel.WARN,
            LogCategory.AUTH,
            message,
            request,
            { userId }
        );
    }

    static async logSecurityEvent(message: string, request: NextRequest, metadata?: Record<string, any>) {
        await this.log(
            LogLevel.WARN,
            LogCategory.SECURITY,
            message,
            request,
            metadata
        );
    }

    static async logApiError(message: string, request: NextRequest, error: any) {
        await this.log(
            LogLevel.ERROR,
            LogCategory.API,
            message,
            request,
            { error: error.message || error }
        );
    }

    static async logSystemEvent(message: string, metadata?: Record<string, any>) {
        await this.log(
            LogLevel.INFO,
            LogCategory.SYSTEM,
            message,
            undefined,
            metadata
        );
    }
}

export default Logger; 