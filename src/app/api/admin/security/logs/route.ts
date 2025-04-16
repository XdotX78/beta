import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SecurityLogger, SecurityEventType, SecurityEventSeverity } from '@/lib/security-logger';
import { verifyRole } from '@/middleware/roleMiddleware';
import { UserRole } from '@/app/models/user.model';

/**
 * @swagger
 * /api/admin/security/logs:
 *   get:
 *     summary: Get security event logs
 *     description: Retrieve security event logs with optional filtering. Requires admin role.
 *     tags:
 *       - Security
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter logs by user ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, PASSWORD_CHANGE, ACCOUNT_LOCKOUT]
 *         description: Filter logs by event type
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [INFO, WARNING, ALERT, CRITICAL]
 *         description: Filter logs by severity level
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of logs to return
 *     responses:
 *       200:
 *         description: Security logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SecurityEvent'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Requires admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export async function GET(request: Request) {
    try {
        // Verify admin role
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        // Check if user has admin role
        const hasAdminRole = session.user.roles?.includes(UserRole.ADMIN);
        if (!hasAdminRole) {
            return NextResponse.json({
                success: false,
                message: 'Admin access required'
            }, { status: 403 });
        }

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const type = searchParams.get('type') as SecurityEventType;
        const severity = searchParams.get('severity') as SecurityEventSeverity;
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

        // Get events based on filters
        let events;
        if (userId) {
            events = await SecurityLogger.getRecentEvents(userId, limit);
        } else {
            events = await SecurityLogger.getRecentEvents(undefined, limit);
        }

        // Apply additional filters if provided
        if (type || severity) {
            events = events.filter(event =>
                (!type || event.type === type) &&
                (!severity || event.severity === severity)
            );
        }

        return NextResponse.json({
            success: true,
            events
        });

    } catch (error) {
        console.error('Security logs retrieval error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve security logs'
        }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/admin/security/logs:
 *   delete:
 *     summary: Clean up old security logs
 *     description: Remove security logs older than the specified number of days. Requires admin role.
 *     tags:
 *       - Security
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - daysToKeep
 *             properties:
 *               daysToKeep:
 *                 type: integer
 *                 minimum: 30
 *                 maximum: 365
 *                 default: 90
 *     responses:
 *       200:
 *         description: Logs cleaned up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Requires admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export async function DELETE(request: Request) {
    try {
        // Verify admin role
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        // Check if user has admin role
        const hasAdminRole = session.user.roles?.includes(UserRole.ADMIN);
        if (!hasAdminRole) {
            return NextResponse.json({
                success: false,
                message: 'Admin access required'
            }, { status: 403 });
        }

        const { daysToKeep } = await request.json();

        // Validate daysToKeep
        if (!daysToKeep || daysToKeep < 30 || daysToKeep > 365) {
            return NextResponse.json({
                success: false,
                message: 'Days to keep must be between 30 and 365'
            }, { status: 400 });
        }

        await SecurityLogger.cleanupOldEvents(daysToKeep);

        return NextResponse.json({
            success: true,
            message: `Successfully cleaned up logs older than ${daysToKeep} days`
        });

    } catch (error) {
        console.error('Security logs cleanup error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to cleanup security logs'
        }, { status: 500 });
    }
} 