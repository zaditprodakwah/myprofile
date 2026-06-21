# Frontend & UI Development Standards

Standards for building responsive, premium, high-density, and keyboard-first Intelligence Consoles.

## 1. Layout & Information Architecture
- **Console Layout:** Use split-pane grids (using `react-resizable-panels`) with persistent drawer inspectors on the right panel.
- **Visual Density:** Design layouts with compact margins and borders, maximizing data readability for observability.
- **Global Navigation:** Implement a dual sidebar layout similar to Supabase Studio. Global navigation rail on the left (icons only), collapsible tree explorer on the sub-sidebar.
- **Universal Search:** Integrate a Cmd+K command palette via `cmdk`. All platform routes and core database entity models must be searchable from the palette.

## 2. Component Design & Keyboard-First UX
- **Keyboard Navigation:** Every dashboard panel must support keyboard shortcut actions (e.g., `Esc` to close drawers, `Arrow keys` to move focus on grid tables).
- **Virtualization:** All tables containing more than 50 rows must use `TanStack Virtual` to prevent DOM lag and keep INP metrics under 200ms.
- **Form States:** Forms must support autosave features (debounced at 500ms) with visible saving/saved indicators.

## 3. Micro-animations & Micro-interactions
- **Spring Transitions:** Button clicks, hover overlays, and panel toggles must use Framer Motion physics-based springs (e.g., `type: "spring"`, `stiffness: 300`, `damping: 20`).
- **View Transitions:** Clicking cards to open inspector panels must run under the CSS View Transitions API to morph layout items smoothly.
