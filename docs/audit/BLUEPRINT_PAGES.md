# 📄 BLUEPRINT_PAGES.md
# Spesifikasi Per Halaman — PresenceOS
# Repo: zaditprodakwah/myprofile
# Juni 2026

---

## HALAMAN 1: Homepage / Landing Page `/`

### Tujuan
Konversi pengunjung menjadi leads (WhatsApp / form), sambil membangun autoritas EEAT.

### Sections (berurutan)

```
1. Header (sticky)
   - Logo + Nav: Blog | Audit | Directory | Sovereign
   - CTA kanan: [Konsultasi Gratis] (WhatsApp deeplink)
   - Mobile: hamburger → full-screen overlay menu

2. Hero Section (above the fold)
   - Headline: "Zadit Growth Engine" (Plus Jakarta Sans 72px)
   - Sub: Typed animation — "Audit SEO / B2B Intelligence / Data Makro"
   - Social proof strip: "✓ 120+ domain diaudit  ✓ 40+ klien  ✓ Data realtime"
   - CTA: [Mulai Audit Domain] → /utility/audit-engine
   - Visual: animated bento grid background (CSS gradient mesh)

3. Process Section (horizontal pin, GSAP)
   - Step 1: Audit → Step 2: Insight → Step 3: Strategy → Step 4: Growth
   - Setiap step: ikon SVG + judul + 2 kalimat penjelasan

4. Services Grid
   - 6 kartu layanan: Audit SEO, B2B Hub, Data Intelligence, Konten, Konsultasi, Custom Dev
   - Setiap kartu: ikon, judul, deskripsi singkat, harga mulai dari

5. SovereignTrustBentoBlock (live data)
   - Bento grid: IHSG, USD/IDR, Inflasi, Suku Bunga BI, AI Insight
   - Sumber: /api/sovereign/* (cache 1 jam)
   - Label: "Live Data · Diperbarui 1 jam sekali"

6. Case Studies / Portfolio
   - 3 kartu dengan metrik nyata
   - Animated counter: +127% traffic, 4.2x ROI, dsb
   - CTA: [Lihat Semua Case Study]

7. Latest Blog Insights
   - 3 artikel terbaru dari Supabase
   - CTA: [Baca Semua Artikel]

8. Audit Teaser
   - Input domain langsung di homepage
   - Quick audit preview (redirect ke /utility/audit-engine/[domain])

9. Featured Directory
   - 6 entitas bisnis featured dari direktori
   - CTA: [Eksplorasi Direktori B2B]

10. Testimonials Carousel (Framer Motion)
    - Auto-play, pause on hover, keyboard navigable

11. Rate Card Section
    - 3 paket: Starter / Growth / Enterprise
    - Tabel fitur, badge "Paling Populer" pada Growth

12. Partnership Form
    - Form: nama, email, kebutuhan, budget
    - Submit → /api/partnership → simpan ke utility_leads
    - Validasi: react-hook-form + zod

13. Footer
    - Logo, tagline, nav links
    - Social: LinkedIn, GitHub, WhatsApp
    - Copyright + link Privacy Policy
```

### SEO
```tsx
export const metadata: Metadata = {
  title: "Zadit Growth Engine | Full-Stack Growth Architect & B2B Intelligence",
  description: "Platform audit SEO, direktori B2B, dan data makroekonomi Indonesia.",
  alternates: { canonical: "/" },
  // JSON-LD: Person + Organization + WebSite schema
}
```

---

## HALAMAN 2: Blog Listing `/blog`

### Layout
```
Header
──────────────────────────────────────────
Hero kecil: "Insights & Analisis" (H1)
──────────────────────────────────────────
FilterBar: [Semua][SEO][AI][Marketing][Data]  🔍
──────────────────────────────────────────
┌──────────────────┬────────────────────┐
│ ArticleCard besar│ ArticleCard biasa  │
│ (featured, 1 col)│ (2 per row)        │
│                  │                    │
│                  │ ArticleCard ...    │
└──────────────────┴────────────────────┘
[Load More / Infinite Scroll via IntersectionObserver]
──────────────────────────────────────────
Footer
```

### State Management
- Filter & search state: URL searchParams (`?category=seo&q=keyword`)
- Pagination: offset/limit dari Supabase, 9 artikel per load
- Infinite scroll: IntersectionObserver di sentinel div bawah

### SEO
- JSON-LD: Blog + ItemList schema
- Canonical, OG image via /api/og

---

## HALAMAN 3: Blog Detail `/blog/[slug]`

### Layout
```
Header
──────────────────────────────────────────
[Hero Image full-width, max-height 480px]
──────────────────────────────────────────
Breadcrumb: Home > Blog > [judul]
Reading progress bar (top, fixed)
──────────────────────────────────────────
┌──────────────────────────┬────────────┐
│ <article> (max-w-900px)  │ Sidebar    │
│                          │ ─────────  │
│  [Category badge]        │ TOC sticky │
│  H1 judul                │ (auto dari │
│  Meta: tanggal, waktu    │  heading)  │
│  baca, jumlah view       │            │
│                          │ Share      │
│  Konten Markdown/HTML    │ buttons    │
│  (prose Tailwind)        │            │
│                          │ Related 3  │
│  [Share buttons]         │ artikel    │
│  [Related articles]      │            │
└──────────────────────────┴────────────┘
Footer
```

### Fitur
- Reading progress bar (CSS scroll-driven)
- Auto-increment `view_count` saat halaman dimuat (via client fetch ke Route Handler)
- TOC auto-generated dari heading h2/h3
- Social share: Twitter/X, LinkedIn, WhatsApp, Copy Link
- JSON-LD: Article schema dengan author, datePublished, image

---

## HALAMAN 4: Audit Engine `/utility/audit-engine`

### Layout
```
Header
──────────────────────────────────────────
Hero: "Audit Digital Presence Anda"
Sub: "Masukkan domain, dapatkan skor + rekomendasi dalam 30 detik"
──────────────────────────────────────────
┌────────────────────────────────────────┐
│  🌐  https://  [domain input        ]  │
│                    [ Audit Sekarang →] │
└────────────────────────────────────────┘
──────────────────────────────────────────
Contoh domain: [zaditprodakwah.id] [tokopedia.com] [compfest.id]
──────────────────────────────────────────
Recent audits (dari localStorage): ...
──────────────────────────────────────────
Bagaimana cara kerja audit? (accordion FAQ)
```

### Halaman Hasil `/utility/audit-engine/[domain]`
```
Header
──────────────────────────────────────────
[domain] · Diaudit: 22 Jun 2026 · [Re-audit]
──────────────────────────────────────────
ScoreRing besar: COMPOSITE SCORE 78/100
──────────────────────────────────────────
Skor per kategori:
  Performance     ████████░░  78
  SEO             ██████████  92
  Accessibility   █████████░  81
  Best Practices  ███████░░░  67
──────────────────────────────────────────
Tabs: [Rekomendasi] [Detail Teknis] [Perbandingan]
──────────────────────────────────────────
Rekomendasi (sorted by priority):
  🔴 HIGH  Aktifkan HTTPS
  🟡 MED   Tambah meta description
  🟢 LOW   Kompres gambar
──────────────────────────────────────────
[💾 Simpan Hasil] [📄 Ekspor PDF] [🔗 Bagikan]
```

---

## HALAMAN 5: Admin Dashboard `/admin/dashboard`

### Auth
- Verifikasi via `/api/admin/verify` (password hash env var)
- Session di cookie httpOnly

### Layout
```
┌──────────────┬────────────────────────────────────────┐
│ Sidebar      │ Topbar: "Dashboard" + [Logout]         │
│              │ ──────────────────────────────────── │
│ 📊 Dashboard │                                        │
│ 📝 Artikel   │  Metric tiles (4 in a row):            │
│ 🔍 Audit     │  [Audit Runs][Leads][Page Views][Articles]│
│ 🏢 Direktori │                                        │
│ 🌐 Sovereign │  Charts row:                           │
│ ⚙️ Settings  │  Audit runs 7 hari | Leads per source  │
│              │                                        │
│              │  Recent Activity:                      │
│              │  - AdminDataTable: artikel terbaru     │
│              │  - AdminDataTable: audit jobs terbaru  │
│              │                                        │
│              │  Cron Jobs:                            │
│              │  [▶ Run RSS] [▶ SEO Refresh] [▶ AI]   │
└──────────────┴────────────────────────────────────────┘
```

### Sub-pages Admin
- `/admin/articles` — CRUD artikel
- `/admin/audits` — list audit jobs, detail, re-trigger
- `/admin/leads` — lihat utility_leads
- `/admin/entities` — kelola direktori entitas

---

## HALAMAN 6: Sovereign Explorer `/sovereign-explorer`

### Layout
```
Header
──────────────────────────────────────────
"Sovereign Data Intelligence" (H1)
Sub: "Data makroekonomi Indonesia & global realtime"
──────────────────────────────────────────
Bento Grid (2x3 desktop, 1-col mobile):
  ┌──────────────┬──────────────┬──────────────┐
  │  IHSG        │  USD/IDR     │  Inflasi     │
  │  7,234.56    │  16,234      │  2.84%       │
  │  ▲ +0.42%   │  ▼ -0.1%    │  ── stabil  │
  ├──────────────┴──────────────┤──────────────┤
  │  AI Market Insight (wide)   │  Suku Bunga  │
  │  (Gemini Flash summary)     │  6.25% BI    │
  └─────────────────────────────┴──────────────┘
──────────────────────────────────────────
Tabs: [Pasar] [Makro IDN] [Global (FRED)] [ESG] [Cybersec]
──────────────────────────────────────────
Data table detail per tab
Footer
```

---

## HALAMAN 7: Directory `/directory`

### Struktur URL
- `/directory` — landing, search utama
- `/directory/[city]` — listing per kota
- `/directory/[city]/[entity-slug]` — profil entitas

### Layout listing
```
"Direktori B2B Indonesia" (H1)
SearchBar besar + filter: [kota ▼] [kategori ▼] [rating ▼]
──────────────────────────────────────────
Grid 3-col → EntityCard per entitas:
  Logo | Nama | Kota | Kategori | Rating ⭐
  [Lihat Profil] [🔍 Audit Domain]
──────────────────────────────────────────
Pagination (bukan infinite scroll — SEO crawlable)
```

### Layout profil entitas
```
[Logo + nama + kota + rating]
[Domain] [Kategori] [Status: Terverifikasi ✓]
──────────────────────────────────────────
Tabs: [Info] [Skor Digital] [Rekomendasi]
Skor Digital → embed AuditScoreCard
──────────────────────────────────────────
[Claim Profil Ini] → /api/partnership (lead)
```

---

## HALAMAN 8: Fact Checker `/utility/fact-checker`

```
"AI Fact Checker" (H1)
Textarea: masukkan klaim yang ingin dicek
[Cek Fakta →] → POST /api/utility/fact-check → Gemini Flash
──────────────────────────────────────────
Hasil:
  ✅ VALID / ❌ TIDAK VALID / ⚠️ PERLU VERIFIKASI
  Penjelasan + sumber referensi
  Confidence score
```

---

## HALAMAN 9: Video Auditor `/utility/video-auditor`

```
"YouTube Channel Auditor" (H1)
Input: URL channel atau @handle YouTube
[Audit Channel →] → /api/utility/youtube-audit → Gemini Flash
──────────────────────────────────────────
Hasil:
  Channel info (nama, subscriber, total video)
  Skor engagement, konsistensi konten
  Rekomendasi konten dari AI
  Top 5 video + performa
```
