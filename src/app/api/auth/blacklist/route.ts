import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/auth/blacklist:
 *   get:
 *     summary: Check token blacklist status
 *     description: Check if a token is blacklisted
 *     tags:
 *       - Security
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token to check
 *     responses:
 *       200:
 *         description: Token status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isBlacklisted:
 *                   type: boolean
 *       400:
 *         description: Token parameter missing
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

// Store blacklisted tokens with their expiry
interface BlacklistedToken {
    token: string;
    expiresAt: Date;
    userId: ObjectId;
    createdAt: Date;
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        const { token } = await request.json();
        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Token is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const blacklist = db.collection('tokenBlacklist');

        // Add token to blacklist
        await blacklist.insertOne({
            token,
            userId: new ObjectId(session.user.id),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            createdAt: new Date()
        } as BlacklistedToken);

        // Clean up expired tokens periodically
        await blacklist.deleteMany({
            expiresAt: { $lt: new Date() }
        });

        return NextResponse.json({
            success: true,
            message: 'Token blacklisted successfully'
        });

    } catch (error) {
        console.error('Token blacklist error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to blacklist token'
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Token is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const blacklist = db.collection('tokenBlacklist');

        // Check if token is blacklisted
        const blacklistedToken = await blacklist.findOne({ token });

        return NextResponse.json({
            success: true,
            isBlacklisted: !!blacklistedToken
        });

    } catch (error) {
        console.error('Token blacklist check error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to check token status'
        }, { status: 500 });
    }
} 