import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { tokenVerificationMiddleware } from './middleware/token-verification';
import { errorHandler } from './middleware/error-handler';

// Define paths that don't require authentication
const publicPaths = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/verify',
    '/auth/reset-password',
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/verify',
    '/api/auth/refresh',
    '/api/auth/reset-password'
];

export async function middleware(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;

        // Skip middleware for public paths and static files
        if (
            publicPaths.includes(pathname) ||
            pathname.startsWith('/_next') ||
            pathname.startsWith('/static')
        ) {
            return NextResponse.next();
        }

        // Apply token verification middleware
        const response = await tokenVerificationMiddleware(request);

        // If the response is an error, handle it
        if (response.status >= 400) {
            return response;
        }

        return response;
    } catch (error) {
        // Handle any errors that occur during middleware execution
        return errorHandler(error, request);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
}; 