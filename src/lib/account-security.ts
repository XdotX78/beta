import { type IUser, type UserRole } from '@/app/models/user.model';

// Constants for security settings
export const SECURITY_SETTINGS = {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 30,
    PASSWORD_EXPIRY_DAYS: 90,
    MAX_CONCURRENT_SESSIONS: 5,
    SESSION_TIMEOUT_HOURS: 24
};

interface Session {
    token: string;
    device: string;
    ip: string;
    lastActivity: Date;
    expiresAt: Date;
}

export function isAccountLocked(user: IUser): boolean {
    if (!user.lockUntil) return false;
    return user.lockUntil > new Date();
}

export function shouldResetFailedAttempts(user: IUser): boolean {
    if (!user.lastLoginAttempt) return true;
    const resetThreshold = new Date(user.lastLoginAttempt.getTime() + 30 * 60 * 1000); // 30 minutes
    return new Date() > resetThreshold;
}

export function incrementFailedAttempts(user: IUser): void {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    user.lastLoginAttempt = new Date();

    // Lock account after 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
    }
}

export function resetFailedAttempts(user: IUser): void {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAttempt = new Date();
}

export function isPasswordExpired(user: IUser): boolean {
    if (!user.lastPasswordChange) return false;
    const expiryDays = 90; // Password expires after 90 days
    const expiryDate = new Date(user.lastPasswordChange.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    return new Date() > expiryDate;
}

export function hasRole(user: IUser, role: UserRole): boolean {
    return user.roles.includes(role);
}

export function isSessionValid(session: Session): boolean {
    return new Date() < new Date(session.expiresAt);
}

export function cleanExpiredSessions(user: IUser): void {
    if (!user.sessions) return;
    user.sessions = user.sessions.filter(session => isSessionValid(session));
}

export function getActiveSessionCount(user: IUser): number {
    if (!user.sessions) return 0;
    return user.sessions.filter(session => isSessionValid(session)).length;
}

export function hasMaximumSessions(user: IUser, maxSessions: number = 5): boolean {
    return getActiveSessionCount(user) >= maxSessions;
}

export function updatePasswordExpiry(user: IUser) {
    const now = new Date();
    user.lastPasswordChange = now;
    user.passwordExpiresAt = new Date(now.getTime() + SECURITY_SETTINGS.PASSWORD_EXPIRY_DAYS * 86400000);
}

export function manageSession(user: IUser, token: string, deviceInfo: string) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SECURITY_SETTINGS.SESSION_TIMEOUT_HOURS * 3600000);

    // Initialize sessions array if it doesn't exist
    if (!user.sessions) {
        user.sessions = [];
    }

    // Remove expired sessions
    user.sessions = user.sessions.filter((session: Session) => session.expiresAt > now);

    // Remove oldest session if max concurrent sessions reached
    if (user.sessions.length >= SECURITY_SETTINGS.MAX_CONCURRENT_SESSIONS) {
        user.sessions.sort((a: Session, b: Session) => a.lastActivity.getTime() - b.lastActivity.getTime());
        user.sessions.shift();
    }

    // Add new session
    user.sessions.push({
        token,
        device: deviceInfo,
        ip: '',
        lastActivity: now,
        expiresAt
    });
}

export function updateSessionActivity(user: IUser, token: string) {
    const session = user.sessions?.find((s: Session) => s.token === token);
    if (session) {
        session.lastActivity = new Date();
    }
}

export function removeSession(user: IUser, token: string) {
    if (user.sessions) {
        user.sessions = user.sessions.filter((s: Session) => s.token !== token);
    }
} 