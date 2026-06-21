-- Resolves the collision between Phase 1 Core 'entities' and Phase 5 Directory 'entities'

-- 1. Create Intelligence Entities
CREATE TABLE IF NOT EXISTS public.intelligence_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL DEFAULT 'Unknown' CHECK (type IN ('Organization', 'Person', 'Brand', 'Website', 'Product', 'Unknown')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Move constraints from organizations and domains to intelligence_entities
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'organizations_entity_id_fkey') THEN
        ALTER TABLE public.organizations DROP CONSTRAINT organizations_entity_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'domains_entity_id_fkey') THEN
        ALTER TABLE public.domains DROP CONSTRAINT domains_entity_id_fkey;
    END IF;
END $$;

-- If entities has 'type', it's from Phase 1. Copy over.
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'entities' AND column_name = 'type') THEN
        INSERT INTO public.intelligence_entities (id, type, created_at)
        SELECT id, type, created_at FROM public.entities
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Add constraints if tables exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organizations') THEN
        ALTER TABLE public.organizations ADD CONSTRAINT organizations_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.intelligence_entities(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'domains') THEN
        ALTER TABLE public.domains ADD CONSTRAINT domains_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.intelligence_entities(id) ON DELETE CASCADE;
    END IF;
END $$;


-- 2. Create Directory Entities
CREATE TABLE IF NOT EXISTS public.directory_entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  city_slug TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('individual','institution','agency','brand','product','service')),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  logo_url TEXT,
  address TEXT,
  google_maps_url TEXT,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified','claimed','verified')),
  trust_score REAL DEFAULT 0.0,
  affiliate_url TEXT,
  claim_token TEXT,
  raw_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Re-point directory_leads
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'directory_leads_entity_id_fkey') THEN
        ALTER TABLE public.directory_leads DROP CONSTRAINT directory_leads_entity_id_fkey;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'entities' AND column_name = 'city_slug') THEN
        INSERT INTO public.directory_entities (id, city_id, city_slug, entity_type, name, slug, tagline, description, contact_phone, contact_email, website_url, logo_url, address, google_maps_url, verification_status, trust_score, affiliate_url, claim_token, raw_metadata, created_at)
        SELECT id, city_id, city_slug, entity_type, name, slug, tagline, description, contact_phone, contact_email, website_url, logo_url, address, google_maps_url, verification_status, trust_score, affiliate_url, claim_token, raw_metadata, created_at FROM public.entities
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'directory_leads') THEN
        ALTER TABLE public.directory_leads ADD CONSTRAINT directory_leads_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.directory_entities(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes for directory_entities
CREATE INDEX IF NOT EXISTS idx_directory_entities_slug ON public.directory_entities(slug);
CREATE INDEX IF NOT EXISTS idx_directory_entities_city ON public.directory_entities(city_slug, verification_status);

-- Enable RLS for directory_entities
ALTER TABLE public.directory_entities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read directory_entities" ON public.directory_entities;
CREATE POLICY "Public read directory_entities" ON public.directory_entities FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Enable ALL for authenticated directory_entities" ON public.directory_entities;
CREATE POLICY "Enable ALL for authenticated directory_entities" ON public.directory_entities FOR ALL TO authenticated USING (true);

-- Enable RLS for intelligence_entities
ALTER TABLE public.intelligence_entities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read intelligence_entities" ON public.intelligence_entities;
CREATE POLICY "Public read intelligence_entities" ON public.intelligence_entities FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Enable ALL for authenticated intelligence_entities" ON public.intelligence_entities;
CREATE POLICY "Enable ALL for authenticated intelligence_entities" ON public.intelligence_entities FOR ALL TO authenticated USING (true);

-- Drop the old entities table
DROP TABLE IF EXISTS public.entities CASCADE;
