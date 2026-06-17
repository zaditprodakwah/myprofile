import { supabase } from './supabase';
import { unstable_cache } from 'next/cache';
import { Service, CaseStudy, City, Entity } from './types';

// Safe fallbacks to keep site building and running even if DB tables do not exist yet
const fallbackSiteContent: Record<string, string> = {
  hero_headline: 'Dari Kata ke Konversi. Dari Data ke Dominasi.',
  hero_subheading: 'Saya membantu UMKM, instansi, dan lembaga publik merancang strategi pemasaran 360°, optimasi SEO teknis, dan copywriting konversi yang mengamankan pertumbuhan bisnis secara sistematis.',
  process_title: 'Metodologi Pertumbuhan Terpadu',
  process_subtitle: 'Proses kerja terukur yang dirancang untuk mengamankan kejelasan pesan, kecepatan web, dan konversi maksimal.',
  partnership_title: 'Mari Bangun Sistem Bersama',
  partnership_subtitle: 'Formulir diagnosis singkat kemitraan. Isi dalam 60 detik untuk mendapatkan rekomendasi awal langsung dari Zadit.'
};

const fallbackServices: Service[] = [
  {
    id: 's1',
    title: 'Branding & Digital Marketing Strategy',
    subtitle: '360° Pemasaran',
    description: 'Penyusunan strategi pemasaran komprehensif menggunakan framework 4C Diamond dan 4P Marketing. Analisis persona audiens mendalam untuk menyelaraskan pain points konsumen dengan solusi bisnis Anda.',
    icon_name: 'Globe',
    tags: ['360° Marketing', '4C Diamond', '4P Framework', 'Brand Strategy'],
    display_order: 0,
    size: 'large',
    is_active: true
  },
  {
    id: 's2',
    title: 'SEO & Content Marketing',
    subtitle: 'Visibilitas AI & SERP',
    description: 'Riset kata kunci (keyword research) intensif, optimasi SERP Snippet (meta title, description, URL friendly), dan penulisan konten teroptimasi tinggi yang disukai Google maupun mesin AI.',
    icon_name: 'Search',
    tags: ['On-Page SEO', 'Keyword Research', 'SERP Optimization', 'Content Strategy'],
    display_order: 1,
    size: 'small',
    is_active: true
  },
  {
    id: 's3',
    title: 'Penyusunan Kampanye & Media Planning',
    subtitle: 'KOL & Media Mix',
    description: 'Perancangan kampanye digital terintegrasi, media planning dengan alokasi budget efisien, dan penyusunan draf instruksi influencer (KOL Content Brief) untuk hasil optimal.',
    icon_name: 'FileText',
    tags: ['Media Planning', 'KOL Briefing', 'Funnel Execution', 'Creative Content'],
    display_order: 2,
    size: 'small',
    is_active: true
  },
  {
    id: 's4',
    title: 'Audit Performa & SEO Teknis',
    subtitle: 'Kecepatan & Core Web Vitals',
    description: 'Pengujian responsivitas mobile, audit tautan rusak (broken link check), optimasi Core Web Vitals (LCP, CLS, FID), dan peningkatan kecepatan loading situs web secara terukur.',
    icon_name: 'BarChart3',
    tags: ['PageSpeed Audit', 'Broken Link Check', 'Core Web Vitals', 'Mobile-Friendly'],
    display_order: 3,
    size: 'large',
    is_active: true
  },
  {
    id: 's5',
    title: 'Administrasi & Manajemen Operasional',
    subtitle: 'Efisiensi Kerja',
    description: 'Pengalaman memimpin tim administratif, manajemen operasional harian organisasi, dan pemanfaatan sistem kerja digital terstruktur (Google Workspace/MS Office) untuk akurasi data maksimal.',
    icon_name: 'PenTool',
    tags: ['Team Leadership', 'Office Admin', 'Data Accuracy', 'Google Workspace'],
    display_order: 4,
    size: 'large',
    is_active: true
  }
];

const fallbackCaseStudies: CaseStudy[] = [
  {
    id: 'c1',
    sector_badge: 'Audit & Optimasi SEO',
    client_name: 'tirto.id',
    challenge: 'Kecepatan muat lambat (mobile score 50/100, LCP 4.5s) dan isu broken links.',
    approach: 'Technical audit komprehensif, kompresi gambar WebP, minifikasi CSS/JS, dan redireksi 301.',
    metrics: [
      { label: 'Kecepatan LCP Target', value: '< 2.5s', number: 2.5 },
      { label: 'PageSpeed Mobile Target', value: '90+', number: 90 }
    ],
    testimonial_text: 'Optimasi SEO on-page dan technical audit yang dirumuskan memberikan arahan terstruktur untuk meningkatkan kecepatan pemuatan halaman dan visibilitas di Google.',
    testimonial_author: 'M. Khoiruzzadittaqwa',
    testimonial_role: 'SEO Specialist Candidate',
    tech_tags: ['Technical Audit', 'PageSpeed Insights', 'On-Page SEO'],
    display_order: 0,
    is_active: true
  },
  {
    id: 'c2',
    sector_badge: 'Brand Campaign & Media Planning',
    client_name: 'tiket.com',
    challenge: 'Meningkatkan keterlibatan pengguna aktif, menarik pengguna baru, dan mengaktifkan kembali pengguna dormant.',
    approach: 'Merancang kampanye "Level Up Rewards" & "Referral Bonanza", serta menyusun alokasi media mix.',
    metrics: [
      { label: 'Alokasi Digital Marketing', value: '60%', number: 60 },
      { label: 'Alokasi Sosial Media', value: '30%', number: 30 }
    ],
    testimonial_text: 'Perencanaan strategi 360° digital marketing yang memetakan persona audiens Budi, Andi, dan Cici dengan pain points mereka secara presisi.',
    testimonial_author: 'M. Khoiruzzadittaqwa',
    testimonial_role: 'Digital Marketing Specialist',
    tech_tags: ['Media Planning', 'Customer Persona', 'Campaign Brief'],
    display_order: 1,
    is_active: true
  },
  {
    id: 'c3',
    sector_badge: 'Influencer & Community Marketing',
    client_name: 'vidio.com',
    challenge: 'Menyebarkan informasi hak siar Piala Dunia secara fleksibel dan terjangkau (Rp50.000).',
    approach: 'Menyusun draf KOL Content Brief (TikTok/Instagram Reels) dengan alur Opening-Body-CTA yang persuasif.',
    metrics: [
      { label: 'Biaya Langganan Akses', value: 'Rp50k', number: 50 },
      { label: 'Durasi Video KOL', value: '30-60s', number: 45 }
    ],
    testimonial_text: 'Brief KOL yang terstruktur dengan skenario opening "Bosan nonton di TV?" dan CTA persuasif untuk mendorong konversi langsung.',
    testimonial_author: 'M. Khoiruzzadittaqwa',
    testimonial_role: 'KOL Specialist Candidate',
    tech_tags: ['KOL Briefing', 'TikTok Strategy', 'Content Flow'],
    display_order: 2,
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
