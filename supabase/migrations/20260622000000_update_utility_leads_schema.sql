-- Update utility_leads to match frontend schema expectations

ALTER TABLE public.utility_leads
ADD COLUMN IF NOT EXISTS lead_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS target_site_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS audit_category VARCHAR(100),
ADD COLUMN IF NOT EXISTS accessibility_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS narrative_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PENDING';

-- Copy over any old target_domain values if they exist and target_site_url is null
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='utility_leads' AND column_name='target_domain'
  ) THEN
    EXECUTE 'UPDATE public.utility_leads SET target_site_url = target_domain WHERE target_site_url IS NULL AND target_domain IS NOT NULL';
  END IF;
END $$;

-- Fix RLS policy so the API can fetch recent audits using the anon key
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.utility_leads;
CREATE POLICY "Enable read for anonymous users" ON public.utility_leads
    FOR SELECT USING (true);

