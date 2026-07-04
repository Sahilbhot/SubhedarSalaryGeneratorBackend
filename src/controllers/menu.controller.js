'use strict';

// Request handlers for menu endpoints. Validation + response shaping only;
// all persistence is delegated to menu.service.
const menuService = require('../services/menu.service');
const { sendSuccess, sendError } = require('../utils/response');

const TYPES = ['veg', 'non-veg'];

// Public endpoint — only items that are marked available.
async function listPublic(request, reply) {
  const { data, error } = await menuService.findAvailable();
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

// Admin endpoint — every item, including hidden ones. Supports `?search=`.
async function list(request, reply) {
  const { data, error } = await menuService.findAll(request.query?.search);
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

async function getOne(request, reply) {
  const { data, error } = await menuService.findById(request.params.id);
  if (error) return sendError(reply, 'Menu item not found', 404);
  return sendSuccess(reply, data);
}

async function create(request, reply) {
  const { name, description, price, type, section, sort_order, is_available } = request.body || {};

  if (!name || !String(name).trim()) return sendError(reply, 'name is required', 400);
  if (price === undefined || price === null || !String(price).trim())
    return sendError(reply, 'price is required', 400);
  if (!section || !String(section).trim()) return sendError(reply, 'section is required', 400);
  if (type !== undefined && !TYPES.includes(type))
    return sendError(reply, "type must be 'veg' or 'non-veg'", 400);

  const payload = {
    name: String(name).trim(),
    description: description ? String(description).trim() : null,
    price: String(price).trim(),
    type: type || 'veg',
    section: String(section).trim(),
  };
  if (sort_order !== undefined) payload.sort_order = Number(sort_order) || 0;
  if (is_available !== undefined) payload.is_available = Boolean(is_available);

  const { data, error } = await menuService.create(payload);
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data, 201);
}

async function update(request, reply) {
  const { name, description, price, type, section, sort_order, is_available } = request.body || {};

  if (type !== undefined && !TYPES.includes(type))
    return sendError(reply, "type must be 'veg' or 'non-veg'", 400);

  const updates = {};
  if (name !== undefined) updates.name = String(name).trim();
  if (description !== undefined) updates.description = description ? String(description).trim() : null;
  if (price !== undefined) updates.price = String(price).trim();
  if (type !== undefined) updates.type = type;
  if (section !== undefined) updates.section = String(section).trim();
  if (sort_order !== undefined) updates.sort_order = Number(sort_order) || 0;
  if (is_available !== undefined) updates.is_available = Boolean(is_available);
  updates.updated_at = new Date().toISOString();

  const { data, error } = await menuService.update(request.params.id, updates);
  if (error) return sendError(reply, error);
  return sendSuccess(reply, data);
}

async function remove(request, reply) {
  const { error } = await menuService.remove(request.params.id);
  if (error) return sendError(reply, error);
  return sendSuccess(reply, { message: 'Menu item deleted successfully' });
}

module.exports = { listPublic, list, getOne, create, update, remove };
