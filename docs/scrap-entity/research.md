Riset: Arsitektur & Infrastruktur Google Maps / Business Scraper + Agregat
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  1. PILIHAN UTAMA: OFFICIAL API vs SCRAPING
  
  ┌────────────────┬────────────────────────────────────────┬────────────────────────────┐
  │                │ Official API                           │ Scraping                   │
  ├────────────────┼────────────────────────────────────────┼────────────────────────────┤
  │ Legal          │ ✅ Sesuai ToS                          │ ⚠️ Grey area               │
  ├────────────────┼────────────────────────────────────────┼────────────────────────────┤
  │ Biaya          │ Gratis s.d. 10k req/bln, lalu berbayar │ Gratis (butuh infra/proxy) │
  ├────────────────┼────────────────────────────────────────┼────────────────────────────┤
  │ Data freshness │ Real-time                              │ Depends crawler speed      │
  ├────────────────┼────────────────────────────────────────┼────────────────────────────┤
  │ Scale          │ Mudah                                  │ Butuh proxy rotation       │
  ├────────────────┼────────────────────────────────────────┼────────────────────────────┤
  │ Data points    │ Terbatas schema API                    │ 36+ fields                 │
  └────────────────┴────────────────────────────────────────┴────────────────────────────┘
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  2. GOOGLE MAPS PLATFORM — OFFICIAL API (2026)
  
  │ Pricing berubah total sejak March 2025 — $200/bln credit sudah tidak ada.
  
  ┌─────────────────────────────────┬─────────────┬─────────────┐
  │ SKU                             │ Free/bln    │ Setelah itu │
  ├─────────────────────────────────┼─────────────┼─────────────┤
  │ Places Text Search (Essentials) │ 10.000 req  │ $5/1.000    │
  ├─────────────────────────────────┼─────────────┼─────────────┤
  │ Place Details (Essentials)      │ 10.000 req  │ $5/1.000    │
  ├─────────────────────────────────┼─────────────┼─────────────┤
  │ Geocoding                       │ 10.000 req  │ $5/1.000    │
  ├─────────────────────────────────┼─────────────┼─────────────┤
  │ Nearby Search (Pro)             │ 5.000 req   │ lebih mahal │
  ├─────────────────────────────────┼─────────────┼─────────────┤
  │ Dynamic Maps (JS)               │ 10.000 load │ $7/1.000    │
  └─────────────────────────────────┴─────────────┴─────────────┘
  
  Strategi untuk free tier maksimal:
  
  - Gunakan FieldMask — request hanya field yang dibutuhkan, hemat kuota
  - Session tokens untuk autocomplete (1 session = 1 call, bukan per keystroke)
  - Cache response di Supabase (cek ToS: koordinat & nama boleh di-cache, beberapa field
  tidak)
  - Hindari Dynamic Maps → pakai Static Maps ($2 vs $7)
  
  Docs resmi: https://developers.google.com/maps/billing-and-pricing/pricing
   (https://developers.google.com/maps/billing-and-pricing/pricing)
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  3. OPEN SOURCE SCRAPER (GRATIS, LOKAL/CLI)
  
  🥇 gosom/google-maps-scraper — REKOMENDASI UTAMA
  
  - ⭐ 4.5k stars, aktif maintained
  - Bahasa: Go — performa tinggi ~120 places/menit
  - Interface: CLI + Web UI + REST API + SaaS self-hosted
  - Output: CSV, JSON, PostgreSQL, S3, LeadsDB, custom plugin
  - 36 data points: nama, alamat, telepon, website, rating, review, email, koordinat, jam
  buka, popular times, price range, dst.
  - Docker ready, Kubernetes support, proxy rotation built-in
  - AI Agent skill: bisa dipanggil dari Antigravity IDE / Claude Code
  
  # Quick CLI via Docker
  docker run \
    -v gmaps-playwright-cache:/opt \
    -v "$PWD/queries.txt:/queries.txt:ro" \
    -v "$PWD/output:/out" \
    gosom/google-maps-scraper \
    -input /queries.txt -results /out/results.csv \
    -depth 1 -email -c 4 -exit-on-inactivity 3m
  
  # Web UI lokal
  docker run -v "$PWD/data:/gmapsdata" -p 8080:8080 \
    gosom/google-maps-scraper -data-folder /gmapsdata
  
  Grid search (untuk coverage area luas, bypass 120 result limit):
  
  ./google-maps-scraper \
    -input queries.txt -results out.csv \
    -grid-bbox "-6.2088,106.8456,-6.1800,106.9000" \  # Jakarta Pusat
    -grid-cell 0.5 -zoom 16 -depth 1 -c 4
  
  Repo: https://github.com/gosom/google-maps-scraper
   (https://github.com/gosom/google-maps-scraper)
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  Alternatif Open Source Lain
  
  ┌──────────────────────────────────────┬────────────────┬───────┬──────────────────────┐
  │ Repo                                 │ Lang           │ Stars │ Notes                │
  ├──────────────────────────────────────┼────────────────┼───────┼──────────────────────┤
  │ omkarcloud/google-maps-scraper       │ Python         │ 3k+   │ 50+ data points,     │
  │ (https://github.com/omkarcloud/googl │                │       │ enrichment, email,   │
  │ e-maps-scraper)                      │                │       │ social profiles      │
  ├──────────────────────────────────────┼────────────────┼───────┼──────────────────────┤
  │ noworneverev/google-maps-scraper     │ Python         │ ~500  │ High-performance,    │
  │ (https://github.com/noworneverev/goo │                │       │ tanpa API key        │
  │ gle-maps-scraper)                    │                │       │                      │
  ├──────────────────────────────────────┼────────────────┼───────┼──────────────────────┤
  │ HasData/google-maps-scraper          │ Python/Node    │ 200+  │ Selenium +           │
  │ (https://github.com/HasData/google-m │                │       │ Playwright stealth   │
  │ aps-scraper)                         │                │       │                      │
  ├──────────────────────────────────────┼────────────────┼───────┼──────────────────────┤
  │ w33ladalah/google-places-scraper-cli │ Node/Puppeteer │ -     │ CLI, cross-platform  │
  │ (https://github.com/w33ladalah/googl │                │       │                      │
  │ e-places-scraper-cli)                │                │       │                      │
  └──────────────────────────────────────┴────────────────┴───────┴──────────────────────┘
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  4. CLOUD / MANAGED SCRAPING API (BERBAYAR, ADA FREE TIER)
  
  ┌──────────────┬────────────────┬───────────────────┬──────────────────────────────────┐
  │ Layanan      │ Free Tier      │ Harga setelah itu │ Notes                            │
  ├──────────────┼────────────────┼───────────────────┼──────────────────────────────────┤
  │ Outscraper   │ Beberapa free  │ Pay-as-you-go     │ Sudah dipakai di repo            │
  │              │ credits        │                   │ (scripts/outscraper-cli.js)      │
  ├──────────────┼────────────────┼───────────────────┼──────────────────────────────────┤
  │ SerpAPI      │ 100 req/bln    │ $50/bln (5k req)  │ Reliable, Fortune 500 clients    │
  ├──────────────┼────────────────┼───────────────────┼──────────────────────────────────┤
  │ HasData      │ 1.000 free     │ ~$0.002/req       │ Google Maps Search API           │
  │              │ credits        │                   │                                  │
  ├──────────────┼────────────────┼───────────────────┼──────────────────────────────────┤
  │ Scrap.io     │ 100 leads      │ ~$49/bln          │ Country-scale, tanpa keyword     │
  │              │ trial          │                   │                                  │
  ├──────────────┼────────────────┼───────────────────┼──────────────────────────────────┤
  │ Apify        │ $5 free        │ Usage-based       │ 1.500+ pre-built scrapers,       │
  │              │ credits/bln    │                   │ $0.50/1k results                 │
  ├──────────────┼────────────────┼───────────────────┼──────────────────────────────────┤
  │ SearchAPI.io │ 100 req/bln    │ Varies            │ Real-time Maps data              │
  └──────────────┴────────────────┴───────────────────┴──────────────────────────────────┘
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  5. ARSITEKTUR YANG DIREKOMENDASIKAN UNTUK REPO INI
  
  ┌─────────────────────────────────────────────────────────────┐
  │                    PresenceOS Directory                      │
  └─────────────────────────────────────────────────────────────┘
           │
           ├── MODE 1: SEED AWAL (CLI/Lokal, sekali pakai)
           │   gosom/google-maps-scraper --docker
           │   Input: queries.txt (kategori bisnis + kota Indonesia)
           │   Output: CSV → import ke Supabase (entities + organizations)
           │   Tool: scripts/outscraper-cli.js (sudah ada) atau gosom
           │
           ├── MODE 2: ENRICHMENT API (server-side, on-demand)
           │   /api/sovereign/datarakyat → Places API (Essentials, 10k free)
           │   FieldMask: displayName,formattedAddress,rating,phoneNumbers
           │   Cache di Supabase (TTL 30 hari untuk data statis)
           │
           └── MODE 3: REFRESH BERKALA (Vercel Cron, 1x/hari)
               /api/cron/worker-db → re-enrich entitas stale > 30 hari
               Batch 50 entitas/hari → tetap di free tier Places API
  
  Schema Supabase yang perlu ditambahkan:
  
  ALTER TABLE organizations ADD COLUMN IF NOT EXISTS
    place_id       text,          -- Google Place ID untuk re-enrich
    maps_url       text,          -- Link Google Maps
    popular_times  jsonb,         -- Peak hours
    last_scraped   timestamptz;   -- Untuk cron refresh logic
  
  CREATE INDEX IF NOT EXISTS idx_org_last_scraped ON organizations(last_scraped);
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  6. PROXY (JIKA SCRAPING SKALA BESAR)
  
  ┌────────────┬─────────────────┬───────────────────────┐
  │ Layanan    │ Free            │ Harga                 │
  ├────────────┼─────────────────┼───────────────────────┤
  │ Webshare   │ Free plan (ada) │ $2.99/bln basic       │
  ├────────────┼─────────────────┼───────────────────────┤
  │ Evomi      │ -               │ $0.49/GB, 150+ negara │
  ├────────────┼─────────────────┼───────────────────────┤
  │ BrightData │ Trial           │ Enterprise            │
  └────────────┴─────────────────┴───────────────────────┘
  
  Untuk skala kecil (direktori kota-kota Indonesia) → tidak perlu proxy, gosom dengan default
  settings cukup.
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  7. INTEGRASI KE REPO (NEXT STEPS)
  
  Priority  Task
  ──────────────────────────────────────────────────────────
  P0        Jalankan gosom CLI untuk seed data bisnis Indonesia
            (mulai 5-10 kota prioritas, per kategori)
  
  P0        Import CSV hasil → supabase migration seed script
  
  P1        Tambah /api/sovereign/places → wrapper Places API
            dengan FieldMask + cache Supabase
  
  P2        Cron job refresh: re-enrich entitas stale 30 hari
            (/api/cron/worker-db yang sudah ada)
  
  P3        Admin UI: trigger manual scrape job dari dashboard
            (call gosom REST API jika self-hosted, atau Outscraper)
  
  ───────────────────────────────────────────────────────────────────────────────────────────
  
  TL;DR
  
  Untuk repo kamu, arsitektur paling efisien:
  
  1. Seed data: gosom/google-maps-scraper via Docker CLI di lokal — gratis, powerful, 36
  field
  2. On-demand enrich: Google Places API (Essentials, 10k free/bln) dengan FieldMask ketat
  3. Refresh: Vercel Cron 1x/hari, batch kecil agar tetap di free tier
  4. Outscraper sudah ada di repo — manfaatkan untuk kategori/kota tertentu saat free credits ada