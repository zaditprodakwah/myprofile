# Awesome Resources: BACKEND ARCHITECTURE

Curated guides, databases, event routing protocols, and workflow engines.

## Curated Databases & Engines

### 1. pgvector (PostgreSQL Vector Search)
- **URL:** [pgvector docs](https://github.com/pgvector/pgvector)
- **Why Chosen:** Native postgres vector similarity searches. Avoids the complexity of standalone vector DBs.
- **When to Use:** Storing and searching entity embeddings, semantic match queries, and memory retrieval.

### 2. TimescaleDB (Time-series Extensions)
- **URL:** [Timescale Docs](https://docs.timescale.com)
- **Why Chosen:** Optimizes storage and query speed for high-volume logs, event streams, and audit metrics.
- **When to Use:** Storing time-series logs and audit execution metrics.

### 3. Trigger.dev & Inngest
- **URL:** [Trigger.dev](https://trigger.dev) / [Inngest](https://www.inngest.com)
- **Why Chosen:** Event-driven, serverless execution queues that avoid cold starts and long-running server billing.
- **When to Use:** Processing async crawls, reindexing routes, and executing AI worker DAGs.
