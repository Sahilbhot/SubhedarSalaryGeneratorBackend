'use strict';

// Branch management. Reads allowed to admin + manager; writes admin only.
const branchService = require('../services/branch.service');
const { sendSuccess, sendError } = require('../utils/response');

async function list(request, reply) {
  const { data, error } = await branchService.findAll();
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

async function create(request, reply) {
  const { name, address } = request.body || {};
  if (!name) {
    return sendError(reply, 'name is required', 400);
  }
  const { data, error } = await branchService.create({ name, address });
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data, 201);
}

async function update(request, reply) {
  const { name, address, is_active } = request.body || {};
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (address !== undefined) updates.address = address;
  if (is_active !== undefined) updates.is_active = is_active;

  const { data, error } = await branchService.update(request.params.id, updates);
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

module.exports = { list, create, update };
