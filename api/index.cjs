require('dotenv').config();
const serverless = require('serverless-http');
const { createApp } = require('../server/app');

const app = createApp({
  dbURI: process.env.DB_URI,
  // Restrict this to your real frontend origin once you have a fixed domain,
  // e.g. corsOrigin: 'https://your-app.vercel.app'
  corsOrigin: '*',
  lazyConnect: true,
});

module.exports = serverless(app);