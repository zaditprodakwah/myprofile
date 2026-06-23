'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, ChevronDown, ChevronUp, Layers, HelpCircle, 
  Send, Phone, Award, Clock, ArrowRight, Zap,
  Search, Code, FileText, BarChart3, Star, Sparkles, BookOpen, Share2, Globe, CheckSquare, Plus
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  price: string;
  period?: string;
  badge?: string;
  description: string;
  suitable_for: string;
  objective: string;
  deliverables: string[];
  timeline: string;
  revisions: string;
  support: string;
  cta: string;
  cta_url: string;
}

interface RateCardSectionProps {
  packagesJson?: string;
  whatsappNumber?: string;
}

const comparisonFeatures = [
  { name: 'Konsultasi Awal & Strategi', starter: '✓ 30 Menit', growth: '✓ 60 Menit', professional: '✓ 90 Menit', enterprise: '✓ Sesuai Kebutuhan' },
  { name: 'Teknologi Utama', starter: 'Next.js App Router', growth: 'Next.js Multi-page', professional: 'Next.js + Core Web Vitals 100', enterprise: 'Custom / Cloud Native' },
  { name: 'Otomatisasi AGC & RSS Scraper', starter: '✘ Tidak Ada', growth: '✓ Standar (RSS + AI)', professional: '✓ Lanjutan + Audit Engine', enterprise: '✓ Kustom Enterprise' },
  { name: 'Penyimpanan Database', starter: 'Lokal/Statis', growth: '✓ Supabase / Firestore', professional: '✓ Supabase Pro / Firebase', enterprise: '✓ Custom SQL Connect' },
  { name: 'Dokumen Proposal & Slide', starter: '✘ Tidak Ada', growth: '✘ Tidak Ada', professional: '✓ 1x Deck Visual Standar', enterprise: '✓ Sesuai Kebutuhan' },
  { name: 'Optimasi Aksesibilitas (A11y)', starter: 'Standard Browser', growth: '✓ Skala Dasar', professional: '✓ Skala Penuh (WCAG AA)', enterprise: '✓ Sertifikasi Resmi' },
  { name: 'Batas Revisi', starter: '2x Revisi', growth: '3x Revisi', professional: 'Revisi Sepuasnya', enterprise: 'Sesuai Kontrak' },
  { name: 'Dukungan Teknis', starter: 'WhatsApp Chat', growth: 'WhatsApp & GMeet Prioritas', professional: 'Telepon 24/7 & Pertemuan Mingguan', enterprise: 'Dedicated Slack Channel' }
];

const faqs = [
  {
    q: 'Apakah harga di atas sudah termasuk biaya domain dan server hosting?',
    a: 'Untuk seluruh paket, harga belum termasuk langganan domain dan server jika menggunakan cloud provider premium berbayar. Namun, jika Anda ingin meminimalkan biaya operasional hingga nol rupiah (zero-cost), saya membantu men-deploy website di platform gratis yang sangat tepercaya seperti Vercel (untuk frontend/layanan Next.js) dan Supabase (untuk database free tier) yang sudah sangat memadai untuk trafik ratusan ribu kunjungan bulanan.'
  },
  {
    q: 'Bagaimana cara kerja sistem AGC (Auto-Generated Content) dengan AI?',
    a: 'Sistem AGC yang saya bangun mengambil data dari RSS feed tepercaya yang Anda tentukan, lalu mengirimkannya ke Google Gemini Flash via API untuk ditulis ulang secara orisinal dengan format terstruktur (pola Definition-Lead & H2-H3) dalam Bahasa Indonesia yang logis. Apabila API AI mengalami downtime atau limitasi, sistem secara otomatis mengaktifkan fallback aman dengan menyajikan snippet asli beserta tombol referensi resmi ke sumber aslinya.'
  },
  {
    q: 'Apakah saya mendapatkan kepemilikan penuh atas kode program (source code)?',
    a: 'Ya, kepemilikan kode program sepenuhnya milik Anda. Seluruh kode akan di-upload ke repository GitHub milik Anda (atau ditransfer secara penuh) dan data leads/konten disimpan pada basis data Supabase pribadi Anda sehingga tidak ada ketergantungan vendor (no lock-in).'
  },
  {
    q: 'Bagaimana proses pembayaran proyek dilakukan?',
    a: 'Pembayaran proyek dilakukan secara bertahap melalui sistem termin: 50% Down Payment (DP) untuk memulai fase riset dan perencanaan, serta 50% pelunasan setelah website diuji di server staging dan siap diluncurkan secara publik ke server produksi.'
  },
  {
    q: 'Apakah saya mendapat dukungan pemeliharaan (maintenance) setelah web online?',
    a: 'Setiap paket dilengkapi dengan masa garansi bebas bug selama 30 hari pertama. Untuk dukungan pasca-garansi, Anda dapat memilih opsi retainer bulanan atau memperbarui konten secara mandiri menggunakan modul dasbor admin yang telah saya sediakan.'
  }
];

export default function RateCardSection({ packagesJson, whatsappNumber = '6282316363177' }: RateCardSectionProps) {
  // Safe default pricing packages matching Writing & Editorial Operations
  const defaultPackages: Package[] = [
    {
      id: 'starter',
      name: 'Starter Content',
      price: 'Rp 4.500.000',
      period: '/ bln',
      badge: 'UMKM & Personal Brand',
      description: 'Paket konten bulanan untuk membangun jejak digital awal dan mengamankan ranking pencarian kata kunci niche berdaya saing rendah.',
      suitable_for: 'Website UMKM baru, blog personal, dan rintisan awal.',
      objective: 'Memproduksi 4 artikel SEO berkualitas tinggi per bulan beserta perbaikan On-page dasar.',
      deliverables: [
        '4x Artikel SEO (800-1000 kata per artikel)',
        'Riset Kata Kunci & Pemetaan Search Intent',
        'Optimasi Meta Title & Meta Description',
        'Format HTML Bersih & Penyesuaian Heading',
        '1x Laporan Google Search Console Bulanan'
      ],
      timeline: 'Bulanan (1 Artikel / Minggu)',
      revisions: '1x Revisi per Artikel',
      support: 'WhatsApp Chat (Jam Kerja)',
      cta: 'Mulai Paket Starter',
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Starter%20Content.`
    },
    {
      id: 'growth',
      name: 'Growth Blog Engine',
      price: 'Rp 8.500.000',
      period: '/ bln',
      badge: 'Paling Populer',
      description: 'Sistem publikasi berkala terintegrasi dengan otomatisasi RSS feed dan AI Rewrite untuk merajai search engine lokal.',
      suitable_for: 'Agensi regional, klinik spesialis, dan penyedia jasa B2B.',
      objective: 'Meningkatkan trafik organik bulanan secara konsisten melalui 8 artikel premium dan setup feed terindeks.',
      deliverables: [
        '8x Artikel SEO Premium (1000-1200 kata)',
        'Sistem Ingest RSS & Scraper AI (No-AI Fallback)',
        'Internal Linking Map & Optimasi Struktur Silo',
        'Skema Structured Data / Schema.org Lengkap',
        '2x Posting Media Sosial (LinkedIn/Instagram) per Artikel',
        'Laporan Otoritas Domain & Trafik Bulanan'
      ],
      timeline: 'Bulanan (2 Artikel / Minggu)',
      revisions: '2x Revisi per Artikel',
      support: 'WhatsApp & GMeet Prioritas',
      cta: 'Pilih Paket Growth',
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Growth%20Blog%20Engine.`
    },
    {
      id: 'business',
      name: 'Business Authority',
      price: 'Rp 16.000.000',
      period: '/ bln',
      badge: 'Rekomendasi Skala',
      description: 'Strategi konten B2B skala penuh mencakup copywriting halaman penjualan, editorial terencana, rilis pers media lokal, dan strategi PR digital.',
      suitable_for: 'Perusahaan skala menengah, startup Series-A, dan instansi swasta.',
      objective: 'Membangun kepemimpinan pemikiran (thought leadership), mengunci konversi landing page, dan mengamankan rilis media massa.',
      deliverables: [
        '12x Artikel SEO & Pillar Content (1500+ kata)',
        '1x Copywriting Sales Page / Landing Page Konversi',
        '1x Press Release Penulisan & Distribusi Media Lokal',
        'Strategi Topic Cluster & Kalender Editorial Penuh',
        'Image & Alt Text Optimization (WCAG AA Compliant)',
        'Analisis Kompetitor & Audit Kata Kunci Semantik Mendalam'
      ],
      timeline: 'Bulanan (3 Artikel / Minggu)',
      revisions: 'Revisi Sepuasnya',
      support: 'Dukungan Telp/WA 24/7 & Meet Mingguan',
      cta: 'Klaim Paket Business',
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Business%20Authority.`
    },
    {
      id: 'authority',
      name: 'Executive Studio',
      price: 'Rp 28.000.000',
      period: '/ bln',
      badge: 'Otoritas Mutlak',
      description: 'Dominasi pencarian search engine dan rilis media nasional. Dilengkapi dengan draf pitch deck investasi, optimasi sitemap dinamis, PR digital terukur, dan audit reguler.',
      suitable_for: 'Korporasi berkembang, lembaga publik nasional, dan bisnis B2B multinasional.',
      objective: 'Mengamankan backlink otoritas tinggi dari media terkemuka, optimalisasi landing page, dan dukungan PR eksekutif.',
      deliverables: [
        '16x Artikel SEO & Long-form Thought Leadership',
        '2x Press Release Penulisan & Distribusi Media Nasional (Kompas/Detik/dll)',
        '2x Copywriting Halaman Penjualan / Email Sequence Campaign',
        'Pembangunan Backlink & Kampanye Brand Mentions',
        'Dukungan Slide Presentasi Bisnis / Pitch Deck Standard Eksekutif',
        'Sistem Audit Mandiri Kecepatan & SEO Web di Server'
      ],
      timeline: 'Bulanan (4 Artikel / Minggu)',
      revisions: 'Prioritas Utama Tanpa Batas',
      support: 'Dedicated Whatsapp Group & Dedicated Manager',
      cta: 'Mulai Eksekusi Otoritas',
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Executive%20Studio.`
    },
    {
      id: 'enterprise',
      name: 'Bespoke Enterprise',
      price: 'Hubungi Kami',
      period: '',
      badge: 'Solusi Khusus',
      description: 'Manajemen konten dan infrastruktur publikasi khusus berskala besar dengan SLA performa kecepatan muat sub-detik dan kepatuhan a11y WCAG AA penuh.',
      suitable_for: 'Instansi pemerintahan, perusahaan logistik nasional, dan media network.',
      objective: 'Skalabilitas infrastruktur, penulisan konten teknis tersertifikasi, lokalisasi bahasa, dan integrasi API Supabase kustom.',
      deliverables: [
        'Infrastruktur Cloud Khusus (Next.js Multi-zone / Vercel Enterprise)',
        'Penulisan Konten Teknis Berskala Ribuan Halaman (Dokumentasi & API)',
        'Penerjemahan & Lokalisasi Bahasa (Indonesia - Inggris - Mandarin)',
        'Dukungan Kepatuhan Hukum WCAG AA Aksesibilitas Publik',
        'Dedicated Writer & Technical Support Engineer'
      ],
      timeline: 'Sesuai Kontrak Kerja',
      revisions: 'Khusus Sesuai Perjanjian',
      support: 'Dedicated Slack Channel & Dedicated Support Engineer',
      cta: 'Jadwalkan Rapat Komite',
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20mengadakan%20rapat%20untuk%20Paket%20Enterprise.`
    }
  ];

  let packages = defaultPackages;
  if (packagesJson) {
    try {
      packages = JSON.parse(packagesJson);
    } catch (e) {
      console.warn('Failed to parse pricing_packages JSON, using defaults', e);
    }
  }

  // Active Category Tab inside Services Explorer
  const [activeTab, setActiveTab] = useState<'seo_writing' | 'copywriting' | 'strategy' | 'publishing' | 'blog_web_mgmt' | 'social_pr'>('seo_writing');

  // Accordion state for detailed service items
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  // Interactive Brief Selector state
  const [selectedBriefType, setSelectedBriefType] = useState<'seo' | 'copy' | 'pr'>('seo');
  const [copiedBrief, setCopiedBrief] = useState(false);

  // KPI Category State
  const [kpiCategory, setKpiCategory] = useState<'seo' | 'publishing' | 'content' | 'social_pr'>('seo');

  const servicesData = {
    seo_writing: {
      title: 'SEO Content Writing',
      desc: 'Penulisan artikel otoritatif yang dioptimasi untuk merajai halaman pertama pencarian Google & AI Search (Search Generative Experience).',
      items: [
        {
          id: 'seo_article',
          name: 'SEO Article & Pillar Content',
          price: 'Rp 450.000',
          range: 'Rp 450.000 - Rp 1.200.000',
          hours: '3 - 6 Jam',
          difficulty: 'Medium to High',
          wordCount: '1.200 - 2.500 kata',
          objective: 'Menduduki peringkat atas kata kunci komersial/informatif dengan kedalaman materi tinggi.',
          deliverables: ['Outline artikel semantik', 'File Markdown/Google Docs', 'Riset LSI & Keyword Mapping', 'Rekomendasi internal linking', 'Optimasi Meta Title/Desc', 'Alt Text Image Map'],
          turnaround: '2-3 Hari Kerja',
          revisions: '2x Revisi Minor',
          kpis: 'Organic impressions, keyword ranking (top 10), average time on page.',
          addons: ['Image custom design (+Rp 50rb)', 'CMS publish (+Rp 50rb)', 'IndexNow instant request (+Rp 25rb)'],
          brief: 'Topik Utama, Target Utama Keyword, Kompetitor Utama, Nada Bicara (Informal/Formal), CTA Penjualan.'
        },
        {
          id: 'local_seo',
          name: 'Local SEO & Niche Cluster Article',
          price: 'Rp 350.000',
          range: 'Rp 350.000 - Rp 750.000',
          hours: '2 - 4 Jam',
          difficulty: 'Medium',
          wordCount: '800 - 1.200 kata',
          objective: 'Menjaring trafik dari pencarian lokal (misal: "Jasa Web di Cirebon") untuk konversi instan.',
          deliverables: ['Artikel ramah pencarian lokal', 'Schema Local Business injection recommendation', 'Google Maps link integration', 'Kontak CTA lokal terintegrasi'],
          turnaround: '2 Hari Kerja',
          revisions: '2x Revisi',
          kpis: 'Clicks from Local Pack, CTR map listing, localized organic queries ranking.',
          addons: ['Geospatial keyword research (+Rp 100rb)'],
          brief: 'Nama Kota Target, Produk/Layanan Utama, Google Business Profile Link, USP Lokal.'
        },
        {
          id: 'buying_guide',
          name: 'Buying Guide & Product Review',
          price: 'Rp 600.000',
          range: 'Rp 600.000 - Rp 1.500.000',
          hours: '4 - 8 Jam',
          difficulty: 'High',
          wordCount: '1.500 - 3.000 kata',
          objective: 'Mengedukasi pembeli pada tahap pertimbangan akhir (bottom of funnel) untuk membeli produk/afiliasi.',
          deliverables: ['Tabel perbandingan spesifikasi', 'Copywriting kelebihan/kekurangan objektif', 'Link afiliasi/CTA aman terpasang', 'Desain layout perbandingan'],
          turnaround: '3-4 Hari Kerja',
          revisions: '2x Revisi',
          kpis: 'Affiliate link click-through rate, conversion rate, search intent match.',
          addons: ['Riset kompetitor langsung (+Rp 200rb)'],
          brief: 'Daftar Link Produk, USP tiap produk, Link Kompetitor, Opsi Panggilan Aksi.'
        }
      ]
    },
    copywriting: {
      title: 'Copywriting & Ad Copy',
      desc: 'Tulisan persuasif berorientasi aksi langsung (Direct Response) untuk melipatgandakan rasio konversi kampanye digital Anda.',
      items: [
        {
          id: 'landing_copy',
          name: 'Website & Landing Page Copy',
          price: 'Rp 1.200.000',
          range: 'Rp 1.200.000 - Rp 3.500.000',
          hours: '6 - 12 Jam',
          difficulty: 'High',
          wordCount: 'Kustom (Struktur PAS Framework)',
          objective: 'Menerjemahkan sistem bisnis rumit menjadi narasi penawaran yang meyakinkan leads dalam 15 detik pertama.',
          deliverables: ['Naskah Landing Page Terstruktur (Header, Body, Social Proof, CTA)', 'Struktur Wireframe teks untuk desainer web', 'Alternatif headline A/B Testing', 'Copywriting tombol CTA'],
          turnaround: '4-5 Hari Kerja',
          revisions: 'Revisi Sepuasnya (Fase Draft)',
          kpis: 'Conversion rate leads, bounce rate website, click-through rate (CTR) button.',
          addons: ['Desain layout dasar Figma (+Rp 500rb)'],
          brief: 'Deskripsi Produk, Pain points utama calon pembeli, Mengapa kompetitor gagal, CTA Utama.'
        },
        {
          id: 'email_sequence',
          name: 'Email Sequence & WhatsApp Campaign Copy',
          price: 'Rp 300.000',
          range: 'Rp 300.000 - Rp 800.000 / email',
          hours: '2 - 3 Jam',
          difficulty: 'Medium',
          wordCount: '200 - 400 kata',
          objective: 'Membina prospek (nurture leads) dan memicu pembelian berulang lewat tulisan yang personal.',
          deliverables: ['Variasi judul email (Subject lines)', 'Body copy dengan hook kuat', 'Format penulisan ramah spam filter', 'Template pesan siaran WA & pemicu klik'],
          turnaround: '2 Hari Kerja',
          revisions: '2x Revisi',
          kpis: 'Email Open Rate, WhatsApp CTR, Reply Rate, Unsubscribe Rate.',
          addons: ['Setup otomatisasi platform (Klaviyo / Mailchimp) (+Rp 300rb)'],
          brief: 'Tujuan Campaign, Penawaran Khusus (Promo/Ebook), Profil Singkat Penerima, CTA Link.'
        },
        {
          id: 'ad_copy',
          name: 'Meta Ads & Google Ads Copywriting',
          price: 'Rp 200.000',
          range: 'Rp 200.000 - Rp 600.000 / set',
          hours: '1.5 - 3 Jam',
          difficulty: 'Medium',
          wordCount: 'Kustom (Sesuai batas karakter iklan)',
          objective: 'Menghasilkan rasio klik-tayang iklan tinggi dengan biaya per klik (CPC) serendah mungkin.',
          deliverables: ['3x Alternatif Headline iklan', '3x Primary Text naskah iklan', '2x Alternatif Deskripsi singkat', 'Saran visual/gambar pendukung naskah'],
          turnaround: '2 Hari Kerja',
          revisions: '2x Revisi',
          kpis: 'Click-Through Rate (CTR) ad platform, Cost Per Click (CPC), Relevance Score.',
          addons: ['Video script brief (+Rp 150rb)'],
          brief: 'Sudut Pandang Iklan, Kriteria Demografi Target, Platform Iklan, Batasan Kata.'
        }
      ]
    },
    strategy: {
      title: 'Content Strategy & Audits',
      desc: 'Perencanaan arsitektur informasi, pemetaan topik cluster, dan audit konten kompetitor agar investasi tulisan memiliki ROI yang jelas.',
      items: [
        {
          id: 'content_audit',
          name: 'Full Content & SEO Audit',
          price: 'Rp 2.000.000',
          range: 'Rp 2.000.000 - Rp 5.000.000',
          hours: '8 - 16 Jam',
          difficulty: 'High',
          wordCount: 'Dokumen Laporan PDF/Spreadsheet',
          objective: 'Mengidentifikasi artikel yang tumpang tindih (keyword cannibalization), halaman rusak, serta peluang perbaikan konversi.',
          deliverables: ['Laporan pemetaan performa URL eksisting', 'Rekomendasi tindakan (Keep, Delete, Redirect, Update)', 'Prioritas pengerjaan berdasarkan potensi trafik', 'Analisis kesehatan internal linking'],
          turnaround: '5 Hari Kerja',
          revisions: '1x Rapat Presentasi Laporan',
          kpis: 'Eliminasi eror sitemap, peningkatan organic traffic pasca-update.',
          addons: ['Technical audit server & kecepatan Next.js (+Rp 1.000.000)'],
          brief: 'Akses Google Analytics (Read-only), Google Search Console (Read-only), URL Domain Utama.'
        },
        {
          id: 'topic_cluster',
          name: 'Topic Cluster & Content Calendar Strategy',
          price: 'Rp 1.500.000',
          range: 'Rp 1.500.000 - Rp 3.500.000',
          hours: '6 - 10 Jam',
          difficulty: 'High',
          wordCount: 'Kalender Kerja 3 Bulan (Spreadsheet)',
          objective: 'Menyusun peta jalan artikel agar website diakui memiliki "Topical Authority" oleh mesin pencari.',
          deliverables: ['Pemetaan Pillar Page & Supporting Pages', 'Rencana Hubungan Link antar artikel', 'Kalender jadwal publikasi detail', 'Brief penulisan dasar untuk masing-masing judul'],
          turnaround: '4 Hari Kerja',
          revisions: '2x Penyesuaian Topik',
          kpis: 'Coverage target keywords, kelancaran workflow publikasi.',
          addons: ['Riset kompetitor langsung (+Rp 500rb)'],
          brief: 'Niche Bisnis, Daftar Layanan Utama, Kompetitor Terkuat, Kapasitas Produksi Bulanan.'
        }
      ]
    },
    publishing: {
      title: 'Publication & Blog Operations',
      desc: 'Layanan formatting, integrasi teknis CMS, optimasi alt text, injeksi schema markup, hingga pengiriman sinyal pengindeksan manual.',
      items: [
        {
          id: 'cms_publishing',
          name: 'CMS Publishing & Formatting Operations',
          price: 'Rp 100.000',
          range: 'Rp 100.000 - Rp 250.000 / artikel',
          hours: '1 - 2 Jam',
          difficulty: 'Low to Medium',
          wordCount: 'N/A',
          objective: 'Memastikan artikel terbit secara visual rapi, mematuhi hirarki heading SEO, dan langsung dikenali bot pencari.',
          deliverables: ['Formatting naskah di editor CMS (WordPress/Ghost/Next.js/Medium)', 'Optimasi struktur H1-H4 & bullet points', 'Pemasangan internal/external links', 'Upload & optimasi resolusi gambar pendukung', 'Pemasangan schema.org metadata', 'Ping indexing request Google & Bing'],
          turnaround: '1 Hari Kerja',
          revisions: '1x Koreksi visual',
          kpis: 'Publishing accuracy, metadata completion score, index coverage speed (dalam 24 jam).',
          addons: ['Penerjemahan kustom slug permalink (+Rp 25rb)'],
          brief: 'Akses Editor CMS (WordPress/Ghost), File Naskah (Docs/Markdown), Alt Text gambar.'
        }
      ]
    },
    blog_web_mgmt: {
      title: 'Monthly Blog & Web Management',
      desc: 'Paket retainer bulanan untuk mengoperasikan situs web Anda seolah-olah Anda memiliki tim editorial khusus.',
      items: [
        {
          id: 'blog_mgmt_pack',
          name: 'Monthly Blog Management Retainer',
          price: 'Rp 6.000.000',
          range: 'Rp 6.000.000 - Rp 15.000.000 / bln',
          hours: '20 - 40 Jam / bulan',
          difficulty: 'High',
          wordCount: '4 - 12 Artikel per bulan',
          objective: 'Mengoperasikan seluruh siklus editorial blog secara mandiri tanpa membebani tim internal Anda.',
          deliverables: ['Riset kata kunci bulanan', 'Penyusunan outline & kalender editorial', 'Proses penulisan & editing standar tinggi', 'Publishing langsung ke CMS Anda', 'Laporan bulanan organic growth', 'Pembersihan artikel usang (Content Refresh)'],
          turnaround: 'Setiap Bulan (Retainer)',
          revisions: 'Revisi Sepuasnya (Fase review draft)',
          kpis: 'Domain Authority, Organic Session Growth, Total Leads captured.',
          addons: ['Dukungan teknis server Next.js (+Rp 1.500.000/bln)'],
          brief: 'Kontrak Minimum 3 Bulan, Pedoman Brand, Target Konversi Bulanan.'
        }
      ]
    },
    social_pr: {
      title: 'Social Media & Digital PR',
      desc: 'Penyusunan naskah kepemimpinan berpikir (Thought Leadership) untuk media sosial dan penyebaran berita media massa.',
      items: [
        {
          id: 'social_writing',
          name: 'Thought Leadership & Social Content Writing',
          price: 'Rp 250.000',
          range: 'Rp 250.000 - Rp 600.000 / postingan',
          hours: '1.5 - 3 Jam',
          difficulty: 'Medium to High',
          wordCount: '150 - 500 kata (LinkedIn/X/Instagram)',
          objective: 'Meningkatkan interaksi organik di media sosial B2B dan membangun otoritas personal/brand.',
          deliverables: ['Copywriting hook tajam', 'Naskah teks lengkap dengan CTA & Hashtag relevan', 'Konsep slide Carousel (Canva Brief untuk desainer)', 'Versi utas / thread khusus platform X'],
          turnaround: '2 Hari Kerja',
          revisions: '2x Revisi',
          kpis: 'Organic Impressions, Share Rate, Profile Visits, Inbound Lead messages.',
          addons: ['Grafis template dasar Canva (+Rp 150rb)'],
          brief: 'Topik Bahasan, Key Takeaway untuk audiens, Nada Bicara (Inspiratif/Kritikal), Target Platform.'
        },
        {
          id: 'backlink_pr',
          name: 'Digital PR & Guest Posting Outreach',
          price: 'Rp 1.500.000',
          range: 'Rp 1.500.000 - Rp 4.500.000 / link',
          hours: '5 - 10 Jam',
          difficulty: 'High',
          wordCount: 'Termasuk artikel 1.000 kata',
          objective: 'Mendapatkan link rujukan balik (backlink) berkualitas tinggi dari portal tepercaya untuk mendongkrak otoritas domain.',
          deliverables: ['Outreach ke pemilik blog partner', 'Penulisan artikel guest post relevan', 'Anchor text natural terpasang', 'Laporan publikasi link aktif (Dofollow)'],
          turnaround: '7-10 Hari Kerja',
          revisions: '1x Penyesuaian anchor text',
          kpis: 'Domain Rating (DR) target site, link index status, referral traffic.',
          addons: ['Portal berita mainstream / nasional (Hubungi langsung)'],
          brief: 'URL Target Halaman, Anchor Text yang diinginkan, Niche website pendukung.'
        }
      ]
    }
  };

  const briefTemplates = {
    seo: {
      title: 'Brief Penulisan SEO Content',
      fields: [
        'Nama Bisnis & Niche: [Masukkan Nama Bisnis Anda]',
        'Topik Artikel / Judul Utama: [Misal: Cara Memilih Web Developer Next.js]',
        'Kata Kunci Target Utama (Primary Keyword): [Misal: jasa website Next.js]',
        'Kata Kunci Pendukung (LSI): [Misal: harga web Next.js, kelebihan Next.js]',
        'Tujuan Artikel: [Edukasi UMKM / Dapatkan Pendaftaran Leads]',
        'Kompetitor Utama URL: [Misal: https://competitor.com/blog-post]',
        'Tone of Voice: [Profesional / Santai namun Edukatif / Inspiratif]',
        'CTA yang diinginkan: [Tombol hubungi via WhatsApp / Formulir Audit]',
        'Publishing Channel: [WordPress / Ghost / Next.js CMS / N/A (Hanya naskah)]'
      ]
    },
    copy: {
      title: 'Brief Landing Page Copywriting',
      fields: [
        'Nama Produk/Layanan: [Masukkan Nama Layanan]',
        'Deskripsi Singkat Layanan: [Apa yang Anda tawarkan dan masalah apa yang selesai]',
        'Siapa Target Audience Utama: [Misal: Pemilik bisnis logistik skala regional]',
        'Pain Point Terbesar Target: [Misal: Sistem pelacakan pengiriman kacau & lambat]',
        'Fitur Utama & Manfaat: [Sistem pelacakan real-time Supabase, menghemat waktu 40%]',
        'USP (Unique Selling Proposition): [Kami satu-satunya dengan Next.js sub-detik]',
        'Action yang Diharapkan: [Booking konsultasi gratis 30 menit]',
        'Skema Warna & Moodbrand: [Premium Dark Mode / Clean Alabaster]'
      ]
    },
    pr: {
      title: 'Brief Press Release & Media Outreach',
      fields: [
        'Sudut Berita Utama (Angle): [Misal: Zadit Content Studio Luncurkan Rate Card Terbuka]',
        'Kutipan Utama Juru Bicara (Quote): ["Kami merilis sistem pricing terbuka demi transparansi industri digital." - Zadit]',
        'Tanggal Penerbitan yang Diinginkan: [Misal: 25 Juni 2026]',
        'Fakta & Data Statistik Pendukung: [Rilis pers ini didukung riset performa 50+ proyek Next.js]',
        'Nama Kontak PR & Perusahaan: [Nama Media Officer / Zadit]',
        'Portal Berita Target: [Media Lokal Cirebon / Media Nasional Utama]'
      ]
    }
  };

  const activeBrief = briefTemplates[selectedBriefType];

  const handleCopyBrief = () => {
    const textToCopy = `=== ${activeBrief.title} ===\n\n` + activeBrief.fields.join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  // Structured KPI Data
  const kpisData = {
    seo: [
      { label: 'Organic Clicks & Sessions', val: 'Target Kenaikan >50%', desc: 'Metrik utama keberhasilan paparan sitemap cluster di mesin pencari.' },
      { label: 'Average CTR on Google Search', val: 'Skor Optimal >5%', desc: 'Mengukur ketajaman penulisan Meta Title & Description pada daftar hasil pencarian.' },
      { label: 'Top 10 Keywords Ranking', val: 'Otoritas Cluster Niche', desc: 'Indikator dominasi otoritas topik (Topical Authority) pada domain.' }
    ],
    publishing: [
      { label: 'Metadata Completion Score', val: '100% Sempurna', desc: 'Seluruh struktur alt text, meta description, H1-H4, dan canonical tag terisi.' },
      { label: 'Index Coverage Speed', val: '< 24 Jam Terindeks', desc: 'Menggunakan API IndexNow & instant Google ping untuk mengamankan halaman baru.' },
      { label: 'Publishing Accuracy Rate', val: '99.9% Zero-Error', desc: 'Bebas dari kesalahan format, link rusak (broken links), atau gambar pecah.' }
    ],
    content: [
      { label: 'Readability Score (Flesch)', val: 'Optimal & Jelas', desc: 'Pembersihan kalimat dari jargon berlebihan agar mudah dibaca dalam 60 detik.' },
      { label: 'Originality / Plagiarism Check', val: '100% Orisinalitas', desc: 'Jaminan tulisan bebas plagiasi dan ditulis secara humanis (bukan sekadar AI-spin).' },
      { label: 'Brand Consistency Match', val: '100% Selaras', desc: 'Tulisan mematuhi acuan nada suara (Tone of Voice) pedoman merek Anda.' }
    ],
    social_pr: [
      { label: 'Engagement & Share Rate', val: 'Tumbuh Stabil', desc: 'Jumlah interaksi pada artikel thought leadership di LinkedIn / Platform X.' },
      { label: 'Media Pickups & Mentions', val: 'PR Otoritas', desc: 'Jumlah portal berita lokal/nasional yang menayangkan rilis pers resmi.' },
      { label: 'Referral Traffic Quality', val: 'High Intent Leads', desc: 'Mengukur trafik masuk dari guest post yang berminat mengajukan kemitraan.' }
    ]
  };

  return (
    <section id="rate-card" className="bg-alabaster py-24 border-b border-brand-border relative overflow-hidden">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="absolute inset-0 pointer-events-none grid-bg opacity-[0.25]" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 text-center space-y-3">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase bg-amber-500/10 border border-gold-accent/20 px-3 py-1 rounded-full">
            Studio Penulisan, SEO & Operasi Editorial
          </span>
          <h2 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary mt-3 leading-tight tracking-tight">
            Rate Card & <span className="gradient-text-teal">Paket Operasi Konten</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Dari penulisan artikel SEO, siaran pers, pengelolaan blog bulanan, hingga PR digital. 
            Semua dikerjakan secara transparan dengan KPI terukur dan integrasi CMS Next.js / WordPress instan.
          </p>
        </div>

        {/* 1. SERVICES INTERACTIVE CATALOG (EXPANDABLE DETAILS) */}
        <div className="mb-16 bg-white border border-brand-border rounded-[2rem] p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-border pb-6 mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold font-heading-sans text-text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-accent" /> Katalog Layanan Editorial & Menulis
              </h3>
              <p className="text-xs text-text-muted mt-1">Pilih kategori layanan di bawah untuk melihat rincian biaya, kesulitan, estimasi jam, dan brief sistem.</p>
            </div>
            
            {/* Category Tab Selector */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[9px] uppercase tracking-wider">
              {[
                { id: 'seo_writing', label: 'SEO Writing' },
                { id: 'copywriting', label: 'Copywriting' },
                { id: 'strategy', label: 'Strategy & Audits' },
                { id: 'publishing', label: 'CMS Publishing' },
                { id: 'blog_web_mgmt', label: 'Management' },
                { id: 'social_pr', label: 'Social & PR' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id as any);
                    setExpandedServiceId(null);
                  }}
                  className={`px-3 py-2 rounded-lg border transition-all ${
                    activeTab === cat.id 
                      ? 'bg-teal-accent text-white border-teal-accent font-bold' 
                      : 'bg-offwhite/50 border-brand-border text-text-muted hover:bg-offwhite'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-xs text-text-muted italic bg-offwhite/40 p-4 border-l-2 border-teal-accent rounded-r-xl">
                {servicesData[activeTab].desc}
              </p>
            </div>

            {servicesData[activeTab].items.map((item) => {
              const isExpanded = expandedServiceId === item.id;
              return (
                <div key={item.id} className="border border-brand-border rounded-2xl overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setExpandedServiceId(isExpanded ? null : item.id)}
                    className="w-full px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between text-left gap-4 hover:bg-offwhite/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-teal-accent uppercase block">Layanan Terstruktur</span>
                      <h4 className="text-sm font-bold text-text-primary font-heading-sans flex items-center gap-1.5">
                        {item.name}
                        <Sparkles className="w-3.5 h-3.5 text-gold-accent fill-gold-accent/20" />
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-6 font-mono text-[11px]">
                      <div>
                        <span className="text-text-muted text-[9px] block">Mulai Dari</span>
                        <span className="text-text-primary font-bold">{item.price}</span>
                      </div>
                      <div>
                        <span className="text-text-muted text-[9px] block">Turnaround</span>
                        <span className="text-text-primary font-bold">{item.turnaround}</span>
                      </div>
                      <div className="text-text-muted hover:text-text-primary">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-brand-border bg-offwhite/20"
                      >
                        <div className="p-6 space-y-6 font-sans text-xs text-text-muted leading-relaxed">
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Metadata Metrics */}
                            <div className="space-y-3 bg-white p-4 rounded-xl border border-brand-border">
                              <span className="text-[9px] font-mono text-text-primary font-bold uppercase tracking-wider block border-b border-brand-border pb-1">PARAMETER OPERASIONAL</span>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-text-muted text-[10px] block">Rasio Jam Kerja:</span>
                                  <span className="text-text-primary font-semibold font-mono">{item.hours}</span>
                                </div>
                                <div>
                                  <span className="text-text-muted text-[10px] block">Tingkat Kesulitan:</span>
                                  <span className="text-text-primary font-semibold font-mono">{item.difficulty}</span>
                                </div>
                                <div>
                                  <span className="text-text-muted text-[10px] block">Rentang Biaya Umum:</span>
                                  <span className="text-text-primary font-semibold font-mono">{item.range}</span>
                                </div>
                                <div>
                                  <span className="text-text-muted text-[10px] block">Kebijakan Revisi:</span>
                                  <span className="text-text-primary font-semibold">{item.revisions}</span>
                                </div>
                              </div>
                            </div>

                            {/* Scope & Deliverables */}
                            <div className="space-y-3 bg-white p-4 rounded-xl border border-brand-border">
                              <span className="text-[9px] font-mono text-text-primary font-bold uppercase tracking-wider block border-b border-brand-border pb-1">DELIVERABLES CHECKLIST</span>
                              <ul className="space-y-1.5">
                                {item.deliverables.map((deliv, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-teal-accent flex-shrink-0 mt-0.5" />
                                    <span>{deliv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Addons & Pricing */}
                            <div className="space-y-3 bg-white p-4 rounded-xl border border-brand-border">
                              <span className="text-[9px] font-mono text-text-primary font-bold uppercase tracking-wider block border-b border-brand-border pb-1">OPSIONAL ADD-ONS</span>
                              <ul className="space-y-1.5 font-mono text-[10px]">
                                {item.addons.map((add, idx) => (
                                  <li key={idx} className="flex items-center gap-1.5 text-text-primary">
                                    <Plus className="w-3 h-3 text-gold-accent flex-shrink-0" />
                                    <span>{add}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="pt-2 border-t border-brand-border/60">
                                <span className="text-[9px] block text-text-muted">Target KPI Utama:</span>
                                <p className="text-[10px] font-medium text-teal-accent italic leading-relaxed">{item.kpis}</p>
                              </div>
                            </div>

                          </div>

                          {/* Brief template section */}
                          <div className="bg-brand-slate text-text-inverse p-4 rounded-xl font-mono text-[10px] space-y-2">
                            <span className="text-gold-accent font-bold tracking-widest block uppercase">DRAF BRIEF SISTEM STRUKTUR</span>
                            <p className="text-white/60 text-[9px] mb-2 leading-relaxed">
                              Copy dan sesuaikan pola brief ini sebelum mengirim pesanan ke formulir pemesanan.
                            </p>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10 select-all whitespace-pre-wrap leading-relaxed text-white">
                              {`[ brief-sistem-id: ${item.id} ]\n` + item.brief}
                            </div>
                          </div>

                          {/* Order Action Button */}
                          <div className="flex justify-end pt-2">
                            <a
                              href={`https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20ingin%20memesan%20layanan%20${encodeURIComponent(item.name)}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-teal-accent text-white font-mono text-[10px] uppercase font-bold tracking-wider px-5 py-3 rounded-xl hover:bg-teal-glow transition-all"
                            >
                              <span>Pesan Naskah {item.name}</span>
                              <Send className="w-3.5 h-3.5" />
                            </a>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. PERSISTENT PRICING PACKAGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6 mb-16 items-stretch">
          {packages.map((pkg) => {
            const isFeatured = pkg.id === 'growth';
            return (
              <div 
                key={pkg.id} 
                className={`bg-white border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group ${
                  isFeatured 
                    ? 'border-teal-accent ring-1 ring-teal-accent shadow-md' 
                    : 'border-brand-border hover:border-text-primary/20 shadow-sm'
                }`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <span className={`absolute -top-2.5 left-4 font-mono text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                    isFeatured 
                      ? 'bg-teal-accent text-white border-teal-accent' 
                      : 'bg-offwhite text-text-muted border-brand-border'
                  }`}>
                    {pkg.badge}
                  </span>
                )}

                <div className="space-y-3 pt-1">
                  <div>
                    <h3 className="font-heading-sans font-black text-sm text-text-primary tracking-tight leading-tight">{pkg.name}</h3>
                    <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed font-sans min-h-[42px] h-auto">{pkg.description}</p>
                  </div>

                  <div className="py-1.5 border-y border-brand-border/50 font-mono">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-black text-text-primary">{pkg.price}</span>
                      {pkg.period && <span className="text-[9px] text-text-muted">{pkg.period}</span>}
                    </div>
                    <div className="text-[9px] text-teal-accent mt-0.5 uppercase tracking-wider">
                      Jadwal: {pkg.timeline}
                    </div>
                  </div>

                  {/* Scope details */}
                  <div className="space-y-1 text-[10px]">
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider">UNTUK WEB SIZE:</div>
                    <p className="text-text-primary font-medium leading-relaxed font-sans">{pkg.suitable_for}</p>
                  </div>

                  {/* Deliverables bullet list */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider">CAKUPAN:</div>
                    <ul className="space-y-1 text-[10px] text-text-primary">
                      {pkg.deliverables.slice(0, 5).map((d, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <Check className="w-3 h-3 text-teal-accent mt-0.5 flex-shrink-0" />
                          <span className="leading-snug">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-brand-border/50 mt-4">
                  <div className="flex flex-col gap-1 font-mono text-[9px] text-text-muted">
                    <div className="flex justify-between items-center gap-2">
                      <span>REVISI:</span>
                      <span className="text-text-primary font-bold truncate max-w-[140px]">{pkg.revisions}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span>DUKUNGAN:</span>
                      <span className="text-text-primary font-bold truncate max-w-[140px]">{pkg.support}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={pkg.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded-lg font-mono text-[9px] uppercase tracking-wider font-bold transition-all text-center flex items-center justify-center gap-1 ${
                      isFeatured
                        ? 'bg-teal-accent text-white hover:bg-teal-glow shadow-sm'
                        : 'bg-offwhite text-text-primary hover:bg-brand-border'
                    }`}
                  >
                    <span>{pkg.cta}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. INTERACTIVE BRIEF SYSTEM GENERATOR */}
        <div className="mb-16 bg-brand-slate text-white rounded-[2rem] p-6 md:p-10 shadow-lg relative overflow-hidden noise-overlay">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-accent/10 rounded-full filter blur-3xl pointer-events-none -mr-40 -mt-40" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-gold-accent uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-gold-accent text-gold-accent" /> BRIEF SYSTEM CREATOR
              </span>
              <h3 className="text-xl md:text-3xl font-bold font-heading-serif">Interactive Brief Generator</h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                Setiap pengerjaan dimulai dari Brief terstandardisasi. Pilih tipe penawaran di bawah, salin pola brief yang dihasilkan, lalu kirim ke formulir agar Zadit langsung memprosesnya.
              </p>

              {/* Brief Selectors */}
              <div className="flex gap-2 font-mono text-[9px] uppercase tracking-widest">
                {[
                  { id: 'seo', label: 'SEO Brief' },
                  { id: 'copy', label: 'Copy Brief' },
                  { id: 'pr', label: 'PR/Outreach Brief' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBriefType(b.id as any)}
                    className={`px-3 py-2.5 rounded-lg border transition-all ${
                      selectedBriefType === b.id 
                        ? 'bg-teal-accent border-teal-accent text-white font-bold shadow-sm' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3 font-mono text-[9px] uppercase">
                <span className="text-teal-glow">{activeBrief.title}</span>
                <button 
                  onClick={handleCopyBrief}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded font-bold transition-all"
                >
                  {copiedBrief ? 'Copied!' : 'Copy Brief'}
                </button>
              </div>

              <div className="space-y-2.5 font-mono text-xs text-white/80 max-h-[250px] overflow-y-auto pr-2">
                {activeBrief.fields.map((field, idx) => (
                  <div key={idx} className="bg-white/5 p-2 rounded border border-white/5 leading-relaxed">
                    {field}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. COMPARISON TABLE */}
        <div className="mb-24 bg-white border border-brand-border rounded-[2rem] p-6 md:p-10 shadow-sm overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg font-bold text-text-primary font-heading-sans">Tabel Perbandingan Fitur Paket Bulanan</h3>
              <span className="text-[10px] font-mono text-text-muted">RETANER MONTHLY MATRIX</span>
            </div>
            
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-[10px] font-mono uppercase tracking-wider text-text-muted">
                  <th className="py-4 w-1/4">Fitur / Cakupan</th>
                  <th className="py-4 px-2 w-1/6">Starter</th>
                  <th className="py-4 px-2 w-1/6 text-teal-accent font-bold">Growth Engine</th>
                  <th className="py-4 px-2 w-1/6">Business</th>
                  <th className="py-4 px-2 w-1/6">Executive</th>
                  <th className="py-4 px-2 w-1/6">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60 text-text-primary">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-offwhite/30 transition-colors">
                    <td className="py-4 font-medium text-text-muted">{row.name}</td>
                    <td className="py-4 px-2">{row.starter}</td>
                    <td className="py-4 px-2 text-teal-accent font-semibold">{row.growth}</td>
                    <td className="py-4 px-2">{row.professional}</td>
                    <td className="py-4 px-2">{row.professional}</td> {/* Using professional mapping as Executive standin */}
                    <td className="py-4 px-2">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. VISUAL TIMELINE / OPERATIONS WORKFLOW */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-mono tracking-widest text-gold-accent uppercase block">OPERATIONS PIPELINE</span>
            <h3 className="text-2xl font-bold font-heading-sans text-text-primary">Workflow & Alur Kerja Redaksi</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center font-mono text-[9px] uppercase tracking-wider">
            {[
              { num: '01', title: 'Discovery', desc: 'Rapat awal visi brand.' },
              { num: '02', title: 'Briefing', desc: 'Pengisian template parameter.' },
              { num: '03', title: 'Research & SEO', desc: 'Riset keyword & kompetitor.' },
              { num: '04', title: 'Outline', desc: 'Penyusunan kerangka struktur.' },
              { num: '05', title: 'Approval', desc: 'Review outline oleh klien.' },
              { num: '06', title: 'Writing & Edit', desc: 'Penulisan draf & editing.' },
              { num: '07', title: 'Publishing', desc: 'Upload CMS & index request.' },
              { num: '08', title: 'PR & Report', desc: 'Distribusi media & laporan.' }
            ].map((step, i) => (
              <div key={i} className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col justify-between min-h-[140px] relative group hover:border-teal-accent/30 transition-all">
                {i < 7 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20 text-brand-border group-hover:text-teal-accent/30 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-teal-accent">{step.num}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-border group-hover:bg-teal-accent transition-colors" />
                </div>
                <div>
                  <span className="font-bold block text-text-primary mb-1 text-[9px] leading-tight">{step.title}</span>
                  <span className="text-[8px] text-text-muted leading-relaxed block text-center lowercase">{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. BRAINSTORM WORKSHOP & PAID SESSION */}
        <div className="mb-24 bg-white border border-brand-border rounded-[2rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-accent/5 rounded-full filter blur-3xl pointer-events-none -mr-32 -mt-32" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono tracking-widest text-gold-accent uppercase bg-amber-500/10 border border-gold-accent/20 px-3 py-1 rounded-full">
                Sesi Konsultasi Khusus & Strategi
              </span>
              <h3 className="text-2xl font-bold font-heading-serif text-text-primary">Zadit Brainstorm Workshop</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Bingung menentukan arah konten atau bagaimana memetakan funnel kata kunci bisnis Anda? Masuki sesi workshop berbayar interaktif selama 90 menit langsung dengan Zadit untuk merancang blueprint editorial Anda.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-primary font-medium pt-2">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Pemetaan Posisi Merek & Pesan</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Pemetaan Corong Penjualan Konten</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Riset 10 Topik Cluster Utama</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Garansi PDF Blueprint Peta Jalan</div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-offwhite/40 border border-brand-border rounded-2xl p-6 text-center space-y-4">
              <span className="text-[10px] font-mono text-text-muted uppercase block">BIAYA WORKSHOP INTENSIF</span>
              <div className="text-3xl font-black text-text-primary font-mono">Rp 1.500.000</div>
              <p className="text-[10px] text-text-muted leading-relaxed">Sesi 90 menit via Zoom/GMeet. Termasuk rekaman dan dokumen blueprint kerja.</p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20ingin%20memesan%20Sesi%20Brainstorm%20Workshop%20berbayar.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gold-accent hover:bg-gold-muted text-white font-mono text-xs uppercase tracking-wider font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Daftar Sesi Workshop</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* 7. MEASURABLE KPIS HUB */}
        <div className="mb-24 bg-white border border-brand-border rounded-[2rem] p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-border pb-6 mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold font-heading-sans text-text-primary">Indikator Kinerja Utama (KPI Hub)</h3>
              <p className="text-xs text-text-muted">Setiap artikel dan rilis pers diukur berdasarkan indikator kinerja yang transparan.</p>
            </div>
            
            <div className="flex gap-2 font-mono text-[9px] uppercase tracking-wider">
              {[
                { id: 'seo', label: 'SEO Metrics' },
                { id: 'publishing', label: 'Publishing Accuracy' },
                { id: 'content', label: 'Content Quality' },
                { id: 'social_pr', label: 'Social & PR' }
              ].map(k => (
                <button
                  key={k.id}
                  onClick={() => setKpiCategory(k.id as any)}
                  className={`px-3 py-2 rounded-lg border transition-all ${
                    kpiCategory === k.id 
                      ? 'bg-teal-accent text-white border-teal-accent font-bold' 
                      : 'bg-offwhite/50 border-brand-border text-text-muted hover:bg-offwhite'
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpisData[kpiCategory].map((kpi, idx) => (
              <div key={idx} className="bg-offwhite/40 border border-brand-border rounded-xl p-5 space-y-2">
                <span className="text-[10px] font-mono text-teal-accent uppercase block">Target Kinerja</span>
                <div className="text-lg font-black text-text-primary leading-tight font-heading-sans">{kpi.label}</div>
                <div className="text-xs font-bold text-gold-accent font-mono">{kpi.val}</div>
                <p className="text-[10px] text-text-muted leading-relaxed pt-2 border-t border-brand-border/60">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 8. FAQS COMPONENT */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-10">
            <HelpCircle className="w-8 h-8 text-teal-accent mx-auto" />
            <h3 className="text-2xl font-bold font-heading-sans text-text-primary">Pertanyaan Umum (FAQ)</h3>
            <p className="text-xs text-text-muted">Klarifikasi instan seputar alur kerja, penulisan, dan lisensi editorial.</p>
          </div>

          <div className="space-y-3 font-sans">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIdx === i;
              return (
                <div key={i} className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left text-xs md:text-sm font-bold text-text-primary hover:bg-offwhite/50 transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-text-muted flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-xs text-text-muted leading-relaxed border-t border-brand-border/40 pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
}

// Generate valid offer schema items dynamically
const schemaOffers = [
  { id: 'starter', name: 'Starter Content Package', price: '4500000' },
  { id: 'growth', name: 'Growth Blog Engine Package', price: '8500000' },
  { id: 'business', name: 'Business Authority Package', price: '16000000' },
  { id: 'authority', name: 'Executive Studio Package', price: '28000000' }
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  'name': 'Zadit Editorial Operations & Content Studio',
  'image': 'https://muhzadit.vercel.app/icon.png',
  'url': 'https://muhzadit.vercel.app',
  'telephone': '+6282316363177',
  'priceRange': '$$$',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Cirebon',
    'addressRegion': 'Jawa Barat',
    'addressCountry': 'ID'
  },
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': 'Editorial & SEO Content Writing Catalog',
    'itemListElement': schemaOffers.map(o => ({
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': o.name,
      },
      'price': o.price,
      'priceCurrency': 'IDR',
      'url': 'https://muhzadit.vercel.app#rate-card'
    }))
  }
};
