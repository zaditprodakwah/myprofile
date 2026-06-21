# GitHub Repositories: BACKEND ARCHITECTURE

Reverse engineering of production backends, serverless platforms, and transactional ORMs.

## Repository Directory

### 1. Supabase Core Service Layer
- **Repository:** [supabase/supabase](https://github.com/supabase/supabase)
- **Usage Rationale:** Best reference for setting up Postgres partitions, logical replication triggers, and Row-Level Security (RLS) policies.
- **How to Use:** Leverage their SQL pattern definitions for secure user tables and audit logs.

### 2. Drizzle ORM
- **Repository:** [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm)
- **Stars:** ~34,000
- **Usage Rationale:** Lightweight, type-safe database mapping layer. Allows direct SQL access with no overhead.

### 3. Mastra AI Framework
- **Repository:** [mastra-ai/mastra](https://github.com/mastra-ai/mastra)
- **Stars:** ~22,000
- **License:** Apache-2.0 / Enterprise Source-Available
- **Usage Rationale:** Highly modular TypeScript framework for multi-agent execution, tool registries, and evaluations.
- **When to Use:** Building custom server-side agents, graph memory retrieval, and LLM orchestration.
