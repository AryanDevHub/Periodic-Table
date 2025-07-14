const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Import for password hashing
const User = require('../models/User');
const auth = require('../middleware/auth'); // Import auth middleware

// --- ROUTE 1: Get current user's data ---
// @route   GET /api/user/me
// @desc    Get all of the current user's personalized data (profile, favorites, notes)
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favoriteElements');
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// --- ROUTE 2: Toggle a favorite element ---
// @route   POST /api/user/favorites
// @desc    Add or remove an element from the user's favorites list.
// @access  Private
router.post('/favorites', auth, async (req, res) => {
  const { elementId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const favIndex = user.favoriteElements.findIndex(
      favId => favId.toString() === elementId
    );

    if (favIndex > -1) {
      user.favoriteElements.splice(favIndex, 1);
    } else {
      user.favoriteElements.push(elementId);
    }

    await user.save();
    await user.populate('favoriteElements');
    res.json(user);
  } catch (e) {
    console.error("Error in /favorites route:", e.message);
    res.status(500).json({ message: 'Server error while updating favorites.' });
  }
});

// --- ROUTE 3: Save or update a note for an element ---
// @route   POST /api/user/notes
// @desc    Saves or updates a user's note for a specific element.
// @access  Private
router.post('/notes', auth, async (req, res) => {
  const { elementNumber, text } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const noteIndex = user.notes.findIndex(n => n.elementNumber === elementNumber);

    if (noteIndex > -1) {
      user.notes[noteIndex].text = text;
    } else {
      user.notes.push({ elementNumber, text });
    }

    await user.save();
    await user.populate('favoriteElements');
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// --- ROUTE 4: Delete a note for an element ---
// @route   DELETE /api/user/notes/:elementNumber
// @desc    Deletes a user's note for a specific element.
// @access  Private
router.delete('/notes/:elementNumber', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const noteIndex = user.notes.findIndex(
      n => n.elementNumber.toString() === req.params.elementNumber
    );

    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    user.notes.splice(noteIndex, 1);
    await user.save();
    await user.populate('favoriteElements');
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// --- ROUTE 5: Update user details (username, profile picture) ---
// @route   PUT /api/user/details
// @desc    Update username or profile picture
// @access  Private
router.put('/details', auth, async (req, res) => {
  const { username, profilePicture } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (typeof profilePicture === 'string') user.profilePicture = profilePicture;

    await user.save();
    const userToReturn = user.toObject();
    delete userToReturn.password;
    res.json(userToReturn);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- ROUTE 6: Change password ---
// @route   POST /api/user/change-password
// @desc    Change user's password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
