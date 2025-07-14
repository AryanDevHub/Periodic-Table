// FILE: server/routes/auth.js (This code is correct as is)

const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- User Registration ---
router.post('/register', async (req, res) => {
  // ... (code for registration)
  // Ensure the final res.status(201).json({ token, user }) sends the populated user
});

// --- User Login ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // This .populate() is the key for fixing the initial state
    let user = await User.findOne({ email }).populate('favoriteElements');
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // The user object sent back now has full element objects in favoriteElements
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;