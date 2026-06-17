'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [availability, setAvailability] = useState('AVAILABLE');

  useEffect(() => {
    async function getAvailability() {
      try {
        const { data } = await supabase
          .from('system_configs')
          .select('value')
          .eq('key', 'available_status')
          .single();
        if (data && data.value) {
          setAvailability(data.value);
        }
      } catch (err) {
        console.warn('Could not fetch availability from Supabase', err);
      }
    }
    getAvailability();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-alabaster/85 backdrop-blur-md border-b border-brand-border z-50 transition-all duration-300 header-shrink flex items-center">
      <div className="w-full max-w-6xl mx-auto px-6 flex justify-between items-center">
        
        {/* Monogram Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="rounded-xl bg-brand-slate text-alabaster px-3.5 py-1.5 font-heading-sans font-extrabold text-xl transition-all group-hover:scale-105">
            Z
          </div>
          <div className="flex flex-col">
            <span className="font-heading-sans font-bold text-sm text-text-primary tracking-tight">Zadit Growth</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-teal-accent uppercase">{'// ARCHITECT'}</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#process" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Proses</Link>
          <Link href="/#case-studies" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Studi Kasus</Link>
          <Link href="/#services" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Layanan</Link>
          <Link href="/directory" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Direktori</Link>
          <Link href="/utility/audit-engine" className="text-xs font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors">Request Audit</Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-teal-accent/5 border border-teal-accent/15 rounded-full">
            <span className={`w-2 h-2 rounded-full ${availability === 'AVAILABLE' ? 'bg-teal-accent animate-pulse' : 'bg-gold-accent animate-ping'}`} />
            <span className="font-mono text-[10px] tracking-wider text-text-primary uppercase font-semibold">
              {availability === 'AVAILABLE' ? 'Tersedia' : 'Sibuk'}
            </span>
          </div>
          <Link 
            href="/#contact" 
            className="bg-teal-accent hover:bg-brand-slate text-text-inverse text-xs font-heading-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all"
          >
            Konsultasi
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-text-primary hover:text-teal-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-brand-border py-6 px-6 md:hidden flex flex-col gap-4 shadow-xl">
          <Link 
            href="/#process" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border"
          >
            Proses
          </Link>
          <Link 
            href="/#case-studies" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border"
          >
            Studi Kasus
          </Link>
          <Link 
            href="/#services" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border"
          >
            Layanan
          </Link>
          <Link 
            href="/directory" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border"
          >
            Direktori Lokal
          </Link>
          <Link 
            href="/utility/audit-engine" 
            onClick={() => setIsOpen(false)} 
            className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-2 transition-colors border-b border-brand-border"
          >
            Request Audit
          </Link>
          <Link 
            href="/#contact" 
            onClick={() => setIsOpen(false)} 
            className="bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans text-xs font-bold uppercase tracking-wider text-center py-3.5 rounded-xl transition-all"
          >
            Konsultasi Kemitraan
          </Link>
        </div>
      )}
    </header>
  );
}
