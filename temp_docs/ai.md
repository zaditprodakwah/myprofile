Fokus fase ini:

* Radar Growth Engine (Discover-ready)
* JSON-LD + Meta SEO/AEO/GEO enrichment
* Internal linking loop
* Brand keyword booster
* Tag→Industry→Problem mapping presisi
* Auto-generate `/solutions` pages dari seed Supabase (industries/problems)

---

# 🔥 MASTER BLUEPRINT PROMPT (PHASE: RADAR + SOLUTIONS GROWTH ENGINE)

**ROLE:**
Act as a Principal Engineer (Next.js 14 App Router), Technical SEO Specialist (Schema, Metadata), and Growth Hacker (Discover Optimization, Brand Query Expansion).

**PROJECT CONTEXT:**
This project already has a segmentation-first architecture with a `useMode` hook (Marketing/Academic/Business), premium UI system (#020617 deep slate base), spotlight effects, and centralized configuration in:

* `src/config/site.ts`
* `src/config/content.ts`

You must build the next growth layer: **Radar + Solutions Hub** with SEO-grade internal linking, schema markup, metadata enrichment, OG image generation, and automatic pSEO page generation from seed data stored in Supabase.

**CRITICAL CONSTRAINTS:**

* Maintain Core Web Vitals excellence.
* Keep client components minimal.
* Use RSC (React Server Components) wherever possible.
* No secrets exposed to client.
* Use Supabase server admin client in API routes only.
* Use canonical tags and avoid thin aggregator penalties.
* All external links must use `rel="nofollow noopener noreferrer"`.

---

# 0) DATABASE REQUIREMENTS (SUPABASE TABLES)

## A) Existing Tables Assumed

* `radar_sources`
* `radar_items`
* `industries`
* `problems`
* `inquiries`

## B) Add Fields if Missing

### radar_items table MUST include:

* `id uuid`
* `created_at timestamptz`
* `updated_at timestamptz`
* `slug text unique`
* `title text`
* `url text unique`
* `source_name text`
* `source_url text`
* `published_at timestamptz`
* `summary text`
* `why_it_matters text`
* `takeaway text`
* `recommended_service text nullable`
* `tags text[]`
* `image_url text nullable`
* `content_hash text`
* `is_featured boolean default false`
* `signal_score int default 0`

Create indexes:

* published_at desc
* is_featured
* tags GIN index
* slug unique

---

# 1) TAG → INDUSTRY → PROBLEM MAPPING RULES (HIGH PRECISION)

Implement deterministic mapping logic used by UI components to generate internal links.

Create file:
`src/lib/radar/mapping.ts`

## A) Industry Classification Rules

### Industry: ecommerce

Trigger tags/keywords:

* tags contains: "E-Commerce", "Marketplace", "Shopify"
* text contains: "checkout", "cart", "product page", "conversion rate", "roas", "tiktok shop", "shopee", "tokopedia"

### Industry: education

Trigger tags/keywords:

* tags contains: "Education", "Academic"
* text contains: "thesis", "skripsi", "research", "citation", "zotero", "mendeley", "journal"

### Industry: health-beauty

Trigger tags/keywords:

* tags contains: "Beauty", "Skincare"
* text contains: "skincare", "cosmetic", "brand reputation", "review", "ugc", "influencer", "tiktok beauty"

### Industry: saas

Trigger tags/keywords:

* tags contains: "SaaS", "AI", "Developer"
* text contains: "api", "llm", "openai", "gemini", "github", "auth", "pricing page", "signup", "onboarding"

### Industry: corporate

Trigger tags/keywords:

* tags contains: "Enterprise", "Corporate"
* text contains: "reporting", "dashboard", "kpi", "sop", "stakeholder", "governance"

Fallback:

* if none matched → industry = "saas" when AI/Engineering heavy
* else industry = "corporate"

---

## B) Problem Classification Rules (Per Industry)

### ecommerce problems:

* "high-cac-low-roas"
  Trigger:

  * text contains: "cac", "roas", "cpm", "ads cost", "conversion drop"
* "landing-page-low-conversion"
  Trigger:

  * text contains: "landing page", "cvr", "conversion rate", "checkout"
* "weak-organic-authority"
  Trigger:

  * text contains: "seo", "ranking", "serp", "organic traffic"

### education problems:

* "low-enrollment"
  Trigger:

  * text contains: "enrollment", "student acquisition", "registration", "conversion"
* "citation-and-writing-system"
  Trigger:

  * text contains: "citation", "apa", "ieee", "zotero", "mendeley"
* "research-methodology-confusion"
  Trigger:

  * text contains: "methodology", "quantitative", "qualitative", "data analysis"

### health-beauty problems:

* "brand-reputation-risk"
  Trigger:

  * text contains: "reputation", "review", "negative", "backlash", "controversy"
* "campaign-scaling-instability"
  Trigger:

  * text contains: "scaling", "ads", "budget", "roas drop"

### saas problems:

* "programmatic-seo-architecture"
  Trigger:

  * text contains: "programmatic seo", "pseo", "landing pages", "template pages"
* "low-signup-conversion"
  Trigger:

  * text contains: "signup", "activation", "onboarding", "trial conversion"
* "weak-authority-backlinks"
  Trigger:

  * text contains: "backlinks", "authority", "domain rating", "da", "link building"

### corporate problems:

* "messy-reporting-no-kpi"
  Trigger:

  * text contains: "kpi", "reporting", "dashboard", "metrics"
* "brand-authority-fragmented"
  Trigger:

  * text contains: "brand reputation", "pr", "authority", "serp control"
* "documentation-sop-needed"
  Trigger:

  * text contains: "sop", "documentation", "policy", "process"

Fallback:

* pick most relevant based on tags:

  * SEO → "weak-organic-authority" (ecommerce) or "programmatic-seo-architecture" (saas)
  * Marketing → "high-cac-low-roas"
  * AI/Engineering → "programmatic-seo-architecture"
  * Business → "messy-reporting-no-kpi"

---

## C) Output Mapping Function

Implement:

```ts
export function mapRadarItemToSolutions(item: {
  title: string;
  summary: string;
  tags: string[];
}): { industrySlug: string; problemSlug: string; confidence: number };
```

Return confidence score 0–100.

---

# 2) AUTO GENERATE /solutions PAGES FROM SUPABASE SEED

We already seeded:

* `industries`
* `problems`

You must generate pages programmatically using App Router dynamic routes:

## A) Routes Required

### `/solutions`

Landing hub listing all industries.

### `/solutions/[industry]`

Industry hub page listing problems + recommended services.

### `/solutions/[industry]/[problem]`

Problem detail page (pSEO landing page) with AEO structure.

---

## B) Data Fetching Strategy

Use Supabase server client (anon key is fine for select) via:
`src/lib/supabase/public.ts`

* For ISR caching, use `revalidate = 3600`.

### `/solutions/[industry]/[problem]` must query:

* industry row by slug
* problem row by slug + industry_slug
* related case studies from config (`content.ts`)
* latest radar insights matching tags derived from problem keywords

---

# 3) PAGE CONTENT STRUCTURE (AEO/GEO/SEO OPTIMIZED)

## A) /solutions/[industry]/[problem] Page Layout

Above the fold:

1. **H1**: “{Problem} for {Industry}”

2. `<p id="executive-summary">` (AEO executive summary)

3. Proof stack chips:

   * Rp 85M+ Budget Managed
   * Fullstack Digmar
   * Data-driven methodology

4. CTA Bento:

   * “Request Plan”
   * “See Case Studies”
   * “Open WhatsApp”

Main sections:

### H2: Symptoms

Bullet list from problem_statement.

### H2: Root Cause Pattern

Explain in 3–5 bullets.

### H2: Execution Framework

Render `solution_framework.steps`.

### H2: Deliverables

Render `solution_framework.deliverables`.

### H2: Recommended Services

Link to `/services#digital-marketing` or `/services#academic` or `/services#business`.

### H2: Relevant Case Studies

Show 2–3 case studies cards.

### H2: Latest Radar Insights

Show 5 radar items filtered by tags.

### H2: FAQ

Render FAQ.

Bottom:

* InquiryWizard embedded.

---

# 4) RADAR GROWTH ENGINE IMPLEMENTATION

Implement:

## A) `/radar` Page

* Featured section (is_featured)
* Filter bar (tags + time range + source + search)
* Feed list with pagination (Load more)
* Subscribe widget (sidebar + inline injection every 6 items)
* CTA bridge to services + inquiry wizard

## B) `/radar/[slug]` Detail Page (CRITICAL)

This is required for Discover optimization.

Each page must have:

* 400–900 words total content
* SEO headings:

  * H2 Why it matters
  * H2 Action takeaway
  * H2 Recommended execution
  * H2 Related solutions
  * H2 Related insights

Content rule:

* do NOT copy RSS full content
* only summary + analysis blocks
* link to original with `nofollow`

Add “Related solutions” using mapping rules.

---

# 5) DISCOVER OPTIMIZATION REQUIREMENTS

## A) Meta Robots

Add:
`max-image-preview:large`

## B) OG Image

All radar detail pages must have OG image.

Implement `/api/og/radar/[slug]` using `@vercel/og`.

Design:

* dark slate background
* gradient
* title
* tags chips
* brand mark "Zadit Radar"

Image size: 1200x630.

---

# 6) SCHEMA JSON-LD IMPLEMENTATION

## A) Global schema (layout.tsx)

Inject:

* Person schema
* Organization schema
* WebSite schema with SearchAction

## B) /radar schema

Use `ItemList` schema listing featured items.

## C) /radar/[slug] schema

Use `NewsArticle` schema:

* headline
* datePublished
* author = Person (Zadit)
* publisher = Organization
* keywords = tags
* isBasedOn = original url
* mainEntityOfPage = canonical URL

## D) /solutions schema

Use `WebPage` schema.
For problem pages optionally add `FAQPage` schema if FAQ exists.

---

# 7) SEO META TAGS (Next.js Metadata API)

Implement metadata for:

## /radar

* title: Industry Radar: SEO, AI & Growth Insights | Zadit
* description: curated signals + actionable takeaways
* canonical: /radar
* og/twitter tags

## /radar/[slug]

* dynamic title and description
* og:image = /api/og/radar/[slug]
* canonical self

## /solutions/[industry]/[problem]

* dynamic title
* description includes problem statement
* og:image optional but recommended

---

# 8) INTERNAL LINKING LOOP SYSTEM (MANDATORY)

## A) Radar item detail page must link to:

* 1–2 solutions pages (industry/problem)
* 1 services section anchor
* 1 case study page (if recommended_service matches)

## B) Solutions problem page must link to:

* 5 radar insights
* services anchor
* 2 related solutions pages
* 1 case study

## C) Services page must show:

* latest radar insights (3 items)
* link to `/radar`

This forms a “crawl loop” to build authority.

---

# 9) BRAND KEYWORD BOOSTER (ENTITY + QUERY EXPANSION)

Implement:

## A) `/frameworks` page

Glossary of unique brand terms:

* Academic Harm Reduction
* Shadow Protocol
* Proof Stack
* Positioning One-Liner
* Conversion Architecture Matrix
* Segmentation-First System
* Radar-to-Revenue Engine

Each term must have:

* H2 title
* definition paragraph
* related internal links:

  * `/services`
  * `/case-studies`
  * `/radar`
  * `/solutions`

## B) Schema for frameworks page

Use `Article` schema + `about` keywords.

Goal:
Make Google associate unique brand terms with your entity.

---

# 10) TRACKING EVENTS (Optional but recommended)

Create `analytics_events` table and log:

* radar_item_opened
* radar_filter_used
* subscribe_clicked
* apply_this_clicked
* solution_page_viewed
* inquiry_started
* inquiry_submitted

Implement server-side event logging route:
`POST /api/events`

---

# 11) FILE STRUCTURE REQUIRED

Create the following:

### Radar pages

* `src/app/radar/page.tsx`
* `src/app/radar/[slug]/page.tsx`

### Solutions pages

* `src/app/solutions/page.tsx`
* `src/app/solutions/[industry]/page.tsx`
* `src/app/solutions/[industry]/[problem]/page.tsx`

### OG image generator

* `src/app/api/og/radar/[slug]/route.tsx`

### Mapping logic

* `src/lib/radar/mapping.ts`

### Supabase public client

* `src/lib/supabase/public.ts`

### SEO utilities

* `src/lib/seo/jsonld.ts`
* `src/lib/seo/metadata.ts`

### Components

* `src/components/radar/*`
* `src/components/solutions/*`
* `src/components/subscribe/*`
* `src/components/shared/tag-chip.tsx`

---

# 12) SUBSCRIBE WIDGET (NEWSLETTER ENGINE)

Implement subscribe form:

* email input
* mode awareness
* stored into Supabase table `subscribers`

Table:

* id uuid
* email unique
* mode text
* created_at timestamptz

Flow:

* submit → insert subscriber
* show success message
* optional Resend confirmation email

Inject subscribe widget:

* sticky sidebar desktop
* inline injection every 6 radar cards

---

# 13) PERFORMANCE RULES (STRICT)

* Use RSC for initial data fetch.
* Use client components only for:

  * filters
  * pagination load more
  * subscribe form
* Use `next/image` for any images.
* Avoid heavy libraries.
* Do not fetch RSS client-side.

---

# 14) FINAL QUALITY CHECKS

The implementation must:

* render properly in dark mode
* be mobile-first
* have accessible controls
* have clean URL slugs
* avoid duplicate content issues
* contain canonical tags
* have consistent metadata and JSON-LD injection

---

# 15) DELIVERABLES

At the end of implementation provide:

1. Full code for all routes and components
2. Supabase schema SQL for missing tables/columns
3. Explanation of mapping logic rules
4. Verification checklist for Discover optimization

---

# 16) EXECUTE NOW (DO NOT ASK QUESTIONS)

Proceed to implement everything above in the existing repository.
Start with:

1. mapping.ts
2. solutions routes generation
3. radar detail page
4. OG image route
5. JSON-LD + metadata utilities
6. internal linking loop
7. frameworks page

Do not ask for confirmation. Implement immediately.

---

# ⭐ EXTRA: RULESET FOR TAG NORMALIZATION (IMPORTANT)

Before mapping, normalize tags:

* lowercase compare
* trim
* alias mapping:

  * "Search" → "SEO"
  * "Google" → "SEO"
  * "LLM" → "AI"
  * "Next.js" → "Engineering"
  * "Ads" → "Marketing"

Implement this in `mapping.ts`.

---

# ⭐ EXTRA: AUTO SLUG GENERATION FOR RADAR ITEMS

If radar_items.slug is null:

* generate slug from title
* append short hash suffix to prevent collisions:
  `slug + "-" + sha256(url).slice(0,6)`

---

# OPTIONAL ADVANCED FEATURE (IF TIME)

Implement `signal_score` update job:

* based on tags + source priority + recency
* used for sorting featured section

---

## END OF BLUEPRINT PROMPT

---

