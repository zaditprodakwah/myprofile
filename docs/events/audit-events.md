# Event Contract: Audit Events

## Concept
All state transitions in the Audit Job are driven by Domain Events appended to the `job_events` Event Store.

## Base Schema (job_events Table)
- `id` (UUID)
- `job_id` (UUID)
- `aggregate_id` (UUID)
- `aggregate_type` (String)
- `event_name` (String)
- `event_version` (Integer)
- `payload_json` (JSONB)
- `metadata_json` (JSONB)
- `correlation_id` (UUID)
- `causation_id` (UUID)
- `occurred_at` (Timestamp)

## Event Definitions

### 1. AuditRequested
- **Description:** Emitted when a user submits a domain.
- **Producer:** `/api/v2/ingest`
- **Consumer:** Job Orchestrator (Worker)
- **Schema:** `{ target_url: string, source: string, lead_id: uuid }`
- **Idempotency:** Hash of target_url + date.

### 2. AuditValidated
- **Description:** Emitted when URL resolves to an entity.
- **Producer:** Job Orchestrator
- **Consumer:** Audit Pipeline
- **Schema:** `{ entity_id: uuid, domain_id: uuid }`

### 3. DiscoveryCompleted
- **Description:** Autonomous discovery finished finding targets.
- **Producer:** Discovery Engine
- **Consumer:** Job Orchestrator
- **Schema:** `{ sitemap_found: boolean, paths_discovered: string[] }`

### 4. AuditStarted
- **Description:** Active collection begins.
- **Producer:** Job Orchestrator
- **Consumer:** Collector Pipeline

### 5. AuditCollected
- **Description:** Raw data has been collected by the worker.
- **Producer:** Collector Worker
- **Consumer:** Analyzer Engine
- **Schema:** `{ job_id: uuid, snapshot_id: uuid, lighthouse_metrics: {} }`

### 6. SnapshotNormalized
- **Description:** Raw data parsed into canonical schema.
- **Producer:** Analyzer Engine
- **Consumer:** Scoring Engine
- **Schema:** `{ snapshot_id: uuid }`

### 7. ScoreComputed
- **Description:** Deterministic rule-based score computed.
- **Producer:** Scoring Engine
- **Consumer:** Recommendation Engine
- **Schema:** `{ snapshot_id: uuid, scores: { performance: number, seo: number, ... } }`

### 8. RecommendationGenerated
- **Description:** Rule engine generated actionable insights.
- **Producer:** Recommendation Engine
- **Consumer:** Persistence Pipeline / Publisher

### 9. DirectoryPublished
- **Description:** SEO page generated and directory updated.
- **Producer:** Publishing Pipeline
- **Consumer:** Notification Service

### 10. AuditCompleted
- **Description:** Entire flow finished.
- **Producer:** Job Orchestrator
- **Consumer:** Analytics Service
