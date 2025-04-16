import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Verification token is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        // Find user with matching verification token that hasn't expired
        const user = await users.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid or expired verification token'
            }, { status: 400 });
        }

        // Update user status
        await users.updateOne(
            { _id: user._id },
            {
                $set: {
                    isEmailVerified: true,
                    status: 'active',
                    emailVerificationToken: null,
                    emailVerificationExpires: null
                }
            }
        );

        // Redirect to success page
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-success`
        );

    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during email verification'
        }, { status: 500 });
    }
} 