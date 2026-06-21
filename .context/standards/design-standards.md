# Design System & UI/UX Standards

Standards for color tokens, typography, and micro-interaction styling.

## 1. Styling & Tokens (Tailwind CSS v4)
- **Theme Variables:** All sizes, typography elements, and colors must be mapped to CSS Custom Properties inside the `@theme` layout layer.
- **Editorial Color Palette:** Primary dark surfaces must use slate colors (`#0f172a` / `#1e293b`), body background warm alabaster (`#f8fafc`), and accent highlights teal (`#0d9488`) and gold (`#d97706`).
- **Arbitrary Values:** Avoid hardcoded arbitrary values (e.g., `w-[342px]`). Align layout items strictly with the 8px layout grid.

## 2. Typography Hierarchy
- **Title Displays:** Use `Plus Jakarta Sans` (bold, uppercase trackers, letter-spacing: -0.02em) for H1 and display elements.
- **Body Content:** Use `Inter` (line-height: 1.7) for body articles to maximize readability.
- **Precision Data:** Use `JetBrains Mono` for numeric statistics, code blocks, and category badge elements.
