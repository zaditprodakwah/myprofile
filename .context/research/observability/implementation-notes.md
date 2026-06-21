# Implementation Notes: OBSERVABILITY

Blueprint for correlation logs and error logging.

## Correlation Logger Middleware

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || uuidv4();
  const response = NextResponse.next();
  response.headers.set('x-correlation-id', correlationId);
  console.log(`[REQUEST] Path: ${request.nextUrl.pathname} | CorrelationID: ${correlationId}`);
  return response;
}
```

### Action Plan
1. Configure Sentry SDK on Next.js.
2. Initialize OpenPanel tracker on client modules.
