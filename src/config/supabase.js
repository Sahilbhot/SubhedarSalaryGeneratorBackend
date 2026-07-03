'use strict';

// Single shared Supabase client for the whole app.
const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

module.exports = supabase;
