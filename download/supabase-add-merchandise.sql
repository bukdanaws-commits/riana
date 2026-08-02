-- ============================================================
-- RIANA ON THE MOVE — ADD MERCHANDISE TABLE (Partial, Non-Destructive)
-- ============================================================
-- Script ini HANYA menambah tabel merchandise.
-- TIDAK akan menghapus registrations atau cities yang sudah ada.
--
-- Aman dijalankan berkali-kali (idempotent).
--
-- CARA PAKAI:
-- 1. Buka https://supabase.com/dashboard/project/utzwxupemjrwdsemuuib/sql/new
-- 2. Copy-paste SELURUH script ini
-- 3. Klik "Run"
-- 4. Verify dengan query di bagian bawah
-- ============================================================

-- ============================================================
-- STEP 1: CREATE merchandise table (kalau belum ada)
-- ============================================================
CREATE TABLE IF NOT EXISTS merchandise (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'apparel',
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  is_exclusive BOOLEAN DEFAULT false,
  is_bundle BOOLEAN DEFAULT false,
  bundle_items TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STEP 2: ENABLE RLS + Policies
-- ============================================================
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
-- STEP 3: INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_merchandise_category ON merchandise(category);
CREATE INDEX IF NOT EXISTS idx_merchandise_status ON merchandise(status);
CREATE INDEX IF NOT EXISTS idx_merchandise_display_order ON merchandise(display_order);

-- ============================================================
-- STEP 4: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS merchandise_updated_at ON merchandise;
CREATE TRIGGER merchandise_updated_at
  BEFORE UPDATE ON merchandise
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STEP 5: SEED 8 produk merchandise (kalau belum ada)
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

-- ============================================================
-- ✅ DONE — Verify:
-- ============================================================
-- 1. Cek tabel merchandise ada:
--    SELECT tablename FROM pg_tables WHERE tablename = 'merchandise';
--
-- 2. Cek 8 produk:
--    SELECT id, name, category, price, stock, sold, status FROM merchandise ORDER BY display_order;
--
-- 3. Cek policies:
--    SELECT policyname FROM pg_policies WHERE tablename = 'merchandise';
--
-- 4. Test API:
--    https://riana-dnkf.vercel.app/api/merchandise
--    (harus return 8 active items)
-- ============================================================
