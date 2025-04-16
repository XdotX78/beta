import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { User, type UserRole } from '@/app/models/user.model';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { SecurityLogger, SecurityEventType, SecurityEventSeverity } from '@/lib/security-logger';

// Extend the built-in session types
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email?: string | null;
            name?: string | null;
            image?: string | null;
            roles: UserRole[];
        }
    }
    interface User {
        id: string;
        email: string;
        name: string;
        roles: UserRole[];
        image?: string | null;
    }
}

// Extend JWT type
declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        roles: UserRole[];
    }
}

// Create a new ratelimiter that allows 5 requests per minute
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
});

// Rate limiting middleware
async function rateLimiter(request: Request) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
        // Log rate limit exceeded event
        await SecurityLogger.log({
            type: SecurityEventType.RATE_LIMIT_EXCEEDED,
            severity: SecurityEventSeverity.WARNING,
            ip,
            details: {
                endpoint: 'auth/signin',
                limit,
                reset,
                remaining
            }
        });

        return NextResponse.json({
            success: false,
            message: 'Too many requests, please try again later.',
            limit,
            reset,
            remaining,
        }, {
            status: 429,
            headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
            }
        });
    }
    return null;
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID!,
            clientSecret: process.env.APPLE_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    await SecurityLogger.log({
                        type: SecurityEventType.LOGIN_FAILURE,
                        severity: SecurityEventSeverity.WARNING,
                        ip: req?.headers?.['x-forwarded-for'] as string || '127.0.0.1',
                        userAgent: req?.headers?.['user-agent'],
                        details: {
                            reason: 'Missing credentials',
                            email: credentials?.email
                        }
                    });
                    throw new Error('Please provide both email and password');
                }

                try {
                    await connectDB();
                    const user = await User.findOne({ email: credentials.email }).select('+password');

                    if (!user) {
                        await SecurityLogger.log({
                            type: SecurityEventType.LOGIN_FAILURE,
                            severity: SecurityEventSeverity.WARNING,
                            ip: req?.headers?.['x-forwarded-for'] as string || '127.0.0.1',
                            userAgent: req?.headers?.['user-agent'],
                            details: {
                                reason: 'User not found',
                                email: credentials.email
                            }
                        });
                        throw new Error('Invalid email or password');
                    }

                    const isPasswordMatch = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordMatch) {
                        // Increment failed login attempts
                        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
                        user.lastLoginAttempt = new Date();

                        // Check if account should be locked
                        if (user.failedLoginAttempts >= 5) {
                            user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
                            await user.save();

                            await SecurityLogger.log({
                                type: SecurityEventType.ACCOUNT_LOCKOUT,
                                severity: SecurityEventSeverity.ALERT,
                                userId: user._id.toString(),
                                ip: req?.headers?.['x-forwarded-for'] as string || '127.0.0.1',
                                userAgent: req?.headers?.['user-agent'],
                                details: {
                                    reason: 'Too many failed login attempts',
                                    failedAttempts: user.failedLoginAttempts,
                                    lockUntil: user.lockUntil
                                }
                            });
                        } else {
                            await user.save();
                        }

                        await SecurityLogger.log({
                            type: SecurityEventType.LOGIN_FAILURE,
                            severity: SecurityEventSeverity.WARNING,
                            userId: user._id.toString(),
                            ip: req?.headers?.['x-forwarded-for'] as string || '127.0.0.1',
                            userAgent: req?.headers?.['user-agent'],
                            details: {
                                reason: 'Invalid password',
                                failedAttempts: user.failedLoginAttempts
                            }
                        });
                        throw new Error('Invalid email or password');
                    }

                    // Check if account is locked
                    if (user.lockUntil && user.lockUntil > new Date()) {
                        await SecurityLogger.log({
                            type: SecurityEventType.LOGIN_FAILURE,
                            severity: SecurityEventSeverity.WARNING,
                            userId: user._id.toString(),
                            ip: req?.headers?.['x-forwarded-for'] as string || '127.0.0.1',
                            userAgent: req?.headers?.['user-agent'],
                            details: {
                                reason: 'Account locked',
                                lockUntil: user.lockUntil
                            }
                        });
                        throw new Error('Account is locked. Please try again later.');
                    }

                    // Reset failed login attempts on successful login
                    if (user.failedLoginAttempts > 0) {
                        user.failedLoginAttempts = 0;
                        user.lockUntil = undefined;
                        await user.save();
                    }

                    // Log successful login
                    await SecurityLogger.log({
                        type: SecurityEventType.LOGIN_SUCCESS,
                        severity: SecurityEventSeverity.INFO,
                        userId: user._id.toString(),
                        ip: req?.headers?.['x-forwarded-for'] as string || '127.0.0.1',
                        userAgent: req?.headers?.['user-agent'],
                        details: {
                            email: user.email,
                            roles: user.roles
                        }
                    });

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.username,
                        roles: user.roles,
                        image: user.avatar || null
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    await SecurityLogger.log({
                        type: SecurityEventType.LOGIN_FAILURE,
                        severity: SecurityEventSeverity.ALERT,
                        ip: req?.headers?.['x-forwarded-for'] as string || '127.0.0.1',
                        userAgent: req?.headers?.['user-agent'],
                        details: {
                            error: error instanceof Error ? error.message : 'Unknown error'
                        }
                    });
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'credentials') {
                return true;
            }

            try {
                await connectDB();

                // Check if user exists
                let dbUser = await User.findOne({ email: user.email });

                if (!dbUser) {
                    // Create new user if doesn't exist
                    dbUser = await User.create({
                        email: user.email,
                        username: user.name?.replace(/\s+/g, '').toLowerCase() || user.email?.split('@')[0],
                        avatar: user.image,
                        roles: ['user'],
                        provider: account?.provider
                    });
                }

                return true;
            } catch (error) {
                console.error('SignIn callback error:', error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.roles = user.roles;
                token.id = user.id;
            }

            // If using social login, get user from DB to include roles
            if (account && account.provider !== 'credentials') {
                try {
                    await connectDB();
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) {
                        token.roles = dbUser.roles;
                        token.id = dbUser._id.toString();
                    }
                } catch (error) {
                    console.error('JWT callback error:', error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.roles = token.roles;
                session.user.id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

// Export the handler for both GET and POST
export { handler as GET, handler as POST }; 