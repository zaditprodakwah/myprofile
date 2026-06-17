import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-slate border-t border-brand-border py-16 relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Brand/Bio Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-mid border border-brand-slate text-teal-accent px-3 py-1 font-heading-sans font-extrabold text-lg">
              Z
            </div>
            <span className="font-heading-sans font-bold text-sm text-text-inverse tracking-tight">Zadit Growth Portfolio</span>
          </div>
          <p className="text-xs text-text-inverse/70 leading-relaxed max-w-sm">
            Membantu UMKM, perusahaan swasta, dan instansi pemerintah membangun ekosistem digital yang kredibel, berkinerja tinggi, dan teroptimasi untuk mesin pencari modern.
          </p>
        </div>

        {/* Links Column */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-text-inverse uppercase">PETA SITUS</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-xs text-text-inverse/60 hover:text-teal-accent transition-colors">Home</Link></li>
            <li><Link href="/#process" className="text-xs text-text-inverse/60 hover:text-teal-accent transition-colors">Metodologi Proses</Link></li>
            <li><Link href="/#case-studies" className="text-xs text-text-inverse/60 hover:text-teal-accent transition-colors">Studi Kasus</Link></li>
            <li><Link href="/#services" className="text-xs text-text-inverse/60 hover:text-teal-accent transition-colors">Pilar Layanan</Link></li>
          </ul>
        </div>

        {/* Utilities Column */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-text-inverse uppercase">LAYANAN & ALAT</h4>
          <ul className="space-y-2">
            <li><Link href="/directory" className="text-xs text-text-inverse/60 hover:text-teal-accent transition-colors">Direktori Bisnis Kredibel</Link></li>
            <li><Link href="/utility/audit-engine" className="text-xs text-text-inverse/60 hover:text-teal-accent transition-colors">Audit Kecepatan & Performa Website</Link></li>
            <li><Link href="/blog" className="text-xs text-text-inverse/60 hover:text-teal-accent transition-colors">Blog & Artikel Edukasi</Link></li>
            <li><Link href="/admin/dashboard" className="text-xs text-text-inverse/60 hover:text-teal-accent transition-colors">Portal Manajemen Konten</Link></li>
          </ul>
        </div>

      </div>

      {/* Copyright & EEAT Credentials bar */}
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-brand-slate/40 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-mono text-text-inverse/50 uppercase tracking-wider">
          © {new Date().getFullYear()} Zadit.dev. All rights reserved.
        </p>
        <div className="flex gap-4 font-mono text-[10px] text-text-inverse/50">
          <Link href="/llms.txt" className="hover:text-gold-accent transition-colors uppercase tracking-wider">DOKUMENTASI AI</Link>
          <Link href="#" className="hover:text-teal-accent transition-colors uppercase tracking-wider">PRIVACY POLICY</Link>
          <a href="https://kontak.link/muhzadit" target="_blank" rel="noopener noreferrer" className="hover:text-teal-accent transition-colors uppercase tracking-wider">KONTAK.LINK</a>
        </div>
      </div>
    </footer>
  );
}
