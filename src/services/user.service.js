'use strict';

// Data-access layer for the `users` table.
const supabase = require('../config/supabase');

const TABLE = 'users';
// Columns safe to return to clients (never the password hash).
const PUBLIC_COLUMNS = 'id, name, email, role, branch_id, is_active, created_at, updated_at';

function findAll({ branchId } = {}) {
  let query = supabase.from(TABLE).select(PUBLIC_COLUMNS).order('created_at', { ascending: false });
  if (branchId !== undefined && branchId !== null) {
    query = query.eq('branch_id', branchId);
  }
  return query;
}

// Full row incl. password_hash — used internally (auth), never returned raw.
function findById(id) {
  return supabase.from(TABLE).select('*').eq('id', id).single();
}

function findByEmail(email) {
  return supabase.from(TABLE).select('*').eq('email', email).single();
}

function create(payload) {
  return supabase.from(TABLE).insert([payload]).select(PUBLIC_COLUMNS).single();
}

function update(id, updates) {
  return supabase.from(TABLE).update(updates).eq('id', id).select(PUBLIC_COLUMNS).single();
}

// Strip sensitive fields before sending a user to a client.
function toPublic(user) {
  if (!user) return user;
  // eslint-disable-next-line no-unused-vars
  const { password_hash, ...rest } = user;
  return rest;
}

module.exports = { findAll, findById, findByEmail, create, update, toPublic, PUBLIC_COLUMNS };
