'use strict';

// Data-access layer for the `branches` table.
const supabase = require('../config/supabase');

const TABLE = 'branches';

function findAll() {
  return supabase.from(TABLE).select('*').order('created_at', { ascending: false });
}

function findById(id) {
  return supabase.from(TABLE).select('*').eq('id', id).single();
}

function create(payload) {
  return supabase.from(TABLE).insert([payload]).select().single();
}

function update(id, updates) {
  return supabase.from(TABLE).update(updates).eq('id', id).select().single();
}

module.exports = { findAll, findById, create, update };
