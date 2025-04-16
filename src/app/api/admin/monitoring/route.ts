import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/middleware/roleMiddleware';
import Logger, { LogCategory } from '@/lib/logger';
import { Redis } from '@upstash/redis';
import os from 'os';

const redis = new Redis({
    url: process.env.REDIS_URL || '',
    token: process.env.REDIS_TOKEN || ''
});

export async function GET(request: NextRequest) {
    const authCheck = await verifyAdmin(request);
    if (authCheck instanceof NextResponse) {
        return authCheck;
    }

    try {
        // Get system metrics
        const systemMetrics = {
            cpu: {
                loadAvg: os.loadavg(),
                cpus: os.cpus().length,
                uptime: os.uptime()
            },
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                usage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%'
            },
            platform: os.platform(),
            arch: os.arch()
        };

        // Get recent logs
        const recentLogs = await Logger.getRecentLogs(50);
        const authLogs = await Logger.getLogsByCategory(LogCategory.AUTH, 20);
        const securityLogs = await Logger.getLogsByCategory(LogCategory.SECURITY, 20);

        // Get Redis metrics
        const redisInfo = await redis.info();

        // Get active sessions count (example implementation)
        const activeSessions = await redis.keys('session:*');
        const activeTokens = await redis.keys('token:*');

        const monitoringData = {
            timestamp: new Date().toISOString(),
            system: systemMetrics,
            application: {
                activeSessions: activeSessions.length,
                activeTokens: activeTokens.length,
                recentLogs,
                authLogs,
                securityLogs
            },
            database: {
                redis: redisInfo
            }
        };

        // Log system check
        await Logger.logSystemEvent('System health check performed', {
            checkTime: monitoringData.timestamp,
            metrics: {
                activeSessions: activeSessions.length,
                memoryUsage: systemMetrics.memory.usage
            }
        });

        return NextResponse.json(monitoringData, { status: 200 });
    } catch (error) {
        console.error('Monitoring error:', error);
        await Logger.logApiError('Error in monitoring endpoint', request, error);
        return NextResponse.json(
            { message: 'Error fetching monitoring data' },
            { status: 500 }
        );
    }
} 