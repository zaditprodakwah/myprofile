# Anti-Patterns to Avoid: INTERACTION DESIGN

Interface and transition traps.

## Critical Pitfalls
### 1. Layout Jumping
- **Trap:** Content shifting when dynamic elements (like buttons or validation text) load.
- **Consequence:** Users accidentally click wrong links, degrading visual stability (CLS).
- **Remedy:** Reserve container sizes in CSS before elements render.

### 2. Linear Animation curves
- **Trap:** Using static linear transition rates for interface animations.
- **Consequence:** Animations look mechanical and unpolished.
- **Remedy:** Apply spring physics or easing curves (`cubic-bezier`).
