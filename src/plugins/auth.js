'use strict';

// Auth guards used as Fastify preHandlers.
//   authenticate       → verifies the Bearer JWT, loads the user, sets request.user
//   authorize(...roles) → allows only the given roles (after authenticate)
const { verifyToken } = require('../utils/jwt');
const userService = require('../services/user.service');
const { sendError } = require('../utils/response');

async function authenticate(request, reply) {
  const header = request.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return sendError(reply, 'Authentication required', 401);
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return sendError(reply, 'Invalid or expired token', 401);
  }

  const { data: user, error } = await userService.findById(payload.id);
  if (error || !user) {
    return sendError(reply, 'Account not found', 401);
  }
  if (!user.is_active) {
    return sendError(reply, 'Account is inactive', 403);
  }

  request.user = userService.toPublic(user);
}

function authorize(...roles) {
  return async function authorizeHandler(request, reply) {
    if (!request.user) {
      return sendError(reply, 'Authentication required', 401);
    }
    if (roles.length > 0 && !roles.includes(request.user.role)) {
      return sendError(reply, 'You do not have permission to perform this action', 403);
    }
  };
}

module.exports = { authenticate, authorize };
