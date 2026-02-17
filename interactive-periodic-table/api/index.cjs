require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

// Import Routes and Models
// Vercel will bundle these files automatically as long as the path is correct relative to this file.
const authRoutes = require('../server/routes/auth');
const userRoutes = require('../server/routes/user');
const Element = require('../server/models/Element');
const Scientist = require('../server/models/Scientist');

const app = express();
const dbURI = process.env.DB_URI;

// --- 1. CONFIGURATION CHECKS ---
if (!dbURI) {
  console.error("❌ CRITICAL ERROR: DB_URI is missing in environment variables.");
}

// --- 2. MIDDLEWARE ---

// CORS: Essential for allowing your frontend to talk to this backend
// We explicitly allow the 'x-auth-token' header which your app uses.
app.use(cors({
  origin: '*', // In production, you might want to restrict this to your specific Vercel frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// --- 3. DATABASE CONNECTION (Serverless Optimization) ---

// We cache the connection variable outside the handler scope.
// This preserves the connection across "warm" serverless function invocations.
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connections[0].readyState === 1) {
    console.log("✅ Using existing MongoDB connection.");
    return Promise.resolve(cachedDb);
  }

  console.log("🔌 Creating new MongoDB connection...");
  
  try {
    // bufferCommands: false is important for serverless to prevent hanging queries
    cachedDb = await mongoose.connect(dbURI, {
      bufferCommands: false, 
    });
    console.log("✅ New MongoDB connection established.");
    return cachedDb;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

// Middleware to ensure DB is connected before handling routes
app.use(async (req, res, next) => {
  // Skip DB connection for simple health checks or static assets if you had them
  if (req.path === '/api/health') return next();

  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

// --- 4. ROUTES ---

// Health Check Route (Good for debugging Vercel deployment)
app.get('/api', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Auth & User Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Data Routes
app.get('/api/elements', async (req, res) => {
  try {
    const elements = await Element.find().sort({ number: 1 });
    res.json(elements);
  } catch (err) {
    console.error("Error fetching elements:", err);
    res.status(500).json({ message: 'Server error while fetching elements.' });
  }
});

app.get('/api/scientists', async (req, res) => {
  try {
    const scientists = await Scientist.find().sort({ discoveryYear: 1 });
    res.json(scientists);
  } catch (err) {
    console.error("Error fetching scientists:", err);
    res.status(500).json({ message: 'Server error while fetching scientists.' });
  }
});

// --- 5. EXPORT FOR VERCEL ---
module.exports = serverless(app);