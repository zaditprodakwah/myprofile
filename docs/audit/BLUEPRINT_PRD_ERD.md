# 📋 BLUEPRINT_PRD_ERD.md
# Product Requirements Document + ERD + Schema Peningkatan
# Repo: zaditprodakwah/myprofile (PresenceOS)
# Juni 2026

---

## 1. PRODUCT REQUIREMENTS DOCUMENT (PRD)

### 1.1 Visi Produk

> **PresenceOS** adalah platform intelijen kehadiran digital yang mengubah data publik menjadi insight bisnis yang dapat ditindaklanjuti — untuk pemilik bisnis, marketer, dan peneliti di Indonesia.

### 1.2 Target Pengguna

| Segmen | Pain Point | Solusi PresenceOS |
|--------|-----------|-------------------|
| Pemilik UMKM / Brand | Tidak tahu posisi digital mereka | Audit Engine → skor instan + rekomendasi |
| B2B Marketer | Riset kompetitor manual & lambat | Directory + Sovereign Explorer |
| Konten Kreator | Tidak tahu performa channel | Video Auditor (YouTube) |
| Peneliti / Analyst | Data makro tersebar di banyak sumber | Sovereign Explorer (FRED + BPS + Markets) |
| Zadit sendiri | Showcase kompetensi & lead generation | Homepage + Blog + Rate Card |

### 1.3 Epics & User Stories

#### Epic 1: Audit Engine
- US-01: Sebagai pengunjung, saya bisa audit domain manapun dalam < 30 detik dan mendapat skor + rekomendasi.
- US-02: Sebagai pengguna terdaftar, saya bisa menyimpan histori audit dan membandingkan antar waktu.
- US-03: Sebagai pengguna, saya bisa ekspor hasil audit ke PDF.

#### Epic 2: Blog & Konten
- US-04: Sebagai pengunjung, saya bisa mencari artikel berdasarkan topik, kategori, dan keyword.
- US-05: Sebagai pembaca, saya melihat estimated reading time, progress bar, dan related articles.
- US-06: Sebagai Zadit, konten baru dari RSS/AGC otomatis terpublikasi via cron job.

#### Epic 3: Directory B2B
- US-07: Sebagai pengunjung, saya bisa cari bisnis berdasarkan kota, kategori, dan rating.
- US-08: Sebagai pemilik bisnis, saya bisa claim profil bisnis saya.
- US-09: Setiap halaman directory terindeks Google (pSEO, 1 halaman per entitas).

#### Epic 4: Sovereign Explorer
- US-10: Sebagai analyst, saya bisa lihat data IHSG, inflasi, kurs, dan suku bunga dalam 1 dashboard.
- US-11: Data diperbarui otomatis via cron (BPS, FRED, markets API).
- US-12: Saya bisa lihat AI insight dari Gemini atas data terkini.

#### Epic 5: Admin Panel
- US-13: Sebagai Zadit, saya bisa kelola artikel, entitas, dan jobs dari satu dashboard.
- US-14: Saya bisa melihat metrik performa (audit runs, leads, page views) secara real-time.
- US-15: Saya bisa trigger manual cron jobs dari UI.

### 1.4 Non-Functional Requirements

| Kategori | Target |
|----------|--------|
| Performance | LCP < 2.5s, TBT < 200ms, CLS < 0.1 |
| Availability | 99.9% uptime (Vercel SLA) |
| Security | RLS Supabase aktif semua tabel, no secret di client |
| Aksesibilitas | WCAG 2.1 AA |
| SEO | Core Web Vitals hijau, JSON-LD schema semua halaman |
| Budget | $0/bulan (full free tier) |

---

## 2. ENTITY RELATIONSHIP DIAGRAM (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PresenceOS — ERD v2                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   entities   │──1:N──│  organizations   │──1:N──│   domains    │
│─────────────│       │─────────────────│       │─────────────│
│ id (uuid PK) │       │ id (uuid PK)    │       │ id (uuid PK) │
│ type         │       │ entity_id (FK)  │       │ org_id (FK)  │
│ name         │       │ name            │       │ domain       │
│ slug         │       │ category        │       │ is_primary   │
│ created_at   │       │ city            │       │ verified_at  │
└──────────────┘       │ rating          │       └──────┬───────┘
                       │ claimed_at      │              │
                       └──────────────────┘              │ 1:N
                                                         ▼
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│     jobs     │──1:N──│   audit_runs     │──1:N──│  snapshots   │
│─────────────│       │─────────────────│       │─────────────│
│ id (uuid PK) │       │ id (uuid PK)    │       │ id (uuid PK) │
│ domain_id FK │       │ job_id (FK)     │       │ run_id (FK)  │
│ status       │       │ status          │       │ domain       │
│ created_at   │       │ started_at      │       │ lighthouse_json│
│ updated_at   │       │ completed_at    │       │ seo_metrics  │
└──────┬───────┘       │ error_message   │       │ captured_at  │
       │               └──────────────────┘       └──────┬───────┘
       │ 1:N                                             │ 1:N
       ▼                                                 ▼
┌──────────────┐                               ┌──────────────────┐
│  job_events  │                               │     scores       │
│─────────────│                               │─────────────────│
│ id (uuid PK) │                               │ id (uuid PK)    │
│ job_id (FK)  │                               │ snapshot_id (FK)│
│ event_type   │                               │ performance     │
│ payload json │                               │ seo             │
│ created_at   │                               │ accessibility   │
└──────────────┘                               │ best_practices  │
                                               │ composite       │
                                               └──────┬───────────┘
                                                      │ 1:N
                                                      ▼
                                               ┌──────────────────┐
                                               │ recommendations  │
                                               │─────────────────│
                                               │ id (uuid PK)    │
                                               │ snapshot_id (FK)│
                                               │ category        │
                                               │ priority        │
                                               │ title           │
                                               │ description     │
                                               │ effort_level    │
                                               └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│    articles      │──N:M──│ article_tags     │
│─────────────────│       │─────────────────│
│ id (uuid PK)    │       │ article_id (FK)  │
│ slug            │       │ tag              │
│ title           │       └──────────────────┘
│ category        │
│ content (md)    │       ┌──────────────────┐
│ excerpt         │       │  utility_leads   │
│ author          │       │─────────────────│
│ published_at    │       │ id (uuid PK)    │
│ reading_time    │       │ email           │
│ is_agc          │       │ source_page     │
│ view_count      │       │ intent          │
│ seo_json        │       │ created_at      │
└──────────────────┘       └──────────────────┘

┌──────────────────────────────────────────┐
│        sovereign_data_cache              │
│─────────────────────────────────────────│
│ id (uuid PK)                            │
│ source      (bps|fred|markets|news|esg) │
│ key         (inflasi|ihsg|usdidR|...)   │
│ value_json                              │
│ fetched_at                              │
│ expires_at                              │
└──────────────────────────────────────────┘
```

---

## 3. SCHEMA PENINGKATAN (MIGRASI BARU)

### Migration: 20260622_v2_upgrade.sql

```sql
-- MIGRATION_ID: 20260622_v2_upgrade
-- DEPENDENCIES: 20260622000000_update_utility_leads_schema
-- PURPOSE: Tambah kolom/tabel untuk fitur v2: audit history, reading_time, view_count
-- BACKWARD_COMPATIBILITY_NOTE: Additive only

-- UP

-- 3.1 Tambah kolom articles yang kurang
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS reading_time    int           DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count      int           DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_agc          boolean       DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_image  text,
  ADD COLUMN IF NOT EXISTS seo_json        jsonb         DEFAULT '{}';

-- 3.2 Tabel tags artikel
CREATE TABLE IF NOT EXISTS article_tags (
  article_id  uuid    NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag         text    NOT NULL,
  PRIMARY KEY (article_id, tag)
);

-- 3.3 Saved audits (untuk user history)
CREATE TABLE IF NOT EXISTS saved_audits (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email   text        NOT NULL,
  domain       text        NOT NULL,
  snapshot_id  uuid        REFERENCES snapshots(id),
  label        text,
  created_at   timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_saved_audits_user ON saved_audits(user_email);

-- 3.4 Page view telemetry (tanpa cookie, privacy-first)
CREATE TABLE IF NOT EXISTS page_views (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  path        text        NOT NULL,
  referrer    text,
  country     text,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(created_at);

-- 3.5 Admin activity log
CREATE TABLE IF NOT EXISTS admin_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  action      text        NOT NULL,
  target_type text,
  target_id   text,
  metadata    jsonb       DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE article_tags  ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_audits  ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs    ENABLE ROW LEVEL SECURITY;

-- Public read articles tags
CREATE POLICY "public read article_tags" ON article_tags FOR SELECT USING (true);
-- Saved audits: owner only
CREATE POLICY "owner read saved_audits" ON saved_audits FOR SELECT USING (user_email = current_user);
-- Page views: insert only (anon), admin read
CREATE POLICY "anon insert page_views" ON page_views FOR INSERT WITH CHECK (true);

-- DOWN (untuk rollback)
-- DROP TABLE IF EXISTS admin_logs, page_views, saved_audits, article_tags;
-- ALTER TABLE articles DROP COLUMN IF EXISTS reading_time, DROP COLUMN IF EXISTS view_count, ...;

-- VERIFICATION_SQL
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'reading_time';
-- SELECT tablename FROM pg_tables WHERE tablename IN ('article_tags','saved_audits','page_views','admin_logs');
```

---

## 4. ARSITEKTUR DATA FLOW

```
User Request
     │
     ▼
Next.js App Router (Vercel Edge)
     │
     ├── Server Component → Supabase (direct, SSR)
     │        └── articles, entities, snapshots
     │
     ├── Route Handler → External APIs (FRED, BPS, Markets)
     │        └── Cache di sovereign_data_cache (TTL 1 jam)
     │
     ├── Route Handler → Gemini Flash
     │        └── AI insight, recommendations, AGC
     │
     └── Cron Jobs (Vercel Cron, free tier: 1/day)
              ├── /api/cron/rss      → fetch RSS → insert articles
              ├── /api/cron/seo-refresh → update snapshots
              ├── /api/cron/ai-graph → update sovereign cache
              └── /api/cron/worker-db → cleanup & maintenance
```
