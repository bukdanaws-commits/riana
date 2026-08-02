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
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own" ON registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own" ON registrations FOR UPDATE USING (auth.uid() = user_id AND status = 'registered');

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
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);
