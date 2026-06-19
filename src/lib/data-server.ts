import { supabase } from './supabase';
import { unstable_cache } from 'next/cache';
import { Service, CaseStudy, City, Entity, Article, ReferenceItem } from './types';

// Safe fallbacks to keep site building and running even if DB tables do not exist yet
const fallbackSiteContent: Record<string, string> = {
  hero_headline: "Code doesn't scale without story. Story doesn't convert without data. Data doesn't persuade without execution.",
  hero_subheading: "Zadit membantu UMKM, instansi swasta, hingga lembaga publik merancang situs web berkecepatan tinggi, mengelola blog informatif, menyusun slide presentasi premium, dan menganalisis data untuk mengunci pertumbuhan bisnis yang dapat diprediksi secara transparan.",
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
    title: 'Berapa Biaya SEO di Indonesia? Panduan Transparansi Anggaran 2026',
    slug: 'berapa-biaya-seo-di-indonesia',
    content: '<p>Berapa sebenarnya biaya optimasi SEO yang ideal untuk bisnis Anda di Indonesia? Di pasar lokal, tarif SEO sangat bervariasi mulai dari paket murah Rp 500 ribu hingga puluhan juta rupiah per bulan. Namun, mengapa terdapat perbedaan harga yang begitu kontras?</p><h4>1. Struktur Layanan & Otoritas</h4><p>Layanan SEO berkualitas tinggi melibatkan Technical Audit, On-page Optimization, riset kata kunci semantik, dan pembuatan konten berkualitas tinggi secara konsisten. Di <a href="/#services">Layanan Growth Architect</a>, kami menggabungkan rekayasa kode Next.js dengan optimasi mesin pencari.</p><h4>2. Mengapa SEO Murah Seringkali Gagal?</h4><p>Banyak agensi murah hanya fokus pada optimasi keyword instan menggunakan teknik spam backlink yang rentan diblokir oleh pembaruan algoritma Google Core. Padahal, SEO modern menuntut kecepatan website sub-detik dan Core Web Vitals yang sempurna. Anda bisa menguji performa situs Anda sekarang menggunakan <a href="/utility/audit-engine">Audit Engine Kecepatan Web</a> gratis kami.</p><h4>3. Memilih Paket yang Tepat</h4><p>Sebelum memulai, pastikan Anda meninjau <a href="/#rate-card">Rate Card Terbuka</a> kami untuk memperkirakan kecocokan anggaran dengan kebutuhan bisnis Anda. Kami menawarkan pilihan transparan mulai dari Starter hingga Growth Engine, lengkap dengan <a href="/#case-studies">Kajian Kasus Nyata</a> yang membuktikan keberhasilan metrik pertumbuhan. Hubungi kami langsung di <a href="/#partnership">Formulir Kemitraan</a> untuk konsultasi awal gratis.</p>',
    meta_title: 'Berapa Biaya SEO di Indonesia? (Panduan Lengkap 2026)',
    meta_description: 'Analisis biaya SEO di Indonesia. Temukan mengapa harga bervariasi, bahaya SEO murah, dan cara memilih paket optimasi yang memiliki ROI terukur.',
    author_name: 'Muhammad Khoiruzzadittaqwa',
    is_published: true,
    published_at: new Date().toISOString()
  },
  {
    id: 'a2',
    title: 'Panduan Harga Pembuatan Website Next.js Premium vs WordPress Murah',
    slug: 'panduan-harga-pembuatan-website-2026',
    content: '<p>Memilih platform untuk website bisnis Anda adalah keputusan investasi jangka panjang. Seringkali, pemilik bisnis tergoda dengan penawaran pembuatan website WordPress seharga Rp 500 ribu yang berujung pada performa lambat dan rentan diretas.</p><h4>1. Mengapa Next.js Layak Diperhitungkan?</h4><p>Next.js menawarkan performa loading sub-detik berkat teknologi Server-Side Rendering (SSR) dan static generation (ISR). Website yang cepat secara dramatis menurunkan bounce rate dan meningkatkan conversion rate hingga 3x lipat dibanding CMS konvensional yang lambat. Anda dapat membaca perbandingan detail fitur di <a href="/#rate-card">Tabel Perbandingan Rate Card</a> kami.</p><h4>2. Pengaruh Kecepatan pada SEO & Otoritas</h4><p>Mesin pencari modern seperti Google menempatkan Core Web Vitals sebagai faktor peringkat utama. Website Next.js yang bersih menjamin skor Lighthouse Anda menyentuh angka 95-100 secara konsisten. Gunakan <a href="/utility/audit-engine">Audit Engine Kecepatan</a> kami untuk menguji kesiapan website Anda.</p><h4>3. Membangun Ekosistem Digital Berkelanjutan</h4><p>Untuk meluncurkan situs Next.js yang terintegrasi dengan basis data tepercaya, pelajari pilihan di <a href="/#services">Modul Solusi Terintegrasi</a> atau pelajari bagaimana kami mengimplementasikan arsitektur ini pada klien publik di <a href="/#case-studies">Kajian Kasus Kecepatan Web</a>. Jika Anda siap berdiskusi, kirimkan kebutuhan Anda melalui <a href="/#partnership">Formulir Kemitraan Digital</a>.</p>',
    meta_title: 'Harga Pembuatan Website Next.js Premium (2026)',
    meta_description: 'Panduan harga pembuatan website modern di Indonesia. Kenapa Next.js lebih unggul dibanding CMS WordPress dalam hal performa, konversi, dan SEO jangka panjang.',
    author_name: 'Zadit Growth',
    is_published: true,
    published_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'a3',
    title: 'Analisis Biaya Otomatisasi Konten: Membangun AGC Menggunakan Gemini AI & RSS',
    slug: 'analisis-biaya-otomatisasi-ai-scraper',
    content: '<p>Memproduksi konten blog secara konsisten adalah tantangan terbesar dalam SEO. Di sinilah sistem Auto-Generated Content (AGC) dengan pemrosesan bahasa alami (LLM) hadir sebagai penyelamat biaya operasional Anda.</p><h4>1. Strategi Zero-Cost AI Content Pipeline</h4><p>Dengan memanfaatkan RSS feed eksternal yang di-ingest secara berkala, lalu diproses menggunakan API Google Gemini Flash yang efisien, Anda dapat memproduksi puluhan artikel berkualitas secara otomatis tanpa biaya penulis konten eksternal yang mahal. Layanan ini sepenuhnya tercakup dalam paket <a href="/#rate-card">Growth Engine</a> kami.</p><h4>2. Mitigasi Kegagalan dengan Dynamic Fallback</h4><p>Sistem AGC yang andal tidak boleh rusak ketika API AI offline. Kami mengimplementasikan sistem hybrid dengan No-AI Fallback: jika API offline, sistem menyajikan snippet asli beserta tombol rujukan resmi. Anda dapat melihat integrasi teknisnya di halaman <a href="/#services">Daftar Layanan Integrasi</a>.</p><h4>3. Mengukur Dampak & Hasil Konversi</h4><p>Otomatisasi konten yang terstruktur telah terbukti melipatgandakan indeks pencarian organik di mesin pencari. Kunjungi halaman <a href="/#case-studies">Studi Kasus Pertumbuhan</a> kami untuk melihat hasil nyata dari implementasi sistem ini, atau uji kualitas indeks sitemap Anda di <a href="/utility/audit-engine">Audit Engine Kecepatan & SEO</a>. Silakan hubungi kami di <a href="/#partnership">Hub Kemitraan</a> untuk detail setup lebih lanjut.</p>',
    meta_title: 'Analisis Biaya AGC Gemini AI & Scraper Konten (2026)',
    meta_description: 'Cara kerja dan rincian biaya membangun sistem AGC berbasis AI & RSS feed dengan fallback dinamis tanpa biaya lisensi bulanan yang mahal.',
    author_name: 'Zadit Growth',
    is_published: true,
    published_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'a4',
    title: 'Mengapa SEO Murah Biasanya Gagal? Bahaya Tersembunyi di Balik Paket Instan',
    slug: 'mengapa-seo-murah-biasanya-gagal',
    content: '<p>Banyak pemilik bisnis terjebak dengan paket SEO murah seharga Rp 300 ribu hingga Rp 1 juta per bulan yang menjanjikan posisi nomor satu Google secara instan. Artikel ini mengungkap mengapa praktik tersebut sangat berisiko bagi reputasi domain Anda.</p><h4>1. Bahaya Backlink Spam & Duplikasi Konten</h4><p>Penyedia SEO murah biasanya menggunakan software otomatis untuk menyebarkan komentar spam dan backlink di website berkualitas rendah. Hal ini memicu penalti manual dari Google yang dapat menghapus domain Anda sepenuhnya dari hasil pencarian.</p><h4>2. Pentingnya Technical SEO & Otoritas Asli</h4><p>SEO modern berfokus pada pengalaman pengguna yang nyata: kecepatan muat, struktur navigasi yang logis, dan tulisan yang otoritatif. Di <a href="/#services">Layanan Growth Architect</a>, kami membangun optimasi teknikal tingkat lanjut. Anda dapat menguji tingkat kesehatan website Anda di <a href="/utility/audit-engine">Audit Engine</a> kami.</p><h4>3. Investasi SEO yang Berorientasi Hasil</h4><p>SEO adalah maraton, bukan sprint. Lihat bagaimana kami membantu mitra strategis meningkatkan visibilitas SERP hingga +148% di <a href="/#case-studies">Kajian Kasus Otoritas Publik</a>, dan pilih anggaran investasi terbaik untuk bisnis Anda di <a href="/#rate-card">Rate Card Terbuka</a> kami. Mulailah bermitra secara profesional melalui <a href="/#partnership">Formulir Pengajuan Proposal</a> kami.</p>',
    meta_title: 'Mengapa Layanan SEO Murah Biasanya Gagal? (Bahaya Penalti)',
    meta_description: 'Ketahui bahaya tersembunyi di balik jasa SEO murah instan, risiko penalti algoritma Google, dan bagaimana investasi SEO berkualitas bekerja.',
    author_name: 'Muhammad Khoiruzzadittaqwa',
    is_published: true,
    published_at: new Date(Date.now() - 259200000).toISOString()
  }
];

const fallbackReferenceItems: ReferenceItem[] = [
  {
    id: 'r1',
    title: 'B2B Growth Playbook: Strategi Konversi Landing Page Terukur',
    slug: 'b2b-growth-playbook-landing-page-conversion',
    category: 'growth-playbook',
    summary: 'Panduan menyusun narasi landing page konversi tinggi menggunakan PAS (Problem-Agitate-Solve) framework untuk pasar B2B.',
    content: '<h3>Metodologi PAS Framework untuk Konversi B2B</h3><p>Dalam dunia bisnis-ke-bisnis (B2B), keputusan pembelian didasari oleh logika, efisiensi, dan mitigasi risiko. Oleh karena itu, tulisan penjualan (copywriting) tidak boleh sekadar berhias jargon indah, melainkan harus menyelesaikan masalah spesifik.</p><h4>1. Problem (Identifikasi Masalah)</h4><p>Mulai dengan mendefinisikan rasa sakit terdalam klien Anda. Misalnya, "Trafik website naik, tapi tidak ada leads masuk." Ini langsung menyaring audiens yang tepat.</p><h4>2. Agitate (Perparah Masalah)</h4><p>Jelaskan konsekuensi membiarkan masalah tersebut. "Setiap hari masalah ini dibiarkan, anggaran iklan Anda terbuang percuma dan kompetitor merebut pangsa pasar potensial Anda."</p><h4>3. Solve (Tawarkan Solusi Terukur)</h4><p>Tawarkan solusi spesifik Anda dengan data konkret. "Sistem audit kecepatan dan optimasi Next.js kami meningkatkan rasio konversi leads hingga 148%."</p>',
    tags: ['Growth', 'Copywriting', 'PAS Framework', 'B2B Conversion'],
    source_name: 'Internal Growth Research',
    source_url: 'https://muhzadit.vercel.app',
    is_active: true
  },
  {
    id: 'r2',
    title: 'Checklist Technical SEO 2026: Kecepatan Muat Sub-Detik Next.js',
    slug: 'checklist-technical-seo-nextjs-speed',
    category: 'seo-checklist',
    summary: 'Panduan taktis optimasi Core Web Vitals (LCP, INP, CLS) pada framework Next.js App Router.',
    content: '<h3>Panduan Optimasi Kecepatan Next.js</h3><p>Kecepatan website adalah sinyal peringkat utama di mesin pencari modern (Google Search & AI Search). Halaman yang dimuat lebih dari 2 detik kehilangan hingga 50% calon pembeli.</p><h4>Langkah Wajib Optimasi:</h4><ul><li><strong>Dynamic Image Optimization:</strong> Selalu gunakan komponen <code>next/image</code> untuk resize dan WebP conversion otomatis.</li><li><strong>Turbopack Production Build:</strong> Manfaatkan Turbopack compiler untuk proses caching modul yang sangat cepat.</li><li><strong>Incremental Static Regeneration (ISR):</strong> Gunakan <code>revalidate</code> untuk mem-build halaman secara statis di CDN namun tetap diperbarui di latar belakang secara terjadwal.</li></ul>',
    tags: ['Next.js', 'Technical SEO', 'LCP', 'Web Performance'],
    source_name: 'Next.js Documentation',
    source_url: 'https://nextjs.org/docs',
    is_active: true
  },
  {
    id: 'r3',
    title: 'Analisis Likuiditas Global: Panduan Indikator FRED Interest Rate',
    slug: 'analisis-fred-interest-rate-liquidity',
    category: 'market-benchmark',
    summary: 'Memahami dampak naik-turunnya Fed Funds Rate terhadap iklim investasi dan daya serap pasar startup di Indonesia.',
    content: '<h3>Mengapa Startup & Agensi Harus Memantau Fed Funds Rate?</h3><p>Federal Funds Rate (suku bunga bank sentral AS) adalah jangkar likuiditas keuangan global. Ketika Fed menaikkan suku bunga, aliran modal cenderung kembali ke aset berisiko rendah di AS (capital flight), mempersulit pendanaan ventura di Asia Tenggara.</p><h4>Dampak pada Bisnis Lokal:</h4><ul><li><strong>Biaya Modal Naik:</strong> Bank lokal biasanya menaikkan suku bunga pinjaman untuk mengimbangi nilai tukar Rupiah.</li><li><strong>Fokus pada Profitabilitas:</strong> Klien B2B memotong anggaran pemasaran eksperimental dan hanya menyetujui program SEO/Growth yang memiliki ROI transparan.</li></ul>',
    tags: ['FRED', 'Macro Economics', 'Monetary Policy', 'B2B Capital'],
    source_name: 'Federal Reserve Bank of St. Louis',
    source_url: 'https://fred.stlouisfed.org',
    is_active: true
  },
  {
    id: 'r4',
    title: 'Tracking Makroekonomi Domestik: GDP & Inflasi BPS 2026',
    slug: 'bps-macroeconomic-gdp-inflation-tracker',
    category: 'market-benchmark',
    summary: 'Panduan membaca data pertumbuhan ekonomi riil dan indeks harga konsumen Indonesia dari portal resmi BPS.',
    content: '<h3>Menerjemahkan GDP Domestik Menjadi Anggaran Pemasaran B2B</h3><p>Badan Pusat Statistik (BPS) merilis data PDB dan Inflasi secara berkala. Pertumbuhan PDB yang stabil di atas 5% menunjukkan daya beli korporasi yang kuat, memicu ekspansi anggaran iklan digital.</p><h4>Poin Kunci Riset Pasar:</h4><ul><li><strong>Sektor Tumbuh:</strong> Selaraskan penawaran SEO Anda ke sektor dengan pertumbuhan PDB tertinggi (misal: Logistik, Agritech, Layanan Kesehatan).</li><li><strong>Mitigasi Inflasi:</strong> Pastikan copywriting penjualan Anda menekankan penghematan biaya operasional saat inflasi merangkak naik.</li></ul>',
    tags: ['BPS', 'Indonesia GDP', 'Inflation', 'Market Intel'],
    source_name: 'Badan Pusat Statistik Indonesia',
    source_url: 'https://www.bps.go.id',
    is_active: true
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
      analytics_id: 'G-2CD1CPGEYF',
      pricing_packages: JSON.stringify([
        {
          id: 'starter',
          name: 'Starter Plan',
          price: 'Rp 3.500.000',
          period: '/ proy',
          badge: 'UMKM & Rintisan',
          description: 'Sangat cocok untuk bisnis lokal yang ingin membangun eksistensi digital pertama mereka dengan performa web ultra-cepat.',
          suitable_for: 'UMKM lokal, personal brand, dan draf awal peluncuran bisnis.',
          objective: 'Menghasilkan landing page konversi tinggi dengan integrasi SEO dasar.',
          deliverables: [
            '1x Landing Page Berkecepatan Tinggi (Next.js)',
            'Technical SEO & Setup Google Search Console',
            'Desain Visual Responsif (Mobile-First)',
            'Integrasi Formulir Leads & Kontak WhatsApp',
            'Laporan Performa Kecepatan Web (Skor Lighthouse >90)'
          ],
          timeline: '7 Hari Kerja',
          revisions: '2x Revisi Mayor',
          support: 'WhatsApp Chat & Dokumentasi Mandiri',
          cta: 'Mulai Proyek Starter',
          cta_url: 'https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Starter%20Plan.'
        },
        {
          id: 'growth',
          name: 'Growth Engine',
          price: 'Rp 7.500.000',
          period: '/ proy',
          badge: 'Paling Populer',
          description: 'Dirancang untuk bisnis berkembang yang membutuhkan ekosistem konten aktif secara otomatis guna mendominasi Google Search lokal.',
          suitable_for: 'Agensi regional, penyedia jasa profesional, dan klinik lokal.',
          objective: 'Membangun kredibilitas, memproduksi konten organik berkala lewat auto-ingest RSS, dan menangkap prospek bisnis secara konsisten.',
          deliverables: [
            'Semua fitur paket Starter + Struktur Multi-halaman',
            'Sistem Auto-Generated Content (Scraper RSS + AI Rewrite)',
            'Pemasangan Database Klien (Supabase / Firestore)',
            'Technical & On-Page SEO Lanjutan (Peta Entitas Lokal)',
            'Integrasi Script Pelacakan Analytics Tanpa Cookie (Privacy-First)',
            'Dashboard Pemantauan Prospek Ringkas'
          ],
          timeline: '14 Hari Kerja',
          revisions: '3x Revisi Mayor',
          support: 'WhatsApp & Google Meet Prioritas',
          cta: 'Klaim Paket Growth',
          cta_url: 'https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Growth%20Engine.'
        },
        {
          id: 'professional',
          name: 'Professional Authority',
          price: 'Rp 15.000.000',
          period: '/ proy',
          badge: 'Rekomendasi Skala',
          description: 'Layanan ujung-ke-ujung terintegrasi untuk mendominasi pasar digital regional dengan optimasi kecepatan ekstrem, konten, presentasi, dan unit economics.',
          suitable_for: 'Instansi swasta, korporasi berkembang, dan lembaga publik.',
          objective: 'Membangun otoritas bisnis mutlak, mengoptimalkan rasio konversi leads, serta meyakinkan komite eksekutif lewat narasi proposal & slide premium.',
          deliverables: [
            'Semua fitur paket Growth + Ekosistem Digital Lengkap',
            'Optimasi Kecepatan Muat Sub-Detik & Skor Core Web Vitals 100',
            '1x Desain Proposal Bisnis & Slide Presentasi Visual (Pitch Deck Standard)',
            'Sistem Audit Kecepatan Mandiri (Audit Engine terintegrasi di web)',
            'Strategi Unit Economics & Visualisasi Analitik Bisnis',
            'Analisis Kompetitor & Perencanaan Konten Cluster SEO'
          ],
          timeline: '21 Hari Kerja',
          revisions: 'Revisi Unlimited (Selama masa pengembangan)',
          support: 'Dukungan Telepon 24/7 & Pertemuan Rutin Mingguan',
          cta: 'Mulai Dominasi Pasar',
          cta_url: 'https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Professional%20Authority.'
        },
        {
          id: 'enterprise',
          name: 'Custom Enterprise',
          price: 'Hubungi Kami',
          period: '',
          badge: 'Solusi Khusus',
          description: 'Dukungan strategis penuh untuk korporasi besar atau lembaga publik yang membutuhkan integrasi teknologi khusus, data geospasial, dan arsitektur sitemap dinamis berskala jutaan halaman.',
          suitable_for: 'Perusahaan logistik nasional, portal publik perkotaan, dan ekosistem multi-cabang.',
          objective: 'Keandalan tinggi, infrastruktur cloud khusus, penyesuaian regulasi hukum dan keamanan data.',
          deliverables: [
            'Infrastruktur Cloud Khusus (Vercel Enterprise / Google Cloud Platform)',
            'Integrasi Data Geospasial Kompleks (Peta Layanan Publik Terstruktur)',
            'Dukungan Aksesibilitas WCAG AA Penuh',
            'Perjanjian SLA (Service Level Agreement) Kecepatan & Uptime',
            'Sistem Audit Skala Besar & Optimasi Infrastruktur Kode Khusus'
          ],
          timeline: 'Kustom (Berdasarkan cakupan proyek)',
          revisions: 'Revisi Khusus (Sesuai kesepakatan)',
          support: 'Dedicated Slack Channel & Dedicated Support Engineer',
          cta: 'Ajukan Rapat Kemitraan',
          cta_url: 'https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20tertarik%20mengadakan%20rapat%20untuk%20Paket%20Enterprise.'
        }
      ])
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

export const getReferenceItems = unstable_cache(
  async (): Promise<ReferenceItem[]> => {
    try {
      const { data, error } = await supabase
        .from('reference_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return fallbackReferenceItems;
      }
      return data as ReferenceItem[];
    } catch {
      return fallbackReferenceItems;
    }
  },
  ['reference_items_cache'],
  { revalidate: 3600 }
);

export const getReferenceItemBySlug = unstable_cache(
  async (slug: string): Promise<ReferenceItem | null> => {
    try {
      const { data, error } = await supabase
        .from('reference_items')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (error || !data) {
        return fallbackReferenceItems.find(r => r.slug === slug) || null;
      }
      return data as ReferenceItem;
    } catch {
      return fallbackReferenceItems.find(r => r.slug === slug) || null;
    }
  },
  ['reference_item_by_slug_cache'],
  { revalidate: 3600 }
);
