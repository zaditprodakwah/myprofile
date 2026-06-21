# Event Sourcing & Ledger Standards

Standards for append-only transaction logs and credit auditing.

## 1. Event Log Immutability
- **No Mutations:** Event log rows (`audit_events` table) must never be updated or deleted once written.
- **ACID Ledger:** Financial balances are derived by calculating chronological sums of the `credit_transactions` ledger. Do not update balances directly.

## 2. Event Replay Projection Builder
- **Replay Handlers:** Write functions that can parse the historical event log from scratch to rebuild read databases or statistics views when schemas change.
