'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/directory', label: 'Direktori B2B' },
  { href: '/sovereign-explorer', label: 'Bank Referensi' },
  { href: '/utility/audit-engine', label: 'Audit SEO' },
  { href: '/blog', label: 'Blog & Insight' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [availability, setAvailability] = useState('AVAILABLE');
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for header compact mode
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Availability status from Supabase
  useEffect(() => {
    async function getAvailability() {
      try {
        const { data } = await supabase
          .from('system_configs')
          .select('value')
          .eq('key', 'available_status')
          .single();
        if (data?.value) setAvailability(data.value);
      } catch { /* noop */ }
    }
    getAvailability();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-alabaster/95 backdrop-blur-md border-b border-brand-border shadow-sm h-[58px]'
          : 'bg-alabaster/80 backdrop-blur-sm border-b border-transparent h-20'
      } flex items-center`}
    >
      <div className="w-full max-w-6xl mx-auto px-6 flex justify-between items-center">

        {/* Monogram Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-brand-slate text-alabaster px-3 py-1.5 font-heading-sans font-extrabold text-lg transition-all group-hover:bg-teal-accent shadow-sm"
          >
            Z
          </motion.div>
          <div className="flex flex-col">
            <span className="font-heading-sans font-bold text-sm text-text-primary tracking-tight">
              Zadit Growth
            </span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-teal-accent uppercase">
              {/* Growth Architect */}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase transition-colors duration-150 ease-out relative hover-underline"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live availability badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-accent/5 border border-teal-accent/15 rounded-full">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                availability === 'AVAILABLE'
                  ? 'bg-teal-accent animate-pulse'
                  : 'bg-gold-accent animate-ping'
              }`}
            />
            <span className="font-mono text-[9px] tracking-wider text-text-primary uppercase font-semibold">
              {availability === 'AVAILABLE' ? 'Kesiapan: Siap Berkolaborasi' : 'Status: Kapasitas Penuh'}
            </span>
          </div>

          <Link
            href="/#partnership"
            className="bg-teal-accent hover:bg-brand-slate text-text-inverse text-[10px] font-heading-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-150 ease-out shadow-sm shadow-teal-accent/20"
          >
            Konsultasi
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.94 }}
          className="md:hidden text-text-primary hover:text-teal-accent transition-colors duration-150 ease-out"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md border-b border-brand-border py-5 px-6 md:hidden flex flex-col gap-1 shadow-xl"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-mono tracking-wider text-text-muted hover:text-teal-accent uppercase py-3 transition-colors duration-150 ease-out border-b border-brand-border/50 flex items-center justify-between"
              >
                {label}
                <span className="text-text-muted/40">→</span>
              </Link>
            ))}
            <Link
              href="/#partnership"
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans text-xs font-bold uppercase tracking-wider text-center py-3.5 rounded-xl transition-all duration-150 ease-out"
            >
              Konsultasi Kemitraan
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
