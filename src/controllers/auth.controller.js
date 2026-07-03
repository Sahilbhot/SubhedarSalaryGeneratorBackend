'use strict';

// Authentication endpoints: login + current-user.
const userService = require('../services/user.service');
const { comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

async function login(request, reply) {
  const { email, password } = request.body || {};

  if (!email || !password) {
    return sendError(reply, 'email and password are required', 400);
  }

  const { data: user, error } = await userService.findByEmail(String(email).toLowerCase().trim());
  // Same generic message whether the email or password is wrong (avoid user enumeration).
  if (error || !user) {
    return sendError(reply, 'Invalid email or password', 401);
  }
  if (!user.is_active) {
    return sendError(reply, 'Your account is inactive. Please contact an administrator.', 403);
  }

  const passwordOk = await comparePassword(password, user.password_hash);
  if (!passwordOk) {
    return sendError(reply, 'Invalid email or password', 401);
  }

  const token = signToken({ id: user.id, role: user.role, branch_id: user.branch_id });
  return sendSuccess(reply, { token, user: userService.toPublic(user) });
}

async function me(request, reply) {
  // request.user is set by the `authenticate` preHandler.
  return sendSuccess(reply, request.user);
}

module.exports = { login, me };
