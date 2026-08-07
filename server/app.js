// server/app.js
// Single source of truth for the Express app. server.js, api/index.cjs, and
// netlify/functions/api.js all import and configure this instead of
// duplicating routes/middleware three separate times.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const Element = require('./models/Element');
const Scientist = require('./models/Scientist');
const Question = require('./models/Question');

// Cached across warm serverless invocations
let cachedDb = null;

async function connectDB(dbURI) {
  if (cachedDb && mongoose.connections[0].readyState === 1) {
    return cachedDb;
  }
  cachedDb = await mongoose.connect(dbURI, {
    bufferCommands: false,
  });
  return cachedDb;
}

/**
 * Builds and returns a configured Express app.
 */
function createApp({ dbURI, corsOrigin = '*', lazyConnect = false } = {}) {
  const app = express();

  if (!dbURI) {
    console.error('❌ CRITICAL ERROR: DB_URI is missing in environment variables.');
  }

  app.use(
    cors({
      origin: corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    })
  );
  app.use(express.json());

  if (lazyConnect) {
    app.use(async (req, res, next) => {
      try {
        await connectDB(dbURI);
        next();
      } catch (err) {
        res.status(500).json({ error: 'Database connection failed', details: err.message });
      }
    });
  }

  app.get('/api', (req, res) => {
    res.json({ status: 'API is running', timestamp: new Date() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);

  app.get('/api/elements', async (req, res) => {
    try {
      const elements = await Element.find().sort({ number: 1 });
      res.json(elements);
    } catch (err) {
      console.error('Error fetching elements:', err);
      res.status(500).json({ message: 'Server error while fetching elements.' });
    }
  });

  app.get('/api/scientists', async (req, res) => {
    try {
      const scientists = await Scientist.find().sort({ discoveryYear: 1 });
      res.json(scientists);
    } catch (err) {
      console.error('Error fetching scientists:', err);
      res.status(500).json({ message: 'Server error while fetching scientists.' });
    }
  });

  // GET /api/questions?difficulty=beginner&exclude=id1,id2,id3&limit=10
  app.get('/api/questions', async (req, res) => {
    try {
      const { difficulty, exclude, limit } = req.query;

      if (!difficulty || !['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        return res.status(400).json({
          message: 'Query param "difficulty" is required and must be beginner, intermediate, or advanced.',
        });
      }

      const excludeIds = exclude
        ? exclude.split(',').filter(Boolean)
        : [];

      const questionLimit = Math.min(parseInt(limit, 10) || 10, 50); // cap at 50 per request

      const filter = { difficulty };
      if (excludeIds.length > 0) {
        filter._id = { $nin: excludeIds };
      }

      // How many questions are actually available under this filter
      const availableCount = await Question.countDocuments(filter);

      let poolExhausted = false;
      let finalFilter = filter;

      // If fewer than the requested limit remain, drop the exclude filter
      // (client should reset its seen-list) so the quiz doesn't run dry.
      if (availableCount < questionLimit) {
        poolExhausted = true;
        finalFilter = { difficulty };
      }

      // Random sample via aggregation
      const questions = await Question.aggregate([
        { $match: finalFilter },
        { $sample: { size: questionLimit } },
      ]);

      res.json({ questions, poolExhausted });
    } catch (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ message: 'Server error while fetching questions.' });
    }
  });

  return app;
}

module.exports = { createApp, connectDB };