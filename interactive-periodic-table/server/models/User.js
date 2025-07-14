// --- What: Importing Mongoose ---
// --- Why:  Mongoose provides a schema-based solution to model application data.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- What: Define the schema for notes embedded in the user document ---
// --- Why:  Each note is linked to an element and stores custom user text.
const noteSchema = new Schema({
  // Link the note to a specific element by its atomic number
  elementNumber: { type: Number, required: true },
  text: { type: String }
});

// --- What: Define the main User schema ---
// --- Why:  This outlines how user data is structured in MongoDB.
const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },

  // --- What: User's email address ---
  // --- Why:  Used for login, must be unique and lowercase ---
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },

  // --- What: Hashed user password ---
  // --- Why:  Stored securely after hashing (never store plain text) ---
  password: { type: String, required: true },

  // --- What: Optional profile picture URL ---
  // --- Why:  Useful for displaying avatars in the UI ---
  profilePicture: { type: String, default: '' },

  // --- What: An array to store the IDs of favorited elements ---
  // --- Why:  This links a user to the elements they've saved.
  favoriteElements: [{ type: Schema.Types.ObjectId, ref: 'Element' }],

  // --- What: An array of embedded notes ---
  // --- Why:  Allows users to save custom notes for each element.
  notes: [noteSchema]
});

// --- What: Create the User model ---
// --- Why:  Makes it usable throughout our application.
const User = mongoose.model('User', userSchema);

// --- Export the model to be used elsewhere ---
module.exports = User;
