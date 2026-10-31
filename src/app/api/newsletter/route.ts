import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

// In-memory fallback if MongoDB is not connected
const fallbackSubscribers = new Set<string>();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const db = await connectToDatabase();
    if (db) {
      const existing = await Subscriber.findOne({ email: cleanEmail });
      if (existing) {
        return NextResponse.json(
          { message: 'You are already subscribed to Stem Beauty updates.' },
          { status: 200 }
        );
      }
      await Subscriber.create({ email: cleanEmail });
    } else {
      fallbackSubscribers.add(cleanEmail);
    }

    return NextResponse.json(
      { success: true, message: 'Thank you for subscribing to Stem Beauty updates.' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

