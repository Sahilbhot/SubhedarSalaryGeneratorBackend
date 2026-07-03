'use strict';
/* eslint-disable no-console */

// Bootstrap the first admin account (no public signup).
// Usage: node scripts/create-admin.js "<name>" <email> <password>
// Requires the `users` table (run db/migrations/001_auth.sql first).
const supabase = require('../src/config/supabase');
const { hashPassword } = require('../src/utils/password');

async function main() {
  const [name, email, password] = process.argv.slice(2);

  if (!name || !email || !password) {
    console.error('Usage: node scripts/create-admin.js "<name>" <email> <password>');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error('Password must be at least 6 characters.');
    process.exit(1);
  }

  const password_hash = await hashPassword(password);
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name,
        email: email.toLowerCase().trim(),
        password_hash,
        role: 'admin',
        branch_id: null,
      },
    ])
    .select('id, name, email, role')
    .single();

  if (error) {
    if (error.code === '23505') {
      console.error(`A user with email "${email}" already exists.`);
    } else {
      console.error('Failed to create admin:', error.message);
    }
    process.exit(1);
  }

  console.log('✓ Admin created:', data);
  process.exit(0);
}

main();
