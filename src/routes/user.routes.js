'use strict';

// User management routes under /api/users. Admin only — the preHandlers below
// are encapsulated to this plugin, so they guard every route here.
const controller = require('../controllers/user.controller');
const { authenticate, authorize } = require('../plugins/auth');
const { ROLES } = require('../config/roles');

async function userRoutes(fastify) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', authorize(ROLES.ADMIN));

  fastify.get('/', controller.list);
  fastify.post('/', controller.create);
  fastify.put('/:id', controller.update);
  fastify.patch('/:id/status', controller.setStatus);
}

module.exports = userRoutes;
