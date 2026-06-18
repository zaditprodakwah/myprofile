CREATE TABLE IF NOT EXISTS public.utility_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_domain VARCHAR(255) NOT NULL,
    lead_contact VARCHAR(255) NOT NULL,
    diagnostic_raw JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS settings (optional, but good practice. For now just enabling access if required)
ALTER TABLE public.utility_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (as leads might be submitted from public site)
CREATE POLICY "Enable insert for anonymous users" ON public.utility_leads
    FOR INSERT WITH CHECK (true);

-- Only authenticated admins can read
CREATE POLICY "Enable read for authenticated users only" ON public.utility_leads
    FOR SELECT USING (auth.role() = 'authenticated');
