# Anti-Patterns to Avoid: TRUST DESIGN

Trust-killing practices.

## Critical Pitfalls
### 1. Hiding Billing and Credit Deductions
- **Trap:** Deducting credits for background agent operations without writing transaction log rows.
- **Consequence:** Users feel cheated and lose trust in the system.
- **Remedy:** Log every single deduction to the `credit_transactions` table, showing the exact event ID.

### 2. Obscured Data Collection
- **Trap:** Scraping local businesses or running site audits without displaying clear crawler user-agent headers.
- **Consequence:** System IP ranges get banned by target hosts.
- **Remedy:** Publish target crawlers and explain details transparently.
