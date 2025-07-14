// FILE: api/index.js (Your New Serverless Function)

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- UPDATED PATHS ---
const authRoutes = require('../server/routes/auth');
const userRoutes = require('../server/routes/user');
const Element = require('../server/models/Element');
const Scientist = require('../server/models/Scientist');

const app = express();

// --- Connect to Database ---
const dbURI = process.env.DB_URI;
if (dbURI) {
  mongoose.connect(dbURI).catch(err => console.error('DB Connection Error:', err));
}

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Define API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/api/elements', async (req, res) => {
  try {
    const elements = await Element.find().sort({ number: 1 });
    res.json(elements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching elements.' });
  }
});

app.get('/api/scientists', async (req, res) => {
  try {
    const scientists = await Scientist.find().sort({ discoveryYear: 1 });
    res.json(scientists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching scientists.' });
  }
});

// --- THIS IS THE MOST IMPORTANT LINE ---
// Export the Express app for Vercel to use.
module.exports = app;