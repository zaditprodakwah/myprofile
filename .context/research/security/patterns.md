# Design & Implementation Patterns: SECURITY

Row-Level Security and Content Security Policy structures.

## Recommended Patterns

### 1. PostgreSQL Row-Level Security (RLS)
- **Description:** Restrict DB reads/writes at the engine level based on authorization criteria.
- **Implementation:** Enable RLS on the table. Configure policies checking user identity (e.g. `auth.uid() = user_id`).

### 2. Content Security Policy (CSP) Headers
- **Description:** HTTP headers that define which script resources are allowed to load.
- **Implementation:** Configure server middleware to inject strict script and style restrictions.
