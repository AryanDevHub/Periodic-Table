// server/routes/user.js

// --- IMPORTS ---
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// --- NEW IMPORTS FOR FILE UPLOAD ---
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');


// --- CONFIGURATIONS for File Upload ---

// Configure Cloudinary with credentials from your .env file
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure Multer to store the uploaded file in memory as a buffer.
// This is efficient because we don't need to save the file to our server's disk first.
const storage = multer.memoryStorage();
const upload = multer({ storage });


// --- EXISTING ROUTES (No changes needed here) ---

// GET /api/user/me
router.get('/me', auth, async (req, res) => {
  // ... (code remains the same)
});

// POST /api/user/favorites
router.post('/favorites', auth, async (req, res) => {
  // ... (code remains the same)
});

// POST /api/user/notes
router.post('/notes', auth, async (req, res) => {
  // ... (code remains the same)
});

// DELETE /api/user/notes/:elementNumber
router.delete('/notes/:elementNumber', auth, async (req, res) => {
  // ... (code remains the same)
});

// PUT /api/user/details
router.put('/details', auth, async (req, res) => {
  // ... (code remains the same)
});

// POST /api/user/change-password
router.post('/change-password', auth, async (req, res) => {
  // ... (code remains the same)
});


// --- NEW ROUTE FOR PROFILE PICTURE UPLOAD ---
// @route   POST /api/user/upload-picture
// @desc    Upload a profile picture and save the URL to the user.
// @access  Private
// What: 'upload.single('profilePicture')' is the Multer middleware.
//       It looks for a file in the form data with the key 'profilePicture'.
router.post('/upload-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // This is a modern way to handle streaming the file buffer to Cloudinary
    // without saving it to disk first.
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'periodic_table_profiles' }, // Optional: organize uploads in a Cloudinary folder
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Find the logged-in user and update their profilePicture field with the secure URL from Cloudinary.
    const user = await User.findById(req.user.id);
    user.profilePicture = uploadResult.secure_url;
    await user.save();

    // Send back the updated user object so the frontend can update immediately.
    const userToReturn = user.toObject();
    delete userToReturn.password;
    
    res.json(userToReturn);

  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Error uploading file.' });
  }
});


module.exports = router;