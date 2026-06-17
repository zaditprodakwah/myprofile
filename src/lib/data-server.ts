import { supabase } from './supabase';
import { unstable_cache } from 'next/cache';
import { Service, CaseStudy, City, Entity, Article } from './types';

// Safe fallbacks to keep site building and running even if DB tables do not exist yet
const fallbackSiteContent: Record<string, string> = {
  hero_headline: "Code doesn't scale without story. Story doesn't convert without data. Data doesn't persuade without execution.",
  hero_subheading: "Saya membantu UMKM, instansi swasta, hingga lembaga publik merancang situs web berkecepatan tinggi, mengelola blog informatif, menyusun slide presentasi premium, dan menganalisis data untuk mengunci pertumbuhan bisnis yang dapat diprediksi secara transparan.",
  hero_category_label: "// INTEGRASI ARSITEKTUR DIGITAL & NARASI BISNIS",
  hero_cta_primary: "Pelajari Metodologi & Wawasan",
  hero_cta_secondary: "Diagnostik Situs Gratis",
  process_title: "Metodologi Pertumbuhan Terpadu",
  process_subtitle: "Proses kerja terukur yang dirancang untuk mengamankan kejelasan pesan, kecepatan web, dan konversi maksimal.",
  process_section_label: "Metodologi",
  partnership_title: "Mulai Kemitraan",
  partnership_subtitle: "9 dari 10 klien menemukan solusi pertumbuhan yang tepat setelah diagnosis awal ini. Isi formulir dalam 60 detik untuk rekomendasi langsung dari Zadit."
};

const fallbackServices: Service[] = [
  {
    id: 's1',
    title: 'Pembuatan & Pengelolaan Web/Blog Aktif',
    subtitle: 'Ecosystem & Web Management',
    description: 'Layanan ujung-ke-ujung membangun blog informatif dan direktori rujukan yang terus diperbarui secara otomatis untuk mengamankan trafik organik jangka panjang.',
    icon_name: 'Globe',
    tags: ['Blog Management', 'Directory', 'Organic Traffic', 'Web Ecosystem'],
    display_order: 0,
    size: 'large',
    is_active: true
  },
  {
    id: 's2',
    title: 'Slide Presentasi & Dokumen Bisnis',
    subtitle: 'Executive Communication Assets',
    description: 'Merancang naskah proposal bisnis, siaran pers tepercaya, dan draf slide presentasi visual berstandar eksekutif untuk meyakinkan mitra strategis.',
    icon_name: 'FileText',
    tags: ['Pitch Deck', 'Business Proposal', 'Press Release', 'Executive Slide'],
    display_order: 1,
    size: 'small',
    is_active: true
  },
  {
    id: 's3',
    title: 'Rekayasa Kode Berkinerja Tinggi',
    subtitle: 'Code & Infrastructure Optimization',
    description: 'Penyusunan struktur Next.js yang bersih, teroptimasi untuk kecepatan muat sub-detik, ramah aksesibilitas global, dan siap menerima lonjakan kunjungan.',
    icon_name: 'Code',
    tags: ['Next.js', 'Core Web Vitals', 'A11y', 'High Performance'],
    display_order: 2,
    size: 'small',
    is_active: true
  },
  {
    id: 's4',
    title: 'Laporan Unit Economics & Analitik',
    subtitle: 'Precision Analytics',
    description: 'Pemasangan sistem pelacakan data yang presisi tanpa mengorbankan privasi pengguna, memberikan visualisasi performa yang mudah dipahami.',
    icon_name: 'BarChart3',
    tags: ['Data Tracking', 'Unit Economics', 'Analytics Dashboard', 'Privacy First'],
    display_order: 3,
    size: 'large',
    is_active: true
  }
];

const fallbackCaseStudies: CaseStudy[] = [
  {
    id: 'c1',
    sector_badge: '// KASUS STUDI 01 • AKSELERASI LAYANAN PUBLIK',
    client_name: 'Aliansi Pengembangan Komunitas & Layanan Publik Regional',
    challenge: 'Keterbatasan aksesibilitas informasi di perangkat mobile daerah minim sinyal, serta ketergantungan tinggi pada media pihak ketiga.',
    approach: 'Pembangunan ekosistem peta entitas terstruktur berbasis data geospasial terbuka dan integrasi arsitektur sitemap dinamis.',
    metrics: [
      { label: 'Keterbacaan Google (SERP Visbility)', value: '+148%', number: 148 },
      { label: 'Lompatan Keterlibatan Publik', value: '3.4x', number: 3.4 }
    ],
    testimonial_text: 'Arsitektur sitemap dinamis dan kecepatan website di bawah satu detik yang dihadirkan oleh Zadit membuat masyarakat di daerah pelosok dapat mengakses peta informasi layanan secara instan tanpa hambatan jaringan.',
    testimonial_author: 'Dr. Ir. H. Hermawan',
    testimonial_role: 'Penasihat Kebijakan Publik',
    tech_tags: ['Sitemap Architecture', 'Geospatial Data', 'Mobile Accessibility'],
    display_order: 0,
    is_active: true
  },
  {
    id: 'c2',
    sector_badge: '// KASUS STUDI 02 • STRATEGI KOMUNIKASI EKSEKUTIF',
    client_name: 'Instansi Teknologi Pertanian & Logistik Pangan',
    challenge: 'Materi presentasi sistem agrikultur terlalu padat jargon teknologi yang sulit dipahami komite penilai non-teknis dalam 10 menit pertama.',
    approach: 'Penyusunan ulang pesan dengan kerangka "Problem-Sistem Solusi-Dampak Terukur" dan visualisasi slide beresolusi tinggi.',
    metrics: [
      { label: 'Skor Kejelasan Struktur Narasi', value: '95%', number: 95 },
      { label: 'Komitmen Kemitraan Disetujui (IDR)', value: 'Rp 1.2M+', number: 1.2 }
    ],
    testimonial_text: 'Penerjemahan sistem teknologi kami yang sangat rumit menjadi slide narasi yang bersih dan humanis berhasil meyakinkan seluruh komite penilai kemitraan dalam sekali rapat eksekutif.',
    testimonial_author: 'Rian K.',
    testimonial_role: 'VP of Strategy & Corporate Relations',
    tech_tags: ['Pitch Deck', 'Narrative Structure', 'Executive Presentation'],
    display_order: 1,
    is_active: true
  }
];


const fallbackCities: City[] = [
  { id: 'ct1', name: 'Cirebon', slug: 'cirebon', latitude: -6.7216, longitude: 108.5560, target_niche: 'UMKM & Layanan Publik Regional' },
  { id: 'ct2', name: 'Jakarta Selatan', slug: 'jakarta-selatan', latitude: -6.2615, longitude: 106.8106, target_niche: 'Startups, Agencies & Bisnis Kuliner' }
];

const fallbackEntities: Entity[] = [
  {
    id: 'e1',
    city_slug: 'jakarta-selatan',
    entity_type: 'agency',
    name: 'Agensi Logistik Sejahtera',
    slug: 'agensi-logistik-sejahtera',
    tagline: 'Solusi pengiriman kargo dan pergudangan regional cepat.',
    address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
    google_maps_url: 'https://maps.google.com/?q=Gatot+Subroto+45+Jakarta',
    trust_score: 4.8,
    verification_status: 'verified'
  },
  {
    id: 'e2',
    city_slug: 'cirebon',
    entity_type: 'service',
    name: 'Klinik Medika Utama',
    slug: 'klinik-medika-utama',
    tagline: 'Layanan kesehatan keluarga ramah dan terintegrasi.',
    address: 'Jl. Ahmad Yani No. 12, Cirebon',
    google_maps_url: 'https://maps.google.com/?q=Ahmad+Yani+12+Cirebon',
    trust_score: 4.2,
    verification_status: 'unverified'
  },
  {
    id: 'e3',
    city_slug: 'jakarta-selatan',
    entity_type: 'service',
    name: 'Kantor Hukum Hendra & Rekan',
    slug: 'kantor-hukum-hendra-rekan',
    tagline: 'Perwakilan hukum bisnis dan korporat terpercaya.',
    address: 'Jl. Sudirman Kav 21, Jakarta Selatan',
    google_maps_url: 'https://maps.google.com/?q=Sudirman+Kav+21+Jakarta',
    trust_score: 4.5,
    verification_status: 'unverified'
  },
  {
    id: 'e4',
    city_slug: 'cirebon',
    entity_type: 'institution',
    name: 'Cirebon Agritech Hub',
    slug: 'cirebon-agritech-hub',
    tagline: 'Inkubator inovasi pertanian modern Jawa Barat.',
    address: 'Jl. Tuparev No. 88, Cirebon',
    google_maps_url: 'https://maps.google.com/?q=Tuparev+88+Cirebon',
    trust_score: 4.9,
    verification_status: 'verified'
  }
];

const fallbackArticles: Article[] = [
  {
    id: 'a1',
    title: 'Cara Optimasi Web UMKM di Indonesia agar Masuk Halaman Pertama Google',
    slug: 'cara-optimasi-web-umkm-indonesia',
    content: '<p>Di era digital, memiliki website saja tidak cukup. Anda membutuhkan strategi optimasi (SEO) yang tepat agar bisnis Anda mudah ditemukan oleh calon pelanggan di Google...</p><p>Berikut adalah langkah-langkah utama yang bisa Anda terapkan mulai hari ini...</p>',
    meta_title: 'Cara Optimasi Web UMKM di Indonesia (2026)',
    meta_description: 'Panduan lengkap cara mengoptimalkan website UMKM di Indonesia agar tampil di halaman pertama Google dan mendatangkan lebih banyak penjualan.',
    author_name: 'Muhammad Khoiruzzadittaqwa',
    is_published: true,
    published_at: new Date().toISOString()
  },
  {
    id: 'a2',
    title: 'Mengapa AI Search Mengubah Cara Kita Menulis Konten',
    slug: 'mengapa-ai-search-mengubah-cara-kita-menulis-konten',
    content: '<p>Google SGE (Search Generative Experience) dan mesin pencari AI lainnya telah merubah aturan main SEO. Konten berkualitas tinggi dan relevan semakin diutamakan dibandingkan sekadar keyword stuffing...</p>',
    meta_title: 'Dampak AI Search terhadap SEO dan Penulisan Konten',
    meta_description: 'Pelajari bagaimana mesin pencari AI seperti Google SGE mengubah lanskap SEO dan strategi konten apa yang harus Anda persiapkan.',
    author_name: 'Zadit Growth',
    is_published: true,
    published_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'a3',
    title: 'Panduan Praktis Technical SEO untuk Aplikasi Next.js',
    slug: 'panduan-seo-teknikal-nextjs',
    content: '<p>Next.js menawarkan banyak fitur unggulan untuk SEO, mulai dari Server-Side Rendering (SSR) hingga Image Optimization. Mari kita bahas konfigurasi terbaik untuk proyek Next.js Anda...</p>',
    meta_title: 'Technical SEO Guide untuk Next.js 14+',
    meta_description: 'Cara mengonfigurasi Next.js untuk mendapatkan skor Lighthouse 100 dan mendominasi peringkat teknikal SEO.',
    author_name: 'Zadit Growth',
    is_published: true,
    published_at: new Date(Date.now() - 172800000).toISOString()
  }
];

export const getSiteContent = unstable_cache(
  async (): Promise<Record<string, string>> => {
    try {
      const { data, error } = await supabase.from('site_content').select('section_key, value');
      if (error || !data || data.length === 0) {
        return fallbackSiteContent;
      }
      const mapped: Record<string, string> = { ...fallbackSiteContent };
      data.forEach((item) => {
        mapped[item.section_key] = item.value;
      });
      return mapped;
    } catch {
      return fallbackSiteContent;
    }
  },
  ['site_content_cache'],
  { revalidate: 3600 } // ISR 1 hour
);

export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) {
        return fallbackServices;
      }
      return data as Service[];
    } catch {
      return fallbackServices;
    }
  },
  ['services_cache'],
  { revalidate: 3600 }
);

export const getCaseStudies = unstable_cache(
  async (): Promise<CaseStudy[]> => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) {
        return fallbackCaseStudies;
      }
      return data as CaseStudy[];
    } catch {
      return fallbackCaseStudies;
    }
  },
  ['case_studies_cache'],
  { revalidate: 3600 }
);

export const getCities = unstable_cache(
  async (): Promise<City[]> => {
    try {
      const { data, error } = await supabase.from('cities').select('*').order('name', { ascending: true });
      if (error || !data || data.length === 0) {
        return fallbackCities;
      }
      return data as City[];
    } catch {
      return fallbackCities;
    }
  },
  ['cities_cache'],
  { revalidate: 3600 }
);

export const getEntities = unstable_cache(
  async (citySlug: string): Promise<Entity[]> => {
    try {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('city_slug', citySlug.toLowerCase());
      if (error || !data || data.length === 0) {
        return fallbackEntities.filter(e => e.city_slug === citySlug.toLowerCase());
      }
      return data.map((d: unknown) => {
        const item = d as Record<string, unknown>;
        return {
          id: String(item.id || ''),
          city_id: item.city_id ? String(item.city_id) : undefined,
          city_slug: String(item.city_slug || ''),
          entity_type: (item.entity_type || 'service') as Entity['entity_type'],
          name: String(item.name || ''),
          slug: String(item.slug || ''),
          tagline: String(item.tagline || ''),
          description: String(item.description || ''),
          contact_phone: String(item.contact_phone || ''),
          contact_email: String(item.contact_email || ''),
          website_url: String(item.website_url || ''),
          logo_url: String(item.logo_url || ''),
          address: String(item.address || ''),
          google_maps_url: String(item.google_maps_url || ''),
          verification_status: (item.verification_status || 'unverified') as Entity['verification_status'],
          trust_score: Number(item.trust_score || 0),
          affiliate_url: String(item.affiliate_url || ''),
          claim_token: String(item.claim_token || ''),
          raw_metadata: (item.raw_metadata || {}) as Record<string, unknown>
        };
      }) as Entity[];
    } catch {
      return fallbackEntities.filter(e => e.city_slug === citySlug.toLowerCase());
    }
  },
  ['entities_city_cache'],
  { revalidate: 60 } // fast cache recovery
);

export const getSystemConfig = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const fallbackConfigs: Record<string, unknown> = {
      whatsapp_number: '6282316363177',
      available_status: 'AVAILABLE',
      ai_prompt: 'Kamu adalah SEO content writer ahli untuk pasar Indonesia...',
      site_title: 'Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect',
      analytics_id: 'G-2CD1CPGEYF'
    };
    try {
      const { data, error } = await supabase.from('system_configs').select('key, value');
      if (error || !data || data.length === 0) {
        return fallbackConfigs;
      }
      const mapped: Record<string, unknown> = { ...fallbackConfigs };
      data.forEach((item) => {
        mapped[item.key] = item.value;
      });
      return mapped;
    } catch {
      return fallbackConfigs;
    }
  },
  ['system_configs_cache'],
  { revalidate: 300 } // 5 minutes cache
);

export const getArticles = unstable_cache(
  async (): Promise<Article[]> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return fallbackArticles;
      }
      return data as Article[];
    } catch {
      return fallbackArticles;
    }
  },
  ['articles_cache'],
  { revalidate: 3600 }
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<Article | null> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      if (error || !data) {
        return fallbackArticles.find(a => a.slug === slug) || null;
      }
      return data as Article;
    } catch {
      return fallbackArticles.find(a => a.slug === slug) || null;
    }
  },
  ['article_by_slug_cache'],
  { revalidate: 3600 }
);

export const getLatestArticles = unstable_cache(
  async (limit: number = 3): Promise<Article[]> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit);
      if (error || !data || data.length === 0) {
        return fallbackArticles.slice(0, limit);
      }
      return data as Article[];
    } catch {
      return fallbackArticles.slice(0, limit);
    }
  },
  ['latest_articles_cache'],
  { revalidate: 3600 }
);

export const getLiveStats = unstable_cache(
  async (): Promise<{ totalDirectories: number, totalAudits: number, systemStatus: string }> => {
    try {
      const { count: dirCount } = await supabase.from('entities').select('*', { count: 'exact', head: true });
      const { count: auditCount } = await supabase.from('utility_leads').select('*', { count: 'exact', head: true });
      
      return {
        totalDirectories: dirCount || 120, // fallback
        totalAudits: auditCount || 45, // fallback
        systemStatus: 'ONLINE'
      };
    } catch {
      return { totalDirectories: 120, totalAudits: 45, systemStatus: 'ONLINE' };
    }
  },
  ['live_stats_cache'],
  { revalidate: 600 }
);
