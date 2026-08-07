// FILE: server/server.js (Final and Correct for Local Development)

// Use 'require' for CommonJS module system consistency
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your Models and Routes
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const Element = require('./models/Element.js');
const Scientist = require('./models/Scientist.js');

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---

// WHAT: Apply CORS Middleware immediately.
// WHY: This is the most important fix. It MUST come before any routes are defined.
//      Using cors() without options allows requests from any origin, which is
//      perfect and simple for local development (i.e., from localhost:5173).
app.use(cors());

// WHAT: Apply JSON parsing middleware.
// WHY: This allows your server to read the JSON body of POST/PUT requests.
app.use(express.json());


// --- API Routes ---
// These come AFTER the global middleware has been applied.
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// WHAT: These are the missing routes for your main data.
// WHY: Your frontend (App.jsx) needs these to load the periodic table and scientists.
//      Without them, you get a "Failed to fetch" error.
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


// --- DB Connection ---
const dbURI = process.env.DB_URI;
if (!dbURI) {
  console.error('FATAL ERROR: DB_URI is not defined in your server/.env file.');
  process.exit(1);
}

mongoose.connect(dbURI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));