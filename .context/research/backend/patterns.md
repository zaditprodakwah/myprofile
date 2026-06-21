# Design & Implementation Patterns: BACKEND ARCHITECTURE

Design patterns for scalable, resilient, and event-sourced backends.

## Recommended Patterns

### 1. Transactional Outbox Pattern
- **Description:** Write database updates and their corresponding event payloads inside a single ACID database transaction.
- **Why it matters:** Guarantees that the event log always matches database state, even during network drops.
- **Implementation:** Write event rows to an `outbox_events` table, and have an async worker process them.

### 2. Postgres LISTEN / NOTIFY Pub-Sub
- **Description:** Database triggers notify Node.js processes about row changes instantly.
- **Why it matters:** Avoids continuous polling to detect new queue items.
- **Implementation:** Execute `NOTIFY table_update, 'payload'` in a DB trigger, and listen on the connection socket in Node.js.

### 3. Advisory Locks & SKIP LOCKED Queueing
- **Description:** Safe concurrent processing of queue items by multiple workers.
- **Why it matters:** Prevents multiple workers from grabbing the same job.
- **Implementation:** Use SQL `SELECT * FROM jobs WHERE status = 'pending' FOR UPDATE SKIP LOCKED LIMIT 1`.
