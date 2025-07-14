// server/seed.js

const mongoose = require('mongoose');
const Element = require('./models/Element');
const Scientist = require('./models/Scientist');
const elementsData = require('./elements.json');
const scientistsData = require('./scientistsData.js');

const dbURI = 'mongodb+srv://Aryan:Aryan%40123@cluster0.xz2jsgh.mongodb.net/periodicTable?retryWrites=true&w=majority';

const seedDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Element.deleteMany({});
    console.log('Old elements deleted.');
    await Scientist.deleteMany({});
    console.log('Old scientists deleted.');

    // Insert new data
    await Element.insertMany(elementsData);
    console.log('Elements have been seeded!');
    await Scientist.insertMany(scientistsData);
    console.log('Scientists have been seeded!');

    console.log('Database seeding complete!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    // --- What: Close the database connection ---
    // --- Why:  This ensures the script terminates properly after it's done.
    mongoose.connection.close();
  }
};

seedDatabase();