# Phase 3 Blueprint: Entity Intelligence Layer

---

# 1. ARCHITECTURE DECISION RECORDS (ADR)

## ADR-003-1: Entity Graph Model
* **Decision:** Implement an adjacency list (Node-Edge) graph model overlaid on top of PostgreSQL using standard relational tables (`entity_nodes`, `entity_edges`).
* **Reason:** Ensures transactional integrity, compatibility with existing tools, and simplifies the tech stack without requiring a dedicated graph database (like Neo4j) early on.
* **Consequences:** Graph queries will rely on SQL `JOIN`s and Recursive CTEs. Depth of traversal may need to be bounded.

## ADR-003-2: Deterministic Entity Resolution Strategy
* **Decision:** Entity resolution and merging must rely exclusively on 100% deterministic rules (e.g., exact domain matching, verified alias lookup, normalized string similarity thresholds).
* **Reason:** Guarantees reproducibility and prevents un-auditable merges. 
* **Consequences:** AI is strictly prohibited from executing canonical identity merges.

## ADR-003-3: Limitation of AI Role
* **Decision:** AI models are restricted to non-authoritative roles such as "Mention Enrichment", "Text Labeling", and "Suggestion Generation".
* **Reason:** Prevents AI hallucinations from polluting the authoritative graph truth.
* **Consequences:** AI outputs require a deterministic validation layer or explicit human approval before altering graph topology.

## ADR-003-4: Bounded Crawl Discovery Policy
* **Decision:** The Discovery Engine will prioritize exact mapping targets (e.g., sitemap.xml, explicit RSS feeds) with a hard-capped recursion depth for link expansion.
* **Reason:** Prevents infinite crawling loops and unbounded resource consumption.

---

# 2. DOMAIN MODEL (PHASE 3 EXTENSION)

## Core Abstractions
* **Entity (Base):** The foundational node. Contains `entity_id` (UUID), `canonical_id` (UUID - self-referencing if primary), `entity_type`, `created_at`.
* **Organization:** Inherits Entity. Represents businesses, DAOs, or incorporated groups.
* **Person:** Inherits Entity. Represents individuals (Optional future node).
* **Domain:** Inherits Entity. Represents an internet property (`example.com`). Serves as the primary linking pivot.
* **Mention:** A captured external signal (e.g., a news article, a social media post) that references an Entity.

## Lifecycle & Resolution Rules
* Entities begin in an `UNRESOLVED` state.
* The Entity Resolution Engine applies rules. If a match is found with an existing Canonical Entity, the new entity adopts the `canonical_id`. If not, it becomes its own Canonical Entity.
* Invariants: No two Canonical Entities can share the same normalized primary identifier (e.g., the same root domain).

---

# 3. GRAPH DATA MODEL DESIGN

* **Model Type:** Edge Table Model (Relational Adjacency List).
* **Relationship Typing System:** Edges have explicit types (e.g., `OWNS_DOMAIN`, `MENTIONS_ENTITY`, `SUBSIDIARY_OF`).
* **Confidence Scoring:** Edges contain a `confidence_score` (0-100) generated deterministically by the Rule Engine (e.g., Domain Ownership via WHOIS = 100, Co-occurrence in text = 50).
* **Deduplication Strategy:** Edges have a unique constraint on `(from_entity_id, to_entity_id, relationship_type)`.
* **Canonical Identity Rules:** Queries should primarily traverse between `canonical_id`s to avoid ghost-node fragmentation.

---

# 4. DATABASE EVOLUTION PLAN

*Additive-only SQL design:*

```sql
CREATE TABLE entity_nodes (
    id UUID PRIMARY KEY,
    canonical_id UUID REFERENCES entity_nodes(id),
    entity_type VARCHAR(50) NOT NULL,
    attributes JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE entity_edges (
    id UUID PRIMARY KEY,
    from_entity_id UUID REFERENCES entity_nodes(id),
    to_entity_id UUID REFERENCES entity_nodes(id),
    relationship_type VARCHAR(50) NOT NULL,
    confidence_score INT CHECK (confidence_score >= 0 AND confidence_score <= 100),
    rule_id VARCHAR(100) NOT NULL, -- Traceability
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(from_entity_id, to_entity_id, relationship_type)
);

CREATE TABLE entity_mentions (
    id UUID PRIMARY KEY,
    source_url TEXT NOT NULL,
    content_snippet TEXT,
    extracted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crawl_queue (
    id UUID PRIMARY KEY,
    target_url TEXT NOT NULL,
    depth INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);
```
*Constraints:* No existing Phase 1/Phase 2 schemas are altered.

---

# 5. EVENT SYSTEM EXTENSION

## New Events

1. **EntityDiscovered**
   * **Payload:** `{ source_url: string, raw_attributes: object }`
   * **Producer:** Discovery Engine
   * **Consumer:** Entity Resolution Engine

2. **EntityResolved**
   * **Payload:** `{ original_id: uuid, canonical_id: uuid, rule_id: string }`
   * **Producer:** Entity Resolution Engine
   * **Consumer:** Graph Construction Pipeline

3. **RelationshipInferred**
   * **Payload:** `{ from_id: uuid, to_id: uuid, rel_type: string, confidence: number, rule_id: string }`
   * **Producer:** Rule Engine
   * **Consumer:** Graph Construction Pipeline

4. **MentionCaptured**
   * **Payload:** `{ mention_id: uuid, source_url: string, context: string }`
   * **Producer:** Discovery Engine
   * **Consumer:** Enrichment Pipeline (AI Allowed here)

5. **GraphUpdated**
   * **Payload:** `{ entity_id: uuid, changes: array }`
   * **Producer:** Graph Construction Pipeline
   * **Consumer:** Analytics / View Projections

*All events must include `event_version` and `correlation_id` (traceability).*

---

# 6. DISCOVERY ENGINE DESIGN

* **Crawling Strategy:** Priority 1: `sitemap.xml`, Priority 2: RSS/Atom Feeds, Priority 3: Bounded link expansion.
* **Throttling Rules:** Maximum N requests per domain per minute (configurable via Redis/Token Bucket).
* **Deduplication:** URLs normalized (lowercase, trailing slash stripped, fragments removed) before insertion into `crawl_queue`.
* **Forbidden Loops:** Hard constraint `MAX_DEPTH = 3` for recursive link expansion.
* **Domain Boundary Rules:** Cross-domain link following is strictly disabled unless explicitly whitelisted (e.g., known social media profiles).

---

# 7. ENTITY RESOLUTION ENGINE

*Deterministic matching rules:*
* **Domain Normalization:** Strip `www.`, `http://`, `https://`.
* **String Similarity (Non-AI):** Jaro-Winkler or Levenshtein distance for Organization names. Threshold must be > 0.95 for auto-merge.
* **Alias Mapping:** Manual or deterministic dictionaries (e.g., "PT. Telkom" -> "Telkom Indonesia").
* **Canonical Selection:** The oldest entity ID becomes the canonical ID.
* **Conflict Resolution:** If constraints fail, emit a `ResolutionConflict` event and leave entities unmerged.

---

# 8. GRAPH CONSTRUCTION PIPELINE

**Flow Diagram:**
`Discovery Engine` → (emits `EntityDiscovered`) → `Mention Capture` → `Entity Resolution Engine` (deterministic) → `Edge Formation` (Applies rules) → `Graph Update` (SQL Insert) → (emits `GraphUpdated`).

* **Deterministic:** Same inputs always result in the exact same nodes and edges.
* **Replayable:** Sourced directly from `job_events`. Dropping `entity_edges` and re-running events must perfectly reconstruct the graph.

---

# 9. RISK ANALYSIS

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Graph Explosion** | High | Cap crawl depth, strict deduplication on URLs, rate limits on Discovery Engine. |
| **Incorrect Merging** | High | Auto-merge string similarity threshold set to 0.95+. Revert mechanism via canonical_id decoupling. |
| **Crawl Recursion** | Medium | Hard boundary rules; `crawl_queue` depth constraint; drop parameters (e.g., `?session=`). |
| **Event Inconsistency** | High | Distributed locks on canonical merging; idempotent event consumers. |

---

# 10. STATE MACHINE EXTENSION

*Additive states mapped for Phase 3 within existing architecture:*
* `DISCOVERING_GRAPH` - Active crawling and queue consumption.
* `RESOLVING_ENTITY` - Determining canonical identity.
* `MAPPING_RELATIONSHIPS` - Inferring and writing edges.

*These states complement Phase 2 and sit transparently in the job orchestration layer.*

---

# 11. IMPLEMENTATION SEQUENCING PLAN

1. **Database Migration:** Apply `03_phase3_entity_graph.sql` (Tables: `entity_nodes`, `entity_edges`, `entity_mentions`, `crawl_queue`).
2. **Event Contracts:** Define the 5 new Phase 3 events in TypeScript interfaces.
3. **Discovery Engine Worker:** Scaffold the crawler and queue consumer.
4. **Entity Resolution Engine:** Implement deterministic matching algorithms and canonical identity mapping.
5. **Graph Construction Pipeline:** Connect the resolution engine to SQL insertions.
6. **Observability Hooks:** Attach trace IDs and rule IDs to all graph mutations.
7. **Rollback Checkpoints:** Ensure Phase 3 can be safely bypassed via feature flag `PHASE_3_ENTITY_GRAPH=false`.

---

> **PHASE 3 DESIGN STATUS: READY FOR IMPLEMENTATION CONTRACT LOCK**

---

# 12. MANDATORY ARCHITECTURE FIXES (PRE-EXECUTION)

## 12.1 Explicit ID Strategy (Canonical Identity Constraint)
* **Rule:** Canonical entity MUST satisfy `canonical_id IS NULL OR canonical_id = id`
* **Constraint:** `CHECK (canonical_id IS NULL OR canonical_id = id)`

## 12.2 Event Store Consistency
* **Addition:** `event_sequence BIGSERIAL`
* **Rule:** Events MUST be strictly ordered per `aggregate_id`.

## 12.3 Graph Determinism Hash
* **Fix:** `GraphUpdated` events and edges must have a deterministic fingerprint.
* **Field:** `graph_hash VARCHAR(64)` generated from `SHA256(rule_id + from_id + to_id + relationship_type)`.

## 12.4 Crawl Queue Idempotency Guard
* **Constraint:** `UNIQUE(target_url, depth)`
* **Normalization:** `normalized_url TEXT`

## 12.5 Entity Merge Audit Trail
* **Table:** `entity_merge_history (id UUID, from_entity_id UUID, to_canonical_id UUID, rule_id TEXT, created_at TIMESTAMP)`

## 12.6 Graph Materialized View Layer
* **Addition:** `entity_graph_view` to decouple query layer from write layer and speed up analytics.

## 12.7 Edge Type Registry
* **Addition:** `entity_edge_types (type_id, name, description, weight_default)` instead of free-text relationship types.

## 12.8 Event Rebuild Safety Mode
* **Mode:** `graph_rebuild_mode BOOLEAN` to allow dropping the graph and replaying events safely.

---
