import { NextRequest, NextResponse } from 'next/server';
import { verifyUser } from '@/middleware/roleMiddleware';
import { getToken } from 'next-auth/jwt';

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile information
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
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

export async function GET(request: NextRequest) {
    const authCheck = await verifyUser(request);
    if (authCheck instanceof NextResponse) {
        return authCheck;
    }

    try {
        const token = await getToken({ req: request });

        // Mock user profile data
        const profileData = {
            id: token?.sub,
            username: token?.name,
            email: token?.email,
            roles: token?.roles,
            preferences: {
                theme: "light",
                notifications: true,
                newsletter: false
            },
            activity: {
                lastLogin: new Date().toISOString(),
                totalPosts: 25,
                totalComments: 42
            },
            security: {
                twoFactorEnabled: true,
                lastPasswordChange: "2024-02-15T10:00:00Z",
                securityQuestionsSet: true
            }
        };

        return NextResponse.json(profileData, { status: 200 });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { message: 'Error fetching user profile data' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    const authCheck = await verifyUser(request);
    if (authCheck instanceof NextResponse) {
        return authCheck;
    }

    try {
        const token = await getToken({ req: request });
        const data = await request.json();

        // Mock profile update
        const response = {
            success: true,
            message: 'Profile updated successfully',
            updatedAt: new Date().toISOString(),
            user: token?.sub
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { message: 'Error updating user profile' },
            { status: 500 }
        );
    }
} 