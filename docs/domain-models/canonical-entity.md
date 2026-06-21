# Domain Model: Canonical Entity Identity

## Concept
PresenceOS treats digital footprints as properties belonging to a core canonical identity.

### Hierarchy
```text
Entity (Base)
 ├── Organization
 ├── Person
 ├── Brand
 ├── Website
 ├── Product
 └── Unknown
```

## Flow of Resolution
When a user submits a URL (`nike.com`) to the system:
1. **Acquisition Log:** `utility_leads` captures the raw input `nike.com`.
2. **Entity Resolution:** The system determines if `nike.com` belongs to an existing `Entity` or creates a new one.
3. **Canonical Type:** The Entity is classified as an `Organization` (e.g., Nike Inc.) and `Brand` (Nike).
4. **Domain Attachment:** The `Domain` entity (`nike.com`) is attached to the `Organization`.
5. **Snapshot Lifecycle:** Future audits on `nike.com` are stored as `Snapshot` records linked to the `Domain`.

## Rules
- Entities must never be deleted, only merged or soft-deleted.
- Snapshots are immutable records in time.
- Entity Resolution happens asynchronously via background workers.
