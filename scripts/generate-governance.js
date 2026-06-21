const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '../.context');

// Helper to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDir(path.join(BASE_DIR, 'standards'));
ensureDir(path.join(BASE_DIR, 'checklists'));
ensureDir(path.join(BASE_DIR, 'playbooks'));
ensureDir(path.join(BASE_DIR, 'templates'));
ensureDir(path.join(BASE_DIR, 'prompts'));

// --- GENERATE STANDARDS ---

const standards = {
  'frontend-standards.md': `# Frontend & UI Development Standards

Standards for building responsive, premium, high-density, and keyboard-first Intelligence Consoles.

## 1. Layout & Information Architecture
- **Console Layout:** Use split-pane grids (using \`react-resizable-panels\`) with persistent drawer inspectors on the right panel.
- **Visual Density:** Design layouts with compact margins and borders, maximizing data readability for observability.
- **Global Navigation:** Implement a dual sidebar layout similar to Supabase Studio. Global navigation rail on the left (icons only), collapsible tree explorer on the sub-sidebar.
- **Universal Search:** Integrate a Cmd+K command palette via \`cmdk\`. All platform routes and core database entity models must be searchable from the palette.

## 2. Component Design & Keyboard-First UX
- **Keyboard Navigation:** Every dashboard panel must support keyboard shortcut actions (e.g., \`Esc\` to close drawers, \`Arrow keys\` to move focus on grid tables).
- **Virtualization:** All tables containing more than 50 rows must use \`TanStack Virtual\` to prevent DOM lag and keep INP metrics under 200ms.
- **Form States:** Forms must support autosave features (debounced at 500ms) with visible saving/saved indicators.

## 3. Micro-animations & Micro-interactions
- **Spring Transitions:** Button clicks, hover overlays, and panel toggles must use Framer Motion physics-based springs (e.g., \`type: "spring"\`, \`stiffness: 300\`, \`damping: 20\`).
- **View Transitions:** Clicking cards to open inspector panels must run under the CSS View Transitions API to morph layout items smoothly.
`,
  'backend-standards.md': `# Backend & API Standards

Standards for serverless execution runtimes, Postgres operations, and queue handlers.

## 1. Runtime Configurations
- **Edge Functions:** Build API endpoints that run on the Next.js Edge Runtime in the SIN1 (Singapore) region to ensure low latency.
- **Node.js Containers:** Long-running crawls, sitemap reindexing, or agent runs must be delegated to background queues (Trigger.dev or BullMQ) instead of blocking edge responses.

## 2. PostgreSQL & Database Operations
- **pgvector Integration:** Always store embeddings inside PostgreSQL tables using the \`vector\` data type. Query vectors using cosine distance operators.
- **LISTEN / NOTIFY Triggers:** Use Postgres triggers and pub/sub connections to notify backend route listeners about row updates in real-time, bypassing polling bottlenecks.
- **Concurrent Queue Locking:** Queue worker select queries must use \`SELECT ... FOR UPDATE SKIP LOCKED\` to ensure multiple workers never execute the same job.

## 3. Data Integrity & Validation
- **Outbox Pattern:** Maintain database-level transaction integrity. Database updates and their event records must be written inside a single Postgres transaction.
- **Strict Zod Schemas:** Define explicit schemas for all API payloads and database rows.
`,
  'design-standards.md': `# Design System & UI/UX Standards

Standards for color tokens, typography, and micro-interaction styling.

## 1. Styling & Tokens (Tailwind CSS v4)
- **Theme Variables:** All sizes, typography elements, and colors must be mapped to CSS Custom Properties inside the \`@theme\` layout layer.
- **Editorial Color Palette:** Primary dark surfaces must use slate colors (\`#0f172a\` / \`#1e293b\`), body background warm alabaster (\`#f8fafc\`), and accent highlights teal (\`#0d9488\`) and gold (\`#d97706\`).
- **Arbitrary Values:** Avoid hardcoded arbitrary values (e.g., \`w-[342px]\`). Align layout items strictly with the 8px layout grid.

## 2. Typography Hierarchy
- **Title Displays:** Use \`Plus Jakarta Sans\` (bold, uppercase trackers, letter-spacing: -0.02em) for H1 and display elements.
- **Body Content:** Use \`Inter\` (line-height: 1.7) for body articles to maximize readability.
- **Precision Data:** Use \`JetBrains Mono\` for numeric statistics, code blocks, and category badge elements.
`,
  'architecture-standards.md': `# Platform Architecture Standards

Standards for structural layout, routing boundaries, and system integration.

## 1. Hexagonal Ports & Adapters
- **Dependency Isolation:** The core business domain must be decoupled from specific libraries or database clients (e.g., Supabase SDK).
- **Interface Mappings:** Define core features as Ports (interfaces) and write Adapters (concrete wrappers) to communicate with external databases and APIs.

## 2. Routing & Caching
- **Routing Structure:** Lowercase hyphenated slugs with no trailing slashes.
- **Cache Invalidation:** Use Incremental Static Regeneration (ISR) with cache validation tags. Purge page caches dynamically when database tables are updated.
- **AI Crawler Gateway:** Edge middleware must detect user-agents and intercept AI bots (like GPTBot, ClaudeBot) to serve lightweight, search-optimized Markdown (\`llms.txt\`).
`,
  'event-sourcing-standards.md': `# Event Sourcing & Ledger Standards

Standards for append-only transaction logs and credit auditing.

## 1. Event Log Immutability
- **No Mutations:** Event log rows (\`audit_events\` table) must never be updated or deleted once written.
- **ACID Ledger:** Financial balances are derived by calculating chronological sums of the \`credit_transactions\` ledger. Do not update balances directly.

## 2. Event Replay Projection Builder
- **Replay Handlers:** Write functions that can parse the historical event log from scratch to rebuild read databases or statistics views when schemas change.
`,
  'ai-coding-standards.md': `# AI-Assisted Coding Standards

Standards for collaborative vibe coding between developers and AI agents.

## 1. Vibe Coding Workflow
- **Cursor + Claude Code:** Leverage Cursor for editor edits and inline queries. Use Claude Code CLI client for large refactoring runs, multi-file updates, and agent workflows.
- **Spec-First Plan:** Write and review an ADR or PRD document before letting AI write codebase files.

## 2. Quality Gate Loops
- **Compiler Validation:** After editing files, run \`npm run build\` or TypeScript checks (\`npx tsc\`) to ensure no compile errors are introduced.
- **Review Checks:** Audit Git changes and run linter commands (\`npm run lint\`) to ensure formatting standards are maintained.
`,
  'prompt-standards.md': `# Prompt Engineering & LLM Standards

Standards for prompt architectures, context packing, and routing guidelines.

## 1. Context Engineering
- **Context Packing:** Wrap context segments in clear XML tags (e.g., \`<CONTEXT_DATA>\`, \`<SYSTEM_RULES>\`) to structure model prompt scopes.
- **Hierarchy Mapping:** Structure prompt inputs from permanent rules, dynamic variables, and conversation history.

## 2. API Routing Fallbacks
- **Fallback Chains:** Attempt fast, cost-efficient APIs (like Groq) first, with automated failover logic to Google Gemini Flash on rate limit warnings.
`
};

Object.entries(standards).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(BASE_DIR, 'standards', filename), content);
});

// --- GENERATE CHECKLISTS ---

const checklists = {
  'ui-review-checklist.md': `# UI Review Checklist

- [ ] Density check: layout elements are compact and fit inside the dashboard viewport.
- [ ] Typography verification: Plus Jakarta Sans is applied on headings and Inter on body.
- [ ] No hardcoded color values: all colors conform to slate, teal, and gold custom variables.
- [ ] Card border styling: borders are thin (Slate-800) and card backgrounds Slate-900.
- [ ] Split-view alignment: resizable dividers slide smoothly on drag with zero visual glitches.
`,
  'ux-review-checklist.md': `# UX Review Checklist

- [ ] keyboard shortcuts: universal palette opens on Cmd+K and drawers close on Esc.
- [ ] Focus indicators: focus rectangles are visible and clean during tab key presses.
- [ ] Form autosave: data inputs are debounced and display saving/saved status indicators.
- [ ] Dynamic split pane: dragging resizers respects minimum container dimensions.
- [ ] Interaction feedback: button hovers trigger apple-level spring hover highlights.
`,
  'accessibility-checklist.md': `# Accessibility (A11y) Checklist

- [ ] Contrast Ratio: verify that every text block has a minimum contrast ratio of 4.5:1.
- [ ] Screen Readers: layout structures use semantic HTML5 components (nav, main, aside, header).
- [ ] Keyboard Access: all button actions and links are reachable using the Tab key.
- [ ] ARIA markup: dynamic dashboard overlays and tabs contain explicit ARIA roles.
- [ ] Reduced Motion: heavy scroll effects and spring animations fallback to simple fades when prefers-reduced-motion is active.
`,
  'seo-checklist.md': `# SEO & Indexing Checklist

- [ ] Technical Meta: descriptive title (< 60 chars) and meta description (< 155 chars) on all routes.
- [ ] Schema Graphs: BreadcrumbList and LocalBusiness JSON-LD schemas are injected dynamically.
- [ ] Canonical URLs: page headers contain canonical link declarations pointing to the main URL.
- [ ] AI Crawling: whitelist GPTBot, ClaudeBot, and PerplexityBot in robots.txt.
- [ ] GEO/AEO optimization: verify the first 200 words of pages contain direct "Definition-First" statements.
- [ ] Internal Linking: programmatic sitemaps and cluster pages link back to the main domain.
`,
  'performance-checklist.md': `# Performance Optimization Checklist

- [ ] Web Vitals: LCP is under 1.5 seconds, CLS is 0, and INP is under 200 milliseconds.
- [ ] Next.js PPR: static parts of pages load instantly, dynamic elements stream via React Suspense.
- [ ] Bundle splits: lazily load heavy modules (like React Flow canvas editors) with Next.js dynamic imports.
- [ ] Table virtualization: TanStack Virtual manages tables containing more than 50 database rows.
- [ ] Edge Caching: static pages are cached at CDN Edge with on-demand tag revalidation.
`,
  'security-checklist.md': `# Security Hardening Checklist

- [ ] Database RLS: Row-Level Security policies are active and tested on all Supabase tables.
- [ ] CSP Headers: middleware injects strict Content Security Policy script-src directives.
- [ ] Rate limits: public endpoints (like search or audit engine) are rate-limited via Unkey API.
- [ ] Input Validation: all request bodies are parsed and verified using Zod models.
- [ ] API Secrets: check code for NEXT_PUBLIC prefixes. Sensitive service keys must be kept server-side.
`,
  'production-checklist.md': `# Production Readiness Checklist

- [ ] Database Migrations: check that migrations are applied successfully on the production database.
- [ ] Environment Setup: verify all API keys and variables are configured on Vercel Dashboard.
- [ ] Error Boundaries: verify root and component-level error boundaries are set up.
- [ ] Domain Mapping: verify SSL certifications are active and redirecting HTTP queries.
- [ ] Log collection: Sentry is collecting server-side logs and OpenPanel triggers are active.
`,
  'release-checklist.md': `# Release Checklist

- [ ] Run \`npm run build\` and check for TypeScript compile errors.
- [ ] Run linter checks to ensure no formatting rules are broken.
- [ ] Verify local dev server resolves pages successfully.
- [ ] Commit all changes to Git branch with descriptive messages.
- [ ] Tag the git commit with the release version number.
`
};

Object.entries(checklists).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(BASE_DIR, 'checklists', filename), content);
});

// --- GENERATE PLAYBOOKS ---

const playbooks = {
  'ai-ide-agent-playbook.md': `# AI IDE Agent Playbook

Guidelines for collaborative coding between developers and AI agents in the repository.

## Workflow Execution
1. **Context Assembly:** Before starting a task, read the relevant standards and checklists to align targets.
2. **Step-by-step Execution:** Modify files in logical steps. Validate each change with lint checks before proceeding.
3. **Commit Regularly:** Make small, clean commits describing changes.
`,
  'vibe-coding-playbook.md': `# Vibe Coding Playbook

Best practices for AI-driven development.

## Action Plan
- Avoid manual boilerplate generation; let the AI write clean, type-safe structures.
- Focus on describing intent, edge cases, and design metrics.
- Keep components focused, modular, and decoupled.
`,
  'engineering-handbook.md': `# Engineering Handbook

Overview of the platform's development principles, architecture, and deployment procedures.

## Core Pillars
- **Zero-Mock Architecture:** Do not use artificial mock structures in production. Ensure actual, functional endpoints.
- **Event-Sourced Ledger:** Financial systems and user state modifications are append-only.
- **Local SEO & pSEO:** Target specific locations automatically to scale organic traffic.
`
};

Object.entries(playbooks).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(BASE_DIR, 'playbooks', filename), content);
});

// --- GENERATE TEMPLATES ---

const templates = {
  'repository-evaluation-rubric.md': `# Repository Evaluation Rubric

Use this rubric to assess whether an open-source repository is suitable for adoption.

| Metric | High Pass | Pass | Fail |
|---|---|---|---|
| **Stars** | > 10,000 | > 1,000 | < 1,000 |
| **Last Update** | < 1 month ago | < 6 months ago | > 6 months ago |
| **License** | Permissive (MIT/Apache 2) | Source-Available / GPL | Proprietary |
| **Activity** | Daily commits / active PRs | Monthly commits | Abandoned |
`,
  'library-evaluation-rubric.md': `# Library Evaluation Rubric

Rubric to evaluate package adoption.

- **Legitimacy:** Is the author a known organization or respected developer?
- **Bundle Size:** Does it add unnecessary weight to the client bundle?
- **Accessibility:** Does it support keyboard navigation and screen readers?
- **TypeScript Support:** Are types included out-of-the-box?
`,
  'adr-template.md': `# Architecture Decision Record (ADR): [Title]

- **Status:** [Proposed | Approved | Rejected]
- **Date:** [YYYY-MM-DD]
- **Deciders:** [Name]

## Context
Describe the architectural problem and requirements.

## Decision
What is the chosen solution and how will it be implemented?

## Consequences
What are the trade-offs and impacts on performance, security, and DX?
`,
  'prd-template.md': `# Product Requirement Document (PRD): [Feature Name]

## Objective
What problem does this feature solve and for whom?

## Scope
List the exact components, pages, and integrations.

## Non-Functional Requirements
- Page load speed
- Accessible controls
- Security restrictions
`,
  'feature-specification-template.md': `# Feature Specification Template

Detailed roadmap for developing a new feature block.

1. **User Flow Diagram**
2. **Database Schema changes**
3. **API Interfaces**
4. **Validation Test cases**
`,
  'component-specification-template.md': `# Component Specification Template

Design plan for a React component.

- **Props:** List keys and types.
- **Accessibility:** Keyboard triggers and focus handling.
- **Animations:** Transitions and styles.
`
};

Object.entries(templates).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(BASE_DIR, 'templates', filename), content);
});

// --- GENERATE PROMPTS ---

const prompts = {
  'prompt-library.md': `# Prompt Library

Useful prompts for AI assistance.

### Component Generator
\`\`\`
Generate a TypeScript component using Tailwind v4. Make it accessible and write unit tests.
\`\`\`

### Schema Generator
\`\`\`
Write a PostgreSQL schema migration file for Supabase with RLS policies and table triggers.
\`\`\`
`,
  'system-prompt-library.md': `# System Prompt Library

Global prompts for orchestrating development.

### Systems Architect Role
\`\`\`
You are an enterprise systems architect. Maintain database invariants, optimize edge latency, and enforce event-sourcing ledgers.
\`\`\`
`
};

Object.entries(prompts).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(BASE_DIR, 'prompts', filename), content);
});

console.log('Successfully completed advanced governance structure generation.');
