'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, ChevronDown, ChevronUp, Layers, HelpCircle, 
  Send, Phone, Award, Clock, ArrowRight, ShieldCheck, Zap,
  Search, Code, FileText, BarChart3, Star, Compass
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

export default function RateCardSection({ packagesJson, whatsappNumber = '6282316363177' }: RateCardSectionProps) {
  // Safe default pricing packages
  const defaultPackages: Package[] = [
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
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Starter%20Plan.`
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
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Growth%20Engine.`
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
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20Paket%20Professional%20Authority.`
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
        'Infrastruktur Cloud Khusus (Vercel Enterprise / GCP)',
        'Integrasi Data Geospasial Kompleks (Peta Layanan Publik Terstruktur)',
        'Dukungan Aksesibilitas WCAG AA Penuh',
        'Perjanjian SLA (Service Level Agreement) Kecepatan & Uptime',
        'Sistem Audit Skala Besar & Optimasi Infrastruktur Kode Khusus'
      ],
      timeline: 'Kustom (Berdasarkan cakupan proyek)',
      revisions: 'Revisi Khusus (Sesuai kesepakatan)',
      support: 'Dedicated Slack Channel & Dedicated Support Engineer',
      cta: 'Ajukan Rapat Kemitraan',
      cta_url: `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20mengadakan%20rapat%20untuk%20Paket%20Enterprise.`
    }
  ];

  let packages = defaultPackages;
  if (packagesJson) {
    try {
      packages = JSON.parse(packagesJson);
    } catch (e) {
      console.warn('Failed to parse pricing_packages config JSON, using default rate card', e);
    }
  }

  // Active package for mobile pricing details view
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'professional' | 'enterprise'>('growth');
  
  // Interactive Deliverables Tab
  const [activeDelivTab, setActiveDelivTab] = useState<'website' | 'seo' | 'proposal' | 'analytics'>('website');

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

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
      a: 'Setiap paket dilengkapi dengan masa garansi bebas bug selama 30 hari pertama. Untuk dukungan pasca-garansi, Anda dapat memilih opsi retainer bulanan atau memperbarui konten secara mandiri menggunakan modul dasbor admin yang sangat user-friendly yang telah saya sediakan.'
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

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

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Muhammad Khoiruzzadittaqwa - Growth Architect',
    'image': 'https://muhzadit.vercel.app/icon.png',
    'url': 'https://muhzadit.vercel.app',
    'telephone': `+${whatsappNumber}`,
    'priceRange': '$$$',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Cirebon',
      'addressRegion': 'Jawa Barat',
      'addressCountry': 'ID'
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Layanan Desain & Rekayasa Pertumbuhan Digital',
      'itemListElement': packages.map((pkg, idx) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': pkg.name,
          'description': pkg.description,
        },
        'price': pkg.price.replace(/[^\d]/g, '') || '0',
        'priceCurrency': 'IDR',
        'url': `https://muhzadit.vercel.app#rate-card`
      }))
    }
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
            Tarif & Paket Layanan Terbuka
          </span>
          <h2 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary mt-3 leading-tight tracking-tight">
            Rate Card <span className="gradient-text-teal">Pertumbuhan Digital</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Tanpa PDF tersembunyi, tanpa negosiasi berbelit. Tarif transparan terintegrasi dengan 
            garansi performa kecepatan ekstrem, rekayasa Next.js premium, dan copywriting konversi tinggi.
          </p>
        </div>

        {/* Deliverables Bento Component */}
        <div className="mb-16 bg-white border border-brand-border rounded-[2rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-accent/5 rounded-full filter blur-3xl pointer-events-none -mr-32 -mt-32" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-teal-accent uppercase block mb-1">WHAT YOU GET</span>
                <h3 className="text-xl md:text-2xl font-bold font-heading-sans text-text-primary">Penjelasan Paket Deliverables</h3>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  Setiap modul dikerjakan dengan standar industri tinggi menggunakan arsitektur web modern bebas biaya lisensi tersembunyi.
                </p>
              </div>

              <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-wider">
                {[
                  { id: 'website', label: 'Website & Landing Page', icon: Code },
                  { id: 'seo', label: 'SEO & Content Engine', icon: Search },
                  { id: 'proposal', label: 'Copywriting & Proposal', icon: FileText },
                  { id: 'analytics', label: 'Analitik & Unit Economics', icon: BarChart3 }
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveDelivTab(t.id as any)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        activeDelivTab === t.id 
                          ? 'bg-teal-accent/6 border-teal-accent/30 text-teal-accent font-bold' 
                          : 'bg-offwhite/50 border-brand-border text-text-muted hover:bg-offwhite hover:text-text-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-8 bg-offwhite/40 border border-brand-border rounded-2xl p-6 md:p-8 min-h-[300px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeDelivTab === 'website' && (
                  <motion.div
                    key="website"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h4 className="text-sm font-bold font-mono text-teal-accent uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-4 h-4" /> REKAYASA INFRASTRUKTUR WEB NEXT.JS
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Kami merancang layout dengan fokus pada **Core Web Vitals**. Hasil akhirnya adalah loading halaman di bawah 1 detik, kompatibel dengan screen-reader, serta ramah bagi algoritma AI Search.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs text-text-primary font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Desain UI Tailwind & Vanilla CSS</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Integrasi Dynamic ISR (Incremental Static Rebuild)</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Skor Lighthouse Kecepatan 95+</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Skema Headings WCAG AA Standard</li>
                    </ul>
                  </motion.div>
                )}

                {activeDelivTab === 'seo' && (
                  <motion.div
                    key="seo"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h4 className="text-sm font-bold font-mono text-teal-accent uppercase tracking-wider flex items-center gap-2">
                      <Search className="w-4 h-4" /> STRATEGI SEO CLUSTER & AUTOMATED SCRAPING
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Bukan sekadar menulis konten acak. Kami membangun sistem **automated content pipeline** yang otomatis mengimpor berita relevan via RSS, lalu menulis ulang dengan AI Flash agar ramah pencarian lokal.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs text-text-primary font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Riset Kata Kunci Semantik</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Peta Entitas Kota & Niche</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Auto-post & AI Rewrite Pipeline</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Pengajuan Indexing Instan Google & IndexNow</li>
                    </ul>
                  </motion.div>
                )}

                {activeDelivTab === 'proposal' && (
                  <motion.div
                    key="proposal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h4 className="text-sm font-bold font-mono text-teal-accent uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4" /> KOPI PENJUALAN & DOKUMEN PRESENTASI EKSEKUTIF
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Pesan yang rumit diterjemahkan menjadi slide presentasi (Pitch Deck) visual yang tajam. Ditulis dengan format narasi **PAS Framework (Problem - Agitate - Solve)** untuk melipatgandakan peluang kesepakatan bisnis.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs text-text-primary font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Struktur Proposal Bisnis Ringkas</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Desain Slide Pitch Deck Profesional</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Pembersihan Copywriting dari Jargon Padat</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Siaran Press Otoritatif</li>
                    </ul>
                  </motion.div>
                )}

                {activeDelivTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h4 className="text-sm font-bold font-mono text-teal-accent uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> UNIT ECONOMICS & ANALITIK PENGGUNA
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Dapatkan visibilitas data penuh secara privat. Pemasangan pelacakan aktivitas leads dan prospek bisnis yang terintegrasi langsung ke tabel Supabase tanpa mengorbankan kecepatan load web.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs text-text-primary font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Pemasangan Google Analytics 4 Aman</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Tracking Aktivitas Formulir Leads</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Analisis Margin Unit Bisnis Digital</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-accent flex-shrink-0" /> Pemantauan Real-time Uptime</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-brand-border/60 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-text-muted">
                <span>PILIH MODUL SESUAI KEBUTUHAN TIAP PAKET DI BAWAH</span>
                <span className="text-teal-accent font-semibold flex items-center gap-1">Zadit Growth Arch &copy; 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {packages.map((pkg) => {
            const isFeatured = pkg.id === 'growth';
            return (
              <div 
                key={pkg.id} 
                className={`bg-white border rounded-[1.75rem] p-6 flex flex-col justify-between transition-all duration-300 relative group ${
                  isFeatured 
                    ? 'border-teal-accent ring-1 ring-teal-accent shadow-md md:-translate-y-2' 
                    : 'border-brand-border hover:border-text-primary/20 shadow-sm'
                }`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <span className={`absolute -top-3 left-6 font-mono text-[9px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${
                    isFeatured 
                      ? 'bg-teal-accent text-white border-teal-accent' 
                      : 'bg-offwhite text-text-muted border-brand-border'
                  }`}>
                    {pkg.badge}
                  </span>
                )}

                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="font-heading-sans font-black text-xl text-text-primary tracking-tight leading-tight">{pkg.name}</h3>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed line-clamp-3 font-sans h-[48px]">{pkg.description}</p>
                  </div>

                  <div className="py-2 border-y border-brand-border/50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-text-primary font-mono">{pkg.price}</span>
                      {pkg.period && <span className="text-xs text-text-muted font-mono">{pkg.period}</span>}
                    </div>
                    <div className="text-[10px] font-mono text-teal-accent mt-1 uppercase tracking-wider">
                      Estimasi: {pkg.timeline}
                    </div>
                  </div>

                  {/* Objective & Target */}
                  <div className="space-y-1 text-xs">
                    <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">UNTUK BISNIS:</div>
                    <p className="text-text-primary font-medium leading-relaxed font-sans">{pkg.suitable_for}</p>
                  </div>

                  {/* Deliverables bullet list */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">DELIVERABLES UTAMA:</div>
                    <ul className="space-y-1.5 text-xs text-text-primary">
                      {pkg.deliverables.slice(0, 5).map((d, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-teal-accent mt-0.5 flex-shrink-0" />
                          <span className="leading-snug">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-brand-border/50 mt-6">
                  {/* Scope details */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-text-muted">
                    <div>
                      <span>REVISI:</span>
                      <span className="block text-text-primary font-bold">{pkg.revisions}</span>
                    </div>
                    <div>
                      <span>DUKUNGAN:</span>
                      <span className="block text-text-primary font-bold truncate">{pkg.support.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={pkg.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
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

        {/* Detailed Comparison Table */}
        <div className="mb-24 bg-white border border-brand-border rounded-[2rem] p-6 md:p-10 shadow-sm overflow-x-auto">
          <div className="min-w-[700px]">
            <h3 className="text-xl font-bold text-text-primary font-heading-sans mb-6">Tabel Perbandingan Fitur Paket</h3>
            
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-[10px] font-mono uppercase tracking-wider text-text-muted">
                  <th className="py-4 w-1/4">Fitur / Cakupan</th>
                  <th className="py-4 px-2 w-1/6">Starter</th>
                  <th className="py-4 px-2 w-1/6 text-teal-accent font-bold">Growth Engine</th>
                  <th className="py-4 px-2 w-1/6">Professional</th>
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
                    <td className="py-4 px-2">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-gold-accent uppercase block">PETA JALAN EKSEKUSI</span>
            <h3 className="text-2xl font-bold font-heading-sans text-text-primary">Metodologi & Alur Kerja</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center font-mono text-[10px] uppercase tracking-wider">
            {[
              { num: '01', title: 'Discovery', desc: 'Rapat awal & selaraskan target bisnis.' },
              { num: '02', title: 'Audit', desc: 'Analisis web lama, kompetitor, & SEO.' },
              { num: '03', title: 'Proposal', desc: 'Menyusun sitemap & draf penawaran.' },
              { num: '04', title: 'Execution', desc: 'Pemrograman Next.js & setup database.' },
              { num: '05', title: 'Review', desc: 'Uji kecepatan, UI responsif & revisi.' },
              { num: '06', title: 'Delivery', desc: 'Deploy produksi & serah terima repo.' },
              { num: '07', title: 'Support', desc: 'Masa garansi bug 30 hari pasca-launch.' }
            ].map((step, i) => (
              <div key={i} className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col justify-between min-h-[140px] relative group hover:border-teal-accent/30 transition-all">
                {i < 6 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20 text-brand-border group-hover:text-teal-accent/30 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-teal-accent">{step.num}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-border group-hover:bg-teal-accent transition-colors" />
                </div>
                <div>
                  <span className="font-bold block text-text-primary mb-1">{step.title}</span>
                  <span className="text-[9px] text-text-muted leading-relaxed block text-center lowercase">{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Work With Zadit Section */}
        <div className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brand-slate text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-lg noise-overlay">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-accent/10 rounded-full filter blur-3xl pointer-events-none -mb-40 -mr-40" />
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-gold-accent uppercase flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-gold-accent text-gold-accent" /> MEASURABLE EVIDENCE
            </span>
            <h3 className="text-2xl md:text-3xl font-bold font-heading-serif">Mengapa Bermitra dengan Zadit?</h3>
            <p className="text-xs text-text-inverse/60 leading-relaxed font-sans">
              Kami tidak menawarkan janji manis atau jargon optimasi digital. Solusi kami bertumpu pada bukti empiris berkinerja tinggi.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20ingin%20berdiskusi%20kemitraan%20dan%20meminta%20portfolio.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal-accent text-white font-mono text-[10px] uppercase font-bold tracking-wider px-5 py-3.5 rounded-xl hover:bg-teal-glow transition-all"
              >
                <span>Minta Portfolio Lengkap</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Next.js & React Expert', value: '5+ Tahun', desc: 'Riset pemrograman Next.js & optimasi database Supabase secara clean-code.' },
              { title: 'Proyek Terkirim', value: '50+ Proyek', desc: 'Pembuatan landing page UMKM, slide presentasi bisnis, dan peta geospasial.' },
              { title: 'Technical SEO', value: '100% Skor', desc: 'Pengukuran Core Web Vitals (LCP, CLS, INP) sempurna demi algoritma search engine.' },
              { title: 'Auto-Scraper AI', value: 'Zero-Cost AI', desc: 'Penyusunan pipeline berita cerdas menggunakan Google Gemini Flash secara gratis.' }
            ].map((ev, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-xl md:text-2xl font-mono font-black text-teal-glow block">{ev.value}</span>
                  <span className="text-xs font-bold text-white block mt-1">{ev.title}</span>
                </div>
                <p className="text-[10px] text-text-inverse/50 leading-relaxed pt-2 border-t border-white/5 font-sans">
                  {ev.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Component */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-10">
            <HelpCircle className="w-8 h-8 text-teal-accent mx-auto" />
            <h3 className="text-2xl font-bold font-heading-sans text-text-primary">Pertanyaan Umum (FAQ)</h3>
            <p className="text-xs text-text-muted">Klarifikasi instan seputar proses pengerjaan, lisensi, dan pemeliharaan.</p>
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

      {/* Persistent Sticky CTA (Desktop & Mobile) */}
      <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 z-[90] pointer-events-none flex justify-center md:justify-end">
        <div className="pointer-events-auto bg-brand-slate text-white border border-white/10 rounded-full px-5 py-3 flex items-center gap-4 shadow-2xl backdrop-blur-md max-w-sm w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-glow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-accent"></span>
            </span>
            <div className="font-mono text-[9px] leading-tight">
              <span className="block text-teal-glow uppercase font-bold">READY TO SCALE</span>
              <span className="block text-white/50 lowercase">slots: 2 project sisa</span>
            </div>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20ingin%20berkonsultasi%20mengenai%20proyek%20pemasaran%2Fweb.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-accent hover:bg-teal-glow text-white font-mono text-[9px] uppercase tracking-wider font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1 flex-shrink-0"
          >
            <span>Hubungi Zadit</span>
            <Phone className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
