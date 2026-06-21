# Anti-Patterns to Avoid: OBSERVABILITY

Observability mistakes that degrade performance and safety.

## Critical Pitfalls

### 1. Logging Sensitive User Data
- **Trap:** Storing raw authorization headers, email addresses, or secrets in application logs.
- **Consequence:** Leaking logs exposes user data, violating GDPR regulations.
- **Remedy:** Implement log filters to scrub fields like `password`, `token`, or `key`.

### 2. Silent Failures Inside Try-Catch Blocks
- **Trap:** Swallowing errors with an empty catch statement (e.g. `try { ... } catch (e) {}`).
- **Consequence:** Bugs go undetected, causing system failures with no diagnostics.
- **Remedy:** Always register errors to a logging utility like Sentry.
