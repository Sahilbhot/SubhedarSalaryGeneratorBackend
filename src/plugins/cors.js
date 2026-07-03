'use strict';

// Attaches permissive CORS headers and short-circuits pre-flight OPTIONS.
// Called directly against the root instance (not registered) so the hook
// applies globally without plugin encapsulation.
function registerCors(fastify) {
  fastify.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (request.method === 'OPTIONS') {
      reply.code(204).send();
    }
  });
}

module.exports = registerCors;
