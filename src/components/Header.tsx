'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-brand-slate/85 backdrop-blur-md border-b border-brand-border/40 z-50 transition-all duration-300 header-shrink flex items-center">
      <div className="w-full max-w-6xl mx-auto px-6 flex justify-between items-center">
        
        {/* Monogram Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="rounded-xl bg-brand-mid border border-brand-border text-teal-accent px-3.5 py-1.5 font-heading font-extrabold text-xl transition-all group-hover:border-teal-glow">
            Z
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm text-text-inverse tracking-tight">Zadit Growth</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-teal-accent uppercase">// ARCHITECT</span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#process" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Proses</a>
          <a href="#case-studies" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Studi Kasus</a>
          <a href="#services" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Layanan</a>
          <a href="/directory/cirebon" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Direktori</a>
          <a href="/utility/audit-engine" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Audit Tool</a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-teal-accent/5 border border-teal-accent/15 rounded-full">
            <span className="w-2 h-2 rounded-full bg-teal-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider text-teal-glow uppercase">Tersedia</span>
          </div>
          <a 
            href="#contact" 
            className="bg-teal-accent hover:bg-teal-glow text-brand-slate text-xs font-heading font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all"
          >
            Konsultasi
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-text-inverse hover:text-teal-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-brand-slate border-b border-brand-border/60 py-6 px-6 md:hidden flex flex-col gap-4 shadow-xl">
          <a 
            href="#process" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border/20"
          >
            Proses
          </a>
          <a 
            href="#case-studies" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border/20"
          >
            Studi Kasus
          </a>
          <a 
            href="#services" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border/20"
          >
            Layanan
          </a>
          <a 
            href="/directory/cirebon" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border/20"
          >
            Direktori Lokal
          </a>
          <a 
            href="/utility/audit-engine" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border/20"
          >
            Audit Tool
          </a>
          <a 
            href="#contact" 
            onClick={() => setIsOpen(false)} 
            className="bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading text-xs font-bold uppercase tracking-wider text-center py-3.5 rounded-xl transition-all"
          >
            Konsultasi Kemitraan
          </a>
        </div>
      )}
    </header>
  );
}
