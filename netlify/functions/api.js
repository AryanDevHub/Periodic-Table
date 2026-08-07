require('dotenv').config();
const serverless = require('serverless-http');
const { createApp } = require('../../server/app');

const app = createApp({
  dbURI: process.env.DB_URI,
  corsOrigin: '*',
  lazyConnect: true,
});

// Netlify mounts functions under /.netlify/functions/api, so requests
// arrive as e.g. /.netlify/functions/api/elements. The app's routes are
// defined under /api/..., so we strip the Netlify prefix before handing
// off to Express. Your netlify.toml redirect from /api/* already maps
// public URLs to this function; this line just aligns the internal path.
const handler = serverless(app);
module.exports.handler = (event, context) => {
  event.path = event.path.replace('/.netlify/functions/api', '/api');
  return handler(event, context);
};