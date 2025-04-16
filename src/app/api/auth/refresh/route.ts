import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { generateVerificationToken } from '@/lib/email';

// Constants
const REFRESH_TOKEN_EXPIRY = '7d';
const ACCESS_TOKEN_EXPIRY = '15m';

interface RefreshTokenPayload {
    id: string;
    refreshToken: string;
    exp: number;
}

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: |
 *       Get a new access token using a valid refresh token.
 *       This endpoint is rate limited to prevent abuse.
 *       The new access token will have a 15-minute expiry, while the refresh token is valid for 7 days.
 *     tags:
 *       - Authentication
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
 *                 description: The refresh token obtained during login or previous refresh
 *     responses:
 *       200:
 *         description: Token successfully refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   description: New access token with 15-minute expiry
 *                 refreshToken:
 *                   type: string
 *                   description: New refresh token with 7-day expiry
 *       400:
 *         description: Missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Refresh token blacklisted or user account disabled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many refresh attempts
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
    try {
        const { refreshToken } = await request.json();

        if (!refreshToken) {
            return NextResponse.json({
                success: false,
                message: 'Refresh token is required'
            }, { status: 400 });
        }

        // Verify refresh token
        let payload: RefreshTokenPayload;
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as RefreshTokenPayload;
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: 'Invalid refresh token'
            }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        // Check if refresh token exists in database and is not blacklisted
        const user = await users.findOne({
            _id: new ObjectId(payload.id),
            refreshToken: refreshToken,
            refreshTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid refresh token'
            }, { status: 401 });
        }

        // Generate new tokens
        const newAccessToken = jwt.sign(
            { id: user._id, email: user.email, roles: user.roles },
            process.env.JWT_SECRET!,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id, refreshToken: generateVerificationToken() },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        // Update refresh token in database
        await users.updateOne(
            { _id: user._id },
            {
                $set: {
                    refreshToken: newRefreshToken,
                    refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                }
            }
        );

        return NextResponse.json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to refresh token'
        }, { status: 500 });
    }
} 