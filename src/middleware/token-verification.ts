import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function tokenVerificationMiddleware(request: NextRequest) {
    // Skip middleware for auth-related routes and public routes
    if (
        request.nextUrl.pathname.startsWith('/api/auth') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname === '/'
    ) {
        return NextResponse.next();
    }

    try {
        const token = request.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Authentication token is required'
            }, { status: 401 });
        }

        // Check if token is blacklisted
        const blacklistCheck = await fetch(`${request.nextUrl.origin}/api/auth/blacklist?token=${token}`);
        const blacklistData = await blacklistCheck.json();

        if (blacklistData.isBlacklisted) {
            return NextResponse.json({
                success: false,
                message: 'Token has been invalidated'
            }, { status: 401 });
        }

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            // Add decoded user info to request headers
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', (decoded as any).id);
            requestHeaders.set('x-user-roles', JSON.stringify((decoded as any).roles));

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                }
            });
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return NextResponse.json({
                    success: false,
                    message: 'Token has expired'
                }, { status: 401 });
            }

            return NextResponse.json({
                success: false,
                message: 'Invalid token'
            }, { status: 401 });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json({
            success: false,
            message: 'Token verification failed'
        }, { status: 500 });
    }
} 