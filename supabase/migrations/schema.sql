-- 1. site_content: Semua teks/copy landing page
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,     -- 'hero_headline', 'hero_subheading', dll
  content_type TEXT NOT NULL DEFAULT 'text',  -- 'text', 'html', 'json'
  value TEXT NOT NULL,
  metadata JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. services: Pilar keahlian Bento Grid
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,               -- nama ikon Lucide
  tags TEXT[],                           
  display_order INT NOT NULL DEFAULT 0,
  size TEXT DEFAULT 'large',             -- 'large', 'small' (untuk Bento)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. case_studies: Studi kasus
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sector_badge TEXT NOT NULL,            -- 'Sektor Publik & Swasta'
  client_name TEXT NOT NULL,             
  challenge TEXT NOT NULL,
  approach TEXT NOT NULL,
  metrics JSONB NOT NULL,                -- [{"label": "Keterbacaan Google", "value": "+148%", "number": 148}]
  testimonial_text TEXT,
  testimonial_author TEXT,
  testimonial_role TEXT,
  tech_tags TEXT[],                      
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. cities: Entitas wilayah pSEO
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  target_niche TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);

-- 5. entities: Google Maps & Business standard directory
CREATE TABLE IF NOT EXISTS entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  city_slug TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('individual','institution','agency','brand','product','service')),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  logo_url TEXT,
  address TEXT,                          -- Standar alamat Google Business
  google_maps_url TEXT,                  -- Link koordinat Google Maps
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified','claimed','verified')),
  trust_score REAL DEFAULT 0.0,
  affiliate_url TEXT,
  claim_token TEXT,
  raw_metadata JSONB,                    -- Untuk menyimpan data scrapping mentah
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_entities_slug ON entities(slug);
CREATE INDEX IF NOT EXISTS idx_entities_city ON entities(city_slug, verification_status);

-- 6. articles: Blog AGC + Manual + UGC
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  source_feed TEXT,                      -- Sumber feed (jika AGC)
  original_url TEXT,                     -- URL asli (jika AGC)
  content TEXT NOT NULL,                 -- Konten HTML/Markdown
  meta_title TEXT,
  meta_description TEXT,
  semantic_keywords TEXT[],
  faq_items JSONB,                       -- [{question, answer}]
  author_name TEXT DEFAULT 'Muhammad Khoiruzzadittaqwa',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- 7. system_configs: Konfigurasi dinamis (WhatsApp, SEO, AI model)
CREATE TABLE IF NOT EXISTS system_configs (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. paa_questions: Bank pertanyaan PAA
CREATE TABLE IF NOT EXISTS paa_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. utility_leads: Leads dari audit riil
CREATE TABLE IF NOT EXISTS utility_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_name TEXT NOT NULL,
  contact_info JSONB NOT NULL,           -- {"whatsapp": "...", "email": "..."}
  target_site_url TEXT,
  audit_category TEXT NOT NULL,          -- 'Real Audit Request'
  accessibility_score INT,               
  narrative_score INT,                   
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONTACTED','WON')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. directory_leads: Leads dari klaim profil
CREATE TABLE IF NOT EXISTS directory_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
  lead_name TEXT NOT NULL,               -- nama pengklaim
  contact_info JSONB NOT NULL,           -- {"whatsapp": "...", "email": "...", "role": "..."}
  target_site_url TEXT,                  -- nama entitas yang diklaim
  audit_category TEXT DEFAULT 'Claim Directory Profile',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONTACTED','WON')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. contact_leads: Leads kemitraan 4-step wizard
CREATE TABLE IF NOT EXISTS contact_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_type TEXT,                     -- 'business_owner', 'hrd_recruiter', etc
  needs TEXT[],                          -- array kebutuhan
  project_description TEXT,
  lead_name TEXT NOT NULL,
  contact_info JSONB NOT NULL,           -- {"whatsapp": "...", "email": "..."}
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONTACTED','WON')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) policies
ALTER TABLE utility_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

-- Create policies (drop if exist first to prevent duplicates)
DROP POLICY IF EXISTS "Public insert utility_leads" ON utility_leads;
CREATE POLICY "Public insert utility_leads" ON utility_leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert directory_leads" ON directory_leads;
CREATE POLICY "Public insert directory_leads" ON directory_leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert contact_leads" ON contact_leads;
CREATE POLICY "Public insert contact_leads" ON contact_leads FOR INSERT TO anon WITH CHECK (true);

-- Public read policies for content tables
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_content" ON site_content;
CREATE POLICY "Public read site_content" ON site_content FOR SELECT TO anon USING (true);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services" ON services FOR SELECT TO anon USING (true);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read case_studies" ON case_studies;
CREATE POLICY "Public read case_studies" ON case_studies FOR SELECT TO anon USING (true);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read cities" ON cities;
CREATE POLICY "Public read cities" ON cities FOR SELECT TO anon USING (true);

ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read entities" ON entities;
CREATE POLICY "Public read entities" ON entities FOR SELECT TO anon USING (true);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read articles" ON articles;
CREATE POLICY "Public read articles" ON articles FOR SELECT TO anon USING (true);

ALTER TABLE system_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read system_configs" ON system_configs;
CREATE POLICY "Public read system_configs" ON system_configs FOR SELECT TO anon USING (true);

ALTER TABLE paa_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read paa_questions" ON paa_questions;
CREATE POLICY "Public read paa_questions" ON paa_questions FOR SELECT TO anon USING (true);

-- Seed Data (Default Values)
INSERT INTO site_content (section_key, content_type, value) VALUES
('hero_headline', 'text', 'Dari Kata ke Konversi. Dari Data ke Dominasi.'),
('hero_subheading', 'text', 'Saya membantu UMKM, instansi, dan lembaga publik merancang ekosistem digital yang bukan hanya tampil — tapi mengkonversi secara sistematis.'),
('process_title', 'text', 'Metodologi Pertumbuhan Terpadu'),
('process_subtitle', 'text', 'Proses kerja terukur yang dirancang untuk mengamankan kejelasan pesan, kecepatan web, dan konversi maksimal.'),
('partnership_title', 'text', 'Mari Bangun Sistem Bersama'),
('partnership_subtitle', 'text', 'Formulir diagnosis singkat kemitraan. Isi dalam 60 detik untuk mendapatkan rekomendasi awal langsung dari Zadit.')
ON CONFLICT (section_key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO system_configs (key, value, description) VALUES
('whatsapp_number', '"6282316363177"', 'Nomor WhatsApp default untuk rujukan CTA'),
('available_status', '"AVAILABLE"', 'Status ketersediaan proyek (AVAILABLE / BUSY)'),
('ai_prompt', '"Kamu adalah SEO content writer ahli untuk pasar Indonesia. Tulis konten yang memenuhi E-E-A-T Google dengan struktur Definition-Lead pada 200 kata pertama. Gunakan visualisasi tabel data dan sertakan FAQ dengan format schema markup."', 'Prompt default untuk mesin penulis AGC blog'),
('site_title', '"Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect"', 'Judul utama metadata situs web'),
('analytics_id', '"G-2CD1CPGEYF"', 'Google Analytics 4 Measurement ID')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO cities (name, slug, latitude, longitude, target_niche) VALUES
('Cirebon', 'cirebon', -6.7216, 108.5560, 'UMKM & Layanan Publik Regional'),
('Jakarta Selatan', 'jakarta-selatan', -6.2615, 106.8106, 'Startups, Agencies & Bisnis Kuliner')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO services (title, subtitle, description, icon_name, tags, display_order, size) VALUES
('Ecosystem & Web Management', 'Performa Tinggi', 'Pembuatan & pengelolaan web performa tinggi menggunakan Next.js App Router dan database dinamis (Supabase). Solusi digital mandiri yang cepat, responsif, dan siap tumbuh.', 'Globe', ARRAY['Next.js 16', 'TypeScript', 'Supabase', 'ISR Caching'], 0, 'large'),
('Analytics & Data Intelligence', 'Tracking Presisi', 'Tracking presisi perilaku pengguna, audit kebocoran konversi, visualisasi visual data analitik, dan A/B testing sistematis untuk keputusan pemasaran berbasis bukti.', 'BarChart3', ARRAY['Google Analytics 4', 'Search Console', 'GTM', 'Heatmaps'], 1, 'small'),
('SEO & AEO/GEO Optimization', 'Visibilitas AI', 'Memastikan bisnis Anda ditemukan tidak hanya oleh pencarian konvensional (Google SERP), tetapi juga dioptimalkan untuk mesin AI generatif (Gemini, ChatGPT, Claude).', 'Search', ARRAY['Technical SEO', 'Entity Schema', 'GEO Optimization', 'pSEO'], 2, 'small'),
('Conversion Copywriting', 'Narasi Penjualan', 'Kata-kata yang memicu tindakan. Penulisan naskah penjualan untuk landing page, materi kampanye, dan narasi brand yang didasarkan pada psikologi konsumen terukur.', 'PenTool', ARRAY['Direct Response Copy', 'Landing Page Wireframe', 'PAS Framework'], 3, 'large'),
('Executive Documentation', 'Materi Presentasi', 'Penyusunan dokumen bisnis tingkat tinggi yang memenangkan pendanaan dan kemitraan. Desain pitch deck investor profesional, proposal bisnis institusional, dan brief kolaborasi KOL strategis.', 'FileText', ARRAY['Pitch Deck Layout', 'Executive Brief', 'KOL Brief Design', 'Math Data Viz'], 4, 'large')
ON CONFLICT DO NOTHING;

INSERT INTO case_studies (sector_badge, client_name, challenge, approach, metrics, testimonial_text, testimonial_author, testimonial_role, tech_tags, display_order) VALUES
(
  'Sektor Publik & Swasta', 
  'Aliansi Pengembangan Komunitas & Layanan Publik Regional', 
  'Web lambat, tidak responsif di pelosok, dan ketergantungan pada media pihak ketiga.', 
  'Implementasi graf entitas dinamis (entity graph), optimasi sitemap dynamic, dan migrasi arsitektur Next.js ISR.', 
  '[{"label": "Keterbacaan Google Organik", "value": "+148%", "number": 148}, {"label": "Keterlibatan Publik", "value": "3.4x", "number": 3.4}]'::jsonb,
  'Arsitektur Zadit membuat masyarakat pelosok dapat mengakses layanan informasi dalam hitungan milidetik secara lancar.', 
  'Dr. Ir. H. Hermawan', 
  'Penasihat Kebijakan Publik', 
  ARRAY['SEO Teknikal', 'Entity Graph', 'Next.js ISR'], 
  0
),
(
  'Kemitraan Strategis Swasta', 
  'Agritech & Digital Marketing Venture', 
  'Pitch deck investor kurang memiliki struktur data matematika terintegrasi dan copy kurang asertif.', 
  'Merombak total deck presentasi, menyusun narasi brand dengan PAS framework, dan menautkan data riset pasar riil.', 
  '[{"label": "Pendanaan Awal Teramankan", "value": "US$1.2M", "number": 1.2}]'::jsonb,
  'Zadit merancang struktur proposal dan deck kami sedemikian rupa sehingga investor langsung menangkap nilai unik produk dalam 3 menit pertama.', 
  'Fahri Ramadhan', 
  'Co-Founder & Chief Product Officer', 
  ARRAY['Pitch Deck Design', 'Conversion Copy', 'Data Valuation'], 
  1
)
ON CONFLICT DO NOTHING;

INSERT INTO entities (city_slug, entity_type, name, slug, tagline, address, google_maps_url, trust_score, verification_status) VALUES
('jakarta-selatan', 'agency', 'Agensi Logistik Sejahtera', 'agensi-logistik-sejahtera', 'Solusi pengiriman kargo dan pergudangan regional cepat.', 'Jl. Gatot Subroto No. 45, Jakarta Selatan', 'https://maps.google.com/?q=Gatot+Subroto+45+Jakarta', 4.8, 'verified'),
('cirebon', 'service', 'Klinik Medika Utama', 'klinik-medika-utama', 'Layanan kesehatan keluarga ramah dan terintegrasi.', 'Jl. Ahmad Yani No. 12, Cirebon', 'https://maps.google.com/?q=Ahmad+Yani+12+Cirebon', 4.2, 'unverified'),
('jakarta-selatan', 'service', 'Kantor Hukum Hendra & Rekan', 'kantor-hukum-hendra-rekan', 'Perwakilan hukum bisnis dan korporat terpercaya.', 'Jl. Sudirman Kav 21, Jakarta Selatan', 'https://maps.google.com/?q=Sudirman+Kav+21+Jakarta', 4.5, 'unverified'),
('cirebon', 'institution', 'Cirebon Agritech Hub', 'cirebon-agritech-hub', 'Inkubator inovasi pertanian modern Jawa Barat.', 'Jl. Tuparev No. 88, Cirebon', 'https://maps.google.com/?q=Tuparev+88+Cirebon', 4.9, 'verified')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
