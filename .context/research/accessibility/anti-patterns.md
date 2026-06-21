# Anti-Patterns to Avoid: ACCESSIBILITY (A11Y)

Accessibility failures.

## Critical Pitfalls
### 1. Text as Images
- **Trap:** Rendering comparison data inside PNG images instead of HTML tables.
- **Consequence:** Screen readers skip the data, failing accessibility audits.
- **Remedy:** Render data inside structured HTML tables.

### 2. Disabling Focus Outlines
- **Trap:** Setting `outline: none` in global CSS files to clean up layouts.
- **Consequence:** Keyboard users cannot see where they are, breaking usability.
- **Remedy:** Style outlines using Tailwind focus rings.
