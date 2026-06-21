-- MIGRATION_ID: 02_phase2_website_intelligence
-- DEPENDENCIES: 01_phase1_core_foundation
-- BACKWARD_COMPATIBILITY_NOTE: Purely additive. Enhances snapshots and adds scores/recommendations.

-- UP

-- 1. SNAPSHOTS ENHANCEMENT
ALTER TABLE public.snapshots ADD COLUMN IF NOT EXISTS lighthouse_json JSONB;
ALTER TABLE public.snapshots ADD COLUMN IF NOT EXISTS seo_metrics_json JSONB;
ALTER TABLE public.snapshots ADD COLUMN IF NOT EXISTS accessibility_metrics_json JSONB;
ALTER TABLE public.snapshots ADD COLUMN IF NOT EXISTS performance_metrics_json JSONB;
ALTER TABLE public.snapshots ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL;

-- 2. SCORES TABLE
CREATE TABLE IF NOT EXISTS public.scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_id UUID REFERENCES public.snapshots(id) ON DELETE CASCADE,
    performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
    seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
    accessibility_score INTEGER CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
    best_practices_score INTEGER CHECK (best_practices_score >= 0 AND best_practices_score <= 100),
    composite_score INTEGER CHECK (composite_score >= 0 AND composite_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_scores_snapshot_id ON public.scores(snapshot_id);

-- 3. RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_id UUID REFERENCES public.snapshots(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    action_items JSONB DEFAULT '[]'::jsonb,
    rule_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_recommendations_snapshot_id ON public.recommendations(snapshot_id);


-- -- DOWN
-- DROP TABLE IF EXISTS public.recommendations CASCADE;
-- DROP TABLE IF EXISTS public.scores CASCADE;
-- 
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS lighthouse_json;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS seo_metrics_json;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS accessibility_metrics_json;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS performance_metrics_json;
-- ALTER TABLE public.snapshots DROP COLUMN IF EXISTS job_id;
-- 
-- -- VERIFICATION_SQL
-- SELECT EXISTS (
--     SELECT FROM information_schema.tables 
--     WHERE table_schema = 'public' 
--     AND table_name = 'scores'
-- );
-- 
-- -- ROLLBACK_VERIFICATION
-- SELECT NOT EXISTS (
--     SELECT FROM information_schema.tables 
--     WHERE table_schema = 'public' 
--     AND table_name = 'scores'
-- );
