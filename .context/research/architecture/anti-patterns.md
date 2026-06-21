# Anti-Patterns to Avoid: SYSTEM ARCHITECTURE

Architectural pitfalls that limit system portability and scalability.

## Critical Pitfalls

### 1. Hard Coupling to Supabase Client
- **Trap:** Importing the supabase client library directly inside core business modules.
- **Consequence:** Moving away from Supabase or migrating to another database engine requires rebuilding all modules.
- **Remedy:** Wrap Supabase database actions inside clean adapter ports.

### 2. Sync Event Processing Loops
- **Trap:** Forcing client API requests to block and wait until all side-effects (indexing, scraping, analytics logging) complete.
- **Consequence:** Requests take seconds to complete, raising rates of client dropouts.
- **Remedy:** Emit events to the background outbox database and return status `202 Accepted` to the client instantly.
