// FILE: server/server.js (Final and Complete)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// --- Import your Models and Routes ---
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const Element = require('./models/Element.js'); // <-- ADD THIS
const Scientist = require('./models/Scientist.js'); // <-- ADD THIS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// --- ADD THESE MISSING ROUTES FOR LOCAL DEVELOPMENT ---
app.get('/api/elements', async (req, res) => {
  try {
    const elements = await Element.find().sort({ number: 1 });
    res.json(elements);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching elements.' });
  }
});

app.get('/api/scientists', async (req, res) => {
  try {
    const scientists = await Scientist.find().sort({ discoveryYear: 1 });
    res.json(scientists);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching scientists.' });
  }
});

// --- DB Connection ---
mongoose.connect(process.env.DB_URI)
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => console.error('❌ MongoDB connection error:', err));