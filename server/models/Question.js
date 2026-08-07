// server/models/Question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  type: {
    type: String,
    enum: [
      'symbol-to-name',
      'name-to-symbol',
      'number-to-name',
      'electron-config',
      'trend-order',
      'category-match',
      'mnemonic',
    ],
    required: true,
  },
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: (arr) => arr.length === 4,
  },
  correctAnswer: { type: String, required: true },
  relatedElementNumbers: { type: [Number], default: [] },
  source: {
    type: String,
    enum: ['generated', 'curated'],
    default: 'generated',
  },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;