import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
    try {
        // Get the connection string from environment variables
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }

        // Test mongoose connection
        await mongoose.connect(mongoUri);

        return NextResponse.json({
            status: 'success',
            message: 'Database connection successful',
            connected: mongoose.connection.readyState === 1
        });
    } catch (error: any) {
        console.error('Database connection error:', error);

        return NextResponse.json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        }, { status: 500 });
    } finally {
        // Close the connection
        await mongoose.disconnect();
    }
} 