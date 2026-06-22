# 🎨 BLUEPRINT_DESIGN_SYSTEM.md
# Design System & Component Library Upgrade
# Repo: zaditprodakwah/myprofile (PresenceOS)
# Juni 2026

---

## 1. FILOSOFI DESIGN SYSTEM

**"Warm Corporate Editorial"** — kepercayaan institusional bertemu kehangatanlokal Indonesia.

Setiap token, komponen, dan pattern dioptimasi untuk 3 tujuan:
1. **Konversi** — CTA jelas, friction minimal, trust signal kuat
2. **Autoritas** — tampilan profesional yang EEAT-friendly
3. **Performa** — tidak ada library CSS tambahan, semua Tailwind v4

---

## 2. DESIGN TOKENS

### 2.1 Warna (globals.css)

```css
@layer base {
  :root {
    /* Brand Dark */
    --color-brand-dark:    #0f172a;
    --color-brand-mid:     #1e293b;
    --color-brand-border:  #334155;

    /* Light Surfaces */
    --color-alabaster:     #f8fafc;
    --color-offwhite:      #f1f5f9;

    /* Accent */
    --color-teal:          #0d9488;
    --color-teal-glow:     #14b8a6;
    --color-teal-subtle:   #ccfbf1;

    --color-gold:          #d97706;
    --color-gold-muted:    #f59e0b;
    --color-gold-subtle:   #fef3c7;

    /* Status */
    --color-success:       #16a34a;
    --color-warning:       #ca8a04;
    --color-error:         #dc2626;
    --color-info:          #0284c7;

    /* Text */
    --color-text-primary:  #0f172a;
    --color-text-muted:    #475569;
    --color-text-faint:    #94a3b8;
    --color-text-inverse:  #f1f5f9;
  }
}
```

### 2.2 Tipografi

```css
/* Import di layout.tsx via next/font */
/* Plus Jakarta Sans: 400, 600, 700, 800 */
/* Inter: 400, 500 */
/* JetBrains Mono: 400 */

@layer base {
  h1 { @apply font-display text-5xl font-bold tracking-tight leading-tight; }
  h2 { @apply font-display text-4xl font-bold tracking-tight; }
  h3 { @apply font-display text-2xl font-semibold; }
  h4 { @apply font-display text-xl font-semibold; }
  p  { @apply font-body text-base leading-relaxed text-[--color-text-muted]; }
  .label-mono { @apply font-mono text-xs uppercase tracking-widest; }
}
```

### 2.3 Shadows & Blur

```css
--shadow-card:   0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
--shadow-hover:  0 8px 32px rgba(13,148,136,0.15), 0 2px 8px rgba(0,0,0,0.08);
--shadow-glow:   0 0 40px rgba(13,148,136,0.2);
--blur-glass:    backdrop-filter: blur(12px);
```

---

## 3. COMPONENT LIBRARY

### 3.1 Atom Components

#### Button
```tsx
// Variants: primary | secondary | ghost | danger
// Sizes: sm | md | lg
<Button variant="primary" size="md">
  Audit Sekarang
</Button>

// Kelas Tailwind:
// primary: bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl px-6 py-3
// secondary: border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-xl px-6 py-3
// ghost: text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg px-4 py-2
```

#### Badge
```tsx
// Variants: teal | gold | slate | success | warning | error
<Badge variant="gold">Premium</Badge>
// gold: bg-amber-100 text-amber-700 font-mono text-xs px-2 py-0.5 rounded-full
```

#### Card
```tsx
// 3 varian: default | elevated | dark | glass
// dark: bg-slate-900 border border-slate-700
// glass: bg-white/5 backdrop-blur border border-white/10
// elevated: bg-white shadow-[--shadow-hover] hover:-translate-y-1 transition-transform
```

#### ScoreRing
```tsx
// Circular SVG progress untuk skor audit 0-100
// Warna: 0-49 merah, 50-74 kuning, 75-100 hijau/teal
// Animasi: stroke-dashoffset dari 0 → nilai aktual saat mount
```

#### Skeleton
```tsx
// Placeholder loading untuk setiap komponen berat
// animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl
```

### 3.2 Molecule Components

#### ArticleCard
```
┌─────────────────────────────────┐
│  [Featured Image]               │
│  LABEL-MONO · kategori          │
│  Judul Artikel yang Panjang...  │
│  excerpt singkat 2 baris...     │
│  ─────────────────────────────  │
│  📅 12 Jun 2026  ⏱ 5 min  👁 1.2k│
└─────────────────────────────────┘
Props: article, showImage, showStats
```

#### AuditScoreCard
```
┌─────────────────────────────────┐
│  [DOMAIN]          [ScoreRing]  │
│  ████████░░ Performance: 78     │
│  ██████████ SEO: 92             │
│  ████████░░ Accessibility: 81   │
│  ██████░░░░ Best Practices: 67  │
│  ─────────────────────────────  │
│  [Detail] [Simpan] [Ekspor PDF] │
└─────────────────────────────────┘
```

#### DataMetricTile
```
┌──────────────────┐
│  LABEL-MONO      │
│  72.4k           │ ← animated counter
│  ↑ +2.3%         │ ← tren
└──────────────────┘
```

#### FilterBar
```
[Semua] [SEO] [Marketing] [Tech] [AI]  🔍 Search...
State di URL: ?category=seo&q=keyword (SSR-friendly)
```

### 3.3 Organism Components (baru/upgrade)

#### HeroSection (upgrade)
- Tambah animated typed text (CSS animation, tanpa library)
- Social proof strip: "X domain diaudit minggu ini"
- CTA dual: [Mulai Audit Gratis] + [Lihat Portfolio]

#### BlogListingGrid (baru)
- Masonry grid 3-col desktop, 2-col tablet, 1-col mobile
- Infinite scroll via Intersection Observer
- Filter state di URL params

#### AuditEngineForm (upgrade)
- Input domain dengan validasi real-time (regex URL)
- Progress steps: Collecting → Analyzing → Scoring → Done
- Animated step indicator

#### SovereignDashboard (upgrade)
- Bento grid layout (seperti Apple) 
- Tiles: IHSG, USD/IDR, Inflasi, Suku Bunga, AI Insight
- Sparkline mini charts (SVG native, tanpa chart library)

#### AdminDataTable (baru)
- Sort, filter, pagination
- Bulk actions (delete, publish, archive)
- Row-level status badge

#### DirectorySearch (upgrade)
- Search dengan debounce 300ms
- Filter: kota, kategori, rating, verified only
- Map preview (embed Google Maps iframe, free)

---

## 4. LAYOUT PATTERNS

### 4.1 Page Shell
```
┌────────────────────────────────────────┐
│  Header (sticky, shrinks on scroll)    │
│  ─────────────────────────────────── │
│  <main>                                │
│    {children}                          │
│  </main>                               │
│  ─────────────────────────────────── │
│  Footer                                │
└────────────────────────────────────────┘
```

### 4.2 Dashboard Shell (Admin)
```
┌──────────┬─────────────────────────────┐
│ Sidebar  │  Topbar (breadcrumb + user) │
│ Nav      │  ────────────────────────── │
│ (240px)  │  <main>                     │
│          │    {page content}           │
│          │  </main>                   │
└──────────┴─────────────────────────────┘
Mobile: Sidebar jadi bottom sheet
```

### 4.3 Article Shell
```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  ──────────────────────────────────────── │
│  [Hero Image full-width]                    │
│  ┌─────────────────────────┬─────────────┐  │
│  │ Konten artikel (900px)  │ Sidebar TOC │  │
│  │ progress bar atas       │ sticky      │  │
│  └─────────────────────────┴─────────────┘  │
│  [Related Articles]                         │
│  Footer                                     │
└─────────────────────────────────────────────┘
```

---

## 5. ANIMASI & MOTION

### 5.1 CSS Scroll-Driven (tanpa JS)
```css
/* Reveal section saat scroll */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.reveal {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

/* Progress bar scroll */
.scroll-progress {
  transform-origin: left;
  animation: scaleX linear;
  animation-timeline: scroll();
}
```

### 5.2 GSAP (untuk komponen kompleks)
```tsx
// Horizontal pin di ProcessSection
// Stagger word reveal di Hero
// Animated counter di MetricTile
// Semua sudah ada di package.json: gsap ^3.15.0
```

### 5.3 Framer Motion (untuk page transition)
```tsx
// sudah ada di package.json: framer-motion ^12.40.0
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
```

### 5.4 Lenis Smooth Scroll
```tsx
// sudah ada: lenis ^1.3.23
// Inisialisasi di layout.tsx SmoothScroll client component
```

---

## 6. DARK MODE

Strategi: **class-based dark mode** via Tailwind (`dark:` prefix).
Toggle disimpan di `localStorage` dan diaplikasikan di `<html>` sebelum hydration (via script tag inline di `<head>` untuk menghindari flash).

```tsx
// Komponen: src/components/ThemeToggle.tsx
// Semua komponen wajib punya variant dark:
// bg-white dark:bg-slate-900
// text-slate-900 dark:text-slate-100
// border-slate-200 dark:border-slate-700
```

---

## 7. AKSESIBILITAS (WCAG 2.1 AA)

```
- Kontras warna: minimum 4.5:1 untuk body text, 3:1 untuk large text
- Focus ring: ring-2 ring-teal-500 ring-offset-2 (visible, tidak dihapus)
- Keyboard nav: Tab order logis, semua interaktif dapat dicapai keyboard
- Skip to content: link tersembunyi di atas header
- ARIA: setiap icon button punya aria-label
- Motion: semua animasi dihormati prefers-reduced-motion
- Alt text: semua gambar punya alt deskriptif
- Form: setiap input punya <label> eksplisit atau aria-label
```
