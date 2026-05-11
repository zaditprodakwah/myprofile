# ✅ MASTER BLUEPRINT-PROMPT UPGRADE (SEGMENTED FOCUS MODE WEBSITE)

## SYSTEM ROLE

Act as a Principal Product Engineer + CRO Architect + Technical SEO Specialist. Build a multi-persona executive website that enforces segmentation immediately at entry, transforms into focus mode UI per segment, and routes users into dedicated funnels (B2B Marketing, Academic, Business). Prioritize conversion, lead capture, and scalable multi-revenue. Enforce Core Web Vitals excellence.

---

# 1) CORE CONCEPT: MULTI PERSONA WITHOUT CONFUSION

### Problem

Owner has multi persona (Growth/Marketing, Academic Consulting, Business/Docs), which normally reduces conversion due to unclear messaging.

### Solution Architecture

Implement a **Segmentation-First Design System**:

* Home is not a “portfolio page”.
* Home is a **Segmented Gateway**.
* Each segment activates a **Focus Mode Theme**:

  * copy changes
  * CTA changes
  * navigation changes
  * proof stack changes
  * inquiry form changes (prefilled)

Visitor should feel:

> “This site is tailored to me.”

---

# 2) UI/UX DESIGN SYSTEM: SEGMENTED FOCUS MODE ENGINE

## 2.1 Focus Mode Global Rules

Implement a global segment state:

* `segment = marketing | academic | business | neutral`
* store in URL query + localStorage:

  * `?mode=marketing`
* if mode exists, persist across pages.

### Focus Mode Visual Behavior

When mode is active:

* background becomes slightly dimmed + spotlight on main content
* top nav highlights relevant section
* CTA button label changes contextually
* proof stack block changes to relevant proof
* recommended case studies filter automatically applied

### Focus Mode Microcopy

Display a small indicator chip:

* `Mode: Marketing Systems`
* `Mode: Academic Excellence`
* `Mode: Business Intelligence`

Include “Switch Mode” dropdown.

---

# 3) HOMEPAGE STRUCTURE: SEGMENTED ENTRY FUNNEL (CRITICAL)

## 3.1 Above the Fold: Positioning One-Liner (Dynamic)

Instead of 1 static headline, use:

### Default Neutral Headline

**“Building Revenue Systems, Reputation Infrastructure, and Data-Driven Knowledge.”**

### Mode-Based Headline

* Marketing Mode: **“Engineering Growth Systems for Brands & Campaigns.”**
* Academic Mode: **“Academic Harm Reduction with Precision Data Methodology.”**
* Business Mode: **“Executive-Grade Documents, Slides, and Decision Support.”**

Subheadline must change accordingly.

---

## 3.2 Segmentation Selector (Hero Engine)

Use 3 bento cards with icons + 1-liner outcome:

* Marketing & Agency → “Scale conversion and dominate SERP.”
* Academic & Education → “Finish research with integrity & precision.”
* Business & General → “Turn ideas into executive-ready assets.”

Each card triggers:

* focus mode
* redirects to dedicated landing page:

  * `/lp/marketing`
  * `/lp/academic`
  * `/lp/business`

---

# 4) PROOF STACK: CONCRETE EEAT LAYER (NOT GENERIC)

## 4.1 Proof Stack Must be Contextual

Each mode must show proof relevant to that audience.

### Marketing Proof Stack

* “Rp 85M+ Managed Budget”
* “Off-page SEO DA80+ mapping”
* “Brand campaigns: Skintific, Vidio, by.U”
* “Full-funnel media planning matrix”

### Academic Proof Stack

* “S1 Pendidikan Matematika (IPK 3.71)”
* “SPSS/Excel modeling”
* “Citation accuracy workflow”
* “Academic Harm Reduction philosophy”

### Business Proof Stack

* “Executive slide structuring”
* “SOP and proposal writing”
* “Data storytelling”
* “Operational efficiency system”

Render these as:

* chips + mini cards + trust strip

---

# 5) NAVIGATION SYSTEM: STAY NAVIGABLE DESPITE MULTI PERSONA

## 5.1 Smart Navigation Rules

Navbar always has:

* Home
* Services
* Case Studies
* Radar
* Insights
* Tools
* Contact

But in Focus Mode:

* Services route automatically scrolls to relevant cluster
* Case studies auto-filter by category
* CTA changes label

### Example

If segment=marketing:

* “Request Strategy Call”
  If segment=academic:
* “Request Academic Mentoring”
  If segment=business:
* “Request Business Document Support”

---

# 6) CRO UPGRADE: FUNNEL-FIRST PAGE ARCHITECTURE

## 6.1 Mandatory Dedicated Landing Pages

Create high-conversion landing pages:

* `/lp/marketing`
* `/lp/academic`
* `/lp/business`

Each LP must contain:

1. Outcome headline (not descriptive)
2. Proof stack
3. Packages (3 tiers)
4. Case study highlights
5. FAQ objections
6. CTA inquiry wizard embed
7. Trust block (process + timeline)
8. “What happens after you submit” section

### LP Copy Must be Skimmable

Use short paragraphs, bullet proof, and numeric signals.

---

# 7) SERVICES: PRODUCTIZED OFFER SYSTEM (REVENUE ENGINE)

## 7.1 Convert Services Into Packages

Every service cluster must show 3-tier offers.

### Example Marketing Packages

* Audit Sprint (7 days)
* Growth Sprint (30 days)
* Retainer Partnership (3 months)

### Academic Packages

* Thesis Repair Pack
* Data Analysis Pack
* Full Mentoring Program

### Business Packages

* Deck Sprint (72h)
* SOP & Proposal Pack
* Monthly Executive Support

Each package must show:

* deliverables
* timeline
* ideal client
* CTA button

---

# 8) SMART INQUIRY ENGINE 2.0 (LEAD MACHINE)

## 8.1 Inquiry Wizard Must be Multi-Step

Steps:

1. Choose segment
2. Choose goal/outcome
3. Choose urgency (today/this week/this month)
4. Choose budget range (or academic deadline)
5. Enter contact details
6. Confirm summary

Validate with Zod.

---

## 8.2 Lead Scoring System

Auto-calculate:

* urgency score
* budget score
* business scale score
* readiness score

Store to Supabase:

* `lead_score`
* `segment`
* `utm_source`
* `referrer`
* `page_path`
* `session_id`

---

## 8.3 Auto Proposal Preview (High Conversion Hack)

After submit, show an on-screen “Initial Strategy Output”:

Example:

* “Recommended Package”
* “Next steps”
* “Estimated timeline”
* “What we need from you”

This must be generated from templates + selected answers.

---

## 8.4 Conditional Routing Output

If lead_score >= 70:

* send Resend email to owner + auto email to lead (confirmation + summary PDF-like HTML)
* show “Book Call” CTA

If urgency high:

* redirect to WhatsApp with prefilled text

If low score:

* show lead magnet:

  * “Download Checklist / Template”

---

# 9) MULTI REVENUE SYSTEM (REALISTIC & SCALABLE)

## 9.1 Revenue Layer Structure

### Layer A: High Ticket Services

* inquiry → conversion call → retainer

### Layer B: Mid Ticket Digital Products

Create `/store`:

* template packs
* audit spreadsheets
* thesis framework kit
  Use Gumroad/LemonSqueezy checkout links.

### Layer C: Affiliate Tools Hub

Create `/tools`:

* categorized by segment
* include affiliate links
* disclaimers + schema

### Layer D: Sponsored Directory Listing

Create `/partners`:

* “Featured Vendor”
* “Verified Partner”
  Offer paid listing form.

### Layer E: Ads Network (only in content)

Ads only appear in:

* `/radar`
* `/insights`
  Never in `/lp` and `/services`.

---

# 10) PROGRAMMATIC SEO ENGINE (pSEO UPGRADE)

## 10.1 pSEO Routes

Create:

* `/solutions/[industry]`
* `/solutions/[industry]/[problem]`

Use Supabase tables:

### industries table

* slug
* title
* short_description
* pain_points (json)
* service_mapping (json)
* faq (json)
* keywords (json)
* schema_jsonld (json)

### problems table

* slug
* industry_slug
* problem_statement
* solution_framework
* case_study_refs
* internal_links

---

## 10.2 pSEO Page Template Structure

Each page must include:

* Executive summary with `id="executive-summary"`
* “Common pain points”
* “Recommended solutions”
* “Relevant case study”
* “CTA inquiry embed”
* FAQ (schema FAQPage)

---

# 11) RADAR SYSTEM UPGRADE: FROM RSS TO GROWTH ENGINE

## 11.1 Radar Must Not Be Thin Aggregator

Each RSS item stored in Supabase must have:

* title
* source
* url
* published_at
* summary (auto)
* tags (AI-generated)
* “why it matters” (AI-generated)
* “strategic takeaway” (AI-generated)
* “recommended tool/service” (manual or auto)

---

## 11.2 Newsletter Funnel

Create `/newsletter`:

* subscribe form (Resend audience)
* weekly digest automation via cron
* archive pages `/newsletter/[issue]`

Monetization:

* sponsorship slot in digest

---

# 12) TRUST & EEAT UPGRADE (NON-NEGOTIABLE)

## 12.1 Mandatory Pages

* `/about` (story + proof + photo + values)
* `/testimonials`
* `/media-kit`
* `/certifications`
* `/legal/privacy-policy`
* `/legal/terms`
* `/contact`

---

## 12.2 Schema Strategy

Implement JSON-LD:

* Person schema (home)
* ProfessionalService schema (services + LP)
* Article schema (case studies + insights)
* FAQ schema (LP + solutions)
* Breadcrumb schema

---

# 13) UX/UI UPGRADES THAT PRODUCE RESULTS

## 13.1 Sticky CTA Bar

When scroll > 20%:

* left: Mode indicator
* right: primary CTA + WA quick button

---

## 13.2 Reading Mode in Case Study

In `/case-studies/[slug]`:

* nav transforms into reading progress bar
* share button
* back button
* sticky sidebar with metrics

---

## 13.3 Trust Micro-Interactions

Add:

* “Response time badge”
* “Last updated”
* “Client-safe workflow”
* “Process steps timeline”

---

# 14) INSIGHTS HUB (CONTENT ENGINE)

Create `/insights`:

* evergreen articles
* internal link into services + solutions
* topic clusters per mode

Topic clusters:

* Growth Engineering
* SEO Systems
* Budget Architecture
* Academic Data Processing
* Executive Communication

---

# 15) ANALYTICS + EVENT TRACKING (CRO OPTIMIZATION)

Implement event tracking stored in Supabase:

Track events:

* segment selected
* CTA clicked
* inquiry started
* inquiry submitted
* outbound affiliate click
* newsletter subscribe

Store:

* event_name
* segment
* path
* referrer
* utm_campaign
* timestamp

Build `/admin/analytics` (optional protected dashboard).

---

# 16) PERFORMANCE + CORE WEB VITALS ENFORCEMENT

Rules:

* all images via next/image
* avoid client JS on landing pages
* lazy load radar items
* prefetch critical routes
* use server components for static data rendering
* use ISR for pSEO and radar

Target:

* LCP < 1.2s
* CLS 0.00
* INP < 200ms
* Lighthouse 100

---

# 17) IMPLEMENTATION ROADMAP (SPRINT EXECUTION)

## Sprint 0 (Conversion Core)

* segmented home + focus mode
* 3 LP pages
* smart inquiry v2 + lead scoring

## Sprint 1 (Revenue Expansion)

* store + tools + partners pages
* affiliate tracking
* newsletter page

## Sprint 2 (SEO Engine)

* insights hub
* solutions pSEO DB-driven

## Sprint 3 (Radar Growth)

* AI enrichment pipeline
* newsletter automation + archive

---

# 18) UI COMPONENT LIBRARY (MANDATORY)

Build reusable components:

* `<ModeSwitcher />`
* `<SegmentHero />`
* `<ProofStack mode />`
* `<PackageCards />`
* `<InquiryWizard mode />`
* `<CaseStudyGrid filter />`
* `<RadarFeed />`
* `<InsightCard />`
* `<StickyCTA />`
* `<TrustBar />`
* `<ServiceSlideOver />`

All components must accept `mode` prop.

---

# 19) FINAL CRO RULE: “ONE PRIMARY CTA PER PAGE”

Every page must have exactly one dominant CTA:

* LP pages → “Request Plan”
* Case study → “Request Similar Strategy”
* Tools → “Get Tool”
* Insights → “Subscribe Newsletter”
* Radar → “Subscribe Digest”

No CTA clutter.

---

# OUTPUT REQUIREMENT FOR AI CODER

Generate:

* Next.js 14 App Router project structure
* Supabase schema SQL
* data JSON injection file
* core UI components
* pSEO template
* cron job implementation for radar
* resend integration
* lead scoring logic
* SEO meta + JSON-LD

---

# OPTIONAL ADVANCED FEATURE (HIGH IMPACT)

Implement “Intent Detection Quick Modal”:
If user scrolls 50% on home without selecting segment:
Show modal:

> “Which goal are you here for?”
> 3 buttons = set mode.

This massively increases segmentation rate.

---

Teknis:
**(A) struktur repo Next.js**, **(B) schema SQL Supabase**, **(C) data model & types**, **(D) lead scoring + inquiry engine**, **(E) pSEO engine**, **(F) Radar cron + enrichment**, **(G) event tracking analytics**, **(H) SEO + JSON-LD**, **(I) deployment checklist**.

---

# A) NEXT.JS 14 APP ROUTER – STRUCTURE (PRODUCTION READY)

```
/app
  /(site)
    layout.tsx
    page.tsx                         # Home segmented gateway
    services/page.tsx
    case-studies/page.tsx
    case-studies/[slug]/page.tsx
    radar/page.tsx
    insights/page.tsx
    insights/[slug]/page.tsx
    tools/page.tsx
    partners/page.tsx
    store/page.tsx
    newsletter/page.tsx
    newsletter/[issue]/page.tsx
    about/page.tsx
    media-kit/page.tsx
    testimonials/page.tsx
    certifications/page.tsx
    contact/page.tsx
    legal/privacy-policy/page.tsx
    legal/terms/page.tsx
    lp/marketing/page.tsx
    lp/academic/page.tsx
    lp/business/page.tsx
    solutions/[industry]/page.tsx
    solutions/[industry]/[problem]/page.tsx

  /api
    inquiry/route.ts                 # POST inquiry wizard
    events/route.ts                  # POST analytics events
    newsletter/subscribe/route.ts     # POST subscribe resend
    cron/radar/route.ts              # GET cron aggregator
    cron/radar-enrich/route.ts       # GET cron enrichment (optional)

  /admin
    analytics/page.tsx               # protected (optional)
    inquiries/page.tsx               # protected (optional)

  sitemap.ts
  robots.ts

/components
  layout/
    Header.tsx
    Footer.tsx
    StickyCTA.tsx
    ModeSwitcher.tsx
    CommandMenu.tsx

  home/
    SegmentedHero.tsx
    SegmentCards.tsx
    ProofStack.tsx
    TrustBar.tsx
    FeaturedCaseStudies.tsx

  services/
    ServiceClusters.tsx
    PackageCards.tsx
    ServiceSlideOver.tsx

  inquiry/
    InquiryWizard.tsx
    InquirySummary.tsx

  case-studies/
    CaseStudyGrid.tsx
    CaseStudyCard.tsx
    ReadingProgressHeader.tsx
    RelatedSolutions.tsx

  radar/
    RadarFeed.tsx
    RadarItemCard.tsx
    RadarFilters.tsx

  insights/
    InsightCard.tsx
    InsightContent.tsx

  seo/
    JsonLd.tsx
    Breadcrumbs.tsx

/lib
  supabase/
    client.ts
    server.ts
    types.ts
  seo/
    metadata.ts
    jsonld.ts
  scoring/
    leadScoring.ts
  analytics/
    track.ts
  mode/
    mode.ts
  radar/
    rss.ts
    enrich.ts
  resend/
    resend.ts
  utils/
    slugify.ts
    sanitize.ts
    hash.ts

/data
  master.json                       # inject JSON payload kamu
  industries.seed.json              # seed pSEO
  tools.json                        # affiliate tools listing
  products.json                     # store products listing

/styles
  globals.css

/middleware.ts                      # optional: mode persistence, admin auth

/supabase
  schema.sql
  policies.sql
  seed.sql

```

---

# B) SUPABASE SQL SCHEMA (CORE TABLES)

File: `/supabase/schema.sql`

```sql
-- Enable extensions
create extension if not exists pgcrypto;

-- 1) Inquiries (Lead Capture)
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  segment text not null check (segment in ('marketing', 'academic', 'business')),
  goal text,
  challenges text,
  urgency text check (urgency in ('today','this_week','this_month','flexible')),
  budget_range text,
  deadline_date date,

  full_name text not null,
  email text,
  whatsapp text,
  company text,
  role text,

  source text,            -- utm_source
  campaign text,          -- utm_campaign
  referrer text,
  landing_path text,

  lead_score int default 0,
  lead_tier text,         -- hot / warm / cold

  routing text,           -- resend / whatsapp / lead_magnet
  status text default 'new' check (status in ('new','contacted','qualified','closed','ignored')),

  notes text
);

create index if not exists idx_inquiries_created_at on inquiries(created_at desc);
create index if not exists idx_inquiries_segment on inquiries(segment);
create index if not exists idx_inquiries_lead_score on inquiries(lead_score desc);

-- 2) Events (Analytics)
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  session_id text,
  event_name text not null,
  segment text,

  path text,
  referrer text,
  user_agent text,

  utm_source text,
  utm_campaign text,
  utm_medium text,
  utm_term text,
  utm_content text,

  metadata jsonb default '{}'::jsonb
);

create index if not exists idx_events_created_at on events(created_at desc);
create index if not exists idx_events_event_name on events(event_name);
create index if not exists idx_events_session_id on events(session_id);

-- 3) Radar Items (RSS Aggregator)
create table if not exists radar_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  source_name text not null,
  source_url text,
  title text not null,
  url text not null unique,
  published_at timestamptz,

  summary text,
  tags text[] default '{}',

  why_it_matters text,
  takeaway text,
  recommended_service text,

  content_hash text,
  is_featured boolean default false
);

create index if not exists idx_radar_published_at on radar_items(published_at desc);
create index if not exists idx_radar_tags on radar_items using gin(tags);

-- 4) Newsletter Subscribers
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  email text not null unique,
  segment text,
  status text default 'active' check (status in ('active','unsubscribed'))
);

-- 5) Newsletter Issues Archive
create table if not exists newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  issue_slug text not null unique,
  title text not null,
  published_at timestamptz default now(),

  html_content text,
  summary text,
  sponsor text
);

-- 6) pSEO Industries + Problems
create table if not exists industries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  slug text not null unique,
  title text not null,
  short_description text,

  pain_points jsonb default '[]'::jsonb,
  recommended_services jsonb default '[]'::jsonb,
  faq jsonb default '[]'::jsonb,
  keywords jsonb default '[]'::jsonb,

  schema_jsonld jsonb default '{}'::jsonb
);

create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  industry_slug text not null references industries(slug) on delete cascade,
  slug text not null,

  problem_statement text not null,
  solution_framework jsonb default '{}'::jsonb,
  faq jsonb default '[]'::jsonb,
  case_study_refs jsonb default '[]'::jsonb,

  unique(industry_slug, slug)
);
```

---

# C) SUPABASE RLS (BASIC SAFE CONFIG)

File: `/supabase/policies.sql`

> Default: public can insert inquiries/events/newsletter subscribers, but cannot read.

```sql
alter table inquiries enable row level security;
alter table events enable row level security;
alter table radar_items enable row level security;
alter table newsletter_subscribers enable row level security;
alter table newsletter_issues enable row level security;
alter table industries enable row level security;
alter table problems enable row level security;

-- inquiries: allow insert only
create policy "public_insert_inquiries"
on inquiries for insert
to anon
with check (true);

-- events: allow insert only
create policy "public_insert_events"
on events for insert
to anon
with check (true);

-- newsletter subscribers: allow insert only
create policy "public_insert_subscribers"
on newsletter_subscribers for insert
to anon
with check (true);

-- radar items: allow select (public content)
create policy "public_select_radar"
on radar_items for select
to anon
using (true);

-- newsletter issues: allow select
create policy "public_select_issues"
on newsletter_issues for select
to anon
using (true);

-- industries/problems: allow select
create policy "public_select_industries"
on industries for select
to anon
using (true);

create policy "public_select_problems"
on problems for select
to anon
using (true);
```

> Admin dashboard nanti pakai Supabase Auth (role authenticated) atau Vercel password middleware.

---

# D) MODE SYSTEM (SEGMENT STATE) – TECHNICAL IMPLEMENTATION

File: `/lib/mode/mode.ts`

### Rules

* Mode disimpan di URL query: `?mode=marketing`
* Mode disimpan di localStorage untuk persist
* Semua CTA / ProofStack / ServiceFilter tergantung mode

Pseudo:

```ts
export type Mode = "neutral" | "marketing" | "academic" | "business";

export function normalizeMode(input?: string | null): Mode {
  if (input === "marketing") return "marketing";
  if (input === "academic") return "academic";
  if (input === "business") return "business";
  return "neutral";
}
```

Komponen `<ModeSwitcher />` mengubah query param + localStorage.

---

# E) LEAD SCORING ENGINE (SMART INQUIRY MACHINE)

File: `/lib/scoring/leadScoring.ts`

## Lead Score Formula (0–100)

### Weight Recommendation

* Urgency: 25
* Budget: 25
* Business scale/company: 20
* Completeness: 15
* Segment priority: 15

Pseudo:

```ts
export function scoreLead(payload) {
  let score = 0;

  // urgency
  if (payload.urgency === "today") score += 25;
  if (payload.urgency === "this_week") score += 18;
  if (payload.urgency === "this_month") score += 10;

  // budget
  if (payload.segment === "marketing") {
    if (payload.budget_range === ">50jt") score += 25;
    if (payload.budget_range === "10-50jt") score += 18;
    if (payload.budget_range === "<10jt") score += 8;
  }

  // completeness
  if (payload.email) score += 5;
  if (payload.whatsapp) score += 5;
  if (payload.company) score += 5;

  // role/company scale
  if (payload.role?.includes("Founder")) score += 15;
  if (payload.role?.includes("Manager")) score += 10;

  // segment priority
  if (payload.segment === "marketing") score += 15;
  if (payload.segment === "business") score += 10;
  if (payload.segment === "academic") score += 8;

  if (score >= 80) return { score, tier: "hot" };
  if (score >= 55) return { score, tier: "warm" };
  return { score, tier: "cold" };
}
```

---

# F) API /api/inquiry (ROUTING + RESEND + WA REDIRECT)

File: `/app/api/inquiry/route.ts`

### Flow

1. validate zod
2. compute lead score
3. insert into Supabase
4. route decision:

   * HOT → resend email + show booking CTA
   * urgent → WA redirect
   * cold → lead magnet

Return JSON:

```json
{
  "success": true,
  "leadTier": "hot",
  "leadScore": 82,
  "routing": "resend",
  "redirectUrl": "https://wa.me/..."
}
```

---

# G) INQUIRY TEMPLATE OUTPUT (AUTO PROPOSAL PREVIEW)

Setelah submit, generate HTML snippet di frontend:

### Template Output

* Title: “Initial Strategy Output”
* Recommended package
* Suggested timeline
* Next step checklist
* CTA: book call / whatsapp

This is **conversion multiplier**.

---

# H) ANALYTICS EVENT TRACKING (SUPABASE EVENTS)

File: `/lib/analytics/track.ts`

Track minimal:

* `segment_selected`
* `cta_click`
* `wizard_started`
* `wizard_completed`
* `affiliate_click`
* `newsletter_subscribe`

Frontend:

* `navigator.sendBeacon("/api/events")`

API:

* insert to supabase events table

---

# I) PROGRAMMATIC SEO (pSEO) ENGINE – DB DRIVEN

## Route: `/solutions/[industry]/page.tsx`

Fetch industry row from Supabase.

### Page layout mandatory:

* H1: “Growth System for {industry}”
* `#executive-summary`
* pain points
* recommended services
* CTA embed wizard (prefilled mode marketing)
* FAQ schema

## Route: `/solutions/[industry]/[problem]/page.tsx`

Fetch problem row.

Render:

* problem statement
* solution framework
* related case studies
* inquiry CTA

---

# J) RADAR SYSTEM – CRON PIPELINE (RSS → SUPABASE)

## API Cron: `/app/api/cron/radar/route.ts`

### Steps

1. list RSS sources (hardcoded or Supabase table)
2. fetch each RSS feed
3. parse with rss-parser
4. compute `content_hash`
5. upsert into `radar_items`

### Dedup Strategy

* `url unique`
* `content_hash` optional

---

# K) RADAR ENRICHMENT (MAKE IT NOT THIN CONTENT)

Radar enrichment options:

## Option 1 (cheap & safe)

Generate summary using deterministic extraction:

* take description
* sanitize html
* truncate 300 chars

## Option 2 (AI enrichment)

Use OpenAI/Gemini summarizer:

* why it matters
* takeaway
* tags

Store in Supabase.

**Important:** do enrichment only for top N items/day to reduce cost.

---

# L) NEWSLETTER SYSTEM (RESEND)

## Subscribe API

`/api/newsletter/subscribe`

* validate email
* insert Supabase subscribers
* add to Resend audience

## Weekly digest cron

`/api/cron/newsletter`

* fetch top featured radar items
* compile HTML
* send to subscribers via Resend
* insert into `newsletter_issues`

Archive route:

* `/newsletter/[issue]`

---

# M) MULTI REVENUE IMPLEMENTATION (REAL CODE STRUCTURE)

## /tools page (affiliate hub)

Data source: `/data/tools.json`

Each tool object:

```json
{
  "name": "Vercel",
  "category": "Hosting",
  "segment": ["marketing","business"],
  "affiliate_url": "https://...",
  "description": "...",
  "badge": "Recommended"
}
```

Track outbound click:

* POST `/api/events` event_name = `affiliate_click`

## /partners (sponsored directory)

Create table:

```sql
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  category text,
  url text,
  description text,
  is_featured boolean default false
);
```

Revenue model:

* “Featured listing Rp X/bulan”
* CTA: inquiry wizard prefilled `segment=business`

## /store (digital product)

Static list + payment link.

---

# N) UI COMPONENT RULES (ENGINEERING CONSTRAINT)

## React Server Components (RSC)

* page.tsx default server
* client components only:

  * ModeSwitcher
  * InquiryWizard
  * CmdK CommandMenu
  * StickyCTA

## Data Fetching

* supabase server client in server components
* SWR only for analytics or client search

---

# O) SEARCH SYSTEM (CMD+K)

## CommandMenu indexing strategy

Index:

* case studies
* services
* industries
* insights
* tools

Load minimal data:

* precomputed JSON index built at build time OR fetch from Supabase.

---

# P) SEO IMPLEMENTATION DETAILS (NON-NEGOTIABLE)

## Metadata per route

Use Next.js metadata API.

Example:

* title includes segment keyword
* description short and outcome-driven
* OG image dynamic (optional)

## JSON-LD injection

Create component:

`<JsonLd schema={schemaObject} />`

Schemas:

* Person (home)
* ProfessionalService (services + lp)
* Article (case study + insights)
* FAQPage (solutions + lp)

---

# Q) PERFORMANCE GUARANTEES (LCP < 1.2s)

Mandatory:

* all hero images preload via next/image priority
* avoid heavy animation above fold
* use `next/font`
* avoid large JS bundles (cmdk lazy import)

---

# R) DEPLOYMENT ENV VARS (VERCEL)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # only in server env
RESEND_API_KEY=
OWNER_EMAIL=muhzadit@gmail.com
OWNER_WA=6282316363177
SITE_URL=https://yourdomain.com
```

---

# S) SECURITY NOTES (IMPORTANT)

* Inquiry insert uses anon key (allowed by RLS insert)
* Admin pages protected by middleware basic auth or Supabase Auth
* Cron endpoints protected by secret header token:

  * `CRON_SECRET`

---

# T) SPRINT IMPLEMENTATION ORDER (MOST EFFECTIVE)

## Sprint 0 (conversion foundation)

* mode engine
* home segmented gateway
* /lp/* pages
* inquiry wizard v2 + lead scoring + routing

## Sprint 1 (SEO + revenue)

* tools + store + partners
* insights base

## Sprint 2 (pSEO engine)

* industries/problems DB + dynamic pages

## Sprint 3 (radar growth engine)

* cron ingestion + enrichment
* newsletter + archive

---

# U) MINIMUM JSON TYPES (TS) – /lib/supabase/types.ts

```ts
export type Segment = "marketing" | "academic" | "business";

export type InquiryPayload = {
  segment: Segment;
  goal?: string;
  challenges?: string;
  urgency?: "today" | "this_week" | "this_month" | "flexible";
  budget_range?: string;
  deadline_date?: string;

  full_name: string;
  email?: string;
  whatsapp?: string;
  company?: string;
  role?: string;

  source?: string;
  campaign?: string;
  referrer?: string;
  landing_path?: string;
};
```

---

> Build a Next.js 14 App Router website with Segmented Focus Mode state (marketing/academic/business). Implement pages: home, services, case-studies, case-study detail, radar, insights, tools, store, partners, media-kit, testimonials, about, contact, legal, and landing pages /lp/marketing /lp/academic /lp/business.
> Use Supabase Postgres for inquiries, events analytics, radar items, newsletter subscribers, industries/problems.
> Implement Inquiry Wizard multi-step with zod validation + lead scoring + Supabase insert. Route hot leads to Resend email, urgent leads to WhatsApp redirect with prefilled message, cold leads to lead magnet CTA.
> Implement pSEO routes /solutions/[industry] and /solutions/[industry]/[problem] from Supabase. Include executive summary with id="executive-summary" and FAQ schema.
> Implement Radar RSS Cron ingestion every 4 hours into Supabase, with enrichment fields (summary/tags/why_it_matters/takeaway).
> Implement Resend newsletter subscribe + weekly digest cron with archive.
> Add event tracking table and API.
> Enforce strict Core Web Vitals and Lighthouse 100. Use RSC-first architecture, client components only for leaves.
> Add JSON-LD schema for Person, ProfessionalService, Article, FAQPage.
> Provide full project code, Supabase SQL schema, RLS policies, and deployment instructions for Vercel.

---

Berikut paket lengkap: **(1) Supabase seed SQL**, **(2) contoh `/data/industries.seed.json`**, **(3) contoh template WA prefilled message yang conversion-friendly**.

---

# 1) SUPABASE SEED SQL (industries + problems)

File: `/supabase/seed.sql`

```sql
-- =========================================
-- SEED: INDUSTRIES
-- =========================================

insert into industries (slug, title, short_description, pain_points, recommended_services, faq, keywords)
values
(
  'ecommerce',
  'E-Commerce & Marketplace Brands',
  'Scaling conversion, retention, and SEO visibility for e-commerce growth.',
  '[
    "High CAC and unstable ROAS",
    "Low conversion rate on landing pages",
    "Weak organic traffic and poor topical authority",
    "Inconsistent brand voice across ads and content",
    "Product pages not optimized for SEO + AEO"
  ]'::jsonb,
  '[
    "Campaign Strategic & Budget Architecture",
    "Advanced Off-Page SEO & Link Building",
    "Brand Voice Engineering & Copywriting"
  ]'::jsonb,
  '[
    {
      "q": "Berapa lama hasil SEO bisa terlihat untuk e-commerce?",
      "a": "Umumnya 4-12 minggu untuk indikator awal (ranking + CTR), dan 3-6 bulan untuk hasil stabil."
    },
    {
      "q": "Apakah bisa fokus ke conversion tanpa menaikkan budget iklan?",
      "a": "Bisa. Biasanya lewat optimasi funnel, landing page, dan penguatan SEO + retargeting."
    }
  ]'::jsonb,
  '[
    "ecommerce marketing strategy",
    "seo for ecommerce",
    "conversion optimization",
    "performance marketing funnel"
  ]'::jsonb
),
(
  'education',
  'Education, Course & Institutions',
  'Improving enrollment funnel, brand trust, and organic acquisition.',
  '[
    "Low enrollment conversion rate",
    "Weak authority in Google search results",
    "Hard to compete with big course platforms",
    "Landing pages not persuasive",
    "No structured lead nurturing system"
  ]'::jsonb,
  '[
    "Brand Voice Engineering & Copywriting",
    "Campaign Strategic & Budget Architecture",
    "Advanced Off-Page SEO & Link Building"
  ]'::jsonb,
  '[
    {
      "q": "Apa strategi terbaik untuk meningkatkan pendaftaran siswa?",
      "a": "Perbaikan funnel: landing page, lead magnet, WhatsApp follow-up system, dan SEO authority."
    }
  ]'::jsonb,
  '[
    "education marketing",
    "course landing page",
    "seo for education",
    "lead generation funnel"
  ]'::jsonb
),
(
  'health-beauty',
  'Beauty, Skincare & Health Brands',
  'High velocity growth for skincare brands through ads + SEO + influencer synergy.',
  '[
    "Paid ads scaling but low profitability",
    "Brand reputation risk and review management",
    "Competitors dominate SERP and marketplace",
    "Hard to sustain growth after campaign peak",
    "Weak long-term organic channel"
  ]'::jsonb,
  '[
    "Campaign Strategic & Budget Architecture",
    "Advanced Off-Page SEO & Link Building",
    "Brand Voice Engineering & Copywriting"
  ]'::jsonb,
  '[
    {
      "q": "Apakah strategi ini cocok untuk brand skincare baru?",
      "a": "Cocok, karena bisa dimulai dari audit funnel dan scaling bertahap sesuai budget."
    }
  ]'::jsonb,
  '[
    "skincare marketing",
    "beauty brand growth",
    "seo for skincare",
    "paid ads scaling strategy"
  ]'::jsonb
),
(
  'saas',
  'SaaS, AI Tools & Developer Products',
  'Building acquisition loops, topical authority, and product-led conversion.',
  '[
    "Hard to rank in competitive keywords",
    "Low signup conversion despite traffic",
    "No scalable content distribution system",
    "Weak pSEO architecture",
    "Product onboarding not aligned with marketing"
  ]'::jsonb,
  '[
    "Advanced Off-Page SEO & Link Building",
    "Brand Voice Engineering & Copywriting",
    "Business Data Visualization & Dashboard"
  ]'::jsonb,
  '[
    {
      "q": "Apakah pSEO efektif untuk SaaS?",
      "a": "Sangat efektif jika data model kuat, internal linking rapi, dan konten punya unique value."
    }
  ]'::jsonb,
  '[
    "saas seo",
    "programmatic seo",
    "product led growth",
    "ai tools marketing"
  ]'::jsonb
),
(
  'corporate',
  'Corporate & Enterprise Services',
  'Strategic growth systems, reputation engineering, and executive reporting.',
  '[
    "Decision making but data reporting is messy",
    "Marketing team lacks KPI clarity",
    "Reputation and brand authority fragmented",
    "Hard to align stakeholder communication",
    "Inefficient SOP and documentation"
  ]'::jsonb,
  '[
    "Business Data Visualization & Dashboard",
    "Penyusunan Dokumen SOP & Copy Bisnis",
    "Campaign Strategic & Budget Architecture"
  ]'::jsonb,
  '[
    {
      "q": "Apakah layanan ini cocok untuk kebutuhan enterprise?",
      "a": "Ya. Output disusun dalam format executive-ready: KPI matrix, dashboard, dan reporting."
    }
  ]'::jsonb,
  '[
    "enterprise marketing reporting",
    "executive dashboard",
    "corporate SOP writing",
    "business documentation"
  ]'::jsonb
)
on conflict (slug) do nothing;


-- =========================================
-- SEED: PROBLEMS (PER INDUSTRY)
-- =========================================

insert into problems (industry_slug, slug, problem_statement, solution_framework, faq, case_study_refs)
values
(
  'ecommerce',
  'high-cac-low-roas',
  'Biaya iklan tinggi (CAC naik) tetapi ROAS stagnan dan conversion funnel bocor.',
  '{
    "steps": [
      "Audit funnel landing page + checkout",
      "Budget re-allocation per channel",
      "Implement retargeting + creative iteration",
      "SEO quick wins untuk keyword transaksional",
      "Tracking KPI dengan dashboard"
    ],
    "deliverables": [
      "Budget Allocation Matrix",
      "Full Funnel KPI Map",
      "Landing Page Improvement Plan",
      "Retargeting Structure"
    ]
  }'::jsonb,
  '[
    {
      "q": "Apakah bisa dilakukan tanpa redesign total website?",
      "a": "Bisa. Fokus pada quick wins: CTA placement, speed, copywriting, dan tracking."
    }
  ]'::jsonb,
  '[
    { "slug": "skintific-campaign-architecture", "title": "Campaign Strategic, Timeline & Budgeting Architecture" }
  ]'::jsonb
),
(
  'education',
  'low-enrollment',
  'Traffic ada, tetapi pendaftaran siswa rendah karena trust dan funnel belum kuat.',
  '{
    "steps": [
      "Audit landing page & trust blocks",
      "Rebuild CTA structure & WhatsApp routing",
      "Create lead magnet funnel (ebook / syllabus preview)",
      "SEO topical authority untuk program pendidikan",
      "Email/WA nurturing sequence"
    ],
    "deliverables": [
      "Landing Page CRO Plan",
      "Lead Magnet Funnel Map",
      "WhatsApp Routing Script",
      "Topical SEO Outline"
    ]
  }'::jsonb,
  '[
    {
      "q": "Apa yang paling cepat menaikkan enrollment?",
      "a": "Biasanya trust proof (testimoni + struktur penawaran) dan WhatsApp follow-up yang sistematis."
    }
  ]'::jsonb,
  '[]'::jsonb
),
(
  'health-beauty',
  'brand-reputation-risk',
  'Brand skincare mengalami scaling cepat namun rawan backlash, review negatif, dan reputasi tidak stabil.',
  '{
    "steps": [
      "Brand voice matrix + crisis messaging",
      "SEO reputation engineering",
      "Off-page authority acquisition",
      "Content pillar untuk trust",
      "Campaign budget stabilization"
    ],
    "deliverables": [
      "Brand Voice Matrix",
      "Reputation SERP Plan",
      "Authority Link Plan",
      "Campaign Stabilization Timeline"
    ]
  }'::jsonb,
  '[
    {
      "q": "Apakah ini termasuk ORM (Online Reputation Management)?",
      "a": "Ya. Fokus pada SERP control dan penguatan trust melalui content + authority."
    }
  ]'::jsonb,
  '[
    { "slug": "skintific-campaign-architecture", "title": "Campaign Strategic, Timeline & Budgeting Architecture" }
  ]'::jsonb
),
(
  'saas',
  'programmatic-seo-architecture',
  'SaaS memiliki product bagus, tapi organic acquisition lambat karena struktur SEO dan internal linking lemah.',
  '{
    "steps": [
      "Build pSEO database model",
      "Create industry/problem page templates",
      "Internal linking loop design",
      "Authority building strategy",
      "Content distribution via radar/newsletter"
    ],
    "deliverables": [
      "pSEO Data Model",
      "Template SEO Landing Pages",
      "Internal Linking Blueprint",
      "Authority Roadmap"
    ]
  }'::jsonb,
  '[
    {
      "q": "Berapa banyak halaman pSEO yang ideal?",
      "a": "Mulai dari 30-100 halaman berkualitas, lalu scaling berdasarkan query data."
    }
  ]'::jsonb,
  '[
    { "slug": "video-com-seo-audit", "title": "Off-Page SEO & Domain Authority Acquisition" }
  ]'::jsonb
),
(
  'corporate',
  'messy-reporting-no-kpi',
  'Tim marketing punya banyak aktivitas, tetapi reporting tidak rapi sehingga keputusan manajemen lambat.',
  '{
    "steps": [
      "KPI mapping & metric definition",
      "Build executive dashboard",
      "Create reporting SOP",
      "Automate spreadsheet pipeline",
      "Monthly executive briefing template"
    ],
    "deliverables": [
      "Executive KPI Dashboard",
      "Reporting SOP Document",
      "Monthly Briefing Template",
      "Automation Sheet System"
    ]
  }'::jsonb,
  '[
    {
      "q": "Apakah dashboard ini bisa berjalan tanpa BI tools mahal?",
      "a": "Bisa. Bisa menggunakan Google Sheets + automation, atau Supabase + lightweight dashboard."
    }
  ]'::jsonb,
  '[]'::jsonb
)
on conflict (industry_slug, slug) do nothing;
```

---

# 2) CONTOH `/data/industries.seed.json`

File: `/data/industries.seed.json`

> Ini bisa dipakai untuk seeding otomatis (misal via script node) atau sebagai sumber truth untuk generate SQL.

```json
{
  "industries": [
    {
      "slug": "ecommerce",
      "title": "E-Commerce & Marketplace Brands",
      "short_description": "Scaling conversion, retention, and SEO visibility for e-commerce growth.",
      "pain_points": [
        "High CAC and unstable ROAS",
        "Low conversion rate on landing pages",
        "Weak organic traffic and poor topical authority",
        "Inconsistent brand voice across ads and content",
        "Product pages not optimized for SEO + AEO"
      ],
      "recommended_services": [
        "Campaign Strategic & Budget Architecture",
        "Advanced Off-Page SEO & Link Building",
        "Brand Voice Engineering & Copywriting"
      ],
      "faq": [
        {
          "q": "Berapa lama hasil SEO bisa terlihat untuk e-commerce?",
          "a": "Umumnya 4-12 minggu untuk indikator awal (ranking + CTR), dan 3-6 bulan untuk hasil stabil."
        },
        {
          "q": "Apakah bisa fokus ke conversion tanpa menaikkan budget iklan?",
          "a": "Bisa. Biasanya lewat optimasi funnel, landing page, dan penguatan SEO + retargeting."
        }
      ],
      "keywords": [
        "ecommerce marketing strategy",
        "seo for ecommerce",
        "conversion optimization",
        "performance marketing funnel"
      ],
      "problems": [
        {
          "slug": "high-cac-low-roas",
          "problem_statement": "Biaya iklan tinggi (CAC naik) tetapi ROAS stagnan dan conversion funnel bocor.",
          "solution_framework": {
            "steps": [
              "Audit funnel landing page + checkout",
              "Budget re-allocation per channel",
              "Implement retargeting + creative iteration",
              "SEO quick wins untuk keyword transaksional",
              "Tracking KPI dengan dashboard"
            ],
            "deliverables": [
              "Budget Allocation Matrix",
              "Full Funnel KPI Map",
              "Landing Page Improvement Plan",
              "Retargeting Structure"
            ]
          },
          "faq": [
            {
              "q": "Apakah bisa dilakukan tanpa redesign total website?",
              "a": "Bisa. Fokus pada quick wins: CTA placement, speed, copywriting, dan tracking."
            }
          ],
          "case_study_refs": [
            {
              "slug": "skintific-campaign-architecture",
              "title": "Campaign Strategic, Timeline & Budgeting Architecture"
            }
          ]
        }
      ]
    },

    {
      "slug": "education",
      "title": "Education, Course & Institutions",
      "short_description": "Improving enrollment funnel, brand trust, and organic acquisition.",
      "pain_points": [
        "Low enrollment conversion rate",
        "Weak authority in Google search results",
        "Hard to compete with big course platforms",
        "Landing pages not persuasive",
        "No structured lead nurturing system"
      ],
      "recommended_services": [
        "Brand Voice Engineering & Copywriting",
        "Campaign Strategic & Budget Architecture",
        "Advanced Off-Page SEO & Link Building"
      ],
      "faq": [
        {
          "q": "Apa strategi terbaik untuk meningkatkan pendaftaran siswa?",
          "a": "Perbaikan funnel: landing page, lead magnet, WhatsApp follow-up system, dan SEO authority."
        }
      ],
      "keywords": [
        "education marketing",
        "course landing page",
        "seo for education",
        "lead generation funnel"
      ],
      "problems": [
        {
          "slug": "low-enrollment",
          "problem_statement": "Traffic ada, tetapi pendaftaran siswa rendah karena trust dan funnel belum kuat.",
          "solution_framework": {
            "steps": [
              "Audit landing page & trust blocks",
              "Rebuild CTA structure & WhatsApp routing",
              "Create lead magnet funnel (ebook / syllabus preview)",
              "SEO topical authority untuk program pendidikan",
              "Email/WA nurturing sequence"
            ],
            "deliverables": [
              "Landing Page CRO Plan",
              "Lead Magnet Funnel Map",
              "WhatsApp Routing Script",
              "Topical SEO Outline"
            ]
          },
          "faq": [
            {
              "q": "Apa yang paling cepat menaikkan enrollment?",
              "a": "Biasanya trust proof (testimoni + struktur penawaran) dan WhatsApp follow-up yang sistematis."
            }
          ],
          "case_study_refs": []
        }
      ]
    },

    {
      "slug": "health-beauty",
      "title": "Beauty, Skincare & Health Brands",
      "short_description": "High velocity growth for skincare brands through ads + SEO + influencer synergy.",
      "pain_points": [
        "Paid ads scaling but low profitability",
        "Brand reputation risk and review management",
        "Competitors dominate SERP and marketplace",
        "Hard to sustain growth after campaign peak",
        "Weak long-term organic channel"
      ],
      "recommended_services": [
        "Campaign Strategic & Budget Architecture",
        "Advanced Off-Page SEO & Link Building",
        "Brand Voice Engineering & Copywriting"
      ],
      "faq": [
        {
          "q": "Apakah strategi ini cocok untuk brand skincare baru?",
          "a": "Cocok, karena bisa dimulai dari audit funnel dan scaling bertahap sesuai budget."
        }
      ],
      "keywords": [
        "skincare marketing",
        "beauty brand growth",
        "seo for skincare",
        "paid ads scaling strategy"
      ],
      "problems": [
        {
          "slug": "brand-reputation-risk",
          "problem_statement": "Brand skincare mengalami scaling cepat namun rawan backlash, review negatif, dan reputasi tidak stabil.",
          "solution_framework": {
            "steps": [
              "Brand voice matrix + crisis messaging",
              "SEO reputation engineering",
              "Off-page authority acquisition",
              "Content pillar untuk trust",
              "Campaign budget stabilization"
            ],
            "deliverables": [
              "Brand Voice Matrix",
              "Reputation SERP Plan",
              "Authority Link Plan",
              "Campaign Stabilization Timeline"
            ]
          },
          "faq": [
            {
              "q": "Apakah ini termasuk ORM (Online Reputation Management)?",
              "a": "Ya. Fokus pada SERP control dan penguatan trust melalui content + authority."
            }
          ],
          "case_study_refs": [
            {
              "slug": "skintific-campaign-architecture",
              "title": "Campaign Strategic, Timeline & Budgeting Architecture"
            }
          ]
        }
      ]
    },

    {
      "slug": "saas",
      "title": "SaaS, AI Tools & Developer Products",
      "short_description": "Building acquisition loops, topical authority, and product-led conversion.",
      "pain_points": [
        "Hard to rank in competitive keywords",
        "Low signup conversion despite traffic",
        "No scalable content distribution system",
        "Weak pSEO architecture",
        "Product onboarding not aligned with marketing"
      ],
      "recommended_services": [
        "Advanced Off-Page SEO & Link Building",
        "Brand Voice Engineering & Copywriting",
        "Business Data Visualization & Dashboard"
      ],
      "faq": [
        {
          "q": "Apakah pSEO efektif untuk SaaS?",
          "a": "Sangat efektif jika data model kuat, internal linking rapi, dan konten punya unique value."
        }
      ],
      "keywords": [
        "saas seo",
        "programmatic seo",
        "product led growth",
        "ai tools marketing"
      ],
      "problems": [
        {
          "slug": "programmatic-seo-architecture",
          "problem_statement": "SaaS memiliki product bagus, tapi organic acquisition lambat karena struktur SEO dan internal linking lemah.",
          "solution_framework": {
            "steps": [
              "Build pSEO database model",
              "Create industry/problem page templates",
              "Internal linking loop design",
              "Authority building strategy",
              "Content distribution via radar/newsletter"
            ],
            "deliverables": [
              "pSEO Data Model",
              "Template SEO Landing Pages",
              "Internal Linking Blueprint",
              "Authority Roadmap"
            ]
          },
          "faq": [
            {
              "q": "Berapa banyak halaman pSEO yang ideal?",
              "a": "Mulai dari 30-100 halaman berkualitas, lalu scaling berdasarkan query data."
            }
          ],
          "case_study_refs": [
            {
              "slug": "video-com-seo-audit",
              "title": "Off-Page SEO & Domain Authority Acquisition"
            }
          ]
        }
      ]
    },

    {
      "slug": "corporate",
      "title": "Corporate & Enterprise Services",
      "short_description": "Strategic growth systems, reputation engineering, and executive reporting.",
      "pain_points": [
        "Decision making but data reporting is messy",
        "Marketing team lacks KPI clarity",
        "Reputation and brand authority fragmented",
        "Hard to align stakeholder communication",
        "Inefficient SOP and documentation"
      ],
      "recommended_services": [
        "Business Data Visualization & Dashboard",
        "Penyusunan Dokumen SOP & Copy Bisnis",
        "Campaign Strategic & Budget Architecture"
      ],
      "faq": [
        {
          "q": "Apakah layanan ini cocok untuk kebutuhan enterprise?",
          "a": "Ya. Output disusun dalam format executive-ready: KPI matrix, dashboard, dan reporting."
        }
      ],
      "keywords": [
        "enterprise marketing reporting",
        "executive dashboard",
        "corporate SOP writing",
        "business documentation"
      ],
      "problems": [
        {
          "slug": "messy-reporting-no-kpi",
          "problem_statement": "Tim marketing punya banyak aktivitas, tetapi reporting tidak rapi sehingga keputusan manajemen lambat.",
          "solution_framework": {
            "steps": [
              "KPI mapping & metric definition",
              "Build executive dashboard",
              "Create reporting SOP",
              "Automate spreadsheet pipeline",
              "Monthly executive briefing template"
            ],
            "deliverables": [
              "Executive KPI Dashboard",
              "Reporting SOP Document",
              "Monthly Briefing Template",
              "Automation Sheet System"
            ]
          },
          "faq": [
            {
              "q": "Apakah dashboard ini bisa berjalan tanpa BI tools mahal?",
              "a": "Bisa. Bisa menggunakan Google Sheets + automation, atau Supabase + lightweight dashboard."
            }
          ],
          "case_study_refs": []
        }
      ]
    }
  ]
}
```

---

# 3) TEMPLATE WA PREFILLED MESSAGE (HIGH CONVERSION)

Kunci WA message yang conversion-friendly itu:

* **singkat**
* ada struktur data
* bikin kamu kelihatan “punya sistem”
* memaksa user menjawab dengan format yang rapi

## Template WA Universal (Mode-Aware)

Gunakan ini untuk semua segmen:

```
Halo Kang Zadit, saya ingin konsultasi.

[MODE] : {MARKETING / ACADEMIC / BUSINESS}
Tujuan utama saya: {goal}
Masalah utama saat ini: {challenge}

Urgensi: {today/this_week/this_month/flexible}
Budget/Range: {budget_range}
Target hasil yang diharapkan: {expected_outcome}

Nama: {full_name}
Instansi/Brand: {company}
Role: {role}
Email: {email}

Saya sudah submit form di website: {landing_path}
Mohon arahan next step 🙏
```

> Ini bagus karena membuat user “terkunci” memberi informasi penting tanpa kamu tanya ulang.

---

## Template WA Marketing Mode (Lebih Tajam untuk B2B)

Ini versi yang lebih “enterprise vibe”:

```
Halo Kang Zadit, saya tertarik untuk Growth/Marketing Strategy.

Brand/Produk: {company}
Objective utama: {goal}
Channel yang sedang dipakai: {channels}
Problem utama: {challenge}

Budget range: {budget_range}
Urgensi: {urgency}
Target KPI: {kpi_target}

Saya ingin minta rekomendasi:
(1) Paket yang paling cocok
(2) Timeline eksekusi
(3) Step awal yang harus disiapkan

Nama: {full_name}
Role: {role}
Email: {email}

Saya submit dari website: {landing_path}
```

---

## Template WA Academic Mode (Ethical + Trust)

Karena ini harus “harm reduction” dan tidak melanggar integritas.

```
Assalamu’alaikum Kang Zadit, saya ingin konsultasi bimbingan akademik.

Jenjang: {S1/S2}
Topik: {topic}
Progress saat ini: {progress}

Masalah utama: {challenge}
Deadline: {deadline_date}
Kebutuhan utama: {data_analysis / struktur / proofreading / sitasi}

Nama: {full_name}
Email: {email}

Saya sudah isi form di website: {landing_path}
Mohon arahan prosedur bimbingannya 🙏
```

---

## Template WA Business Mode (Executive Style)

```
Halo Kang Zadit, saya butuh support dokumen bisnis.

Kebutuhan: {pitch_deck / SOP / proposal / report}
Tujuan dokumen: {goal}
Audiens dokumen: {investor / internal / client}

Deadline: {deadline_date}
Kompleksitas: {low/medium/high}

Nama: {full_name}
Instansi: {company}
Email: {email}

Saya submit form via website: {landing_path}
Mohon estimasi timeline + step berikutnya 🙏
```

---

# 4) IMPLEMENTASI WA LINK GENERATOR (URL ENCODE SAFE)

Format:

```
https://wa.me/6282316363177?text={ENCODED_TEXT}
```

Contoh pseudo function:

```ts
export function buildWhatsAppLink(phone: string, text: string) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
}
```

---

# 5) TEMPLATE “AUTO MESSAGE” YANG PALING MENJUAL (BEST VERSION)

Kalau kamu mau 1 template paling “closing oriented”, pakai ini:

```
Halo Kang Zadit, saya ingin request rekomendasi strategi.

Mode: {segment}
Objective: {goal}
Problem utama: {challenge}

Urgensi: {urgency}
Budget range: {budget_range}

Saya ingin minta output cepat:
- Paket yang paling cocok
- Timeline eksekusi
- Estimasi deliverables

Nama: {full_name}
Instansi: {company}
Role: {role}
Email: {email}

(Submitted via website)
```

Ini *closing-friendly* karena user secara eksplisit meminta “paket + timeline + deliverables” → otomatis masuk framing sales.

---

# 6) BONUS: TEMPLATE “FOLLOW-UP BOT STYLE” (UNTUK KAMU COPY PASTE BALAS)

Saat lead masuk WA, kamu balas pakai format ini (super efektif):

```
Siap, saya tangkap dulu ya.

Ringkasan kebutuhan Anda:
- Objective: {goal}
- Problem: {challenge}
- Urgency: {urgency}
- Budget: {budget_range}

Saya akan rekomendasikan 2 opsi:
(1) Quick Fix Sprint (fast impact)
(2) Growth System Plan (stabil & scalable)

Boleh saya tanya 1 hal dulu:
Saat ini trafik/lead terbesar datang dari channel mana?
(Ads / SEO / Marketplace / Referral)
```

Ini membuat kamu terlihat “punya framework” → trust naik → closing lebih cepat.

---

Siap. Ini script **seeding otomatis Node.js** yang membaca `/data/industries.seed.json` lalu insert ke Supabase tables: `industries` dan `problems`.

Target: bisa dijalankan sekali lewat terminal, aman (upsert), dan cocok untuk Next.js repo kamu.

---

# 1) Install Dependency

Di root project:

```bash
npm install @supabase/supabase-js dotenv
```

---

# 2) Buat File ENV

Buat `.env.local` (atau `.env` khusus seeding):

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> Gunakan **SERVICE ROLE KEY** agar bisa insert tanpa masalah RLS. Jangan expose ini ke client.

---

# 3) Buat Script Seeder

Buat folder:

```
/scripts
  seed-industries.mjs
```

Isi file: `scripts/seed-industries.mjs`

```js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const filePath = path.join(process.cwd(), "data", "industries.seed.json");

if (!fs.existsSync(filePath)) {
  console.error("❌ industries.seed.json not found at:", filePath);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, "utf-8");
const payload = JSON.parse(raw);

if (!payload.industries || !Array.isArray(payload.industries)) {
  console.error("❌ Invalid JSON structure: expected { industries: [] }");
  process.exit(1);
}

async function seedIndustries() {
  console.log("🚀 Starting seed process...");

  for (const industry of payload.industries) {
    const {
      slug,
      title,
      short_description,
      pain_points,
      recommended_services,
      faq,
      keywords,
      problems
    } = industry;

    if (!slug || !title) {
      console.warn("⚠️ Skipping invalid industry (missing slug/title):", industry);
      continue;
    }

    console.log(`\n📌 Upserting industry: ${slug}`);

    const { error: industryError } = await supabase
      .from("industries")
      .upsert(
        {
          slug,
          title,
          short_description: short_description || null,
          pain_points: pain_points || [],
          recommended_services: recommended_services || [],
          faq: faq || [],
          keywords: keywords || [],
          schema_jsonld: {}
        },
        { onConflict: "slug" }
      );

    if (industryError) {
      console.error("❌ Failed inserting industry:", slug, industryError);
      continue;
    }

    if (problems && Array.isArray(problems)) {
      for (const problem of problems) {
        const {
          slug: problemSlug,
          problem_statement,
          solution_framework,
          faq: problemFaq,
          case_study_refs
        } = problem;

        if (!problemSlug || !problem_statement) {
          console.warn("⚠️ Skipping invalid problem:", problem);
          continue;
        }

        console.log(`   ↳ Upserting problem: ${slug}/${problemSlug}`);

        const { error: problemError } = await supabase
          .from("problems")
          .upsert(
            {
              industry_slug: slug,
              slug: problemSlug,
              problem_statement,
              solution_framework: solution_framework || {},
              faq: problemFaq || [],
              case_study_refs: case_study_refs || []
            },
            { onConflict: "industry_slug,slug" }
          );

        if (problemError) {
          console.error(
            `❌ Failed inserting problem: ${slug}/${problemSlug}`,
            problemError
          );
        }
      }
    }
  }

  console.log("\n✅ Seeding finished successfully.");
}

seedIndustries()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding crashed:", err);
    process.exit(1);
  });
```

---

# 4) Tambahkan Script ke package.json

Di `package.json`:

```json
{
  "scripts": {
    "seed:industries": "node scripts/seed-industries.mjs"
  }
}
```

---

# 5) Jalankan Seeder

```bash
npm run seed:industries
```

Output akan seperti:

* Upserting industry: ecommerce
* Upserting problem: ecommerce/high-cac-low-roas
* dst…

---

# 6) (Optional) Seeder Reset Mode (Delete dulu)

Kalau kamu mau mode “reset then seed”, buat script kedua:

`scripts/reset-industries.mjs`

```js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function reset() {
  console.log("⚠️ Deleting problems...");
  await supabase.from("problems").delete().neq("slug", "");

  console.log("⚠️ Deleting industries...");
  await supabase.from("industries").delete().neq("slug", "");

  console.log("✅ Reset done.");
}

reset()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  });
```

Tambah ke `package.json`:

```json
{
  "scripts": {
    "reset:industries": "node scripts/reset-industries.mjs",
    "seed:industries": "node scripts/seed-industries.mjs"
  }
}
```

Run:

```bash
npm run reset:industries
npm run seed:industries
```

---

# 7) Best Practice: Add Guard Against Production Accident

Tambahkan env `NODE_ENV` guard (sangat disarankan).

Di seed script:

```js
if (process.env.NODE_ENV === "production") {
  console.error("❌ Seeding blocked in production mode.");
  process.exit(1);
}
```

---

# 8) Optional Upgrade: Auto Generate schema_jsonld

Kalau mau advanced, setiap industry bisa auto schema:

```js
const schema_jsonld = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": `Zadit Strategic Solutions for ${title}`,
  "areaServed": "ID",
  "description": short_description
};
```

Lalu simpan ke `schema_jsonld`.

---

Siap. Tapi ada 1 catatan: **tools.json** dan **products.json** sebenarnya bisa full-static tanpa Supabase. Namun untuk growth (affiliate click tracking, featured listing, sorting, admin update), lebih bagus disimpan di Supabase juga.

Jadi aku buatkan:

1. **Supabase schema tambahan** (radar_sources, tools, products)
2. **seed JSON files** (`/data/radar.sources.json`, `/data/tools.json`, `/data/products.json`)
3. **Node.js seed scripts** untuk ketiganya.

---

# 1) SUPABASE SCHEMA TAMBAHAN

Tambahkan ke `/supabase/schema.sql`

```sql
-- =========================================
-- RADAR SOURCES
-- =========================================
create table if not exists radar_sources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  name text not null,
  rss_url text not null unique,
  site_url text,
  category text,
  is_active boolean default true,
  priority int default 50
);

create index if not exists idx_radar_sources_active on radar_sources(is_active);
create index if not exists idx_radar_sources_priority on radar_sources(priority desc);

-- =========================================
-- TOOLS (Affiliate Hub)
-- =========================================
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  slug text not null unique,
  name text not null,
  category text,
  description text,
  pricing text,
  badge text, -- Recommended / Best Value / Popular

  segments text[] default '{}', -- marketing/academic/business
  affiliate_url text,
  website_url text,

  is_featured boolean default false,
  priority int default 50
);

create index if not exists idx_tools_segments on tools using gin(segments);
create index if not exists idx_tools_featured on tools(is_featured);
create index if not exists idx_tools_priority on tools(priority desc);

-- =========================================
-- STORE PRODUCTS (Digital Products)
-- =========================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  slug text not null unique,
  title text not null,
  description text,
  price_idr int default 0,
  product_type text, -- template, ebook, spreadsheet, service-pack

  segments text[] default '{}',
  cover_image text,

  checkout_url text not null,
  is_featured boolean default false,
  priority int default 50
);

create index if not exists idx_products_segments on products using gin(segments);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_products_priority on products(priority desc);
```

---

# 2) SUPABASE RLS POLICIES TAMBAHAN

Tambahkan ke `/supabase/policies.sql`

```sql
alter table radar_sources enable row level security;
alter table tools enable row level security;
alter table products enable row level security;

-- radar_sources: public select only
create policy "public_select_radar_sources"
on radar_sources for select
to anon
using (true);

-- tools: public select only
create policy "public_select_tools"
on tools for select
to anon
using (true);

-- products: public select only
create policy "public_select_products"
on products for select
to anon
using (true);
```

---

# 3) DATA FILES

## A) `/data/radar.sources.json`

```json
{
  "sources": [
    {
      "name": "Google Search Central Blog",
      "rss_url": "https://developers.google.com/search/blog/rss.xml",
      "site_url": "https://developers.google.com/search/blog",
      "category": "SEO",
      "is_active": true,
      "priority": 95
    },
    {
      "name": "Ahrefs Blog",
      "rss_url": "https://ahrefs.com/blog/feed/",
      "site_url": "https://ahrefs.com/blog",
      "category": "SEO",
      "is_active": true,
      "priority": 90
    },
    {
      "name": "Search Engine Journal",
      "rss_url": "https://www.searchenginejournal.com/feed/",
      "site_url": "https://www.searchenginejournal.com",
      "category": "SEO",
      "is_active": true,
      "priority": 88
    },
    {
      "name": "Search Engine Land",
      "rss_url": "https://searchengineland.com/feed",
      "site_url": "https://searchengineland.com",
      "category": "SEO",
      "is_active": true,
      "priority": 85
    },
    {
      "name": "Moz Blog",
      "rss_url": "https://moz.com/blog/feed",
      "site_url": "https://moz.com/blog",
      "category": "SEO",
      "is_active": true,
      "priority": 80
    },
    {
      "name": "Vercel Blog",
      "rss_url": "https://vercel.com/blog/rss.xml",
      "site_url": "https://vercel.com/blog",
      "category": "Engineering",
      "is_active": true,
      "priority": 82
    },
    {
      "name": "OpenAI Blog",
      "rss_url": "https://openai.com/blog/rss.xml",
      "site_url": "https://openai.com/blog",
      "category": "AI",
      "is_active": true,
      "priority": 75
    },
    {
      "name": "Cloudflare Blog",
      "rss_url": "https://blog.cloudflare.com/rss/",
      "site_url": "https://blog.cloudflare.com",
      "category": "Infrastructure",
      "is_active": true,
      "priority": 70
    },
    {
      "name": "Hacker News (Frontpage)",
      "rss_url": "https://hnrss.org/frontpage",
      "site_url": "https://news.ycombinator.com",
      "category": "Tech",
      "is_active": true,
      "priority": 60
    }
  ]
}
```

---

## B) `/data/tools.json` (Affiliate Hub Seed)

```json
{
  "tools": [
    {
      "slug": "vercel",
      "name": "Vercel",
      "category": "Hosting",
      "description": "Deploy Next.js apps with edge performance and seamless CI/CD.",
      "pricing": "Free / Pro / Enterprise",
      "badge": "Recommended",
      "segments": ["marketing", "business"],
      "affiliate_url": "https://vercel.com",
      "website_url": "https://vercel.com",
      "is_featured": true,
      "priority": 95
    },
    {
      "slug": "supabase",
      "name": "Supabase",
      "category": "Database",
      "description": "Postgres + Auth + Storage. Perfect for SaaS and data-driven dashboards.",
      "pricing": "Free / Pro",
      "badge": "Best Value",
      "segments": ["marketing", "business"],
      "affiliate_url": "https://supabase.com",
      "website_url": "https://supabase.com",
      "is_featured": true,
      "priority": 93
    },
    {
      "slug": "resend",
      "name": "Resend",
      "category": "Email API",
      "description": "Transactional email infrastructure with developer-first workflow.",
      "pricing": "Free / Paid",
      "badge": "Recommended",
      "segments": ["marketing", "business"],
      "affiliate_url": "https://resend.com",
      "website_url": "https://resend.com",
      "is_featured": true,
      "priority": 88
    },
    {
      "slug": "ahrefs",
      "name": "Ahrefs",
      "category": "SEO Tools",
      "description": "SEO research suite for backlink analysis, keyword tracking, and competitor intelligence.",
      "pricing": "Paid",
      "badge": "Industry Standard",
      "segments": ["marketing"],
      "affiliate_url": "https://ahrefs.com",
      "website_url": "https://ahrefs.com",
      "is_featured": true,
      "priority": 92
    },
    {
      "slug": "semrush",
      "name": "SEMrush",
      "category": "SEO Tools",
      "description": "SEO + PPC intelligence suite for campaign planning and competitive research.",
      "pricing": "Paid",
      "badge": "Popular",
      "segments": ["marketing"],
      "affiliate_url": "https://semrush.com",
      "website_url": "https://semrush.com",
      "is_featured": false,
      "priority": 80
    },
    {
      "slug": "canva",
      "name": "Canva",
      "category": "Design",
      "description": "Fast design workflow for marketing creatives and presentations.",
      "pricing": "Free / Pro",
      "badge": "Best Value",
      "segments": ["marketing", "business", "academic"],
      "affiliate_url": "https://canva.com",
      "website_url": "https://canva.com",
      "is_featured": true,
      "priority": 85
    },
    {
      "slug": "zotero",
      "name": "Zotero",
      "category": "Academic",
      "description": "Citation and bibliography manager for research writing workflows.",
      "pricing": "Free",
      "badge": "Recommended",
      "segments": ["academic"],
      "affiliate_url": "https://www.zotero.org",
      "website_url": "https://www.zotero.org",
      "is_featured": true,
      "priority": 90
    },
    {
      "slug": "mendeley",
      "name": "Mendeley",
      "category": "Academic",
      "description": "Reference manager for organizing PDFs and citations.",
      "pricing": "Free / Paid",
      "badge": "Popular",
      "segments": ["academic"],
      "affiliate_url": "https://www.mendeley.com",
      "website_url": "https://www.mendeley.com",
      "is_featured": false,
      "priority": 70
    }
  ]
}
```

---

## C) `/data/products.json` (Store Seed)

```json
{
  "products": [
    {
      "slug": "campaign-budget-matrix",
      "title": "Campaign Budget Architecture Matrix (Spreadsheet)",
      "description": "Template spreadsheet untuk membangun full-funnel budget allocation + KPI tracking.",
      "price_idr": 149000,
      "product_type": "spreadsheet",
      "segments": ["marketing"],
      "cover_image": "/images/store/campaign-budget-matrix.webp",
      "checkout_url": "https://gumroad.com/your-product-link",
      "is_featured": true,
      "priority": 95
    },
    {
      "slug": "seo-offpage-linkmap-kit",
      "title": "Off-Page SEO Linkmap Kit (DA80+ Strategy Sheet)",
      "description": "Template untuk mapping backlink, spam score mitigation, dan authority acquisition plan.",
      "price_idr": 199000,
      "product_type": "spreadsheet",
      "segments": ["marketing"],
      "cover_image": "/images/store/seo-linkmap-kit.webp",
      "checkout_url": "https://gumroad.com/your-product-link",
      "is_featured": true,
      "priority": 92
    },
    {
      "slug": "academic-thesis-framework",
      "title": "Academic Thesis Framework (Outline + Citation System)",
      "description": "Framework skripsi/tesis berbasis struktur logika, checklist metodologi, dan manajemen sitasi.",
      "price_idr": 99000,
      "product_type": "ebook",
      "segments": ["academic"],
      "cover_image": "/images/store/thesis-framework.webp",
      "checkout_url": "https://gumroad.com/your-product-link",
      "is_featured": true,
      "priority": 90
    },
    {
      "slug": "pitch-deck-sprint-template",
      "title": "Pitch Deck Sprint Template (Executive Storytelling)",
      "description": "Template slide kompak untuk investor/client, termasuk struktur executive summary & KPI story.",
      "price_idr": 179000,
      "product_type": "template",
      "segments": ["business"],
      "cover_image": "/images/store/pitch-deck-template.webp",
      "checkout_url": "https://gumroad.com/your-product-link",
      "is_featured": false,
      "priority": 80
    }
  ]
}
```

---

# 4) NODE.JS SEED SCRIPT: RADAR SOURCES

Buat file:

`/scripts/seed-radar-sources.mjs`

```js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const filePath = path.join(process.cwd(), "data", "radar.sources.json");

if (!fs.existsSync(filePath)) {
  console.error("❌ radar.sources.json not found:", filePath);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function seedRadarSources() {
  console.log("🚀 Seeding radar_sources...");

  if (!payload.sources || !Array.isArray(payload.sources)) {
    throw new Error("Invalid JSON structure. Expected { sources: [] }");
  }

  for (const source of payload.sources) {
    if (!source.name || !source.rss_url) {
      console.warn("⚠️ Skipping invalid source:", source);
      continue;
    }

    console.log(`📡 Upserting: ${source.name}`);

    const { error } = await supabase
      .from("radar_sources")
      .upsert(
        {
          name: source.name,
          rss_url: source.rss_url,
          site_url: source.site_url || null,
          category: source.category || null,
          is_active: source.is_active ?? true,
          priority: source.priority ?? 50
        },
        { onConflict: "rss_url" }
      );

    if (error) {
      console.error("❌ Failed upserting radar source:", source.name, error);
    }
  }

  console.log("✅ radar_sources seeding complete.");
}

seedRadarSources()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed crashed:", err);
    process.exit(1);
  });
```

---

# 5) NODE.JS SEED SCRIPT: TOOLS

Buat file:

`/scripts/seed-tools.mjs`

```js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const filePath = path.join(process.cwd(), "data", "tools.json");

if (!fs.existsSync(filePath)) {
  console.error("❌ tools.json not found:", filePath);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function seedTools() {
  console.log("🚀 Seeding tools...");

  if (!payload.tools || !Array.isArray(payload.tools)) {
    throw new Error("Invalid JSON structure. Expected { tools: [] }");
  }

  for (const tool of payload.tools) {
    if (!tool.slug || !tool.name) {
      console.warn("⚠️ Skipping invalid tool:", tool);
      continue;
    }

    console.log(`🛠 Upserting tool: ${tool.slug}`);

    const { error } = await supabase
      .from("tools")
      .upsert(
        {
          slug: tool.slug,
          name: tool.name,
          category: tool.category || null,
          description: tool.description || null,
          pricing: tool.pricing || null,
          badge: tool.badge || null,

          segments: tool.segments || [],
          affiliate_url: tool.affiliate_url || null,
          website_url: tool.website_url || null,

          is_featured: tool.is_featured ?? false,
          priority: tool.priority ?? 50
        },
        { onConflict: "slug" }
      );

    if (error) {
      console.error("❌ Failed upserting tool:", tool.slug, error);
    }
  }

  console.log("✅ tools seeding complete.");
}

seedTools()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed crashed:", err);
    process.exit(1);
  });
```

---

# 6) NODE.JS SEED SCRIPT: PRODUCTS

Buat file:

`/scripts/seed-products.mjs`

```js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const filePath = path.join(process.cwd(), "data", "products.json");

if (!fs.existsSync(filePath)) {
  console.error("❌ products.json not found:", filePath);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function seedProducts() {
  console.log("🚀 Seeding products...");

  if (!payload.products || !Array.isArray(payload.products)) {
    throw new Error("Invalid JSON structure. Expected { products: [] }");
  }

  for (const product of payload.products) {
    if (!product.slug || !product.title || !product.checkout_url) {
      console.warn("⚠️ Skipping invalid product:", product);
      continue;
    }

    console.log(`🛒 Upserting product: ${product.slug}`);

    const { error } = await supabase
      .from("products")
      .upsert(
        {
          slug: product.slug,
          title: product.title,
          description: product.description || null,
          price_idr: product.price_idr ?? 0,
          product_type: product.product_type || null,

          segments: product.segments || [],
          cover_image: product.cover_image || null,

          checkout_url: product.checkout_url,
          is_featured: product.is_featured ?? false,
          priority: product.priority ?? 50
        },
        { onConflict: "slug" }
      );

    if (error) {
      console.error("❌ Failed upserting product:", product.slug, error);
    }
  }

  console.log("✅ products seeding complete.");
}

seedProducts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed crashed:", err);
    process.exit(1);
  });
```

---

# 7) UPDATE package.json (ALL SEED COMMANDS)

Tambahkan:

```json
{
  "scripts": {
    "seed:industries": "node scripts/seed-industries.mjs",
    "seed:radar": "node scripts/seed-radar-sources.mjs",
    "seed:tools": "node scripts/seed-tools.mjs",
    "seed:products": "node scripts/seed-products.mjs",
    "seed:all": "npm run seed:industries && npm run seed:radar && npm run seed:tools && npm run seed:products"
  }
}
```

Lalu jalankan:

```bash
npm run seed:all
```

---

# 8) OPTIONAL (RECOMMENDED): VALIDATION HARDENING

Kalau mau strict, tambahkan guard:

* `segments` harus subset dari `["marketing","academic","business"]`
* `priority` 0–100
* url must start with https

Tapi untuk MVP ini cukup.

---

# 9) BONUS: RADAR CRON UPGRADE (READ FROM radar_sources TABLE)

Sekarang cron radar tidak hardcode. Fetch dari DB:

Pseudo:

```ts
const { data: sources } = await supabase
  .from("radar_sources")
  .select("*")
  .eq("is_active", true)
  .order("priority", { ascending: false });
```

Lalu loop parse RSS.

---

# 10) MINIMUM ADMIN UPDATE PATH (OPTIONAL)

Kalau kamu buat `/admin`, kamu bisa edit:

* toggle radar_sources active
* reorder tools priority
* feature product

Ini bikin website kamu jadi “living system”.

---

Berikut **kode lengkap** untuk cron route `/api/cron/radar` di Next.js 14 App Router yang melakukan:

✅ Fetch RSS sources dari tabel `radar_sources`
✅ Parse RSS dengan `rss-parser`
✅ Hashing/dedup logic (URL + content hash)
✅ Upsert ke `radar_items`
✅ Aman untuk Vercel Cron (Edge/Node runtime)
✅ Proteksi secret token (`CRON_SECRET`)
✅ Sanitasi HTML basic

---

# 0) Install Dependencies

```bash
npm install rss-parser
```

---

# 1) Tambahkan ENV di Vercel / .env.local

```env
CRON_SECRET=your-secret-token
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> Cron harus pakai **SERVICE ROLE KEY** karena dia server-to-server.

---

# 2) Buat Supabase Server Client

File: `/lib/supabase/server.ts`

```ts
import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false
    }
  });
}
```

---

# 3) Buat Hash Utility

File: `/lib/utils/hash.ts`

```ts
import crypto from "crypto";

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
```

---

# 4) Buat Sanitizer Utility (Simple)

File: `/lib/utils/sanitize.ts`

```ts
export function stripHtml(html?: string | null) {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max = 400) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}
```

---

# 5) Cron Route Code Lengkap

Buat file:

`/app/api/cron/radar/route.ts`

```ts
import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { sha256 } from "@/lib/utils/hash";
import { stripHtml, truncate } from "@/lib/utils/sanitize";

export const runtime = "nodejs"; // IMPORTANT: rss-parser uses Node APIs

type RadarSource = {
  id: string;
  name: string;
  rss_url: string;
  site_url: string | null;
  category: string | null;
  is_active: boolean;
  priority: number;
};

type RSSItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
};

function requireCronAuth(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("Missing CRON_SECRET env var");

  const authHeader = req.headers.get("authorization");
  const tokenHeader = req.headers.get("x-cron-secret");

  const token = authHeader?.replace("Bearer ", "") || tokenHeader;

  if (!token || token !== secret) {
    return false;
  }
  return true;
}

function normalizeUrl(url: string) {
  try {
    const u = new URL(url);
    u.hash = "";
    // remove utm parameters to prevent duplicates
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
      (k) => u.searchParams.delete(k)
    );
    return u.toString();
  } catch {
    return url;
  }
}

function buildContentHash(item: {
  title: string;
  url: string;
  summary: string;
  published_at?: string | null;
}) {
  const raw = `${item.title}|${item.url}|${item.summary}|${item.published_at ?? ""}`;
  return sha256(raw);
}

export async function GET(req: Request) {
  try {
    // 1) Auth check
    if (!requireCronAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized cron request" },
        { status: 401 }
      );
    }

    const supabase = createSupabaseAdmin();

    // 2) Fetch active RSS sources
    const { data: sources, error: sourcesError } = await supabase
      .from("radar_sources")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: false });

    if (sourcesError) {
      return NextResponse.json(
        { success: false, error: sourcesError.message },
        { status: 500 }
      );
    }

    if (!sources || sources.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active radar sources.",
        inserted: 0,
        skipped: 0
      });
    }

    const parser = new Parser({
      timeout: 15000,
      headers: {
        "User-Agent": "ZaditRadarBot/1.0 (+https://yourdomain.com)"
      }
    });

    let inserted = 0;
    let skipped = 0;
    let errors: any[] = [];

    // 3) Loop each RSS source
    for (const source of sources as RadarSource[]) {
      try {
        const feed = await parser.parseURL(source.rss_url);

        if (!feed.items || feed.items.length === 0) continue;

        for (const rawItem of feed.items as RSSItem[]) {
          const titleRaw = rawItem.title?.trim() || "";
          const linkRaw = rawItem.link?.trim() || "";

          if (!titleRaw || !linkRaw) {
            skipped++;
            continue;
          }

          const url = normalizeUrl(linkRaw);

          const pubDate = rawItem.isoDate || rawItem.pubDate || null;

          // summary priority: snippet > summary > content
          const summaryText = truncate(
            stripHtml(rawItem.contentSnippet || rawItem.summary || rawItem.content || ""),
            500
          );

          // build content hash
          const content_hash = buildContentHash({
            title: titleRaw,
            url,
            summary: summaryText,
            published_at: pubDate
          });

          // 4) Dedup check by URL first (fast)
          const { data: existingByUrl, error: existError } = await supabase
            .from("radar_items")
            .select("id, content_hash")
            .eq("url", url)
            .maybeSingle();

          if (existError) {
            errors.push({ source: source.name, stage: "check_url", error: existError.message });
            skipped++;
            continue;
          }

          // If exists and hash is same -> skip
          if (existingByUrl?.id && existingByUrl.content_hash === content_hash) {
            skipped++;
            continue;
          }

          // If exists but content changed -> update row
          if (existingByUrl?.id && existingByUrl.content_hash !== content_hash) {
            const { error: updateError } = await supabase
              .from("radar_items")
              .update({
                title: titleRaw,
                source_name: source.name,
                source_url: source.site_url,
                published_at: pubDate,
                summary: summaryText,
                tags: [],

                why_it_matters: null,
                takeaway: null,
                recommended_service: null,

                content_hash
              })
              .eq("id", existingByUrl.id);

            if (updateError) {
              errors.push({
                source: source.name,
                stage: "update_item",
                error: updateError.message
              });
            } else {
              inserted++;
            }

            continue;
          }

          // 5) Insert new item
          const { error: insertError } = await supabase.from("radar_items").insert({
            source_name: source.name,
            source_url: source.site_url,
            title: titleRaw,
            url,
            published_at: pubDate,
            summary: summaryText,
            tags: [],

            why_it_matters: null,
            takeaway: null,
            recommended_service: null,

            content_hash,
            is_featured: false
          });

          if (insertError) {
            // if race condition duplicate unique url, count as skip
            if (insertError.message.includes("duplicate key value")) {
              skipped++;
              continue;
            }

            errors.push({
              source: source.name,
              stage: "insert_item",
              error: insertError.message
            });

            skipped++;
          } else {
            inserted++;
          }
        }
      } catch (err: any) {
        errors.push({
          source: source.name,
          stage: "parse_feed",
          error: err?.message || String(err)
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Radar cron completed",
      sources_count: sources.length,
      inserted,
      skipped,
      errors_count: errors.length,
      errors: errors.slice(0, 20) // prevent massive output
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
```

---

# 6) Vercel Cron Setup

Di `vercel.json` (root project):

```json
{
  "crons": [
    {
      "path": "/api/cron/radar",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

> Ini akan run setiap 4 jam.

---

# 7) Cara Memanggil Cron dengan Secret

Karena Vercel cron bisa akses endpoint langsung, kamu perlu secret via header.

Vercel Cron tidak otomatis kasih header secret. Jadi ada 2 opsi:

### Opsi A (paling simple)

Jadikan cron endpoint **tanpa secret**, tapi batasi:

* hanya GET
* rate limit
* random URL path secret

Contoh:
`/api/cron/radar?key=xxxxx`

### Opsi B (lebih proper)

Gunakan `?token=` query.

Aku rekomendasikan **query param token** karena Vercel Cron config lebih mudah.

Kalau kamu mau query param token, modifikasi auth function jadi:

```ts
const { searchParams } = new URL(req.url);
const token = searchParams.get("token");
if (token !== process.env.CRON_SECRET) unauthorized;
```

Kalau mau, aku bisa tuliskan versi finalnya juga.

---

# 8) REKOMENDASI DEDUP STRATEGY (YANG PALING AMAN)

Saat ini kita dedup:

* unique by URL
* content_hash untuk detect update

**Best practice tambahan:**

* kalau feed berbeda punya URL sama, tetap aman karena url unique.
* normalisasi UTM sudah diterapkan.

---

# 9) NEXT STEP (HIGH IMPACT)

Setelah cron ingest berhasil, baru buat cron kedua:

`/api/cron/radar-enrich`:

* ambil 10 item terbaru yang `why_it_matters is null`
* generate summary + tags + takeaway
* update

Supaya radar kamu jadi “insight engine” bukan RSS dump.

---

Siap. Ini versi lengkap **/api/cron/radar-enrich** yang:

✅ mengambil item radar terbaru yang belum diperkaya
✅ fallback non-AI (rule-based tagging + takeaway template)
✅ optional AI enrichment (OpenAI/Gemini via fetch endpoint)
✅ aman untuk cron (token auth)
✅ update Supabase dengan hasil enrichment
✅ batching + limit untuk menghindari cost overload

Aku desain supaya **bisa jalan tanpa AI sama sekali**, tapi ketika AI key tersedia dia otomatis naik kelas.

---

# 0) ENV VARS

Tambahkan ini di `.env.local` / Vercel:

```env
CRON_SECRET=your-secret-token
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional AI enrichment (pilih salah satu)
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4o-mini

# Optional: custom setting
RADAR_ENRICH_LIMIT=15
```

> Jika `OPENAI_API_KEY` tidak ada, sistem otomatis pakai fallback non-AI.

---

# 1) Utility: Tagging Heuristic (Non-AI)

Buat file:

`/lib/radar/enrich.ts`

```ts
export type RadarEnrichment = {
  tags: string[];
  why_it_matters: string;
  takeaway: string;
  recommended_service: string | null;
};

const TAG_RULES: { tag: string; keywords: string[] }[] = [
  { tag: "SEO", keywords: ["seo", "search", "google", "serp", "ranking", "indexing"] },
  { tag: "AI", keywords: ["ai", "openai", "llm", "chatgpt", "gemini", "model"] },
  { tag: "Marketing", keywords: ["ads", "campaign", "roas", "conversion", "funnel"] },
  { tag: "Engineering", keywords: ["next.js", "vercel", "typescript", "react", "node"] },
  { tag: "Security", keywords: ["security", "breach", "vulnerability", "attack"] },
  { tag: "Startup", keywords: ["startup", "funding", "series", "seed round"] },
  { tag: "Product", keywords: ["product", "launch", "feature", "roadmap"] },
  { tag: "Infrastructure", keywords: ["cloudflare", "cdn", "edge", "latency", "hosting"] }
];

function extractTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags: string[] = [];

  for (const rule of TAG_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      tags.push(rule.tag);
    }
  }

  if (tags.length === 0) tags.push("Tech");
  return [...new Set(tags)].slice(0, 5);
}

function guessRecommendedService(tags: string[]) {
  if (tags.includes("SEO")) return "Advanced Off-Page SEO & Link Building";
  if (tags.includes("Marketing")) return "Campaign Strategic & Budget Architecture";
  if (tags.includes("Engineering")) return "Business Data Visualization & Dashboard";
  if (tags.includes("Product")) return "Pitch Deck & Presentation Design";
  return null;
}

export function fallbackEnrichRadarItem(title: string, summary: string): RadarEnrichment {
  const baseText = `${title} ${summary}`.trim();
  const tags = extractTags(baseText);

  const why_it_matters =
    tags.includes("SEO")
      ? "Update ini relevan untuk strategi visibilitas organik dan positioning SERP."
      : tags.includes("AI")
        ? "Perkembangan ini memengaruhi cara produk digital membangun automation dan decision support."
        : tags.includes("Marketing")
          ? "Informasi ini dapat memengaruhi strategi funnel, CAC, dan optimasi ROI campaign."
          : "Insight ini berpotensi memengaruhi arah strategi teknologi dan eksekusi bisnis.";

  const takeaway =
    tags.includes("SEO")
      ? "Audit konten dan internal linking untuk memastikan strategi SEO tetap adaptif."
      : tags.includes("AI")
        ? "Evaluasi peluang implementasi AI untuk workflow, automation, dan enrichment konten."
        : tags.includes("Marketing")
          ? "Pastikan KPI campaign terukur dan lakukan iterasi kreatif berbasis data."
          : "Pantau perubahan ini dan siapkan penyesuaian strategi dalam roadmap eksekusi.";

  const recommended_service = guessRecommendedService(tags);

  return {
    tags,
    why_it_matters,
    takeaway,
    recommended_service
  };
}
```

---

# 2) Optional AI Enrichment Utility (OpenAI)

Buat file:

`/lib/radar/ai.ts`

```ts
import type { RadarEnrichment } from "./enrich";

export async function aiEnrichRadarItem(params: {
  title: string;
  summary: string;
  url?: string;
}) : Promise<RadarEnrichment | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) return null;

  const { title, summary, url } = params;

  const prompt = `
You are an expert analyst in SEO, marketing strategy, engineering, and business systems.
Your task: enrich a news item for an "Industry Radar" dashboard.

Return ONLY valid JSON with keys:
- tags: array of 3-6 short tags (example: ["SEO","Google","Indexing"])
- why_it_matters: 1 sentence in Indonesian
- takeaway: 1 sentence in Indonesian (actionable)
- recommended_service: choose one of:
  "Campaign Strategic & Budget Architecture"
  "Advanced Off-Page SEO & Link Building"
  "Brand Voice Engineering & Copywriting"
  "Bimbingan Tugas Akhir & Skripsi/Tesis"
  "Analisis & Visualisasi Data Akademik"
  "Penyusunan Makalah & Manajemen Sitasi"
  "Pitch Deck & Presentation Design"
  "Business Data Visualization & Dashboard"
  "Penyusunan Dokumen SOP & Copy Bisnis"
  or null

NEWS ITEM:
Title: ${title}
Summary: ${summary}
URL: ${url || ""}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a strict JSON generator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) return null;

  try {
    const parsed = JSON.parse(content);

    if (!parsed.tags || !parsed.why_it_matters || !parsed.takeaway) return null;

    return {
      tags: parsed.tags,
      why_it_matters: parsed.why_it_matters,
      takeaway: parsed.takeaway,
      recommended_service: parsed.recommended_service ?? null
    };
  } catch {
    return null;
  }
}
```

> Ini “optional integration”. Kalau tidak ada key, fungsi akan return `null`.

---

# 3) Cron Route: /api/cron/radar-enrich (FULL)

Buat file:

`/app/api/cron/radar-enrich/route.ts`

```ts
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { fallbackEnrichRadarItem } from "@/lib/radar/enrich";
import { aiEnrichRadarItem } from "@/lib/radar/ai";

export const runtime = "nodejs";

function requireCronAuth(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("Missing CRON_SECRET env var");

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token || token !== secret) return false;
  return true;
}

export async function GET(req: Request) {
  try {
    if (!requireCronAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized cron request" },
        { status: 401 }
      );
    }

    const supabase = createSupabaseAdmin();

    const limit = Number(process.env.RADAR_ENRICH_LIMIT || 15);

    // 1) Fetch radar items that need enrichment
    const { data: items, error } = await supabase
      .from("radar_items")
      .select("id, title, url, summary, why_it_matters, takeaway, recommended_service, tags")
      .is("why_it_matters", null)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No radar items to enrich",
        enriched: 0,
        used_ai: false
      });
    }

    const used_ai = Boolean(process.env.OPENAI_API_KEY);

    let enrichedCount = 0;
    const errors: any[] = [];

    // 2) Enrich items one by one (safe + controlled)
    for (const item of items) {
      try {
        const title = item.title || "";
        const summary = item.summary || "";

        if (!title) continue;

        // Attempt AI enrichment first (if available)
        let enrichment = null;

        if (used_ai) {
          enrichment = await aiEnrichRadarItem({
            title,
            summary,
            url: item.url
          });
        }

        // Fallback non-AI if AI failed or not enabled
        if (!enrichment) {
          enrichment = fallbackEnrichRadarItem(title, summary);
        }

        const { error: updateError } = await supabase
          .from("radar_items")
          .update({
            tags: enrichment.tags,
            why_it_matters: enrichment.why_it_matters,
            takeaway: enrichment.takeaway,
            recommended_service: enrichment.recommended_service
          })
          .eq("id", item.id);

        if (updateError) {
          errors.push({
            id: item.id,
            stage: "update",
            error: updateError.message
          });
        } else {
          enrichedCount++;
        }
      } catch (err: any) {
        errors.push({
          id: item.id,
          stage: "enrich",
          error: err?.message || String(err)
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Radar enrichment completed",
      fetched: items.length,
      enriched: enrichedCount,
      used_ai,
      errors_count: errors.length,
      errors: errors.slice(0, 20)
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
```

---

# 4) Update vercel.json Cron Schedule

Tambahkan cron kedua:

```json
{
  "crons": [
    {
      "path": "/api/cron/radar?token=your-secret-token",
      "schedule": "0 */4 * * *"
    },
    {
      "path": "/api/cron/radar-enrich?token=your-secret-token",
      "schedule": "30 */4 * * *"
    }
  ]
}
```

> Ini berarti enrich berjalan 30 menit setelah ingest.

**Catatan penting:** Vercel cron mendukung query param di `path`. Ini cara paling praktis.

---

# 5) HARDENING RECOMMENDATION (ANTI-SPAM / QUALITY)

Aku rekomendasikan juga filter sebelum enrich:

* skip jika summary terlalu pendek (< 60 chars)
* skip jika title terlalu generic

Tambahkan di loop:

```ts
if ((summary || "").length < 60) continue;
```

---

# 6) OPTIONAL: FEATURED ITEMS SELECTION

Agar Radar punya “Top Highlights”, kamu bisa otomatis feature 1–2 item per run:

Rule:

* jika tags include SEO/AI
* source priority tinggi
* published within last 24h

Add:

```ts
is_featured: enrichment.tags.includes("SEO") || enrichment.tags.includes("AI")
```

Tapi hati-hati: jangan feature semuanya.

---

# 7) OUTPUT FIELD USAGE DI FRONTEND (Radar UI)

Gunakan field ini di UI:

* Title
* Summary
* Tags chips
* “Why it matters”
* “Takeaway”
* CTA kecil: “Request strategy for this trend” → inquiry wizard prefilled segment marketing

Ini yang membuat Radar jadi growth engine.

---

# 8) GEMINI & GROQ INTEGRATION 

Kalau mau Gemini, buat file `lib/radar/gemini.ts`, atau groq juga sebagai saling backup.

---

Below is a **Radar Page UI Blueprint** that is production-grade for Next.js 14 App Router and aligns with your goals: **filters by tags, featured section, subscribe widget, and conversion CTA into services/inquiry**.

This is not just UI—this is a **growth engine layout**.

---

# RADAR PAGE UI BLUEPRINT (`/radar`)

## 1) Page Objective (Product Definition)

### Primary Goal

Turn passive readers into:

* newsletter subscribers
* inquiry leads (marketing mode mostly)
* affiliate/tool clicks (optional)

### Secondary Goal

Build topical authority + internal linking for SEO.

---

# 2) Radar Page Layout Structure (High Conversion)

## Above the Fold (Hero + Controls)

### A) Page Header

**H1:** Industry Radar
**Subtext:** “Curated SEO, AI, Growth, and Engineering signals—translated into actionable takeaways.”

### B) Trust Micro-Proof

A small row of chips under header:

* “Updated every 4 hours”
* “AI-enriched insights”
* “Actionable takeaways”
* “No noise. Only signals.”

### C) Primary CTA in Hero

Right side (desktop) / below (mobile):

* Button 1 (Primary): **Subscribe Weekly Digest**
* Button 2 (Secondary): **Request Strategy Session**

> This ensures radar is not just content—it's funnel.

---

# 3) Featured Section (Top Highlights)

## Featured Block Layout

Immediately after hero controls.

### UI Components

* **Featured grid**: 1 large + 2 small cards (bento style)
* Each card shows:

  * Title
  * Source
  * Tags
  * “Why it matters” (1 line)
  * CTA: “Use this trend → Request Plan”

### Featured CTA Behavior

Clicking CTA should:

* open inquiry wizard modal OR redirect to `/lp/marketing?mode=marketing`
* auto-fill form with:

  * goal = “Leverage trend: {title}”
  * challenge = “Need strategy based on radar insight”
  * segment = marketing

---

# 4) Filter + Search System (Tags + Sources + Time)

## Filter Bar (Sticky)

Sticky at top after user scrolls 150px.

### Components

* **Tag Filter Chips** (multi-select):

  * SEO
  * AI
  * Marketing
  * Engineering
  * Infrastructure
  * Security
  * Startup
  * Product
  * Tech

* **Time Filter Dropdown**

  * Last 24 hours
  * Last 7 days
  * Last 30 days
  * All time

* **Source Filter Dropdown**

  * All sources
  * Google Search Central
  * Ahrefs
  * SEJ
  * etc.

* **Sort Dropdown**

  * Latest (default)
  * Featured first
  * Most relevant (future: scoring)

* **Search Input**

  * Placeholder: “Search radar signals…”

### UX Rule

Filtering should feel instant:

* client-side state updates
* data is server-fetched + paginated

---

# 5) Main Radar Feed (Insight Cards)

## Card Format (Highly Skimmable)

Each item is a card with:

### Card Header

* Title (clickable external link)
* Source + Published date

### Card Body

* Summary (2–3 lines max)
* Why it matters (highlighted box)
* Takeaway (action bullet)

### Card Footer

* Tags chips
* CTA button:

  * “Apply this to my business”
  * “Request SEO Plan”
  * “Request Funnel Audit”

CTA text is dynamic based on tag:

* SEO tag → “Request SEO Strategy”
* Marketing tag → “Request Campaign Architecture”
* AI tag → “Request Automation Blueprint”

---

# 6) Subscribe Widget (Conversion Engine)

## Placement Strategy

### Widget A: Sidebar (Desktop)

Sticky sidebar component:

* Newsletter subscribe form
* “What you get” bullet list:

  * Weekly digest
  * Trend analysis
  * Actionable checklists
  * No spam

CTA: **Subscribe**

### Widget B: Inline (Feed)

Every 6–8 posts, inject a subscribe card.

This increases conversion without hurting UX.

---

# 7) CTA to Services (Service Funnel Bridge)

## Two Service Bridges

### A) “Need help implementing this?”

A mid-page block:

* Headline: “Want these signals turned into execution?”
* Buttons:

  * “Marketing Systems”
  * “SEO Authority Build”
  * “Executive Dashboard”

Routes:

* `/lp/marketing`
* `/services#digital-marketing`
* `/lp/business`

### B) Bottom Funnel Block

At end of page:

* Headline: “Request Your Personalized Strategy Output”
* embed `<InquiryWizard mode="marketing" />`

This is the final capture point.

---

# 8) Page Information Architecture (Sections)

## Final Order

1. Header + proof chips + CTA buttons
2. Featured Highlights grid
3. Filter Bar (sticky)
4. Radar Feed + inline subscribe injections
5. Service Bridge CTA block
6. Newsletter CTA block
7. Inquiry wizard embed (final conversion)
8. Footer

---

# 9) Data Fetching Blueprint (Supabase Query Plan)

## Tables used

* `radar_items`
* `radar_sources` (optional if you want source list)

## Fetch logic

### Featured Query

```sql
select *
from radar_items
where is_featured = true
order by published_at desc
limit 3;
```

### Feed Query (with filters)

Filters:

* tags array contains
* published_at >= cutoff
* source_name filter
* text search title/summary

Example Supabase:

* `.contains("tags", ["SEO"])`
* `.gte("published_at", cutoffDateISO)`
* `.ilike("title", `%query%`)`

Pagination:

* `.range(offset, offset+pageSize-1)`

---

# 10) UI Components Breakdown (Implementation Ready)

### `/components/radar/RadarPage.tsx`

Or build directly in `app/radar/page.tsx` with server + client split.

## Components required

* `<RadarHero />`
* `<RadarFeaturedGrid />`
* `<RadarFilterBar />` (client)
* `<RadarFeed />` (server fetch + pagination)
* `<RadarItemCard />`
* `<RadarSubscribeWidget />`
* `<RadarServiceBridge />`
* `<InquiryWizard />`

---

# 11) Interaction Rules (CRO + UX)

## A) External Links

All external links must be:

```html
rel="nofollow noopener noreferrer"
target="_blank"
```

## B) Scroll Behavior

When filter changes:

* scroll to top of feed
* keep filter bar sticky

## C) CTA Modal

Optional but high conversion:

* Clicking CTA opens inquiry wizard in modal overlay
* prefilled with radar item context

---

# 12) SEO Rules (Radar Safety)

Radar is partially aggregator, so avoid thin content penalties.

## Indexing Policy

* `/radar` indexable
* do NOT generate `/radar/[slug]` for every item unless enriched heavily

## Canonical

`<link rel="canonical" href="https://domain.com/radar" />`

## Structured Data

You can use `ItemList` schema for featured items (optional).

---

# 13) UI COPY TEMPLATE (READY TO USE)

### Hero copy

**Title:** Industry Radar
**Subtitle:**
“Signals from SEO, AI, and engineering ecosystems—translated into execution-ready takeaways.”

### Subscribe box copy

**Weekly Digest**
“Get the top 10 signals + strategic takeaways every week.”

Button: **Subscribe Digest**

---

# 14) “MODE” INTEGRATION (MULTI PERSONA CONTROL)

Radar should default to:

* mode = marketing

But allow switching:

* ModeSwitcher visible

If user switches mode:

* recommended_service CTA changes
* inquiry wizard segment changes

---

# 15) Minimal Next.js Implementation Plan (Code Skeleton)

## `app/radar/page.tsx` (Server)

* fetch featured
* fetch initial feed
* render page layout
* pass initial data to client feed component

## `RadarFilterBar.tsx` (Client)

* manages state: selectedTags, query, source, time
* triggers fetch `/api/radar` or uses server action

## `RadarFeed.tsx`

* supports “Load more” button
* infinite scroll optional (but Load more is better for CWV)

---

# 16) Conversion Optimized UI Design Notes

## Card design

* keep it compact
* show takeaway in a highlighted style (subtle background)
* keep CTA always visible

## Featured design

* 1 big story (dominant)
* 2 smaller stories

This forces attention.

---

# 17) Optional Advanced Feature (High Growth)

## “Radar → Insight Generator”

Button on each card:

* “Turn into action plan”
  This opens modal that shows:
* recommended service
* checklist
* CTA submit inquiry

This creates micro-conversion loops.

---

# FINAL OUTPUT REQUIREMENT (FOR AI CODER)

Build `/radar` page with:

* featured items query (`is_featured=true`)
* filter bar with tags/time/source/search
* feed list with pagination
* subscribe widget (sidebar + inline injection)
* CTA bridge to `/lp/marketing` and `<InquiryWizard>`
* track events:

  * filter_used
  * subscribe_clicked
  * radar_item_clicked
  * apply_this_clicked

---