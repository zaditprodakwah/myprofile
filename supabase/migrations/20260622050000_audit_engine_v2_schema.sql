-- MIGRATION_ID: 20260622050000_audit_engine_v2_schema
-- DEPENDENCIES: 20260622010000_v2_upgrade, 02_phase2_website_intelligence
-- PURPOSE: Fix schema gaps for Audit Engine V2 reliability:
--   1. Add collected_at alias to snapshots (collector uses collected_at, schema has captured_at)
--   2. Add MarTech/security columns to snapshots for Layer 1 deterministic analysis
--   3. Add trust/martech enrichment columns to organizations
--   4. Enable RLS on jobs/job_events/snapshots/scores/recommendations (anon insert allowed)
--   5. Add audit_engine_cache table for PSI response caching (24h TTL to save API quota)
-- BACKWARD_COMPATIBILITY_NOTE: Additive only. No drops or renames.

-- UP

-- 1. Fix snapshot column discrepancy: add collected_at (collector writes this, captured_at is old alias)
ALTER TABLE public.snapshots
  ADD COLUMN IF NOT EXISTS collected_at TIMESTAMPTZ DEFAULT now();

-- 2. Audit Engine V2 enrichment columns on snapshots
ALTER TABLE public.snapshots
  ADD COLUMN IF NOT EXISTS martech_stack_json      jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS security_headers_json   jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS safety_flags_json       jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS seo_technical_json      jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_narrative_summary    text;

-- 3. B2B Directory enrichment columns on organizations
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS trust_score             integer     DEFAULT 50,
  ADD COLUMN IF NOT EXISTS martech_detected_json   jsonb       DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS security_status_json    jsonb       DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS business_nature_summary text,
  ADD COLUMN IF NOT EXISTS last_audited_at         timestamptz;

-- 4. Same enrichment columns for directory_entities (used by directory pages)
ALTER TABLE public.directory_entities
  ADD COLUMN IF NOT EXISTS martech_detected_json   jsonb       DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS security_status_json    jsonb       DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS business_nature_summary text,
  ADD COLUMN IF NOT EXISTS last_audited_at         timestamptz;

-- 5. Ensure performance indexes
CREATE INDEX IF NOT EXISTS idx_snapshots_job_id        ON public.snapshots(job_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_domain_id     ON public.snapshots(domain_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_collected_at  ON public.snapshots(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_scores_snapshot_id      ON public.scores(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_snap_id ON public.recommendations(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_orgs_last_audited       ON public.organizations(last_audited_at);
CREATE INDEX IF NOT EXISTS idx_domains_domain_name     ON public.domains(domain_name);

-- 6. RLS for audit pipeline tables (anon can insert; no read from client needed)
ALTER TABLE public.jobs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snapshots        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations  ENABLE ROW LEVEL SECURITY;

-- Service role (used by API routes via supabase-server) bypasses RLS by default.
-- Allow anon insert for jobs initiated from server (supabaseServer uses SERVICE_ROLE key, bypasses RLS)
-- Public cannot read raw audit data — keep private
DROP POLICY IF EXISTS "Public read jobs" ON public.jobs;
DROP POLICY IF EXISTS "Public read job_events" ON public.job_events;

-- 7. Audit result cache — prevents duplicate PSI API calls for same domain within 24h
CREATE TABLE IF NOT EXISTS public.audit_engine_cache (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_name  text        NOT NULL,
  result_json  jsonb       NOT NULL,
  source       text        NOT NULL DEFAULT 'psi', -- 'psi' | 'fallback'
  created_at   timestamptz DEFAULT now(),
  expires_at   timestamptz DEFAULT (now() + INTERVAL '24 hours')
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_cache_domain ON public.audit_engine_cache(domain_name);
CREATE INDEX IF NOT EXISTS idx_audit_cache_expires ON public.audit_engine_cache(expires_at);
ALTER TABLE public.audit_engine_cache ENABLE ROW LEVEL SECURITY;
-- Only service role can read/write cache (via server-side supabaseServer client)

-- DOWN
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS collected_at;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS martech_stack_json;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS security_headers_json;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS safety_flags_json;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS seo_technical_json;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS ai_narrative_summary;
-- ALTER TABLE public.organizations DROP COLUMN IF EXISTS trust_score;
-- ALTER TABLE public.organizations DROP COLUMN IF EXISTS martech_detected_json;
-- ALTER TABLE public.organizations DROP COLUMN IF EXISTS security_status_json;
-- ALTER TABLE public.organizations DROP COLUMN IF EXISTS business_nature_summary;
-- ALTER TABLE public.organizations DROP COLUMN IF EXISTS last_audited_at;
-- DROP TABLE IF EXISTS public.audit_engine_cache;

-- VERIFICATION_SQL
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'snapshots' AND column_name IN ('collected_at','martech_stack_json','safety_flags_json');
-- SELECT tablename FROM pg_tables WHERE tablename = 'audit_engine_cache';

-- ROLLBACK_VERIFICATION
-- SELECT NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'snapshots' AND column_name = 'collected_at');
