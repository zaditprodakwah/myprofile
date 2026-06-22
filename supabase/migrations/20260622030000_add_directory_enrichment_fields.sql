-- MIGRATION_ID: 20260622030000_add_directory_enrichment_fields
-- PURPOSE: Menambahkan kolom metadata Google Places dan caching audit ke tabel directory_entities

-- UP
ALTER TABLE public.directory_entities
  ADD COLUMN IF NOT EXISTS place_id       text,
  ADD COLUMN IF NOT EXISTS maps_url       text,
  ADD COLUMN IF NOT EXISTS popular_times  jsonb         DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS last_scraped   timestamptz   DEFAULT now();

-- Buat indeks untuk cron job monitoring
CREATE INDEX IF NOT EXISTS idx_directory_entities_last_scraped 
  ON public.directory_entities(last_scraped);
