# Security Hardening Checklist

- [ ] Database RLS: Row-Level Security policies are active and tested on all Supabase tables.
- [ ] CSP Headers: middleware injects strict Content Security Policy script-src directives.
- [ ] Rate limits: public endpoints (like search or audit engine) are rate-limited via Unkey API.
- [ ] Input Validation: all request bodies are parsed and verified using Zod models.
- [ ] API Secrets: check code for NEXT_PUBLIC prefixes. Sensitive service keys must be kept server-side.
