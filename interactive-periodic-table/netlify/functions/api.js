require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

// NOTE: We added an extra '../' because we moved this file into netlify/functions/
const authRoutes = require('../../server/routes/auth');
const userRoutes = require('../../server/routes/user');
const Element = require('../../server/models/Element');
const Scientist = require('../../server/models/Scientist');

const app = express();
const dbURI = process.env.DB_URI;

// --- CONFIGURATION ---
app.use(cors());
app.use(express.json());

// --- DATABASE ---
let cachedDb = null;
const connectDB = async () => {
  if (cachedDb && mongoose.connections[0].readyState === 1) {
    return Promise.resolve(cachedDb);
  }
  try {
    cachedDb = await mongoose.connect(dbURI, { bufferCommands: false });
    return cachedDb;
  } catch (error) {
    console.error("MongoDB Error:", error);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database Connection Failed" });
  }
});

// --- ROUTES ---
// IMPORTANT: We must use a Router to handle the /.netlify/functions/api path prefix
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "Netlify API is running!" });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

router.get('/elements', async (req, res) => {
  const elements = await Element.find().sort({ number: 1 });
  res.json(elements);
});

router.get('/scientists', async (req, res) => {
  const scientists = await Scientist.find().sort({ discoveryYear: 1 });
  res.json(scientists);
});

// Mount the router at /api so it matches your frontend requests
app.use('/api', router);

// --- EXPORT FOR NETLIFY ---
// Netlify requires the export to be named 'handler'
module.exports.handler = serverless(app);