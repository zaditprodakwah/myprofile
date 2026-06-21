# Design & Implementation Patterns: INTERACTION DESIGN

Optimistic UI updates and undo transitions.

## Recommended Patterns
### 1. Optimistic UI Updates
- **Pattern:** Update the UI state instantly to show success before the server response completes. Roll back only if the API fails.
- **Why it matters:** Makes the interface feel instantaneous.

### 2. Skeleton Screen Loading
- **Pattern:** Show gray, pulsing layout skeletons that match the final content structure during fetch queries.
- **Why it matters:** Lowers perceived loading latency compared to blank screens.
