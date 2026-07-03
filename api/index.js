'use strict';

// Vercel serverless entry point. Pipes the incoming request into Fastify.
const buildApp = require('../src/app');

const app = buildApp();

module.exports = async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};
