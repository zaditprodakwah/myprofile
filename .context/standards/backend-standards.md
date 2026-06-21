# Backend & API Standards

Standards for serverless execution runtimes, Postgres operations, and queue handlers.

## 1. Runtime Configurations
- **Edge Functions:** Build API endpoints that run on the Next.js Edge Runtime in the SIN1 (Singapore) region to ensure low latency.
- **Node.js Containers:** Long-running crawls, sitemap reindexing, or agent runs must be delegated to background queues (Trigger.dev or BullMQ) instead of blocking edge responses.

## 2. PostgreSQL & Database Operations
- **pgvector Integration:** Always store embeddings inside PostgreSQL tables using the `vector` data type. Query vectors using cosine distance operators.
- **LISTEN / NOTIFY Triggers:** Use Postgres triggers and pub/sub connections to notify backend route listeners about row updates in real-time, bypassing polling bottlenecks.
- **Concurrent Queue Locking:** Queue worker select queries must use `SELECT ... FOR UPDATE SKIP LOCKED` to ensure multiple workers never execute the same job.

## 3. Data Integrity & Validation
- **Outbox Pattern:** Maintain database-level transaction integrity. Database updates and their event records must be written inside a single Postgres transaction.
- **Strict Zod Schemas:** Define explicit schemas for all API payloads and database rows.
