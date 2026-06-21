# Design & Implementation Patterns: DESIGN SYSTEM

Tailwind CSS v4 tokens and theme variables.

## Recommended Patterns

### 1. CSS Custom Property Tokens
- **Description:** Define theme variables in root CSS rules rather than JS config variables.
- **Why it matters:** Instantly updates styling globally with zero runtime script execution.
- **Implementation:** Use Tailwind v4 custom theme mappings.

### 2. Apple-Level Micro-interactions
- **Description:** Subtle, physics-based springs on button clicks and hover states.
- **Implementation:** Combine Tailwind utility classes with Framer Motion `type: "spring"` transition parameters.
