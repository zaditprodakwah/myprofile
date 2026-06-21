# Anti-Patterns to Avoid: SECURITY

Security issues in serverless and database systems.

## Critical Pitfalls

### 1. Trusting Client-Provided Identifiers
- **Trap:** Querying database rows using ID values sent directly from browser requests.
- **Consequence:** Users can manipulate IDs to access other users' data (BOLA).
- **Remedy:** Verify user identities securely from JWT session tokens before database queries.

### 2. Missing Input Sanitation on Dynamic SQL
- **Trap:** Building SQL query strings via interpolation (e.g. `select * from users where name = '${name}'`).
- **Consequence:** SQL Injection attacks can destroy or compromise the database.
- **Remedy:** Utilize Drizzle ORM's parameterized query bindings.
