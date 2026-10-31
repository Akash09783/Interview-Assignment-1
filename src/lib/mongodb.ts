import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not defined. Operating with fallback storage.');
    return null;
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('✅ Connected to MongoDB successfully.');
      return m;
    }).catch((err) => {
      console.warn('⚠️ MongoDB connection failed, fallback enabled:', err.message);
      cached!.promise = null;
      return null as unknown as typeof mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch {
    cached!.conn = null;
  }

  return cached!.conn;
}
