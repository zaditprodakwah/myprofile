# Anti-Patterns to Avoid: BACKEND ARCHITECTURE

Pitfalls and traps in serverless and database-centric backends.

## Critical Pitfalls

### 1. Mutable Balances in Credit Ledgers
- **Trap:** Updating database column balances directly (e.g., `UPDATE users SET balance = balance - 10`).
- **Consequence:** Race conditions and database locking can lead to double spending or negative balances.
- **Remedy:** Enforce an append-only transaction ledger (`INSERT INTO transactions ...`) and use triggers to calculate derived balances.

### 2. Monolithic Server Routines on Edge Runtimes
- **Trap:** Performing long database transactions or nested queries inside Vercel Edge functions.
- **Consequence:** Edge functions timeout (10-30s limits), leading to failed API requests.
- **Remedy:** Delegate heavy jobs to background task workers (Trigger.dev or BullMQ).

### 3. Shared Database State in Microservices
- **Trap:** Allowing different services to query and write to the same table partitions directly.
- **Consequence:** Tight coupling, schema upgrades break multiple services.
- **Remedy:** Force services to communicate strictly via event messages or API endpoints.
