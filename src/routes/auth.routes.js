'use strict';

// Auth routes under /api/auth. Login is public; /me requires a valid token.
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../plugins/auth');

async function authRoutes(fastify) {
  fastify.post('/login', controller.login);
  fastify.get('/me', { preHandler: authenticate }, controller.me);
}

module.exports = authRoutes;
