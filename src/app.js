'use strict';

// Builds and configures the Fastify instance. Shared by both entry points:
//   • api/index.js  → Vercel serverless handler
//   • local.js      → standalone Node server
const Fastify = require('fastify');
const registerCors = require('./plugins/cors');
const registerRoutes = require('./routes');

function buildApp(opts = {}) {
  const fastify = Fastify({ logger: false, ...opts });

  registerCors(fastify);
  fastify.register(registerRoutes);

  return fastify;
}

module.exports = buildApp;
