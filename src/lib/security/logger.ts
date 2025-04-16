import { SecurityEvent, SecurityEventType, SecurityEventSeverity } from './types';
import { prisma } from '@/lib/prisma';

export class SecurityLogger {
    private static async logToDatabase(event: SecurityEvent) {
        try {
            await prisma.securityLog.create({
                data: {
                    type: event.type,
                    severity: event.severity,
                    timestamp: event.timestamp || new Date(),
                    ip: event.ip,
                    userAgent: event.userAgent,
                    userId: event.userId,
                    details: event.details,
                    metadata: event.metadata ? JSON.stringify(event.metadata) : null
                }
            });
        } catch (error) {
            console.error('Failed to log security event:', error);
        }
    }

    static async log(event: SecurityEvent) {
        // Set timestamp if not provided
        if (!event.timestamp) {
            event.timestamp = new Date();
        }

        // Log to database
        await this.logToDatabase(event);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('[Security Event]', {
                type: event.type,
                severity: event.severity,
                timestamp: event.timestamp,
                ip: event.ip,
                userAgent: event.userAgent,
                userId: event.userId,
                details: event.details,
                metadata: event.metadata
            });
        }
    }

    static async logAuthEvent(
        type: SecurityEventType,
        severity: SecurityEventSeverity,
        ip: string,
        userAgent: string,
        userId: string | null,
        details: string,
        metadata?: Record<string, any>
    ) {
        await this.log({
            type,
            severity,
            ip,
            userAgent,
            userId,
            details,
            metadata
        });
    }
} 