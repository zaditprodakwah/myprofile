# Anti-Patterns to Avoid: HUMAN-AI INTERACTION

AI UX mistakes.

## Critical Pitfalls
### 1. Monolithic AI generation blocks
- **Trap:** Forcing the user to wait for a 1000-word rewritten article to compile fully before rendering any text in the viewport.
- **Consequence:** High latency experience, user assumes the page crashed.
- **Remedy:** Stream text outputs using Server Sent Events (SSE).

### 2. Non-Editable AI Outputs
- **Trap:** Showing AI-generated text inside read-only containers.
- **Consequence:** Users cannot correct minor LLM errors without restarting the prompt cycle.
- **Remedy:** Render AI outputs inside standard text areas or block editors.
