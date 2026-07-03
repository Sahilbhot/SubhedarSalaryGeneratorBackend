'use strict';

// Employee CRUD routes. Registered under the `/api/employees` prefix (see routes/index.js).
const controller = require('../controllers/employee.controller');

async function employeeRoutes(fastify) {
  fastify.get('/', controller.list);
  fastify.get('/:id', controller.getOne);
  fastify.post('/', controller.create);
  fastify.put('/:id', controller.update);
  fastify.delete('/:id', controller.remove);
}

module.exports = employeeRoutes;
