-- Create reference_items table
CREATE TABLE IF NOT EXISTS reference_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('growth-playbook', 'seo-checklist', 'market-benchmark', 'civic-data')),
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  source_name TEXT,
  source_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist if the table was previously created without them
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;


-- Create external_telemetry_cache table
CREATE TABLE IF NOT EXISTS external_telemetry_cache (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  source TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE reference_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_telemetry_cache ENABLE ROW LEVEL SECURITY;

-- Public Select policies (bypasses RLS for reads)
DROP POLICY IF EXISTS "Public read reference_items" ON reference_items;
CREATE POLICY "Public read reference_items" ON reference_items FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public read external_telemetry_cache" ON external_telemetry_cache;
CREATE POLICY "Public read external_telemetry_cache" ON external_telemetry_cache FOR SELECT TO anon USING (true);


