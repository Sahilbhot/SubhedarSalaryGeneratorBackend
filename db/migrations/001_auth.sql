-- Migration 001: authentication (branches + users)
-- Run this in the Supabase SQL editor (or psql) before using the auth APIs.

-- ── Branches ────────────────────────────────────────────────────────────────
create table if not exists branches (
  id          bigint generated always as identity primary key,
  name        text not null,
  address     text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Users ───────────────────────────────────────────────────────────────────
create table if not exists users (
  id            bigint generated always as identity primary key,
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null check (role in ('admin', 'manager', 'staff')),
  -- admin is global (branch_id null); manager/staff belong to a branch.
  branch_id     bigint references branches (id) on delete set null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists users_email_idx on users (email);
create index if not exists users_branch_idx on users (branch_id);

-- ── API-role grants ─────────────────────────────────────────────────────────
-- Tables created via raw SQL don't inherit the API grants that the Supabase
-- dashboard adds automatically. The backend uses the anon key (server-side
-- only), consistent with the existing `employees` table, so grant it access.
grant select, insert, update, delete on table branches to anon, authenticated, service_role;
grant select, insert, update, delete on table users to anon, authenticated, service_role;
