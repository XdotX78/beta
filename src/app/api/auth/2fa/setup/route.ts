import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/auth/2fa/setup:
 *   post:
 *     summary: Set up 2FA
 *     description: Generate and return 2FA secret and QR code for the user
 *     tags:
 *       - Security
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup information generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TwoFactorSetupResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: 2FA already enabled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Verify and enable 2FA
 *     description: Verify the 2FA token and enable 2FA for the user
 *     tags:
 *       - Security
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TwoFactorVerifyRequest'
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 backupCodes:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized or invalid token
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

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        // Generate TOTP secret
        const secret = speakeasy.generateSecret({
            name: `YourApp:${session.user.email}`,
            length: 20
        });

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

        // Store secret temporarily (will be confirmed after user verifies)
        await users.updateOne(
            { _id: new ObjectId(session.user.id) },
            {
                $set: {
                    tempTwoFactorSecret: secret.base32,
                    twoFactorPending: true
                }
            }
        );

        return NextResponse.json({
            success: true,
            qrCode: qrCodeUrl,
            secret: secret.base32
        });

    } catch (error) {
        console.error('2FA setup error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to set up 2FA'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        // Disable 2FA
        await users.updateOne(
            { _id: new ObjectId(session.user.id) },
            {
                $set: {
                    isTwoFactorEnabled: false,
                    twoFactorSecret: null,
                    tempTwoFactorSecret: null,
                    twoFactorPending: false
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: '2FA has been disabled'
        });

    } catch (error) {
        console.error('2FA disable error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to disable 2FA'
        }, { status: 500 });
    }
} 