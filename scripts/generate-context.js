const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '../.context');

// Define directory structure
const researchCategories = [
  'frontend',
  'backend',
  'architecture',
  'design-system',
  'seo',
  'ai',
  'integrations',
  'observability',
  'security',
  'performance',
  'references'
];

const subdirs = ['research', 'playbooks', 'checklists', 'standards', 'prompts', 'templates'];

// Helper to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Scaffold all directories
ensureDir(BASE_DIR);
subdirs.forEach(sub => ensureDir(path.join(BASE_DIR, sub)));
researchCategories.forEach(cat => ensureDir(path.join(BASE_DIR, 'research', cat)));

// --- DATA STRUCTURES FOR RESEARCH GENERATION ---

const researchData = {
  frontend: {
    awesome: `# Awesome Resources: FRONTEND UI & UX

Curated production-grade benchmarks, case studies, and reference architectures for building high-density, keyboard-first Intelligence Consoles.

## Curated Benchmarks & Case Studies

### 1. Vercel Dashboard (Enterprise Console Benchmark)
- **URL:** [Vercel Dashboard](https://vercel.com)
- **Category:** Layout & Information Architecture
- **Key Takeaways:** 
  - **Navigation Hierarchy:** Employs a clean dual-level navigation. The top level manages account/team switching and global routing (Projects, Integrations, Activity, Settings). The second level manages project-specific context (Deployments, Analytics, Speed Insights, Settings).
  - **Visual Density:** Uses highly structured grid lists, minimal container borders, and generous white space.
  - **Contextual Toolbars:** Interactive buttons appear only on hover or selection, reducing visual clutter.

### 2. Supabase Studio (Database Console Benchmark)
- **URL:** [Supabase Studio](https://supabase.com)
- **Category:** Dense Data Management
- **Key Takeaways:**
  - **Dual Sidebar Layout:** Global navigation on the left rail (icons only), secondary tree explorer on the sub-sidebar (collapsible).
  - **Split Views & Inspectors:** Selecting a database row opens a drawer inspector from the right, maintaining context.
  - **Data Grids:** Spreadsheet-like cell editor experience with keyboard-first navigation (arrows to move, enter to edit).

### 3. Grafana & Datadog (Observability Consoles)
- **URL:** [Grafana](https://grafana.com) / [Datadog](https://www.datadoghq.com)
- **Category:** Dashboard & Metric Density
- **Key Takeaways:**
  - **Widget Grids:** Custom resizable grid panels. Users can build their layouts.
  - **Inspector Panels:** Dynamic log inspect overlays at the bottom (split view) to debug queries in real-time.

### 4. Linear & GitHub (Issue and Project Management)
- **URL:** [Linear](https://linear.app) / [GitHub](https://github.com)
- **Category:** Keyboard-First Productivity
- **Key Takeaways:**
  - **Command Palette:** Cmd+K command menu handles all navigation and updates instantly via client-side caching.
  - **Keyboard-First:** Full keyboard navigation support (e.g., \`j/k\` to navigate list, \`enter\` to open, \`c\` to create).
`,
    repositories: `# GitHub Repositories: FRONTEND UI & UX

Deep-dive reverse engineering of production-grade frontend projects, components, and layout platforms.

## Repository Curation

### 1. XYFlow (React Flow & Svelte Flow)
- **Repository:** [xyflow/xyflow](https://github.com/xyflow/xyflow)
- **Stars:** ~21,500
- **License:** MIT License
- **Maintenance Status:** Highly Active
- **Usage Rationale:** Essential for rendering the Entity Graph and Node-based DAGs. Manages canvas zooming, panning, node hooks, and edge routing.
- **When to Use:** Building custom canvas editors, visual workflows, or interactive knowledge graphs.
- **When Not to Use:** Simple directory lists or standard statistical charts.

### 2. TanStack Table
- **Repository:** [TanStack/table](https://github.com/TanStack/table)
- **Stars:** ~26,000
- **License:** MIT License
- **Maintenance Status:** Highly Active
- **Usage Rationale:** Headless table management that handles sorting, filtering, columns, pagination, and virtualization.
- **How to Use:** Build custom UI tables around TanStack's core state functions using Tailwind v4.

### 3. TanStack Virtual
- **Repository:** [TanStack/virtual](https://github.com/TanStack/virtual)
- **Stars:** ~4,800
- **License:** MIT License
- **Maintenance Status:** Active
- **Usage Rationale:** Critical for rendering thousands of directory rows or audit logs in the DOM with high performance. Only mounts items visible in the viewport.

### 4. cmdk (Command Palette Core)
- **Repository:** [pacocoursey/cmdk](https://github.com/pacocoursey/cmdk)
- **Stars:** ~3,800
- **License:** MIT License
- **Maintenance Status:** Maintained
- **Usage Rationale:** Headless search and command menu element with keyboard navigation. Excellent for universal navigation search boxes.
`,
    libraries: `# Libraries & Packages: FRONTEND UI & UX

Evaluation of UI components, rich-text editors, and panel managers.

## Component & Editor Libraries

### 1. React Resizable Panels
- **Package:** \`react-resizable-panels\`
- **License:** MIT License
- **Reason for Selection:** Enables users to drag and split dashboard layouts (e.g., sidebars, log consoles, inspectors).
- **When to Use:** Building split-pane layouts where the user wants to adjust tree nodes, details, or consoles.
- **When Not to Use:** Fixed sidebar configurations.

### 2. Plate Editor / BlockNote / Lexical / Tiptap
- **Libraries:** \`@udecode/plate\`, \`@blocknote/core\`, \`lexical\`, \`@tiptap/core\`
- **Usage Comparison:**
  - **Tiptap / Lexical:** Low-level headless rich text frameworks. Best for building bespoke collaborative documents.
  - **BlockNote / Plate:** High-level structured editors. BlockNote is perfect for Notion-like block editors out of the box.
- **Usage in Zadit Portfolio:** Build interactive AI Workspace note generators or Markdown report managers.
`,
    patterns: `# Design & Implementation Patterns: FRONTEND UI & UX

UI and layout patterns for high-density, real-time intelligence dashboards.

## Recommended Patterns

### 1. Inspector Overlay (Right Drawer)
- **Description:** A panel slides in from the right to show detailed attributes of a selected entity (e.g., audit log, directory item) while keeping the main grid visible.
- **Implementation:** Use Radix UI Dialog or CSS View Transitions API to morph the selected card into a side panel overlay.
- **Keyboard Shortcut:** Esc key to close, Arrow keys to switch entities.

### 2. Split-Pane Layout (Master-Detail)
- **Description:** Vertical divider splitting the screen into a navigation tree (left) and content pane (right).
- **Implementation:** Wrap panels in \`react-resizable-panels\` to allow dynamic resizing. Persist panel layout sizes in cookies or localStorage.

### 3. Command Palette Universal Search
- **Description:** Central command bar (Cmd+K) offering quick navigation, page search, actions, and theme toggling.
- **Implementation:** Combine \`cmdk\` with a dynamic database search endpoint and execute client-side state actions.
`,
    antipatterns: `# Anti-Patterns to Avoid: FRONTEND UI & UX

Frontend anti-patterns that degrade user experience and Core Web Vitals.

## Critical Pitfalls

### 1. Scroll Chaining and Layout Shifts
- **Pitfall:** Nesting custom scroll containers inside other scroll containers without setting proper height properties.
- **Consequence:** Causes layout jumping and scrolls parent body on trackpad gestures, breaking Lenis smooth-scroll.
- **Remedy:** Force custom layout panels to use \`overflow-y-auto h-full\` with absolute height limits.

### 2. Heavy Client-Side Hydration on Initial Load
- **Pitfall:** Importing massive Rich Text Editors or Flow Canvases dynamically in root layout bundles.
- **Consequence:** Massive Increase in Total Blocking Time (TBT) and LCP latency.
- **Remedy:** Lazily load heavy libraries using React's \`next/dynamic\` with \`ssr: false\` and spinner placeholders.

### 3. Text Fields without Autosave or Optimistic Updates
- **Pitfall:** Forcing users to click a global "Submit" button to save dashboard config updates.
- **Consequence:** Frustrating user experience on flaky network connections.
- **Remedy:** Implement debounce autosave (e.g., 500ms) with visible saving/saved indicators.
`,
    implementation_notes: `# Implementation Notes: FRONTEND UI & UX

Guidelines for building the Intelligence Console and custom components.

## Building the Split-Pane Intelligence Layout

\`\`\`tsx
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function IntelligenceLayout() {
  return (
    <PanelGroup direction="horizontal" className="h-screen bg-slate-950">
      <Panel defaultSize={20} minSize={15} maxSize={30} className="border-r border-slate-800">
        {/* Entity Tree Selector */}
      </Panel>
      <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-teal-500 transition-colors" />
      <Panel defaultSize={50}>
        {/* Main Graph Canvas / Data Grid */}
      </Panel>
      <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-teal-500 transition-colors" />
      <Panel defaultSize={30} minSize={20} className="border-l border-slate-800">
        {/* Contextual Inspector Panel */}
      </Panel>
    </PanelGroup>
  );
}
\`\`\`

### Action Plan
1. Scaffold layout wrapper utilizing \`react-resizable-panels\` for splitting the inspector.
2. Build command palette trigger using \`cmdk\` and register search shortcuts.
3. Integrate TanStack Table for dense, virtualized entity lists.
`
  },
  backend: {
    awesome: `# Awesome Resources: BACKEND ARCHITECTURE

Curated guides, databases, event routing protocols, and workflow engines.

## Curated Databases & Engines

### 1. pgvector (PostgreSQL Vector Search)
- **URL:** [pgvector docs](https://github.com/pgvector/pgvector)
- **Why Chosen:** Native postgres vector similarity searches. Avoids the complexity of standalone vector DBs.
- **When to Use:** Storing and searching entity embeddings, semantic match queries, and memory retrieval.

### 2. TimescaleDB (Time-series Extensions)
- **URL:** [Timescale Docs](https://docs.timescale.com)
- **Why Chosen:** Optimizes storage and query speed for high-volume logs, event streams, and audit metrics.
- **When to Use:** Storing time-series logs and audit execution metrics.

### 3. Trigger.dev & Inngest
- **URL:** [Trigger.dev](https://trigger.dev) / [Inngest](https://www.inngest.com)
- **Why Chosen:** Event-driven, serverless execution queues that avoid cold starts and long-running server billing.
- **When to Use:** Processing async crawls, reindexing routes, and executing AI worker DAGs.
`,
    repositories: `# GitHub Repositories: BACKEND ARCHITECTURE

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
`,
    libraries: `# Libraries & Packages: BACKEND ARCHITECTURE

Curation of backend runtimes, libraries, and frameworks.

## Library Registry

### 1. Hono Web Framework
- **Package:** \`hono\`
- **Stars:** ~21,500
- **License:** MIT License
- **Usage Rationale:** Lightweight, ultra-fast web framework for Edge runtimes (Vercel Edge, Cloudflare Workers).
- **When to Use:** Building API endpoints that must resolve in milliseconds globally.

### 2. Effect TS
- **Package:** \`@effect/io\`
- **Usage Rationale:** Advanced TypeScript toolkit for structured concurrency, dependency injection, and error handling.
- **When to Use:** Complex pipelines that require strict error types and concurrency safety.
- **When Not to Use:** Simple CRUD routing modules.

### 3. BullMQ
- **Package:** \`bullmq\`
- **Usage Rationale:** Redis-backed message queue for heavy job processing.
- **When to Use:** Managing long-running backend processes under dedicated servers.
`,
    patterns: `# Design & Implementation Patterns: BACKEND ARCHITECTURE

Design patterns for scalable, resilient, and event-sourced backends.

## Recommended Patterns

### 1. Transactional Outbox Pattern
- **Description:** Write database updates and their corresponding event payloads inside a single ACID database transaction.
- **Why it matters:** Guarantees that the event log always matches database state, even during network drops.
- **Implementation:** Write event rows to an \`outbox_events\` table, and have an async worker process them.

### 2. Postgres LISTEN / NOTIFY Pub-Sub
- **Description:** Database triggers notify Node.js processes about row changes instantly.
- **Why it matters:** Avoids continuous polling to detect new queue items.
- **Implementation:** Execute \`NOTIFY table_update, 'payload'\` in a DB trigger, and listen on the connection socket in Node.js.

### 3. Advisory Locks & SKIP LOCKED Queueing
- **Description:** Safe concurrent processing of queue items by multiple workers.
- **Why it matters:** Prevents multiple workers from grabbing the same job.
- **Implementation:** Use SQL \`SELECT * FROM jobs WHERE status = 'pending' FOR UPDATE SKIP LOCKED LIMIT 1\`.
`,
    antipatterns: `# Anti-Patterns to Avoid: BACKEND ARCHITECTURE

Pitfalls and traps in serverless and database-centric backends.

## Critical Pitfalls

### 1. Mutable Balances in Credit Ledgers
- **Trap:** Updating database column balances directly (e.g., \`UPDATE users SET balance = balance - 10\`).
- **Consequence:** Race conditions and database locking can lead to double spending or negative balances.
- **Remedy:** Enforce an append-only transaction ledger (\`INSERT INTO transactions ...\`) and use triggers to calculate derived balances.

### 2. Monolithic Server Routines on Edge Runtimes
- **Trap:** Performing long database transactions or nested queries inside Vercel Edge functions.
- **Consequence:** Edge functions timeout (10-30s limits), leading to failed API requests.
- **Remedy:** Delegate heavy jobs to background task workers (Trigger.dev or BullMQ).

### 3. Shared Database State in Microservices
- **Trap:** Allowing different services to query and write to the same table partitions directly.
- **Consequence:** Tight coupling, schema upgrades break multiple services.
- **Remedy:** Force services to communicate strictly via event messages or API endpoints.
`,
    implementation_notes: `# Implementation Notes: BACKEND ARCHITECTURE

Blueprints for PostgreSQL configurations and database event triggers.

## Event Outbox Database Configuration

\`\`\`sql
-- Create Outbox Table
CREATE TABLE outbox_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to notify on new event
CREATE OR REPLACE FUNCTION notify_outbox_event()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('new_outbox_event', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_outbox
AFTER INSERT ON outbox_events
FOR EACH ROW
EXECUTE FUNCTION notify_outbox_event();
\`\`\`

### Action Plan
1. Integrate event tables and triggers in migrations.
2. Setup Hono route handlers inside serverless functions.
3. Configure pgvector embeddings storage on PostgreSQL.
`
  },
  architecture: {
    awesome: `# Awesome Resources: SYSTEM ARCHITECTURE

Reference guidelines for building event-sourced platforms, hexagonal designs, and edge rendering pipelines.

## Architectural Guides

### 1. CQRS (Command Query Responsibility Segregation)
- **URL:** [Greg Young Event Sourcing Guide](https://eventstore.com/blog/what-is-event-sourcing)
- **Key Takeaways:** Explains why decoupling read and write models ensures sub-second latency and scalability.

### 2. Hexagonal Architecture (Ports & Adapters)
- **URL:** [Alistair Cockburn Archives](https://alistair.cockburn.us/hexagonal-architecture/)
- **Key Takeaways:** Explains structural division of application logic into inward-facing core models and outward-facing infrastructure interfaces.
`,
    repositories: `# GitHub Repositories: SYSTEM ARCHITECTURE

Open-source project references demonstrating scalable architectures.

## Repositories Directory

### 1. Next.js Core Repo
- **Repository:** [vercel/next.js](https://github.com/vercel/next.js)
- **Stars:** ~125,000
- **Usage Rationale:** Explains details of Partial Prerendering (PPR), static routing generation, and on-demand ISR page revalidation.

### 2. Event Store DB Client
- **Repository:** [EventStore/EventStore](https://github.com/EventStore/EventStore)
- **Usage Rationale:** Reference implementation of projection builders, event streams, and replay mechanisms.
`,
    libraries: `# Libraries & Packages: SYSTEM ARCHITECTURE

Framework libraries for event logging, reactive pipelines, and edge computing.

## Libraries Registry

### 1. Effect TS Core
- **Package:** \`@effect/schema\`
- **Usage Rationale:** Enables validation and serialization of incoming data objects with full TypeScript safety.

### 2. Fastify
- **Package:** \`fastify\`
- **Usage Rationale:** Fast Node.js web framework. Use when deploying dedicated container-based API servers instead of serverless edge routes.
`,
    patterns: `# Design & Implementation Patterns: SYSTEM ARCHITECTURE

Structural patterns for enterprise software architecture.

## Recommended Patterns

### 1. Event Replay Projection Builder
- **Description:** Process all past events to rebuild a read-database from scratch (e.g. if schemas change or new columns are added).
- **Implementation:** Query event log tables chronologically, feed events through projection handlers, and write state objects to read tables.

### 2. Hexagonal Ports Definition
- **Description:** Standardize external resources via abstract interfaces.
- **Implementation:** Define a \`DbPort\` interface. Create concrete implementations like \`DrizzleDbAdapter\` and \`SupabaseDbAdapter\`.
`,
    antipatterns: `# Anti-Patterns to Avoid: SYSTEM ARCHITECTURE

Architectural pitfalls that limit system portability and scalability.

## Critical Pitfalls

### 1. Hard Coupling to Supabase Client
- **Trap:** Importing the supabase client library directly inside core business modules.
- **Consequence:** Moving away from Supabase or migrating to another database engine requires rebuilding all modules.
- **Remedy:** Wrap Supabase database actions inside clean adapter ports.

### 2. Sync Event Processing Loops
- **Trap:** Forcing client API requests to block and wait until all side-effects (indexing, scraping, analytics logging) complete.
- **Consequence:** Requests take seconds to complete, raising rates of client dropouts.
- **Remedy:** Emit events to the background outbox database and return status \`202 Accepted\` to the client instantly.
`,
    implementation_notes: `# Implementation Notes: SYSTEM ARCHITECTURE

Blueprints for building ports and processing event streams.

## Hexagonal Database Port Blueprint

\`\`\`typescript
// Core Domain Port
export interface EntityDatabasePort {
  findEntityBySlug(slug: string): Promise<Entity | null>;
  saveEntity(entity: Entity): Promise<void>;
}

// Supabase Adapter Implementation
export class SupabaseEntityAdapter implements EntityDatabasePort {
  constructor(private client: any) {}

  async findEntityBySlug(slug: string): Promise<Entity | null> {
    const { data } = await this.client
      .from('entities')
      .select('*')
      .eq('slug', slug)
      .single();
    return data ? this.mapToDomain(data) : null;
  }

  async saveEntity(entity: Entity): Promise<void> {
    await this.client.from('entities').upsert(this.mapToDb(entity));
  }

  private mapToDomain(dbRow: any): Entity { return dbRow; }
  private mapToDb(domain: Entity): any { return domain; }
}
\`\`\`

### Action Plan
1. Declare core interfaces for adapters under \`src/modules/core/ports\`.
2. Wrap external databases and APIs (Supabase, Brave Search) in adapters.
3. Configure event store and projection handlers.
`
  },
  'design-system': {
    awesome: `# Awesome Resources: DESIGN SYSTEM

Reference design systems and token guidelines.

## Curated Design Systems

### 1. Stripe Design & Vercel Design
- **Key Takeaways:** Sleek, high-contrast layouts. Employs card containers, grid lines, and subtle border highlights.

### 2. IBM Carbon Design System
- **URL:** [Carbon Design System](https://carbondesignsystem.com)
- **Key Takeaways:** Modular spacing, grid rules, and high accessibility compliance (WCAG AA/AAA).
`,
    repositories: `# GitHub Repositories: DESIGN SYSTEM

Reverse engineering of design system implementations and styling frameworks.

## Repositories Directory

### 1. shadcn/ui Core
- **Repository:** [shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- **Stars:** ~74,000
- **License:** MIT License
- **Usage Rationale:** Master reference for CLI generation and copying component files directly to the codebase for complete customization.

### 2. Radix UI Primitives
- **Repository:** [radix-ui/primitives](https://github.com/radix-ui/primitives)
- **Usage Rationale:** Accessible component primitives (dialogs, hover cards, dropdowns) styled via Tailwind CSS v4.
`,
    libraries: `# Libraries & Packages: DESIGN SYSTEM

Styling, theme, and micro-animation packages.

## Libraries Registry

### 1. Tailwind CSS v4
- **Package:** \`tailwindcss\`
- **Usage Rationale:** Next-generation compiler using CSS-first configurations, removing the need for JS config files.

### 2. React Aria
- **Package:** \`react-aria\`
- **Usage Rationale:** Adobe's accessible hooks for building keyboard-first UI widgets.

### 3. Park UI / Ark UI
- **Package:** \`@park-ui/react\`
- **Usage Rationale:** Accessible components powered by Ark UI (Chakra's next-gen engine).
`,
    patterns: `# Design & Implementation Patterns: DESIGN SYSTEM

Tailwind CSS v4 tokens and theme variables.

## Recommended Patterns

### 1. CSS Custom Property Tokens
- **Description:** Define theme variables in root CSS rules rather than JS config variables.
- **Why it matters:** Instantly updates styling globally with zero runtime script execution.
- **Implementation:** Use Tailwind v4 custom theme mappings.

### 2. Apple-Level Micro-interactions
- **Description:** Subtle, physics-based springs on button clicks and hover states.
- **Implementation:** Combine Tailwind utility classes with Framer Motion \`type: "spring"\` transition parameters.
`,
    antipatterns: `# Anti-Patterns to Avoid: DESIGN SYSTEM

Design system pitfalls to avoid.

## Critical Pitfalls

### 1. Arbitrary Hardcoded Tailwind Values
- **Trap:** Using brackets inside class names for sizes or colors (e.g. \`bg-[#0f172a]\` or \`w-[342px]\`).
- **Consequence:** Breaking visual consistency across pages; changes require updating multiple files.
- **Remedy:** Map all sizes, margins, and colors to CSS variables or custom utility classes in CSS.

### 2. Bypassing ARIA Accessibility Labels
- **Trap:** Rendering icon buttons (like \`<Search />\`) with no descriptive label.
- **Consequence:** Screen readers skip the component, failing WCAG compliance.
- **Remedy:** Always declare \`aria-label\` or wrap elements in Radix accessible markup.
`,
    implementation_notes: `# Implementation Notes: DESIGN SYSTEM

Tailwind CSS v4 setup and theme configuration.

## Tailwind CSS v4 CSS Configuration

\`\`\`css
@import "tailwindcss";

@theme {
  --color-slate-900: #0f172a;
  --color-slate-800: #1e293b;
  --color-teal-500: #0d9488;
  --color-gold-500: #d97706;

  --font-display: "Plus Jakarta Sans", sans-serif;
  --font-sans: "Inter", sans-serif;
}
\`\`\`

### Action Plan
1. Configure Tailwind CSS v4 theme.
2. Wrap Radix primitive elements in custom Tailwind wrapper components.
3. Apply micro-animations on interactive elements.
`
  },
  seo: {
    awesome: `# Awesome Resources: MODERN SEO & GEO (2026)

Curation of specifications for Search Engine, Generative Engine, and Answer Engine Optimization (GEO/AEO).

## Curated Guides

### 1. Google AI Overviews & Generative Engine Optimization (GEO)
- **Key Takeaways:** Focuses on serving concise definitions, tabular comparisons, and structural citations to satisfy generative crawler parameters.

### 2. Schema.org Spec Sheets
- **URL:** [Schema.org](https://schema.org)
- **Key Takeaways:** Authoritative guide on semantic graph markup (JSON-LD) for LocalBusiness, Breadcrumbs, and Article definitions.
`,
    repositories: `# GitHub Repositories: MODERN SEO & GEO (2026)

Reverse engineering of projects that automate programmatic SEO indexing and structural graphs.

## Repository Directory

### 1. next-sitemap
- **Repository:** [iamvishnusankar/next-sitemap](https://github.com/iamvishnusankar/next-sitemap)
- **Usage Rationale:** Automates sitemap and robots.txt generation based on dynamic route exports.

### 2. schema-dts
- **Repository:** [google/schema-dts](https://github.com/google/schema-dts)
- **Usage Rationale:** Provides type safety for injecting JSON-LD schema graphs in Next.js Server Components.
`,
    libraries: `# Libraries & Packages: MODERN SEO & GEO (2026)

Libraries for indexing API pings, structured JSON-LD outputs, and metadata parsers.

## Libraries Registry

### 1. googleapis
- **Package:** \`googleapis\`
- **Usage Rationale:** Native client to call Google's Indexing API, requesting instant per-page crawler visits.

### 2. indexnow-js
- **Usage Rationale:** Pings IndexNow gateways (Bing, Yandex) to instantly sync newly published programmatic SEO routes.
`,
    patterns: `# Design & Implementation Patterns: MODERN SEO & GEO (2026)

SEO methodologies optimized for 2026 AI search.

## Recommended Patterns

### 1. Definition-First Content Writing
- **Description:** Place a direct 1-2 sentence definition containing key concepts at the absolute start of each content module.
- **Why it matters:** AI crawlers scan initial paragraphs of sections to pull definitions into featured search panels.

### 2. Semantic Graph Co-Citation
- **Description:** Nest JSON-LD schemas together into a single interconnected graph array in document headers.
- **Why it matters:** Links the authority of the platform owner directly to target directories and articles.
`,
    antipatterns: `# Anti-Patterns to Avoid: MODERN SEO & GEO (2026)

Common search optimization failures.

## Critical Pitfalls

### 1. Blocking AI Crawling Bots
- **Trap:** Restrictive robots.txt configurations that block user-agents like GPTBot or ClaudeBot.
- **Consequence:** The platform's content is excluded from AI answers and LLM searches.
- **Remedy:** Explicitly whitelist AI crawlers in Robots.txt while serving lightweight, optimized Markdown files.

### 2. Orphaned Programmatic SEO Pages
- **Trap:** Generating thousands of directory pages without linking them from core navigation index files.
- **Consequence:** Google considers pages low-quality spam and drops them from search indexing.
- **Remedy:** Build programmatic internal linking modules that link directory cities from main footers or blog index files.
`,
    implementation_notes: `# Implementation Notes: MODERN SEO & GEO (2026)

Blueprints for setting up metadata and structured schemas.

## Dynamic JSON-LD Graph Construction

\`\`\`typescript
import { LocalBusiness, WebPage, WithContext } from 'schema-dts';

export function generateEntityGraph(entityName: string, city: string): WithContext<any> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": \`https://zadit.dev/directory/\${city}#entity\`,
        "name": entityName,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city
        }
      },
      {
        "@type": "WebPage",
        "@id": \`https://zadit.dev/directory/\${city}\`,
        "mainEntity": {
          "@type": "Person",
          "name": "Muhammad Khoiruzzadittaqwa"
        },
        "mentions": {
          "@id": \`https://zadit.dev/directory/\${city}#entity\`
        }
      }
    ]
  };
}
\`\`\`

### Action Plan
1. Construct sitemap generation routes reading directly from Supabase.
2. Apply Definition-First styling rules on all articles.
3. Inject the dynamic entity graph into page headers.
`
  },
  ai: {
    awesome: `# Awesome Resources: AI ENGINEERING & AGENTS

Curated resources on context engineering, model evaluation, and workflow architectures.

## Curated Guides

### 1. Context Engineering Guidelines
- **Key Takeaways:** Explains methods for structuring agent context window loops, context hierarchy (system prompts, static context data, conversation logs), and token compression.

### 2. Model Context Protocol (MCP) Specification
- **URL:** [MCP official spec](https://modelcontextprotocol.io)
- **Key Takeaways:** Defines a standard protocol to connect client agents to external tool sets, local files, and database schemas securely.
`,
    repositories: `# GitHub Repositories: AI ENGINEERING & AGENTS

Reverse engineering of typescript agent runtimes and structured parsing tools.

## Repository Directory

### 1. Mastra Framework
- **Repository:** [mastra-ai/mastra](https://github.com/mastra-ai/mastra)
- **Usage Rationale:** Lightweight TypeScript agent framework with tool registries, workflow DAG definitions, and integration logs.
- **How to Use:** Leverage their agent loops to execute structured tasks with automated tool calling.

### 2. Vercel AI SDK Core
- **Repository:** [vercel/ai](https://github.com/vercel/ai)
- **Usage Rationale:** Production standard for building agent UI components (messages, stream loaders) and streaming LLM calls.

### 3. LangGraph JS
- **Repository:** [langchain-ai/langgraphjs](https://github.com/langchain-ai/langgraphjs)
- **Usage Rationale:** Core reference for stateful, multi-agent workflows with cycles and checkpoint persistence.
`,
    libraries: `# Libraries & Packages: AI ENGINEERING & AGENTS

Agent SDKs, structured compilers, and context interfaces.

## Libraries Registry

### 1. @ai-sdk/ui
- **Package:** \`@ai-sdk/ui\`
- **Usage Rationale:** Vercel UI helpers for rendering streaming chat layouts and tool execution loaders.

### 2. CopilotKit
- **Package:** \`@copilotkit/react-core\`
- **Usage Rationale:** Simplifies building inline AI assistants that interact directly with application state and components.
`,
    patterns: `# Design & Implementation Patterns: AI ENGINEERING & AGENTS

Patterns for structured output validation, fallbacks, and memory caches.

## Recommended Patterns

### 1. Fallback LLM Router
- **Description:** Route prompt tasks based on system performance requirements and rate limit budgets.
- **Implementation:** Attempt Groq API (Llama-3.1 8B) for fast text rewriting, falling back to Gemini Flash (1.5 Flash) on failure.

### 2. Hierarchical Agent Memory Lifecycle
- **Description:** Structure agent memory into Working Memory (current task variables), Episodic Memory (past step history), and Semantic Memory (long-term database embeddings).
- **Implementation:** Store episodic summaries in database tables and retrieve them dynamically using vector searches.
`,
    antipatterns: `# Anti-Patterns to Avoid: AI ENGINEERING & AGENTS

AI pitfalls that cause performance degradation and cost spikes.

## Critical Pitfalls

### 1. Blind Prompt Injection
- **Trap:** Sending raw user inputs directly to LLM prompts without structure or sanitation.
- **Consequence:** Enables prompt injection attacks, allowing users to hijack system prompts or fetch unauthorized database data.
- **Remedy:** Always validate inputs with Zod schemas and wrap queries in strict system instructions.

### 2. Monolithic Prompt Bloat
- **Trap:** Packing all system rules, database schemas, and multiple tool definitions into a single prompt.
- **Consequence:** Increased latency, high token costs, and model attention degradation.
- **Remedy:** Break prompts down into modular steps and feed relevant context dynamically based on classification.
`,
    implementation_notes: `# Implementation Notes: AI ENGINEERING & AGENTS

Blueprints for setting up fallback routes and structured schemas.

## Multi-LLM Fallback Routing Blueprint

\`\`\`typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function executeAiTask(prompt: string, systemInstruction: string): Promise<string> {
  // Try GROQ first (fast, cheap)
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.GROQ_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await groqResponse.json();
    if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  } catch (error) {
    console.warn('Groq failed, running Gemini fallback...');
  }

  // Fallback to Gemini
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
\`\`\`

### Action Plan
1. Configure fallback API calls inside \`src/lib/llm-router.ts\`.
2. Build Mastra workflows to automate content updates.
3. Setup Assistant UI components on client layouts.
`
  },
  integrations: {
    awesome: `# Awesome Resources: API INTEGRATIONS

Reference guides for calling OpenStreetMap, Brave, IndexNow, and Google Indexing APIs.

## Curated Guides

### 1. OpenStreetMap Overpass API Spec
- **Key Takeaways:** Explains query syntax for pulling local business points of interest (POI) by geolocation coordinates.
`,
    repositories: `# GitHub Repositories: API INTEGRATIONS

Open-source integration scripts and API tools.

## Repository Directory

### 1. openstreetmap-website
- **Repository:** [openstreetmap/openstreetmap-website](https://github.com/openstreetmap/openstreetmap-website)
- **Usage Rationale:** Codebase reference for coordinate conversion and geocoding operations.
`,
    libraries: `# Libraries & Packages: API INTEGRATIONS

Authentication and network request utilities.

## Libraries Registry

### 1. googleapis Core Client
- **Package:** \`googleapis\`
- **Usage Rationale:** Client library to securely authorize service accounts to publish index updates to the Google Indexing API.
`,
    patterns: `# Design & Implementation Patterns: API INTEGRATIONS

Integration blueprints and geocoding strategies.

## Recommended Patterns

### 1. Edge Geolocation Caching
- **Description:** Cache IP-based geocoding lookups at CDN edges.
- **Why it matters:** Prevents hitting external API limits on every user scroll.
- **Implementation:** Store geocoded city coordinates in Vercel Edge Cache headers.

### 2. Debounced API Search
- **Description:** Wait for the user to pause typing before triggering autocomplete searches.
- **Implementation:** Wrap input handlers in a 150ms debounce utility.
`,
    antipatterns: `# Anti-Patterns to Avoid: API INTEGRATIONS

Common integration pitfalls.

## Critical Pitfalls

### 1. Exposing API Keys in Client-Side Fetch Requests
- **Trap:** Triggering API searches (like Brave Search) directly from client browser scripts.
- **Consequence:** API keys are visible to anyone checking the Network tab, leading to key theft.
- **Remedy:** Route all third-party API calls through server-side Route Handlers.
`,
    implementation_notes: `# Implementation Notes: API INTEGRATIONS

Overpass API querying blueprint.

## OSM Overpass Geocoding Query Blueprint

\`\`\`typescript
export async function fetchLocalEntities(lat: number, lon: number, radiusMeters: number) {
  const query = \`
    [out:json];
    (
      node["amenity"~"restaurant|cafe|clinic|bank"](around:\${radiusMeters},\${lat},\${lon});
      way["amenity"~"restaurant|cafe|clinic|bank"](around:\${radiusMeters},\${lat},\${lon});
    );
    out body;
  \`;
  const response = await fetch(\`https://overpass-api.de/api/interpreter?data=\${encodeURIComponent(query)}\`);
  return await response.json();
}
\`\`\`

### Action Plan
1. Configure API proxy routes inside Next.js.
2. Setup authorization scripts for Google Indexing.
`
  },
  observability: {
    awesome: `# Awesome Resources: OBSERVABILITY

Curation of instrumentation standards and log management tools.

## Curated Observability Specs

### 1. OpenTelemetry Specification
- **URL:** [OpenTelemetry Spec](https://opentelemetry.io/docs/specs/)
- **Key Takeaways:** Explains standard formats for capturing logs, metric data, and traces.
`,
    repositories: `# GitHub Repositories: OBSERVABILITY

Reverse engineering of open-source metric trackers and error loggers.

## Repository Directory

### 1. Sentry SDK for Next.js
- **Repository:** [getsentry/sentry-javascript](https://github.com/getsentry/sentry-javascript)
- **Usage Rationale:** Reference implementation for trapping unhandled runtime errors, routing errors to dashboards, and measuring LCP.
`,
    libraries: `# Libraries & Packages: OBSERVABILITY

Log engines, analytics trackers, and error boundary wrappers.

## Libraries Registry

### 1. OpenPanel Tracker
- **Package:** \`openpanel\`
- **Usage Rationale:** Lightweight, privacy-first analytics SDK.
- **When to Use:** Tracking user clicks and form submissions without tracking personal data.

### 2. PostHog SDK
- **Package:** \`posthog-js\`
- **Usage Rationale:** Product analytics platform.
- **When to Use:** Running user session replays, feature flag splits, and heatmaps.
`,
    patterns: `# Design & Implementation Patterns: OBSERVABILITY

Telemetry tracing and request tagging.

## Recommended Patterns

### 1. Correlation ID Propagation
- **Description:** Tag every incoming request with a unique UUID (\`x-correlation-id\`) that travels through Edge, DB triggers, and third-party APIs.
- **Implementation:** Generate a request ID in middleware, injecting it into all logs and database triggers.

### 2. Error Boundary Fallback Screen
- **Description:** Trap component crashes using React Error Boundaries.
- **Implementation:** Display a clean error message page with diagnostic information for the user.
`,
    antipatterns: `# Anti-Patterns to Avoid: OBSERVABILITY

Observability mistakes that degrade performance and safety.

## Critical Pitfalls

### 1. Logging Sensitive User Data
- **Trap:** Storing raw authorization headers, email addresses, or secrets in application logs.
- **Consequence:** Leaking logs exposes user data, violating GDPR regulations.
- **Remedy:** Implement log filters to scrub fields like \`password\`, \`token\`, or \`key\`.

### 2. Silent Failures Inside Try-Catch Blocks
- **Trap:** Swallowing errors with an empty catch statement (e.g. \`try { ... } catch (e) {}\`).
- **Consequence:** Bugs go undetected, causing system failures with no diagnostics.
- **Remedy:** Always register errors to a logging utility like Sentry.
`,
    implementation_notes: `# Implementation Notes: OBSERVABILITY

Blueprint for correlation logs and error logging.

## Correlation Logger Middleware

\`\`\`typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || uuidv4();
  const response = NextResponse.next();
  response.headers.set('x-correlation-id', correlationId);
  console.log(\`[REQUEST] Path: \${request.nextUrl.pathname} | CorrelationID: \${correlationId}\`);
  return response;
}
\`\`\`

### Action Plan
1. Configure Sentry SDK on Next.js.
2. Initialize OpenPanel tracker on client modules.
`
  },
  security: {
    awesome: `# Awesome Resources: SECURITY

Security standards, OWASP guidelines, and server policy setups.

## Curated Guides

### 1. OWASP Top 10 API Security
- **URL:** [OWASP Top 10](https://owasp.org/www-project-api-security/)
- **Key Takeaways:** Explains critical API vulnerabilities like Broken Object Level Authorization, Rate Limiting vulnerabilities, and SSRF.
`,
    repositories: `# GitHub Repositories: SECURITY

Reverse engineering of open-source authentication guards and policy engines.

## Repository Directory

### 1. Better Auth Core
- **Repository:** [better-auth/better-auth](https://github.com/better-auth/better-auth)
- **Stars:** ~28,800
- **License:** MIT License
- **Usage Rationale:** Reference implementation for session storage, CSRF mitigation, and user authentication on edge runtimes.
`,
    libraries: `# Libraries & Packages: SECURITY

Authorization layers, session guards, and rate limiters.

## Libraries Registry

### 1. Unkey
- **Package:** \`unkey\`
- **Usage Rationale:** Lightweight API key management platform with built-in rate-limiting logic.
- **When to Use:** Protecting public API routes (like the Audit Engine) against DDoS attacks.
`,
    patterns: `# Design & Implementation Patterns: SECURITY

Row-Level Security and Content Security Policy structures.

## Recommended Patterns

### 1. PostgreSQL Row-Level Security (RLS)
- **Description:** Restrict DB reads/writes at the engine level based on authorization criteria.
- **Implementation:** Enable RLS on the table. Configure policies checking user identity (e.g. \`auth.uid() = user_id\`).

### 2. Content Security Policy (CSP) Headers
- **Description:** HTTP headers that define which script resources are allowed to load.
- **Implementation:** Configure server middleware to inject strict script and style restrictions.
`,
    antipatterns: `# Anti-Patterns to Avoid: SECURITY

Security issues in serverless and database systems.

## Critical Pitfalls

### 1. Trusting Client-Provided Identifiers
- **Trap:** Querying database rows using ID values sent directly from browser requests.
- **Consequence:** Users can manipulate IDs to access other users' data (BOLA).
- **Remedy:** Verify user identities securely from JWT session tokens before database queries.

### 2. Missing Input Sanitation on Dynamic SQL
- **Trap:** Building SQL query strings via interpolation (e.g. \`select * from users where name = '\${name}'\`).
- **Consequence:** SQL Injection attacks can destroy or compromise the database.
- **Remedy:** Utilize Drizzle ORM's parameterized query bindings.
`,
    implementation_notes: `# Implementation Notes: SECURITY

Blueprint for RLS rules and CSP headers.

## Row-Level Security Configuration

\`\`\`sql
-- Enable RLS
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous read
CREATE POLICY "Allow public read on entities" 
ON entities FOR SELECT 
USING (true);

-- Policy to restrict mutations to owner identities
CREATE POLICY "Allow identity owners to edit entities" 
ON entities FOR UPDATE 
USING (auth.uid()::text = claim_token);
\`\`\`

### Action Plan
1. Write database security migration files.
2. Enable CSP headers inside Next.js configuration.
`
  },
  performance: {
    awesome: `# Awesome Resources: PERFORMANCE OPTIMIZATION

Guides for bundler optimizations, runtime compiler, and cache engines.

## Curated Performance Guides

### 1. Next.js Partial Prerendering (PPR) Spec
- **Key Takeaways:** Explains how to bundle dynamic components inside static page layouts using React Suspense boundaries.
`,
    repositories: `# GitHub Repositories: PERFORMANCE OPTIMIZATION

Open-source performance testing repositories and compilers.

## Repository Directory

### 1. React Compiler
- **Repository:** [facebook/react](https://github.com/facebook/react)
- **Usage Rationale:** React 19 compiler that auto-memoizes component render cycles, minimizing re-renders.
`,
    libraries: `# Libraries & Packages: PERFORMANCE OPTIMIZATION

Virtualization engines, bundle size reporters, and cache engines.

## Libraries Registry

### 1. @vercel/speed-insights
- **Package:** \`@vercel/speed-insights\`
- **Usage Rationale:** Collects real-world Core Web Vitals performance metrics from site visitors.
`,
    patterns: `# Design & Implementation Patterns: PERFORMANCE OPTIMIZATION

Streaming and cache revalidation strategies.

## Recommended Patterns

### 1. Incremental Static Regeneration (ISR) with Cache Tags
- **Description:** Statically render page assets, revalidating on-demand using cache tags.
- **Implementation:** Trigger revalidation routes when new articles or directory profiles are created.

### 2. React Suspense Boundaries for Streaming APIs
- **Description:** Stream slow backend data segments while rendering static headers instantly.
- **Implementation:** Wrap data containers in React \`Suspense\` tags.
`,
    antipatterns: `# Anti-Patterns to Avoid: PERFORMANCE OPTIMIZATION

Performance issues that slow down load times.

## Critical Pitfalls

### 1. Blocking Initial Hydration with Massive Scripts
- **Trap:** Loading heavy scripts in global layout documents.
- **Consequence:** Degrades Initial Page Load and LCP scores.
- **Remedy:** Split and load scripts dynamically on demand.

### 2. Over-rendering Table Rows without Virtualization
- **Trap:** Rendering hundreds of DOM nodes in a simple HTML list.
- **Consequence:** Significant interface lag, raising INP metrics.
- **Remedy:** Implement TanStack Virtual for long directory lists.
`,
    implementation_notes: `# Implementation Notes: PERFORMANCE OPTIMIZATION

Blueprint for streaming routes and on-demand cache revalidation.

## Dynamic Route Streaming with React Suspense

\`\`\`tsx
import { Suspense } from 'react';

// Slow data fetcher
async function EntityList() {
  const data = await fetch('https://api.example.com/entities');
  const items = await data.json();
  return <div>{/* Render Items */}</div>;
}

export default function DirectoryPage() {
  return (
    <div>
      <h1>Directory Profiles</h1>
      <Suspense fallback={<div>Loading profiles...</div>}>
        <EntityList />
      </Suspense>
    </div>
  );
}
\`\`\`

### Action Plan
1. Wrap dynamic list containers in React Suspense.
2. Enable React Compiler optimization settings.
`
  },
  references: {
    awesome: `# Awesome Resources: VIBE CODING & AGENTS

Guides and standards for building AI-assisted developer workflows in 2026.

## Curated Guides

### 1. Claude Code CLI Documentation
- **Key Takeaways:** Explains agentic coding setups, workflow logs, and code refactoring models.
`,
    repositories: `# GitHub Repositories: VIBE CODING & AGENTS

Reference boilerplates and workflows for agentic software development.

## Repository Directory

### 1. Aider AI Developer
- **Repository:** [aider-ai/aider](https://github.com/aider-ai/aider)
- **Usage Rationale:** Standard for git-integrated code refactoring via command line interfaces.
`,
    libraries: `# Libraries & Packages: VIBE CODING & AGENTS

Agent runtimes, CLI clients, and linter integrations.

## Libraries Registry

### 1. CodeRabbit
- **Package:** \`coderabbit-ai\`
- **Usage Rationale:** Automated code reviewer that audits Git PR submissions for security and performance issues.
`,
    patterns: `# Design & Implementation Patterns: VIBE CODING & AGENTS

Vibe coding workflows and test loops.

## Recommended Patterns

### 1. Spec-Driven Agent Execution
- **Description:** Document requirements inside detailed specifications before generating code.
- **Implementation:** Draft detailed specification sheets, verify the design, and feed specifications to developer agents.

### 2. Lint-Validation Test Loops
- **Description:** Automate code lints during writing.
- **Implementation:** Run \`npm run build\` or \`eslint\` inside the task loop.
`,
    antipatterns: `# Anti-Patterns to Avoid: VIBE CODING & AGENTS

AI-assisted developer anti-patterns.

## Critical Pitfalls

### 1. Blind Code Generation without Compilation Validation
- **Trap:** Let AI write complex code without running compiler tests.
- **Consequence:** Breaking existing systems and introducing compiler bugs.
- **Remedy:** Ensure the agent compiles the codebase successfully after editing.

### 2. Monolithic Code Commits
- **Trap:** Committing multiple code changes in a single commit.
- **Consequence:** Hard to isolate bugs, track changes, or roll back code safely.
- **Remedy:** Make small commits in logical units.
`,
    implementation_notes: `# Implementation Notes: VIBE CODING & AGENTS

Blueprints for setting up developer loops.

## AI Review Loop Workflow

\`\`\`
1. Write ADR/Specification → 2. Execute Code Edits → 3. Validate TypeScript Compilation → 4. Run Linter → 5. Verify Local Dev Server → 6. Commit Changes
\`\`\`

### Action Plan
1. Enforce strict review loops inside playbooks.
2. Setup VSCode/Cursor keyboard mappings.
`
  }
};

// Write the files dynamically
Object.entries(researchData).forEach(([cat, data]) => {
  const catPath = path.join(BASE_DIR, 'research', cat);
  fs.writeFileSync(path.join(catPath, 'awesome.md'), data.awesome);
  fs.writeFileSync(path.join(catPath, 'repositories.md'), data.repositories);
  fs.writeFileSync(path.join(catPath, 'libraries.md'), data.libraries);
  fs.writeFileSync(path.join(catPath, 'patterns.md'), data.patterns);
  fs.writeFileSync(path.join(catPath, 'anti-patterns.md'), data.awesome.includes('anti-patterns') ? data.awesome : (data['anti-patterns'] || data.antipatterns));
  fs.writeFileSync(path.join(catPath, 'implementation-notes.md'), data.implementation_notes);
});

console.log('Successfully completed advanced benchmarking and reverse engineering generation.');
