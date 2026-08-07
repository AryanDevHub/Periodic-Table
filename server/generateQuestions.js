// server/generateQuestions.js
require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');
const elements = require('./elements.json');

const dbURI = process.env.DB_URI;
if (!dbURI) {
  console.error('Error: DB_URI is not defined in your .env file.');
  process.exit(1);
}

// Difficulty banding by atomic number — simple, defensible split
function difficultyFor(number) {
  if (number <= 36) return 'beginner';       // H through Kr — common elements
  if (number <= 86) return 'intermediate';    // Rb through Rn — transition metals, etc.
  return 'advanced';                          // actinides, superheavy synthetics
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickWrongOptions(correctElement, pool, key, count = 3) {
  const others = pool.filter((el) => el.number !== correctElement.number);
  const shuffled = shuffle(others);
  const picked = [];
  const seen = new Set([correctElement[key]]);
  for (const el of shuffled) {
    if (picked.length >= count) break;
    if (!seen.has(el[key])) {
      picked.push(el[key]);
      seen.add(el[key]);
    }
  }
  return picked;
}

function buildQuestions() {
  const questions = [];

  elements.forEach((el) => {
    const difficulty = difficultyFor(el.number);

    // Type 1: symbol -> name
    {
      const wrong = pickWrongOptions(el, elements, 'name');
      if (wrong.length === 3) {
        questions.push({
          difficulty,
          type: 'symbol-to-name',
          question: `Which element has the symbol "${el.symbol}"?`,
          options: shuffle([el.name, ...wrong]),
          correctAnswer: el.name,
          relatedElementNumbers: [el.number],
          source: 'generated',
        });
      }
    }

    // Type 2: name -> symbol
    {
      const wrong = pickWrongOptions(el, elements, 'symbol');
      if (wrong.length === 3) {
        questions.push({
          difficulty,
          type: 'name-to-symbol',
          question: `What is the chemical symbol for ${el.name}?`,
          options: shuffle([el.symbol, ...wrong]),
          correctAnswer: el.symbol,
          relatedElementNumbers: [el.number],
          source: 'generated',
        });
      }
    }

    // Type 3: atomic number -> name
    {
      const wrong = pickWrongOptions(el, elements, 'name');
      if (wrong.length === 3) {
        questions.push({
          difficulty,
          type: 'number-to-name',
          question: `Which element is atomic number ${el.number}?`,
          options: shuffle([el.name, ...wrong]),
          correctAnswer: el.name,
          relatedElementNumbers: [el.number],
          source: 'generated',
        });
      }
    }

    // Type 4: electron configuration -> name (skip elements with "Unknown" config)
    if (el.electronConfig && el.electronConfig !== 'Unknown') {
      const wrong = pickWrongOptions(el, elements, 'name');
      if (wrong.length === 3) {
        questions.push({
          difficulty: difficulty === 'beginner' ? 'intermediate' : difficulty, // slightly harder type
          type: 'electron-config',
          question: `Which element has the electron configuration "${el.electronConfig}"?`,
          options: shuffle([el.name, ...wrong]),
          correctAnswer: el.name,
          relatedElementNumbers: [el.number],
          source: 'generated',
        });
      }
    }
  });

  // Type 5: trend-order (electronegativity) — pick random groups of 3 comparable elements
  const withElectronegativity = elements.filter(
    (el) => typeof el.electronegativity === 'number'
  );
  for (let i = 0; i < 60; i++) {
    const sample = shuffle(withElectronegativity).slice(0, 3);
    if (sample.length < 3) continue;
    const sorted = [...sample].sort((a, b) => a.electronegativity - b.electronegativity);
    const correctOrder = sorted.map((el) => el.symbol).join(' < ');
    // Build 3 wrong orderings by shuffling
    const wrongOrders = new Set();
    let attempts = 0;
    while (wrongOrders.size < 3 && attempts < 20) {
      const shuffledOrder = shuffle(sample).map((el) => el.symbol).join(' < ');
      if (shuffledOrder !== correctOrder) wrongOrders.add(shuffledOrder);
      attempts++;
    }
    if (wrongOrders.size === 3) {
      questions.push({
        difficulty: 'advanced',
        type: 'trend-order',
        question: `Which shows ${sample
          .map((el) => el.symbol)
          .join(', ')} correctly ordered by increasing electronegativity?`,
        options: shuffle([correctOrder, ...wrongOrders]),
        correctAnswer: correctOrder,
        relatedElementNumbers: sample.map((el) => el.number),
        source: 'generated',
      });
    }
  }

  return questions;
}

async function run() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(dbURI);
    console.log('✅ Connected.');

    console.log('🗑️  Clearing old generated questions...');
    await Question.deleteMany({ source: 'generated' });

    const questions = buildQuestions();
    console.log(`🌱 Inserting ${questions.length} generated questions...`);
    await Question.insertMany(questions);

    console.log('🎉 Question generation complete!');
  } catch (err) {
    console.error('❌ Error generating questions:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Connection closed.');
  }
}

run();