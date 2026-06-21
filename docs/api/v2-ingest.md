# API Specification: `/api/v2/ingest`

## Overview
The ingestion endpoint is the entry point for all digital properties into PresenceOS. It does not perform the audit synchronously. It creates an ingestion log and emits the `AuditRequested` event.

## Endpoint Details
- **Method:** POST
- **Path:** `/api/v2/ingest`
- **Auth:** Public
- **Rate Limit:** 50 requests per IP per hour.
- **Version:** v2

## Feature Flag
- Feature Flag `AUDIT_PIPELINE_V2` must be enabled to route jobs to the new orchestrator. If disabled, fallback to legacy processing.

## Request Schema
```json
{
  "target_url": "string (required, format: uri)",
  "email": "string (optional, format: email)",
  "source": "string (optional, default: 'web_form')"
}
```

## Response Schema
**202 Accepted**
```json
{
  "job_id": "uuid",
  "status": "QUEUED",
  "message": "Audit successfully requested"
}
```

**400 Bad Request**
```json
{
  "error": "Invalid URL format"
}
```

## Behavior
1. Validates input schema.
2. Inserts a record into `utility_leads` for legacy compatibility and acquisition tracking.
3. Appends an `AuditRequested` event to `job_events` Event Store.
4. Returns the `job_id` asynchronously.
