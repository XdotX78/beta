import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const MAX_PASSWORD_HISTORY = 5; // Keep last 5 passwords

// GET: Retrieve password history count
export async function GET(request: Request) {
    try {
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

        const user = await users.findOne(
            { _id: new ObjectId(session.user.id) },
            { projection: { passwordHistory: 1 } }
        );

        return NextResponse.json({
            success: true,
            count: user?.passwordHistory?.length || 0,
            maxHistory: MAX_PASSWORD_HISTORY
        });

    } catch (error) {
        console.error('Password history retrieval error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve password history'
        }, { status: 500 });
    }
}

// POST: Check if password exists in history
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        const { password } = await request.json();
        if (!password) {
            return NextResponse.json({
                success: false,
                message: 'Password is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        const user = await users.findOne(
            { _id: new ObjectId(session.user.id) },
            { projection: { passwordHistory: 1 } }
        );

        if (!user?.passwordHistory?.length) {
            return NextResponse.json({
                success: true,
                exists: false
            });
        }

        // Check if the new password matches any in history
        for (const hashedPassword of user.passwordHistory) {
            if (await bcrypt.compare(password, hashedPassword)) {
                return NextResponse.json({
                    success: true,
                    exists: true,
                    message: 'Password was used recently'
                });
            }
        }

        return NextResponse.json({
            success: true,
            exists: false
        });

    } catch (error) {
        console.error('Password history check error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to check password history'
        }, { status: 500 });
    }
}

// Helper function to update password history
export async function updatePasswordHistory(userId: string, newPassword: string) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Get current password history
        const user = await users.findOne(
            { _id: new ObjectId(userId) },
            { projection: { passwordHistory: 1 } }
        );

        let passwordHistory = user?.passwordHistory || [];

        // Add new password to history
        passwordHistory.unshift(hashedPassword);

        // Keep only the last MAX_PASSWORD_HISTORY passwords
        if (passwordHistory.length > MAX_PASSWORD_HISTORY) {
            passwordHistory = passwordHistory.slice(0, MAX_PASSWORD_HISTORY);
        }

        // Update user's password history
        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { passwordHistory } }
        );

        return true;
    } catch (error) {
        console.error('Password history update error:', error);
        return false;
    }
} 