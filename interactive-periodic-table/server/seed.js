// FILE: server/seed.js (Corrected and Final Version)

// WHAT: Loads environment variables from the .env file.
// WHY: This is the first and most crucial step to securely access your database credentials.
require('dotenv').config();

const mongoose = require('mongoose');
const Element = require('./models/Element');
const Scientist = require('./models/Scientist');
const elementsData = require('./elements.json');
const scientistsData = require('./scientistsData.js');

// WHAT: Securely get the database URI from environment variables.
const dbURI = process.env.DB_URI;

// --- IMPROVEMENT: A "Guard Clause" for the database connection string ---
// WHAT: This checks if the DB_URI was actually loaded from the .env file.
// WHY: If it's missing, the script will exit immediately with a clear, helpful error message
//      instead of crashing with a confusing Mongoose error.
if (!dbURI) {
  console.error('Error: DB_URI is not defined in your .env file.');
  console.log('Please ensure you have a .env file in the /server directory with your MongoDB connection string.');
  process.exit(1); // Exit the script with an error code.
}

const seedDatabase = async () => {
  try {
    // --- 1. Connect to the Database ---
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(dbURI);
    console.log('✅ Connected to MongoDB for seeding.');

    // --- 2. Clear Existing Data ---
    console.log('🗑️  Clearing old data...');
    await Element.deleteMany({});
    console.log('   - Old elements deleted.');
    await Scientist.deleteMany({});
    console.log('   - Old scientists deleted.');

    // --- 3. Insert New Data ---
    console.log('🌱 Seeding new data...');
    await Element.insertMany(elementsData);
    console.log(`   - ${elementsData.length} elements have been seeded!`);
    await Scientist.insertMany(scientistsData);
    console.log(`   - ${scientistsData.length} scientists have been seeded!`);

    console.log('\n🎉 Database seeding complete!');

  } catch (err) {
    // WHAT: Catches any errors during the process.
    // WHY: Provides a clear error message if something goes wrong.
    console.error('\n❌ Error seeding database:', err.message);
  } finally {
    // --- 4. Close the Connection ---
    // WHAT: This block of code runs whether the seeding was successful or not.
    // WHY:  It ensures the connection to the database is always closed,
    //       allowing the script to terminate properly.
    console.log('🔒 Closing database connection...');
    await mongoose.connection.close();
  }
};

// --- 5. Run the Seeding Function ---
seedDatabase();