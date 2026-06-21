# Implementation Notes: MODERN SEO & GEO (2026)

Blueprints for setting up metadata and structured schemas.

## Dynamic JSON-LD Graph Construction

```typescript
import { LocalBusiness, WebPage, WithContext } from 'schema-dts';

export function generateEntityGraph(entityName: string, city: string): WithContext<any> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `https://zadit.dev/directory/${city}#entity`,
        "name": entityName,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city
        }
      },
      {
        "@type": "WebPage",
        "@id": `https://zadit.dev/directory/${city}`,
        "mainEntity": {
          "@type": "Person",
          "name": "Muhammad Khoiruzzadittaqwa"
        },
        "mentions": {
          "@id": `https://zadit.dev/directory/${city}#entity`
        }
      }
    ]
  };
}
```

### Action Plan
1. Construct sitemap generation routes reading directly from Supabase.
2. Apply Definition-First styling rules on all articles.
3. Inject the dynamic entity graph into page headers.
