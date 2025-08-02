// server/routes/user.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('favoriteElements');
    res.json(user);
  } catch (e) {
    res.status(500).send('Server Error');
  }
});

router.post('/favorites', auth, async (req, res) => {
  const { elementId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const favIndex = user.favoriteElements.findIndex(favId => favId.toString() === elementId);
    if (favIndex > -1) {
      user.favoriteElements.splice(favIndex, 1);
    } else {
      user.favoriteElements.push(elementId);
    }
    await user.save();
    await user.populate('favoriteElements');
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Server error while updating favorites.' });
  }
});

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
    res.status(500).send('Server Error');
  }
});

router.delete('/notes/:elementNumber', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const noteIndex = user.notes.findIndex(n => n.elementNumber.toString() === req.params.elementNumber);
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }
    user.notes.splice(noteIndex, 1);
    await user.save();
    await user.populate('favoriteElements');
    res.json(user);
  } catch (e) {
    res.status(500).send('Server Error');
  }
});

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
    res.status(500).json({ message: 'Server Error' });
  }
});

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
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/upload-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'periodic_table_profiles' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    const user = await User.findById(req.user.id);
    user.profilePicture = uploadResult.secure_url;
    await user.save();
    const userToReturn = user.toObject();
    delete userToReturn.password;
    res.json(userToReturn);
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Error uploading file.' });
  }
});

module.exports = router;