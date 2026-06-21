# Platform Architecture Standards

Standards for structural layout, routing boundaries, and system integration.

## 1. Hexagonal Ports & Adapters
- **Dependency Isolation:** The core business domain must be decoupled from specific libraries or database clients (e.g., Supabase SDK).
- **Interface Mappings:** Define core features as Ports (interfaces) and write Adapters (concrete wrappers) to communicate with external databases and APIs.

## 2. Routing & Caching
- **Routing Structure:** Lowercase hyphenated slugs with no trailing slashes.
- **Cache Invalidation:** Use Incremental Static Regeneration (ISR) with cache validation tags. Purge page caches dynamically when database tables are updated.
- **AI Crawler Gateway:** Edge middleware must detect user-agents and intercept AI bots (like GPTBot, ClaudeBot) to serve lightweight, search-optimized Markdown (`llms.txt`).
