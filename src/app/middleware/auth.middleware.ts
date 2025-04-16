import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { ROLES, type UserRole } from '@/app/models/user.model';

const secret = process.env.NEXTAUTH_SECRET;

export async function authMiddleware(req: NextRequest) {
    const token = await getToken({ req, secret });

    if (!token) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Authentication required'
            }),
            {
                status: 401,
                headers: { 'content-type': 'application/json' }
            }
        );
    }

    return NextResponse.next();
}

export function checkRole(allowedRoles: UserRole[]) {
    return async function roleMiddleware(req: NextRequest) {
        const token = await getToken({ req, secret });

        if (!token) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: 'Authentication required'
                }),
                {
                    status: 401,
                    headers: { 'content-type': 'application/json' }
                }
            );
        }

        const userRoles = token.roles as UserRole[] || ['user'];
        const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

        if (!hasAllowedRole) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: 'Access denied. Insufficient permissions.'
                }),
                {
                    status: 403,
                    headers: { 'content-type': 'application/json' }
                }
            );
        }

        return NextResponse.next();
    };
}

// Middleware for specific roles
export const adminMiddleware = checkRole(['admin']);
export const moderatorMiddleware = checkRole(['admin', 'moderator']);
export const userMiddleware = checkRole(['admin', 'moderator', 'user']); 