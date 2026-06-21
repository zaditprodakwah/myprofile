# Design & Implementation Patterns: OBSERVABILITY

Telemetry tracing and request tagging.

## Recommended Patterns

### 1. Correlation ID Propagation
- **Description:** Tag every incoming request with a unique UUID (`x-correlation-id`) that travels through Edge, DB triggers, and third-party APIs.
- **Implementation:** Generate a request ID in middleware, injecting it into all logs and database triggers.

### 2. Error Boundary Fallback Screen
- **Description:** Trap component crashes using React Error Boundaries.
- **Implementation:** Display a clean error message page with diagnostic information for the user.
