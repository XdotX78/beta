import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import zxcvbn from 'zxcvbn';
import { generateVerificationToken, sendVerificationEmail } from '@/lib/email';

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided information
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User already exists
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

// Email and password validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;  // Match frontend requirements

// Maximum attempts for failed registrations
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

// Keep track of failed attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

        // Check if IP is locked out
        const attempts = failedAttempts.get(ip);
        if (attempts && attempts.count >= MAX_FAILED_ATTEMPTS) {
            const timeElapsed = Date.now() - attempts.lastAttempt;
            if (timeElapsed < LOCKOUT_TIME) {
                return NextResponse.json({
                    success: false,
                    message: `Too many failed attempts. Please try again in ${Math.ceil((LOCKOUT_TIME - timeElapsed) / 60000)} minutes.`
                }, { status: 429 });
            } else {
                failedAttempts.delete(ip);
            }
        }

        const { username, email, password } = await request.json();

        // Check if all required fields are present
        if (!username || !email || !password) {
            incrementFailedAttempts(ip);
            return NextResponse.json({
                success: false,
                message: 'All fields are required'
            }, { status: 400 });
        }

        // Validate username length and characters
        if (username.length < 3 || username.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
            incrementFailedAttempts(ip);
            return NextResponse.json({
                success: false,
                message: 'Username must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens'
            }, { status: 400 });
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            incrementFailedAttempts(ip);
            return NextResponse.json({
                success: false,
                message: 'Invalid email format'
            }, { status: 400 });
        }

        // Check password strength using zxcvbn
        const passwordStrength = zxcvbn(password);
        if (passwordStrength.score < 3) {
            incrementFailedAttempts(ip);
            return NextResponse.json({
                success: false,
                message: `Password is too weak: ${passwordStrength.feedback.warning}. ${passwordStrength.feedback.suggestions.join(' ')}`
            }, { status: 400 });
        }

        // Validate password complexity
        if (!passwordRegex.test(password)) {
            incrementFailedAttempts(ip);
            return NextResponse.json({
                success: false,
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        // Check if username or email already exists
        const existingUser = await users.findOne({
            $or: [
                { username: { $regex: new RegExp('^' + username + '$', 'i') } },
                { email: { $regex: new RegExp('^' + email + '$', 'i') } }
            ]
        });

        if (existingUser) {
            incrementFailedAttempts(ip);
            return NextResponse.json({
                success: false,
                message: 'Username or email already exists'
            }, { status: 400 });
        }

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Hash password with higher cost factor
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user with additional security fields
        const newUser = await users.insertOne({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date(),
            lastPasswordChange: new Date(),
            failedLoginAttempts: 0,
            status: 'inactive', // User starts as inactive until email is verified
            securityQuestions: [],
            roles: ['user'],
            isEmailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isTwoFactorEnabled: false,
            passwordHistory: [hashedPassword] // Start tracking password history
        });

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Delete the user if email sending fails
            await users.deleteOne({ _id: newUser.insertedId });
            return NextResponse.json({
                success: false,
                message: 'Failed to send verification email. Please try again.'
            }, { status: 500 });
        }

        // Clear failed attempts on successful registration
        failedAttempts.delete(ip);

        return NextResponse.json({
            success: true,
            message: 'Registration successful. Please check your email to verify your account.',
            userId: newUser.insertedId
        }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during signup'
        }, { status: 500 });
    }
}

function incrementFailedAttempts(ip: string) {
    const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    failedAttempts.set(ip, attempts);
} 