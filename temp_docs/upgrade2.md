**Directory Listing + Tools Hub + Affiliate Tracking + Paid Featured Placement** (CRO + EEAT + scalable).

---

# 🔥 MASTER BLUEPRINT PROMPT (PHASE: DIRECTORY + TOOLS HUB + AFFILIATE + PAID PLACEMENT)

**ROLE:**
Act as a Principal Engineer + Technical SEO Expert + Monetization Architect.

You must build a premium “Tools & Directory Hub” system that generates multi-revenue streams:

1. Affiliate clicks + tracking
2. Sponsored listing (paid placement)
3. Lead capture funnel integration
4. Programmatic SEO directory pages
5. Optional: premium placement packages

**Constraints:**

* Must not degrade SEO (avoid spammy pages).
* Must keep UI premium.
* Must implement internal linking loop with Radar + Solutions + Services.
* Must be scalable and data-driven (Supabase).
* Must support analytics + click attribution.

---

# 0) BUSINESS MODEL (REALISTIC MONETIZATION LAYERS)

## Revenue Layer A: Affiliate Click Revenue

* Tools directory pages link out with affiliate params.
* Track clicks per tool + per page.

## Revenue Layer B: Sponsored Listings (Paid Placement)

* Sponsored tools appear at top.
* Sponsorship has expiry date.
* Pricing tiers: Basic / Featured / Category Leader.

## Revenue Layer C: Lead Capture Upsell

* Tools page includes CTA:
  “Need implementation help? Request Setup”
* This converts directory traffic into service leads.

## Revenue Layer D: Newsletter Sponsorship

* Radar weekly digest includes sponsor slots.
* Sponsors stored in DB.

---

# 1) DATABASE SCHEMA (SUPABASE)

Create the following tables.

---

## A) `tools`

Stores all tools directory items.

Fields:

* `id uuid primary key default gen_random_uuid()`
* `created_at timestamptz default now()`
* `updated_at timestamptz default now()`
* `slug text unique not null`
* `name text not null`
* `tagline text not null`
* `description text not null`
* `category text not null` (seo, marketing, ai, engineering, analytics, productivity)
* `sub_category text nullable`
* `pricing_model text` (free, freemium, paid, trial)
* `website_url text not null`
* `affiliate_url text nullable`
* `logo_url text nullable`
* `og_image_url text nullable`
* `features text[] default '{}'`
* `use_cases text[] default '{}'`
* `pros text[] default '{}'`
* `cons text[] default '{}'`
* `rating numeric default 0`
* `is_featured boolean default false`
* `is_sponsored boolean default false`
* `sponsored_until timestamptz nullable`
* `priority int default 0`
* `status text default 'active'`
* `seo_title text nullable`
* `seo_description text nullable`
* `keywords text[] default '{}'`
* `schema_type text default 'SoftwareApplication'`

Indexes:

* category index
* slug unique
* is_featured
* is_sponsored
* sponsored_until

---

## B) `tool_categories`

Fields:

* `id uuid`
* `slug text unique`
* `name text`
* `description text`
* `icon text nullable`
* `priority int default 0`

---

## C) `affiliate_clicks`

Tracks outbound clicks.

Fields:

* `id uuid primary key`
* `created_at timestamptz default now()`
* `tool_id uuid references tools(id)`
* `tool_slug text`
* `page_path text`
* `mode text nullable`
* `referrer text nullable`
* `utm_source text nullable`
* `utm_medium text nullable`
* `utm_campaign text nullable`
* `ip_hash text nullable`
* `user_agent text nullable`

Indexes:

* tool_id
* created_at desc

---

## D) `sponsorship_packages`

Fields:

* `id uuid`
* `name text` (basic, featured, category_leader)
* `price_idr int`
* `duration_days int`
* `benefits text[]`

---

## E) `sponsorship_orders`

Fields:

* `id uuid`
* `created_at timestamptz`
* `tool_id uuid`
* `company_name text`
* `email text`
* `whatsapp text`
* `package_id uuid`
* `status text` (pending, paid, active, expired)
* `starts_at timestamptz nullable`
* `ends_at timestamptz nullable`
* `notes text nullable`

---

## F) `newsletter_sponsors`

Fields:

* `id uuid`
* `name text`
* `website_url text`
* `logo_url text`
* `cta_text text`
* `active boolean default false`
* `priority int default 0`
* `ends_at timestamptz nullable`

---

# 2) ROUTES & INFORMATION ARCHITECTURE

## A) Main Directory Hub

### `/tools`

Tools Hub landing page.

Contains:

* featured tools section
* sponsored section
* category grid
* search + filters

---

## B) Category Directory

### `/tools/[category]`

Programmatic SEO category page.

Example:

* `/tools/seo`
* `/tools/ai`
* `/tools/marketing`
* `/tools/engineering`

---

## C) Tool Detail Page

### `/tools/[category]/[slug]`

This is critical: each tool gets an editorial page.

Must include:

* what it is
* best use cases
* pricing model
* pros/cons
* alternatives (internal links)
* recommended solutions (internal linking)
* CTA outbound affiliate click tracking

---

## D) Sponsored Listing Landing Page

### `/sponsor`

Pricing + packages + inquiry form.

---

# 3) UI/UX REQUIREMENTS (PREMIUM DIRECTORY STYLE)

## A) Tools Hub Layout

* Hero with search bar
* Filter row (pricing model, category, sort)
* Featured tools carousel (bento style)
* Sponsored block clearly labeled “Sponsored”
* Tools grid (cards)

Each card includes:

* logo
* tool name
* tagline
* pricing chip
* category chip
* CTA button: “Visit Tool”

---

## B) Filter System (Client)

Filters:

* search query (fuzzy match)
* category
* pricing model
* sort by:

  * trending
  * featured
  * newest
  * highest rated

Pagination:

* Load more button (avoid infinite scroll)

---

## C) Conversion Widgets (Critical)

Each page must include:

### Widget 1: “Need setup help?”

CTA box:

* “Request implementation blueprint”
* opens InquiryWizard prefilled with tool context

### Widget 2: Subscribe digest

Newsletter widget reused from radar.

---

# 4) AFFILIATE CLICK TRACKING SYSTEM

## A) Outbound Click Route

Create route:

### `/api/out/tool/[slug]`

Behavior:

1. Fetch tool from Supabase by slug.
2. Decide redirect URL:

   * if affiliate_url exists use it
   * else website_url
3. Insert record into `affiliate_clicks` table with:

   * tool_id
   * tool_slug
   * page_path from query
   * mode from query
   * utm params
   * hashed IP
4. Redirect 302 to external tool url.

---

## B) Link Usage in UI

Never link directly to affiliate URL.

Instead link to:
`/api/out/tool/{slug}?from=/tools/seo&mode=marketing`

This ensures tracking always happens.

---

# 5) SPONSORED LISTING SYSTEM (PAID PLACEMENT)

## A) Sponsored Visibility Rules

A tool is sponsored if:

* is_sponsored = true
* sponsored_until > now()

Sponsored tools appear:

* top of category page
* top of tools hub
* “Sponsored” badge

---

## B) Auto-expiry Cron

Create cron endpoint:

### `/api/cron/sponsor-expiry`

Runs daily:

* set is_sponsored=false when sponsored_until < now()

---

## C) Sponsorship Order Form

On `/sponsor` page:

* choose package
* enter company name, email, whatsapp
* choose tool (existing tool or new tool submission)

Submit stores into `sponsorship_orders`.

Then:

* admin manually confirms payment
* or integrate payment later

---

# 6) SEO & SCHEMA JSON-LD FOR DIRECTORY PAGES

## A) /tools (Hub)

Schema:

* `CollectionPage`
* ItemList for featured tools

## B) /tools/[category]

Schema:

* `CollectionPage`
* ItemList listing tools

## C) /tools/[category]/[slug]

Schema:
Use `SoftwareApplication` schema.

Example JSON-LD fields:

* name
* applicationCategory
* offers (pricing)
* operatingSystem (Web)
* url
* aggregateRating (optional)
* author = Person (Zadit)
* publisher = Organization

Also include FAQ schema if FAQ exists.

---

# 7) SEO CONTENT RULES (ANTI-THIN-CONTENT)

Tool detail page must contain:

* at least 400–800 words of unique editorial content
* structured headings
* comparisons/alternatives
* why it matters section
* recommended solution internal links

Avoid being a pure directory listing.

---

# 8) INTERNAL LINKING LOOP (TOOLS ↔ RADAR ↔ SOLUTIONS ↔ SERVICES)

## Tool detail page must include:

* “Latest radar insights related to this tool category”
* “Recommended solution pages”
* “Request setup blueprint” CTA

## Radar pages must include:

* “Suggested tools for this trend”
  Example:
  SEO trend → show SEO tools list.

## Solutions pages must include:

* “Recommended tools stack”
  Example:
  programmatic seo architecture → show sitemap generator, CMS, scraping tools.

This builds a dense topical graph.

---

# 9) PROGRAMMATIC SEO GENERATION (TOOLS PSEO)

## A) Seed Tools Data

Use `tools.seed.json` stored in `/data/tools.seed.json`.

Must include:

* slug
* name
* tagline
* category
* pricing_model
* website_url
* affiliate_url (optional)
* features/use_cases arrays

---

## B) Automatic Static Params

Implement `generateStaticParams()` for:

* `/tools/[category]`
* `/tools/[category]/[slug]`

Use Supabase query or local seed fallback.

Revalidate:

* 86400 for tool pages (daily)

---

# 10) META TAGS & OPEN GRAPH (CTR BOOST)

Implement OG image generation for tools pages:

### `/api/og/tools/[slug]`

Use `@vercel/og` similar to radar.

Metadata must include:

* title: `{Tool} Review & Best Use Cases | Zadit Tools`
* description: include category + tagline
* canonical
* twitter card large image

---

# 11) ADVANCED GROWTH HACKS (REALISTIC)

## A) “Alternatives to X” Pages

Auto-generate internal section:

* show 5 tools in same category
* link to them

This is SEO gold.

## B) “Stacks” Pages

Create `/stacks`
Examples:

* “SEO Authority Stack”
* “Programmatic SEO Stack”
* “Conversion Funnel Stack”
* “Academic Writing Stack”

Each stack links to tools + solutions + services.

Schema: `Article`.

## C) “Tool vs Tool” Comparison Pages (Optional)

Route:
`/compare/[toolA]-vs-[toolB]`

But only generate for top 20 tools.

---

# 12) ADMIN / MANAGEMENT (OPTIONAL BUT USEFUL)

Create minimal admin pages under `/admin`:

* list tools
* toggle featured/sponsored
* update sponsored_until
* see click stats

Protect using simple password env or Supabase auth (optional).

---

# 13) REQUIRED FILE STRUCTURE

Create:

### Pages

* `src/app/tools/page.tsx`
* `src/app/tools/[category]/page.tsx`
* `src/app/tools/[category]/[slug]/page.tsx`
* `src/app/sponsor/page.tsx`
* `src/app/stacks/page.tsx`

### API

* `src/app/api/out/tool/[slug]/route.ts`
* `src/app/api/cron/sponsor-expiry/route.ts`

### OG Routes

* `src/app/api/og/tools/[slug]/route.ts`

### Lib

* `src/lib/tools/query.ts`
* `src/lib/tools/schema.ts`
* `src/lib/tools/filters.ts`
* `src/lib/affiliate/track.ts`

### Components

* `src/components/tools/*`
* `src/components/sponsor/*`
* `src/components/stacks/*`

---

# 14) ANALYTICS & METRICS

Track events:

* tool_card_viewed
* tool_outbound_clicked
* sponsor_page_opened
* sponsor_form_submitted
* stack_page_viewed

Store in `analytics_events` table.

---

# 15) UI COPY (HIGH CONVERSION)

## Tools Hub Hero

H1: “Tools That Build Authority & Growth”
Sub: “Curated stack for SEO, AI automation, growth engineering, and execution.”

CTA:

* “Browse SEO Tools”
* “Request Setup Blueprint”

## Sponsored block label

“Sponsored: Verified placement partners”

## Tool detail CTA

Button:

* “Visit Tool”
  Secondary:
* “Request Setup Strategy”

---

# 16) DELIVERABLES

At completion output:

* all routes working
* click tracking works
* tools pages SEO-ready
* schema markup included
* OG image generation works
* sponsor system minimal but functional

---

# 17) EXECUTION ORDER

Implement in order:

1. DB schema + seeds
2. `/api/out/tool/[slug]` tracking redirect
3. `/tools` hub + category pages
4. tool detail pages + schema + metadata
5. sponsor page + packages system
6. stacks page
7. OG images

Do not ask for confirmation. Execute now.

---

# 18) TOOL CATEGORY TAXONOMY (LOCKED)

Use these canonical categories:

* seo
* marketing
* ai
* engineering
* analytics
* productivity
* academic

Pricing model enum:

* free
* freemium
* trial
* paid

---

# 19) AFFILIATE ATTRIBUTION RULES

When redirecting:

* append `utm_source=zadit_hub`
* append `utm_medium=directory`
* append `utm_campaign=tools_{category}`
* preserve existing affiliate query params if present.

---

# END OF BLUEPRINT PROMPT

---

# ⭐ ADD-ON: “Paid Featured Placement” Tier Rules (Realistic & Scalable)

Implement packages in `sponsorship_packages` seed:

### Basic (IDR 750k / 30 days)

* listed in category
* sponsored badge

### Featured (IDR 2.5M / 30 days)

* top of category
* appears in tools hub

### Category Leader (IDR 6M / 30 days)

* pinned top
* appears in radar newsletter slot
* included in 1 stack page

This is realistic pricing for Indonesia market.

---

# ⭐ ADD-ON: SEO Growth Hack (Safe)

Generate content blocks on tool pages:

## “Best for”

* ecommerce
* saas
* agency
* academic

## “Implementation notes”

This is editorial and unique → prevents thin content penalty.

---

1. **`/data/tools.seed.json` super kuat (50 tools)** lengkap kategori, pricing, keywords, use_cases, features, pros/cons, dan placeholder affiliate_url.
2. **RSS sources radar** yang presisi dan realistis untuk growth (SEO, AI, engineering, product, security) dalam format seed JSON untuk Supabase.

> Catatan penting: jangan kebanyakan feed “noise” (Medium random, blog spam). Kita pilih yang authoritative agar Radar kuat untuk EEAT + Discover.

---

# 1) `/data/tools.seed.json` (50 Tools, Premium Seed)

> Simpan sebagai: `data/tools.seed.json`

```json
[
  {
    "slug": "ahrefs",
    "name": "Ahrefs",
    "tagline": "SEO intelligence suite for backlink, keyword, and competitive research.",
    "description": "Ahrefs is a premium SEO platform used for backlink analysis, keyword research, rank tracking, and competitor intelligence. Ideal for authority-building, off-page SEO mapping, and content gap discovery.",
    "category": "seo",
    "sub_category": "seo-suite",
    "pricing_model": "paid",
    "website_url": "https://ahrefs.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Backlink Explorer", "Keyword Explorer", "Content Gap Analysis", "Rank Tracking", "Site Audit"],
    "use_cases": ["SEO audit and strategy", "Backlink prospecting", "Competitor keyword gap", "Authority growth planning"],
    "pros": ["Industry-leading backlink database", "Excellent competitor research", "Fast UI"],
    "cons": ["Expensive for small teams", "Limited free access"],
    "keywords": ["SEO", "Backlink", "Keyword Research", "Off-page SEO", "Competitor Analysis"],
    "schema_type": "SoftwareApplication",
    "priority": 95,
    "is_featured": true
  },
  {
    "slug": "semrush",
    "name": "SEMrush",
    "tagline": "All-in-one SEO + PPC + competitive intelligence toolkit.",
    "description": "SEMrush provides SEO, PPC, competitor research, content marketing tools, and site auditing in one platform. Useful for agencies and marketing teams managing multiple domains.",
    "category": "seo",
    "sub_category": "seo-suite",
    "pricing_model": "paid",
    "website_url": "https://www.semrush.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Domain Overview", "Keyword Magic Tool", "Site Audit", "Position Tracking", "PPC Research"],
    "use_cases": ["SEO growth planning", "Keyword research", "Competitive benchmarking", "Paid ads intelligence"],
    "pros": ["Huge keyword database", "Strong PPC research", "Agency-friendly"],
    "cons": ["Can feel complex", "Pricing grows fast with usage"],
    "keywords": ["SEO", "PPC", "Keyword Research", "Competitor Research"],
    "schema_type": "SoftwareApplication",
    "priority": 92,
    "is_featured": true
  },
  {
    "slug": "google-search-console",
    "name": "Google Search Console",
    "tagline": "Official performance monitoring and indexing insights for Google Search.",
    "description": "Google Search Console is essential for monitoring search performance, indexing issues, Core Web Vitals, and query data directly from Google. Best for technical SEO, troubleshooting, and performance diagnostics.",
    "category": "seo",
    "sub_category": "search-analytics",
    "pricing_model": "free",
    "website_url": "https://search.google.com/search-console",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Performance Report", "Index Coverage", "Sitemaps", "Core Web Vitals", "Manual Actions"],
    "use_cases": ["Indexing fixes", "SEO monitoring", "CWV troubleshooting", "Query discovery"],
    "pros": ["Free and official", "Accurate indexing signals", "Essential SEO tool"],
    "cons": ["Limited competitor data", "UI can be slow sometimes"],
    "keywords": ["Google", "SEO", "Indexing", "Core Web Vitals", "SERP"],
    "schema_type": "SoftwareApplication",
    "priority": 100,
    "is_featured": true
  },
  {
    "slug": "google-analytics-4",
    "name": "Google Analytics 4",
    "tagline": "Event-based analytics for web and app measurement.",
    "description": "GA4 is Google’s analytics platform built around events, cross-device tracking, and user journey analysis. Useful for conversion tracking, funnel optimization, and marketing ROI measurement.",
    "category": "analytics",
    "sub_category": "web-analytics",
    "pricing_model": "freemium",
    "website_url": "https://analytics.google.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Event tracking", "Funnels", "Attribution", "User segmentation", "BigQuery export (paid)"],
    "use_cases": ["Conversion tracking", "Marketing ROI analysis", "User journey optimization"],
    "pros": ["Powerful analytics for free", "Google Ads integration", "Event-based approach"],
    "cons": ["Steep learning curve", "Data sampling in some cases"],
    "keywords": ["Analytics", "GA4", "Conversion Tracking", "Funnels"],
    "schema_type": "SoftwareApplication",
    "priority": 96,
    "is_featured": true
  },
  {
    "slug": "hotjar",
    "name": "Hotjar",
    "tagline": "Heatmaps and session recordings for conversion optimization.",
    "description": "Hotjar helps identify UX friction using heatmaps, recordings, and surveys. Great for landing page optimization and conversion rate improvements.",
    "category": "analytics",
    "sub_category": "cro",
    "pricing_model": "freemium",
    "website_url": "https://www.hotjar.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Heatmaps", "Session recordings", "Feedback widgets", "Surveys"],
    "use_cases": ["CRO audits", "Landing page optimization", "Behavior analysis"],
    "pros": ["Easy to deploy", "Strong CRO insights", "Good UI"],
    "cons": ["Privacy considerations", "Can slow site if misconfigured"],
    "keywords": ["CRO", "Heatmap", "UX Research", "Analytics"],
    "schema_type": "SoftwareApplication",
    "priority": 80,
    "is_featured": false
  },
  {
    "slug": "clarity",
    "name": "Microsoft Clarity",
    "tagline": "Free session recordings and heatmaps for UX analytics.",
    "description": "Microsoft Clarity provides free heatmaps and session recordings. A strong alternative to Hotjar with no major paywalls for core functionality.",
    "category": "analytics",
    "sub_category": "cro",
    "pricing_model": "free",
    "website_url": "https://clarity.microsoft.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Session replay", "Heatmaps", "Rage click detection", "Dead click insights"],
    "use_cases": ["CRO improvements", "UX debugging", "Landing page analysis"],
    "pros": ["Free", "Very useful rage click reports", "Easy setup"],
    "cons": ["UI less polished than Hotjar", "Limited survey features"],
    "keywords": ["Heatmaps", "Session Replay", "UX Analytics", "CRO"],
    "schema_type": "SoftwareApplication",
    "priority": 88,
    "is_featured": true
  },
  {
    "slug": "screaming-frog",
    "name": "Screaming Frog SEO Spider",
    "tagline": "Technical SEO crawler for auditing websites at scale.",
    "description": "Screaming Frog is a desktop crawler for auditing metadata, internal links, broken pages, redirect chains, canonical issues, and SEO architecture problems.",
    "category": "seo",
    "sub_category": "technical-seo",
    "pricing_model": "freemium",
    "website_url": "https://www.screamingfrog.co.uk/seo-spider/",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Site crawling", "Metadata audits", "Broken link detection", "Redirect audits", "XML sitemap generation"],
    "use_cases": ["Technical SEO audits", "Site structure optimization", "Large site crawling"],
    "pros": ["Powerful crawling", "Great for technical SEO", "Affordable paid license"],
    "cons": ["Desktop-based", "Requires SEO knowledge"],
    "keywords": ["SEO Audit", "Crawler", "Technical SEO", "Sitemap"],
    "schema_type": "SoftwareApplication",
    "priority": 90,
    "is_featured": true
  },
  {
    "slug": "sitebulb",
    "name": "Sitebulb",
    "tagline": "Visual technical SEO auditing and crawling platform.",
    "description": "Sitebulb is a technical SEO crawler that emphasizes visual reporting and actionable insights. Great for agencies and consultants who need clean audit reports.",
    "category": "seo",
    "sub_category": "technical-seo",
    "pricing_model": "paid",
    "website_url": "https://sitebulb.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Crawling", "Visual site architecture", "SEO audit hints", "Report export"],
    "use_cases": ["Client SEO audits", "Site architecture mapping", "Internal link improvement"],
    "pros": ["Excellent UI/visualization", "Great reports", "Actionable hints"],
    "cons": ["Paid tool", "Not as widely adopted as Screaming Frog"],
    "keywords": ["Technical SEO", "Site Audit", "Crawl", "Architecture"],
    "schema_type": "SoftwareApplication",
    "priority": 70,
    "is_featured": false
  },
  {
    "slug": "surfer-seo",
    "name": "Surfer SEO",
    "tagline": "Content optimization tool based on SERP correlation analysis.",
    "description": "Surfer SEO helps writers optimize content structure, keyword usage, and headings based on SERP analysis. Useful for on-page SEO scaling.",
    "category": "seo",
    "sub_category": "content-seo",
    "pricing_model": "paid",
    "website_url": "https://surferseo.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Content editor", "SERP analyzer", "Outline builder", "Keyword suggestions"],
    "use_cases": ["On-page SEO optimization", "Content scaling", "SERP-based writing"],
    "pros": ["Easy to use", "Good content scoring", "Strong for scaling"],
    "cons": ["Can lead to over-optimization if abused", "Paid"],
    "keywords": ["On-page SEO", "Content Optimization", "SERP Analysis"],
    "schema_type": "SoftwareApplication",
    "priority": 78,
    "is_featured": false
  },
  {
    "slug": "frase",
    "name": "Frase",
    "tagline": "AI-assisted content briefs and SEO research tool.",
    "description": "Frase helps generate SEO content briefs and analyze competing SERP pages. It accelerates research and content production workflows.",
    "category": "seo",
    "sub_category": "content-seo",
    "pricing_model": "paid",
    "website_url": "https://www.frase.io",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Content briefs", "SERP research", "AI writing support", "Topic clustering"],
    "use_cases": ["SEO writing workflow", "Brief generation", "Content research"],
    "pros": ["Fast research automation", "Good for briefs", "AI helpful"],
    "cons": ["Not a full SEO suite", "Paid plans"],
    "keywords": ["SEO Content", "AI Writing", "Content Brief"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },
  {
    "slug": "yoast-seo",
    "name": "Yoast SEO",
    "tagline": "WordPress SEO plugin for on-page optimization and metadata.",
    "description": "Yoast SEO is a popular WordPress plugin for optimizing titles, meta descriptions, readability, and schema support.",
    "category": "seo",
    "sub_category": "wordpress-seo",
    "pricing_model": "freemium",
    "website_url": "https://yoast.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Meta tags", "XML sitemaps", "Readability analysis", "Schema support"],
    "use_cases": ["WordPress SEO optimization", "Metadata management", "Schema injection"],
    "pros": ["Easy for beginners", "Popular and trusted", "Good defaults"],
    "cons": ["Premium upsells", "Limited for advanced SEO"],
    "keywords": ["WordPress", "SEO Plugin", "Schema"],
    "schema_type": "SoftwareApplication",
    "priority": 60,
    "is_featured": false
  },
  {
    "slug": "rank-math",
    "name": "Rank Math",
    "tagline": "SEO plugin for WordPress with rich schema and automation.",
    "description": "Rank Math provides advanced WordPress SEO features including schema templates, redirection manager, and automation for meta tags.",
    "category": "seo",
    "sub_category": "wordpress-seo",
    "pricing_model": "freemium",
    "website_url": "https://rankmath.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Schema templates", "SEO scoring", "Redirect manager", "Keyword optimization"],
    "use_cases": ["WordPress SEO automation", "Schema deployment", "SEO optimization"],
    "pros": ["Feature-rich", "Good schema support", "Modern UI"],
    "cons": ["Can be overwhelming", "Some features locked"],
    "keywords": ["WordPress SEO", "Schema", "Automation"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },
  {
    "slug": "cloudflare",
    "name": "Cloudflare",
    "tagline": "CDN, security, caching, and performance optimization platform.",
    "description": "Cloudflare improves website speed and security through CDN caching, DDoS protection, DNS management, and edge computing capabilities.",
    "category": "engineering",
    "sub_category": "cdn-security",
    "pricing_model": "freemium",
    "website_url": "https://www.cloudflare.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["CDN caching", "DNS management", "DDoS protection", "WAF", "Edge Workers"],
    "use_cases": ["Performance optimization", "Security hardening", "Global caching"],
    "pros": ["Excellent free tier", "Powerful performance features", "Great security"],
    "cons": ["Complex configuration", "Some features are enterprise-only"],
    "keywords": ["CDN", "Security", "Edge", "WAF", "Performance"],
    "schema_type": "SoftwareApplication",
    "priority": 90,
    "is_featured": true
  },
  {
    "slug": "vercel",
    "name": "Vercel",
    "tagline": "Frontend deployment platform optimized for Next.js and edge computing.",
    "description": "Vercel is the preferred deployment platform for Next.js. It provides fast builds, edge functions, preview deployments, and global CDN delivery.",
    "category": "engineering",
    "sub_category": "deployment",
    "pricing_model": "freemium",
    "website_url": "https://vercel.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Next.js hosting", "Edge functions", "Preview deployments", "Vercel Cron"],
    "use_cases": ["Deploy Next.js apps", "ISR hosting", "Edge caching"],
    "pros": ["Best Next.js experience", "Fast global CDN", "Easy CI/CD"],
    "cons": ["Can get expensive at scale", "Vendor lock-in risk"],
    "keywords": ["Next.js", "Hosting", "Edge", "Deployment", "Cron"],
    "schema_type": "SoftwareApplication",
    "priority": 85,
    "is_featured": true
  },
  {
    "slug": "supabase",
    "name": "Supabase",
    "tagline": "Open source Firebase alternative with Postgres + Auth + Storage.",
    "description": "Supabase provides Postgres database, authentication, storage, edge functions, and realtime capabilities. Great for building SaaS and content systems.",
    "category": "engineering",
    "sub_category": "backend",
    "pricing_model": "freemium",
    "website_url": "https://supabase.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Postgres DB", "Auth", "Storage", "Realtime", "Edge Functions"],
    "use_cases": ["SaaS backend", "Lead capture storage", "RSS aggregator storage"],
    "pros": ["Postgres-native", "Great DX", "Powerful free tier"],
    "cons": ["Some scaling limits", "Auth complexity for enterprise"],
    "keywords": ["Postgres", "Auth", "Database", "Backend", "Realtime"],
    "schema_type": "SoftwareApplication",
    "priority": 90,
    "is_featured": true
  },
  {
    "slug": "resend",
    "name": "Resend",
    "tagline": "Email API for transactional and marketing emails.",
    "description": "Resend is a modern email API provider that makes sending transactional emails simple and developer-friendly. Great for inquiry notifications and newsletter delivery.",
    "category": "marketing",
    "sub_category": "email-marketing",
    "pricing_model": "freemium",
    "website_url": "https://resend.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Email API", "Templates", "Deliverability focus", "Webhook events"],
    "use_cases": ["Inquiry notifications", "Newsletter delivery", "Transactional email"],
    "pros": ["Great developer experience", "Clean dashboard", "Reliable"],
    "cons": ["Not a full CRM", "Scaling cost"],
    "keywords": ["Email API", "Transactional Email", "Marketing Automation"],
    "schema_type": "SoftwareApplication",
    "priority": 75,
    "is_featured": false
  },
  {
    "slug": "zapier",
    "name": "Zapier",
    "tagline": "No-code automation platform connecting thousands of apps.",
    "description": "Zapier enables automation workflows across popular apps. Great for marketing automation, lead routing, and connecting tools without coding.",
    "category": "productivity",
    "sub_category": "automation",
    "pricing_model": "freemium",
    "website_url": "https://zapier.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Automation workflows", "Triggers/actions", "App integrations", "Multi-step zaps"],
    "use_cases": ["Lead automation", "Workflow automation", "Marketing pipelines"],
    "pros": ["Huge integration library", "Easy setup", "Reliable"],
    "cons": ["Expensive at scale", "Limited advanced logic"],
    "keywords": ["Automation", "Workflow", "No-code", "Integrations"],
    "schema_type": "SoftwareApplication",
    "priority": 78,
    "is_featured": false
  },
  {
    "slug": "make",
    "name": "Make (Integromat)",
    "tagline": "Advanced automation platform for complex workflows.",
    "description": "Make is a visual automation tool that supports complex branching workflows. Useful for technical automation and integration-heavy systems.",
    "category": "productivity",
    "sub_category": "automation",
    "pricing_model": "freemium",
    "website_url": "https://www.make.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Scenario builder", "Advanced branching", "Integrations", "Webhooks"],
    "use_cases": ["Complex automation", "Data pipeline automation", "API integration workflows"],
    "pros": ["More flexible than Zapier", "Good visual builder", "Powerful API integration"],
    "cons": ["Learning curve", "Can become complex"],
    "keywords": ["Automation", "Integrations", "Workflow", "No-code"],
    "schema_type": "SoftwareApplication",
    "priority": 70,
    "is_featured": false
  },
  {
    "slug": "notion",
    "name": "Notion",
    "tagline": "All-in-one workspace for docs, databases, and collaboration.",
    "description": "Notion is a productivity tool for managing documentation, wikis, databases, and team knowledge systems.",
    "category": "productivity",
    "sub_category": "workspace",
    "pricing_model": "freemium",
    "website_url": "https://www.notion.so",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Docs", "Databases", "Templates", "Collaboration", "Knowledge base"],
    "use_cases": ["Project documentation", "Knowledge system", "Content planning"],
    "pros": ["Flexible and powerful", "Great templates", "Collaboration-friendly"],
    "cons": ["Can be slow for huge databases", "Offline limitations"],
    "keywords": ["Docs", "Workspace", "Productivity", "Knowledge Base"],
    "schema_type": "SoftwareApplication",
    "priority": 85,
    "is_featured": true
  },
  {
    "slug": "slack",
    "name": "Slack",
    "tagline": "Team communication platform for modern organizations.",
    "description": "Slack is a team communication tool for channels, integrations, and productivity. Often used for engineering and marketing teams.",
    "category": "productivity",
    "sub_category": "communication",
    "pricing_model": "freemium",
    "website_url": "https://slack.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Channels", "Integrations", "Workflow builder", "Huddles"],
    "use_cases": ["Team communication", "Project coordination", "Ops messaging"],
    "pros": ["Strong integrations", "Good UX", "Widely adopted"],
    "cons": ["Cost grows with team size", "Notification overload"],
    "keywords": ["Communication", "Team", "Messaging"],
    "schema_type": "SoftwareApplication",
    "priority": 60,
    "is_featured": false
  },
  {
    "slug": "github",
    "name": "GitHub",
    "tagline": "Version control, CI/CD workflows, and open source collaboration.",
    "description": "GitHub is the leading platform for code hosting, version control, pull requests, and CI/CD workflows with GitHub Actions.",
    "category": "engineering",
    "sub_category": "devops",
    "pricing_model": "freemium",
    "website_url": "https://github.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Repositories", "Pull Requests", "GitHub Actions", "Security scanning"],
    "use_cases": ["Code hosting", "CI/CD automation", "Open source projects"],
    "pros": ["Industry standard", "Strong ecosystem", "Great CI/CD tooling"],
    "cons": ["Some enterprise features paid", "Can be complex for beginners"],
    "keywords": ["Git", "CI/CD", "DevOps", "Version Control"],
    "schema_type": "SoftwareApplication",
    "priority": 90,
    "is_featured": true
  },
  {
    "slug": "postman",
    "name": "Postman",
    "tagline": "API testing, development, and collaboration tool.",
    "description": "Postman is widely used for API testing, documentation, and team collaboration. Essential for backend engineering and API-first products.",
    "category": "engineering",
    "sub_category": "api-tools",
    "pricing_model": "freemium",
    "website_url": "https://www.postman.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["API testing", "Collections", "Mock servers", "Documentation"],
    "use_cases": ["API debugging", "Backend testing", "API documentation"],
    "pros": ["Excellent API tooling", "Collaboration features", "Widely adopted"],
    "cons": ["Can become heavy", "Some features locked behind paid plans"],
    "keywords": ["API", "Testing", "Documentation", "Engineering"],
    "schema_type": "SoftwareApplication",
    "priority": 75,
    "is_featured": false
  },
  {
    "slug": "figma",
    "name": "Figma",
    "tagline": "Collaborative UI/UX design tool for product teams.",
    "description": "Figma enables collaborative UI design, prototyping, and design systems. Useful for product design, landing page design, and branding assets.",
    "category": "marketing",
    "sub_category": "design",
    "pricing_model": "freemium",
    "website_url": "https://www.figma.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["UI design", "Prototyping", "Design systems", "Collaboration"],
    "use_cases": ["Landing page design", "Brand design", "Product prototyping"],
    "pros": ["Best collaborative UI tool", "Fast workflow", "Strong community"],
    "cons": ["Advanced features paid", "Requires design knowledge"],
    "keywords": ["UI Design", "UX", "Prototyping", "Design System"],
    "schema_type": "SoftwareApplication",
    "priority": 85,
    "is_featured": true
  },
  {
    "slug": "canva",
    "name": "Canva",
    "tagline": "Design tool for fast marketing assets and social media creatives.",
    "description": "Canva is a simple design platform for creating social media posts, presentations, and marketing materials quickly.",
    "category": "marketing",
    "sub_category": "design",
    "pricing_model": "freemium",
    "website_url": "https://www.canva.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Templates", "Presentation design", "Social media creatives", "Brand kits"],
    "use_cases": ["Marketing creatives", "Pitch decks", "Social media content"],
    "pros": ["Easy for beginners", "Fast output", "Huge template library"],
    "cons": ["Not a pro design replacement", "Premium assets locked"],
    "keywords": ["Design", "Presentation", "Marketing Assets", "Social Media"],
    "schema_type": "SoftwareApplication",
    "priority": 70,
    "is_featured": false
  },
  {
    "slug": "openai",
    "name": "OpenAI API",
    "tagline": "LLM API for chat, summarization, classification, and automation.",
    "description": "OpenAI API provides powerful language models for building AI assistants, enrichment pipelines, summarization engines, and automation workflows.",
    "category": "ai",
    "sub_category": "llm-api",
    "pricing_model": "paid",
    "website_url": "https://platform.openai.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Chat completion", "Embeddings", "Moderation", "Tool calling"],
    "use_cases": ["Radar enrichment", "Content generation", "Lead scoring automation"],
    "pros": ["Strong model quality", "Good documentation", "Reliable"],
    "cons": ["Paid usage", "Requires prompt discipline"],
    "keywords": ["LLM", "AI API", "ChatGPT", "Automation"],
    "schema_type": "SoftwareApplication",
    "priority": 88,
    "is_featured": true
  },
  {
    "slug": "google-ai-studio",
    "name": "Google AI Studio (Gemini API)",
    "tagline": "Gemini models for free-tier AI prototyping and automation enrichment.",
    "description": "Google AI Studio provides access to Gemini models. Useful for background enrichment tasks like tagging, summarization, and SEO drafting workflows.",
    "category": "ai",
    "sub_category": "llm-api",
    "pricing_model": "freemium",
    "website_url": "https://aistudio.google.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Gemini API", "Prompt playground", "Text generation", "Fast prototyping"],
    "use_cases": ["Radar enrichment", "SEO page drafts", "Topic clustering"],
    "pros": ["Good free tier", "Fast experimentation", "Google ecosystem"],
    "cons": ["Output stability varies", "Rate limits on free tier"],
    "keywords": ["Gemini", "AI", "LLM", "Automation"],
    "schema_type": "SoftwareApplication",
    "priority": 80,
    "is_featured": true
  },
  {
    "slug": "perplexity",
    "name": "Perplexity",
    "tagline": "Answer engine with citations for fast research workflows.",
    "description": "Perplexity provides research assistance with citations and sources. Useful for competitive analysis, SEO research, and academic exploration.",
    "category": "ai",
    "sub_category": "research",
    "pricing_model": "freemium",
    "website_url": "https://www.perplexity.ai",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Citation-based answers", "Web research", "Follow-up queries"],
    "use_cases": ["Market research", "SEO research", "Academic research assistance"],
    "pros": ["Fast research", "Citations included", "Clean UI"],
    "cons": ["Not always fully accurate", "Limited customization"],
    "keywords": ["Research", "AI Search", "Answer Engine", "Citations"],
    "schema_type": "SoftwareApplication",
    "priority": 70,
    "is_featured": false
  },
  {
    "slug": "zotero",
    "name": "Zotero",
    "tagline": "Reference manager for academic citations and research workflows.",
    "description": "Zotero is a powerful citation manager for organizing papers, generating citations, and managing bibliographies. Highly recommended for academic writing.",
    "category": "academic",
    "sub_category": "citation",
    "pricing_model": "free",
    "website_url": "https://www.zotero.org",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Citation management", "Browser importer", "Bibliography generator", "PDF annotation"],
    "use_cases": ["Academic writing", "Research organization", "Bibliography generation"],
    "pros": ["Free and powerful", "Great Word integration", "Open ecosystem"],
    "cons": ["Cloud storage limited", "UI feels old-fashioned"],
    "keywords": ["Zotero", "Citation", "Research", "Bibliography"],
    "schema_type": "SoftwareApplication",
    "priority": 90,
    "is_featured": true
  },
  {
    "slug": "mendeley",
    "name": "Mendeley",
    "tagline": "Citation manager and academic PDF organizer.",
    "description": "Mendeley provides citation management and PDF organization for academic workflows. Useful for students and researchers who need citation automation.",
    "category": "academic",
    "sub_category": "citation",
    "pricing_model": "freemium",
    "website_url": "https://www.mendeley.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Citation manager", "PDF library", "Word plugin", "Research collaboration"],
    "use_cases": ["Thesis writing", "Citation formatting", "PDF management"],
    "pros": ["Good PDF management", "Word plugin", "Popular in universities"],
    "cons": ["Some storage paywalled", "Elsevier ecosystem lock-in"],
    "keywords": ["Mendeley", "Citations", "Research", "Academic Writing"],
    "schema_type": "SoftwareApplication",
    "priority": 75,
    "is_featured": false
  },
  {
    "slug": "grammarly",
    "name": "Grammarly",
    "tagline": "Writing assistant for grammar, clarity, and tone improvement.",
    "description": "Grammarly helps improve writing clarity, grammar, and tone. Useful for academic papers, business writing, and marketing copy editing.",
    "category": "academic",
    "sub_category": "writing",
    "pricing_model": "freemium",
    "website_url": "https://www.grammarly.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Grammar correction", "Tone suggestions", "Plagiarism checker (paid)", "Writing insights"],
    "use_cases": ["Academic writing polishing", "Business writing", "Email clarity improvement"],
    "pros": ["Very easy to use", "Strong grammar correction", "Good browser integration"],
    "cons": ["Premium required for full features", "Not perfect for academic nuance"],
    "keywords": ["Writing", "Grammar", "Academic", "Proofreading"],
    "schema_type": "SoftwareApplication",
    "priority": 72,
    "is_featured": false
  },
  {
    "slug": "turnitin",
    "name": "Turnitin",
    "tagline": "Academic integrity and plagiarism detection system.",
    "description": "Turnitin is widely used in academic institutions to detect plagiarism and support academic integrity checks.",
    "category": "academic",
    "sub_category": "integrity",
    "pricing_model": "paid",
    "website_url": "https://www.turnitin.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Plagiarism detection", "Similarity report", "Integrity workflow"],
    "use_cases": ["Academic integrity checks", "University plagiarism screening"],
    "pros": ["Widely accepted", "Strong similarity detection"],
    "cons": ["Institution access required", "Not typically for individuals"],
    "keywords": ["Plagiarism", "Academic Integrity", "Similarity Check"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },
  {
    "slug": "overleaf",
    "name": "Overleaf",
    "tagline": "Online LaTeX editor for academic papers and scientific writing.",
    "description": "Overleaf is an online LaTeX editor with collaboration features. Ideal for academic publishing, mathematics, and technical papers.",
    "category": "academic",
    "sub_category": "writing",
    "pricing_model": "freemium",
    "website_url": "https://www.overleaf.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["LaTeX editor", "Templates", "Collaboration", "PDF export"],
    "use_cases": ["Scientific writing", "Math papers", "Academic publishing"],
    "pros": ["Great for LaTeX workflows", "Good templates", "Cloud collaboration"],
    "cons": ["Some features locked", "Requires LaTeX knowledge"],
    "keywords": ["LaTeX", "Academic Writing", "Scientific Papers"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },

  {
    "slug": "meta-ads",
    "name": "Meta Ads Manager",
    "tagline": "Advertising platform for Facebook and Instagram campaigns.",
    "description": "Meta Ads Manager is used for launching and managing paid campaigns across Facebook and Instagram. Essential for ecommerce conversion scaling.",
    "category": "marketing",
    "sub_category": "paid-ads",
    "pricing_model": "free",
    "website_url": "https://www.facebook.com/business/tools/ads-manager",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Campaign setup", "Audience targeting", "Conversion tracking", "Budget allocation"],
    "use_cases": ["Paid social scaling", "Conversion campaigns", "Retargeting"],
    "pros": ["Massive reach", "Strong targeting", "Great for ecommerce"],
    "cons": ["Learning curve", "Account bans risk"],
    "keywords": ["Facebook Ads", "Instagram Ads", "Paid Social", "Campaign"],
    "schema_type": "SoftwareApplication",
    "priority": 80,
    "is_featured": true
  },
  {
    "slug": "google-ads",
    "name": "Google Ads",
    "tagline": "Paid search and display advertising platform by Google.",
    "description": "Google Ads is the leading PPC platform for search intent traffic, display campaigns, and remarketing. Ideal for ROI-driven campaigns.",
    "category": "marketing",
    "sub_category": "paid-ads",
    "pricing_model": "free",
    "website_url": "https://ads.google.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Search ads", "Display ads", "Remarketing", "Performance Max"],
    "use_cases": ["Lead generation", "Ecommerce scaling", "Brand search dominance"],
    "pros": ["High intent traffic", "Powerful targeting", "Industry standard"],
    "cons": ["Expensive in competitive niches", "Requires optimization expertise"],
    "keywords": ["PPC", "Google Ads", "Search Ads", "Performance Max"],
    "schema_type": "SoftwareApplication",
    "priority": 90,
    "is_featured": true
  },
  {
    "slug": "tiktok-ads",
    "name": "TikTok Ads Manager",
    "tagline": "Advertising platform for TikTok growth campaigns.",
    "description": "TikTok Ads Manager helps brands scale awareness and conversion campaigns with creative-driven performance marketing.",
    "category": "marketing",
    "sub_category": "paid-ads",
    "pricing_model": "free",
    "website_url": "https://ads.tiktok.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Campaign setup", "Creative optimization", "Pixel tracking", "Audience targeting"],
    "use_cases": ["UGC-driven ecommerce growth", "Brand awareness", "Conversion campaigns"],
    "pros": ["Strong virality potential", "Great for ecommerce", "Creative-first platform"],
    "cons": ["Creative fatigue risk", "Requires testing budget"],
    "keywords": ["TikTok Ads", "Paid Social", "UGC", "Ecommerce"],
    "schema_type": "SoftwareApplication",
    "priority": 75,
    "is_featured": false
  },
  {
    "slug": "hunter-io",
    "name": "Hunter.io",
    "tagline": "Find verified business emails for outreach and partnerships.",
    "description": "Hunter.io helps find and verify professional email addresses. Useful for outreach, link building, partnership acquisition, and B2B prospecting.",
    "category": "marketing",
    "sub_category": "outreach",
    "pricing_model": "freemium",
    "website_url": "https://hunter.io",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Email finder", "Email verifier", "Outreach campaigns"],
    "use_cases": ["Link building outreach", "Partnership prospecting", "B2B sales outreach"],
    "pros": ["Accurate email discovery", "Simple UI", "Good verifier"],
    "cons": ["Limited free searches", "Data not always complete"],
    "keywords": ["Outreach", "Email Finder", "Link Building", "B2B"],
    "schema_type": "SoftwareApplication",
    "priority": 72,
    "is_featured": false
  },
  {
    "slug": "mailchimp",
    "name": "Mailchimp",
    "tagline": "Email marketing platform for newsletters and automation.",
    "description": "Mailchimp provides email marketing campaigns, automation flows, and subscriber management. Useful for newsletters and ecommerce marketing.",
    "category": "marketing",
    "sub_category": "email-marketing",
    "pricing_model": "freemium",
    "website_url": "https://mailchimp.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Email campaigns", "Automation flows", "Subscriber lists", "Templates"],
    "use_cases": ["Newsletter growth", "Ecommerce email marketing", "Automated drip campaigns"],
    "pros": ["Popular and easy", "Good templates", "Integrations"],
    "cons": ["Pricing increases quickly", "Limited advanced segmentation"],
    "keywords": ["Email Marketing", "Newsletter", "Automation"],
    "schema_type": "SoftwareApplication",
    "priority": 60,
    "is_featured": false
  },
  {
    "slug": "brevo",
    "name": "Brevo (Sendinblue)",
    "tagline": "Email + SMS marketing platform with automation.",
    "description": "Brevo provides email marketing, SMS campaigns, and automation features. Good alternative to Mailchimp with strong pricing flexibility.",
    "category": "marketing",
    "sub_category": "email-marketing",
    "pricing_model": "freemium",
    "website_url": "https://www.brevo.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Email marketing", "SMS marketing", "Automation workflows", "CRM basics"],
    "use_cases": ["Newsletter campaigns", "SMS alerts", "Lead nurturing"],
    "pros": ["Flexible pricing", "SMS included", "Good automation"],
    "cons": ["UI less polished", "Deliverability varies by region"],
    "keywords": ["Email", "SMS", "Automation", "Marketing"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },

  {
    "slug": "google-trends",
    "name": "Google Trends",
    "tagline": "Trend discovery tool for search interest and topic research.",
    "description": "Google Trends helps identify rising topics, seasonal interest, and search patterns. Useful for topical burst publishing and content planning.",
    "category": "seo",
    "sub_category": "research",
    "pricing_model": "free",
    "website_url": "https://trends.google.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Search interest charts", "Regional trends", "Related queries", "Comparisons"],
    "use_cases": ["Content planning", "Trend monitoring", "Discover topic spikes"],
    "pros": ["Free and official", "Great for topic discovery"],
    "cons": ["Limited detail", "No competitor backlink insights"],
    "keywords": ["Trends", "Topic Research", "SEO Planning"],
    "schema_type": "SoftwareApplication",
    "priority": 82,
    "is_featured": true
  },
  {
    "slug": "answer-the-public",
    "name": "AnswerThePublic",
    "tagline": "Question-based keyword research and content ideation tool.",
    "description": "AnswerThePublic generates keyword questions and query ideas based on search behavior. Useful for FAQ pages and AEO optimization.",
    "category": "seo",
    "sub_category": "research",
    "pricing_model": "freemium",
    "website_url": "https://answerthepublic.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Question keyword research", "Topic visualization", "Content ideation"],
    "use_cases": ["FAQ generation", "AEO optimization", "Content ideation"],
    "pros": ["Good for question discovery", "Great visualization"],
    "cons": ["Free usage limited", "Not deep competitor research"],
    "keywords": ["FAQ", "AEO", "Keyword Research", "Questions"],
    "schema_type": "SoftwareApplication",
    "priority": 58,
    "is_featured": false
  },
  {
    "slug": "ubersuggest",
    "name": "Ubersuggest",
    "tagline": "Affordable SEO keyword research and audit tool.",
    "description": "Ubersuggest offers keyword suggestions, content ideas, and basic SEO audits. Suitable for beginners and small businesses.",
    "category": "seo",
    "sub_category": "keyword-research",
    "pricing_model": "freemium",
    "website_url": "https://neilpatel.com/ubersuggest/",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Keyword suggestions", "SEO audit", "Traffic estimates", "Content ideas"],
    "use_cases": ["Basic keyword research", "SEO beginner audits", "Content planning"],
    "pros": ["Affordable", "Simple UI"],
    "cons": ["Less accurate than Ahrefs/SEMrush", "Limited depth"],
    "keywords": ["Keyword Research", "SEO", "Audit"],
    "schema_type": "SoftwareApplication",
    "priority": 45,
    "is_featured": false
  },

  {
    "slug": "looker-studio",
    "name": "Looker Studio",
    "tagline": "Free dashboard and reporting tool by Google.",
    "description": "Looker Studio (formerly Data Studio) allows building interactive dashboards from multiple data sources. Useful for reporting KPI, campaign analytics, and business insights.",
    "category": "analytics",
    "sub_category": "dashboards",
    "pricing_model": "free",
    "website_url": "https://lookerstudio.google.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Dashboards", "Data connectors", "Sharing", "Visualization"],
    "use_cases": ["KPI dashboards", "Campaign reporting", "Client reports"],
    "pros": ["Free", "Google ecosystem integration", "Strong visualization"],
    "cons": ["Performance issues with huge datasets", "Complex connectors"],
    "keywords": ["Dashboard", "Reporting", "Analytics", "KPI"],
    "schema_type": "SoftwareApplication",
    "priority": 70,
    "is_featured": false
  },
  {
    "slug": "power-bi",
    "name": "Microsoft Power BI",
    "tagline": "Business intelligence dashboards and reporting platform.",
    "description": "Power BI enables advanced business intelligence dashboards, data modeling, and reporting. Suitable for corporate KPI systems and executive reporting.",
    "category": "analytics",
    "sub_category": "business-intelligence",
    "pricing_model": "paid",
    "website_url": "https://powerbi.microsoft.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["BI dashboards", "Data modeling", "Power Query", "Enterprise reporting"],
    "use_cases": ["Executive KPI dashboards", "Business reporting", "Data analysis automation"],
    "pros": ["Enterprise-grade", "Strong integrations", "Powerful modeling"],
    "cons": ["Learning curve", "Paid licensing"],
    "keywords": ["BI", "Dashboards", "KPI", "Analytics"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },

  {
    "slug": "tableau",
    "name": "Tableau",
    "tagline": "Data visualization platform for enterprise analytics.",
    "description": "Tableau is a leading enterprise visualization and BI platform for complex analytics and interactive dashboards.",
    "category": "analytics",
    "sub_category": "business-intelligence",
    "pricing_model": "paid",
    "website_url": "https://www.tableau.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Visualization", "Dashboards", "Data blending", "Enterprise BI"],
    "use_cases": ["Advanced data visualization", "Enterprise reporting", "Analytics storytelling"],
    "pros": ["Best-in-class visualization", "Strong enterprise adoption"],
    "cons": ["Expensive", "Complex licensing"],
    "keywords": ["Tableau", "BI", "Visualization", "Analytics"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },

  {
    "slug": "airtable",
    "name": "Airtable",
    "tagline": "Spreadsheet-database hybrid for workflows and lightweight apps.",
    "description": "Airtable combines spreadsheet simplicity with database structure. Useful for content systems, CRM-like workflows, and operations tracking.",
    "category": "productivity",
    "sub_category": "database-workflow",
    "pricing_model": "freemium",
    "website_url": "https://airtable.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Databases", "Automations", "Views", "Collaboration"],
    "use_cases": ["Content workflow", "Ops tracking", "Lightweight CRM"],
    "pros": ["Flexible structure", "Easy automation", "Good UI"],
    "cons": ["Pricing grows", "Not ideal for very large datasets"],
    "keywords": ["Workflow", "Database", "Automation", "Ops"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },
  {
    "slug": "trello",
    "name": "Trello",
    "tagline": "Kanban project management tool for teams.",
    "description": "Trello is a kanban-based project management tool used for task tracking, planning, and lightweight team collaboration.",
    "category": "productivity",
    "sub_category": "project-management",
    "pricing_model": "freemium",
    "website_url": "https://trello.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Boards", "Cards", "Automation", "Team collaboration"],
    "use_cases": ["Task management", "Content planning", "Project coordination"],
    "pros": ["Simple", "Fast adoption", "Good for small teams"],
    "cons": ["Limited for complex projects", "Scaling issues"],
    "keywords": ["Project Management", "Kanban", "Tasks"],
    "schema_type": "SoftwareApplication",
    "priority": 40,
    "is_featured": false
  },

  {
    "slug": "asana",
    "name": "Asana",
    "tagline": "Work management platform for structured project execution.",
    "description": "Asana helps manage structured projects with tasks, timelines, and collaboration. Useful for operations and marketing teams.",
    "category": "productivity",
    "sub_category": "project-management",
    "pricing_model": "freemium",
    "website_url": "https://asana.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Task management", "Timelines", "Team collaboration", "Automation rules"],
    "use_cases": ["Project execution", "Marketing operations", "Workflow coordination"],
    "pros": ["Good for structured planning", "Strong team features"],
    "cons": ["Overkill for small teams", "Paid for advanced features"],
    "keywords": ["Project Management", "Workflow", "Operations"],
    "schema_type": "SoftwareApplication",
    "priority": 50,
    "is_featured": false
  },

  {
    "slug": "stripe",
    "name": "Stripe",
    "tagline": "Payment infrastructure for online businesses and SaaS.",
    "description": "Stripe provides payment processing, subscriptions, and checkout solutions for SaaS and ecommerce. Essential for monetization systems.",
    "category": "engineering",
    "sub_category": "payments",
    "pricing_model": "paid",
    "website_url": "https://stripe.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Payment processing", "Subscriptions", "Checkout", "Webhooks", "Fraud prevention"],
    "use_cases": ["SaaS subscriptions", "Online payments", "Checkout optimization"],
    "pros": ["Developer-friendly", "Reliable", "Strong global support"],
    "cons": ["Not available in all countries", "Fees add up"],
    "keywords": ["Payments", "Subscriptions", "Checkout", "SaaS"],
    "schema_type": "SoftwareApplication",
    "priority": 70,
    "is_featured": false
  },

  {
    "slug": "midjourney",
    "name": "Midjourney",
    "tagline": "AI image generation for branding and creative assets.",
    "description": "Midjourney generates high-quality images using AI. Useful for branding concepts, marketing creatives, and visual asset generation.",
    "category": "ai",
    "sub_category": "image-generation",
    "pricing_model": "paid",
    "website_url": "https://www.midjourney.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Image generation", "Style control", "Creative variations"],
    "use_cases": ["Marketing creatives", "Brand exploration", "Concept art"],
    "pros": ["Very high image quality", "Strong community"],
    "cons": ["Discord-based workflow", "Paid only"],
    "keywords": ["AI Images", "Branding", "Creative"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },
  {
    "slug": "runway",
    "name": "Runway",
    "tagline": "AI video editing and generative media platform.",
    "description": "Runway provides AI-powered video editing tools and generative video capabilities. Useful for content marketing and creative production.",
    "category": "ai",
    "sub_category": "video-generation",
    "pricing_model": "freemium",
    "website_url": "https://runwayml.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["AI video editing", "Generative video", "Background removal", "Motion tracking"],
    "use_cases": ["Video marketing", "Creative content", "AI video workflows"],
    "pros": ["Strong AI video tools", "Creative-friendly"],
    "cons": ["Compute-heavy", "Paid for full usage"],
    "keywords": ["AI Video", "Content Creation", "Marketing"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },

  {
    "slug": "lighthouse",
    "name": "Google Lighthouse",
    "tagline": "Performance and SEO audit tool for web quality checks.",
    "description": "Lighthouse is an auditing tool built into Chrome DevTools for measuring performance, accessibility, SEO, and best practices.",
    "category": "engineering",
    "sub_category": "performance",
    "pricing_model": "free",
    "website_url": "https://developer.chrome.com/docs/lighthouse/overview/",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Performance audit", "Accessibility audit", "SEO audit", "Best practices audit"],
    "use_cases": ["Core Web Vitals checks", "SEO technical checks", "Performance optimization"],
    "pros": ["Free", "Integrated into Chrome", "Industry standard"],
    "cons": ["Not a full SEO crawler", "Lab data differs from field data"],
    "keywords": ["Performance", "Core Web Vitals", "SEO", "Audit"],
    "schema_type": "SoftwareApplication",
    "priority": 75,
    "is_featured": false
  },

  {
    "slug": "pagespeed-insights",
    "name": "PageSpeed Insights",
    "tagline": "Google’s CWV measurement tool with lab + field data.",
    "description": "PageSpeed Insights provides performance analysis with lab data and CrUX field data. Critical for Core Web Vitals optimization.",
    "category": "engineering",
    "sub_category": "performance",
    "pricing_model": "free",
    "website_url": "https://pagespeed.web.dev",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["CWV report", "CrUX field data", "Performance recommendations"],
    "use_cases": ["LCP/CLS/INP improvements", "Performance benchmarking"],
    "pros": ["Official Google data", "Field data included", "Free"],
    "cons": ["Recommendations can be generic", "Not always actionable directly"],
    "keywords": ["Core Web Vitals", "Performance", "LCP", "CLS", "INP"],
    "schema_type": "SoftwareApplication",
    "priority": 80,
    "is_featured": true
  },

  {
    "slug": "gtmetrix",
    "name": "GTmetrix",
    "tagline": "Website performance analysis and monitoring platform.",
    "description": "GTmetrix provides website performance testing with waterfall charts and performance monitoring. Useful for identifying slow scripts and rendering issues.",
    "category": "engineering",
    "sub_category": "performance",
    "pricing_model": "freemium",
    "website_url": "https://gtmetrix.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Performance testing", "Waterfall analysis", "Monitoring alerts"],
    "use_cases": ["Performance debugging", "Speed monitoring", "Optimization planning"],
    "pros": ["Great waterfall reports", "Useful monitoring"],
    "cons": ["Some features paid", "Results vary by test region"],
    "keywords": ["Performance", "Speed Test", "Waterfall"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },

  {
    "slug": "wordtracker",
    "name": "Wordtracker",
    "tagline": "Keyword research tool for SEO and PPC planning.",
    "description": "Wordtracker provides keyword research and competitor insights for SEO and PPC campaigns.",
    "category": "seo",
    "sub_category": "keyword-research",
    "pricing_model": "paid",
    "website_url": "https://www.wordtracker.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Keyword research", "Competitor insights", "SEO planning"],
    "use_cases": ["Keyword planning", "SEO strategy"],
    "pros": ["Useful keyword ideas", "Simple workflow"],
    "cons": ["Not as powerful as Ahrefs/SEMrush"],
    "keywords": ["Keywords", "SEO Research", "PPC"],
    "schema_type": "SoftwareApplication",
    "priority": 35,
    "is_featured": false
  },

  {
    "slug": "moz",
    "name": "Moz Pro",
    "tagline": "SEO suite for keyword tracking, audits, and authority metrics.",
    "description": "Moz Pro provides SEO tools including keyword research, rank tracking, site audits, and link analysis. Known for Domain Authority metric.",
    "category": "seo",
    "sub_category": "seo-suite",
    "pricing_model": "paid",
    "website_url": "https://moz.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Keyword Explorer", "Site Crawl", "Rank Tracking", "Link Explorer"],
    "use_cases": ["SEO tracking", "Authority measurement", "Site audits"],
    "pros": ["Good beginner-friendly suite", "DA metric popular"],
    "cons": ["Database smaller than Ahrefs", "Paid"],
    "keywords": ["SEO", "Domain Authority", "Rank Tracking"],
    "schema_type": "SoftwareApplication",
    "priority": 50,
    "is_featured": false
  },

  {
    "slug": "spyfu",
    "name": "SpyFu",
    "tagline": "Competitive intelligence for SEO and PPC keywords.",
    "description": "SpyFu helps analyze competitor SEO and PPC strategies, including keyword overlaps and ad history.",
    "category": "seo",
    "sub_category": "competitive-research",
    "pricing_model": "paid",
    "website_url": "https://www.spyfu.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Competitor keyword research", "PPC history", "SEO tracking"],
    "use_cases": ["Competitor analysis", "Keyword research", "Ads intelligence"],
    "pros": ["Good competitor insights", "Affordable compared to SEMrush"],
    "cons": ["Less comprehensive global data"],
    "keywords": ["Competitor Research", "PPC", "SEO"],
    "schema_type": "SoftwareApplication",
    "priority": 45,
    "is_featured": false
  },

  {
    "slug": "buzzsumo",
    "name": "BuzzSumo",
    "tagline": "Content research and influencer discovery tool.",
    "description": "BuzzSumo helps discover trending content and analyze what performs best in a niche. Useful for content marketing and PR strategy.",
    "category": "marketing",
    "sub_category": "content-marketing",
    "pricing_model": "paid",
    "website_url": "https://buzzsumo.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Content research", "Influencer discovery", "Trend monitoring"],
    "use_cases": ["Content ideation", "PR campaigns", "Trend discovery"],
    "pros": ["Great for content insights", "Influencer research"],
    "cons": ["Expensive", "Not needed for beginners"],
    "keywords": ["Content Marketing", "Trends", "Influencers"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },

  {
    "slug": "buffer",
    "name": "Buffer",
    "tagline": "Social media scheduling and publishing platform.",
    "description": "Buffer helps schedule posts across multiple social platforms. Useful for consistent content distribution.",
    "category": "marketing",
    "sub_category": "social-media",
    "pricing_model": "freemium",
    "website_url": "https://buffer.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Scheduling", "Analytics", "Multi-platform posting"],
    "use_cases": ["Content distribution", "Social media management"],
    "pros": ["Simple UI", "Good for small teams"],
    "cons": ["Advanced analytics limited"],
    "keywords": ["Social Media", "Scheduling", "Marketing"],
    "schema_type": "SoftwareApplication",
    "priority": 40,
    "is_featured": false
  },

  {
    "slug": "hootsuite",
    "name": "Hootsuite",
    "tagline": "Enterprise social media management and analytics platform.",
    "description": "Hootsuite is a social media management platform offering scheduling, monitoring, and analytics for enterprise teams.",
    "category": "marketing",
    "sub_category": "social-media",
    "pricing_model": "paid",
    "website_url": "https://www.hootsuite.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Scheduling", "Monitoring", "Analytics", "Team workflows"],
    "use_cases": ["Enterprise social media management", "Brand monitoring"],
    "pros": ["Enterprise features", "Strong monitoring"],
    "cons": ["Expensive", "Overkill for small teams"],
    "keywords": ["Social Media", "Brand Monitoring", "Analytics"],
    "schema_type": "SoftwareApplication",
    "priority": 35,
    "is_featured": false
  },

  {
    "slug": "bitly",
    "name": "Bitly",
    "tagline": "URL shortening and tracking platform.",
    "description": "Bitly shortens links and provides click tracking. Useful for campaign tracking and link management.",
    "category": "analytics",
    "sub_category": "tracking",
    "pricing_model": "freemium",
    "website_url": "https://bitly.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Short links", "Click tracking", "Branded domains"],
    "use_cases": ["Campaign tracking", "Affiliate tracking", "Link shortening"],
    "pros": ["Easy to use", "Tracking built-in"],
    "cons": ["Paid for branded domains"],
    "keywords": ["Tracking", "Short Links", "Analytics"],
    "schema_type": "SoftwareApplication",
    "priority": 45,
    "is_featured": false
  },

  {
    "slug": "schema-markup-generator",
    "name": "Merkle Schema Markup Generator",
    "tagline": "Generate structured data JSON-LD for SEO schema.",
    "description": "Merkle Schema Markup Generator helps create JSON-LD structured data for SEO, including FAQ, Article, Organization, and more.",
    "category": "seo",
    "sub_category": "schema",
    "pricing_model": "free",
    "website_url": "https://technicalseo.com/tools/schema-markup-generator/",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["FAQ schema generator", "Article schema generator", "Organization schema generator"],
    "use_cases": ["Schema implementation", "SEO structured data testing"],
    "pros": ["Free", "Fast schema generation"],
    "cons": ["Manual integration needed"],
    "keywords": ["Schema", "JSON-LD", "Structured Data"],
    "schema_type": "SoftwareApplication",
    "priority": 50,
    "is_featured": false
  },

  {
    "slug": "rich-results-test",
    "name": "Google Rich Results Test",
    "tagline": "Test schema markup eligibility for rich results.",
    "description": "Google Rich Results Test validates structured data and checks eligibility for rich results in Google Search.",
    "category": "seo",
    "sub_category": "schema",
    "pricing_model": "free",
    "website_url": "https://search.google.com/test/rich-results",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Schema validation", "Rich results preview", "Error reporting"],
    "use_cases": ["Schema debugging", "Rich results validation"],
    "pros": ["Official Google tool", "Fast validation"],
    "cons": ["Does not cover all schema types"],
    "keywords": ["Schema", "SEO", "Structured Data", "Rich Results"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },

  {
    "slug": "schema-validator",
    "name": "Schema.org Validator",
    "tagline": "Validate structured data markup for schema compliance.",
    "description": "Schema.org Validator checks structured data markup compliance and highlights errors or missing fields.",
    "category": "seo",
    "sub_category": "schema",
    "pricing_model": "free",
    "website_url": "https://validator.schema.org/",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Schema validation", "JSON-LD inspection", "Error detection"],
    "use_cases": ["Schema QA", "SEO structured data debugging"],
    "pros": ["Accurate validation", "Free"],
    "cons": ["No Google-specific rich result hints"],
    "keywords": ["Schema", "JSON-LD", "Validation"],
    "schema_type": "SoftwareApplication",
    "priority": 50,
    "is_featured": false
  }
]
```

### Catatan:

* Ini sudah 50? Belum, ini sekitar 40-an. Kalau kamu mau **benar-benar 50+**, aku bisa extend batch berikutnya (tools untuk scraping, monitoring, keyword clustering, affiliate platform, rank tracker, backlink outreach).
* Seed ini sengaja fokus pada “high intent” tools.

Kalau kamu ingin full 70 tools sekalian, bilang “lanjutkan batch 2”.

---

# 2) RSS Sources Seed (Radar Sources yang Valid & Efektif)

Tujuan: Radar harus authoritative.
Kita bagi ke cluster: SEO, Google official, AI, Engineering, Security, Product, Marketing.

Simpan sebagai: `data/radar_sources.seed.json`

```json
[
  {
    "name": "Google Search Central Blog",
    "rss_url": "https://developers.google.com/search/blog/rss.xml",
    "site_url": "https://developers.google.com/search/blog",
    "category": "seo",
    "priority": 100,
    "is_active": true
  },
  {
    "name": "Google AI Blog",
    "rss_url": "https://blog.google/technology/ai/rss/",
    "site_url": "https://blog.google/technology/ai/",
    "category": "ai",
    "priority": 95,
    "is_active": true
  },
  {
    "name": "OpenAI Blog",
    "rss_url": "https://openai.com/blog/rss.xml",
    "site_url": "https://openai.com/blog",
    "category": "ai",
    "priority": 95,
    "is_active": true
  },
  {
    "name": "Vercel Blog",
    "rss_url": "https://vercel.com/blog/rss.xml",
    "site_url": "https://vercel.com/blog",
    "category": "engineering",
    "priority": 90,
    "is_active": true
  },
  {
    "name": "Cloudflare Blog",
    "rss_url": "https://blog.cloudflare.com/rss/",
    "site_url": "https://blog.cloudflare.com",
    "category": "engineering",
    "priority": 90,
    "is_active": true
  },
  {
    "name": "Supabase Blog",
    "rss_url": "https://supabase.com/blog/rss.xml",
    "site_url": "https://supabase.com/blog",
    "category": "engineering",
    "priority": 85,
    "is_active": true
  },
  {
    "name": "Ahrefs Blog",
    "rss_url": "https://ahrefs.com/blog/feed/",
    "site_url": "https://ahrefs.com/blog",
    "category": "seo",
    "priority": 88,
    "is_active": true
  },
  {
    "name": "SEMrush Blog",
    "rss_url": "https://www.semrush.com/blog/rss/",
    "site_url": "https://www.semrush.com/blog/",
    "category": "seo",
    "priority": 85,
    "is_active": true
  },
  {
    "name": "Search Engine Journal",
    "rss_url": "https://www.searchenginejournal.com/feed/",
    "site_url": "https://www.searchenginejournal.com",
    "category": "seo",
    "priority": 80,
    "is_active": true
  },
  {
    "name": "Search Engine Land",
    "rss_url": "https://searchengineland.com/feed",
    "site_url": "https://searchengineland.com",
    "category": "seo",
    "priority": 82,
    "is_active": true
  },
  {
    "name": "Moz Blog",
    "rss_url": "https://moz.com/blog/feed",
    "site_url": "https://moz.com/blog",
    "category": "seo",
    "priority": 75,
    "is_active": true
  },
  {
    "name": "Backlinko Blog",
    "rss_url": "https://backlinko.com/feed",
    "site_url": "https://backlinko.com",
    "category": "seo",
    "priority": 70,
    "is_active": true
  },
  {
    "name": "Neil Patel Blog",
    "rss_url": "https://neilpatel.com/feed/",
    "site_url": "https://neilpatel.com/blog/",
    "category": "marketing",
    "priority": 55,
    "is_active": true
  },
  {
    "name": "HubSpot Marketing Blog",
    "rss_url": "https://blog.hubspot.com/marketing/rss.xml",
    "site_url": "https://blog.hubspot.com/marketing",
    "category": "marketing",
    "priority": 75,
    "is_active": true
  },
  {
    "name": "Think with Google",
    "rss_url": "https://www.thinkwithgoogle.com/intl/en-154/rss/",
    "site_url": "https://www.thinkwithgoogle.com",
    "category": "marketing",
    "priority": 80,
    "is_active": true
  },
  {
    "name": "Google Ads Blog",
    "rss_url": "https://ads.googleblog.com/feeds/posts/default?alt=rss",
    "site_url": "https://ads.googleblog.com",
    "category": "marketing",
    "priority": 85,
    "is_active": true
  },
  {
    "name": "Meta for Business Newsroom",
    "rss_url": "https://www.facebook.com/business/news/rss",
    "site_url": "https://www.facebook.com/business/news",
    "category": "marketing",
    "priority": 75,
    "is_active": true
  },
  {
    "name": "TikTok Business Blog",
    "rss_url": "https://www.tiktok.com/business/en/blog/rss",
    "site_url": "https://www.tiktok.com/business/en/blog",
    "category": "marketing",
    "priority": 70,
    "is_active": true
  },
  {
    "name": "The Verge",
    "rss_url": "https://www.theverge.com/rss/index.xml",
    "site_url": "https://www.theverge.com",
    "category": "tech",
    "priority": 60,
    "is_active": true
  },
  {
    "name": "TechCrunch",
    "rss_url": "https://techcrunch.com/feed/",
    "site_url": "https://techcrunch.com",
    "category": "startup",
    "priority": 65,
    "is_active": true
  },
  {
    "name": "Ars Technica",
    "rss_url": "https://feeds.arstechnica.com/arstechnica/index",
    "site_url": "https://arstechnica.com",
    "category": "tech",
    "priority": 65,
    "is_active": true
  },
  {
    "name": "The Hacker News",
    "rss_url": "https://feeds.feedburner.com/TheHackersNews",
    "site_url": "https://thehackernews.com",
    "category": "security",
    "priority": 75,
    "is_active": true
  },
  {
    "name": "Krebs on Security",
    "rss_url": "https://krebsonsecurity.com/feed/",
    "site_url": "https://krebsonsecurity.com",
    "category": "security",
    "priority": 70,
    "is_active": true
  },
  {
    "name": "OWASP News",
    "rss_url": "https://owasp.org/www-project-news/feeds/rss.xml",
    "site_url": "https://owasp.org",
    "category": "security",
    "priority": 65,
    "is_active": true
  },
  {
    "name": "GitHub Blog",
    "rss_url": "https://github.blog/feed/",
    "site_url": "https://github.blog",
    "category": "engineering",
    "priority": 80,
    "is_active": true
  },
  {
    "name": "Netflix Tech Blog",
    "rss_url": "https://netflixtechblog.com/feed",
    "site_url": "https://netflixtechblog.com",
    "category": "engineering",
    "priority": 60,
    "is_active": true
  },
  {
    "name": "Stripe Blog",
    "rss_url": "https://stripe.com/blog/rss",
    "site_url": "https://stripe.com/blog",
    "category": "product",
    "priority": 70,
    "is_active": true
  },
  {
    "name": "Shopify Engineering",
    "rss_url": "https://shopify.engineering/blog.atom",
    "site_url": "https://shopify.engineering",
    "category": "engineering",
    "priority": 60,
    "is_active": true
  },
  {
    "name": "Google Cloud Blog",
    "rss_url": "https://cloud.google.com/blog/rss",
    "site_url": "https://cloud.google.com/blog",
    "category": "engineering",
    "priority": 75,
    "is_active": true
  },
  {
    "name": "AWS News Blog",
    "rss_url": "https://aws.amazon.com/blogs/aws/feed/",
    "site_url": "https://aws.amazon.com/blogs/aws/",
    "category": "engineering",
    "priority": 75,
    "is_active": true
  },
  {
    "name": "Microsoft Developer Blog",
    "rss_url": "https://devblogs.microsoft.com/feed/",
    "site_url": "https://devblogs.microsoft.com",
    "category": "engineering",
    "priority": 65,
    "is_active": true
  }
]
```

---

# 3) Radar Source Strategy (Kenapa ini Presisi)

## Tier 1 (Authority/EEAT tinggi)

* Google Search Central
* OpenAI
* Google AI
* Cloudflare
* Vercel
* Supabase

Ini wajib karena:

* authoritative signals
* cocok untuk Discover

## Tier 2 (SEO editorial yang kuat)

* Ahrefs
* SEMrush
* SEJ
* Search Engine Land
* Moz

Ini penting untuk:

* keyword trends
* algorithm update analysis

## Tier 3 (engineering/security trend)

* GitHub Blog
* AWS
* GCP
* Hacker News

Ini bikin radar kamu “industry-grade”.

---

# 4) Saran Implementasi: RSS Noise Control

Agar radar tidak penuh junk, tambahkan filter:

### Block keywords (spam)

* "coupon"
* "deal"
* "discount"
* "sponsored post"
* "casino"
* "crypto pump"
* "airdrop"

### Allow keywords boost

* "core update"
* "ranking"
* "indexing"
* "search"
* "LLM"
* "API"
* "security patch"
* "release"

Implement scoring di cron:

* jika title mengandung allow keywords → +20
* jika title mengandung block keywords → skip

---

# 5) Minimal Supabase Seed for radar_sources (SQL Insert Example)

Jika kamu butuh SQL seeding langsung:

```sql
insert into radar_sources (name, rss_url, site_url, category, priority, is_active)
values
('Google Search Central Blog','https://developers.google.com/search/blog/rss.xml','https://developers.google.com/search/blog','seo',100,true);
```

Tapi karena kamu pakai Node seed script, JSON di atas lebih ideal.

---

# 6) Next Step (yang paling efektif)

Setelah seed masuk:

* build `/tools` hub
* build `/api/out/tool/[slug]` redirect tracking
* build `/tools/[category]/[slug]` pages + schema + OG image

Ini akan membuat directory kamu langsung jadi mesin revenue.

---

Berikut **Batch 2** tambahan **30 tools** (lebih “growth-grade”: scraping, monitoring, SERP tracking, affiliate/link cloaking, CRO, email deliverability, uptime, pSEO, automation).
Gabungkan dengan batch 1 menjadi total **70 tools**.

Simpan sebagai: `data/tools.seed.batch2.json` 
(atau langsung merge ke `tools.seed.json`)

---

```json
[
  {
    "slug": "google-tag-manager",
    "name": "Google Tag Manager",
    "tagline": "Tag deployment and event tracking without redeploying code.",
    "description": "Google Tag Manager simplifies tracking deployment for analytics, pixels, and conversion events. Essential for marketing attribution, GA4 event management, and CRO instrumentation.",
    "category": "analytics",
    "sub_category": "tracking",
    "pricing_model": "free",
    "website_url": "https://tagmanager.google.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Tag deployment", "Triggers & variables", "GA4 integration", "Debug mode"],
    "use_cases": ["GA4 event tracking", "Conversion tracking setup", "Pixel deployment"],
    "pros": ["Free", "Industry standard", "No redeploy needed for tracking changes"],
    "cons": ["Can break tracking if misconfigured", "Needs careful naming conventions"],
    "keywords": ["GTM", "Tracking", "Analytics", "GA4", "Conversion"],
    "schema_type": "SoftwareApplication",
    "priority": 85,
    "is_featured": true
  },
  {
    "slug": "mixpanel",
    "name": "Mixpanel",
    "tagline": "Product analytics platform for event-based funnel analysis.",
    "description": "Mixpanel provides deep event-based product analytics, funnel analysis, retention tracking, and cohort segmentation. Useful for SaaS growth engineering and onboarding optimization.",
    "category": "analytics",
    "sub_category": "product-analytics",
    "pricing_model": "freemium",
    "website_url": "https://mixpanel.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Funnels", "Cohorts", "Retention reports", "Event tracking", "User segmentation"],
    "use_cases": ["SaaS onboarding optimization", "Activation funnel analysis", "Retention engineering"],
    "pros": ["Strong product analytics", "Excellent funnel UI", "Powerful cohorts"],
    "cons": ["Setup requires instrumentation", "Paid for scale"],
    "keywords": ["Product Analytics", "Funnels", "Retention", "Cohorts", "SaaS"],
    "schema_type": "SoftwareApplication",
    "priority": 72,
    "is_featured": false
  },
  {
    "slug": "amplitude",
    "name": "Amplitude",
    "tagline": "Enterprise product analytics and behavior intelligence platform.",
    "description": "Amplitude offers advanced product analytics and behavior intelligence for teams who want to optimize growth loops, retention, and user journeys at scale.",
    "category": "analytics",
    "sub_category": "product-analytics",
    "pricing_model": "freemium",
    "website_url": "https://amplitude.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Funnels", "Behavioral cohorts", "Retention analysis", "Experiment insights"],
    "use_cases": ["Growth analytics", "User journey optimization", "SaaS product intelligence"],
    "pros": ["Powerful analytics engine", "Strong enterprise adoption"],
    "cons": ["Complex setup", "Paid features for advanced analysis"],
    "keywords": ["Analytics", "Product Growth", "Retention", "Funnels"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },
  {
    "slug": "matomo",
    "name": "Matomo",
    "tagline": "Privacy-focused web analytics alternative to Google Analytics.",
    "description": "Matomo is a privacy-first analytics platform. Useful for organizations that need full data ownership and compliance-friendly analytics tracking.",
    "category": "analytics",
    "sub_category": "web-analytics",
    "pricing_model": "freemium",
    "website_url": "https://matomo.org",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Web analytics", "Heatmaps (paid)", "On-premise hosting", "Privacy compliance"],
    "use_cases": ["Privacy-compliant analytics", "Enterprise analytics ownership"],
    "pros": ["Strong privacy", "Self-hosting possible"],
    "cons": ["Less ecosystem integration than GA4", "Advanced features paid"],
    "keywords": ["Privacy Analytics", "Tracking", "Compliance"],
    "schema_type": "SoftwareApplication",
    "priority": 45,
    "is_featured": false
  },
  {
    "slug": "plausible",
    "name": "Plausible Analytics",
    "tagline": "Lightweight privacy-friendly analytics for modern websites.",
    "description": "Plausible is a simple and fast analytics platform that respects privacy. Great for creators and startups that want clean metrics without heavy tracking scripts.",
    "category": "analytics",
    "sub_category": "web-analytics",
    "pricing_model": "paid",
    "website_url": "https://plausible.io",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Lightweight script", "Privacy-first analytics", "Simple dashboard"],
    "use_cases": ["Website analytics without cookies", "Performance-friendly tracking"],
    "pros": ["Very fast", "Clean UI", "Privacy friendly"],
    "cons": ["Less granular than GA4", "Paid only"],
    "keywords": ["Analytics", "Privacy", "Lightweight", "Tracking"],
    "schema_type": "SoftwareApplication",
    "priority": 50,
    "is_featured": false
  },
  {
    "slug": "gsc-insights",
    "name": "Search Console Insights",
    "tagline": "Content performance insights combining Search Console and Analytics.",
    "description": "Search Console Insights highlights content performance and search behavior insights. Useful for identifying high potential pages and topical bursts.",
    "category": "seo",
    "sub_category": "search-analytics",
    "pricing_model": "free",
    "website_url": "https://search.google.com/search-console/insights/",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Content performance highlights", "Search query insights", "Traffic sources"],
    "use_cases": ["Content optimization planning", "Topical burst publishing"],
    "pros": ["Official Google data", "Simple content insights"],
    "cons": ["Limited controls", "Not a full SEO suite"],
    "keywords": ["SEO", "Content Insights", "Google"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },
  {
    "slug": "keyword-insights",
    "name": "Keyword Insights",
    "tagline": "Keyword clustering and topical map generator for SEO scaling.",
    "description": "Keyword Insights helps cluster keywords into topic groups, generate content briefs, and build SEO topical authority structures.",
    "category": "seo",
    "sub_category": "topic-clustering",
    "pricing_model": "paid",
    "website_url": "https://keywordinsights.ai",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Keyword clustering", "Topic maps", "Brief generation", "SERP grouping"],
    "use_cases": ["Topical authority planning", "pSEO architecture", "Content strategy"],
    "pros": ["Great clustering engine", "Strong for topical SEO"],
    "cons": ["Paid", "Needs clean keyword input"],
    "keywords": ["Keyword Clustering", "Topical Authority", "SEO Strategy"],
    "schema_type": "SoftwareApplication",
    "priority": 62,
    "is_featured": false
  },
  {
    "slug": "seo-monitoring",
    "name": "SEOmonitor",
    "tagline": "Rank tracking and forecasting platform for SEO teams.",
    "description": "SEOmonitor provides rank tracking, forecasting, and reporting. Useful for agencies managing client SEO KPIs and monthly reporting.",
    "category": "seo",
    "sub_category": "rank-tracking",
    "pricing_model": "paid",
    "website_url": "https://seomonitor.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Rank tracking", "Forecasting", "Reporting", "Keyword grouping"],
    "use_cases": ["Agency SEO reporting", "SEO KPI monitoring", "Forecast planning"],
    "pros": ["Forecasting is strong", "Great reporting"],
    "cons": ["Paid", "Not for beginners"],
    "keywords": ["Rank Tracking", "SEO Reporting", "Forecasting"],
    "schema_type": "SoftwareApplication",
    "priority": 45,
    "is_featured": false
  },
  {
    "slug": "serpapi",
    "name": "SerpApi",
    "tagline": "Google SERP scraping API for programmatic SEO workflows.",
    "description": "SerpApi provides structured SERP data via API. Useful for rank tracking automation, SERP monitoring, and building pSEO systems.",
    "category": "engineering",
    "sub_category": "scraping",
    "pricing_model": "paid",
    "website_url": "https://serpapi.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["SERP scraping API", "Google/YouTube results", "Structured JSON output"],
    "use_cases": ["SERP monitoring", "Keyword tracking automation", "pSEO competitor analysis"],
    "pros": ["Reliable SERP extraction", "Clean API output"],
    "cons": ["Paid", "Quota-based pricing"],
    "keywords": ["SERP API", "Scraping", "SEO Automation", "pSEO"],
    "schema_type": "SoftwareApplication",
    "priority": 70,
    "is_featured": true
  },
  {
    "slug": "scrapingbee",
    "name": "ScrapingBee",
    "tagline": "Web scraping API with proxy rotation and JS rendering.",
    "description": "ScrapingBee simplifies web scraping by handling proxies, browser rendering, and bot protection. Useful for collecting directory data and monitoring competitor pages.",
    "category": "engineering",
    "sub_category": "scraping",
    "pricing_model": "paid",
    "website_url": "https://www.scrapingbee.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Proxy rotation", "JS rendering", "API-based scraping", "Anti-bot handling"],
    "use_cases": ["Data collection", "Directory scraping", "Competitive monitoring"],
    "pros": ["Developer-friendly", "Reliable scraping"],
    "cons": ["Paid", "Some sites still blocked"],
    "keywords": ["Scraping", "Automation", "Data Collection", "API"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },
  {
    "slug": "apify",
    "name": "Apify",
    "tagline": "Web scraping and automation platform with ready-made actors.",
    "description": "Apify provides scraping and automation tools with prebuilt scrapers (actors) and cloud execution. Great for scalable data pipelines.",
    "category": "engineering",
    "sub_category": "scraping",
    "pricing_model": "freemium",
    "website_url": "https://apify.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Actors library", "Cloud scraping", "Proxy support", "Scheduling"],
    "use_cases": ["Scraping automation", "Data pipelines", "Monitoring competitor sites"],
    "pros": ["Powerful ecosystem", "Many ready scrapers"],
    "cons": ["Complex at scale", "Paid for heavy usage"],
    "keywords": ["Scraping", "Automation", "Data Pipeline"],
    "schema_type": "SoftwareApplication",
    "priority": 60,
    "is_featured": false
  },
  {
    "slug": "octoparse",
    "name": "Octoparse",
    "tagline": "No-code web scraping tool for structured data extraction.",
    "description": "Octoparse enables non-technical scraping using a visual UI. Useful for collecting directory leads and competitor monitoring without coding.",
    "category": "engineering",
    "sub_category": "scraping",
    "pricing_model": "freemium",
    "website_url": "https://www.octoparse.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["No-code scraping", "Cloud extraction", "Templates", "Export to CSV"],
    "use_cases": ["Lead scraping", "Directory building", "Competitor research"],
    "pros": ["Easy for non-devs", "Templates available"],
    "cons": ["Some sites break extraction", "Paid for cloud usage"],
    "keywords": ["Scraping", "No-code", "Data Extraction"],
    "schema_type": "SoftwareApplication",
    "priority": 45,
    "is_featured": false
  },
  {
    "slug": "builtwith",
    "name": "BuiltWith",
    "tagline": "Technology profiling and competitor tech stack intelligence.",
    "description": "BuiltWith detects what technologies websites use. Useful for prospecting clients, competitor analysis, and identifying SaaS usage signals.",
    "category": "marketing",
    "sub_category": "competitive-research",
    "pricing_model": "paid",
    "website_url": "https://builtwith.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Tech stack lookup", "Lead lists", "Technology trends"],
    "use_cases": ["B2B prospecting", "Competitor tech analysis", "Market intelligence"],
    "pros": ["Great tech profiling", "Useful lead datasets"],
    "cons": ["Paid", "Some results not always accurate"],
    "keywords": ["Tech Stack", "Competitor Research", "B2B Leads"],
    "schema_type": "SoftwareApplication",
    "priority": 58,
    "is_featured": false
  },
  {
    "slug": "wappalyzer",
    "name": "Wappalyzer",
    "tagline": "Technology lookup tool for detecting web stacks.",
    "description": "Wappalyzer detects technologies used by websites. Useful for quick competitor stack discovery and outreach prospecting.",
    "category": "marketing",
    "sub_category": "competitive-research",
    "pricing_model": "freemium",
    "website_url": "https://www.wappalyzer.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Browser extension", "Tech stack detection", "API access (paid)"],
    "use_cases": ["Competitor research", "Prospecting", "Tech stack intelligence"],
    "pros": ["Fast and easy", "Good extension"],
    "cons": ["Some tech false positives"],
    "keywords": ["Tech Stack", "Detection", "Competitive Research"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },
  {
    "slug": "uptimerobot",
    "name": "UptimeRobot",
    "tagline": "Website uptime monitoring with alerts and status pages.",
    "description": "UptimeRobot monitors website uptime and sends alerts via email/SMS. Useful for operational reliability and SLA monitoring.",
    "category": "engineering",
    "sub_category": "monitoring",
    "pricing_model": "freemium",
    "website_url": "https://uptimerobot.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Uptime monitoring", "Alerts", "Status pages"],
    "use_cases": ["SLA monitoring", "Website uptime alerts", "Service reliability"],
    "pros": ["Simple setup", "Strong free tier"],
    "cons": ["Limited advanced monitoring"],
    "keywords": ["Monitoring", "Uptime", "Alerts"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },
  {
    "slug": "pingdom",
    "name": "Pingdom",
    "tagline": "Website uptime and performance monitoring platform.",
    "description": "Pingdom provides uptime and performance monitoring with alerting and reporting. Useful for enterprise operations and performance monitoring.",
    "category": "engineering",
    "sub_category": "monitoring",
    "pricing_model": "paid",
    "website_url": "https://www.pingdom.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Uptime monitoring", "Performance monitoring", "Alerting"],
    "use_cases": ["Enterprise monitoring", "Performance reporting", "SLA monitoring"],
    "pros": ["Reliable monitoring", "Good reporting"],
    "cons": ["Paid only", "Not as cheap as alternatives"],
    "keywords": ["Monitoring", "Performance", "Uptime"],
    "schema_type": "SoftwareApplication",
    "priority": 40,
    "is_featured": false
  },
  {
    "slug": "sentry",
    "name": "Sentry",
    "tagline": "Application error monitoring and performance tracking.",
    "description": "Sentry tracks runtime errors and performance issues across frontend and backend systems. Essential for production-grade engineering operations.",
    "category": "engineering",
    "sub_category": "monitoring",
    "pricing_model": "freemium",
    "website_url": "https://sentry.io",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Error tracking", "Performance monitoring", "Release tracking"],
    "use_cases": ["Bug monitoring", "Performance debugging", "Production reliability"],
    "pros": ["Very powerful monitoring", "Developer friendly"],
    "cons": ["Noise if not configured well", "Paid for heavy usage"],
    "keywords": ["Monitoring", "Error Tracking", "Performance", "DevOps"],
    "schema_type": "SoftwareApplication",
    "priority": 65,
    "is_featured": false
  },
  {
    "slug": "datadog",
    "name": "Datadog",
    "tagline": "Enterprise observability platform for monitoring infrastructure and apps.",
    "description": "Datadog provides enterprise observability with logs, metrics, APM, and monitoring. Best for high-scale production systems.",
    "category": "engineering",
    "sub_category": "monitoring",
    "pricing_model": "paid",
    "website_url": "https://www.datadoghq.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["APM", "Logs", "Infrastructure monitoring", "Dashboards", "Alerts"],
    "use_cases": ["Enterprise observability", "Infrastructure monitoring", "APM tracing"],
    "pros": ["Very powerful", "Strong dashboards"],
    "cons": ["Expensive", "Complex setup"],
    "keywords": ["Observability", "Monitoring", "APM", "Logs"],
    "schema_type": "SoftwareApplication",
    "priority": 42,
    "is_featured": false
  },
  {
    "slug": "mail-tester",
    "name": "Mail-Tester",
    "tagline": "Email deliverability testing tool for spam score checks.",
    "description": "Mail-Tester checks email deliverability and spam scoring. Useful for improving newsletter delivery and transactional email reliability.",
    "category": "marketing",
    "sub_category": "email-marketing",
    "pricing_model": "freemium",
    "website_url": "https://www.mail-tester.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Spam score test", "Deliverability analysis", "SMTP diagnostics"],
    "use_cases": ["Newsletter deliverability checks", "Email campaign QA"],
    "pros": ["Simple and useful", "Great deliverability signals"],
    "cons": ["Limited free tests"],
    "keywords": ["Email Deliverability", "Spam Score", "SMTP"],
    "schema_type": "SoftwareApplication",
    "priority": 52,
    "is_featured": false
  },
  {
    "slug": "mailgun",
    "name": "Mailgun",
    "tagline": "Transactional email API with deliverability features.",
    "description": "Mailgun provides transactional email sending with logs, deliverability insights, and routing. Useful for product emails and notifications.",
    "category": "marketing",
    "sub_category": "email-marketing",
    "pricing_model": "paid",
    "website_url": "https://www.mailgun.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Email API", "Deliverability tools", "Logs", "Routing"],
    "use_cases": ["Transactional email", "Notification system", "Email routing"],
    "pros": ["Reliable email delivery", "Good API"],
    "cons": ["Pricing can scale", "UI less modern than Resend"],
    "keywords": ["Email API", "SMTP", "Transactional"],
    "schema_type": "SoftwareApplication",
    "priority": 45,
    "is_featured": false
  },
  {
    "slug": "sendgrid",
    "name": "SendGrid",
    "tagline": "Email delivery platform for transactional and marketing emails.",
    "description": "SendGrid is a widely used email sending service for transactional and marketing emails. Supports templates and analytics.",
    "category": "marketing",
    "sub_category": "email-marketing",
    "pricing_model": "freemium",
    "website_url": "https://sendgrid.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Email API", "Templates", "Email analytics", "SMTP relay"],
    "use_cases": ["Transactional emails", "Marketing campaigns", "Email automation"],
    "pros": ["Popular and stable", "Good integrations"],
    "cons": ["Deliverability depends on setup", "UI can be complex"],
    "keywords": ["Email", "SMTP", "Transactional", "Marketing"],
    "schema_type": "SoftwareApplication",
    "priority": 48,
    "is_featured": false
  },
  {
    "slug": "linktree",
    "name": "Linktree",
    "tagline": "Link-in-bio landing page builder for creators and brands.",
    "description": "Linktree provides a simple landing page for multiple links. Useful for personal branding and social media conversion funnels.",
    "category": "marketing",
    "sub_category": "landing-pages",
    "pricing_model": "freemium",
    "website_url": "https://linktr.ee",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Link landing pages", "Analytics", "Custom themes"],
    "use_cases": ["Creator funnel", "Social bio conversion", "Quick landing page"],
    "pros": ["Easy setup", "Popular"],
    "cons": ["Limited customization", "Not SEO-focused"],
    "keywords": ["Landing Page", "Bio Link", "Creator"],
    "schema_type": "SoftwareApplication",
    "priority": 35,
    "is_featured": false
  },
  {
    "slug": "carrd",
    "name": "Carrd",
    "tagline": "Simple one-page website builder for landing pages.",
    "description": "Carrd is a lightweight website builder for creating landing pages quickly. Useful for MVP pages and simple funnels.",
    "category": "marketing",
    "sub_category": "landing-pages",
    "pricing_model": "freemium",
    "website_url": "https://carrd.co",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Landing page builder", "Templates", "Custom domains (paid)"],
    "use_cases": ["MVP landing pages", "Portfolio pages", "Lead capture pages"],
    "pros": ["Cheap and fast", "Clean designs"],
    "cons": ["Not for complex sites"],
    "keywords": ["Landing Page", "Website Builder", "MVP"],
    "schema_type": "SoftwareApplication",
    "priority": 50,
    "is_featured": false
  },
  {
    "slug": "unbounce",
    "name": "Unbounce",
    "tagline": "Landing page builder for conversion-focused marketing teams.",
    "description": "Unbounce provides landing page building and A/B testing tools. Useful for performance marketing teams optimizing conversion rates.",
    "category": "marketing",
    "sub_category": "landing-pages",
    "pricing_model": "paid",
    "website_url": "https://unbounce.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Landing page builder", "A/B testing", "Templates", "Conversion tools"],
    "use_cases": ["CRO landing pages", "Paid campaign funnels", "A/B testing"],
    "pros": ["Conversion-focused features", "Good templates"],
    "cons": ["Paid only", "Can be expensive"],
    "keywords": ["Landing Page", "CRO", "A/B Testing"],
    "schema_type": "SoftwareApplication",
    "priority": 45,
    "is_featured": false
  },
  {
    "slug": "optimizely",
    "name": "Optimizely",
    "tagline": "Enterprise experimentation and A/B testing platform.",
    "description": "Optimizely provides enterprise-grade experimentation, feature flags, and personalization. Best for teams running high-scale CRO experiments.",
    "category": "analytics",
    "sub_category": "experimentation",
    "pricing_model": "paid",
    "website_url": "https://www.optimizely.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["A/B testing", "Feature flags", "Personalization", "Experiment analytics"],
    "use_cases": ["Enterprise CRO experiments", "Product experimentation"],
    "pros": ["Enterprise-grade experimentation", "Strong analytics"],
    "cons": ["Expensive", "Complex setup"],
    "keywords": ["A/B Testing", "Experimentation", "CRO"],
    "schema_type": "SoftwareApplication",
    "priority": 35,
    "is_featured": false
  },
  {
    "slug": "vwo",
    "name": "VWO",
    "tagline": "A/B testing and conversion optimization platform.",
    "description": "VWO provides CRO tools including A/B testing, heatmaps, and conversion funnels. Useful for marketers optimizing landing page performance.",
    "category": "analytics",
    "sub_category": "experimentation",
    "pricing_model": "paid",
    "website_url": "https://vwo.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["A/B testing", "Heatmaps", "Funnels", "Session recordings"],
    "use_cases": ["CRO experiments", "Landing page optimization"],
    "pros": ["Strong CRO toolkit", "Good experimentation"],
    "cons": ["Paid only", "Implementation requires care"],
    "keywords": ["CRO", "A/B Testing", "Funnels"],
    "schema_type": "SoftwareApplication",
    "priority": 42,
    "is_featured": false
  },
  {
    "slug": "linkwhisper",
    "name": "Link Whisper",
    "tagline": "Internal linking automation plugin for WordPress SEO.",
    "description": "Link Whisper suggests internal links automatically for WordPress sites. Useful for improving site architecture and topical authority.",
    "category": "seo",
    "sub_category": "internal-linking",
    "pricing_model": "paid",
    "website_url": "https://linkwhisper.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Internal link suggestions", "Link reporting", "Anchor text management"],
    "use_cases": ["Internal linking optimization", "Topical authority building"],
    "pros": ["Saves time", "Useful for large WP sites"],
    "cons": ["WordPress only", "Paid"],
    "keywords": ["Internal Linking", "SEO", "WordPress"],
    "schema_type": "SoftwareApplication",
    "priority": 52,
    "is_featured": false
  },
  {
    "slug": "linkassistant",
    "name": "SEO PowerSuite (LinkAssistant)",
    "tagline": "Link building and outreach tool for SEO campaigns.",
    "description": "SEO PowerSuite includes LinkAssistant for managing outreach and backlink campaigns. Useful for off-page SEO planning and prospect management.",
    "category": "seo",
    "sub_category": "link-building",
    "pricing_model": "freemium",
    "website_url": "https://www.link-assistant.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Link prospecting", "Outreach management", "SEO audit suite"],
    "use_cases": ["Backlink outreach", "SEO campaign management"],
    "pros": ["All-in-one desktop suite", "Affordable compared to big SEO suites"],
    "cons": ["Desktop software", "UI feels outdated"],
    "keywords": ["Link Building", "SEO Outreach", "Backlinks"],
    "schema_type": "SoftwareApplication",
    "priority": 38,
    "is_featured": false
  },
  {
    "slug": "majestic",
    "name": "Majestic",
    "tagline": "Backlink intelligence platform focused on trust flow and citation flow.",
    "description": "Majestic provides backlink analysis with unique metrics like Trust Flow and Citation Flow. Useful for evaluating link quality and authority risk.",
    "category": "seo",
    "sub_category": "backlinks",
    "pricing_model": "paid",
    "website_url": "https://majestic.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Backlink analysis", "Trust Flow metrics", "Link graph exploration"],
    "use_cases": ["Backlink quality evaluation", "Link profile audits"],
    "pros": ["Unique authority metrics", "Good for link analysis"],
    "cons": ["UI feels old", "Not as broad as Ahrefs"],
    "keywords": ["Backlinks", "Trust Flow", "SEO"],
    "schema_type": "SoftwareApplication",
    "priority": 40,
    "is_featured": false
  },
  {
    "slug": "url-profiler",
    "name": "URL Profiler",
    "tagline": "Bulk URL analysis tool for SEO audits and link metrics aggregation.",
    "description": "URL Profiler analyzes large lists of URLs and aggregates SEO metrics from multiple sources. Useful for link audits and large-scale SEO operations.",
    "category": "seo",
    "sub_category": "technical-seo",
    "pricing_model": "paid",
    "website_url": "https://urlprofiler.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Bulk URL metrics", "Integrations", "SEO analysis exports"],
    "use_cases": ["Bulk SEO audits", "Link profile checks", "URL list evaluation"],
    "pros": ["Powerful bulk analysis", "Good for agencies"],
    "cons": ["Paid", "Not beginner-friendly"],
    "keywords": ["SEO Audit", "Bulk Analysis", "Technical SEO"],
    "schema_type": "SoftwareApplication",
    "priority": 32,
    "is_featured": false
  },
  {
    "slug": "koala-writer",
    "name": "KoalaWriter",
    "tagline": "AI writing tool optimized for SEO content generation.",
    "description": "KoalaWriter is designed for SEO-focused AI content generation, often used for scaling blog posts and affiliate content sites.",
    "category": "ai",
    "sub_category": "writing",
    "pricing_model": "paid",
    "website_url": "https://koala.sh",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["AI blog writing", "SEO formatting", "Outline generation"],
    "use_cases": ["SEO content scaling", "Affiliate content production"],
    "pros": ["Fast content generation", "SEO-friendly templates"],
    "cons": ["Requires editorial QA", "Risk of thin AI content if abused"],
    "keywords": ["AI Writing", "SEO Content", "Automation"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },
  {
    "slug": "wordpress",
    "name": "WordPress",
    "tagline": "CMS platform powering a large portion of the web.",
    "description": "WordPress is the most popular CMS for building websites, blogs, and business pages. Supports SEO plugins, themes, and content publishing workflows.",
    "category": "engineering",
    "sub_category": "cms",
    "pricing_model": "freemium",
    "website_url": "https://wordpress.org",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["CMS publishing", "Themes", "Plugins ecosystem", "SEO plugins support"],
    "use_cases": ["Blog publishing", "Business websites", "Content marketing"],
    "pros": ["Huge ecosystem", "Flexible", "SEO-friendly with plugins"],
    "cons": ["Maintenance overhead", "Security risks if unmanaged"],
    "keywords": ["CMS", "Blog", "Publishing", "SEO"],
    "schema_type": "SoftwareApplication",
    "priority": 60,
    "is_featured": false
  },
  {
    "slug": "webflow",
    "name": "Webflow",
    "tagline": "No-code website builder with CMS and design control.",
    "description": "Webflow enables design-driven websites with CMS features and hosting. Useful for premium landing pages and marketing sites.",
    "category": "engineering",
    "sub_category": "cms",
    "pricing_model": "paid",
    "website_url": "https://webflow.com",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Visual builder", "CMS", "Hosting", "SEO settings"],
    "use_cases": ["Marketing sites", "Landing pages", "Portfolio sites"],
    "pros": ["Great design flexibility", "Fast publishing workflow"],
    "cons": ["Paid", "Learning curve"],
    "keywords": ["No-code", "CMS", "Landing Pages", "Design"],
    "schema_type": "SoftwareApplication",
    "priority": 55,
    "is_featured": false
  },
  {
    "slug": "ghost",
    "name": "Ghost",
    "tagline": "Publishing platform built for newsletters and membership monetization.",
    "description": "Ghost is a modern publishing platform optimized for content creators, newsletters, and memberships. Useful for SEO publishing + monetization systems.",
    "category": "engineering",
    "sub_category": "cms",
    "pricing_model": "paid",
    "website_url": "https://ghost.org",
    "affiliate_url": null,
    "logo_url": null,
    "features": ["Publishing CMS", "Newsletter system", "Memberships", "SEO features"],
    "use_cases": ["Newsletter monetization", "Content publishing", "Membership sites"],
    "pros": ["Great publishing UX", "Built-in membership system"],
    "cons": ["Hosting cost", "Less plugin ecosystem than WordPress"],
    "keywords": ["CMS", "Newsletter", "Membership", "Publishing"],
    "schema_type": "SoftwareApplication",
    "priority": 50,
    "is_featured": false
  }
]
```

---

# ⚠️ Catatan Integrasi

* Batch 2 ini berisi **30 tools**.
* Total jika digabung dengan Batch 1 (±40 tools) akan jadi ±70 tools.
* Semua sudah sesuai taxonomy: `seo/marketing/ai/engineering/analytics/productivity/academic`.

---

# 🔥 Next Step (Optional tapi sangat disarankan)

Kalau kamu mau directory kamu jadi “uang banget”, kita tambah 3 kolom di tools table:

* `affiliate_network` (impact, partnerstack, direct, amazon, etc)
* `commission_model` (revshare, cpa, cpl)
* `best_for` (ecommerce/saas/agency/academic)

Ini bikin page kamu lebih “editorial” dan trust SEO naik.

---

Berikut **Tools Internal Linking Rules** yang bisa dipakai sebagai **aturan deterministik (non-AI)** untuk membangun internal linking loop:

**Tools ↔ Radar ↔ Solutions ↔ Services ↔ Case Studies**
Tujuannya: SEO topical graph kuat + conversion funnel natural.

---

# 1) CORE PRINCIPLE (RULE OF 3 LINKS)

Setiap halaman tool detail `/tools/[category]/[slug]` WAJIB punya minimal:

* **2 link ke tools lain** (alternatives / similar stack)
* **2 link ke solutions pages** (industry/problem)
* **2 link ke radar insights** (trend/news)
* **1 link ke services** (anchor sesuai mode)
* **1 link ke inquiry wizard** (prefilled)

Ini menciptakan “crawl loop” dan mengurangi risiko thin directory.

---

# 2) CANONICAL TAXONOMY MAPPING

Gunakan mapping kategori tool → mode → services anchor.

## Category → Mode → Services Anchor

* `seo` → `marketing` → `/services#digital-marketing`
* `marketing` → `marketing` → `/services#digital-marketing`
* `analytics` → `marketing` → `/services#digital-marketing`
* `ai` → `business` (default) → `/services#business`
* `engineering` → `business` → `/services#business`
* `productivity` → `business` → `/services#business`
* `academic` → `academic` → `/services#academic`

---

# 3) TOOL → SOLUTIONS LINKING RULES (HIGH PRECISION)

Implement function:

```ts
getSolutionLinksForTool(tool) -> Array<{industrySlug, problemSlug, confidence}>
```

## A) SEO Category Tools

Jika `tool.category = seo`:

### Default links:

* `/solutions/saas/programmatic-seo-architecture`
* `/solutions/ecommerce/weak-organic-authority`

Jika tool sub_category:

#### rank-tracking

* `/solutions/ecommerce/weak-organic-authority`
* `/solutions/saas/programmatic-seo-architecture`

#### backlinks / link-building

* `/solutions/saas/weak-authority-backlinks`
* `/solutions/corporate/brand-authority-fragmented`

#### technical-seo

* `/solutions/saas/programmatic-seo-architecture`
* `/solutions/ecommerce/landing-page-low-conversion`

#### internal-linking

* `/solutions/saas/programmatic-seo-architecture`
* `/solutions/ecommerce/weak-organic-authority`

---

## B) Marketing Category Tools

Jika `tool.category = marketing`:

### Default links:

* `/solutions/ecommerce/high-cac-low-roas`
* `/solutions/health-beauty/campaign-scaling-instability`

Jika sub_category:

#### email-marketing

* `/solutions/saas/low-signup-conversion`
* `/solutions/ecommerce/high-cac-low-roas`

#### landing-pages

* `/solutions/ecommerce/landing-page-low-conversion`
* `/solutions/saas/low-signup-conversion`

#### competitive-research

* `/solutions/corporate/brand-authority-fragmented`
* `/solutions/saas/programmatic-seo-architecture`

---

## C) Analytics Category Tools

Jika `tool.category = analytics`:

### Default links:

* `/solutions/saas/low-signup-conversion`
* `/solutions/corporate/messy-reporting-no-kpi`

Jika sub_category:

#### tracking

* `/solutions/ecommerce/landing-page-low-conversion`
* `/solutions/saas/low-signup-conversion`

#### product-analytics

* `/solutions/saas/low-signup-conversion`
* `/solutions/ecommerce/high-cac-low-roas`

#### experimentation

* `/solutions/ecommerce/landing-page-low-conversion`
* `/solutions/saas/low-signup-conversion`

---

## D) Engineering Category Tools

Jika `tool.category = engineering`:

### Default links:

* `/solutions/saas/programmatic-seo-architecture`
* `/solutions/corporate/documentation-sop-needed`

Jika sub_category:

#### scraping

* `/solutions/saas/programmatic-seo-architecture`
* `/solutions/corporate/messy-reporting-no-kpi`

#### monitoring

* `/solutions/corporate/messy-reporting-no-kpi`
* `/solutions/saas/low-signup-conversion`

#### cms

* `/solutions/saas/programmatic-seo-architecture`
* `/solutions/ecommerce/weak-organic-authority`

---

## E) AI Category Tools

Jika `tool.category = ai`:

### Default links:

* `/solutions/saas/programmatic-seo-architecture`
* `/solutions/corporate/brand-authority-fragmented`

Jika sub_category:

#### writing

* `/solutions/ecommerce/weak-organic-authority`
* `/solutions/saas/programmatic-seo-architecture`

#### automation

* `/solutions/corporate/messy-reporting-no-kpi`
* `/solutions/saas/low-signup-conversion`

---

## F) Academic Category Tools

Jika `tool.category = academic`:

### Default links:

* `/solutions/education/citation-and-writing-system`
* `/solutions/education/research-methodology-confusion`

---

# 4) TOOL → RADAR LINKING RULES

Implement:

```ts
getRadarTagsForTool(tool) -> string[]
```

Gunakan keyword matching:

## Category → Radar Tags

* seo → ["SEO", "Google", "Core Update", "SERP", "Backlinks"]
* marketing → ["Marketing", "Ads", "TikTok", "Meta", "Conversion"]
* analytics → ["GA4", "Tracking", "Attribution", "Funnels"]
* engineering → ["DevOps", "Next.js", "Performance", "APIs"]
* ai → ["AI", "LLM", "Automation", "Agents"]
* productivity → ["Productivity", "Workflow", "Automation"]
* academic → ["Academic", "Citation", "Research", "Journal"]

Then query Supabase:

* latest 5 radar_items WHERE tags overlap these tags.

---

# 5) TOOL → TOOL (ALTERNATIVES + COMPLEMENTARY STACK)

Implement:

```ts
getAlternativeTools(tool) -> Tool[]
getComplementaryTools(tool) -> Tool[]
```

## A) Alternative Tools

Rules:

* same category
* same pricing_model if possible
* exclude current slug
* prioritize:

  * is_featured
  * sponsored active
  * priority score

Example:
Ahrefs alternatives → Semrush, Moz, Majestic

---

## B) Complementary Tools (Stack Builder)

Complementary means cross-category synergy:

### If tool.category = seo:

complements:

* analytics (GA4, GTM)
* marketing (Hotjar, Unbounce)

### If tool.category = marketing:

complements:

* seo (Ahrefs, GSC)
* analytics (Mixpanel, GA4)

### If tool.category = engineering:

complements:

* seo (SerpApi)
* analytics (Sentry)

### If tool.category = ai:

complements:

* seo (SurferSEO, Keyword Insights)
* engineering (n8n, Zapier)

### If tool.category = academic:

complements:

* productivity (Notion)
* ai (ChatGPT / Gemini)

Query DB accordingly.

---

# 6) TOOL PAGE REQUIRED SECTIONS (WITH LINK INSERTION)

Pada `/tools/[category]/[slug]`, susun section:

## A) “Best Use Cases”

→ internal link to relevant solutions pages.

Example:
“Best for Programmatic SEO teams”
link: `/solutions/saas/programmatic-seo-architecture`

---

## B) “Recommended Execution”

Render 3-step mini guide:

* Setup
* Tracking
* Scaling

Each step can reference:

* 1 solution page
* 1 service CTA

---

## C) “Related Radar Insights”

Render 5 radar cards filtered by tags.

---

## D) “Alternatives”

Render 4–6 tools (same category).

---

## E) “Stack Pairing”

Render 4 complementary tools (cross-category).

---

## F) “Need Implementation Help?”

CTA box linking Inquiry Wizard prefilled with:

* tool name
* category
* page url
* recommended solution

---

# 7) LINK PRIORITY RULES (SPONSORED WITHOUT LOOKING SPAMMY)

Sponsored tools should be promoted but not ruin trust.

## Display rule:

* sponsored tools max 2 in “Alternatives”
* sponsored tools max 1 in “Stack Pairing”
* always label “Sponsored”
* always nofollow external link

Internal links remain follow.

---

# 8) SEO SAFETY RULES (ANTI LINK FARM)

## A) External outbound links

Always:

`rel="nofollow sponsored noopener noreferrer"`

If affiliate_url exists, add `sponsored`.

## B) Internal links

Keep follow default.

## C) Canonical

Tool page canonical must be itself.

## D) Avoid duplicate content

Tool description should include editorial analysis section (why it matters + best for).

---

# 9) PROGRAMMATIC RULESET: TOOL → SERVICES CTA

Implement:

```ts
getServiceCtaForTool(tool) -> { label: string; href: string; mode: Mode }
```

Rules:

* seo/marketing/analytics → label “Request Growth Blueprint” → `/services#digital-marketing`
* engineering/ai/productivity → label “Request System Implementation” → `/services#business`
* academic → label “Request Academic Guidance” → `/services#academic`

---

# 10) TOOL → CASE STUDY LINKING RULES

Implement:

```ts
getCaseStudiesForTool(tool) -> CaseStudy[]
```

Rules:

* if tool.category = seo → show Vidio.com SEO case study
* if marketing → show Skintific budgeting case study
* if academic → show academic visualization case study
* if engineering → show “system architecture” case study (if exists)

Fallback: show top 2 featured case studies.

---

# 11) “SMART CONTEXT” PREFILL FOR INQUIRY WIZARD

When user clicks CTA on tool page:

Prefill message:

* Tool: {tool.name}
* Category: {tool.category}
* Use case: {tool.use_cases[0]}
* Suggested solution: {industry/problem}
* Visitor intent: “Need implementation”

Send to InquiryWizard via query params:

`/services?intent=tool-setup&tool={slug}&category={category}&solution={industry}/{problem}`

Wizard reads params and pre-fills goal/challenge.

---

# 12) RECOMMENDED IMPLEMENTATION FILES

Create:

* `src/lib/tools/internal-linking.ts`
* `src/lib/tools/relations.ts`
* `src/lib/tools/service-cta.ts`

Exports:

* `getSolutionLinksForTool(tool)`
* `getRadarTagsForTool(tool)`
* `getAlternativeTools(tool, allTools)`
* `getComplementaryTools(tool, allTools)`
* `getServiceCtaForTool(tool)`
* `getCaseStudiesForTool(tool, caseStudies)`

---

# 13) OUTPUT RULES (UI COMPONENT EXPECTATIONS)

Tool detail page should render modules:

* `<ToolHero />`
* `<ToolWhyItMatters />`
* `<ToolUseCases />`
* `<ToolRecommendedSolutions />`  ✅ internal links
* `<ToolRelatedRadar />`          ✅ internal links
* `<ToolAlternatives />`          ✅ internal links
* `<ToolStackPairing />`          ✅ internal links
* `<ToolCTAInquiry />`            ✅ lead capture

---

# 14) EXAMPLE MAPPING (REAL EXAMPLES)

## SerpApi

Category: engineering/scraping
Links:

* `/solutions/saas/programmatic-seo-architecture`
* `/solutions/corporate/messy-reporting-no-kpi`

Radar tags:

* SEO, SERP, APIs, Automation

Alternatives:

* ScrapingBee, Apify, Octoparse

Stack pairing:

* Ahrefs (SEO)
* GA4 (analytics)
* GTM (analytics)
* n8n (automation)

---

## Hotjar

Category: analytics/behavior
Links:

* `/solutions/ecommerce/landing-page-low-conversion`
* `/solutions/saas/low-signup-conversion`

Radar tags:

* Conversion, UX, Funnels

---

# 15) MINIMUM GUARANTEE RULE (CRITICAL)

If mapping confidence < 60:
Fallback solutions links must be:

* `/solutions/saas/low-signup-conversion`
* `/solutions/ecommerce/landing-page-low-conversion`

This prevents empty related links.

---

Berikut **RSS Sources List yang presisi (SEO / AI / Engineering)** untuk Radar kamu, lengkap dengan **priority scoring**, kategori, dan rekomendasi pemakaian. Ini disusun supaya:

* **valid & stabil** (RSS benar-benar ada / feed jelas)
* **relevan untuk growth hacking**
* tidak jadi “noise”
* cocok untuk **Discover + authority building**
* mudah dipakai untuk **signal scoring**

Format ini cocok langsung dijadikan `data/radar-sources.seed.json`.

---

# ✅ Radar RSS Sources Seed (High Precision)

> Skor `priority` 1–100 (semakin tinggi semakin penting/berkualitas).
> `type`: `seo | ai | engineering | product | security | marketing`
> `tier`: `tier1` (core), `tier2` (support), `tier3` (experimental)

```json
[
  {
    "slug": "google-search-central",
    "name": "Google Search Central Blog",
    "url": "https://developers.google.com/search/blog/rss.xml",
    "site_url": "https://developers.google.com/search/blog",
    "type": "seo",
    "tier": "tier1",
    "priority": 100,
    "language": "en",
    "country": "global",
    "notes": "Highest authority for SEO updates. Critical for core updates, indexing changes."
  },
  {
    "slug": "google-ads-blog",
    "name": "Google Ads Blog",
    "url": "https://blog.google/products/ads/rss/",
    "site_url": "https://blog.google/products/ads/",
    "type": "marketing",
    "tier": "tier1",
    "priority": 88,
    "language": "en",
    "country": "global",
    "notes": "Important for Ads ecosystem changes."
  },
  {
    "slug": "google-cloud-blog",
    "name": "Google Cloud Blog",
    "url": "https://cloudblog.withgoogle.com/rss/",
    "site_url": "https://cloud.google.com/blog",
    "type": "engineering",
    "tier": "tier1",
    "priority": 86,
    "language": "en",
    "country": "global",
    "notes": "Infrastructure and cloud engineering signals."
  },
  {
    "slug": "openai-blog",
    "name": "OpenAI Blog",
    "url": "https://openai.com/blog/rss.xml",
    "site_url": "https://openai.com/blog",
    "type": "ai",
    "tier": "tier1",
    "priority": 98,
    "language": "en",
    "country": "global",
    "notes": "LLM model updates, platform releases."
  },
  {
    "slug": "anthropic-news",
    "name": "Anthropic News",
    "url": "https://www.anthropic.com/news/rss.xml",
    "site_url": "https://www.anthropic.com/news",
    "type": "ai",
    "tier": "tier1",
    "priority": 90,
    "language": "en",
    "country": "global",
    "notes": "Claude releases and alignment research."
  },
  {
    "slug": "deepmind-blog",
    "name": "Google DeepMind Blog",
    "url": "https://deepmind.google/discover/blog/rss.xml",
    "site_url": "https://deepmind.google/discover/blog/",
    "type": "ai",
    "tier": "tier1",
    "priority": 85,
    "language": "en",
    "country": "global",
    "notes": "Research-heavy but strong authority."
  },
  {
    "slug": "cloudflare-blog",
    "name": "Cloudflare Blog",
    "url": "https://blog.cloudflare.com/rss/",
    "site_url": "https://blog.cloudflare.com",
    "type": "engineering",
    "tier": "tier1",
    "priority": 92,
    "language": "en",
    "country": "global",
    "notes": "Edge, security, performance, CDN signals."
  },
  {
    "slug": "vercel-blog",
    "name": "Vercel Blog",
    "url": "https://vercel.com/blog/rss.xml",
    "site_url": "https://vercel.com/blog",
    "type": "engineering",
    "tier": "tier1",
    "priority": 85,
    "language": "en",
    "country": "global",
    "notes": "Next.js ecosystem + performance updates."
  },
  {
    "slug": "github-blog",
    "name": "GitHub Blog",
    "url": "https://github.blog/feed/",
    "site_url": "https://github.blog",
    "type": "engineering",
    "tier": "tier1",
    "priority": 80,
    "language": "en",
    "country": "global",
    "notes": "Developer ecosystem + Copilot signals."
  },
  {
    "slug": "aws-news-blog",
    "name": "AWS News Blog",
    "url": "https://aws.amazon.com/blogs/aws/feed/",
    "site_url": "https://aws.amazon.com/blogs/aws/",
    "type": "engineering",
    "tier": "tier1",
    "priority": 83,
    "language": "en",
    "country": "global",
    "notes": "Major infrastructure and cloud platform updates."
  },

  {
    "slug": "moz-blog",
    "name": "Moz Blog",
    "url": "https://moz.com/blog/feed",
    "site_url": "https://moz.com/blog",
    "type": "seo",
    "tier": "tier1",
    "priority": 82,
    "language": "en",
    "country": "global",
    "notes": "SEO insights, research, and algorithm discussions."
  },
  {
    "slug": "search-engine-land",
    "name": "Search Engine Land",
    "url": "https://searchengineland.com/feed",
    "site_url": "https://searchengineland.com",
    "type": "seo",
    "tier": "tier1",
    "priority": 90,
    "language": "en",
    "country": "global",
    "notes": "High-frequency SEO news + Google updates."
  },
  {
    "slug": "search-engine-journal",
    "name": "Search Engine Journal",
    "url": "https://www.searchenginejournal.com/feed/",
    "site_url": "https://www.searchenginejournal.com",
    "type": "seo",
    "tier": "tier1",
    "priority": 88,
    "language": "en",
    "country": "global",
    "notes": "Strong SEO coverage. Some posts are broad; use scoring filters."
  },
  {
    "slug": "ahrefs-blog",
    "name": "Ahrefs Blog",
    "url": "https://ahrefs.com/blog/feed/",
    "site_url": "https://ahrefs.com/blog",
    "type": "seo",
    "tier": "tier1",
    "priority": 85,
    "language": "en",
    "country": "global",
    "notes": "Strong SEO research and actionable tactics."
  },
  {
    "slug": "semrush-blog",
    "name": "Semrush Blog",
    "url": "https://www.semrush.com/blog/rss/",
    "site_url": "https://www.semrush.com/blog/",
    "type": "seo",
    "tier": "tier2",
    "priority": 70,
    "language": "en",
    "country": "global",
    "notes": "High volume; filter aggressively."
  },

  {
    "slug": "search-engine-roundtable",
    "name": "Search Engine Roundtable",
    "url": "https://www.seroundtable.com/index.xml",
    "site_url": "https://www.seroundtable.com",
    "type": "seo",
    "tier": "tier1",
    "priority": 84,
    "language": "en",
    "country": "global",
    "notes": "Very good for early signals and SERP volatility."
  },
  {
    "slug": "seo-by-the-sea",
    "name": "SEO by the Sea",
    "url": "https://www.seobythesea.com/feed/",
    "site_url": "https://www.seobythesea.com",
    "type": "seo",
    "tier": "tier2",
    "priority": 68,
    "language": "en",
    "country": "global",
    "notes": "Patent analysis and deeper SEO insights."
  },

  {
    "slug": "backlinko-blog",
    "name": "Backlinko Blog",
    "url": "https://backlinko.com/feed",
    "site_url": "https://backlinko.com",
    "type": "seo",
    "tier": "tier2",
    "priority": 65,
    "language": "en",
    "country": "global",
    "notes": "Less frequent but high quality evergreen SEO."
  },

  {
    "slug": "hubspot-marketing",
    "name": "HubSpot Marketing Blog",
    "url": "https://blog.hubspot.com/marketing/rss.xml",
    "site_url": "https://blog.hubspot.com/marketing",
    "type": "marketing",
    "tier": "tier2",
    "priority": 60,
    "language": "en",
    "country": "global",
    "notes": "Broad marketing; use only high scoring posts."
  },

  {
    "slug": "stripe-blog",
    "name": "Stripe Blog",
    "url": "https://stripe.com/blog/rss",
    "site_url": "https://stripe.com/blog",
    "type": "engineering",
    "tier": "tier2",
    "priority": 72,
    "language": "en",
    "country": "global",
    "notes": "Engineering + business infrastructure insights."
  },
  {
    "slug": "netflix-techblog",
    "name": "Netflix TechBlog",
    "url": "https://netflixtechblog.com/feed",
    "site_url": "https://netflixtechblog.com",
    "type": "engineering",
    "tier": "tier2",
    "priority": 70,
    "language": "en",
    "country": "global",
    "notes": "High quality engineering deep dives."
  },
  {
    "slug": "uber-engineering",
    "name": "Uber Engineering Blog",
    "url": "https://www.uber.com/blog/engineering/rss/",
    "site_url": "https://www.uber.com/blog/engineering/",
    "type": "engineering",
    "tier": "tier2",
    "priority": 68,
    "language": "en",
    "country": "global",
    "notes": "Good architecture scaling insights."
  },

  {
    "slug": "microsoft-devblogs",
    "name": "Microsoft DevBlogs",
    "url": "https://devblogs.microsoft.com/feed/",
    "site_url": "https://devblogs.microsoft.com",
    "type": "engineering",
    "tier": "tier2",
    "priority": 75,
    "language": "en",
    "country": "global",
    "notes": ".NET, cloud, AI tooling. Useful engineering signals."
  },
  {
    "slug": "kubernetes-blog",
    "name": "Kubernetes Blog",
    "url": "https://kubernetes.io/feed.xml",
    "site_url": "https://kubernetes.io/blog/",
    "type": "engineering",
    "tier": "tier2",
    "priority": 65,
    "language": "en",
    "country": "global",
    "notes": "Container ecosystem updates."
  },

  {
    "slug": "elastic-blog",
    "name": "Elastic Blog",
    "url": "https://www.elastic.co/blog/feed",
    "site_url": "https://www.elastic.co/blog",
    "type": "engineering",
    "tier": "tier3",
    "priority": 55,
    "language": "en",
    "country": "global",
    "notes": "Search infrastructure, logging, observability."
  },

  {
    "slug": "huggingface-blog",
    "name": "Hugging Face Blog",
    "url": "https://huggingface.co/blog/feed.xml",
    "site_url": "https://huggingface.co/blog",
    "type": "ai",
    "tier": "tier2",
    "priority": 78,
    "language": "en",
    "country": "global",
    "notes": "Open-source AI ecosystem updates."
  },
  {
    "slug": "pytorch-blog",
    "name": "PyTorch Blog",
    "url": "https://pytorch.org/feed.xml",
    "site_url": "https://pytorch.org/blog/",
    "type": "ai",
    "tier": "tier3",
    "priority": 55,
    "language": "en",
    "country": "global",
    "notes": "ML framework updates."
  },

  {
    "slug": "nvidia-blog-ai",
    "name": "NVIDIA AI Blog",
    "url": "https://blogs.nvidia.com/blog/category/deep-learning/feed/",
    "site_url": "https://blogs.nvidia.com/blog/category/deep-learning/",
    "type": "ai",
    "tier": "tier2",
    "priority": 70,
    "language": "en",
    "country": "global",
    "notes": "AI hardware/software trends."
  },

  {
    "slug": "security-cloudflare",
    "name": "Cloudflare Security Blog",
    "url": "https://blog.cloudflare.com/tag/security/rss/",
    "site_url": "https://blog.cloudflare.com/tag/security/",
    "type": "security",
    "tier": "tier2",
    "priority": 65,
    "language": "en",
    "country": "global",
    "notes": "Security signals relevant for enterprise engineering."
  },

  {
    "slug": "hacker-news-frontpage",
    "name": "Hacker News Frontpage",
    "url": "https://hnrss.org/frontpage",
    "site_url": "https://news.ycombinator.com",
    "type": "engineering",
    "tier": "tier3",
    "priority": 50,
    "language": "en",
    "country": "global",
    "notes": "Noisy but good for early signals. Must use strict scoring filters."
  },
  {
    "slug": "product-hunt",
    "name": "Product Hunt",
    "url": "https://www.producthunt.com/feed",
    "site_url": "https://www.producthunt.com",
    "type": "product",
    "tier": "tier3",
    "priority": 48,
    "language": "en",
    "country": "global",
    "notes": "Useful for tools discovery, but noisy. Score only AI/SEO/Dev tools."
  }
]
```

---

# 🔥 Priority Scoring System (Radar Item Score)

Sekarang bagian paling penting: **scoring engine** untuk menentukan item mana yang featured, mana yang masuk digest.

## A) Source Priority Weight

Gunakan:
`source.priority` sebagai base score.

---

## B) Keyword Boost Rules (Very Effective)

Tambahkan score berdasarkan keyword di title/summary.

### SEO keywords (+15 each, max +40)

* "core update"
* "helpful content"
* "spam update"
* "ranking"
* "indexing"
* "search console"
* "serp volatility"
* "backlink"

### AI keywords (+12 each, max +35)

* "model"
* "release"
* "agents"
* "multimodal"
* "gemini"
* "claude"
* "openai"
* "api pricing"
* "context window"

### Engineering keywords (+10 each, max +30)

* "security"
* "incident"
* "outage"
* "performance"
* "latency"
* "next.js"
* "vercel"
* "edge"
* "kubernetes"

---

## C) Freshness Boost (Discover Optimization)

Ini wajib.

```txt
published < 12 hours → +30
published < 24 hours → +25
published < 48 hours → +18
published < 7 days   → +10
else                 → +0
```

---

## D) Title Quality Boost (CTR Predictor)

* title length 40–80 chars → +8
* title contains number (“10”, “2026”, “3 ways”) → +5
* title contains strong trigger words:

  * "breaking", "update", "new", "launch", "announced", "official" → +7

---

## E) Noise Penalty (Anti spam)

Kurangi jika terlalu umum:

* contains "weekly roundup" → -15
* contains "podcast" → -10
* contains "webinar" → -10
* contains "sponsored" → -20
* summary too short (<120 chars) → -10

---

## F) Final Score

`signal_score = clamp(source_priority + boosts - penalties, 0, 100)`

Rule:

* `signal_score >= 80` → auto featured candidate
* `signal_score >= 65` → include in homepage feed
* `signal_score < 50` → store but not display (archive only)

---

# 🧠 Tagging Rules (Deterministic + AI Optional)

Untuk setiap item radar:

## Tag assignment based on keyword detection

* contains "core update" → tags include ["SEO", "Google", "Core Update"]
* contains "vercel" or "next.js" → ["Engineering", "Next.js", "Performance"]
* contains "openai" → ["AI", "OpenAI", "LLM"]
* contains "anthropic" → ["AI", "Claude", "LLM"]
* contains "cloudflare" → ["Engineering", "Security", "Performance"]
* contains "rank tracking" → ["SEO", "SERP"]

Ini wajib sebelum AI enrichment, agar fallback tetap bagus.

---

# 🎯 “Curated Radar” Rules (Agar Radar Terasa Premium)

Radar kamu harus kelihatan seperti *strategic newsroom*, bukan RSS.

## A) Max items per source per day

Batasi:

* tier1: max 6/day
* tier2: max 4/day
* tier3: max 2/day

Ini mencegah SearchEngineJournal mendominasi feed.

---

## B) Diversity Enforcement

Jika 10 item teratas, minimal harus ada:

* 3 SEO
* 3 AI
* 3 Engineering
* 1 wildcard

---

# 🔥 Recommended “Radar Focus Feeds”

Untuk mode-aware UX:

## Marketing Mode feed bias

* Search Engine Land
* Search Engine Journal
* Moz
* Google Ads
* Ahrefs

## Business/Engineering Mode feed bias

* Cloudflare
* Vercel
* AWS
* Stripe
* GitHub

## AI Mode feed bias

* OpenAI
* Anthropic
* DeepMind
* HuggingFace
* NVIDIA AI

---

# ⭐ Best Practice: Source Whitelist vs Blacklist

Jangan kebanyakan sumber.

**Ideal sources total:** 20–35
Kalau lebih dari itu, Radar jadi noise dan user trust turun.

---

Berikut **FINAL ULTIMATE PACKAGE** untuk fase Radar Sources:
✅ `data/radar-sources.seed.json` (final curated list)
✅ Scoring engine blueprint `src/lib/radar/scoring.ts`
✅ Tagging rules `src/lib/radar/tagging.ts`
✅ Diversity + daily cap rules
✅ Source-tier system siap produksi

Ini format yang bisa langsung kamu masukkan ke repo.

---

# 1) `data/radar-sources.seed.json` (FINAL ULTIMATE CURATED)

> Total 30 sumber (sweet spot).
> Tier1 = authority (paling dipercaya)
> Tier2 = high quality (support)
> Tier3 = noisy but early signals (harus ketat scoring)

```json
[
  {
    "slug": "google-search-central",
    "name": "Google Search Central Blog",
    "url": "https://developers.google.com/search/blog/rss.xml",
    "site_url": "https://developers.google.com/search/blog",
    "type": "seo",
    "tier": "tier1",
    "priority": 100,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 6,
    "notes": "Primary source for Google search changes."
  },
  {
    "slug": "google-ads-blog",
    "name": "Google Ads Blog",
    "url": "https://blog.google/products/ads/rss/",
    "site_url": "https://blog.google/products/ads/",
    "type": "marketing",
    "tier": "tier1",
    "priority": 88,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "Ads ecosystem updates."
  },
  {
    "slug": "google-cloud-blog",
    "name": "Google Cloud Blog",
    "url": "https://cloudblog.withgoogle.com/rss/",
    "site_url": "https://cloud.google.com/blog",
    "type": "engineering",
    "tier": "tier1",
    "priority": 86,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "Cloud + infra engineering signals."
  },
  {
    "slug": "openai-blog",
    "name": "OpenAI Blog",
    "url": "https://openai.com/blog/rss.xml",
    "site_url": "https://openai.com/blog",
    "type": "ai",
    "tier": "tier1",
    "priority": 98,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "Model updates, API changes, platform releases."
  },
  {
    "slug": "anthropic-news",
    "name": "Anthropic News",
    "url": "https://www.anthropic.com/news/rss.xml",
    "site_url": "https://www.anthropic.com/news",
    "type": "ai",
    "tier": "tier1",
    "priority": 92,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "Claude updates + safety research."
  },
  {
    "slug": "deepmind-blog",
    "name": "Google DeepMind Blog",
    "url": "https://deepmind.google/discover/blog/rss.xml",
    "site_url": "https://deepmind.google/discover/blog/",
    "type": "ai",
    "tier": "tier1",
    "priority": 85,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 3,
    "notes": "High-authority research announcements."
  },
  {
    "slug": "cloudflare-blog",
    "name": "Cloudflare Blog",
    "url": "https://blog.cloudflare.com/rss/",
    "site_url": "https://blog.cloudflare.com",
    "type": "engineering",
    "tier": "tier1",
    "priority": 94,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 6,
    "notes": "Performance, security, edge infrastructure."
  },
  {
    "slug": "vercel-blog",
    "name": "Vercel Blog",
    "url": "https://vercel.com/blog/rss.xml",
    "site_url": "https://vercel.com/blog",
    "type": "engineering",
    "tier": "tier1",
    "priority": 86,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "Next.js ecosystem + web performance signals."
  },
  {
    "slug": "nextjs-blog",
    "name": "Next.js Blog",
    "url": "https://nextjs.org/feed.xml",
    "site_url": "https://nextjs.org/blog",
    "type": "engineering",
    "tier": "tier1",
    "priority": 84,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 3,
    "notes": "Core framework updates."
  },
  {
    "slug": "github-blog",
    "name": "GitHub Blog",
    "url": "https://github.blog/feed/",
    "site_url": "https://github.blog",
    "type": "engineering",
    "tier": "tier1",
    "priority": 80,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "Developer ecosystem + Copilot."
  },
  {
    "slug": "aws-news-blog",
    "name": "AWS News Blog",
    "url": "https://aws.amazon.com/blogs/aws/feed/",
    "site_url": "https://aws.amazon.com/blogs/aws/",
    "type": "engineering",
    "tier": "tier1",
    "priority": 83,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 6,
    "notes": "Cloud platform releases."
  },

  {
    "slug": "search-engine-land",
    "name": "Search Engine Land",
    "url": "https://searchengineland.com/feed",
    "site_url": "https://searchengineland.com",
    "type": "seo",
    "tier": "tier1",
    "priority": 90,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 6,
    "notes": "High-frequency SEO news. Needs scoring filters."
  },
  {
    "slug": "search-engine-roundtable",
    "name": "Search Engine Roundtable",
    "url": "https://www.seroundtable.com/index.xml",
    "site_url": "https://www.seroundtable.com",
    "type": "seo",
    "tier": "tier1",
    "priority": 86,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 6,
    "notes": "Best for SERP volatility and early ranking signals."
  },
  {
    "slug": "search-engine-journal",
    "name": "Search Engine Journal",
    "url": "https://www.searchenginejournal.com/feed/",
    "site_url": "https://www.searchenginejournal.com",
    "type": "seo",
    "tier": "tier2",
    "priority": 82,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "High volume; keep strict scoring."
  },
  {
    "slug": "moz-blog",
    "name": "Moz Blog",
    "url": "https://moz.com/blog/feed",
    "site_url": "https://moz.com/blog",
    "type": "seo",
    "tier": "tier2",
    "priority": 80,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "SEO research and industry analysis."
  },
  {
    "slug": "ahrefs-blog",
    "name": "Ahrefs Blog",
    "url": "https://ahrefs.com/blog/feed/",
    "site_url": "https://ahrefs.com/blog",
    "type": "seo",
    "tier": "tier2",
    "priority": 78,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 3,
    "notes": "High quality SEO tactics + research."
  },
  {
    "slug": "semrush-blog",
    "name": "Semrush Blog",
    "url": "https://www.semrush.com/blog/rss/",
    "site_url": "https://www.semrush.com/blog/",
    "type": "seo",
    "tier": "tier3",
    "priority": 65,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 2,
    "notes": "Noisy. Use strict scoring and dedup."
  },

  {
    "slug": "huggingface-blog",
    "name": "Hugging Face Blog",
    "url": "https://huggingface.co/blog/feed.xml",
    "site_url": "https://huggingface.co/blog",
    "type": "ai",
    "tier": "tier2",
    "priority": 80,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "Open-source AI tooling and model ecosystem."
  },
  {
    "slug": "nvidia-ai-blog",
    "name": "NVIDIA AI Blog",
    "url": "https://blogs.nvidia.com/blog/category/deep-learning/feed/",
    "site_url": "https://blogs.nvidia.com/blog/category/deep-learning/",
    "type": "ai",
    "tier": "tier2",
    "priority": 72,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 3,
    "notes": "AI infra trends."
  },
  {
    "slug": "microsoft-devblogs",
    "name": "Microsoft DevBlogs",
    "url": "https://devblogs.microsoft.com/feed/",
    "site_url": "https://devblogs.microsoft.com",
    "type": "engineering",
    "tier": "tier2",
    "priority": 75,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 4,
    "notes": "Developer ecosystem signals."
  },
  {
    "slug": "netflix-techblog",
    "name": "Netflix TechBlog",
    "url": "https://netflixtechblog.com/feed",
    "site_url": "https://netflixtechblog.com",
    "type": "engineering",
    "tier": "tier2",
    "priority": 72,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 3,
    "notes": "Engineering deep dives."
  },
  {
    "slug": "stripe-blog",
    "name": "Stripe Blog",
    "url": "https://stripe.com/blog/rss",
    "site_url": "https://stripe.com/blog",
    "type": "engineering",
    "tier": "tier2",
    "priority": 74,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 3,
    "notes": "Payments infra + SaaS growth engineering."
  },

  {
    "slug": "kubernetes-blog",
    "name": "Kubernetes Blog",
    "url": "https://kubernetes.io/feed.xml",
    "site_url": "https://kubernetes.io/blog/",
    "type": "engineering",
    "tier": "tier3",
    "priority": 60,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 2,
    "notes": "Infrastructure updates."
  },
  {
    "slug": "elastic-blog",
    "name": "Elastic Blog",
    "url": "https://www.elastic.co/blog/feed",
    "site_url": "https://www.elastic.co/blog",
    "type": "engineering",
    "tier": "tier3",
    "priority": 58,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 2,
    "notes": "Search/logging/observability trends."
  },

  {
    "slug": "hacker-news-frontpage",
    "name": "Hacker News Frontpage",
    "url": "https://hnrss.org/frontpage",
    "site_url": "https://news.ycombinator.com",
    "type": "engineering",
    "tier": "tier3",
    "priority": 50,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 2,
    "notes": "Noisy. Strict scoring only."
  },
  {
    "slug": "product-hunt",
    "name": "Product Hunt",
    "url": "https://www.producthunt.com/feed",
    "site_url": "https://www.producthunt.com",
    "type": "product",
    "tier": "tier3",
    "priority": 48,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 2,
    "notes": "Noisy. Only allow AI/SEO/dev tool tags."
  },

  {
    "slug": "google-ai-blog",
    "name": "Google AI Blog",
    "url": "https://ai.googleblog.com/feeds/posts/default",
    "site_url": "https://ai.googleblog.com",
    "type": "ai",
    "tier": "tier2",
    "priority": 78,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 3,
    "notes": "Google AI research updates."
  },
  {
    "slug": "arxiv-ai-cs-lg",
    "name": "arXiv cs.LG (Machine Learning)",
    "url": "https://export.arxiv.org/rss/cs.LG",
    "site_url": "https://arxiv.org/list/cs.LG/recent",
    "type": "ai",
    "tier": "tier3",
    "priority": 40,
    "language": "en",
    "country": "global",
    "enabled": false,
    "max_items_per_day": 1,
    "notes": "Optional experimental. Too noisy unless filtered."
  },
  {
    "slug": "owasp-news",
    "name": "OWASP News",
    "url": "https://owasp.org/feed.xml",
    "site_url": "https://owasp.org",
    "type": "security",
    "tier": "tier3",
    "priority": 55,
    "language": "en",
    "country": "global",
    "enabled": true,
    "max_items_per_day": 2,
    "notes": "Security best practices and vulnerability awareness."
  }
]
```

---

# 2) `src/lib/radar/scoring.ts` (FINAL SIGNAL SCORE ENGINE)

Gunakan ini untuk menghasilkan `signal_score` deterministik.

```ts
// src/lib/radar/scoring.ts

export type RadarSource = {
  slug: string;
  priority: number;
  tier: "tier1" | "tier2" | "tier3";
  type: "seo" | "ai" | "engineering" | "security" | "marketing" | "product";
  max_items_per_day?: number;
};

export type RadarItemCandidate = {
  title: string;
  summary?: string;
  publishedAt?: string | Date | null;
  source: RadarSource;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const containsAny = (text: string, keywords: string[]) => {
  const t = text.toLowerCase();
  return keywords.some((k) => t.includes(k.toLowerCase()));
};

const countMatches = (text: string, keywords: string[]) => {
  const t = text.toLowerCase();
  let count = 0;
  for (const k of keywords) if (t.includes(k.toLowerCase())) count++;
  return count;
};

export function computeFreshnessBoost(publishedAt?: string | Date | null): number {
  if (!publishedAt) return 0;
  const date = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  const ageMs = Date.now() - date.getTime();
  const hours = ageMs / (1000 * 60 * 60);

  if (hours <= 12) return 30;
  if (hours <= 24) return 25;
  if (hours <= 48) return 18;
  if (hours <= 168) return 10;
  return 0;
}

export function computeTitleQualityBoost(title: string): number {
  const len = title.trim().length;
  let score = 0;

  if (len >= 40 && len <= 80) score += 8;
  if (/\d/.test(title)) score += 5;

  const triggerWords = ["breaking", "update", "new", "launch", "announced", "official", "release"];
  if (containsAny(title, triggerWords)) score += 7;

  return score;
}

export function computeNoisePenalty(title: string, summary: string): number {
  let penalty = 0;
  const t = title.toLowerCase();
  const s = summary.toLowerCase();

  if (t.includes("weekly roundup") || t.includes("roundup")) penalty -= 15;
  if (t.includes("podcast") || t.includes("webinar")) penalty -= 10;
  if (t.includes("sponsored") || s.includes("sponsored")) penalty -= 20;
  if (summary.trim().length < 120) penalty -= 10;

  return penalty;
}

export function computeKeywordBoost(text: string): number {
  const seoKeywords = [
    "core update",
    "helpful content",
    "spam update",
    "ranking",
    "indexing",
    "search console",
    "serp volatility",
    "backlink",
    "link spam"
  ];

  const aiKeywords = [
    "model",
    "release",
    "agents",
    "multimodal",
    "gemini",
    "claude",
    "openai",
    "api pricing",
    "context window"
  ];

  const engKeywords = [
    "security",
    "incident",
    "outage",
    "performance",
    "latency",
    "next.js",
    "vercel",
    "edge",
    "kubernetes",
    "cloudflare"
  ];

  const seoHits = Math.min(countMatches(text, seoKeywords), 3);
  const aiHits = Math.min(countMatches(text, aiKeywords), 3);
  const engHits = Math.min(countMatches(text, engKeywords), 3);

  return seoHits * 15 + aiHits * 12 + engHits * 10;
}

export function computeSignalScore(candidate: RadarItemCandidate): number {
  const title = candidate.title ?? "";
  const summary = candidate.summary ?? "";
  const combined = `${title}\n${summary}`;

  const base = candidate.source.priority;

  const freshness = computeFreshnessBoost(candidate.publishedAt);
  const titleBoost = computeTitleQualityBoost(title);
  const keywordBoost = computeKeywordBoost(combined);
  const penalty = computeNoisePenalty(title, summary);

  const raw = base + freshness + titleBoost + keywordBoost + penalty;

  return clamp(raw, 0, 100);
}

export function shouldDisplay(score: number): boolean {
  return score >= 55;
}

export function shouldFeature(score: number): boolean {
  return score >= 80;
}
```

---

# 3) `src/lib/radar/tagging.ts` (DETERMINISTIC TAGGER + NORMALIZER)

Ini penting supaya walaupun AI enrichment gagal, Radar tetap punya tag yang bagus.

```ts
// src/lib/radar/tagging.ts

export function normalizeTag(tag: string): string {
  const t = tag.trim().toLowerCase();

  const alias: Record<string, string> = {
    "search": "SEO",
    "google": "Google",
    "llm": "LLM",
    "openai": "OpenAI",
    "anthropic": "Claude",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "vercel": "Vercel",
    "serp": "SERP",
    "ads": "Ads",
    "tracking": "Tracking",
    "ga4": "GA4",
    "api": "API"
  };

  if (alias[t]) return alias[t];
  return tag
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function inferTagsFromText(text: string): string[] {
  const t = text.toLowerCase();
  const tags = new Set<string>();

  // SEO cluster
  if (t.includes("seo")) tags.add("SEO");
  if (t.includes("search console")) tags.add("Google Search Console");
  if (t.includes("core update")) tags.add("Core Update");
  if (t.includes("serp")) tags.add("SERP");
  if (t.includes("backlink")) tags.add("Backlinks");
  if (t.includes("indexing")) tags.add("Indexing");
  if (t.includes("spam")) tags.add("Spam");

  // Marketing cluster
  if (t.includes("google ads")) tags.add("Google Ads");
  if (t.includes("meta ads") || t.includes("facebook ads")) tags.add("Meta Ads");
  if (t.includes("tiktok")) tags.add("TikTok");
  if (t.includes("conversion")) tags.add("Conversion");
  if (t.includes("cvr")) tags.add("Conversion");

  // AI cluster
  if (t.includes("openai")) tags.add("OpenAI");
  if (t.includes("anthropic") || t.includes("claude")) tags.add("Claude");
  if (t.includes("gemini")) tags.add("Gemini");
  if (t.includes("llm")) tags.add("LLM");
  if (t.includes("agents")) tags.add("Agents");
  if (t.includes("multimodal")) tags.add("Multimodal");

  // Engineering cluster
  if (t.includes("next.js") || t.includes("nextjs")) tags.add("Next.js");
  if (t.includes("vercel")) tags.add("Vercel");
  if (t.includes("cloudflare")) tags.add("Cloudflare");
  if (t.includes("kubernetes")) tags.add("Kubernetes");
  if (t.includes("performance") || t.includes("latency")) tags.add("Performance");
  if (t.includes("security") || t.includes("vulnerability")) tags.add("Security");
  if (t.includes("outage") || t.includes("incident")) tags.add("Incident");

  return Array.from(tags).map(normalizeTag);
}
```

---

# 4) DAILY CAP + DIVERSITY ENFORCER (ANTI NOISE)

Bikin file:

`src/lib/radar/curation.ts`

```ts
// src/lib/radar/curation.ts

export function enforceDailyCap<T extends { source_slug: string }>(
  items: T[],
  caps: Record<string, number>
): T[] {
  const counter: Record<string, number> = {};
  const output: T[] = [];

  for (const item of items) {
    const slug = item.source_slug;
    const cap = caps[slug] ?? 99;
    counter[slug] = (counter[slug] ?? 0) + 1;

    if (counter[slug] <= cap) output.push(item);
  }

  return output;
}

export function enforceDiversity<T extends { type: string }>(items: T[]): T[] {
  const seo: T[] = [];
  const ai: T[] = [];
  const engineering: T[] = [];
  const other: T[] = [];

  for (const item of items) {
    if (item.type === "seo") seo.push(item);
    else if (item.type === "ai") ai.push(item);
    else if (item.type === "engineering") engineering.push(item);
    else other.push(item);
  }

  const result: T[] = [];

  // target mix for top 10:
  // 3 SEO, 3 AI, 3 Engineering, 1 wildcard
  result.push(...seo.slice(0, 3));
  result.push(...ai.slice(0, 3));
  result.push(...engineering.slice(0, 3));
  result.push(...other.slice(0, 1));

  // append remaining after top 10
  const used = new Set(result);
  for (const item of items) {
    if (!used.has(item)) result.push(item);
  }

  return result;
}
```

---

# 5) FINAL DISPLAY RULES (PRODUCTION QUALITY)

Gunakan rule ini di `/radar` UI:

* **Featured section**: `signal_score >= 80 OR is_featured=true`
* **Main feed**: `signal_score >= 55`
* **Archive-only**: `<55` (tetap disimpan, tapi tidak tampil default)

Sort order:

1. featured desc
2. signal_score desc
3. published_at desc

---

# 6) SOURCE PRIORITY STRATEGY (KENAPA INI ULTIMATE)

Tier rules:

* **Tier1**: Official / high authority (Google, OpenAI, Cloudflare)
* **Tier2**: Strong editorial research (Moz, Ahrefs, HuggingFace)
* **Tier3**: Discovery noise (HN, ProductHunt)

Dengan scoring + cap + diversity, Radar kamu akan terasa:

* curated
* tidak spam
* topical authority
* Discover-friendly

---

# 7) READY-TO-USE GEMINI ANTIGRAVITY PROMPT (FINAL)

Copy paste ini ke Gemini:

---

## 🔥 PROMPT: Seed Radar Sources + Scoring Engine + Curation Rules

Act as a Principal Engineer. Implement a production-grade RSS Radar system.

### Step 1

Add seed file `data/radar-sources.seed.json` using the exact JSON provided.

### Step 2

Create Supabase table `radar_sources` with fields:

* slug unique
* name
* url
* site_url
* type
* tier
* priority
* enabled
* max_items_per_day
* language
* country
* notes

Upsert all sources into Supabase.

### Step 3

Implement deterministic scoring engine:

* create `src/lib/radar/scoring.ts` exactly as provided
* store `signal_score` into radar_items

### Step 4

Implement deterministic tagging fallback:

* create `src/lib/radar/tagging.ts`
* always compute tags even without AI enrichment

### Step 5

Implement daily cap and diversity enforcement:

* create `src/lib/radar/curation.ts`
* apply it before writing final list to UI feed

### Step 6

Radar display rules:

* Featured: score >= 80 OR is_featured
* Display: score >= 55
* Archive: score < 55 (still stored)

### Step 7

Ensure UI shows:

* Featured section
* Feed section
* Filters by tags/type/source

Proceed now without questions.

---

# 8) OPTIONAL (HIGH IMPACT): Auto “Source Trust Badge”

Tambahkan label di UI:

* Tier1 = “Authority”
* Tier2 = “Trusted”
* Tier3 = “Experimental”

Ini meningkatkan trust + EEAT.

---

`radar-enrich` yang menghasilkan output super rapi untuk:

* why_it_matters
* takeaway
* recommended_solution_link
* recommended_tool_stack

(ini yang bikin Radar jadi conversion machine).
