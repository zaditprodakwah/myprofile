# Implementation Notes: SYSTEM ARCHITECTURE

Blueprints for building ports and processing event streams.

## Hexagonal Database Port Blueprint

```typescript
// Core Domain Port
export interface EntityDatabasePort {
  findEntityBySlug(slug: string): Promise<Entity | null>;
  saveEntity(entity: Entity): Promise<void>;
}

// Supabase Adapter Implementation
export class SupabaseEntityAdapter implements EntityDatabasePort {
  constructor(private client: any) {}

  async findEntityBySlug(slug: string): Promise<Entity | null> {
    const { data } = await this.client
      .from('entities')
      .select('*')
      .eq('slug', slug)
      .single();
    return data ? this.mapToDomain(data) : null;
  }

  async saveEntity(entity: Entity): Promise<void> {
    await this.client.from('entities').upsert(this.mapToDb(entity));
  }

  private mapToDomain(dbRow: any): Entity { return dbRow; }
  private mapToDb(domain: Entity): any { return domain; }
}
```

### Action Plan
1. Declare core interfaces for adapters under `src/modules/core/ports`.
2. Wrap external databases and APIs (Supabase, Brave Search) in adapters.
3. Configure event store and projection handlers.
