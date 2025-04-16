import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface ErrorResponse {
    success: false;
    message: string;
    error?: {
        code: string;
        details?: any;
    };
    stack?: string;
}

export function errorHandler(error: any, req: NextRequest): NextResponse<ErrorResponse> {
    console.error('Error:', error);

    // Default error response
    const errorResponse: ErrorResponse = {
        success: false,
        message: 'An unexpected error occurred'
    };

    // Handle known error types
    if (error instanceof Error) {
        // Authentication errors
        if (error.name === 'UnauthorizedError' || error.name === 'TokenExpiredError') {
            return NextResponse.json({
                ...errorResponse,
                message: 'Authentication failed',
                error: {
                    code: 'AUTH_ERROR',
                    details: error.message
                }
            }, { status: 401 });
        }

        // Validation errors
        if (error.name === 'ValidationError') {
            return NextResponse.json({
                ...errorResponse,
                message: 'Validation failed',
                error: {
                    code: 'VALIDATION_ERROR',
                    details: error.message
                }
            }, { status: 400 });
        }

        // Database errors
        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            return NextResponse.json({
                ...errorResponse,
                message: 'Database operation failed',
                error: {
                    code: 'DB_ERROR',
                    details: error.message
                }
            }, { status: 500 });
        }

        // Rate limiting errors
        if (error.name === 'TooManyRequestsError') {
            return NextResponse.json({
                ...errorResponse,
                message: 'Too many requests',
                error: {
                    code: 'RATE_LIMIT_ERROR',
                    details: error.message
                }
            }, { status: 429 });
        }

        // Generic error with custom message
        errorResponse.message = error.message;
        errorResponse.error = {
            code: 'INTERNAL_ERROR',
            details: error.name
        };

        // Include stack trace in development
        if (process.env.NODE_ENV === 'development') {
            errorResponse.stack = error.stack;
        }
    }

    // Return generic error response
    return NextResponse.json(errorResponse, { status: 500 });
}

// Custom error classes
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class TooManyRequestsError extends Error {
    constructor(message: string = 'Too many requests') {
        super(message);
        this.name = 'TooManyRequestsError';
    }
} 