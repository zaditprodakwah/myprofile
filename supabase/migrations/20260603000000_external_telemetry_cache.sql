-- Migration to add external_telemetry_cache table

CREATE TABLE IF NOT EXISTS external_telemetry_cache (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  source TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE external_telemetry_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read external_telemetry_cache" ON external_telemetry_cache;
CREATE POLICY "Public read external_telemetry_cache" ON external_telemetry_cache FOR SELECT TO anon USING (true);
