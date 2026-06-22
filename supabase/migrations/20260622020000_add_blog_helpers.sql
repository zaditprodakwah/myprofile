-- MIGRATION_ID: 20260622020000_add_blog_helpers
-- PURPOSE: Add view_count to reference_items and functions to increment views
-- BACKWARD_COMPATIBILITY_NOTE: Additive only

-- UP
ALTER TABLE public.reference_items
  ADD COLUMN IF NOT EXISTS view_count int DEFAULT 0;

-- Function to increment article views
CREATE OR REPLACE FUNCTION public.increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE public.articles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment reference views
CREATE OR REPLACE FUNCTION public.increment_reference_views(ref_slug text)
RETURNS void AS $$
BEGIN
  UPDATE public.reference_items
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = ref_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
