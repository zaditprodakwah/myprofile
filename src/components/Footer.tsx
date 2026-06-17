import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-brand-mid/30 border-t border-brand-border/40 py-16 relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Brand/Bio Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-slate border border-brand-border text-teal-accent px-3 py-1 font-heading font-extrabold text-lg">
              Z
            </div>
            <span className="font-heading font-bold text-sm text-text-inverse tracking-tight">Zadit Growth Portfolio</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed max-w-sm">
            Eksplorasi rekayasa digital marketing terpadu yang memadukan optimasi SEO/AEO/GEO, copywriting direct-response, dan implementasi kode Next.js performa tinggi.
          </p>
        </div>

        {/* Links Column */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-text-inverse uppercase">// NAVIGASI</h4>
          <ul className="space-y-2">
            <li><a href="/#hero" className="text-xs text-text-muted hover:text-teal-accent transition-colors">Home</a></li>
            <li><a href="/#process" className="text-xs text-text-muted hover:text-teal-accent transition-colors">Metodologi Proses</a></li>
            <li><a href="/#case-studies" className="text-xs text-text-muted hover:text-teal-accent transition-colors">Studi Kasus</a></li>
            <li><a href="/#services" className="text-xs text-text-muted hover:text-teal-accent transition-colors">Pilar Layanan</a></li>
          </ul>
        </div>

        {/* Utilities Column */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-text-inverse uppercase">// GROWTH UTILITIES</h4>
          <ul className="space-y-2">
            <li><a href="/directory/cirebon" className="text-xs text-text-muted hover:text-teal-accent transition-colors">Trust Bank Directory (pSEO)</a></li>
            <li><a href="/utility/audit-engine" className="text-xs text-text-muted hover:text-teal-accent transition-colors">Free Diagnostic Audit Engine</a></li>
            <li><a href="/blog/mengapa-ai-search-mengubah-cara-kita-menulis-konten" className="text-xs text-text-muted hover:text-teal-accent transition-colors">AGC Blog & Wawasan</a></li>
            <li><a href="/admin/dashboard" className="text-xs text-text-muted hover:text-teal-accent transition-colors">Dashboard Admin Command Center</a></li>
          </ul>
        </div>

      </div>

      {/* Copyright & EEAT Credentials bar */}
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-brand-border/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
          © {new Date().getFullYear()} Zadit. dev. All rights reserved.
        </p>
        <div className="flex gap-4 font-mono text-[10px] text-text-muted">
          <a href="/llms.txt" className="hover:text-gold-accent transition-colors uppercase tracking-wider">// LLMS.TXT</a>
          <a href="#" className="hover:text-teal-accent transition-colors uppercase tracking-wider">PRIVACY POLICY</a>
          <a href="https://kontak.link/muhzadit" target="_blank" rel="noopener noreferrer" className="hover:text-teal-accent transition-colors uppercase tracking-wider">KONTAK.LINK</a>
        </div>
      </div>
    </footer>
  );
}
