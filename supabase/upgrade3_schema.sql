-- Upgrade 3.0 Complete Blueprint
-- Note: This script ensures all base tables and expansions are present.

-- 0) Core Base Tables
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  segment text NOT NULL CHECK (segment IN ('marketing', 'academic', 'business', 'neutral')),
  goal text,
  challenges text,
  urgency text CHECK (urgency IN ('today','this_week','this_month','flexible')),
  budget_range text,
  deadline_date date,
  full_name text NOT NULL,
  email text,
  whatsapp text,
  company text,
  role text,
  source text,
  campaign text,
  referrer text,
  landing_path text,
  lead_score int DEFAULT 0,
  lead_tier text,
  routing text,
  status text DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','closed','ignored')),
  notes text
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  session_id text,
  event_name text NOT NULL,
  segment text,
  path text,
  referrer text,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL UNIQUE,
  segment text,
  status text DEFAULT 'active'
);


-- 1) Industries Table
CREATE TABLE IF NOT EXISTS industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  priority int DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 2) Problems Table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_slug text REFERENCES industries(slug) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  problem_statement text[] DEFAULT '{}',
  root_causes text[] DEFAULT '{}',
  solution_framework jsonb DEFAULT '{}',
  faq jsonb DEFAULT '[]',
  symptom_queries text[] DEFAULT '{}',
  solution_summary text,
  recommended_services text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 3) Tools Table
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,
  description text,
  category text NOT NULL,
  sub_category text,
  pricing_model text,
  website_url text NOT NULL,
  affiliate_url text,
  logo_url text,
  og_image_url text,
  features text[] DEFAULT '{}',
  use_cases text[] DEFAULT '{}',
  pros text[] DEFAULT '{}',
  cons text[] DEFAULT '{}',
  rating decimal(3,2) DEFAULT 4.5,
  is_featured boolean DEFAULT false,
  is_sponsored boolean DEFAULT false,
  sponsor_weight int DEFAULT 0,
  sponsored_until timestamptz,
  priority int DEFAULT 0,
  status text DEFAULT 'active',
  seo_title text,
  seo_description text,
  keywords text[] DEFAULT '{}',
  schema_type text DEFAULT 'SoftwareApplication',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4) Radar Sources Table
CREATE TABLE IF NOT EXISTS radar_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  site_url text,
  type text, -- 'rss', 'api', etc.
  tier int DEFAULT 3, -- 1, 2, 3
  priority int DEFAULT 0,
  enabled boolean DEFAULT true,
  max_items_per_day int DEFAULT 5,
  language text DEFAULT 'en',
  country text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 5) Radar Items (Core + Expansion)
CREATE TABLE IF NOT EXISTS radar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  source_name text NOT NULL,
  title text NOT NULL,
  url text NOT NULL UNIQUE,
  published_at timestamptz,
  summary text,
  tags text[] DEFAULT '{}'
);

ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS source_slug text REFERENCES radar_sources(slug);
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS canonical_url text;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS author text;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS hash text UNIQUE;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS signal_score int DEFAULT 0;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS why_it_matters text;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS takeaway text;
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS recommended_solutions jsonb DEFAULT '[]';
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS recommended_tools jsonb DEFAULT '[]';
ALTER TABLE radar_items ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 6) Affiliate Clicks Table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  tool_id uuid REFERENCES tools(id),
  tool_slug text,
  page_path text,
  mode text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_hash text,
  user_agent text
);

-- 7) RLS Policies (Basic enabled for all)
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE radar_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access to industries" ON industries FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to tools" ON tools FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to radar_sources" ON radar_sources FOR SELECT USING (true);
CREATE POLICY "Allow service-role to manage everything" ON industries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service-role to manage problems" ON problems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service-role to manage tools" ON tools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service-role to manage radar_sources" ON radar_sources FOR ALL USING (true) WITH CHECK (true);
