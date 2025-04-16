import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export enum SecurityEventType {
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    LOGOUT = 'LOGOUT',
    PASSWORD_CHANGE = 'PASSWORD_CHANGE',
    PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
    PASSWORD_RESET_COMPLETE = 'PASSWORD_RESET_COMPLETE',
    ACCOUNT_LOCKOUT = 'ACCOUNT_LOCKOUT',
    ACCOUNT_UNLOCK = 'ACCOUNT_UNLOCK',
    TOKEN_REFRESH = 'TOKEN_REFRESH',
    TOKEN_BLACKLIST = 'TOKEN_BLACKLIST',
    TWO_FACTOR_SETUP = 'TWO_FACTOR_SETUP',
    TWO_FACTOR_DISABLE = 'TWO_FACTOR_DISABLE',
    SECURITY_QUESTIONS_UPDATE = 'SECURITY_QUESTIONS_UPDATE',
    ROLE_CHANGE = 'ROLE_CHANGE',
    SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

export enum SecurityEventSeverity {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ALERT = 'ALERT',
    CRITICAL = 'CRITICAL'
}

export interface SecurityEvent {
    userId?: string;
    type: SecurityEventType;
    severity: SecurityEventSeverity;
    timestamp: Date;
    ip?: string;
    userAgent?: string;
    details: any;
    metadata?: {
        deviceInfo?: string;
        location?: string;
        sessionId?: string;
    };
}

export class SecurityLogger {
    private static async getCollection() {
        const client = await clientPromise;
        const db = client.db();
        return db.collection('securityEvents');
    }

    static async log(event: Omit<SecurityEvent, 'timestamp'>) {
        try {
            const collection = await this.getCollection();
            const securityEvent: SecurityEvent = {
                ...event,
                timestamp: new Date()
            };

            await collection.insertOne(securityEvent);

            // If it's a high-severity event, trigger immediate notification
            if (event.severity === SecurityEventSeverity.CRITICAL) {
                await this.notifySecurityTeam(securityEvent);
            }

            return true;
        } catch (error) {
            console.error('Security event logging failed:', error);
            return false;
        }
    }

    static async getRecentEvents(userId?: string, limit: number = 50) {
        try {
            const collection = await this.getCollection();
            const query = userId ? { userId } : {};

            return await collection
                .find(query)
                .sort({ timestamp: -1 })
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Failed to retrieve security events:', error);
            return [];
        }
    }

    static async getSuspiciousActivities(userId: string, timeWindow: number = 24) {
        try {
            const collection = await this.getCollection();
            const timeThreshold = new Date(Date.now() - timeWindow * 60 * 60 * 1000);

            return await collection
                .find({
                    userId,
                    timestamp: { $gte: timeThreshold },
                    $or: [
                        { type: SecurityEventType.LOGIN_FAILURE },
                        { type: SecurityEventType.ACCOUNT_LOCKOUT },
                        { type: SecurityEventType.SUSPICIOUS_ACTIVITY },
                        { severity: SecurityEventSeverity.ALERT },
                        { severity: SecurityEventSeverity.CRITICAL }
                    ]
                })
                .sort({ timestamp: -1 })
                .toArray();
        } catch (error) {
            console.error('Failed to retrieve suspicious activities:', error);
            return [];
        }
    }

    private static async notifySecurityTeam(event: SecurityEvent) {
        // TODO: Implement security team notification
        // This could be email, Slack, SMS, etc.
        console.warn('CRITICAL SECURITY EVENT:', {
            type: event.type,
            userId: event.userId,
            timestamp: event.timestamp,
            details: event.details
        });
    }

    static async cleanupOldEvents(daysToKeep: number = 90) {
        try {
            const collection = await this.getCollection();
            const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

            await collection.deleteMany({
                timestamp: { $lt: cutoffDate }
            });

            return true;
        } catch (error) {
            console.error('Failed to cleanup old security events:', error);
            return false;
        }
    }
} 