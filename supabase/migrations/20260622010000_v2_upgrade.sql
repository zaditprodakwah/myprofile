-- MIGRATION_ID: 20260622010000_v2_upgrade
-- PURPOSE: Tambah kolom/tabel untuk fitur v2: audit history, reading_time, view_count
-- BACKWARD_COMPATIBILITY_NOTE: Additive only

-- UP
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS reading_time    int           DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count      int           DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_agc          boolean       DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_image  text,
  ADD COLUMN IF NOT EXISTS seo_json        jsonb         DEFAULT '{}'::jsonb;

-- Tabel tags artikel
CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id  uuid    NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag         text    NOT NULL,
  PRIMARY KEY (article_id, tag)
);

-- Saved audits (untuk riwayat pengguna)
CREATE TABLE IF NOT EXISTS public.saved_audits (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email   text        NOT NULL,
  domain       text        NOT NULL,
  accessibility_score int  DEFAULT 0,
  seo_score          int  DEFAULT 0,
  performance_score  int  DEFAULT 0,
  composite_score    int  DEFAULT 0,
  recommendations_json jsonb DEFAULT '[]'::jsonb,
  created_at   timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_saved_audits_user ON public.saved_audits(user_email);

-- Telemetry Page View (privacy-first, cookie-less)
CREATE TABLE IF NOT EXISTS public.page_views (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  path        text        NOT NULL,
  referrer    text,
  country     text,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON public.page_views(created_at);

-- Admin Activity Log
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  action      text        NOT NULL,
  target_type text,
  target_id   text,
  metadata    jsonb       DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now()
);

-- RLS Configuration
ALTER TABLE public.article_tags  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_audits  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs    ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "public read article_tags" ON public.article_tags FOR SELECT USING (true);
CREATE POLICY "anyone can insert saved_audits" ON public.saved_audits FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can view saved_audits" ON public.saved_audits FOR SELECT USING (true);
CREATE POLICY "anon insert page_views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "admin select page_views" ON public.page_views FOR SELECT USING (true);
CREATE POLICY "admin select admin_logs" ON public.admin_logs FOR SELECT USING (true);
