-- MIGRATION_ID: 03_phase3_entity_graph
-- DEPENDENCIES: 02_phase2_website_intelligence
-- BACKWARD_COMPATIBILITY_NOTE: Additive only. No existing tables are modified.

-- UP

-- 1. entity_nodes
CREATE TABLE IF NOT EXISTS public.entity_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canonical_id UUID REFERENCES public.entity_nodes(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_canonical_id_self_referential CHECK (canonical_id IS NULL OR canonical_id = id)
);
CREATE INDEX IF NOT EXISTS idx_entity_nodes_canonical_id ON public.entity_nodes(canonical_id);
CREATE INDEX IF NOT EXISTS idx_entity_nodes_type ON public.entity_nodes(entity_type);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_canonical_root ON public.entity_nodes(canonical_id) WHERE canonical_id = id;

-- Canonical Mutation Lock Trigger (Patch 6)
CREATE OR REPLACE FUNCTION prevent_canonical_id_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.canonical_id IS DISTINCT FROM OLD.canonical_id THEN
        RAISE EXCEPTION 'DRIFT_VIOLATION: Direct updates to canonical_id are forbidden. Use EntityResolved event.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_canonical_mutation_lock
BEFORE UPDATE ON public.entity_nodes
FOR EACH ROW EXECUTE FUNCTION prevent_canonical_id_update();

-- 2. entity_edge_types
CREATE TABLE IF NOT EXISTS public.entity_edge_types (
    type_id VARCHAR(50) PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    weight_default INTEGER DEFAULT 1
);
-- Pre-seed some edge types
INSERT INTO public.entity_edge_types (type_id, name, description, weight_default) VALUES 
('OWNS_DOMAIN', 'Owns Domain', 'Entity owns the specified domain', 100),
('MENTIONS_ENTITY', 'Mentions Entity', 'Entity mentions another entity', 10),
('SUBSIDIARY_OF', 'Subsidiary Of', 'Entity is a subsidiary of another entity', 80)
ON CONFLICT DO NOTHING;

-- 3. entity_edges
CREATE TABLE IF NOT EXISTS public.entity_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_entity_id UUID NOT NULL REFERENCES public.entity_nodes(id) ON DELETE CASCADE,
    to_entity_id UUID NOT NULL REFERENCES public.entity_nodes(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL REFERENCES public.entity_edge_types(type_id) ON DELETE RESTRICT,
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    rule_id TEXT NOT NULL,
    graph_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_entity_edges UNIQUE (from_entity_id, to_entity_id, relationship_type)
);
CREATE INDEX IF NOT EXISTS idx_entity_edges_from ON public.entity_edges(from_entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_edges_to ON public.entity_edges(to_entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_edges_hash ON public.entity_edges(graph_hash);

-- 4. entity_mentions
CREATE TABLE IF NOT EXISTS public.entity_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_url TEXT NOT NULL,
    content_snippet TEXT,
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. entity_merge_history
CREATE TABLE IF NOT EXISTS public.entity_merge_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_entity_id UUID NOT NULL,
    to_canonical_id UUID NOT NULL,
    rule_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_merge_history_from ON public.entity_merge_history(from_entity_id);
CREATE INDEX IF NOT EXISTS idx_merge_history_to ON public.entity_merge_history(to_canonical_id);

-- 6. crawl_queue
CREATE TABLE IF NOT EXISTS public.crawl_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_url TEXT NOT NULL,
    normalized_url TEXT NOT NULL,
    depth INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_crawl_queue_target UNIQUE (normalized_url, depth)
);
CREATE INDEX IF NOT EXISTS idx_crawl_queue_status ON public.crawl_queue(status);

-- 7. event_sequence addition to job_events (Assuming job_events exists from Phase 1)
-- Check if job_events table exists to safely alter it
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'job_events') THEN
        -- Add sequence only if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'job_events' AND column_name = 'event_sequence') THEN
            ALTER TABLE public.job_events ADD COLUMN event_sequence BIGSERIAL;
        END IF;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_job_events_aggregate_sequence ON public.job_events(aggregate_id, event_sequence);

-- 8. entity_graph_view (Materialized View)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.entity_graph_view AS
SELECT 
    e.id AS edge_id,
    e.from_entity_id,
    f.entity_type AS from_type,
    e.to_entity_id,
    t.entity_type AS to_type,
    e.relationship_type,
    e.confidence_score,
    e.graph_hash,
    e.rule_id
FROM public.entity_edges e
JOIN public.entity_nodes f ON e.from_entity_id = f.id
JOIN public.entity_nodes t ON e.to_entity_id = t.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_entity_graph_view_edge_id ON public.entity_graph_view(edge_id);


-- -- DOWN
-- DROP MATERIALIZED VIEW IF EXISTS public.entity_graph_view;
-- DROP TABLE IF EXISTS public.crawl_queue CASCADE;
-- DROP TABLE IF EXISTS public.entity_merge_history CASCADE;
-- DROP TABLE IF EXISTS public.entity_mentions CASCADE;
-- DROP TABLE IF EXISTS public.entity_edges CASCADE;
-- DROP TABLE IF EXISTS public.entity_edge_types CASCADE;
-- DROP TABLE IF EXISTS public.entity_nodes CASCADE;
-- 
-- -- Note: We don't drop event_sequence from job_events in DOWN to avoid data loss if other things rely on it.
-- 
-- -- VERIFICATION_SQL
-- SELECT EXISTS (
--     SELECT FROM information_schema.tables 
--     WHERE table_schema = 'public' 
--     AND table_name = 'entity_nodes'
-- );
-- 
-- -- ROLLBACK_VERIFICATION
-- SELECT NOT EXISTS (
--     SELECT FROM information_schema.tables 
--     WHERE table_schema = 'public' 
--     AND table_name = 'entity_nodes'
-- );
