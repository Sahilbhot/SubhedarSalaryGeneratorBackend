'use strict';

// Single shared Supabase client for the whole app.
// Uses the service-role key when available (trusted server, bypasses RLS),
// otherwise falls back to the anon key.
const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

const supabase = createClient(env.SUPABASE_URL, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = supabase;
