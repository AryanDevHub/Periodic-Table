// FILE: api/index.js (Final and Complete Version)

// What: Loads environment variables from a .env file for local development.
// Why: Vercel provides these automatically in production from your project settings.
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Correct relative paths to your server files ---
const authRoutes = require('../server/routes/auth');
const userRoutes = require('../server/routes/user');
const Element = require('../server/models/Element');
const Scientist = require('../server/models/Scientist');

const app = express();
const dbURI = process.env.DB_URI;

// --- A more robust connection handler for serverless environments ---
let conn = null; // This variable will hold our cached connection.

const connectDB = async () => {
  // If we already have a connection (mongoose.connections[0].readyState === 1), reuse it.
  if (conn && mongoose.connections[0].readyState === 1) {
    console.log("Using existing database connection.");
    return;
  }
  
  // If not, establish a new connection.
  try {
    console.log("No existing connection, creating a new one...");
    conn = await mongoose.connect(dbURI);
    console.log("New database connection established.");
  } catch (error) {
    console.error("Database connection error:", error);
    // If the DB fails to connect, we throw an error to stop the process.
    throw new Error("Could not connect to database.");
  }
};

// Middleware that runs before every API request to ensure the DB is connected.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next(); // If connection is successful, proceed to the actual API route.
  } catch (error) {
    // If the connection fails, send back a server error response.
    res.status(500).json({ message: 'Database connection failed.' });
  }
});


// --- Standard Middleware ---
app.use(cors()); // Allows your frontend to make requests to this API.
app.use(express.json()); // Parses incoming JSON bodies.

// --- Your API Routes ---
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

// --- Export the app for Vercel ---
// This allows Vercel to take your Express app and run it as a serverless function.
module.exports = app;