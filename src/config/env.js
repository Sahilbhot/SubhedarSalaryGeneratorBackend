'use strict';

// Centralised, validated environment configuration.
// Loaded once and reused everywhere via `require('../config/env')`.
require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3001,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  // Preferred for this trusted backend: bypasses RLS. Falls back to the anon key.
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

// Warn early (rather than failing deep inside a request) when config is missing.
const REQUIRED = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET'];
const missing = REQUIRED.filter((key) => !env[key]);
if (missing.length > 0) {
  console.warn(`[env] Missing required environment variables: ${missing.join(', ')}`);
}

module.exports = env;
