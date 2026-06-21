# Design & Implementation Patterns: HUMAN-AI INTERACTION

Editable outputs and human-in-the-loop loops.

## Recommended Patterns
### 1. Explain Before Acting
- **Pattern:** Before performing heavy database mutations or triggering programmatic API crawls, state what the AI plans to do and request approval.
- **Why it matters:** Avoids unexpected resource charges and keeps the user in control.

### 2. Versioned Outputs with Diff views
- **Pattern:** When an agent rewrites an article, save the version history and allow the user to view modifications in a side-by-side diff.
