'use strict';

// Data-access layer for the `employees` table. All Supabase queries live here
// so controllers stay thin and the DB shape is easy to change in one place.
const supabase = require('../config/supabase');

const TABLE = 'employees';

function findAll() {
  return supabase.from(TABLE).select('*').order('created_at', { ascending: false });
}

function findById(id) {
  return supabase.from(TABLE).select('*').eq('employee_id', id).single();
}

function create(payload) {
  return supabase.from(TABLE).insert([payload]).select().single();
}

function update(id, updates) {
  return supabase.from(TABLE).update(updates).eq('employee_id', id).select().single();
}

function remove(id) {
  return supabase.from(TABLE).delete().eq('employee_id', id);
}

module.exports = { findAll, findById, create, update, remove };
