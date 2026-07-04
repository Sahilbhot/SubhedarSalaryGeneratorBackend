'use strict';

// Aggregates and registers every route module. New feature routes
// get registered here with their own prefix.
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const branchRoutes = require('./branch.routes');
const employeeRoutes = require('./employee.routes');
const menuRoutes = require('./menu.routes');

async function registerRoutes(fastify) {
  // Health / status
  fastify.get('/', async () => ({ status: 'ok', message: 'Subhedar Salary Generator API' }));
  fastify.get('/api/health', async () => ({ status: 'ok' }));

  // Feature routes
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(userRoutes, { prefix: '/api/users' });
  fastify.register(branchRoutes, { prefix: '/api/branches' });
  fastify.register(employeeRoutes, { prefix: '/api/employees' });
  fastify.register(menuRoutes, { prefix: '/api/menu' });
}

module.exports = registerRoutes;
