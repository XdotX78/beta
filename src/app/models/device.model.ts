import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
    userId: mongoose.Types.ObjectId;
    fingerprint: string;
    info: {
        browser: string;
        browserVersion: string;
        os: string;
        osVersion: string;
        device: string;
        screenResolution?: string;
        timezone?: string;
        language?: string;
    };
    lastUsed: Date;
    firstSeen: Date;
    trusted: boolean;
    riskScore: number;
    loginHistory: Array<{
        timestamp: Date;
        ip: string;
        success: boolean;
        location?: {
            country?: string;
            city?: string;
            coordinates?: [number, number];
        };
    }>;
}

const deviceSchema = new Schema<IDevice>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fingerprint: {
        type: String,
        required: true
    },
    info: {
        browser: String,
        browserVersion: String,
        os: String,
        osVersion: String,
        device: String,
        screenResolution: String,
        timezone: String,
        language: String
    },
    lastUsed: {
        type: Date,
        default: Date.now
    },
    firstSeen: {
        type: Date,
        default: Date.now
    },
    trusted: {
        type: Boolean,
        default: false
    },
    riskScore: {
        type: Number,
        default: 0
    },
    loginHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        ip: String,
        success: Boolean,
        location: {
            country: String,
            city: String,
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }
        }
    }]
});

// Indexes for faster queries
deviceSchema.index({ userId: 1, fingerprint: 1 }, { unique: true });
deviceSchema.index({ userId: 1, lastUsed: -1 });
deviceSchema.index({ riskScore: 1 });

// Update lastUsed timestamp on every modification
deviceSchema.pre('save', function (next) {
    this.lastUsed = new Date();
    next();
});

export const Device = mongoose.models.Device || mongoose.model<IDevice>('Device', deviceSchema); 