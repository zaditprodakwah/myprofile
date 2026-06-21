# Anti-Patterns to Avoid: API INTEGRATIONS

Common integration pitfalls.

## Critical Pitfalls

### 1. Exposing API Keys in Client-Side Fetch Requests
- **Trap:** Triggering API searches (like Brave Search) directly from client browser scripts.
- **Consequence:** API keys are visible to anyone checking the Network tab, leading to key theft.
- **Remedy:** Route all third-party API calls through server-side Route Handlers.
