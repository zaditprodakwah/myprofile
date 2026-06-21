# Anti-Patterns to Avoid: PERFORMANCE OPTIMIZATION

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
