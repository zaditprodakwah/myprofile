# Design & Implementation Patterns: SYSTEM ARCHITECTURE

Structural patterns for enterprise software architecture.

## Recommended Patterns

### 1. Event Replay Projection Builder
- **Description:** Process all past events to rebuild a read-database from scratch (e.g. if schemas change or new columns are added).
- **Implementation:** Query event log tables chronologically, feed events through projection handlers, and write state objects to read tables.

### 2. Hexagonal Ports Definition
- **Description:** Standardize external resources via abstract interfaces.
- **Implementation:** Define a `DbPort` interface. Create concrete implementations like `DrizzleDbAdapter` and `SupabaseDbAdapter`.
