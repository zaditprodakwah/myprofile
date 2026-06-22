# 🚀 PROMPT_ANTIGRAVITY.md
# Master Prompt — Antigravity IDE Agent
# Repo: zaditprodakwah/myprofile (PresenceOS / Zadit Growth Engine)
# Diperbarui: Juni 2026

---

## KONTEKS PROYEK

Kamu adalah AI coding agent yang bekerja pada repo **zaditprodakwah/myprofile**.

Ini adalah **PresenceOS** — platform intelijen kehadiran digital milik Muhammad Khoiruzzadittaqwa (Zadit).
Stack: **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Supabase + Vercel**.

Persona produk: *Full-Stack Growth Architect & B2B Intelligence Hub* — bukan portofolio statis, melainkan **mesin pertumbuhan hidup**.

---

## IDENTITAS & PRINSIP KERJA

1. **Architecture-First, DDD.** Semua kode ikuti struktur `src/modules/<domain>/` — domain, application, workers, events.
2. **SQL-First, Additive Only.** Perubahan skema hanya melalui `supabase/migrations/` dengan format standar (MIGRATION_ID, DEPENDENCIES, UP, DOWN, VERIFICATION_SQL).
3. **Serverless-First.** Semua API adalah Next.js Route Handlers, tidak ada server terpisah.
4. **AI-Native, bukan AI-Generic.** Gemini/LLM digunakan sebagai enrichment node spesifik, bukan generator teks generik.
5. **Performance Budget.** LCP < 2.5s, TBT < 200ms, CLS < 0.1. Gunakan dynamic import + skeleton untuk komponen berat.
6. **Free Tier Maximalist.** Prioritaskan Vercel Hobby, Supabase Free, Google Gemini Flash, BPS API, FRED API — semua gratis.

---

## ATURAN CODING WAJIB

```
- TypeScript strict mode. Tidak ada `any` tanpa alasan eksplisit.
- Komponen UI: gunakan Tailwind v4 + clsx + tailwind-merge. Tidak ada inline style.
- Animasi: CSS Scroll-Driven Animation untuk efek sederhana; GSAP ScrollTrigger untuk orkestrasi kompleks; Framer Motion untuk page transition.
- Data fetching: Server Components untuk data statis/ISR; Route Handler untuk data dinamis/user-specific.
- Error handling: Semua async function dibungkus try/catch dengan logging via `src/modules/shared/infrastructure/logger.ts`.
- Aksesibilitas: Setiap komponen interaktif wajib memiliki aria-label, role, dan keyboard navigation.
- SEO: Setiap halaman wajib export `generateMetadata()` dengan OG, canonical, JSON-LD schema.
```

---

## DESIGN TOKENS (Hardcoded Reference)

```css
/* Warna */
--brand-dark:   #0f172a;   /* slate-900 — background gelap */
--brand-mid:    #1e293b;   /* slate-800 — card dark */
--brand-border: #334155;   /* slate-700 — border */
--alabaster:    #f8fafc;   /* slate-50  — bg utama terang */
--teal:         #0d9488;   /* teal-600  — CTA, aksen utama */
--teal-glow:    #14b8a6;   /* teal-500  — hover */
--gold:         #d97706;   /* amber-600 — badge premium */
--text-primary: #0f172a;
--text-muted:   #475569;   /* slate-600 */
--text-inverse: #f1f5f9;   /* slate-100 */

/* Tipografi */
--font-display: 'Plus Jakarta Sans', sans-serif;
--font-body:    'Inter', sans-serif;
--font-mono:    'JetBrains Mono', monospace;

/* Spacing base unit: 8px, grid 12-col, max-width 1200px */
```

---

## STRUKTUR HALAMAN

| Route | Komponen Utama | Prioritas |
|-------|---------------|-----------|
| `/` | Homepage / Landing Page | P0 |
| `/blog` | Blog listing + filter | P0 |
| `/blog/[slug]` | Artikel blog | P0 |
| `/utility/audit-engine` | Audit SEO engine | P0 |
| `/utility/audit-engine/[domain]` | Hasil audit domain | P0 |
| `/admin/dashboard` | Admin panel | P0 |
| `/sovereign-explorer` | Data makroekonomi | P1 |
| `/directory` | Direktori B2B | P1 |
| `/utility/fact-checker` | Fact checker AI | P1 |
| `/utility/video-auditor` | Audit YouTube | P1 |
| `/settings` | User settings | P2 |
| `/privacy-policy` | Legal | P2 |

---

## API YANG TERSEDIA (Free Tier)

```
INTERNAL (Route Handlers):
  /api/audit-speed          → Audit kecepatan domain
  /api/sovereign/*          → Data makro (FRED, BPS, markets, news, ESG, CYBERSEC)
  /api/agc                  → AGC content generator
  /api/cron/*               → Cron jobs (RSS, SEO refresh, AI graph, DB worker)
  /api/og                   → OG image generator
  /api/utility/fact-check   → Fact checker
  /api/utility/youtube-audit→ Audit YouTube channel
  /api/v2/ingest            → Data ingestion pipeline

EKSTERNAL (Free Tier):
  Google Gemini Flash        → gemini-1.5-flash (FREE, 1M token/day)
  Supabase                   → PostgreSQL + Auth + Storage (FREE tier)
  BPS Web API                → webapi.bps.go.id (open, tanpa key)
  FRED API                   → api.stlouisfed.org (free, butuh key)
  Outscraper                 → Scraping bisnis (free credits)
  IndexNow                   → Ping search engine (free)
  Vercel Analytics           → Free tier
  @tgwf/co2                  → CO2 estimator (library, free)
```

---

## INSTRUKSI UNTUK SETIAP TASK

Saat menerima task, ikuti urutan ini:

1. **Baca dulu** file relevan sebelum menulis kode.
2. **Identifikasi** komponen/fungsi yang bisa di-reuse.
3. **Tulis migrasi SQL** jika ada perubahan skema (format standar).
4. **Implementasi** dengan TypeScript strict + aksesibel + SEO-ready.
5. **Verifikasi** dengan `npm run build` — tidak boleh ada error TypeScript/ESLint.
6. **Tidak tambah dependency baru** kecuali benar-benar diperlukan dan sudah ada di package.json.

---

## CONTOH PROMPT TASK YANG BENAR

```
Task: Upgrade halaman /blog dengan infinite scroll, filter kategori, dan search.

Konteks:
- File: src/app/blog/page.tsx, src/app/blog/UnifiedBlogClient.tsx
- Data dari Supabase tabel: articles (id, slug, title, category, published_at, content)
- Design tokens teal + slate sudah terdefinisi di globals.css
- Gunakan Intersection Observer untuk infinite scroll (tanpa library)
- Filter state di URL searchParams (bukan useState) agar SEO-friendly
- Skeleton loader saat loading (sesuai kartu yang ada)

Output yang diharapkan:
- page.tsx (Server Component, generateMetadata)
- UnifiedBlogClient.tsx (Client Component, filter + infinite scroll)
- Tidak perlu migrasi SQL (tabel sudah ada)
```

---

## LARANGAN

- ❌ Jangan install library baru tanpa konfirmasi.
- ❌ Jangan hardcode secret/API key di kode — gunakan `process.env.*`.
- ❌ Jangan hapus atau rename kolom Supabase yang ada.
- ❌ Jangan gunakan `useEffect` untuk data fetching — gunakan Server Components.
- ❌ Jangan generate konten palsu/placeholder sebagai data produksi.
- ❌ Jangan bypass `eslint` dengan `// eslint-disable` tanpa alasan.
