# Anti-Patterns to Avoid: PRODUCT-LED GROWTH (PLG)

Growth pitfalls.

## Critical Pitfalls
### 1. Demanding Cards for Trial Audits
- **Trap:** Forcing credit card registration to access free credits.
- **Consequence:** 70%+ drop-off in user activations.
- **Remedy:** Offer free credits immediately upon registration.

### 2. Broken Payment Webhooks
- **Trap:** Updating payment status only on the frontend redirection page, skipping server webhooks.
- **Consequence:** Users pay but credits are not added if they close the browser tab too quickly.
- **Remedy:** Rely strictly on Xendit webhook endpoints to trigger credit updates.
