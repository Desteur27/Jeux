/*
# Create games and orders tables for Boutique de Desteur Game

1. New Tables
- `games`: Catalog of games (Naruto, Call of Duty, Injustice, sport, action, survival, Minecraft). No RPG.
  - id, title, category, genre, price, description, image_url, rating, platform, featured, stock, created_at
- `orders`: Customer orders (no delivery, direct payment)
  - id, customer_name, customer_phone, customer_email, items (jsonb), total, payment_method, status, created_at

2. Security
- games: public read (anon + authenticated), no public write.
- orders: public insert (anon + authenticated). No SELECT/UPDATE/DELETE for anon.
*/

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  genre text NOT NULL,
  price numeric(12, 2) NOT NULL,
  description text,
  image_url text,
  rating numeric(3, 1) DEFAULT 4.5,
  platform text,
  featured boolean DEFAULT false,
  stock integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_games" ON games;
CREATE POLICY "public_read_games"
  ON games FOR SELECT
  TO anon, authenticated
  USING (true);

ALTER TABLE games FORCE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  items jsonb NOT NULL,
  total numeric(12, 2) NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(featured);
