# ADR 001: Core Foundation & Database Strategy

**Date:** 2026-06-21
**Status:** Approved

## Context
PresenceOS needs a stable, scalable, and manageable database layer. The current codebase uses raw Supabase Client (`@supabase/supabase-js`) accessing tables like `utility_leads`. The original blueprint suggested Prisma. There is also a need for tracking audit runs reliably without losing data.

## Decision
1. **No Prisma:** We will strictly use Supabase PostgreSQL with raw SQL DDL migrations.
2. **Backward Compatibility (Additive):** We will retain `utility_leads` as an acquisition/ingestion log. It will act as the top of the funnel.
3. **Canonical Entities:** We introduce an `entities` hierarchy where `organizations`, `domains`, and other properties derive their identity.
4. **Job Orchestration Separation:** We will separate `jobs` (the overall lifecycle) from `audit_runs` (a single execution attempt) and use `job_events` as an append-only Event Store.

## Consequences
- Migrations must explicitly define `UP`, `DOWN`, `VERIFICATION_SQL`, and `ROLLBACK_VERIFICATION`.
- State is derived from events, meaning `jobs` table status columns are projections of `job_events`.
- Developers must not mutate state directly; they must emit events.
