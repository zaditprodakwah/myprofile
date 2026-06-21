'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';

// Trust signal marquee data
const TRUST_ITEMS = [
  'Tirto.id — Technical SEO Audit',
  'Tiket.com — Campaign & Media Planning',
  'Vidio.com — KOL Content Brief Strategy',
  'Certified Branding & Digital Marketing 360°',
  'Core Web Vitals Optimization Specialist',
  'Google Workspace Certified Administrator',
];

export default function Footer() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const p = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setProgress(p);
      setScrolled(p > 0.03);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[200]"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(to right, #0d9488, #d97706)',
          transition: 'width 0.1s linear',
        }}
      />

      {/* Back to top (appears after scrolling) */}
      {scrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-brand-slate/90 border border-brand-slate text-text-inverse flex items-center justify-center shadow-lg hover:bg-teal-accent transition-colors duration-300"
          aria-label="Kembali ke atas"
        >
          <ArrowUpRight className="w-4 h-4 -rotate-45" />
        </motion.button>
      )}

      <footer className="bg-brand-slate border-t border-brand-mid relative overflow-hidden">
        {/* Atmospheric glow */}
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'rgba(13, 148, 136, 0.06)' }}
        />

        {/* Trust signal marquee */}
        <div className="border-b border-brand-mid/60 py-3 overflow-hidden">
          <div className="marquee-track">
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-6 text-[10px] font-mono text-text-inverse/50 uppercase tracking-widest whitespace-nowrap"
              >
                <span className="w-1 h-1 rounded-full bg-teal-accent/50 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Main footer body */}
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-start relative z-10">

          {/* Brand/Bio Column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-brand-mid border border-white/5 text-teal-accent px-3.5 py-1.5 font-heading-sans font-extrabold text-xl shadow-sm">
                Z
              </div>
              <div>
                <span className="font-heading-sans font-bold text-sm text-text-inverse tracking-tight block">
                  Zadit Growth Portfolio
                </span>
                <span className="font-mono text-[9px] tracking-widest text-teal-accent uppercase block mt-0.5">
                  Muhammad Khoiruzzadittaqwa
                </span>
              </div>
            </div>
            <p className="text-xs text-text-inverse/60 leading-relaxed max-w-xs">
              Membantu UMKM, perusahaan swasta, dan instansi pemerintah membangun ekosistem digital
              yang kredibel, berkinerja tinggi, dan teroptimasi untuk mesin pencari modern.
            </p>
            {/* Location & availability */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-teal-accent" />
              Indonesia — Tersedia Remote & On-site
            </div>
            {/* CTA */}
            <a
              href="https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20ingin%20berdiskusi%20kemitraan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal-accent/10 hover:bg-teal-accent border border-teal-accent/20 hover:border-teal-accent text-teal-accent hover:text-white text-[10px] font-mono font-semibold uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse" />
              Hubungi via WhatsApp
            </a>
          </div>

          {/* Site Map Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest text-text-inverse/40 uppercase border-b border-brand-mid pb-2">
              PETA SITUS
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/#hero', label: 'Overview' },
                { href: '/#process', label: 'Metodologi' },
                { href: '/#case-studies', label: 'Studi Kasus' },
                { href: '/#services', label: 'Spesialisasi' },
                { href: '/#partnership', label: 'Mulai Kemitraan' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-text-inverse/55 hover:text-teal-accent transition-colors hover-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Services Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest text-text-inverse/40 uppercase border-b border-brand-mid pb-2">
              ALAT & LAYANAN
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/blog', label: 'Growth Hub & Telemetri' },
                { href: '/directory', label: 'Direktori Bisnis Wilayah' },
                { href: '/utility/audit-engine', label: 'Audit Kecepatan Website' },
                { href: '/utility/fact-checker', label: 'B2B Fact-Checker Engine' },
                { href: '/utility/video-auditor', label: 'YouTube Video Auditor' },
                { href: 'https://kontak.link/muhzadit', label: 'Kontak.Link', external: true },
              ].map(({ href, label, external }) => (
                <li key={href}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-text-inverse/55 hover:text-teal-accent transition-colors inline-flex items-center gap-1 hover-underline"
                    >
                      {label}
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-xs text-text-inverse/55 hover:text-teal-accent transition-colors hover-underline"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto px-6 pb-8 pt-6 border-t border-brand-mid/40 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-[10px] font-mono text-text-inverse/35 uppercase tracking-wider">
            © {new Date().getFullYear()} Zadit.dev · Branding & Digital Marketing Strategist
          </p>
          <div className="flex gap-5 font-mono text-[10px] text-text-inverse/35">
            <Link href="/llms.txt" className="hover:text-gold-accent transition-colors uppercase tracking-wider hover-underline">
              Dokumentasi AI
            </Link>
            <Link href="/privacy-policy" className="hover:text-teal-accent transition-colors uppercase tracking-wider hover-underline">
              Privacy Policy
            </Link>
            <a
              href="https://kontak.link/muhzadit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-accent transition-colors uppercase tracking-wider hover-underline"
            >
              Kontak.Link
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
