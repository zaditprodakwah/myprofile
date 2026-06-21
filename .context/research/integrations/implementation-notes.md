# Implementation Notes: API INTEGRATIONS

Overpass API querying blueprint.

## OSM Overpass Geocoding Query Blueprint

```typescript
export async function fetchLocalEntities(lat: number, lon: number, radiusMeters: number) {
  const query = `
    [out:json];
    (
      node["amenity"~"restaurant|cafe|clinic|bank"](around:${radiusMeters},${lat},${lon});
      way["amenity"~"restaurant|cafe|clinic|bank"](around:${radiusMeters},${lat},${lon});
    );
    out body;
  `;
  const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
  return await response.json();
}
```

### Action Plan
1. Configure API proxy routes inside Next.js.
2. Setup authorization scripts for Google Indexing.
