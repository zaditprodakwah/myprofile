# Anti-Patterns to Avoid: SERVICE DESIGN

Service design pitfalls.

## Critical Pitfalls
### 1. Broken Post-Sign Up Journeys
- **Trap:** Allowing users to register and then redirecting them to a blank screen with no welcome messages or instructions.
- **Consequence:** High churn rates during the first 5 minutes.
- **Remedy:** Direct new sign-ups to the onboarding checklist page.

### 2. Silent Failures on Verification Emails
- **Trap:** Claim request triggers do not send confirmation emails.
- **Consequence:** Users think the system is broken and try to register multiple times.
- **Remedy:** Configure fallback transactional mail alerts.
