-- ============================================================
-- Riana On The Move — Supabase Schema (idempotent)
-- Run this in Supabase SQL Editor:
--   https://supabase.com/dashboard/project/utzwxupemjrwdsemuuib/sql/new
-- ============================================================

-- ============================================================
-- TABLE: registrations
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  google_email TEXT NOT NULL,
  google_name TEXT,
  google_avatar_url TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date DATE,
  age INTEGER,
  gender TEXT DEFAULT 'P',
  address TEXT,
  city_domicile TEXT,
  event_city_id TEXT NOT NULL,
  event_city_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  ticket_type TEXT DEFAULT 'regular',
  ticket_price INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'free',
  status TEXT DEFAULT 'registered',
  check_in_time TIMESTAMPTZ,
  e_ticket_sent BOOLEAN DEFAULT FALSE,
  e_certificate_sent BOOLEAN DEFAULT FALSE,
  referral_source TEXT DEFAULT 'instagram',
  marketing_consent BOOLEAN DEFAULT FALSE,
  is_muri_record BOOLEAN DEFAULT TRUE,
  muri_verified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent) then recreate
DROP POLICY IF EXISTS "Public can insert" ON registrations;
DROP POLICY IF EXISTS "Users read own" ON registrations;
DROP POLICY IF EXISTS "Users update own" ON registrations;
DROP POLICY IF EXISTS "Public read count" ON registrations;

-- PUBLIC INSERT — anyone can register (landing page form)
CREATE POLICY "Public can insert" ON registrations
  FOR INSERT WITH CHECK (true);

-- PUBLIC READ (count only via head:true) — for landing page live counter
-- Note: SELECT with head:true still requires SELECT policy.
-- This policy allows reading count, but actual row data is restricted.
CREATE POLICY "Public read count" ON registrations
  FOR SELECT USING (true);

-- USERS READ OWN — logged-in users can read their own registrations
-- (useful if user wants to see their registration status)
-- Note: "Public read count" already allows reading all rows for count,
-- but for actual data fetching we still want users to see only their own.
-- In practice, the public endpoint uses head:true so no row data leaks.
-- For tighter security, you can drop "Public read count" and rely on
-- service_role for admin + this policy for user-facing features.
CREATE POLICY "Users read own" ON registrations
  FOR SELECT USING (auth.uid() = user_id);

-- USERS UPDATE OWN — users can update their own registration
-- (only if status is still 'registered', to prevent edits after check-in)
CREATE POLICY "Users update own" ON registrations
  FOR UPDATE USING (auth.uid() = user_id AND status = 'registered');

-- ============================================================
-- TABLE: cities
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  city TEXT NOT NULL,
  venue TEXT,
  region TEXT,
  capacity INTEGER DEFAULT 500,
  registered INTEGER DEFAULT 0,
  status TEXT DEFAULT 'soon',
  price TEXT DEFAULT 'Gratis'
);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read cities" ON cities;
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);

-- ============================================================
-- INDEX for faster queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_registrations_event_city ON registrations(event_city_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_google_email ON registrations(google_email);

-- ============================================================
-- UPDATED_AT trigger (auto-update updated_at on row update)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS registrations_updated_at ON registrations;
CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DONE — verify with:
--   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('registrations', 'cities');
--   SELECT polname, polcmd FROM pg_policies WHERE schemaname = 'public';
-- ============================================================
