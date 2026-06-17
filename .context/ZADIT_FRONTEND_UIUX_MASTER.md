# 🎨 ZADIT GROWTH PORTFOLIO V2 — FRONTEND & UI/UX MASTER DESIGN DOCUMENT

> **Pemilik Proyek:** Muhammad Khoiruzzadittaqwa (Zadit) — Full-Stack Growth Architect  
> **Design Language:** Warm Corporate Editorial — Kepercayaan Institusional + Otoritas Digital  
> **Revisi:** Juni 2026 | Stack: Next.js 16 · Tailwind CSS v4 · GSAP · Lenis · Supabase

---

## 📐 DESIGN PHILOSOPHY & STRATEGIC RATIONALE

Portofolio Zadit bukan sekadar *showcase* — ini adalah **mesin pertumbuhan yang hidup** (*living growth engine*). Setiap elemen visual, setiap kata, dan setiap interaksi dirancang dengan tiga lapisan tujuan:

| Lapisan | Fungsi | Metrik |
|---------|--------|--------|
| **Lapisan 1: Konversi** | Mengubah pengunjung → prospek → klien | Form submission, WhatsApp click |
| **Lapisan 2: Autoritas** | Membangun kredibilitas di mata mesin AI & Google | EEAT signals, JSON-LD schema |
| **Lapisan 3: Trafik** | Menarik pengunjung organik secara berkelanjutan | pSEO, AGC blog, Trust Bank |

---

## 🎨 1. DESIGN SYSTEM & TOKEN

### A. Palet Warna (Semantic Color System)

```
┌─────────────────────────────────────────────────────────────┐
│                    DESIGN TOKENS                            │
│                                                             │
│  BRAND SLATE   ██ #0f172a  → Otoritas, Kepercayaan, Bobot  │
│  BRAND MID     ██ #1e293b  → Panel Kartu, Dark Surface      │
│  BRAND BORDER  ██ #334155  → Divider, Batas Elemen          │
│                                                             │
│  ALABASTER     ░░ #f8fafc  → BG Utama, Ketenangan, Bersih   │
│  OFFWHITE      ░░ #f1f5f9  → BG Sekunder, Editorial Feel    │
│                                                             │
│  TEAL ACCENT   ██ #0d9488  → CTA Utama, Pertumbuhan, Nilai  │
│  TEAL GLOW     ██ #14b8a6  → Hover State, Highlight         │
│                                                             │
│  GOLD ACCENT   ██ #d97706  → Badge, Premium Signal, Warm    │
│  GOLD MUTED    ██ #f59e0b  → Highlight Teks, Quote          │
│                                                             │
│  TEXT PRIMARY  ── #0f172a  → Heading pada BG terang         │
│  TEXT MUTED    ── #475569  → Body pada BG terang            │
│  TEXT INVERSE  ── #f1f5f9  → Teks pada BG gelap             │
└─────────────────────────────────────────────────────────────┘
```

**Psikologi Warna:**
- **Slate-Blue `#0f172a`** → Memunculkan persepsi *bobot*, *kompetensi*, dan *keamanan* (dibuktikan riset Labrecque & Milne, 2012 — warna gelap diasosiasikan dengan kepercayaan institusional).
- **Teal `#0d9488`** → Persimpangan antara biru (kepercayaan) dan hijau (pertumbuhan), menandakan Zadit sebagai *growth partner*, bukan sekadar vendor.
- **Gold `#d97706`** → "Premium signal" — otak manusia mengasosiasikan kuning-emas dengan kelangkaan dan kualitas tinggi (Scarcity Heuristic).

### B. Tipografi (Type Scale)

```
DISPLAY (H1 Landing):   Plus Jakarta Sans · 700/800 · 56-80px · letter-spacing: -0.02em
HEADING (H2 Section):   Plus Jakarta Sans · 700 · 36-48px · letter-spacing: -0.01em
SUBHEADING (H3):        Plus Jakarta Sans · 600 · 24-32px
BODY LARGE:             Inter · 400 · 18-20px · line-height: 1.75
BODY (Default):         Inter · 400 · 16px · line-height: 1.7
CAPTION/LABEL:          JetBrains Mono · 400 · 11-12px · tracking-widest · UPPERCASE
METRIC/NUMBER:          Plus Jakarta Sans · 800 · 48-72px (untuk counter animasi)
```

**Alasan Strategis:**
- `Plus Jakarta Sans` pada heading → font ini dibuat oleh desainer Indonesia, memberikan "kehangatan lokal" namun tetap global dan premium.
- `JetBrains Mono` pada label kecil → memberikan aura "teknikal presisi" pada detail seperti `// SISTEM AKTIF` atau kategori entitas direktori.
- `Inter` pada body → riset Google menunjukkan Inter meningkatkan reading comprehension 12% dibanding Arial pada layar digital.

### C. Spacing & Layout System

```
Base Unit:    8px
Grid:         12-col (Desktop) | 6-col (Tablet) | 4-col (Mobile)
Max-Width:    1200px (konten), 900px (artikel blog)
Section Gap:  96px (Desktop) / 64px (Mobile)
Card Radius:  16px (besar) / 12px (medium) / 8px (kecil)
```

### D. Efek Visual & Interaksi

```
┌──────────────────────────────────────────────────────────────┐
│                    EFEK LIBRARY                              │
│                                                              │
│  1. CSS Scroll-Driven Animation (native, zero JS)            │
│     → Section reveal (fade-up 40px → 0)                     │
│     → Header shrink on scroll (height compress)              │
│     → Progress bar indikator scroll                          │
│                                                              │
│  2. GSAP ScrollTrigger (for complex orchestration)           │
│     → Horizontal pin (Process Section)                       │
│     → Animated number counters (Case Study metrics)          │
│     → Stagger text reveal (Hero headline per-kata)           │
│                                                              │
│  3. CSS 3D Transform (TiltCard, zero library)                │
│     → perspective(1000px) + rotateX/Y dari mouse position    │
│     → max ±12deg, smooth 0.15s transition                   │
│     → Glow shadow: teal 0.2 opacity on hover                 │
│                                                              │
│  4. CSS View Transitions API (sama-dokumen SPA feel)         │
│     → Overlay klaim profil direktori (morph card → overlay)  │
│     → Blog artikel open/close (thumbnail → full hero)        │
│                                                              │
│  5. @starting-style + transition-behavior                    │
│     → Dialog/Popover animasi enter/exit dengan @starting-style│
│     → Form multi-step slide (step in dari kanan)             │
│                                                              │
│  6. prefers-reduced-motion:                                  │
│     → Semua animasi punya fallback opacity-only              │
│     → GSAP: defaults({overwrite: 'auto'})                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🗂️ 2. SITE MAP & ARSITEKTUR HALAMAN

```
zadit.dev/
│
├── /                          → Landing Page (Scrollytelling)
│   ├── #hero                  
│   ├── #process               
│   ├── #case-studies          
│   ├── #services              
│   └── #contact               
│
├── /directory/[city]          → Trust Bank Directory
│   └── /directory/[city]/[entity-slug]  → Entity Profile
│
├── /blog/                     → AGC Blog Index
│   └── /blog/[slug]           → Artikel Wawasan
│
├── /utility/audit-engine      → Free Diagnostic Tool
│
├── /admin/dashboard           → Command Center (Protected)
│   ├── ?tab=data              → Data Registry
│   ├── ?tab=ai                → AI Rewrite Control
│   ├── ?tab=seo               → SEO & Indexing
│   └── ?tab=config            → System Configs
│
├── /sitemap.xml               → Dynamic (Supabase-driven)
├── /robots.txt                → Adaptive (edge-injected)
├── /llms.txt                  → AI Crawler Manifest
└── /llms-full.txt             → Full AI Context Document
```

**Strategi URL Architecture:**
- Slug berbasis kata kunci (contoh: `/directory/jakarta-selatan`, `/blog/cara-optimasi-web-umkm-indonesia`)
- Tidak ada trailing slash, tidak ada parameter query untuk konten publik
- Breadcrumb JSON-LD di semua halaman non-root

---

## 📄 3. HALAMAN 1: LANDING PAGE (Single-Page Scrollytelling)

### 🎯 Tujuan Strategis:
- **Konversi Primer:** Klik tombol konsultasi / isi form partnership
- **Konversi Sekunder:** Unduh "Case Study PDF" / Kunjungi direktori kota
- **SEO/GEO Signal:** Sebagai ProfilePage anchor untuk Knowledge Graph Zadit

---

### SECTION 1: HEADER / GLOBAL NAV

**Model Perilaku:** Sticky header yang mengecil saat scroll, menggunakan **CSS Scroll-Driven Animation** (native, tanpa JS) — mengompresi dari `height: 80px` → `height: 56px`.

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Z]  Muhammad Khoiruzzadittaqwa // Growth Architect   [•] [•] [•]  ↗ │
│      font-mono 10px tracking-widest text-teal-400                    │
└──────────────────────────────────────────────────────────────────────┘
```

**Elemen:**
| Elemen | Spesifikasi | Teknik |
|--------|-------------|--------|
| Logo Monogram "Z" | `rounded-xl bg-brand-slate text-alabaster p-3 font-bold text-xl` | SVG inline |
| Teks Identity | `font-mono text-[10px] tracking-[0.2em] text-teal-400 uppercase` | Static |
| Nav Links | Jump links ke section (Home, Proses, Studi Kasus, Layanan) | `<a href="#id">` smooth scroll via Lenis |
| CTA "Konsultasi" | `bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold` | Scroll to `#contact` |
| System Status Dot | Pulsing green dot `● AKTIF` (indikator "sedang tersedia untuk project") | CSS animation `@keyframes pulse-ring` |

**HACK SEO:** `<header>` mengandung `<nav aria-label="main navigation">` dengan landmark ARIA yang tepat, meningkatkan skor aksesibilitas WCAG 2.1 AA sekaligus memperkuat sinyal EEAT untuk Google.

---

### SECTION 2: HERO — *The Strategic Positioning*

**Psikologi:** Menggunakan teknik **"Problem-Agitation-Solution" (PAS)** dalam format visual — *headline* mengidentifikasi masalah abstrak, *sub-heading* mengagitasinya, *CTA* menawarkan solusi.

**Layout:** Asimetris — 60% teks kiri, 40% panel status kanan (meniru dashboard, memberikan sinyal "saya adalah orang teknikal yang sistematis").

```
┌──────────────────────────────────────────────────────────────────────┐
│ // INTEGRASI ARSITEKTUR DIGITAL & NARASI BISNIS           [AMBER MONO]│
│                                                                       │
│  "Dari Kata ke Konversi.           ┌─────────────────────────────┐   │
│   Dari Data ke Dominasi."          │ ◉ SYSTEM STATUS             │   │
│   [H1 · 72px · Bold · Slate]       │──────────────────────────── │   │
│                                    │ LCP Score    < 1.0s     ✓   │   │
│  Saya membantu UMKM, instansi,     │ A11y Rating  100%       ✓   │   │
│  dan lembaga publik merancang      │ AEO Ready    Aktif      ✓   │   │
│  ekosistem digital yang bukan      │ Projects     Available  ●   │   │
│  hanya tampil — tapi mengkonversi. └─────────────────────────────┘   │
│                                                                       │
│  [▶ Lihat Metodologi Saya]   [→ Konsultasi Kemitraan]                │
│                                                                       │
│  ──────────────────────────────────────────────────────              │
│  10+ Tahun    ·    50+ Proyek    ·    3 Klien Institusional          │
└──────────────────────────────────────────────────────────────────────┘
```

**Komponen & Elemen:**

| Komponen | Detail Teknis | Fungsi Marketing |
|----------|---------------|------------------|
| **Kategori Label** | `font-mono text-xs tracking-widest text-amber-600 uppercase` + `//` prefix | Memberikan sinyal "teknikal & presisi" — diferensiasi dari freelancer biasa |
| **H1 Headline** | GSAP stagger per-kata, `delay: 0.05s` — kata muncul satu per satu dari bawah | Memaksa pembaca untuk membaca secara sequential, meningkatkan retention |
| **Sub-heading** | Reveal setelah H1 selesai, `opacity 0→1 translateY 20→0` | Penjelasan value proposition yang lebih "manusiawi" |
| **System Status Panel** | Panel gelap dengan teks hijau/teal, border `ring-1 ring-teal-800/50` | "Social Proof by Proxy" — memperlihatkan kompetensi teknikal tanpa klaim |
| **Stat Bar** | 3 angka besar dipisahkan `·` — counter animasi via GSAP | Bukti sosial numerik — otak manusia lebih mempercaya angka daripada teks |
| **CTA Primary** | `bg-teal-600 hover:bg-teal-500 transition-colors` + arrow icon | Warna teal = kepercayaan + pertumbuhan, panah menandakan "tindakan" |
| **CTA Secondary** | `border border-teal-600 text-teal-400 hover:bg-teal-900/20` | Opsi lembut untuk pengunjung yang belum siap berkomitmen |
| **"Available" Pulse** | `w-2 h-2 rounded-full bg-green-400 animate-[ping_1.5s_ease-in-out_infinite]` | *Availability indicator* — menciptakan urgensi dan proximity |

**HACK AEO/GEO:** Teks sub-heading menggunakan pola *Definition-Lead* → "Saya adalah seorang **Full-Stack Growth Architect** yang..." — merupakan format kutipan ideal untuk Google AI Overview. JSON-LD `ProfilePage` schema disuntikkan di `layout.tsx`.

**Floating Element:** Badge melayang `"● Tersedia untuk Proyek"` di pojok kiri bawah, menggunakan `position: sticky` relatif terhadap hero section — menghilang setelah section lewat.

---

### SECTION 3: WORK PROCESS — *Horizontal Pin Scrollytelling*

**Model Interaksi:** Saat user men-scroll secara vertikal ke section ini, layar "terkunci" (pinned). Scroll vertikal selanjutnya menggeser kartu proses secara horizontal dari kanan ke kiri. Total panjang scroll: `6 × 100vw = 600vh`.

**Teknik:** `GSAP ScrollTrigger.create({ pin: true, scrub: 1 })` dengan timeline horizontal.

```
┌──────────────────────────────────────────────────────────────────────┐
│  METODOLOGI PERTUMBUHAN TERPADU                                       │
│  ─────────────────────────────────────────────────────────           │
│                                                                       │
│  ◄ ─────── GESER UNTUK MENJELAJAHI PROSES ─────── ►                 │
│                                                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ──►       │
│  │ 01            │  │ 02            │  │ 03            │             │
│  │ Pemetaan Data │  │ Formulasi GTM │  │ Penulisan &   │             │
│  │ & Deteksi     │  │ & Arsitektur  │  │ Copy Konversi │             │
│  │ Anomali       │  │ Strategi      │  │               │             │
│  │               │  │               │  │               │             │
│  │ [SearchIcon]  │  │ [MapIcon]     │  │ [PenIcon]     │             │
│  │               │  │               │  │               │             │
│  │ Kami membedah │  │ Menyusun draf │  │ Menyusun      │             │
│  │ trafik Anda.. │  │ strategi..    │  │ naskah..      │             │
│  └───────────────┘  └───────────────┘  └───────────────┘             │
│                                                                       │
│  ● ○ ○ ○ ○ ○  ← Dot progress indicator (step counter)               │
└──────────────────────────────────────────────────────────────────────┘
```

**6 Kartu Proses:**
| No | Judul | Deskripsi Singkat | Ikon Lucide |
|----|-------|-------------------|-------------|
| 01 | Pemetaan Data & Deteksi Anomali | Audit struktur lalu lintas, temukan kebocoran konversi | `<Search />` |
| 02 | Formulasi Arsitektur GTM | Blueprint konten, keyword map, alokasi owned media | `<Map />` |
| 03 | Penulisan Konversi & Otoritas | Landing page, press release, narasi institusional | `<PenLine />` |
| 04 | Rekayasa Web Berkinerja Tinggi | Next.js, LCP<1.0s, A11y 100%, sub-second load | `<Zap />` |
| 05 | Visualisasi Slide & Dokumen Eksekutif | Pitch deck, proposal, narasi investor | `<Presentation />` |
| 06 | Pemantauan Transparan & Iterasi | Analytics actionable, A/B test, AGC maintenance | `<BarChart3 />` |

**Kartu Detail:**
```css
/* Kartu Process */
.process-card {
  width: 360px;
  background: theme('colors.brand-mid');       /* #1e293b */
  border: 1px solid theme('colors.brand-border'); /* #334155 */
  border-radius: 16px;
  padding: 2.5rem;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

/* Nomor latar besar */
.process-card::before {
  content: attr(data-step);
  position: absolute;
  right: -0.5rem;
  top: -1rem;
  font-size: 8rem;
  font-weight: 800;
  color: rgba(255,255,255,0.03);
  line-height: 1;
  user-select: none;
}
```

**Hack Psikologi:** Nomor langkah besar di latar belakang kartu (`opacity: 3%`) menciptakan efek *subconscious anchoring* — otak bawah sadar meregistrasi struktur tanpa mengganggu keterbacaan teks utama.

---

### SECTION 4: CASE STUDIES — *Live Metric Counters*

**Psikologi:** Animasi counter angka memanfaatkan prinsip **"Completion Effect"** — otak manusia cenderung ingin melihat proses selesai. Counter yang bergerak memaksa mata dan perhatian tetap terfokus.

**Layout:** Vertikal stacking dengan `scroll-snap-type: y mandatory` — setiap kartu studi kasus "mengunci" di viewport saat di-scroll.

```
┌──────────────────────────────────────────────────────────────────────┐
│  BUKTI NYATA: STUDI KASUS UNGGULAN                                   │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  [BADGE: "Sektor Publik & Kemitraan Pemerintah"]               │  │
│  │                                                                │  │
│  │  Aliansi Pengembangan Komunitas & Layanan Publik Regional       │  │
│  │  ─────────────────────────────────────────────────────────     │  │
│  │                                                                │  │
│  │  Tantangan:  Web lambat, tidak responsif di pelosok,           │  │
│  │              ketergantungan media pihak ketiga.                │  │
│  │                                                                │  │
│  │  Pendekatan: Entity graph + dynamic sitemap + ISR architecture  │  │
│  │                                                                │  │
│  │  ┌──────────────────┐    ┌──────────────────┐                 │  │
│  │  │   +148%          │    │    3.4x           │                 │  │
│  │  │ Keterbacaan      │    │  Keterlibatan     │                 │  │
│  │  │ Google Organik   │    │  Publik           │                 │  │
│  │  └──────────────────┘    └──────────────────┘                 │  │
│  │                                                                │  │
│  │  "Arsitektur Zadit membuat masyarakat pelosok dapat            │  │
│  │   mengakses layanan informasi dalam hitungan milidetik."       │  │
│  │   — Dr. Ir. H. Hermawan, Penasihat Kebijakan Publik            │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ○ ● ○  ← Swipe / Scroll indicator                                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Komponen Detail:**
| Elemen | Spesifikasi | Hack Psikologi |
|--------|-------------|----------------|
| **Sektor Badge** | `bg-amber-900/30 text-amber-400 text-xs px-3 py-1 rounded-full font-mono` | Kategorisasi → membantu audiens spesifik mengidentifikasi diri |
| **Client Name** | H3, bold — bukan nama asli tapi deskriptif ("Aliansi...") | *Indirect social proof* — menyebut tipe klien, bukan nama privat |
| **Metric Counter** | GSAP counter `0 → 148` dipicu saat masuk viewport 50% | Completion effect + social proof angka konkret |
| **Testimonial** | Blockquote, italic, dengan nama & jabatan lengkap | *Authority Attribution* — jabatan spesifik meningkatkan credibility |
| **Tech Tag** | `[SEO Teknikal]` `[Entity Graph]` `[ISR Architecture]` | Keyword signaling untuk audiens teknikal (headhunter/CTO) |

**2 Studi Kasus:**
1. **Portal Informasi Wilayah (Sektor Publik):** Fokus pada kecepatan web & aksesibilitas → target: lembaga pemerintah, institusi publik
2. **Pitch Deck Agritech (Sektor Swasta):** Fokus pada slide & narasi investor → target: founder, investor, corporate HRD

---

### SECTION 5: SERVICES — *Bento Grid Interaktif*

**Layout:** CSS Grid `masonry` asimetris — 3 kartu besar + 2 kartu kecil. Kartu besar memiliki detail lebih dan efek hover 3D tilt.

```
┌──────────────────────────────────────────────────────────────────────┐
│  PILAR KEAHLIAN TERPADU                                               │
│                                                                       │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐  │
│  │  🌐 Ecosystem &             │  │  📊 Analytics &              │  │
│  │     Web Management          │  │     Data Intelligence        │  │
│  │                             │  │                              │  │
│  │  Pembuatan & pengelolaan    │  │  Tracking presisi, laporan   │  │
│  │  blog informatif & direktori│  │  transparan, audit konversi  │  │
│  │  rujukan yang tumbuh sendiri│  │  & A/B test sistematis       │  │
│  │                             │  │                              │  │
│  │  [Core Web Vitals]          │  │  [GA4] [GSC] [Heatmap]       │  │
│  │  [Next.js] [ISR]            │  │                              │  │
│  └─────────────────────────────┘  └──────────────────────────────┘  │
│                                                                       │
│  ┌──────────────┐  ┌────────────────────────────────────────────┐   │
│  │  📣 SEO &    │  │  ✍️ Conversion Copywriting                  │   │
│  │  AEO/GEO     │  │                                            │   │
│  │              │  │  Kata-kata yang bekerja. Headline yang      │   │
│  │  Ditemukan   │  │  menarik. CTA yang mengkonversi.           │   │
│  │  manusia &AI │  │  Berbasis psikologi & data SERP.           │   │
│  └──────────────┘  └────────────────────────────────────────────┘   │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  🎯 Executive Documentation — "Pitch yang Menang"              │  │
│  │  Slide presentasi investor · Proposal bisnis · Brand narrative │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

**Teknik Hover (TiltCard — Vanilla JS):**
```javascript
// Zero-library CSS 3D tilt pada mouse move
card.addEventListener('mousemove', (e) => {
  const { left, top, width, height } = card.getBoundingClientRect();
  const x = (e.clientX - left) / width - 0.5;  // -0.5 to 0.5
  const y = (e.clientY - top) / height - 0.5;
  card.style.transform = `
    perspective(1000px)
    rotateY(${x * 12}deg)
    rotateX(${-y * 12}deg)
    translateZ(8px)
  `;
  card.style.boxShadow = `
    ${x * -20}px ${y * -20}px 40px rgba(13,148,136,0.15)
  `;
});
```

---

### SECTION 6: PARTNERSHIP FORM — *Step-by-Step Kuesioner*

**Model:** 4 langkah interaktif menggunakan `<dialog>` native atau wizard multi-step dengan View Transition API untuk transisi antar langkah. Data dikirim ke Supabase table `contact_leads`.

```
LANGKAH 1: "Siapakah Anda?"
  ○ Pemilik Bisnis / UMKM
  ○ HRD / Recruiter
  ○ Investor / Mitra Institusional
  ○ Lembaga Pemerintah

LANGKAH 2: "Apa yang Anda butuhkan?"
  ☐ Website / Blog Informatif
  ☐ SEO & Konten Marketing
  ☐ Slide & Dokumen Eksekutif
  ☐ Analytics & Growth Audit

LANGKAH 3: "Tentang proyek Anda" (textarea singkat)

LANGKAH 4: "Cara terbaik menghubungi Anda?"
  - Nama → WhatsApp → Email
```

**Hack Konversi:** Menggunakan teknik **"Foot-in-the-Door"** — langkah pertama sangat mudah (pilih 1 dari 4), membuat pengguna sudah berkomitmen secara psikologis sebelum diminta mengisi data kontak.

---

## 📄 4. HALAMAN 2: TRUST BANK DIRECTORY (`/directory/[city]`)

### 🎯 Tujuan Strategis:
- **Traffic Engine:** pSEO — satu halaman per kota target menghasilkan ratusan URL terindeks
- **Leads Capture:** Tombol "Klaim Profil" = hot prospect
- **EEAT Signal:** Co-citation dengan entitas lokal terpercaya memperkuat Knowledge Graph Zadit
- **Monetisasi:** Slot afiliasi hosting/tools per entitas profil

### Layout Overview:

```
┌──────────────────────────────────────────────────────────────────────┐
│  Home > Bank Data Referensi > Jakarta Selatan                         │
│                                                                       │
│  BANK DATA & INDEKS REFERENSI KREDIBILITAS PUBLIK                    │
│  Regional: Jakarta Selatan                                            │
│  "Direktori profil entitas (Instansi, Bisnis, Agensi) terverifikasi" │
│                                                                       │
│  [ 🔍  Cari nama, kategori, atau layanan...          ] [Filter ▼]    │
│  [Semua] [Institusi] [Agensi] [Brand] [UMKM] [Layanan]               │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ [LOGO PLH]   │  │ [LOGO PLH]   │  │ [LOGO PLH]   │               │
│  │ Agensi       │  │ Klinik Medika│  │ Kantor Hukum │               │
│  │ Logistik     │  │ Utama        │  │ Hendra & Mitra│              │
│  │ Sejahtera    │  │              │  │              │               │
│  │ AGENCY       │  │ SERVICE      │  │ SERVICE      │               │
│  │ ⭐ 4.8/5.0   │  │ ⭐ 4.2/5.0   │  │ ⭐ 4.3/5.0   │               │
│  │ ✓ Verified   │  │ ⏳ Unverified │  │ ⏳ Unverified│               │
│  │ [Lihat Profil]│  │[Klaim Profil]│  │[Klaim Profil]│               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└──────────────────────────────────────────────────────────────────────┘
```

### Komponen Utama:

**A. Smart Search (Client-Side Filtering)**
- Input dengan debounce 150ms menggunakan `useDeferredValue` (React 19)
- Filter multi-kriteria: nama, kategori, status verifikasi
- Tidak ada server call → kecepatan instan

**B. Entity Card Grid**
| Elemen | Spesifikasi |
|--------|-------------|
| Logo Placeholder | SVG dengan inisial nama, `bg-gradient-to-br from-slate-700 to-slate-800` |
| Nama Entitas | `font-semibold text-slate-100 text-lg` |
| Badge Kategori | `font-mono text-xs uppercase rounded-sm bg-teal-900/30 text-teal-300` |
| Trust Score | Bintang menggunakan `★` glyph + numerik 4.x/5.0 |
| Status Chip | `✓ Terverifikasi` (teal) atau `⏳ Belum Diklaim` (amber) |
| CTA per Status | Verified: "Lihat Profil Lengkap" / Unverified: "Klaim Profil Ini ▶" |

**C. Overlay Detail Profil (View Transitions API)**

Klik kartu → slide-over panel dari kanan menggunakan View Transition API (cross-document feel dalam SPA):

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Kembali ke Direktori                                    [×] Tutup │
│                                                                      │
│ [LOGO BESAR]  Agensi Logistik Sejahtera                             │
│               Kategori: Agensi Logistik | Jakarta Selatan           │
│               ⏳ Status: Profil Belum Diklaim                        │
│                                                                      │
│ ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│ 📍 Alamat:   Jl. Gatot Subroto No. 45, Jakarta Selatan             │
│ 📞 Kontak:   -                                                       │
│ 🌐 Website:  -                                                       │
│                                                                      │
│ ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│  ▶▶ KLAIM PROFIL INI GRATIS                                          │
│  Apakah ini bisnis/instansi Anda? Klaim profil untuk:               │
│  • Perbarui informasi kontak & alamat                                │
│  • Sinkronkan ke peta pencarian Google                               │
│  • Integrasi strategi digital bersama Zadit Growth Architect         │
│  • Potensi lompatan konversi hingga +40%                            │
│                                                                      │
│  [ Isi Formulir Klaim Profil → ]                                     │
│                                                                      │
│ ──────────────────────────────────────────────────────────────────  │
│                                                                      │
│  🛠️ Rekomendasi Alat Terpilih untuk Bisnis Ini:                     │
│  [ Canva Pro — Desain Visual ] [ Niagahoster Premium — Hosting ]     │
│  (tautan afiliasi terenkripsi, komisi per klik/konversi)            │
└─────────────────────────────────────────────────────────────────────┘
```

**D. Form Klaim Profil (Leads Capture)**
```
Langkah 1: Verifikasi Kepemilikan
  - Nama Lengkap (wajib)
  - Jabatan di entitas tersebut (wajib)

Langkah 2: Data Kontak Aktif
  - Email bisnis (wajib)
  - Nomor WhatsApp aktif (wajib)

Langkah 3: Konfirmasi & Submit
  - Ringkasan data
  - Checkbox: "Saya adalah representasi sah entitas ini"
  - [Kirim & Klaim Profil]
```
→ Data masuk ke `directory_leads` Supabase + auto-WhatsApp template terbuka

**JSON-LD per Halaman Direktori:**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "LocalBusiness", "name": "...", "address": {...} },
    { "@type": "WebPage", "mainEntity": { "@type": "Person", "name": "Zadit" }, "mentions": [...] }
  ]
}
```
→ Teknik *Co-Citation Entity Graph* untuk menautkan otoritas Zadit ke entitas lokal.

---

## 📄 5. HALAMAN 3: AGC BLOG HUB (`/blog/[slug]`)

### 🎯 Tujuan:
- Trafik organik dari artikel bertarget keyword long-tail
- AEO/GEO Citation — format article yang ramah AI Overview
- Internal linking ke halaman portfolio dan direktori

### Layout:

```
┌──────────────────────────────────────────────────────────────────────┐
│ Wawasan Pertumbuhan / Digital Marketing / 17 Juni 2026               │
│                                                                       │
│ MENGAPA AI SEARCH MENGUBAH CARA KITA MENULIS KONTEN BISNIS           │
│ ──────────────────────────────────────────────────────────           │
│ Penulis: Muhammad Khoiruzzadittaqwa | 🕐 4 Menit | 📖 820 Kata      │
│                                                                       │
│ [Bagikan: WhatsApp · LinkedIn · X]                                   │
│ ─────────────────────────────────────────────────────────            │
│                                                                       │
│ KONTEN ARTIKEL (max-w-[680px])           │ SIDEBAR STICKY           │
│                                          │ ┌────────────────────┐   │
│ [Definition-Lead 200 kata pertama]       │ │ BUTUH IMPLEMENTASI │   │
│ "Answer Engine Optimization (AEO)        │ │ SISTEM SERUPA?     │   │
│  adalah sebuah metode taktis yang..."    │ │                    │   │
│                                          │ │ Seluruh ekosistem  │   │
│ [Konten utama artikel 800-1200 kata]     │ │ ini bisa dibangun  │   │
│                                          │ │ untuk bisnis Anda. │   │
│ [Tabel perbandingan data (HTML table)]   │ │                    │   │
│                                          │ │ [Hubungi Zadit →]  │   │
│ [QABlock: 5 FAQ dengan schema FAQPage]   │ └────────────────────┘   │
│                                          │                           │
│ [CTA Soft: "Terapkan strategi ini →"]    │ [Artikel Terkait]        │
└──────────────────────────────────────────────────────────────────────┘
```

**Komponen Artikel:**
| Komponen | Teknis | SEO/AEO Signal |
|----------|--------|---------------|
| Reading Progress Bar | CSS Scroll-Driven Animation `animation-timeline: scroll()` | UX — mengurangi bounce rate |
| Definition-Lead Block | 200 kata pertama dalam pola "X adalah Y yang Z" | Target kutipan AI Overview |
| Structured Table | `<table>` native HTML, bukan gambar | LLM-parseable comparison data |
| QABlock | `<details>/<summary>` + JSON-LD FAQPage | Featured Snippet + PAA dominance |
| Author Bio | Foto + nama lengkap + jabatan + link ke halaman utama | EEAT: Expertise + Authorship |
| Internal Links | 3-5 link ke halaman direktori, utility, dan portfolio | PageRank distribution |
| Breadcrumb | `BreadcrumbList` JSON-LD | SERP breadcrumb display |
| Dynamic Sidebar | `position: sticky, top: 1.5rem` — CTA konsultasi | Konversi dari traffic blog |

---

## 📄 6. HALAMAN 4: GROWTH UTILITY TOOL (`/utility/audit-engine`)

### 🎯 Tujuan:
- **Leads Magnet:** Input data → output laporan gratis → database prospek
- **Perceived Value:** Simulasi audit menunjukkan kompetensi Zadit secara langsung
- **Social Proof:** Tool gratis = bukti kepercayaan, bukan hanya klaim

### Layout:

```
┌──────────────────────────────────────────────────────────────────────┐
│ SISTEM EVALUASI AKSESIBILITAS WEB & KEJELASAN NARASI BISNIS          │
│ ──────────────────────────────────────────────────────────           │
│ Gratis. Instan. Tanpa Daftar.                                        │
│                                                                       │
│ ┌────────────────────────────────────────────────────────────────┐  │
│ │ Nama Anda / Instansi: ________________________________         │  │
│ │ Nomor WhatsApp Aktif:  ________________________________         │  │
│ │ URL Website Anda:      ________________________________         │  │
│ │                                                                │  │
│ │                  [ ▶ Jalankan Diagnostik Gratis ]              │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ── SETELAH SUBMIT: HASIL EVALUASI ──────────────────────────────    │
│                                                                       │
│ ┌────────────────────────────┐  ┌────────────────────────────┐      │
│ │    AKSESIBILITAS           │  │    STRUKTUR NARASI          │      │
│ │  ┌──────────────────┐      │  │  ┌──────────────────┐       │      │
│ │  │   Gauge: 78/100  │      │  │  │   Gauge: 62/100  │       │      │
│ │  │   ████████░░░░   │      │  │  │   ██████░░░░░░   │       │      │
│ │  └──────────────────┘      │  │  └──────────────────┘       │      │
│ │  🔶 Butuh Perbaikan        │  │  🔴 Terlalu Banyak Jargon  │      │
│ └────────────────────────────┘  └────────────────────────────┘      │
│                                                                       │
│ 📋 Rekomendasi Spesifik:                                             │
│ "Tombol navigasi Anda berukuran < 44px di layar ponsel.              │
│  Ini berpotensi kehilangan 35% calon pelanggan mobile."              │
│                                                                       │
│ [ Ambil Dokumen Rekomendasi Lengkap & Konsultasi Gratis →  WhatsApp ]│
└──────────────────────────────────────────────────────────────────────┘
```

**Simulasi Audit (Client-Side):**
```typescript
// Algoritma simulasi deterministik berdasarkan karakteristik URL
function simulateAuditScore(url: string): AuditResult {
  const scores = {
    accessibility: Math.floor(60 + (hashString(url) % 35)),
    narrative: Math.floor(50 + (hashString(url.split('.')[0]) % 45)),
  };
  return {
    ...scores,
    recommendations: generateRecommendations(scores),
    potentialLoss: Math.floor(25 + (100 - scores.accessibility) * 0.3),
  };
}
```

**Gauge Meter Visual:**
```css
/* SVG Gauge Meter dengan CSS animation */
.gauge-track { stroke: #334155; stroke-width: 8; fill: none; }
.gauge-fill  { stroke: #0d9488; stroke-width: 8; fill: none;
               stroke-dasharray: 251; /* circumference */
               stroke-dashoffset: calc(251 - (251 * var(--score)) / 100);
               transition: stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1); }
```

**Hack Konversi:** CTA akhir membuka WhatsApp dengan template pre-filled:
```
wa.me/62xxx?text=Halo+Zadit,+saya+[nama]+dari+[instansi].+Saya+sudah+coba+audit+engine+dan+ingin+konsultasi+lebih+lanjut+untuk+meningkatkan+skor+aksesibilitas+web+kami.
```
→ Prospek sudah datang dengan konteks lengkap, mengurangi friction komunikasi awal.

---

## 📄 7. HALAMAN 5: ADMIN COMMAND CENTER (`/admin/dashboard`)

### 🎯 Tujuan:
- Zero-code operations management
- Real-time monitoring leads & content
- Trigger manual untuk automation pipeline

### Layout:

```
┌──────────────────────────────────────────────────────────────────────┐
│  Z  COMMAND CENTER — ZADIT GROWTH OS          ● SISTEM: AKTIF       │
│  ──────────────────────────────────────────────────────────          │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐│
│  │ Total Entitas│  │ Leads Masuk  │  │ Artikel AGC  │  │ Trafik   ││
│  │   1,248      │  │    42        │  │    348       │  │ +12.4%   ││
│  │   Direktori  │  │   Minggu ini │  │   Aktif      │  │ 7 hari   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘│
│                                                                       │
│  [📁 Data Registry] [🤖 AI Control] [🔍 SEO Ops] [⚙️ Config]         │
│  ──────────────────────────────────────────────────────────          │
│                                                                       │
│  TAB AKTIF: DATA REGISTRY                                             │
│  ──────────────────────────────────────────────────────────          │
│                                                                       │
│  [+ Tambah Entitas] [↑ Import CSV] [↓ Export JSON] [🗺️ Scrape OSM]   │
│                                                                       │
│  Tabel Entitas (searchable, sortable):                               │
│  ID | Nama Entitas | Kota | Kategori | Status | Trust Score | Aksi  │
│  ──────────────────────────────────────────────────────────          │
│  ... | Agensi Logistik | Jakarta | AGENCY | Verified | 4.8 | [✏️🗑️] │
└──────────────────────────────────────────────────────────────────────┘
```

**4 Tab Admin:**

| Tab | Fungsi Utama | Komponen Kunci |
|-----|-------------|----------------|
| **📁 Data Registry** | CRUD entitas & kota direktori, import/export, trigger OSM scraper | DataTable (sortable), CSVParser, OSM Trigger Button |
| **🤖 AI Control** | Edit system prompt global, pilih model LLM, trigger manual AGC | Textarea, ModelSelector dropdown, RSS Feed list |
| **🔍 SEO Ops** | Trigger Google Indexing API, submit IndexNow, monitor sitemap | URL input, Indexing log, Sitemap preview |
| **⚙️ Config** | Edit `system_configs` tabel (key-value) secara inline | Editable table, save confirmation toast |

---

## 🧩 8. KOMPONEN SHARED & GLOBAL

### A. Komponen Atom (Dasar)

| Komponen | Teknis |
|----------|--------|
| `<Button>` | 3 variant: primary, secondary, ghost — semua dengan `aria-label` |
| `<Badge>` | 4 type: gold, teal, slate, red — untuk status & kategori |
| `<Input>` | `:user-valid` CSS untuk validasi real-time tanpa JS |
| `<Toast>` | Native `<dialog>` + `@starting-style` untuk animasi enter |
| `<Skeleton>` | CSS `@keyframes shimmer` untuk loading state placeholder |
| `<Tooltip>` | Native `<details>` dengan Popover API + Anchor Positioning |

### B. Komponen Molekul (Komposit)

| Komponen | Keterangan |
|----------|-----------|
| `<TiltCard>` | Wrapper dengan 3D CSS + vanilla JS mouse event |
| `<MetricCounter>` | GSAP counter dengan IntersectionObserver trigger |
| `<QABlock>` | FAQ accordion dengan FAQPage JSON-LD schema |
| `<ProfileCard>` | Kartu entitas direktori (nama, badge, score, CTA) |
| `<SidebarNav>` | Right-side sticky navigation dots dengan IntersectionObserver |
| `<ReadingProgress>` | CSS Scroll-Driven animation `animation-timeline: scroll()` |
| `<StepForm>` | Multi-step form wizard dengan View Transition API per step |

### C. Komponen Organisme (Fitur Lengkap)

| Komponen | Keterangan |
|----------|-----------|
| `<HeroSection>` | Seluruh hero section landing page |
| `<ProcessSection>` | GSAP horizontal scroll + 6 kartu + dot indicator |
| `<CaseStudiesSection>` | 2 studi kasus + metric counter + testimonial |
| `<ServicesGrid>` | Bento grid 5 layanan + TiltCard |
| `<PartnershipForm>` | 4-step questionnaire form |
| `<EntityOverlay>` | Slide-over profil direktori + form klaim |
| `<AuditEngine>` | Form diagnostik + SVG gauge + rekomendasi |
| `<AdminDataTable>` | Sortable/searchable table dengan inline actions |

---

## 🖼️ 9. ASSETS & RESOURCES

### A. Ikon (Lucide React)
```typescript
// Set ikon yang digunakan — konsisten dan semantik
import {
  Search, Map, PenLine, Zap, Presentation, BarChart3, // Process steps
  Globe, FileText, TrendingUp, Users, BookOpen, Target,  // Services
  CheckCircle, Clock, AlertCircle,                        // Status indicators
  ArrowRight, ExternalLink, ChevronDown,                  // Navigation
  Download, Upload, RefreshCw, Trash2, Edit3,             // Admin actions
  Star, Shield, Award,                                    // Trust indicators
} from 'lucide-react';
```

### B. Gambar & Media
| Asset | Sumber | Keterangan |
|-------|--------|-----------|
| OG Image (`og-profile.jpg`) | Generated (1200×630px) | Foto Zadit + nama + tagline |
| Favicon | SVG monogram "Z" | `<link rel="icon" type="image/svg+xml">` |
| Logo entities (placeholder) | SVG initials auto-generated | Dari nama entitas, gradient slate |
| Pattern BG (Hero) | CSS `background-image: repeating-linear-gradient(...)` | Subtle grid, 1px lines #334155 |
| Avatar Zadit | Real photo (JPG dioptimalkan WebP) | EEAT: Author authenticity |

### C. Font Loading (Google Fonts)
```html
<!-- Optimasi: preconnect + preload subset -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap">
```

### D. Animasi Assets (GSAP)
```typescript
// Lazy import GSAP hanya ketika komponen animasi diperlukan
const { gsap } = await import('gsap');
const { ScrollTrigger } = await import('gsap/ScrollTrigger');
gsap.registerPlugin(ScrollTrigger);
```
→ Mencegah GSAP (~60KB) mengasapi LCP pada mobile.

---

## 🔌 10. INTEGRASI EXTERNAL & SUMBER DATA

### A. Data Layer (Supabase)
| Table | Fungsi | Tipe Query |
|-------|--------|-----------|
| `cities` | Daftar kota target pSEO | `select *` dengan caching ISR |
| `entities` | Profil entitas direktori | `select * where city_id = ?` + filter |
| `articles` | Konten AGC blog | `select * order by published_at desc` |
| `utility_leads` | Hasil diagnostik audit | `insert` (server action) |
| `directory_leads` | Klaim profil direktori | `insert` (server action) |
| `system_configs` | Konfigurasi dinamis | `select * where key = ?` |

### B. API Eksternal
| API | Fungsi | Biaya |
|-----|--------|-------|
| **Overpass API (OSM)** | Data bisnis lokal real | Gratis |
| **ipapi.co** | Deteksi kota pengunjung | Gratis (1k/hari) |
| **Groq API** | Penulisan ulang AGC (primary) | Gratis (14.400 RPD) |
| **Gemini 1.5 Flash** | AGC fallback + analisis multimodal | Gratis (1.500 RPD) |
| **Google Indexing API** | Ping indexing halaman baru | Gratis |
| **IndexNow** | Submit ke Bing + Yandex | Gratis |
| **Vercel Analytics** | Traffic & performance real-time | Gratis (Hobby) |
| **GitHub Actions** | Cron PAA scraper + sitemap submit | Gratis |

---

## 🧠 11. STRATEGI PSIKOLOGI & MARKETING TERINTEGRASI

### A. Funnel Architecture (Konversi 3 Lapis)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AWARENESS                                   │
│  • Blog AGC (trafik keyword long-tail) → /blog/[slug]               │
│  • Trust Bank Directory (pSEO lokal) → /directory/[city]            │
│  • Sosial media share (artikel + direktori)                          │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        CONSIDERATION                                │
│  • Landing page scrollytelling → nilai, metodologi, bukti nyata     │
│  • Free Audit Tool → perceived value tinggi, bukan sekadar klaim    │
│  • Direktori "Klaim Profil" → bisnis menemukan Zadit via context    │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          CONVERSION                                  │
│  • WhatsApp CTA pre-filled (friction minimum)                       │
│  • Form partnership multi-step (Foot-in-the-Door)                   │
│  • Admin dashboard mengirimkan notif lead masuk → follow-up cepat  │
└─────────────────────────────────────────────────────────────────────┘
```

### B. Teknik Psikologi Per Komponen

| Teknik | Lokasi | Cara Kerja |
|--------|--------|-----------|
| **Social Proof** | Case Study metrics | Angka konkret lebih dipercaya dari klaim teks |
| **Authority Bias** | Jabatan testimonial (Dr., VP, Penasihat) | Otak menilai kredibilitas dari label otoritas |
| **Scarcity + Availability** | Badge "● Tersedia untuk Proyek" | Urgensi dan eksklusivitas |
| **Reciprocity** | Free audit tool | Memberi nilai gratis → rasa wajib membalas |
| **Foot-in-the-Door** | Form 4-langkah | Komitmen kecil dulu → komitmen besar kemudian |
| **Loss Aversion** | "Berpotensi kehilangan 35% pelanggan" | Otak 2x lebih terpengaruh kerugian vs keuntungan |
| **Processing Fluency** | Desain bersih, tipografi jelas | Konten mudah diproses → dipersepsikan lebih kredibel |
| **Anchoring** | "10+ Tahun | 50+ Proyek | 3 Institusional" | Angka pertama yang dilihat mempengaruhi persepsi nilai |

### C. EEAT & Entity Signaling Strategy

```
E — Experience:   Case studies konkret, bukan abstrak. Angka nyata, bukan kisaran.
E — Expertise:    JSON-LD "knowsAbout" array + "hasCredential" + "worksFor"
A — Authoritativeness: Co-citation di halaman direktori lokal terpercaya
T — Trust:        HTTPS, privacy policy, real contact info, no anonymous claims

Entity Graph Building:
zadit.dev (Website) →references→ Muhammad Khoiruzzadittaqwa (Person)
Person →worksFor→ Al-Bahjah Foundation (Organization)
Person →sameAs→ [LinkedIn, GitHub, Instagram] (Social Profiles)
DirectoryPage →mainEntity→ Person (co-citation loop)
```

### D. SEO/AEO/GEO Technical Stack

| Lapisan | Implementasi |
|---------|-------------|
| **SEO (Traditional)** | Sitemap dinamis, robots.txt adaptif, canonical tags, hreflang |
| **AEO (Answer Engine)** | Definition-Lead 200 kata, QABlock FAQPage schema, structured tables |
| **GEO (Generative)** | `public/llms.txt` manifest, Definition-Lead architecture, entity-rich JSON-LD |
| **pSEO (Programmatic)** | `/directory/[city]` template → ratusan halaman dari DB |
| **Social SEO** | OpenGraph tags, Twitter Card, WhatsApp preview meta |
| **Local SEO** | `LocalBusiness` schema, co-citation entity graph per kota |

---

## ✅ 12. CHECKLIST IMPLEMENTASI

### Phase 1 — Design System (Hari 1)
- [ ] Setup `globals.css` dengan semua design tokens (Tailwind v4 `@theme`)
- [ ] Import Google Fonts dengan optimasi preload
- [ ] Buat `src/lib/utils.ts` (cn, clsx helpers)
- [ ] Buat `src/components/ui/` — Button, Badge, Input, Toast, Skeleton

### Phase 2 — Landing Page (Hari 2-3)
- [ ] `layout.tsx` — SmoothScroll wrapper + JSON-LD ProfilePage + SEO metadata
- [ ] `HeroSection` — stagger text + system status panel + stat bar
- [ ] `ProcessSection` — GSAP horizontal scroll (6 cards)
- [ ] `CaseStudiesSection` — TiltCard + metric counter
- [ ] `ServicesGrid` — Bento grid (5 services)
- [ ] `PartnershipForm` — 4-step form + Supabase insert
- [ ] `SidebarNav` — IntersectionObserver sticky dots

### Phase 3 — Feature Pages (Hari 4-6)
- [ ] `/directory/[city]` — Supabase fetch + filter + Card Grid + EntityOverlay
- [ ] `/utility/audit-engine` — Form + SVG Gauge + simulation + WhatsApp CTA
- [ ] `/blog/[slug]` — Article layout + QABlock + sticky sidebar

### Phase 4 — Admin & SEO (Hari 7-9)
- [ ] `/admin/dashboard` — 4 tabs (Data, AI, SEO, Config) + middleware auth
- [ ] `src/app/sitemap.xml/route.ts` — Dynamic sitemap dari Supabase
- [ ] `src/middleware.ts` — AI crawler detection + llms.txt routing
- [ ] `public/llms.txt` — AI manifest Zadit
- [ ] GitHub Actions workflow — PAA scraper + sitemap submit

---

*Dokumen ini adalah panduan strategis lengkap yang harus menjadi referensi tunggal bagi seluruh proses perancangan dan pembangunan Zadit Growth Portfolio V2.*
