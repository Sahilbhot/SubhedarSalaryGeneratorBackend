-- Migration 002: dynamic menu (menu_items)
-- Run this in the Supabase SQL editor (or psql) after 001_auth.sql.
-- Powers the public landing-page menu and the admin Menu management screen.

-- ── Menu items ──────────────────────────────────────────────────────────────
create table if not exists menu_items (
  menu_item_id  bigint generated always as identity primary key,
  name          text not null,
  description   text,
  -- price is stored as text so half/full or multi-serve prices ("580/950",
  -- "170/220") can be represented as printed on the physical menu.
  price         text not null,
  type          text not null default 'veg' check (type in ('veg', 'non-veg')),
  section       text not null,
  -- lower sort_order shows first; items keep menu order, new ones fall to the end.
  sort_order    integer not null default 1000,
  -- hide an item from the public site without deleting it (e.g. out of stock).
  is_available  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists menu_items_section_idx on menu_items (section);
create index if not exists menu_items_order_idx on menu_items (sort_order);

-- ── API-role grants ─────────────────────────────────────────────────────────
-- Match the existing tables: the backend uses the anon key server-side.
grant select, insert, update, delete on table menu_items to anon, authenticated, service_role;

-- ── Seed data (extracted from the printed menu) ─────────────────────────────
-- Run once. Re-running duplicates rows, so guard on an empty table.
insert into menu_items (name, description, price, type, section, sort_order)
select * from (values
  -- Mutton Starter
  ('Mutton Mitmirchi',            '5 Piece', '310', 'non-veg', 'Mutton Starter',  10),
  ('Mutton Kharda',              '5 Piece', '280', 'non-veg', 'Mutton Starter',  20),
  ('Mutton Sukkha',             '5 Piece', '270', 'non-veg', 'Mutton Starter',  30),
  ('Mutton Ukkad',              '5 Piece', '300', 'non-veg', 'Mutton Starter',  40),
  ('Mutton Aalni Fry',          '5 Piece', '270', 'non-veg', 'Mutton Starter',  50),
  -- Chicken Starter
  ('Chicken Mitmirchi',          '5 Piece', '210', 'non-veg', 'Chicken Starter', 60),
  ('Chicken Kharda',            '5 Piece', '190', 'non-veg', 'Chicken Starter', 70),
  ('Chicken Sukkha',            '5 Piece', '190', 'non-veg', 'Chicken Starter', 80),
  ('Chicken Ukkad',             '5 Piece', '220', 'non-veg', 'Chicken Starter', 90),
  ('Chicken Aalni Fry',         '5 Piece', '190', 'non-veg', 'Chicken Starter', 100),
  -- Other Starter
  ('Roasted Papad',              null,      '30',  'veg',     'Other Starter',   110),
  ('Boiled Egg Plate',           '2 Eggs',  '40',  'non-veg', 'Other Starter',   120),
  ('Masala Papad',               null,      '60',  'veg',     'Other Starter',   130),
  ('Fry Papad',                  null,      '40',  'veg',     'Other Starter',   140),
  -- Mutton Thali
  ('Subhedar Special Mutton Thali', 'Mutton Sukka, Rassa, Mutton Kheema, Boiled Egg, Aalni Soup, Indrayani Rice, Solkhadi, 2 Bhakri/Chapati', '430', 'non-veg', 'Mutton Thali', 150),
  ('Mutton Thali',               'Mutton Sukkha, Rassa, Indrayani Rice, 2 Bhakri/Chapati', '380', 'non-veg', 'Mutton Thali', 160),
  ('Mutton Kheema Thali',        'Mutton Kheema, Rassa, Indrayani Rice, 2 Bhakri/Chapati', '270', 'non-veg', 'Mutton Thali', 170),
  -- Mutton Dish
  ('Mutton Curry',               '5 Piece', '350', 'non-veg', 'Mutton Dish', 180),
  ('Mutton Kheema',              null,      '250', 'non-veg', 'Mutton Dish', 190),
  ('Mutton Handi',               'Half serves 2 / Full serves 4', '580/950', 'non-veg', 'Mutton Dish', 200),
  -- Chicken Thali
  ('Subhedar Special Chicken Thali', 'Chicken Sukkha, Rassa, Chicken Kheema, Boiled Egg, Aalni Soup, Indrayani Rice, Solkhadi, 2 Bhakri/Chapati', '360', 'non-veg', 'Chicken Thali', 210),
  ('Chicken Thali',              'Chicken Sukkha, Rassa, Indrayani Rice, 2 Bhakri/Chapati', '310', 'non-veg', 'Chicken Thali', 220),
  ('Chicken Kheema Thali',       'Chicken Kheema, Unlimited Rassa, Indrayani Rice, 2 Bhakri/Chapati', '250', 'non-veg', 'Chicken Thali', 230),
  -- Chicken Dish
  ('Chicken Curry',              null,      '300', 'non-veg', 'Chicken Dish', 240),
  ('Chicken Kheema',             null,      '200', 'non-veg', 'Chicken Dish', 250),
  ('Chicken Handi',              'Half serves 2 / Full serves 4', '450/700', 'non-veg', 'Chicken Dish', 260),
  -- Egg Thali
  ('Aanda Thali',                'Anda Curry, Indrayani Rice, 2 Bhakri/Chapati', '200', 'non-veg', 'Egg Thali', 270),
  -- Egg Dish
  ('Egg Masala',                 null,      '170', 'non-veg', 'Egg Dish', 280),
  ('Egg Curry',                  null,      '150', 'non-veg', 'Egg Dish', 290),
  ('Omelette',                   null,      '60',  'non-veg', 'Egg Dish', 300),
  -- Veg Dish
  ('Kaju Masala',                null,      '220', 'veg', 'Veg Dish', 310),
  ('Paneer Butter Masala',       null,      '230', 'veg', 'Veg Dish', 320),
  ('Paneer Masala',              null,      '200', 'veg', 'Veg Dish', 330),
  ('Paneer Kharda',              null,      '190', 'veg', 'Veg Dish', 340),
  ('Masala Shevbhaji',           null,      '190', 'veg', 'Veg Dish', 350),
  -- Others
  ('Aalni Bhat',                 'Half / Full', '170/220', 'non-veg', 'Others', 360),
  ('Indrayani Rice',             'Half / Full', '100/150', 'veg', 'Others', 370),
  ('Soup Bowl',                  null,      '50',  'non-veg', 'Others', 380),
  ('Rassa Bowl',                 null,      '50',  'non-veg', 'Others', 390),
  ('Solkhadi',                   null,      '40',  'veg', 'Others', 400),
  ('Chapati',                    null,      '25',  'veg', 'Others', 410),
  ('Bajri Bhakri / Jawari Bhakri', null,    '35',  'veg', 'Others', 420),
  ('Roti',                       null,      '20',  'veg', 'Others', 430),
  ('Butter Roti',                null,      '20',  'veg', 'Others', 440),
  ('Mineral Water',              null,      '20',  'veg', 'Others', 450),
  ('Sukhat',                     null,      '50',  'non-veg', 'Others', 460),
  ('Rassa Handi',                null,      '160', 'non-veg', 'Others', 470),
  ('Indrayani Rice Bowl',        null,      '40',  'veg', 'Others', 480),
  ('Jeera Rice',                 'Half / Full', '80/110', 'veg', 'Others', 490),
  -- Party Order
  ('Mutton 1kg',                 'Rassa and Mutton Sukkha', '1850', 'non-veg', 'Party Order', 500),
  ('Chicken 1kg',                'Rassa and Chicken Sukkha', '1350', 'non-veg', 'Party Order', 510)
) as seed(name, description, price, type, section, sort_order)
where not exists (select 1 from menu_items);
