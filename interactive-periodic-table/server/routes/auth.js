// FILE: server/routes/auth.js (Final and Correct Version)

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- ROUTE 1: User Registration ---
// @route   POST /api/auth/register
// @desc    Register a new user, hash password, and return a token + user object.
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // 1. Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. Create a new User instance if they don't exist
    user = new User({
      email,
      password,
      username,
    });

    // 3. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save the new user to the database
    await user.save();

    // 5. Prepare the user data to send back (WITHOUT the password)
    const userToReturn = user.toObject();
    delete userToReturn.password;

    // 6. Create the JWT payload
    const payload = {
      user: {
        id: user.id, // Use the unique ID from the database
      },
    };

    // 7. Sign the JWT and send it back with the new user object
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // Sending a 201 (Created) status with the token and user object.
        res.status(201).json({ token, user: userToReturn });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


// --- ROUTE 2: User Login ---
// @route   POST /api/auth/login
// @desc    Authenticate user and return a token + user object with populated favorites.
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find the user and immediately populate their 'favoriteElements'.
    //    This is a key improvement for the frontend.
    let user = await User.findOne({ email }).populate('favoriteElements');
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 2. Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    
    // 3. Prepare the user object to be sent back (WITHOUT the password)
    const userToReturn = user.toObject();
    delete userToReturn.password;

    // 4. Create and sign the JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // 5. Send the token and the complete user object back.
        res.json({ token, user: userToReturn });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;