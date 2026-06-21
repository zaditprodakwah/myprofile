# Libraries & Packages: BACKEND ARCHITECTURE

Curation of backend runtimes, libraries, and frameworks.

## Library Registry

### 1. Hono Web Framework
- **Package:** `hono`
- **Stars:** ~21,500
- **License:** MIT License
- **Usage Rationale:** Lightweight, ultra-fast web framework for Edge runtimes (Vercel Edge, Cloudflare Workers).
- **When to Use:** Building API endpoints that must resolve in milliseconds globally.

### 2. Effect TS
- **Package:** `@effect/io`
- **Usage Rationale:** Advanced TypeScript toolkit for structured concurrency, dependency injection, and error handling.
- **When to Use:** Complex pipelines that require strict error types and concurrency safety.
- **When Not to Use:** Simple CRUD routing modules.

### 3. BullMQ
- **Package:** `bullmq`
- **Usage Rationale:** Redis-backed message queue for heavy job processing.
- **When to Use:** Managing long-running backend processes under dedicated servers.
