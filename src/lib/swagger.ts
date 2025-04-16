import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
    const spec = createSwaggerSpec({
        apiFolder: 'src/app/api',
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Next.js Authentication API Documentation',
                version: '1.0.0',
                description: 'API documentation for the authentication system',
                contact: {
                    name: 'API Support',
                    email: 'support@example.com',
                },
            },
            servers: [
                {
                    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
                    description: 'API Server',
                },
            ],
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
                schemas: {
                    User: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string', format: 'email' },
                            roles: {
                                type: 'array',
                                items: { type: 'string', enum: ['user', 'moderator', 'admin'] }
                            },
                            avatar: { type: 'string', nullable: true },
                            isEmailVerified: { type: 'boolean' },
                            isTwoFactorEnabled: { type: 'boolean' },
                        },
                    },
                    LoginRequest: {
                        type: 'object',
                        required: ['email', 'password'],
                        properties: {
                            email: { type: 'string', format: 'email' },
                            password: { type: 'string', format: 'password' },
                        },
                    },
                    SignupRequest: {
                        type: 'object',
                        required: ['username', 'email', 'password'],
                        properties: {
                            username: { type: 'string', minLength: 3 },
                            email: { type: 'string', format: 'email' },
                            password: { type: 'string', format: 'password' },
                        },
                    },
                    TokenResponse: {
                        type: 'object',
                        properties: {
                            accessToken: { type: 'string' },
                            refreshToken: { type: 'string' },
                        },
                    },
                    ErrorResponse: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: false
                            },
                            message: {
                                type: 'string',
                                example: 'An error occurred'
                            },
                            error: {
                                type: 'object',
                                description: 'Optional additional error details'
                            }
                        },
                        required: ['success', 'message']
                    },
                    SecurityQuestion: {
                        type: 'object',
                        required: ['questionId', 'answer'],
                        properties: {
                            questionId: { type: 'string' },
                            question: { type: 'string' },
                            answer: { type: 'string', minLength: 2 },
                        },
                    },
                    SecurityQuestionsRequest: {
                        type: 'object',
                        required: ['questions'],
                        properties: {
                            questions: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/SecurityQuestion' },
                                minItems: 3,
                                maxItems: 3,
                            },
                        },
                    },
                    SecurityQuestionsVerification: {
                        type: 'object',
                        required: ['email', 'answers'],
                        properties: {
                            email: { type: 'string', format: 'email' },
                            answers: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/SecurityQuestion' },
                                minItems: 3,
                                maxItems: 3,
                            },
                        },
                    },
                    PasswordResetRequest: {
                        type: 'object',
                        required: ['email'],
                        properties: {
                            email: { type: 'string', format: 'email' },
                        },
                    },
                    PasswordResetConfirm: {
                        type: 'object',
                        required: ['token', 'newPassword'],
                        properties: {
                            token: { type: 'string' },
                            newPassword: { type: 'string', format: 'password' },
                        },
                    },
                    PasswordChangeRequest: {
                        type: 'object',
                        required: ['currentPassword', 'newPassword'],
                        properties: {
                            currentPassword: { type: 'string', format: 'password' },
                            newPassword: { type: 'string', format: 'password' },
                        },
                    },
                    TwoFactorSetupResponse: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            secret: { type: 'string' },
                            qrCode: { type: 'string' },
                        },
                    },
                    TwoFactorVerifyRequest: {
                        type: 'object',
                        required: ['token'],
                        properties: {
                            token: { type: 'string', minLength: 6, maxLength: 6 },
                        },
                    },
                    SecurityEvent: {
                        type: 'object',
                        properties: {
                            userId: {
                                type: 'string',
                                description: 'ID of the user associated with the event'
                            },
                            type: {
                                type: 'string',
                                enum: [
                                    'LOGIN_SUCCESS',
                                    'LOGIN_FAILURE',
                                    'LOGOUT',
                                    'PASSWORD_CHANGE',
                                    'PASSWORD_RESET_REQUEST',
                                    'PASSWORD_RESET_COMPLETE',
                                    'ACCOUNT_LOCKOUT',
                                    'ACCOUNT_UNLOCK',
                                    'TOKEN_REFRESH',
                                    'TOKEN_BLACKLIST',
                                    'TWO_FACTOR_SETUP',
                                    'TWO_FACTOR_DISABLE',
                                    'SECURITY_QUESTIONS_UPDATE',
                                    'ROLE_CHANGE',
                                    'SUSPICIOUS_ACTIVITY',
                                    'RATE_LIMIT_EXCEEDED'
                                ],
                                description: 'Type of security event'
                            },
                            severity: {
                                type: 'string',
                                enum: ['INFO', 'WARNING', 'ALERT', 'CRITICAL'],
                                description: 'Severity level of the event'
                            },
                            timestamp: {
                                type: 'string',
                                format: 'date-time',
                                description: 'When the event occurred'
                            },
                            ip: {
                                type: 'string',
                                description: 'IP address associated with the event'
                            },
                            userAgent: {
                                type: 'string',
                                description: 'User agent string from the request'
                            },
                            details: {
                                type: 'object',
                                description: 'Additional event-specific details'
                            },
                            metadata: {
                                type: 'object',
                                properties: {
                                    deviceInfo: {
                                        type: 'string',
                                        description: 'Information about the device used'
                                    },
                                    location: {
                                        type: 'string',
                                        description: 'Geographic location if available'
                                    },
                                    sessionId: {
                                        type: 'string',
                                        description: 'Associated session ID if applicable'
                                    }
                                }
                            }
                        },
                        required: ['type', 'severity', 'timestamp']
                    }
                },
            },
            security: [
                {
                    BearerAuth: [],
                },
            ],
            tags: [
                {
                    name: 'Authentication',
                    description: 'Authentication related endpoints',
                },
                {
                    name: 'Security',
                    description: 'Security features like 2FA and security questions',
                },
                {
                    name: 'User Management',
                    description: 'User profile and settings management',
                },
            ],
        },
    });
    return spec;
}; 