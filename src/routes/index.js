'use strict';

// Aggregates and registers every route module. New feature routes
// (e.g. auth) get registered here with their own prefix.
const employeeRoutes = require('./employee.routes');

async function registerRoutes(fastify) {
  // Health / status
  fastify.get('/', async () => ({ status: 'ok', message: 'Subhedar Salary Generator API' }));
  fastify.get('/api/health', async () => ({ status: 'ok' }));

  // Feature routes
  fastify.register(employeeRoutes, { prefix: '/api/employees' });
}

module.exports = registerRoutes;
