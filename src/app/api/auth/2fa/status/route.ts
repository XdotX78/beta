import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
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

        // Get user's 2FA status
        const user = await users.findOne(
            { _id: new ObjectId(session.user.id) },
            { projection: { isTwoFactorEnabled: 1 } }
        );

        return NextResponse.json({
            success: true,
            enabled: user?.isTwoFactorEnabled || false
        });

    } catch (error) {
        console.error('2FA status check error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to check 2FA status'
        }, { status: 500 });
    }
} 