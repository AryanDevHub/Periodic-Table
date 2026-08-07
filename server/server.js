// FILE: server/server.js (local development entry point)

require('dotenv').config();
const mongoose = require('mongoose');
const { createApp } = require('./app');

const PORT = process.env.PORT || 4000;
const dbURI = process.env.DB_URI;

if (!dbURI) {
  console.error('FATAL ERROR: DB_URI is not defined in your server/.env file.');
  process.exit(1);
}

const app = createApp({ dbURI, corsOrigin: '*' }); // open CORS is fine for local dev

mongoose
  .connect(dbURI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));