import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

const registrationSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
});

const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"]
});

// Generic validation middleware
export async function validateRequest<T>(
    request: NextRequest,
    schema: z.Schema<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
        const body = await request.json();
        const validatedData = schema.parse(body);
        return { success: true, data: validatedData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
            };
        }
        return { success: false, error: 'Invalid request data' };
    }
}

// Specific validation middlewares
export async function validateLogin(request: NextRequest) {
    const validation = await validateRequest(request, loginSchema);
    if (!validation.success) {
        return NextResponse.json(
            { message: validation.error },
            { status: 400 }
        );
    }
    return validation.data;
}

export async function validateRegistration(request: NextRequest) {
    const validation = await validateRequest(request, registrationSchema);
    if (!validation.success) {
        return NextResponse.json(
            { message: validation.error },
            { status: 400 }
        );
    }
    return validation.data;
}

export async function validateRefreshToken(request: NextRequest) {
    const validation = await validateRequest(request, refreshTokenSchema);
    if (!validation.success) {
        return NextResponse.json(
            { message: validation.error },
            { status: 400 }
        );
    }
    return validation.data;
}

export async function validatePasswordChange(request: NextRequest) {
    const validation = await validateRequest(request, passwordChangeSchema);
    if (!validation.success) {
        return NextResponse.json(
            { message: validation.error },
            { status: 400 }
        );
    }
    return validation.data;
} 