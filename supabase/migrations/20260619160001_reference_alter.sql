-- Ensure columns exist in a separate migration step
ALTER TABLE reference_items ALTER COLUMN content TYPE TEXT USING content::text;
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE reference_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
