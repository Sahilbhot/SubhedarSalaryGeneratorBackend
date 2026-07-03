'use strict';

// Employee CRUD routes. Registered under the `/api/employees` prefix (see routes/index.js).
// Requires authentication; managing staff records is limited to admin + manager.
const controller = require('../controllers/employee.controller');
const { authenticate, authorize } = require('../plugins/auth');
const { ROLES } = require('../config/roles');

async function employeeRoutes(fastify) {
  // All employee routes require a valid token…
  fastify.addHook('preHandler', authenticate);
  // …reads are open to any authenticated role; writes are admin + manager only.
  const writeGuard = { preHandler: authorize(ROLES.ADMIN, ROLES.MANAGER) };

  fastify.get('/', controller.list);
  fastify.get('/:id', controller.getOne);
  fastify.post('/', writeGuard, controller.create);
  fastify.put('/:id', writeGuard, controller.update);
  fastify.delete('/:id', writeGuard, controller.remove);
}

module.exports = employeeRoutes;
