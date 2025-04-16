/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     description: Change user's password (requires current password)
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordChangeRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid password format or matches previous passwords
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { NextRequest, NextResponse } from 'next/server';
import { validatePasswordChange } from '@/middleware/validation/passwordChange';
import { SecurityLogger } from '@/lib/security/logger';
import { SecurityEventType, SecurityEventSeverity } from '@/lib/security/types';
import { getSession } from '@/lib/auth/session';
import { comparePasswords, hashPassword } from '@/lib/auth/passwords';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const session = await getSession(request);
    if (!session?.user?.id) {
        SecurityLogger.log({
            type: SecurityEventType.UNAUTHORIZED_PASSWORD_CHANGE,
            severity: SecurityEventSeverity.MEDIUM,
            ip: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            userId: null,
            details: 'Unauthorized password change attempt'
        });
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const validationResult = await validatePasswordChange(request);

    if (validationResult instanceof NextResponse) {
        SecurityLogger.log({
            type: SecurityEventType.INVALID_PASSWORD_FORMAT,
            severity: SecurityEventSeverity.LOW,
            ip: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            userId: session.user.id,
            details: 'Invalid password format in change password request'
        });
        return validationResult;
    }

    if (!validationResult) {
        SecurityLogger.log({
            type: SecurityEventType.INVALID_REQUEST,
            severity: SecurityEventSeverity.LOW,
            ip: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            userId: session.user.id,
            details: 'Invalid request format in change password attempt'
        });
        return NextResponse.json({ message: 'Invalid request format' }, { status: 400 });
    }

    const { currentPassword, newPassword } = validationResult;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true }
        });

        if (!user) {
            SecurityLogger.log({
                type: SecurityEventType.USER_NOT_FOUND,
                severity: SecurityEventSeverity.HIGH,
                ip: request.ip || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                userId: session.user.id,
                details: 'User not found during password change'
            });
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isCurrentPasswordValid = await comparePasswords(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            SecurityLogger.log({
                type: SecurityEventType.INVALID_CURRENT_PASSWORD,
                severity: SecurityEventSeverity.MEDIUM,
                ip: request.ip || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                userId: session.user.id,
                details: 'Invalid current password in change password attempt'
            });
            return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
        }

        const hashedNewPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedNewPassword }
        });

        SecurityLogger.log({
            type: SecurityEventType.PASSWORD_CHANGED,
            severity: SecurityEventSeverity.MEDIUM,
            ip: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            userId: session.user.id,
            details: 'Password changed successfully'
        });

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        SecurityLogger.log({
            type: SecurityEventType.PASSWORD_CHANGE_ERROR,
            severity: SecurityEventSeverity.HIGH,
            ip: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            userId: session.user.id,
            details: `Error during password change: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
} 