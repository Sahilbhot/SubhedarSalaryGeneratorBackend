'use strict';

// Centralised, validated environment configuration.
// Loaded once and reused everywhere via `require('../config/env')`.
require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3001,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
};

// Warn early (rather than failing deep inside a request) when config is missing.
const REQUIRED = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missing = REQUIRED.filter((key) => !env[key]);
if (missing.length > 0) {
  console.warn(`[env] Missing required environment variables: ${missing.join(', ')}`);
}

module.exports = env;
