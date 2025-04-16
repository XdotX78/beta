import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import speakeasy from 'speakeasy';
import { ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/auth/2fa/verify:
 *   post:
 *     summary: Verify 2FA token
 *     description: Verify a 2FA token during login
 *     tags:
 *       - Security
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - sessionId
 *             properties:
 *               token:
 *                 type: string
 *                 description: The 6-digit 2FA token
 *               sessionId:
 *                 type: string
 *                 description: Temporary session ID from initial login
 *     responses:
 *       200:
 *         description: 2FA verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid token or session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many verification attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export async function POST(request: Request) {
    try {
        // Check if user is authenticated
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
                message: 'Verification code is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        // Get user with temporary secret
        const user = await users.findOne({
            _id: new ObjectId(session.user.id),
            twoFactorPending: true
        });

        if (!user || !user.tempTwoFactorSecret) {
            return NextResponse.json({
                success: false,
                message: '2FA setup not initiated'
            }, { status: 400 });
        }

        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: user.tempTwoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 1 // Allow 30 seconds clock skew
        });

        if (!verified) {
            return NextResponse.json({
                success: false,
                message: 'Invalid verification code'
            }, { status: 400 });
        }

        // Enable 2FA
        await users.updateOne(
            { _id: new ObjectId(session.user.id) },
            {
                $set: {
                    twoFactorSecret: user.tempTwoFactorSecret,
                    isTwoFactorEnabled: true,
                    twoFactorPending: false
                },
                $unset: {
                    tempTwoFactorSecret: ""
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: '2FA has been enabled successfully'
        });

    } catch (error) {
        console.error('2FA verification error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to verify 2FA setup'
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        // Check if user is authenticated
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
                message: 'Verification code is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        // Get user with 2FA enabled
        const user = await users.findOne({
            _id: new ObjectId(session.user.id),
            isTwoFactorEnabled: true
        });

        if (!user || !user.twoFactorSecret) {
            return NextResponse.json({
                success: false,
                message: '2FA is not enabled'
            }, { status: 400 });
        }

        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (!verified) {
            return NextResponse.json({
                success: false,
                message: 'Invalid verification code'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: '2FA verification successful'
        });

    } catch (error) {
        console.error('2FA verification error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to verify 2FA code'
        }, { status: 500 });
    }
} 