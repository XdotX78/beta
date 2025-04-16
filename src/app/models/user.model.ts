import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Schema, model, models } from 'mongoose';

export enum UserRole {
    USER = 'user',
    MODERATOR = 'moderator',
    ADMIN = 'admin'
}

// Session interfaces
interface IUserSession {
    token: string;
    device: string;
    ip: string;
    lastActivity: Date;
    expiresAt: Date;
}

interface IActiveSession {
    token: string;
    deviceInfo: string;
    lastActivity: Date;
    expiresAt: Date;
}

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    name: string;
    roles: UserRole[];
    avatar?: string;
    provider?: string;
    isEmailVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
    failedLoginAttempts: number;
    lockUntil?: Date;
    status: 'active' | 'inactive' | 'suspended';
    refreshTokens: string[];
    securityQuestions?: {
        question: string;
        answer: string;
    }[];
    passwordHistory: string[];
    twoFactorSecret?: string;
    twoFactorEnabled: boolean;
    activeSessions: IActiveSession[];
    refreshToken?: string;
    refreshTokenExpiry?: Date;
    lastLogin?: Date;
    lastLogout?: Date;
    lastTokenRefresh?: Date;
    sessions: IUserSession[];
    createdAt: Date;
    updatedAt: Date;
    loginAttempts: number;
    lastLoginAttempt?: Date;
    passwordExpiresAt: Date;
    validatePassword(password: string): Promise<boolean>;
    hasRole(role: UserRole): boolean;
    isLocked(): boolean;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [20, 'Username cannot exceed 20 characters'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    roles: {
        type: [String],
        enum: Object.values(UserRole),
        default: [UserRole.USER]
    },
    avatar: String,
    provider: String,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: undefined
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'inactive'
    },
    refreshTokens: {
        type: [String],
        default: []
    },
    securityQuestions: [{
        question: String,
        answer: {
            type: String,
            select: false
        }
    }],
    passwordHistory: {
        type: [String],
        select: false,
        default: []
    },
    twoFactorSecret: String,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    refreshToken: String,
    refreshTokenExpiry: Date,
    lastLogin: Date,
    lastLogout: Date,
    lastTokenRefresh: Date,
    sessions: [{
        token: { type: String, required: true },
        device: { type: String, required: true },
        ip: { type: String, required: true },
        lastActivity: { type: Date, required: true },
        expiresAt: { type: Date, required: true }
    }],
    loginAttempts: {
        type: Number,
        default: 0
    },
    lastLoginAttempt: {
        type: Date,
        default: undefined
    },
    passwordExpiresAt: Date,
    activeSessions: [{
        token: { type: String, required: true },
        deviceInfo: { type: String, required: true },
        lastActivity: { type: Date, required: true },
        expiresAt: { type: Date, required: true }
    }]
}, {
    timestamps: true
});

// Method types
interface IUserMethods {
    validatePassword(password: string): Promise<boolean>;
    hasRole(role: UserRole): boolean;
    isLocked(): boolean;
}

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to validate password
userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

// Method to check if user has specific role
userSchema.methods.hasRole = function (role: UserRole): boolean {
    return this.roles.includes(role);
};

// Method to check if account is locked
userSchema.methods.isLocked = function (): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
};

// Index for faster queries
userSchema.index({ email: 1, username: 1 });
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });

export const User = models.User || model<IUser>('User', userSchema); 