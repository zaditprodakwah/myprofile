-- MIGRATION_ID: 01_phase1_core_foundation
-- DEPENDENCIES: NONE
-- BACKWARD_COMPATIBILITY_NOTE: utility_leads is preserved. Schema is additive.

-- UP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Canonical Entity Layer
CREATE TABLE IF NOT EXISTS public.entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('Organization', 'Person', 'Brand', 'Website', 'Product', 'Unknown')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Job Orchestration & Event Sourcing
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(50) NOT NULL,
    target_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'QUEUED', -- Status is projected from job_events
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);

CREATE TABLE IF NOT EXISTS public.audit_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    worker_id VARCHAR(255),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL,
    retry_count INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_audit_runs_job_id ON public.audit_runs(job_id);

CREATE TABLE IF NOT EXISTS public.job_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    aggregate_id UUID,
    aggregate_type VARCHAR(50),
    event_name VARCHAR(100) NOT NULL,
    event_version INTEGER DEFAULT 1,
    payload_json JSONB DEFAULT '{}'::jsonb,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    correlation_id UUID,
    causation_id UUID,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_job_events_job_id ON public.job_events(job_id);

CREATE TABLE IF NOT EXISTS public.job_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    trace_id UUID,
    correlation_id UUID,
    state VARCHAR(50),
    duration_ms INTEGER,
    memory_usage VARCHAR(50),
    queue_latency VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_job_logs_job_id ON public.job_logs(job_id);

-- 3. Snapshots Base
CREATE TABLE IF NOT EXISTS public.snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID REFERENCES public.domains(id) ON DELETE CASCADE,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DOWN
DROP TABLE IF EXISTS public.snapshots CASCADE;
DROP TABLE IF EXISTS public.job_logs CASCADE;
DROP TABLE IF EXISTS public.job_events CASCADE;
DROP TABLE IF EXISTS public.audit_runs CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.domains CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.entities CASCADE;

-- VERIFICATION_SQL
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'job_events'
);

-- ROLLBACK_VERIFICATION
SELECT NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'job_events'
);
