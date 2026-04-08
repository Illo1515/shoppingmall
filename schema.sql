-- Toss Shopping Mall Schema

-- 1. NextAuth v5 (Auth.js) Tables for Supabase
CREATE TABLE IF NOT EXISTS users (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text,
  email text,
  "emailVerified" timestamp with time zone,
  image text
);

CREATE TABLE IF NOT EXISTS accounts (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  "sessionToken" text NOT NULL UNIQUE,
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamp with time zone NOT NULL,
  UNIQUE(identifier, token)
);

-- 2. Our Shopping Mall Tables
CREATE TABLE IF NOT EXISTS products (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  category text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id),
  "productId" uuid NOT NULL REFERENCES products(id),
  amount integer NOT NULL,
  status text DEFAULT 'PENDING',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 1. Product Policies
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (true);

-- 2. User Policies
CREATE POLICY "Users can only view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can only update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 3. Order Policies
CREATE POLICY "Users can only view their own orders" ON orders
  FOR SELECT USING (auth.uid() = "userId");

-- Note: 'accounts', 'sessions', and 'verification_tokens' do not have public policies.
-- They are managed via the Service Role Key by Auth.js and bypass RLS.

-- Storage Bucket Setup for images
-- Note: You already created the "products" bucket and made it public in the UI!
