# SYSTEM ARCHITECTURE & SPECIFICATION: PRESENCEOS AUDIT ENGINE V2
**Document Version**: 2.1.0 *(Updated: 2026-06-22 — Bug Fixes & Resilience Hardening)*  
**Target Repository**: `zaditprodakwah/myprofile`  
**Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase · Vercel Serverless  
**Status**: Active Development — see Section 9 for known bugs fixed

---

## 1. BSD (BUSINESS SPECIFICATION DOCUMENT)

### 1.1 Core Business Value Proposition
PresenceOS Audit Engine V2 adalah mesin pertumbuhan hidup (*live growth engine*) B2B yang dirancang untuk menjembatani kegunaan publik (*public utility*) dengan akuisisi klien internal. 
* **B2B Lead Acquisition (Magnet Lead)**: Mengizinkan pemilik bisnis dan marketer Indonesia untuk memasukkan domain mereka secara gratis dan menerima audit performa, SEO, keamanan, dan MarTech stack dalam < 30 detik.
* **Authority Building (EEAT Showcase)**: Menunjukkan keahlian teknis Zadit sebagai Full-Stack Growth Architect secara nyata melalui kualitas sistem analisis yang dibangun sendiri (bukan sekadar portofolio statis).
* **Data Enrichment Engine**: Setiap pencarian publik yang dilakukan oleh visitor bertindak sebagai data crawler yang memperkaya database B2B Sovereign Directory milik PresenceOS secara otomatis dan murah.

### 1.2 User Journey & Conversion Funnel
```
[ Pengunjung Publik ] ──► [ Input Domain di Form ] ──► [ Jalankan Audit Engine ]
                                                                │
                                                                ▼
[ Form Claim Profil Bisnis ] ◄── [ Lihat Laporan Detail ] ◄── [ Tampilkan Hasil Skor ]
            │
            ▼
[ Simpan ke database utility_leads ] ──► [ Notifikasi WhatsApp / Email & Follow Up B2B ]
```

### 1.3 Free Tier and Monetization Triggers
* **Free Tier (Public)**: 
  * 3x audit gratis per domain per hari (dibatasi IP/Browser fingerprint & localStorage).
  * Laporan performa dasar, status SEO on-page, daftar rekomendasi utama.
* **Premium Trigger (Leads Capture)**:
  * **Unlock PDF Export**: Pengguna wajib memasukkan Email/WhatsApp bisnis untuk mengekspor laporan lengkap ke format PDF (menghasilkan baris di tabel `utility_leads`).
  * **Claim Business Profile**: Integrasi ke database B2B Directory. Jika pemilik bisnis ingin memverifikasi/mengklaim profil mereka untuk meningkatkan *trust rating* di direktori PresenceOS, mereka harus mendaftar atau menghubungi admin.

---

## 2. PRD (PRODUCT REQUIREMENTS DOCUMENT)

### 2.1 Key Features & Scope
* **Layer 1 (Deterministic Script)**:
  * Memanggil **Google PageSpeed Insights API (REST)** secara synchronous untuk mendapatkan metrik Core Web Vitals (LCP, CLS, TTFB, FCP) secara akurat.
  * Programmatic HTML fallback crawler jika API key tidak tersedia atau API mengalami rate limit.
  * static regex parsing untuk mendeteksi:
    * **MarTech Tags**: Google Tag Manager (GTM), Meta Pixel, Google Analytics (gtag), LinkedIn Insight.
    * **Security Headers**: HSTS, Content-Security-Policy (CSP), X-Frame-Options.
    * **Malware/Judi Online**: Deteksi kata kunci bermasalah (seperti slot gacor, slot online, judi) dan redirect link mencurigakan untuk melindungi reputasi.
    * **Technical SEO**: Tag robots.txt, canonical tag, hreflang, struktur JSON-LD Schema.
* **Layer 2 (Semantic Judgment)**:
  * Mengirim metadata terkompresi (judul, meta description, teks heading dominan, dan kategori bisnis) ke **Gemini 1.5 Flash**.
  * AI mengevaluasi keselarasan konten website dengan klaim bisnis, menentukan kesenjangan kompetitif (*gap analysis*), dan memberikan rekomendasi strategis tertulis berbahasa Indonesia yang ramah pengguna awam.
* **Sovereign Directory Integration**:
  * Output audit secara otomatis memperbarui tabel `directory_entities` jika domain terdaftar, meng-update `trust_score`, `martech_stack_json`, dan `security_flags_json`.

### 2.2 Functional Requirements

#### FR-01: Input Domain Validation
Sistem harus memvalidasi format input domain secara real-time pada client-side (regex URL) sebelum mengirim request POST ke server-side.

#### FR-02: Two-Layer Audit Pipeline
Pipeline audit serverless harus berjalan berurutan:
1. **Deterministic Phase**: Static fetch + PSI API Call.
2. **Semantic Phase**: Gemini Flash LLM enrichment.
3. **Database Projection Phase**: Update snapshots, scores, dan recommendations.
4. **Data Sync Phase**: Sync metadata ke direktori entitas jika domain terdaftar.

#### FR-03: PDF Export Generation
Client-side atau Serverless API dapat memicu ekspor PDF yang indah dari dashboard hasil audit setelah pengguna mengisi form Lead.

### 2.3 Non-Functional Requirements

#### NFR-01: Performance Budget
* **Page Load (LCP)**: < 2.5 detik pada halaman `/utility/audit-engine`.
* **Execution Timeout**: Seluruh API pipeline audit harus selesai dalam waktu < 10 detik (batas serverless Vercel Hobby).
* **Caching**: Cache respons PageSpeed Insights di Supabase selama 24 jam untuk domain yang sama demi menghemat kuota API Google.

#### NFR-02: Security & RLS
* **Row-Level Security (RLS)**: Tabel `utility_leads` harus diamankan. Publik hanya dapat melakukan `INSERT`. Data email dan kontak hanya dapat dibaca oleh admin terautentikasi (`admin_logs` mencatat setiap akses data sensitif).

---

## 3. ERD (ENTITY RELATIONSHIP DIAGRAM)

```
                       ┌────────────────┐
                       │    entities    │
                       └───────┬────────┘
                               │ 1
                               │
                               │ 1..N
                       ┌───────▼────────┐
                       │ organizations  │
                       └───────┬────────┘
                               │ 1
                               │
                               │ 1..N
                       ┌───────▼────────┐
                       │    domains     │
                       └───────┬────────┘
                               │ 1
                               │
                               │ 1..N
                       ┌───────▼────────┐
                       │     jobs       │
                       └───────┬────────┘
                               │ 1
                               ├─── 1..N ───┐
                               │            │
                               ▼ 1..N       ▼ 1..N
                       ┌───────┴────────┐ ┌──┴─────────────┐
                       │   audit_runs   │ │   job_events   │
                       └───────┬────────┘ └────────────────┘
                               │ 1
                               │
                               │ 1
                       ┌───────▼────────┐
                       │   snapshots    │
                       └───────┬────────┘
                               │ 1
                               ├─── 1:1 ────┐
                               │            │
                               ▼ 1          ▼ 1..N
                       ┌───────┴────────┐ ┌──┴─────────────┐
                       │     scores     │ │recommendations │
                       └────────────────┘ └────────────────┘

┌─────────────────┐             ┌──────────────┐             ┌──────────────┐
│  utility_leads  │             │  saved_audits│             │  page_views  │
└─────────────────┘             └──────────────┘             └──────────────┘
```

### Relationship Constraints:
1. `entities` ──1:N──► `organizations`: Relasi dasar kepemilikan profil bisnis.
2. `organizations` ──1:N──► `domains`: Sebuah organisasi B2B bisa memiliki lebih dari satu domain (misalnya subdomain staging atau regional).
3. `domains` ──1:N──► `jobs`: Setiap permintaan audit baru mendaftarkan satu record `jobs`.
4. `jobs` ──1:N──► `audit_runs`: Pelacakan eksekusi pipeline (mendukung retry).
5. `jobs` ──1:N──► `job_events`: Log event append-only (Event Sourcing).
6. `audit_runs` ──1:1──► `snapshots`: Menyimpan hasil mentah data audit (Lighthouse JSON).
7. `snapshots` ──1:1──► `scores`: Nilai komposit dan per-kategori (0-100).
8. `snapshots` ──1:N──► `recommendations`: Daftar tindakan perbaikan (Rule-based + AI).

---

## 4. DATABASE SCHEMA (SUPABASE POSTGRES)

Berikut adalah struktur tabel yang digunakan untuk sistem Audit Engine V2. Modifikasi bersifat *additive* untuk mendukung MarTech tag, deteksi judi, dan data intelijen B2B.

```sql
-- UP MIGRATION: 20260622040000_audit_engine_v2.sql

-- 4.1 Tambah kolom baru ke snapshots jika belum ada
ALTER TABLE snapshots
  ADD COLUMN IF NOT EXISTS martech_stack_json      jsonb       DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS security_headers_json    jsonb       DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS safety_flags_json        jsonb       DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS seo_technical_json       jsonb       DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ai_narrative_summary     text;

-- 4.2 Tambah kolom metadata pengayaan di organizations (untuk directory B2B)
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS trust_score              integer     DEFAULT 50,
  ADD COLUMN IF NOT EXISTS martech_detected_json    jsonb       DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS security_status_json     jsonb       DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS business_nature_summary  text,
  ADD COLUMN IF NOT EXISTS last_audited_at          timestamptz;

-- 4.3 Memastikan indeks performa query snapshot & score
CREATE INDEX IF NOT EXISTS idx_snapshots_job_id ON snapshots(job_id);
CREATE INDEX IF NOT EXISTS idx_scores_snapshot_id ON scores(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_snapshot_id ON recommendations(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_orgs_last_audited ON organizations(last_audited_at);

-- 4.4 Set RLS Policies untuk saved_audits & utility_leads
ALTER TABLE saved_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_leads ENABLE ROW LEVEL SECURITY;

-- Izinkan publik memasukkan Leads (Form submit)
CREATE POLICY "Allow public insert to utility_leads" ON utility_leads
  FOR INSERT WITH CHECK (true);

-- Hanya admin (user tersertifikasi) yang bisa melihat data lead
CREATE POLICY "Only authenticated admin can read utility_leads" ON utility_leads
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 5. SOURCES & RESOURCES MAPPING

Arsitektur Audit Engine V2 mengintegrasikan filosofi dan mekanisme dari 9 referensi eksternal berikut untuk dieksekusi secara efisien di lingkungan Serverless Edge:

| Sumber Referensi | Fitur yang Diadopsi | Metode Implementasi di Vercel (Cost-Effective) |
|---|---|---|
| **Google PageSpeed API (v5)** / **Lighthouse** | Core Web Vitals (LCP, CLS, TTFB), best practices, accessibility. | Menggunakan `fetch` request ke REST endpoint `pagespeedonline.v5.runPagespeed` dengan key API. Jika gagal, fallback ke internal crawling. |
| **Crawlscope** | Struktur penjelajahan halaman, ekstraksi XML Sitemap, deteksi canonical & robots.txt. | Programmatic HTTP parsing sitemap menggunakan regex ringan dan deteksi string header canonical. |
| **PySec-Audit** | Deteksi kerentanan server dasar, cross-origin link, dan malware. | Regex statis terhadap markup HTML untuk mencari link keluar tak aman (`target="_blank"` tanpa `rel="noopener"`), script eksternal berbahaya, dan kata kunci "slot gacor" / judi. |
| **ChoopScoop** | Tag / MarTech stack detection (FB Pixel, GTM, Google Analytics). | Regex statis mendeteksi kode inisialisasi tag: `gtag(`, `connect.facebook.net`, `googletagmanager.com/gtm.js`. Menghindari browser headless. |
| **Website-Audit-Software** | Skor komposit, pengelompokan tingkat keparahan isu (Low, Medium, High). | Algoritma pembobotan numerik di `scoring.ts` dan pemetaan prioritas isu di `recommendation.ts`. |
| **tenra-Scout** | Pemetaan metadata website ke profil bisnis / penemuan kategori. | Layer 2 Gemini 1.5 Flash menerima teks ringkasan untuk mengkategorikan bisnis secara otomatis. |
| **seo-audits-toolkit** | Audit data struktur (JSON-LD Schema) dan link broken dasar. | Regex pencarian tag `<script type="application/ld+json">` dan ekstraksi datanya untuk verifikasi format. |
| **seo-audit-skill** | Analisis konten semantik dan audit keselarasan keyword. | LLM (Gemini 1.5 Flash) mengevaluasi apakah judul halaman dan deskripsi SEO selaras dengan isi teks utama situs. |

---

## 6. UI/UX SPECIFICATIONS (AESTHETICS & MOTION)

### 6.1 Color Palette & Design Tokens
* **Background Dark**: `#0f172a` (Slate 900) - Memberikan kesan premium dan kokoh.
* **Card Surface**: `#1e293b` (Slate 800) - Tampilan kontras untuk panel metrik.
* **Accent Teal**: `#0d9488` (Teal 600) / Hover: `#14b8a6` (Teal 500) - Warna utama untuk interaksi utama (CTA) dan indikator sukses.
* **Accent Amber**: `#d97706` (Amber 600) - Digunakan untuk status warning/kategori sedang.
* **Accent Red**: `#dc2626` (Red 600) - Untuk isu kritikal / deteksi malware.

### 6.2 Visual Layout & Page Structure
Halaman Audit `/utility/audit-engine/[domain]` terbagi dalam 3 panel utama:

```
┌────────────────────────────────────────────────────────┐
│  🌐 domain.com         Diaudit: 22 Jun 2026   [RE-AUDIT]│
├────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌────────────────────────────────┐ │
│ │  COMPOSITE      │ │  Performance  ████████░░ 78%   │ │
│ │  SCORE          │ │  SEO          ██████████ 92%   │ │
│ │    [ 78 ]       │ │  A11y         █████████░ 81%   │ │
│ │   ScoreRing     │ │  Best Pract.  ███████░░░ 67%   │ │
│ └─────────────────┘ └────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ TABS: [ Rekomendasi ]  [ MarTech ]  [ Keamanan ]       │
├────────────────────────────────────────────────────────┤
│ 🔴 HIGH: Perbaiki struktur heading H1                  │
│ 🟡 MED:  Tambahkan meta description                    │
│ 🟢 LOW:  Aktifkan HTTPS untuk keamanan maksimal        │
└────────────────────────────────────────────────────────┘
```

### 6.3 Micro-interactions & Smooth Motion
* **ScoreRing In-Animation**: Menggunakan **Framer Motion** untuk menganimasikan `stroke-dashoffset` lingkaran dari 0 ke nilai skor sesungguhnya dengan efek spring (`stiffness: 80`).
* **Debounced Form Input**: Form audit menahan tombol submit jika domain tidak valid secara regex, dengan goyangan halus (shake animation) jika tombol ditekan saat status invalid.
* **Lottie-like Progress Loader**: Saat loading audit berjalan, teks akan berganti secara dinamis menggunakan stagger animation GSAP:  
  `Connecting...` ──► `Collecting DOM...` ──► `Analyzing Performance...` ──► `Gemini Semantic Check...` ──► `Done!`
* **Collapsible Mobile Accordion**: Pada perangkat mobile, detail rekomendasi teknis dibungkus ke dalam accordion vertikal yang mulus guna menghindari halaman yang terlalu panjang (*scroll fatigue*).

---

## 7. SYSTEM INTEGRATION ARCHITECTURE

```
[ Client UI Form ] ──(POST /api/v2/audit)──► [ Next.js Route Handler ]
                                                      │
                                                      ├── Emits 'AuditRequested'
                                                      ▼
                                            [ Audit Pipeline Engine ]
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼ (Layer 1: Deterministic)                                    ▼ (Layer 2: Semantic)
          [ PSI REST API / crawler ]                                          [ Gemini 1.5 Flash API ]
                       │                                                             │
                       ├── Performance Metrics                                       ├── AI Gap Analysis
                       ├── Regex MarTech Tags                                        └── Recommendations
                       └── Regex Security Checks                                     │
                       │                                                             │
                       └──────────────────────────────┬──────────────────────────────┘
                                                      │ All data collected
                                                      ▼
                                            [ Supabase Ingestion ]
                                                      ├── Insert snapshot & scores
                                                      └── Update directory_entities (Sync)
                                                      │
                                                      ▼
[ Final UI Report ] ◄────────────────────(Return JSON Response)──────────────────────┘
```

---

## 8. INPUT - PROCESS - OUTPUT (IPO) MATRIX

| Modul Pipeline | Input (I) | Proses (P) | Output (O) |
|---|---|---|---|
| **Form Ingestion & Validator** | URL Domain, User Email (opsional) | 1. Sanitasi input. <br>2. Validasi regex domain. <br>3. Daftarkan entri di tabel `jobs` & `job_events`. | Job ID, Domain ID, status `QUEUED`. |
| **Layer 1: Deterministic Analyzer** | Target URL | 1. Ambil data dari Google PageSpeed Insights REST API. <br>2. Crawl HTML fallback jika gagal. <br>3. Ekstrak robots.txt & headers. <br>4. Analisis script tag (GTM, FB Pixel). <br>5. Deteksi malware/judi lewat regex. | Nilai CWV, MarTech JSON, Security Headers JSON, Safety Flags. |
| **Layer 2: Semantic Analyzer** | Title, Meta Description, Heading, Safety Flags | 1. Ringkas konten halaman. <br>2. Kirim payload ke Gemini Flash. <br>3. Bandingkan deskripsi dengan teks utama. <br>4. Buat rekomendasi bisnis adaptif. | Narasi rekomendasi, Business Summary, Competitive Gap analysis. |
| **Scoring & Recommendation Engine** | Metrik Mentah Layer 1 & 2 | 1. Hitung skor numerik per kategori (0-100). <br>2. Hitung composite score rata-rata. <br>3. Petakan anjuran perbaikan ke level prioritas (High, Med, Low). | Baris baru di tabel `scores`, daftar rekomendasi di tabel `recommendations`. |
| **Sovereign Sync Worker** | Domain ID, Skor Audit, MarTech Stack | 1. Cari kecocokan domain di `directory_entities`. <br>2. Jika cocok, perbarui `trust_score`, `martech_detected_json`, dan `last_audited_at`. | Pengayaan metadata profil B2B direktori. |

---

## 9. BUG FIXES & RESILIENCE HARDENING (v2.1.0)

### 9.1 Bugs Ditemukan & Status Perbaikan

| # | Bug | Root Cause | Status | File(s) |
|---|---|---|---|---|
| BUG-01 | `failed to emit event AuditRequested: insert or update table "job_events"` | `job_events.job_id` adalah FK ke `jobs.id`. Sebelumnya, event dikirim sebelum baris `jobs` dibuat di database, menyebabkan constraint violation. | ✅ **FIXED** | `api/audit-speed/route.ts`, `api/v2/audit/route.ts` |
| BUG-02 | Audit CV/PDF memaksa pengguna mengisi field URL website | Validasi `handleSubmit` di frontend selalu mengecek `formData.url`, padahal tab PDF dan Social tidak butuh URL. | ✅ **FIXED** | `utility/audit-engine/page.tsx` |
| BUG-03 | `snapshots.collected_at` tidak ada di schema | Collector menulis ke kolom `collected_at`, tetapi schema awal hanya mendefinisikan `captured_at`. | ✅ **FIXED** | Migration `20260622050000_audit_engine_v2_schema.sql` |
| BUG-04 | API keys/third-party gagal → seluruh audit crash | Satu tahap pipeline yang gagal (mis. PSI API timeout) melempar error ke atas dan menghentikan seluruh proses, tanpa fallback. | ✅ **FIXED** | `api/audit-speed/route.ts` |

### 9.2 Prinsip Ketangguhan (Resilience Principles)

> [!IMPORTANT]
> **Sistem harus tetap berjalan meski third-party terputus.** Tidak ada satu titik kegagalan (*single point of failure*) yang boleh menghentikan alur audit sepenuhnya.

Implementasi prinsip ketangguhan:

1. **Per-Stage try/catch**: Setiap tahap pipeline (Collector, Analyzer, Scoring, Recommendation) dibungkus `try/catch` independen. Kegagalan satu tahap menghasilkan `warning[]` bukan `throw`.
2. **Graceful Degradation**: Jika seluruh Collector gagal (website tidak bisa dijangkau), sistem mengembalikan skor estimasi `50/100` dengan pesan UX-friendly — bukan error 500.
3. **Fallback Score Response Schema**:
```json
{
  "success": true,
  "fallback": true,
  "warnings": ["Tidak dapat terhubung ke website target. Menggunakan estimasi bawaan."],
  "data": { "accessibility": 50, "performance": 50, "seo": 50, "bestPractices": 50, "narrative": 50 },
  "message": "Audit menggunakan estimasi bawaan karena website tidak dapat dijangkau."
}
```
4. **UX Fallback Banner**: Frontend menampilkan banner kuning (Amber) saat menerima `fallback: true`, menginformasikan pengguna bahwa skor adalah estimasi tanpa menyebabkan kebingungan atau panik.
5. **PSI API Caching (24h)**: Respons PageSpeed Insights di-cache di tabel `audit_engine_cache` per domain selama 24 jam — melindungi dari rate limit API dan duplikasi permintaan.

### 9.3 Urutan Buat Data yang Benar (Order of Operations)

```
Sebelum Fix (BUG-01):                        Setelah Fix:
─────────────────────                         ──────────────────────────────────────────
1. emit AuditRequested  ← ❌ FK violation     1. upsert domain_name ke tabel domains
2. insert jobs                                2. insert job ke tabel jobs
                                              3. emit AuditRequested ← ✅ FK terpenuhi
                                              4. run pipeline per-stage (isolated)
```

### 9.4 Per-Tab Form Validation (Frontend)

Validasi kini bersifat kontekstual per tab aktif:

| Tab Aktif | Field Wajib | Field Opsional |
|---|---|---|
| `web` | Nama, WhatsApp, URL Website | Email |
| `social` | Nama, WhatsApp, Username/URL Sosial | Email |
| `pdf` | Nama, WhatsApp, File PDF | Email |

### 9.5 Migration Terbaru

File: [`20260622050000_audit_engine_v2_schema.sql`](../../supabase/migrations/20260622050000_audit_engine_v2_schema.sql)

Mencakup:
- `snapshots.collected_at` (additive fix)
- Kolom MarTech/security di `snapshots`, `organizations`, `directory_entities`
- RLS pada tabel `jobs`, `job_events`, `snapshots`, `scores`, `recommendations`
- Tabel cache baru `audit_engine_cache` untuk PSI response (TTL 24 jam)
- Indeks performa tambahan
