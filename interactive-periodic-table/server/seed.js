// FILE: server/seed.js

require('dotenv').config();

const mongoose = require('mongoose');
const Element = require('./models/Element');
const Scientist = require('./models/Scientist');
const elementsData = require('./elements.json');
const scientistsData = require('./scientistsData.js');

const dbURI = process.env.DB_URI;


if (!dbURI) {
  console.error('Error: DB_URI is not defined in your .env file.');
  console.log('Please ensure you have a .env file in the /server directory with your MongoDB connection string.');
  process.exit(1); 
}

const seedDatabase = async () => {
  try {
    // ---  Connect to MongoDB ---
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(dbURI);
    console.log('✅ Connected to MongoDB for seeding.');

    // ---  Clear Existing Data ---
    console.log('🗑️  Clearing old data...');
    await Element.deleteMany({});
    console.log('   - Old elements deleted.');
    await Scientist.deleteMany({});
    console.log('   - Old scientists deleted.');

    // ---  Insert New Data ---
    console.log('🌱 Seeding new data...');
    await Element.insertMany(elementsData);
    console.log(`   - ${elementsData.length} elements have been seeded!`);
    await Scientist.insertMany(scientistsData);
    console.log(`   - ${scientistsData.length} scientists have been seeded!`);

    console.log('\n🎉 Database seeding complete!');

  } catch (err) {
   
    console.error('\n❌ Error seeding database:', err.message);
  } finally {
    // ---  Close the Connection ---
   
    console.log('🔒 Closing database connection...');
    await mongoose.connection.close();
  }
};

// ---  Run the Seeding Function ---
seedDatabase();