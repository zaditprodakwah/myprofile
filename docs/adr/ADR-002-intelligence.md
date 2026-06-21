# ADR 002: Website Intelligence Layer

**Date:** 2026-06-21
**Status:** Approved

## Context
PresenceOS is moving from Phase 1 (Core Foundation) to Phase 2, which focuses on extracting value from digital properties. The system needs to run Lighthouse audits, score the results, and provide recommendations. This process must be scalable, reproducible, and deterministic.

## Decision

### 1. Worker-Based Intelligence Separation
- **Decision:** All website audit processes are moved to an asynchronous worker system.
- **Reason:** To avoid blocking API ingestion and allow horizontal scaling.
- **Consequences:** The API only emits an `AuditRequested` event and does not perform synchronous processing.

### 2. Rule-Based Scoring First (No LLM Dependency)
- **Decision:** All scoring must be deterministic (rule engine).
- **Reason:** Reproducibility, auditability, cost efficiency.
- **Consequences:** LLMs are only used in Phase 3+ for enrichment, not scoring. Scoring logic must be reproducible without an LLM.

### 3. Snapshot as Immutable Analytical Artifact
- **Decision:** `snapshots` become an immutable record per audit run.
- **Reason:** Allows time-series analysis and rollback state reconstruction.
- **Consequences:** No `UPDATE` on snapshots, only `INSERT` of versioned records.

### 4. Separation of Collector vs Analyzer
- **Decision:** Separate the Collector Worker (fetches raw data) from the Analyzer Engine (scores and recommends).
- **Reason:** Clean separation of concerns for scaling the pipeline.
