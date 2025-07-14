// server/models/Scientist.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scientistSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  contribution: { type: String, required: true },
   discoveryYear: { type: Number, required: false },
  wikiUrl: { type: String, required: false }
});

 
const Scientist = mongoose.model('Scientist', scientistSchema);

module.exports = Scientist;