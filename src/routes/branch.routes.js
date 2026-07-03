'use strict';

// Branch routes under /api/branches. All require auth; reads for admin+manager,
// writes for admin only.
const controller = require('../controllers/branch.controller');
const { authenticate, authorize } = require('../plugins/auth');
const { ROLES } = require('../config/roles');

async function branchRoutes(fastify) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', { preHandler: authorize(ROLES.ADMIN, ROLES.MANAGER) }, controller.list);
  fastify.post('/', { preHandler: authorize(ROLES.ADMIN) }, controller.create);
  fastify.put('/:id', { preHandler: authorize(ROLES.ADMIN) }, controller.update);
}

module.exports = branchRoutes;
