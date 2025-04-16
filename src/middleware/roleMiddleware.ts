import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@/app/models/user.model';

export async function verifyRole(request: NextRequest, requiredRoles: UserRole[]) {
    try {
        const token = await getToken({ req: request });

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        const userRoles = token.roles as UserRole[];

        if (!userRoles || !requiredRoles.some(role => userRoles.includes(role))) {
            return NextResponse.json(
                { message: 'Forbidden - Insufficient permissions' },
                { status: 403 }
            );
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Role verification error:', error);
        return NextResponse.json(
            { message: 'Internal server error during role verification' },
            { status: 500 }
        );
    }
}

export async function verifyAdmin(request: NextRequest) {
    return verifyRole(request, [UserRole.ADMIN]);
}

export async function verifyModerator(request: NextRequest) {
    return verifyRole(request, [UserRole.MODERATOR, UserRole.ADMIN]);
}

export async function verifyUser(request: NextRequest) {
    return verifyRole(request, [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]);
} 