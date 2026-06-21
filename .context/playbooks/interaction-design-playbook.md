# Interaction Design Playbook

Motion, hover behaviors, loading screens, and optimistic client transitions.

## Interaction Guidelines
- **Optimistic State Toggles:** Instantly change toggles in the UI during server writes, rolling back only on API failures.
- **Skeleton Panels:** Use gray pulsing placeholders matching the structure of content containers during data fetching.
- **Apple-Level Motion:** Transitions must use spring physics with cubic-bezier easing instead of linear rates.
