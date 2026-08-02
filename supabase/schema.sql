-- ============================================================
-- RIANA ON THE MOVE — FULL DATABASE RESET
-- ============================================================
-- ⚠️  PERINGATAN: Script ini akan MENGHAPUS SEMUA DATA!
--     - registrations (100+ peserta akan hilang)
--     - cities (semua kota akan di-recreate dengan data awal)
--     - Semua policy, trigger, index akan di-recreate
--
-- CARA PAKAI:
-- 1. Buka https://supabase.com/dashboard/project/utzwxupemjrwdsemuuib/sql/new
-- 2. Copy-paste SELURUH script ini
-- 3. Klik "Run" — tunggu sampai "✅ RESET COMPLETE" muncul
-- 4. Verify dengan query di bagian bawah
-- ============================================================

BEGIN; -- Atomic transaction — kalau ada error, semua rollback

-- ============================================================
-- STEP 1: DROP semua tabel & function yang ada (idempotent)
-- ============================================================
DROP TRIGGER IF EXISTS registrations_updated_at ON registrations;
DROP TRIGGER IF EXISTS cities_updated_at ON cities;
DROP TRIGGER IF EXISTS merchandise_updated_at ON merchandise;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS merchandise CASCADE;

-- ============================================================
-- STEP 2: CREATE registrations table
-- ============================================================
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

-- ============================================================
-- STEP 3: CREATE cities table (lengkap dengan pricing fields)
-- ============================================================
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
  -- Pricing tier & prices
  tier TEXT DEFAULT 'tier2',
  vip_price INTEGER DEFAULT 175000,
  vip_early_bird_price INTEGER DEFAULT 122500,
  early_bird_active BOOLEAN DEFAULT false,
  -- Map position
  map_x INTEGER,
  map_y INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STEP 4: ENABLE Row Level Security
-- ============================================================
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 5: CREATE POLICIES
-- ============================================================
-- registrations policies
CREATE POLICY "Public can insert registrations" ON registrations
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read count registrations" ON registrations
  FOR SELECT USING (true);
CREATE POLICY "Users read own registrations" ON registrations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own registrations" ON registrations
  FOR UPDATE USING (auth.uid() = user_id AND status = 'registered');

-- cities policies
CREATE POLICY "Public read cities" ON cities
  FOR SELECT USING (true);
CREATE POLICY "Admin write cities" ON cities
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- STEP 5C: CREATE merchandise table
-- ============================================================
CREATE TABLE merchandise (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'apparel', -- apparel | accessories | equipment | bundle
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active | soldout | hidden
  is_exclusive BOOLEAN DEFAULT false, -- true untuk VIP-exclusive merch
  is_bundle BOOLEAN DEFAULT false,    -- true untuk paket bundle
  bundle_items TEXT,                  -- JSON string untuk bundle contents
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read merchandise" ON merchandise;
DROP POLICY IF EXISTS "Admin write merchandise" ON merchandise;

CREATE POLICY "Public read merchandise" ON merchandise
  FOR SELECT USING (true);
CREATE POLICY "Admin write merchandise" ON merchandise
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- STEP 6: CREATE INDEXES (untuk performance)
-- ============================================================
CREATE INDEX idx_registrations_event_city ON registrations(event_city_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX idx_registrations_google_email ON registrations(google_email);
CREATE INDEX idx_registrations_registration_number ON registrations(registration_number);
CREATE INDEX idx_cities_date ON cities(date);
CREATE INDEX idx_cities_status ON cities(status);
CREATE INDEX idx_cities_tier ON cities(tier);
CREATE INDEX idx_merchandise_category ON merchandise(category);
CREATE INDEX idx_merchandise_status ON merchandise(status);
CREATE INDEX idx_merchandise_display_order ON merchandise(display_order);

-- ============================================================
-- STEP 7: CREATE updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger ke kedua tabel
CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER merchandise_updated_at
  BEFORE UPDATE ON merchandise
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STEP 8: SEED cities dengan 20 kota tour
-- ============================================================
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

-- registrations dimulai kosong (data lama sudah di-drop)
-- Peserta baru akan masuk via form pendaftaran landing page

-- ============================================================
-- STEP 9: SEED merchandise dengan produk awal
-- ============================================================
INSERT INTO merchandise (id, name, description, category, price, original_price, image_url, stock, sold, status, is_exclusive, is_bundle, display_order) VALUES
  ('kaos-official',     'Kaos Official Riana On The Move',   'Kaos eksklusif edition 2026, bahan cotton combed 30s, desain khusus roadshow 20 kota.', 'apparel',    125000, 150000, '/brand/merch-kaos.jpg',     500, 87,  'active',  false, false, 1),
  ('step-board',        'Step Board Zumba',                  'Step board khusus Zumba Step, anti-slip, ringan dan portable untuk latihan di rumah.',  'equipment',  175000, NULL,   '/brand/merch-stepboard.jpg', 200, 45,  'active',  false, false, 2),
  ('tote-bag',          'Tote Bag Riana On The Move',        'Tote bag canvas premium dengan logo Riana, kapasitas besar untuk gym & sehari-hari.',  'accessories', 65000,  85000, '/brand/merch-tote.jpg',      300, 112, 'active',  false, false, 3),
  ('bottle-zumba',      'Tumbler Zumba 600ml',               'Tumbler stainless steel 600ml, double wall vacuum, keep cold 24h / hot 12h.',          'accessories', 95000, NULL,   '/brand/merch-bottle.jpg',    250, 38,  'active',  false, false, 4),
  ('vip-bundle',        'VIP Merchandise Bundle',            'Bundle eksklusif VIP: kaos + step board + tote bag + sesi foto bersama Riana.',         'bundle',     350000, 425000, '/brand/merch-vip-bundle.jpg', 50,  0,   'active',  true,  true,  5),
  ('headband',          'Headband Sport Riana',              'Headband dry-fit dengan logo embroidery, cocok untuk workout & zumba.',                'accessories', 45000, NULL,   '/brand/merch-headband.jpg',  400, 64,  'active',  false, false, 6),
  ('jacket-premium',    'Jaket Premium Road to MURI',        'Jaket windbreaker premium edition MURI 2026, bahan waterproof, limited edition.',       'apparel',    285000, 350000, '/brand/merch-jacket.jpg',    100, 12,  'active',  false, false, 7),
  ('wristband-set',     'Wristband Set (pair)',              'Sepasang wristband cotton terry, absorbent, dengan logo Riana On The Move.',            'accessories', 35000, NULL,   '/brand/merch-wristband.jpg', 500, 91,  'active',  false, false, 8)
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ============================================================
-- ✅ RESET COMPLETE
-- ============================================================
-- Verify dengan query di bawah (paste satu per satu di SQL Editor):
--
-- 1. Cek jumlah tabel:
--    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
--    -- harus: registrations, cities, merchandise
--
-- 2. Cek 20 kota:
--    SELECT id, city, tier, vip_price, status FROM cities ORDER BY date;
--
-- 3. Cek merchandise:
--    SELECT id, name, category, price, stock, sold, status FROM merchandise ORDER BY display_order;
--
-- 4. Cek policies:
--    SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
--
-- 5. Cek registrations (harus 0):
--    SELECT count(*) FROM registrations;
--
-- 6. Test API endpoint (buka di browser):
--    https://riana-dnkf.vercel.app/api/setup
--    https://riana-dnkf.vercel.app/api/cities
--    https://riana-dnkf.vercel.app/api/merchandise
-- ============================================================
