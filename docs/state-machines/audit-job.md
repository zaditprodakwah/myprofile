# State Machine: Audit Job

## Overview
The Audit Job State Machine orchestrates the lifecycle of a single digital property audit. It is strictly enforced via the Orchestrator, projecting states entirely from emitted events.

## Explicit States
1. `QUEUED` - Job registered, waiting for worker pickup.
2. `VALIDATING` - Performing initial checks (DNS, entity resolution).
3. `DISCOVERING` - Autonomous discovery (robots.txt, sitemap parsing).
4. `AUDITING` - Raw data collection via external tools.
5. `COLLECTING` - Worker is fetching raw data.
6. `NORMALIZING` - Raw data parsing into normalized schemas (Analyzer Engine).
7. `SCORING` - Evaluating normalized data against heuristic rules.
8. `RECOMMENDING` - Generating specific actionable rules.
9. `AI_ENRICHMENT` - Preparing inputs and sending to LLM for insights (Future Phase).
10. `VALIDATING_AI` - Validating the structured output (JSON schema) from LLM (Future Phase).
11. `PERSISTING` - Preparing the final domain structures to save to DB.
12. `PUBLISHING` - Broadcasting the snapshot to the public directory.
13. `COMPLETED` - Entire lifecycle successfully finished.
14. `FAILED` - Terminal error encountered.
15. `CANCELLED` - Cancelled by admin or user.
16. `EXPIRED` - Job timed out before completion.

## Transition Rules
- `QUEUED` -> `VALIDATING`, `CANCELLED`, `EXPIRED`
- `VALIDATING` -> `DISCOVERING`, `FAILED`
- `DISCOVERING` -> `AUDITING`, `FAILED`
- `AUDITING` -> `COLLECTING`, `FAILED`
- `COLLECTING` -> `NORMALIZING`, `FAILED`
- `NORMALIZING` -> `SCORING`, `FAILED`
- `SCORING` -> `RECOMMENDING`, `FAILED`
- `RECOMMENDING` -> `PUBLISHING`, `FAILED` (AI Enrichment skipped for now)
- `AI_ENRICHMENT` -> `VALIDATING_AI`, `FAILED`
- `VALIDATING_AI` -> `PERSISTING`, `AI_ENRICHMENT`, `FAILED`
- `PERSISTING` -> `PUBLISHING`, `FAILED`
- `PUBLISHING` -> `COMPLETED`, `FAILED`
- Any active state -> `FAILED` (if unexpected error occurs and retries exhausted).
- Retry transitions create a new `AuditRun`, not a new `Job`.
