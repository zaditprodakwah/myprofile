'use client';

import { Globe, BarChart3, Search, PenTool, FileText } from 'lucide-react';

const services = [
  {
    title: 'Ecosystem & Web Management',
    desc: 'Pembuatan & pengelolaan web performa tinggi menggunakan Next.js App Router dan database dinamis (Supabase). Solusi digital mandiri yang cepat, responsif, dan siap tumbuh.',
    icon: Globe,
    techs: ['Next.js 16', 'TypeScript', 'Supabase', 'ISR Caching'],
    colSpan: 'lg:col-span-8',
    color: 'from-teal-900/30 to-brand-slate',
  },
  {
    title: 'Analytics & Data Intelligence',
    desc: 'Tracking presisi perilaku pengguna, audit kebocoran konversi, visualisasi visual data analitik, dan A/B testing sistematis untuk keputusan pemasaran berbasis bukti.',
    icon: BarChart3,
    techs: ['Google Analytics 4', 'Search Console', 'GTM', 'Heatmaps'],
    colSpan: 'lg:col-span-4',
    color: 'from-brand-border/30 to-brand-slate',
  },
  {
    title: 'SEO & AEO/GEO Optimization',
    desc: 'Memastikan bisnis Anda ditemukan tidak hanya oleh pencarian konvensional (Google SERP), tetapi juga dioptimalkan untuk mesin AI generatif (Gemini, ChatGPT, Claude).',
    icon: Search,
    techs: ['Technical SEO', 'Entity Schema', 'GEO Optimization', 'pSEO'],
    colSpan: 'lg:col-span-4',
    color: 'from-brand-border/30 to-brand-slate',
  },
  {
    title: 'Conversion Copywriting',
    desc: 'Kata-kata yang memicu tindakan. Penulisan naskah penjualan untuk landing page, materi kampanye, dan narasi brand yang didasarkan pada psikologi konsumen terukur.',
    icon: PenTool,
    techs: ['Direct Response Copy', 'Landing Page Wireframe', 'PAS Framework'],
    colSpan: 'lg:col-span-8',
    color: 'from-gold-accent/10 to-brand-slate',
  },
  {
    title: 'Executive Documentation',
    desc: 'Penyusunan dokumen bisnis tingkat tinggi yang memenangkan pendanaan dan kemitraan. Desain pitch deck investor profesional, proposal bisnis institusional, dan brief kolaborasi KOL strategis.',
    icon: FileText,
    techs: ['Pitch Deck Layout', 'Executive Brief', 'KOL Brief Design', 'Math Data Viz'],
    colSpan: 'lg:col-span-12',
    color: 'from-teal-900/20 to-brand-slate',
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="bg-brand-slate py-24 border-b border-brand-border/40">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">// PILAR KEAHLIAN</span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-inverse mt-2">
            Layanan & Solusi Terintegrasi
          </h2>
          <p className="text-text-muted mt-4 max-w-xl">
            Arsitektur pertumbuhan holistik yang menggabungkan rekayasa kode, riset analitik, optimasi mesin pencari, dan seni narasi konversi.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div
                key={i}
                className={`bg-brand-mid/30 border border-brand-border rounded-2xl p-8 flex flex-col justify-between gap-6 transition-all duration-300 hover:border-teal-glow hover:-translate-y-1 relative overflow-hidden group ${svc.colSpan}`}
              >
                {/* Accent Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-40 pointer-events-none`} />

                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-xl font-heading font-bold text-text-inverse">{svc.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-2xl">{svc.desc}</p>
                </div>

                {/* Tech tags */}
                <div className="relative z-10 flex flex-wrap gap-2 pt-4 border-t border-brand-border/30">
                  {svc.techs.map((tech) => (
                    <span
                      key={tech}
                      className="bg-brand-slate border border-brand-border/60 text-text-muted font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
