# Implementation Notes: SECURITY

Blueprint for RLS rules and CSP headers.

## Row-Level Security Configuration

```sql
-- Enable RLS
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous read
CREATE POLICY "Allow public read on entities" 
ON entities FOR SELECT 
USING (true);

-- Policy to restrict mutations to owner identities
CREATE POLICY "Allow identity owners to edit entities" 
ON entities FOR UPDATE 
USING (auth.uid()::text = claim_token);
```

### Action Plan
1. Write database security migration files.
2. Enable CSP headers inside Next.js configuration.
