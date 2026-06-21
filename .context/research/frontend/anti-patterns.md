# Anti-Patterns to Avoid: FRONTEND UI & UX

Frontend anti-patterns that degrade user experience and Core Web Vitals.

## Critical Pitfalls

### 1. Scroll Chaining and Layout Shifts
- **Pitfall:** Nesting custom scroll containers inside other scroll containers without setting proper height properties.
- **Consequence:** Causes layout jumping and scrolls parent body on trackpad gestures, breaking Lenis smooth-scroll.
- **Remedy:** Force custom layout panels to use `overflow-y-auto h-full` with absolute height limits.

### 2. Heavy Client-Side Hydration on Initial Load
- **Pitfall:** Importing massive Rich Text Editors or Flow Canvases dynamically in root layout bundles.
- **Consequence:** Massive Increase in Total Blocking Time (TBT) and LCP latency.
- **Remedy:** Lazily load heavy libraries using React's `next/dynamic` with `ssr: false` and spinner placeholders.

### 3. Text Fields without Autosave or Optimistic Updates
- **Pitfall:** Forcing users to click a global "Submit" button to save dashboard config updates.
- **Consequence:** Frustrating user experience on flaky network connections.
- **Remedy:** Implement debounce autosave (e.g., 500ms) with visible saving/saved indicators.
