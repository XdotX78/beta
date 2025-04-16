import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gaia_explorer';

export const dbConfig = {
    url: MONGODB_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then(mongoose => {
                console.log('Successfully connected to MongoDB.');
                return mongoose;
            })
            .catch(err => {
                console.error('Connection error', err);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
} 