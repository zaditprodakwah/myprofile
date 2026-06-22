-- MIGRATION_ID: 20260622014500_fix_source_api
-- PURPOSE: Drop NOT NULL constraint on source_api column of reference_items table
-- BACKWARD_COMPATIBILITY_NOTE: Additive/corrective

ALTER TABLE public.reference_items 
  ALTER COLUMN source_api DROP NOT NULL;
