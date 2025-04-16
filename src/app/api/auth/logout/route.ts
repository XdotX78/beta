import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { SecurityLogger, SecurityEventType, SecurityEventSeverity } from '@/lib/security-logger';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidates the current session and blacklists the refresh token
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to be blacklisted
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully logged out
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    let session;

    try {
        session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            await SecurityLogger.log({
                type: SecurityEventType.LOGOUT,
                severity: SecurityEventSeverity.WARNING,
                details: {
                    reason: 'Logout attempt without valid session'
                },
                ip,
                userAgent
            });

            return NextResponse.json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        const { refreshToken } = await request.json();

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');
        const blacklist = db.collection('tokenBlacklist');

        // Clear refresh token from user
        await users.updateOne(
            { _id: new ObjectId(session.user.id) },
            {
                $set: {
                    refreshToken: null,
                    refreshTokenExpiry: null,
                    lastLogout: new Date()
                }
            }
        );

        // Blacklist the refresh token if provided
        if (refreshToken) {
            await blacklist.insertOne({
                token: refreshToken,
                userId: new ObjectId(session.user.id),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                createdAt: new Date()
            });

            await SecurityLogger.log({
                type: SecurityEventType.TOKEN_BLACKLIST,
                severity: SecurityEventSeverity.INFO,
                userId: session.user.id,
                ip,
                userAgent,
                details: {
                    tokenType: 'refresh',
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
        }

        // Log successful logout
        await SecurityLogger.log({
            type: SecurityEventType.LOGOUT,
            severity: SecurityEventSeverity.INFO,
            userId: session.user.id,
            ip,
            userAgent,
            details: {
                email: session.user.email
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);

        await SecurityLogger.log({
            type: SecurityEventType.LOGOUT,
            severity: SecurityEventSeverity.ALERT,
            userId: session?.user?.id,
            ip,
            userAgent,
            details: {
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        });

        return NextResponse.json({
            success: false,
            message: 'Failed to logout'
        }, { status: 500 });
    }
} 