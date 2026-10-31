/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// In-memory fallback
const memorySubscribers = [];

// Mongoose schema
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

let SubscriberModel = null;

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Express Server: Connected to MongoDB');
      SubscriberModel = mongoose.model('ExpressSubscriber', SubscriberSchema);
    })
    .catch((err) => {
      console.warn('⚠️ Express Server: MongoDB unavailable, using in-memory store:', err.message);
    });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'in-memory-fallback',
  });
});

// Products endpoint
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'hydra-foam-cleanser',
        name: 'Hydra-Foam Cleanser',
        price: 35.0,
        step: 1,
        stepName: 'Cleanse',
      },
      {
        id: 'reset-serum',
        name: 'Reset Serum',
        price: 65.0,
        step: 2,
        stepName: 'Repair',
      },
      {
        id: 'hydra-nutrition-stick',
        name: 'Hydra-Nutrition Stick',
        price: 55.0,
        step: 3,
        stepName: 'Nourish',
      },
      {
        id: 'barrier-recovery-cream',
        name: 'Barrier Recovery Cream',
        price: 75.0,
        step: 4,
        stepName: 'Shield',
      },
    ],
  });
});

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (SubscriberModel && mongoose.connection.readyState === 1) {
      const existing = await SubscriberModel.findOne({ email: cleanEmail });
      if (existing) {
        return res.json({ message: 'Email is already registered.' });
      }
      await SubscriberModel.create({ email: cleanEmail });
    } else {
      if (!memorySubscribers.includes(cleanEmail)) {
        memorySubscribers.push(cleanEmail);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Subscription confirmed.',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error processing subscription.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express API server running on port ${PORT}`);
});
