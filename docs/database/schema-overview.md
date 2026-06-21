# Database Schema Overview

## Governance
- **SQL-First:** All modifications are done via explicit SQL migrations in `supabase/migrations/`.
- **Additive Migrations Only:** No columns or tables dropped without extensive deprecation planning.
- **Backward Compatibility:** Existing tables (`utility_leads`) remain operational.

## Phase 1 Core Tables

### Entity Identity Layer
- `entities` - Base canonical identity table.
- `organizations` - Sub-entity for business profiles.
- `domains` - Canonical domain mapping to an organization.

### Job Orchestration & Event Sourcing
- `jobs` - High-level orchestrator lifecycle.
- `audit_runs` - Granular execution attempts of a job (for tracking retries and failures).
- `job_events` - Append-only Event Store capturing state transitions.
- `job_logs` - Structured logging for observability errors.

### Intelligence Layer
- `snapshots` - Immutable point-in-time capture of domain metrics. Added fields for `lighthouse_json`, `seo_metrics_json`, etc.
- `scores` - Detailed deterministic scores (Performance, SEO, A11y, Best Practices, Composite).
- `recommendations` - Rule-based actionable insights linked to a snapshot.

## Migration Structure
Every SQL migration script strictly follows this layout:
```sql
-- MIGRATION_ID: ...
-- DEPENDENCIES: ...
-- BACKWARD_COMPATIBILITY_NOTE: ...

-- UP
...
-- DOWN
...
-- VERIFICATION_SQL
...
-- ROLLBACK_VERIFICATION
...
```
