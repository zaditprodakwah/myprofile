# Implementation Notes: DESIGN SYSTEM

Tailwind CSS v4 setup and theme configuration.

## Tailwind CSS v4 CSS Configuration

```css
@import "tailwindcss";

@theme {
  --color-slate-900: #0f172a;
  --color-slate-800: #1e293b;
  --color-teal-500: #0d9488;
  --color-gold-500: #d97706;

  --font-display: "Plus Jakarta Sans", sans-serif;
  --font-sans: "Inter", sans-serif;
}
```

### Action Plan
1. Configure Tailwind CSS v4 theme.
2. Wrap Radix primitive elements in custom Tailwind wrapper components.
3. Apply micro-animations on interactive elements.
