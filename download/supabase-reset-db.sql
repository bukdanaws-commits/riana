-- ============================================================
-- RIANA ON THE MOVE — DATABASE RESET (Quick Version)
-- ============================================================
-- Jalankan di: https://supabase.com/dashboard/project/utzwxupemjrwdsemuuib/sql/new
-- ⚠️  Semua data lama akan hilang!
-- ============================================================

BEGIN;

DROP TRIGGER IF EXISTS registrations_updated_at ON registrations;
DROP TRIGGER IF EXISTS cities_updated_at ON cities;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

-- registrations table
CREATE TABLE registrations (
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

-- cities table
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  date_label TEXT,
  day_label TEXT,
  city TEXT NOT NULL,
  venue TEXT,
  region TEXT,
  capacity INTEGER DEFAULT 500,
  registered INTEGER DEFAULT 0,
  checked_in INTEGER DEFAULT 0,
  status TEXT DEFAULT 'soon',
  price TEXT DEFAULT 'Gratis',
  tier TEXT DEFAULT 'tier2',
  vip_price INTEGER DEFAULT 175000,
  vip_early_bird_price INTEGER DEFAULT 122500,
  early_bird_active BOOLEAN DEFAULT false,
  map_x INTEGER,
  map_y INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Policies: registrations
CREATE POLICY "Public can insert registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read count registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "Users read own registrations" ON registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own registrations" ON registrations FOR UPDATE USING (auth.uid() = user_id AND status = 'registered');

-- Policies: cities
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Admin write cities" ON cities FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_registrations_event_city ON registrations(event_city_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX idx_registrations_google_email ON registrations(google_email);
CREATE INDEX idx_registrations_registration_number ON registrations(registration_number);
CREATE INDEX idx_cities_date ON cities(date);
CREATE INDEX idx_cities_status ON cities(status);
CREATE INDEX idx_cities_tier ON cities(tier);

-- Trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER cities_updated_at BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed 20 kota
INSERT INTO cities (id, date, date_label, day_label, city, venue, region, capacity, registered, checked_in, status, price, tier, vip_price, vip_early_bird_price, early_bird_active, map_x, map_y) VALUES
  ('bandung',     '2026-07-12', '12 Juli',      'Minggu', 'Bandung',     'Saparua Sport Center',                'Jawa Barat',    500, 487, 487, 'completed', 'Gratis', 'tier1', 250000, 175000, false, 47, 60),
  ('purwokerto',  '2026-07-19', '19 Juli',      'Minggu', 'Purwokerto',  'GOR Soemardip',                       'Jawa Tengah',   400, 412, 412, 'completed', 'Gratis', 'tier2', 175000, 122500, false, 49, 62),
  ('depok',       '2026-08-02', '2 Agustus',    'Minggu', 'Depok',       'Universitas Indonesia',               'Jawa Barat',    600, 432, 0,   'open',      'Gratis', 'tier2', 175000, 122500, true,  48, 61),
  ('tangerang',   '2026-08-09', '9 Agustus',    'Minggu', 'Tangerang',   'ICE BSD City',                        'Jawa Barat',    800, 287, 0,   'open',      'Gratis', 'tier2', 175000, 122500, true,  47, 60),
  ('cirebon',     '2026-08-23', '23 Agustus',   'Minggu', 'Cirebon',     'Gelora Bima Krida',                   'Jawa Barat',    400, 145, 0,   'open',      'Gratis', 'tier2', 175000, 122500, false, 50, 60),
  ('semarang',    '2026-08-30', '30 Agustus',   'Minggu', 'Semarang',    'Jatidiri Sport Complex',              'Jawa Tengah',   600, 89,  0,   'open',      'Gratis', 'tier2', 175000, 122500, false, 52, 60),
  ('yogyakarta',  '2026-09-06', '6 September',  'Minggu', 'Yogyakarta',  'GOR Amongrogo',                       'Jawa Tengah',   600, 42,  0,   'open',      'Gratis', 'tier2', 175000, 122500, false, 53, 62),
  ('malang',      '2026-09-12', '12 September', 'Sabtu',  'Malang',      'Gajayana Stadium',                    'Jawa Timur',    500, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 58, 62),
  ('surabaya',    '2026-09-13', '13 September', 'Minggu', 'Surabaya',    'DBL Arena',                           'Jawa Timur',    800, 0,   0,   'soon',      'Gratis', 'tier1', 250000, 175000, false, 59, 60),
  ('bali',        '2026-09-20', '20 September', 'Minggu', 'Bali',        'Bali International Convention',       'Bali & Nusra',  700, 0,   0,   'soon',      'Gratis', 'tier1', 250000, 175000, false, 64, 64),
  ('lombok',      '2026-09-27', '27 September', 'Minggu', 'Lombok',      'Mataram City Center',                 'Bali & Nusra',  400, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 68, 64),
  ('lampung',     '2026-10-11', '11 Oktober',   'Minggu', 'Lampung',     'Sport Hall Sumpah Pemuda',            'Sumatera',      500, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 42, 64),
  ('palembang',   '2026-10-18', '18 Oktober',   'Minggu', 'Palembang',   'Gelora Sriwijaya',                    'Sumatera',      500, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 38, 60),
  ('medan',       '2026-10-25', '25 Oktober',   'Minggu', 'Medan',       'Convention Center Madani',            'Sumatera',      600, 0,   0,   'soon',      'Gratis', 'tier1', 250000, 175000, false, 30, 48),
  ('batam',       '2026-11-01', '1 November',   'Minggu', 'Batam',       'Engku Concession Hall',               'Sumatera',      400, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 33, 50),
  ('makassar',    '2026-11-08', '8 November',   'Minggu', 'Makassar',    'Makassar Sport Center',               'Sulawesi',      600, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 72, 62),
  ('manado',      '2026-11-15', '15 November',  'Minggu', 'Manado',      'Mega Mall Convention',                'Sulawesi',      400, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 77, 50),
  ('banjarmasin', '2026-11-22', '22 November',  'Minggu', 'Banjarmasin', 'Lambung Mangkurat Sport Hall',        'Kalimantan',    400, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 67, 60),
  ('balikpapan',  '2026-11-29', '29 November',  'Minggu', 'Balikpapan',  'Domine Eduard Sport Hall',            'Kalimantan',    400, 0,   0,   'soon',      'Gratis', 'tier2', 175000, 122500, false, 72, 56),
  ('jakarta',     '2026-12-05', '5 Desember',   'Sabtu',  'Jakarta',     'JIS (Jakarta International Stadium)',  'Jawa Barat',   3000, 256, 0,   'open',      'Gratis', 'finale', 350000, 245000, true,  48, 60)
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ✅ DONE — verify:
-- SELECT count(*) FROM cities;        -- should be 20
-- SELECT count(*) FROM registrations; -- should be 0
