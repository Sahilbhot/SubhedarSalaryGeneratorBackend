'use strict';

// Data-access layer for the `menu_items` table. All Supabase queries live here
// so controllers stay thin and the DB shape is easy to change in one place.
const supabase = require('../config/supabase');

const TABLE = 'menu_items';

// Admin listing. Optional `search` filters by name, description, or section
// (case-insensitive). Ordered so items keep menu order.
function findAll(search) {
  let query = supabase.from(TABLE).select('*');

  const term = (search || '').trim();
  if (term) {
    // Strip characters that would break PostgREST's or() filter grammar,
    // then match the term anywhere in name / description / section.
    const safe = term.replace(/[,()*]/g, ' ').trim();
    if (safe) {
      const pattern = `%${safe}%`;
      query = query.or(
        `name.ilike.${pattern},description.ilike.${pattern},section.ilike.${pattern}`,
      );
    }
  }

  return query
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
