// Load environment variables (.env file in local, Vercel sets them in prod)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http'); // ✅ Wrap Express for Vercel

// Correct paths to your backend logic
const authRoutes = require('../server/routes/auth');
const userRoutes = require('../server/routes/user');
const Element = require('../server/models/Element');
const Scientist = require('../server/models/Scientist');

const app = express();
const dbURI = process.env.DB_URI;

// --- Reusable DB Connection for Serverless ---
let conn = null;
const connectDB = async () => {
  if (conn && mongoose.connections[0].readyState === 1) {
    console.log("✅ Using existing DB connection.");
    return;
  }

  try {
    console.log("🔌 Connecting to MongoDB...");
    conn = await mongoose.connect(dbURI);
    console.log("✅ New DB connection established.");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    throw new Error("Could not connect to MongoDB");
  }
};

// --- Middleware: Connect DB before each request ---
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed." });
  }
});

// --- Express Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

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

// --- Vercel Serverless Export ---
module.exports = serverless(app); // ✅ This makes it compatible with Vercel
