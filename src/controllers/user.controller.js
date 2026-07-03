'use strict';

// User management (admin only). Creates/updates staff accounts across branches.
const userService = require('../services/user.service');
const { hashPassword } = require('../utils/password');
const { sendSuccess, sendError } = require('../utils/response');
const { ALL_ROLES, BRANCH_SCOPED_ROLES } = require('../config/roles');

async function list(request, reply) {
  const { branch_id } = request.query || {};
  const { data, error } = await userService.findAll({ branchId: branch_id });
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

async function create(request, reply) {
  const { name, email, password, role, branch_id } = request.body || {};

  if (!name || !email || !password || !role) {
    return sendError(reply, 'name, email, password, and role are required', 400);
  }
  if (!ALL_ROLES.includes(role)) {
    return sendError(reply, `role must be one of: ${ALL_ROLES.join(', ')}`, 400);
  }
  if (BRANCH_SCOPED_ROLES.includes(role) && !branch_id) {
    return sendError(reply, `branch_id is required for the "${role}" role`, 400);
  }
  if (String(password).length < 6) {
    return sendError(reply, 'password must be at least 6 characters', 400);
  }

  const password_hash = await hashPassword(password);
  const payload = {
    name,
    email: String(email).toLowerCase().trim(),
    password_hash,
    role,
    // admin is global → no branch; branch-scoped roles carry their branch.
    branch_id: BRANCH_SCOPED_ROLES.includes(role) ? branch_id : null,
  };

  const { data, error } = await userService.create(payload);
  if (error) {
    if (error.code === '23505')
      return sendError(reply, 'A user with this email already exists', 409);
    return sendError(reply, error);
  }
  return sendSuccess(reply, data, 201);
}

async function update(request, reply) {
  const { name, email, password, role, branch_id, is_active } = request.body || {};

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = String(email).toLowerCase().trim();
  if (is_active !== undefined) updates.is_active = is_active;

  if (role !== undefined) {
    if (!ALL_ROLES.includes(role)) {
      return sendError(reply, `role must be one of: ${ALL_ROLES.join(', ')}`, 400);
    }
    updates.role = role;
    // Keep branch consistent with the role.
    if (!BRANCH_SCOPED_ROLES.includes(role)) updates.branch_id = null;
  }
  if (branch_id !== undefined) updates.branch_id = branch_id;
  if (password) {
    if (String(password).length < 6) {
      return sendError(reply, 'password must be at least 6 characters', 400);
    }
    updates.password_hash = await hashPassword(password);
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await userService.update(request.params.id, updates);
  if (error) {
    if (error.code === '23505')
      return sendError(reply, 'A user with this email already exists', 409);
    return sendError(reply, error);
  }
  return sendSuccess(reply, data);
}

async function setStatus(request, reply) {
  const { is_active } = request.body || {};
  if (typeof is_active !== 'boolean') {
    return sendError(reply, 'is_active (boolean) is required', 400);
  }
  const { data, error } = await userService.update(request.params.id, {
    is_active,
    updated_at: new Date().toISOString(),
  });
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

module.exports = { list, create, update, setStatus };
