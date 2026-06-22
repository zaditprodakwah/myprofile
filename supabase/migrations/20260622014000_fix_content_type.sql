-- MIGRATION_ID: 20260622014000_fix_content_type
-- PURPOSE: Fix type of reference_items.content from JSONB to TEXT before seeds run
-- BACKWARD_COMPATIBILITY_NOTE: Additive/corrective

ALTER TABLE public.reference_items 
  ALTER COLUMN content TYPE TEXT USING content::text;
