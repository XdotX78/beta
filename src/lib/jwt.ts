import jwt from 'jsonwebtoken';
import { ApiError } from '@/lib/error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface JWTPayload {
    userId: string;
    email: string;
    roles?: string[];
    [key: string]: any;
}

export function verifyToken(token: string): JWTPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, 'Token has expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, 'Invalid token');
        }
        throw new ApiError(401, 'Token verification failed');
    }
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });
}

export function generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    });
} 