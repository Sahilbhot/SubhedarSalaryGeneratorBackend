'use strict';

// Menu routes. Registered under the `/api/menu` prefix (see routes/index.js).
// Reads of the public menu are open (the landing page is public); the admin
// listing and all writes require authentication (writes: admin + manager).
const controller = require('../controllers/menu.controller');
const { authenticate, authorize } = require('../plugins/auth');
const { ROLES } = require('../config/roles');

async function menuRoutes(fastify) {
  const authGuard = { preHandler: authenticate };
  const writeGuard = { preHandler: [authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER)] };

  // Public: available items only (no token required).
  fastify.get('/', controller.listPublic);

  // Admin: every item, including hidden ones.
  fastify.get('/all', authGuard, controller.list);
  fastify.get('/:id', authGuard, controller.getOne);
  fastify.post('/', writeGuard, controller.create);
  fastify.put('/:id', writeGuard, controller.update);
  fastify.delete('/:id', writeGuard, controller.remove);
}

module.exports = menuRoutes;
