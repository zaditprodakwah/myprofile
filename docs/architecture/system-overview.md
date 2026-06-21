# PresenceOS System Overview

## Purpose
PresenceOS is a Digital Presence Intelligence Platform. The system aggregates, audits, and analyzes digital properties (organizations, domains, social profiles, resumes) to provide actionable insights and AI-driven recommendations.

## Core Characteristics
- **Architecture-First:** Strict adherence to Domain-Driven Design (DDD) and Event-Driven Architecture (EDA).
- **Serverless-First:** Uses Vercel and Edge network infrastructure.
- **Data Source of Truth:** Supabase PostgreSQL with additive-only migrations.
- **Event-Sourced Subsystems:** Key processes like Auditing use a Job Orchestrator with an explicit Append-Only Event Store.
- **AI-Native:** Integrates Large Language Models as specific enrichment nodes in the data pipeline, not as generic text generators.

## High-Level Modules
- `identity/`: User, authentication, claims.
- `entity/`: Canonical entities (Organization, Person, Brand, Website).
- `audit/`: Core auditing pipelines and job orchestration.
- `discovery/`: Autonomous crawling and sitemap parsing.
- `ai/`: AI recommendation generation and rule engines.
- `directory/`: Public-facing pages driven by programmatic SEO.
- `billing/`: Credits and subscription management.
