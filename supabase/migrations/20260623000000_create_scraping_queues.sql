-- MIGRATION: create_scraping_queues
-- DESC: Adds scraping_queues table for Entity Command Center and updates crawl_queue

-- 1. scraping_queues
CREATE TABLE IF NOT EXISTS public.scraping_queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_query TEXT NOT NULL,
    location TEXT,
    niche TEXT,
    priority INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    progress_log JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scraping_queues_status ON public.scraping_queues(status);
CREATE INDEX IF NOT EXISTS idx_scraping_queues_priority ON public.scraping_queues(priority);

-- Automatically update updated_at
CREATE OR REPLACE FUNCTION update_scraping_queues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_scraping_queues_updated_at ON public.scraping_queues;
CREATE TRIGGER trigger_update_scraping_queues_updated_at
BEFORE UPDATE ON public.scraping_queues
FOR EACH ROW EXECUTE FUNCTION update_scraping_queues_updated_at();


-- 2. Update crawl_queue (which was created in 03_phase3_entity_graph)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'crawl_queue' AND column_name = 'priority') THEN
        ALTER TABLE public.crawl_queue ADD COLUMN priority INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'crawl_queue' AND column_name = 'last_crawled_at') THEN
        ALTER TABLE public.crawl_queue ADD COLUMN last_crawled_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'crawl_queue' AND column_name = 'source_id') THEN
        -- Assuming source_id could be a UUID referencing a feed or source table if it exists, otherwise just UUID
        ALTER TABLE public.crawl_queue ADD COLUMN source_id UUID;
    END IF;
END $$;
