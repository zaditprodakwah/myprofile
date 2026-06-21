# Awesome Resources: FRONTEND UI & UX

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
  - **Keyboard-First:** Full keyboard navigation support (e.g., `j/k` to navigate list, `enter` to open, `c` to create).
