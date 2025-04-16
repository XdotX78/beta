import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define validation schema for password change
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

export type PasswordChangeRequest = z.infer<typeof passwordChangeSchema>;

export async function validatePasswordChange(request: NextRequest): Promise<PasswordChangeRequest | NextResponse | null> {
    try {
        const body = await request.json();
        const result = passwordChangeSchema.safeParse(body);

        if (!result.success) {
            const errorMessage = result.error.errors.map(err => err.message).join(', ');
            return NextResponse.json(
                { message: `Invalid request data: ${errorMessage}` },
                { status: 400 }
            );
        }

        return result.data;
    } catch (error) {
        return null;
    }
} 