-- Migration to add sovereign-explorer specific tables

CREATE TABLE IF NOT EXISTS reference_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,          -- 'economic_data', 'market_data', 'demographic', 'tech_news'
  source_api TEXT NOT NULL,        -- 'FRED', 'CoinGecko', 'FMP', 'BPS', etc.
  description TEXT,
  content JSONB,                   -- The actual data fetched
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  last_fetched_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reference_items_slug ON reference_items(slug);
CREATE INDEX IF NOT EXISTS idx_reference_items_category ON reference_items(category);

ALTER TABLE reference_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read reference_items" ON reference_items;
CREATE POLICY "Public read reference_items" ON reference_items FOR SELECT TO anon USING (is_active = true);
