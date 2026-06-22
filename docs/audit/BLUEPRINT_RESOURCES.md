# 📦 BLUEPRINT_RESOURCES.md
# Daftar Sumber: API, Tools, Referensi, Benchmark
# Repo: zaditprodakwah/myprofile (PresenceOS)
# Juni 2026

---

## 1. TECH STACK (SUDAH ADA DI REPO)

| Teknologi | Versi | Peran | Free Tier |
|-----------|-------|-------|-----------|
| Next.js | 16.2.9 | Framework utama, App Router | ✅ |
| React | 19.2.4 | UI rendering | ✅ |
| TypeScript | ^5 | Type safety | ✅ |
| Tailwind CSS | ^4 | Styling | ✅ |
| Supabase JS | ^2.108.2 | Database + Auth + Storage | ✅ 500MB DB |
| Vercel | - | Hosting + Cron + Analytics | ✅ Hobby |
| Framer Motion | ^12.40.0 | Animasi page/component | ✅ |
| GSAP | ^3.15.0 | Animasi scroll kompleks | ✅ (non-commercial) |
| Lenis | ^1.3.23 | Smooth scroll | ✅ |
| Lucide React | ^1.20.0 | Icon library | ✅ |
| Zod | ^4.4.3 | Schema validation | ✅ |
| React Hook Form | ^7.79.0 | Form management | ✅ |
| @mozilla/readability | ^0.6.0 | Ekstrak konten artikel | ✅ |
| jsdom | ^29.1.1 | Server-side DOM parsing | ✅ |
| @tgwf/co2 | ^0.18.0 | Estimasi emisi CO2 website | ✅ |
| googleapis | ^173.0.0 | Google APIs client | ✅ |
| uuid | ^14.0.1 | UUID generator | ✅ |

---

## 2. API EKSTERNAL (FREE TIER)

### 2.1 AI / LLM

| API | Model | Free Limit | Kegunaan | Endpoint |
|-----|-------|-----------|---------|---------|
| **Google Gemini** | gemini-1.5-flash | 1M token/hari, 15 req/mnt | Audit recommendations, fact check, AGC, insight | `generativelanguage.googleapis.com` |
| **Google Gemini** | gemini-1.5-pro | 2 req/mnt (fallback) | Analisis kompleks | same |

Config di repo: `src/lib/gemini.ts`, `src/lib/llm-router.ts`

### 2.2 Data Indonesia (Gratis, Tanpa Key)

| API | Data | URL | Notes |
|-----|------|-----|-------|
| **BPS Web API** | Statistik resmi Indonesia: PDB, Inflasi, Kemiskinan, Demografi | `https://webapi.bps.go.id/v1/api/` | Open, tanpa key. Butuh model/variable ID |
| **Bank Indonesia** | Suku bunga, kurs resmi | `https://www.bi.go.id/biwebservice/` | SOAP/XML, wrap dengan fetch |
| **BMKG** | Cuaca, gempa, iklim | `https://data.bmkg.go.id/` | Open JSON |
| **Data Indonesia** | Dataset pemerintah | `https://data.go.id/` | Open Gov Data |

### 2.3 Data Global (Gratis, Butuh Key)

| API | Data | URL | Free Limit |
|-----|------|-----|-----------|
| **FRED API** (St. Louis Fed) | GDP global, FFR, CPI, M2 | `https://api.stlouisfed.org/fred/` | 120 req/mnt, unlimited series |
| **Alpha Vantage** | Saham, forex, crypto | `https://www.alphavantage.co/` | 25 req/hari |
| **Open Exchange Rates** | Kurs mata uang | `https://openexchangerates.org/` | 1000 req/bln |
| **NewsAPI** | Berita global | `https://newsapi.org/` | 100 req/hari (dev) |
| **CoinGecko** | Crypto prices | `https://api.coingecko.com/api/v3/` | 30 req/mnt (demo) |

### 2.4 Web Performance & SEO

| Tool | Kegunaan | URL | Free |
|------|---------|-----|------|
| **PageSpeed Insights API** | Lighthouse scores via API | `https://www.googleapis.com/pagespeedonline/v5/` | ✅ dengan Google key |
| **IndexNow** | Ping Bing/Yandex saat konten baru | `https://api.indexnow.org/indexnow` | ✅ |
| **Google Search Console API** | Data indexing, impressions | GSC via googleapis | ✅ gratis |
| **Bing Webmaster API** | Submit sitemap ke Bing | `https://ssl.bing.com/webmaster/api` | ✅ |

### 2.5 Scraping & Enrichment

| Tool | Kegunaan | Notes |
|------|---------|-------|
| **Outscraper** | Scraping data bisnis Google Maps | Free credits. Script: `scripts/outscraper-cli.js` |
| **jsdom + @mozilla/readability** | Ekstrak konten artikel dari URL | Built-in di repo |

### 2.6 Infrastruktur

| Layanan | Kegunaan | Free Limit |
|---------|---------|-----------|
| **Vercel Hobby** | Hosting, Edge Functions, ISR | 100GB bandwidth/bln |
| **Vercel Cron** | Scheduled jobs | 1 job/deployment (daily) |
| **Vercel Analytics** | Web analytics privacy-first | 2500 events/bln |
| **Supabase Free** | PostgreSQL + Auth + Storage + Realtime | 500MB DB, 1GB storage, 50k auth users |
| **Supabase Edge Functions** | Serverless Deno functions | 500k invocations/bln |

---

## 3. LIBRARY YANG BISA DITAMBAHKAN (OPSIONAL)

> Tambahkan hanya jika diperlukan. Konfirmasi sebelum install.

| Library | Kegunaan | npm | Size |
|---------|---------|-----|------|
| `react-pdf` | Generate PDF ekspor audit | `@react-pdf/renderer` | ~2MB |
| `recharts` | Charts untuk admin dashboard | `recharts` | ~1MB |
| `sharp` | Image optimization server-side | `sharp` | Built-in Next.js |
| `nodemailer` | Email notifikasi leads | `nodemailer` | ~200KB |
| `@vercel/og` | OG image generation (sudah ada /api/og) | built-in | - |

---

## 4. TOOLS DEVELOPMENT

| Tool | Kegunaan |
|------|---------|
| **Antigravity IDE** | AI coding agent (sedang digunakan) |
| **Supabase CLI** | Migrasi SQL, local dev, link project |
| **Vercel CLI** | Deploy, env vars, logs |
| **TypeScript** | Static type checking |
| **ESLint** | Code linting (eslint-config-next) |
| **PostCSS + Tailwind** | CSS processing |
| **bun / npm** | Package manager |

---

## 5. REFERENSI & DOKUMENTASI

### Framework & Core
- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS v4: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs
- React 19: https://react.dev/reference

### Animasi
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Framer Motion: https://www.framer.com/motion/
- Lenis: https://lenis.darkroom.engineering/
- CSS Scroll-Driven Animations: https://scroll-driven-animations.style/

### SEO & Schema
- Schema.org: https://schema.org/
- Google Rich Results: https://developers.google.com/search/docs/appearance/structured-data
- Core Web Vitals: https://web.dev/explore/learn-core-web-vitals

### Aksesibilitas
- WCAG 2.1: https://www.w3.org/TR/WCAG21/
- Radix UI Primitives: https://www.radix-ui.com/primitives (sudah ada @radix-ui/react-dialog, @radix-ui/react-tabs)
- A11y checklist: `.context/checklists/accessibility-checklist.md`

### Design
- Refactoring UI: https://www.refactoringui.com/
- Laws of UX: https://lawsofux.com/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/

---

## 6. BENCHMARK / REFERENSI SITUS

| Situs | Aspek yang Dibenchmark | URL |
|-------|----------------------|-----|
| **Linear.app** | Micro-interactions, loading states, dark mode | linear.app |
| **Vercel.com** | Hero section, typography hierarchy | vercel.com |
| **Lemonade.com** | Conversion funnel, trust signals | lemonade.com |
| **Stripe.com** | Dashboard design, data visualization | stripe.com/docs |
| **Raycast.com** | Bento grid layout, product page | raycast.com |
| **Shopify Polaris** | Design system documentation | polaris.shopify.com |
| **Hubspot** | B2B dashboard, admin panel patterns | hubspot.com |
| **Ahrefs** | Audit tool UI/UX, skor visual | ahrefs.com |
| **PageSpeed Insights** | Audit result layout referensi | pagespeed.web.dev |
| **SimilarWeb** | Data dashboard, metric tiles | similarweb.com |
| **Databoks Katadata** | Data Indonesia visualization | databoks.katadata.co.id |

---

## 7. OPEN DATA INDONESIA

| Dataset | Sumber | Akses |
|---------|--------|-------|
| Direktori KBLI (klasifikasi bisnis) | BPS | webapi.bps.go.id |
| Data wilayah Indonesia (provinsi/kota) | Kemendagri / BPS | Open |
| UMK per kota | BPS | webapi.bps.go.id |
| Data ekspor-impor | BPS | webapi.bps.go.id |
| Indeks Kemudahan Berusaha | BKPM / OSS | oss.go.id |
| Data UMKM Indonesia | Kemenkop | Open |
| Kurs BI resmi | Bank Indonesia | bi.go.id |
| Indeks Harga Konsumen | BPS | webapi.bps.go.id |
| Data Covid / Kesehatan | Kemenkes | Open |

---

## 8. SKILL & PENGETAHUAN RELEVAN

```
Frontend:
  - React 19 (Server Components, Actions, use() hook)
  - Next.js App Router (ISR, SSR, PPR, Partial Prerendering)
  - Tailwind v4 (CSS layers, @theme, container queries)
  - CSS native features (scroll-driven, anchor positioning, nesting)
  - GSAP (timeline, ScrollTrigger, SplitText)
  - Accessibility (ARIA, focus management, keyboard nav)

Backend:
  - Next.js Route Handlers (streaming, Edge runtime)
  - Supabase (RLS, realtime subscriptions, storage)
  - SQL (PostgreSQL, additive migrations, indexes)
  - Event sourcing pattern
  - Cron job design

AI/Data:
  - Prompt engineering (Gemini Flash)
  - API integration (FRED, BPS, NewsAPI)
  - Data caching strategy (TTL, stale-while-revalidate)
  - AGC (AI-Generated Content) pipeline

SEO:
  - Core Web Vitals optimization
  - Programmatic SEO (pSEO)
  - JSON-LD structured data
  - IndexNow, sitemap.xml, robots.txt
  - EEAT (Experience, Expertise, Authority, Trust)
```

---

## 9. CONTEXT FILES DI REPO (GUNAKAN SEBAGAI REFERENSI)

```
.context/ZADIT_FRONTEND_UIUX_MASTER.md     → Design system lengkap versi sebelumnya
.context/ZADIT_VIBE_CODING_DOCS.md         → Panduan vibe coding
.context/MASTER_KNOWLEDGE_BASE.md          → Knowledge base produk
.context/Master Blueprint & Architecture_1.md → Arsitektur sistem
.context/PresenceOS Master Blueprint.md    → Blueprint PresenceOS lengkap
.context/checklists/                       → 18 checklist (SEO, A11y, Security, dll)
.context/playbooks/                        → 13 playbook (UX, Conversion, Dashboard, dll)
.context/prompts/                          → Library prompt AI
docs/adr/                                 → Architecture Decision Records
docs/database/schema-overview.md          → Schema overview
```
