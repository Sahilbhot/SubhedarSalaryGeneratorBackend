'use strict';

// Data-access layer for the `menu_items` table. All Supabase queries live here
// so controllers stay thin and the DB shape is easy to change in one place.
const supabase = require('../config/supabase');

const TABLE = 'menu_items';

// Ordered so the public landing page renders sections/items in menu order.
function findAll() {
  return supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
}

// Only items flagged available — used by the public (unauthenticated) endpoint.
function findAvailable() {
  return supabase
    .from(TABLE)
    .select('*')
    .eq('is_available', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
}

function findById(id) {
  return supabase.from(TABLE).select('*').eq('menu_item_id', id).single();
}

function create(payload) {
  return supabase.from(TABLE).insert([payload]).select().single();
}

function update(id, updates) {
  return supabase.from(TABLE).update(updates).eq('menu_item_id', id).select().single();
}

function remove(id) {
  return supabase.from(TABLE).delete().eq('menu_item_id', id);
}

module.exports = { findAll, findAvailable, findById, create, update, remove };
