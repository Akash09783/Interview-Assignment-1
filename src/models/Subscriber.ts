import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
  status: 'active' | 'unsubscribed';
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active',
  },
});

export default mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
