# Anti-Patterns to Avoid: DESIGN SYSTEM

Design system pitfalls to avoid.

## Critical Pitfalls

### 1. Arbitrary Hardcoded Tailwind Values
- **Trap:** Using brackets inside class names for sizes or colors (e.g. `bg-[#0f172a]` or `w-[342px]`).
- **Consequence:** Breaking visual consistency across pages; changes require updating multiple files.
- **Remedy:** Map all sizes, margins, and colors to CSS variables or custom utility classes in CSS.

### 2. Bypassing ARIA Accessibility Labels
- **Trap:** Rendering icon buttons (like `<Search />`) with no descriptive label.
- **Consequence:** Screen readers skip the component, failing WCAG compliance.
- **Remedy:** Always declare `aria-label` or wrap elements in Radix accessible markup.
