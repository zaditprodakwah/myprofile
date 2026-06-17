import { supabase } from './supabase';
import { unstable_cache } from 'next/cache';
import { Service, CaseStudy, City, Entity } from './types';

// Safe fallbacks to keep site building and running even if DB tables do not exist yet
const fallbackSiteContent: Record<string, string> = {
  hero_headline: 'Dari Kata ke Konversi. Dari Data ke Dominasi.',
  hero_subheading: 'Saya membantu UMKM, instansi, dan lembaga publik merancang ekosistem digital yang bukan hanya tampil — tapi mengkonversi secara sistematis.',
  process_title: 'Metodologi Pertumbuhan Terpadu',
  process_subtitle: 'Proses kerja terukur yang dirancang untuk mengamankan kejelasan pesan, kecepatan web, dan konversi maksimal.',
  partnership_title: 'Mari Bangun Sistem Bersama',
  partnership_subtitle: 'Formulir diagnosis singkat kemitraan. Isi dalam 60 detik untuk mendapatkan rekomendasi awal langsung dari Zadit.'
};const fallbackServices: Service[] = [
  {
    id: 's1',
    title: 'Pengembangan & Pengelolaan Website',
    description: 'Pembuatan & pengelolaan web performa tinggi menggunakan sistem modern dan database dinamis terintegrasi. Solusi digital mandiri yang cepat, responsif, dan siap tumbuh.',
    icon_name: 'Globe',
    tags: ['Kecepatan Tinggi', 'Mudah Dikelola', 'Keamanan Sistem', 'Bebas Hambatan'],
    display_order: 0,
    size: 'large',
    is_active: true
  },
  {
    id: 's2',
    title: 'Analitik & Intelijen Data',
    description: 'Pelacakan presisi perilaku pengunjung website, audit hambatan konversi, visualisasi data analitik, dan pengujian sistematis untuk keputusan pemasaran berbasis bukti.',
    icon_name: 'BarChart3',
    tags: ['Analisis Pengunjung', 'Laporan Kinerja', 'Peta Navigasi', 'Data Keputusan'],
    display_order: 1,
    size: 'small',
    is_active: true
  },
  {
    id: 's3',
    title: 'Optimasi Mesin Pencari & AI Search',
    description: 'Memastikan bisnis Anda ditemukan tidak hanya oleh pencarian konvensional (Google), tetapi juga siap tampil optimal di mesin AI generatif (seperti ChatGPT, Gemini, Claude).',
    icon_name: 'Search',
    tags: ['Optimasi Google', 'Kesesuaian AI Search', 'Pencarian Lokal', 'Target Spesifik'],
    display_order: 2,
    size: 'small',
    is_active: true
  },
  {
    id: 's4',
    title: 'Copywriting Konversi & Penulisan Naskah',
    description: 'Kata-kata yang memicu tindakan. Penulisan naskah penjualan untuk halaman penawaran, materi kampanye, dan narasi brand yang didasarkan pada psikologi konsumen terukur.',
    icon_name: 'PenTool',
    tags: ['Naskah Penjualan', 'Struktur Halaman', 'Psikologi Konsumen'],
    display_order: 3,
    size: 'large',
    is_active: true
  },
  {
    id: 's5',
    title: 'Dokumentasi Eksekutif & Presentasi',
    description: 'Penyusunan dokumen bisnis tingkat tinggi untuk memenangkan kemitraan. Desain pitch deck investor profesional, proposal bisnis institusional, dan ringkasan kerja sama strategis.',
    icon_name: 'FileText',
    tags: ['Slide Investor', 'Proposal Bisnis', 'Brief Kolaborasi', 'Visualisasi Data'],
    display_order: 4,
    size: 'large',
    is_active: true
  }
];

const fallbackCaseStudies: CaseStudy[] = [
  {
    id: 'c1',
    sector_badge: 'Sektor Publik & Swasta',
    client_name: 'Aliansi Pengembangan Komunitas & Layanan Publik Regional',
    challenge: 'Akses website lambat, tidak responsif di pelosok, dan ketergantungan pada media pihak ketiga.',
    approach: 'Restrukturisasi konten digital secara dinamis, optimasi peta situs (sitemap), dan peningkatan performa loading halaman.',
    metrics: [
      { label: 'Keterbacaan Google Organik', value: '+148%', number: 148 },
      { label: 'Keterlibatan Publik', value: '3.4x', number: 3.4 }
    ],
    testimonial_text: 'Arsitektur Zadit membuat masyarakat pelosok dapat mengakses layanan informasi dalam hitungan milidetik secara lancar.',
    testimonial_author: 'Dr. Ir. H. Hermawan',
    testimonial_role: 'Penasihat Kebijakan Publik',
    tech_tags: ['Optimasi Kecepatan', 'Struktur Konten', 'Akses Cepat'],
    display_order: 0,
    is_active: true
  },
  {
    id: 'c2',
    sector_badge: 'Kemitraan Strategis Swasta',
    client_name: 'Agritech & Digital Marketing Venture',
    challenge: 'Slide presentasi untuk investor kurang memiliki struktur data yang kuat dan naskah penawaran kurang meyakinkan.',
    approach: 'Merombak total struktur presentasi, menyusun narasi brand dengan fokus pada psikologi pasar, dan menyajikan riset pasar riil.',
    metrics: [
      { label: 'Pendanaan Awal Teramankan', value: 'US$1.2M', number: 1.2 }
    ],
    testimonial_text: 'Zadit merancang struktur proposal dan presentasi kami sedemikian rupa sehingga mitra langsung menangkap nilai unik produk dalam waktu singkat.',
    testimonial_author: 'Fahri Ramadhan',
    testimonial_role: 'Co-Founder & Chief Product Officer',
    tech_tags: ['Desain Presentasi', 'Penulisan Konversi', 'Analisis Data'],
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
