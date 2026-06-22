# ANTI-AI-SLOP SKILL
# Untuk: Antigravity IDE / Claude Code / Kiro / AI Coding Agent apapun
# Repo: zaditprodakwah/myprofile (PresenceOS — Zadit Growth Engine)
# Aktifkan skill ini sebelum generate atau merevisi UI, copy, atau UX flow apapun.

---

## PRODUCT BRIEF (Baca ini dulu sebelum menyentuh satu baris pun)

```
Produk       : PresenceOS — Zadit Growth Engine
Pemilik      : Muhammad Khoiruzzadittaqwa (Zadit)
Tone         : Otoritatif tapi hangat. Seperti konsultan senior yang bicara ke teman.
               Tidak formal kaku. Tidak sok akrab. Presisi & percaya diri.
Bahasa       : Bahasa Indonesia utama. Istilah teknis boleh Inggris jika tidak ada padanan
               yang tidak canggung.
Audience     :
  1. UMKM / Startup Founder — tidak teknis, butuh hasil nyata, bukan jargon
  2. Pemilik Bisnis Lokal — ingin terlihat di Google, tidak tahu caranya
  3. HRD / Headhunter — butuh bukti konkret, bukan klaim
  4. Partnership / Investor — butuh kredibilitas, bukan hype
Visual Ref   : Linear, Stripe, Raycast — presisi, minimal, setiap elemen punya alasan
Design Token : Slate-900 (#0f172a) + Teal-600 (#0d9488) + Amber-600 (#d97706)
               Font: Plus Jakarta Sans (heading) + Inter (body) + JetBrains Mono (label)
```

---

## BAGIAN 1: ANTI-SLOP UI — ATURAN VISUAL

### Yang WAJIB dilakukan:

**Tipografi**
- Hierarki heading harus bisa dibaca tanpa warna: H1 → H2 → H3 berbeda ukuran signifikan
- Letter-spacing heading: `-0.02em` sampai `-0.01em` (tight, bukan default 0)
- Line-height body: `1.7` — tidak terlalu rapat, tidak terlalu longgar
- Jangan campur lebih dari 2 font dalam satu halaman

**Warna & Kontras**
- Satu aksen dominan per halaman. Jika pakai teal, tidak perlu tambah ungu atau oranye sekaligus
- Kontras teks minimum 4.5:1 (body), 3:1 (large text)
- Warna background harus punya suhu — jangan abu-abu netral murni, pakai `slate` (warm-cool)

**Spacing**
- Base unit 8px. Semua spacing adalah kelipatan 8 (8, 16, 24, 32, 48, 64, 96)
- Section gap desktop: 96px. Mobile: 64px. Jangan kurangi ini — whitespace adalah luxury
- Komponen kartu: padding internal minimum 24px

**Layout**
- Grid 12-kolom, max-width konten 1200px, artikel 900px
- Jangan center semua elemen — asimetri yang terarah terlihat lebih premium
- Gunakan visual weight untuk arahkan mata: elemen terbesar = paling penting

### Yang DILARANG KERAS:

```
❌ bg-gradient-to-br sebagai hero background (terlalu generic, semua AI pakai ini)
❌ Tiga pricing card sebagai layout default
❌ Purple / violet accent tanpa alasan brand
❌ Inter font tanpa Plus Jakarta Sans di heading (terlihat developer-default)
❌ Box-shadow drama berlebihan (shadow besar tidak selalu premium)
❌ Bounce animation pada elemen non-interactive
❌ Emoji sebagai ikon UI (pakai Lucide atau SVG, sesuai yang sudah ada di package.json)
❌ Terlalu banyak border-radius berbeda dalam satu halaman (pilih satu: 8px atau 16px)
❌ Card dengan image placeholder abu-abu di semua slot
❌ Glassmorphism di semua komponen sekaligus
```

### Cek sebelum submit kode:

- [ ] Desain ini bisa ditebak milik brand Zadit tanpa melihat logo?
- [ ] Ada 1 elemen visual yang tidak bisa dihasilkan AI generik?
- [ ] Sudah cek tampilan di 375px (mobile), 768px (tablet), 1280px (desktop)?
- [ ] Setiap animasi punya alasan (bukan sekadar "agar terlihat hidup")?
- [ ] `prefers-reduced-motion` sudah direspek?

---

## BAGIAN 2: ANTI-SLOP COPY — ATURAN TEKS

### Prinsip Dasar

**1. Manfaat dulu, fitur kemudian**
```
❌ "Platform Audit SEO Canggih dengan AI"
✅ "Tahu persis kenapa situsmu tidak muncul di Google — dalam 30 detik"
```

**2. Bicara ke satu orang, bukan ke massa**
```
❌ "Kami membantu bisnis mencapai pertumbuhan digital yang optimal"
✅ "Kamu sudah punya produk bagus. Yang kurang: orang yang tepat belum menemukannya."
```

**3. Spesifik mengalahkan umum**
```
❌ "Hasil terbukti dan terukur"
✅ "+127% organic traffic dalam 90 hari — tanpa iklan berbayar"
```

**4. Kata kerja aktif, bukan nominalisasi**
```
❌ "Dilakukan analisis terhadap domain Anda"
✅ "Kami analisis domainmu"
```

**5. Error message harus manusiawi**
```
❌ "Error 500. Please try again."
✅ "Audit gagal dijalankan. Coba masukkan domain tanpa 'https://', atau cek koneksimu."
```

### Kata-kata yang DILARANG muncul di copy produk:

```
JARGON KOSONG: robust, seamless, leverage, synergy, ecosystem, paradigm,
               cutting-edge, next-level, world-class, state-of-the-art,
               revolutionary, game-changing, holistic, comprehensive solution

BASA-BASI AI: "Certainly!", "Great question!", "As an AI...",
              "I'm here to help", "Let me be clear"

CTA GENERIK:  "Get Started", "Learn More", "Submit", "Click Here",
              "Discover", "Explore Now" (tanpa konteks spesifik)

FRASA HOLLOW: "Platform terdepan", "Solusi terbaik", "Kualitas premium",
              "Layanan profesional", "Tim berpengalaman"
```

### Template CTA yang benar:

```
Format: [Kata Kerja] + [Hasil/Objek Spesifik]

Audit Engine:   "Audit Domain Sekarang"
Lead Form:      "Minta Konsultasi Gratis"
Blog:           "Baca Artikel Lengkapnya"
Directory:      "Lihat Profil Bisnis"
Simpan:         "Simpan Hasil Audit"
Ekspor:         "Unduh Laporan PDF"
Cron trigger:   "Jalankan RSS Refresh"
```

### Microcopy wajib ada:

```tsx
// Input placeholder — harus berupa contoh nyata
<input placeholder="contoh: tokopedia.com" />   // ✅
<input placeholder="Masukkan domain Anda" />    // ❌

// Helper text — kapan dibutuhkan
<p className="text-xs text-muted">Tanpa http:// atau www</p>

// Loading state — harus informatif
"Menganalisis performa..." // ✅
"Loading..."               // ❌

// Empty state — harus arahkan ke tindakan
"Belum ada artikel. Tulis yang pertama →" // ✅
"No data found."                          // ❌

// Success state — konfirmasi + langkah berikut
"Audit selesai! Scroll untuk melihat rekomendasi." // ✅
"Success!"                                          // ❌
```

---

## BAGIAN 3: ANTI-SLOP UX FLOW

### State machine minimal setiap komponen interaktif:

```
Setiap fitur harus punya SEMUA state berikut:
  idle      → tampilan default
  loading   → skeleton atau spinner (bukan blank)
  success   → feedback eksplisit + langkah berikut
  error     → pesan manusiawi + solusi
  empty     → ilustrasi/teks + CTA arah tindakan
```

### Navigation & Information Architecture:

```
❌ Jangan taruh lebih dari 5 item di nav utama
❌ Jangan nested dropdown lebih dari 2 level
✅ Label nav = kata benda yang jelas (Blog, Audit, Direktori, Dashboard)
✅ Breadcrumb di semua halaman selain homepage
✅ Active state nav selalu visible
```

### Form design:

```
✅ Label di atas input, bukan placeholder-as-label
✅ Validasi inline (saat blur, bukan saat submit)
✅ Error message di bawah field yang bermasalah, bukan di atas form
✅ Submit button disabled saat loading (cegah double submit)
✅ Autofocus pada input pertama di modal/form dialog
```

---

## BAGIAN 4: CARA MENGGUNAKAN SKILL INI

### Workflow yang benar:

```
STEP 1 — BRIEF (sekali, simpan permanen)
Pastikan brief di bagian atas sudah dibaca.
Jika konteks berubah, update brief dulu baru mulai.

STEP 2 — EXPLORE (jangan langsung implement)
Untuk komponen baru: minta 2–3 arah berbeda dulu.
"Berikan 2 pendekatan layout untuk hero section ini — jangan implement dulu"

STEP 3 — SPECIFY (baru implement)
Pilih arah, lalu:
"Gunakan pendekatan #1, implementasi dengan token warna yang sudah ada di globals.css"

STEP 4 — AUDIT (sebelum commit)
Jalankan checklist di bawah.
```

### Checklist Pre-Commit (wajib lewati semua):

**Visual**
- [ ] Tidak ada warna baru di luar design tokens yang sudah ada
- [ ] Spacing mengikuti kelipatan 8px
- [ ] Mobile 375px tidak ada overflow horizontal
- [ ] Dark mode (jika ada) tidak ada teks yang hilang

**Copy**
- [ ] Semua headline → manfaat, bukan nama fitur
- [ ] Semua button label → kata kerja aktif + objek spesifik
- [ ] Semua error message → deskripsi masalah + solusi
- [ ] Tidak ada kata dari daftar larangan di atas
- [ ] Placeholder input berisi contoh nyata

**Interaksi**
- [ ] Loading state ada
- [ ] Error state ada
- [ ] Empty state ada
- [ ] Focus ring visible (keyboard navigation)
- [ ] `aria-label` pada semua icon button

**Distinctiveness Test**
- [ ] Screenshot halaman ini → apakah bisa ditebak milik PresenceOS tanpa logo?
- [ ] Ada minimal 1 keputusan desain yang tidak bisa dihasilkan AI dari prompt generik?

---

## BAGIAN 5: CONTOH PROMPT YANG BENAR

### Untuk generate komponen baru:
```
Buat komponen ArticleCard untuk blog PresenceOS.

Brief:
- Audience: pemilik bisnis Indonesia, tidak terlalu teknis
- Tone: informatif, hangat, otoritatif
- Token: slate-900, teal-600, amber-600 (sudah di globals.css)
- Font: Plus Jakarta Sans heading, Inter body

Tampilkan: gambar, kategori (label mono uppercase), judul, excerpt 2 baris,
tanggal + waktu baca + view count di bawah.

Anti-slop requirements:
- Jangan pakai gradient sebagai background kartu
- Hover state: translate-y -4px + shadow teal (bukan scale)
- Kategori badge: teal subtle background, bukan colorful random
- Judul: font-semibold, line-clamp-2, tracking-tight
- Tidak ada elemen dekoratif tanpa fungsi

Output: TypeScript strict, Tailwind v4, accessible (img alt, aria).
```

### Untuk review/audit komponen existing:
```
Audit komponen [NamaKomponen] dengan checklist anti-slop berikut:
1. Ada visual yang terlihat AI-generic? Identifikasi spesifik.
2. Ada copy yang hollow/jargon? Kutip dan perbaiki.
3. State machine lengkap? (idle, loading, error, empty, success)
4. Aksesibel? (contrast, focus, aria)
5. Consistent dengan token warna/spacing yang ada?

Berikan daftar temuan + rekomendasi perbaikan konkret.
```

### Untuk revisi copy:
```
Tulis ulang copy berikut agar:
- Bicara ke satu orang (bukan massa)
- Manfaat dulu, fitur kemudian
- Bahasa Indonesia natural, tone percaya diri tapi tidak sombong
- Tidak ada jargon dari daftar larangan
- Maksimal [X] kata

Copy asli:
"[paste copy yang mau direvisi]"

Konteks: [section mana, audience siapa, tujuan apa]
```
