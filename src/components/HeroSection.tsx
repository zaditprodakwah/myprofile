'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from 'framer-motion';
// Added import for Next.js Image component
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Award, TrendingUp, Users, Shield, Globe, ChevronDown, Zap, Check, Database } from 'lucide-react';

interface HeroSectionProps {
  headline?: string;
  subheading?: string;
  whatsappNumber?: string;
  availabilityStatus?: string;
  liveStats?: {
    totalDirectories: number;
    totalAudits: number;
    systemStatus: string;
  };
}

// Performance-safe Magnetic Button using Spring Physics
function MagneticButton({
  children,
  className,
  href,
  target,
  rel
}: {
  children: React.ReactNode;
  className: string;
  href: string;
  target?: string;
  rel?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 18, stiffness: 180 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.22);
    y.set((clientY - (top + height / 2)) * 0.22);
  };

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// Typewriter cycling sub-tagline  
const ROTATING_TAGS = [
  'Growth Architect',
  'Branding Strategist',
  'SEO & Content Specialist',
  'Campaign Planner',
  'Digital Marketing 360°',
];

function RotatingTag() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % ROTATING_TAGS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="gradient-text-teal font-heading-sans font-extrabold"
      >
        {ROTATING_TAGS[idx]}
      </motion.span>
    </AnimatePresence>
  );
}

// Mini Trust Signal Bar
const TRUST_BADGES = [
  { icon: Award, label: 'Bersertifikat Branding & Marketing' },
  { icon: TrendingUp, label: 'Portofolio: Tirto · Tiket · Vidio' },
  { icon: Users, label: 'Melayani UMKM, Swasta & Lembaga' },
  { icon: Shield, label: 'ISO-grade Data Privacy' },
];

export default function HeroSection({
  headline = "Code doesn't scale without story. Story doesn't convert without data. Data doesn't persuade without execution.",
  subheading = "Zadit membantu Anda, UMKM, instansi swasta, hingga lembaga publik merancang situs web berkecepatan tinggi, mengelola blog informatif, menyusun slide presentasi premium, dan menganalisis data untuk mengunci pertumbuhan bisnis yang dapat diprediksi secara transparan.",
  whatsappNumber = "6282316363177",
  availabilityStatus = "AVAILABLE",
  liveStats,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [stats, setStats] = useState({ years: 0, projects: 0, clients: 0 });
  const [lcpScore, setLcpScore] = useState<number | null>(null);

  // Parallax depth on scroll
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  const contentY = useTransform(scrollY, [0, 500], [0, -30]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  // Stats counter animation on mount
  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setStats({ years: Math.round(e * 3), projects: Math.round(e * 12), clients: Math.round(e * 5) });
      if (p < 1) requestAnimationFrame(animate);
    };
    const tid = setTimeout(() => requestAnimationFrame(animate), 600);
    return () => clearTimeout(tid);
  }, []);



  // LCP performance observer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const obs = new PerformanceObserver(list => {
        const entries = list.getEntries();
        setLcpScore(entries[entries.length - 1].startTime / 1000);
      });
      obs.observe({ type: 'largest-contentful-paint', buffered: true });
      return () => obs.disconnect();
    } catch { /* noop */ }
  }, []);

  const headlineWords = headline.split(' ');

  // Programmatic guard to change "Saya/saya" self-references to "Zadit"
  const cleanSubheading = subheading
    .replace(/\bSaya membantu\b/g, 'Zadit membantu')
    .replace(/\bsaya membantu\b/g, 'Zadit membantu')
    .replace(/\bSaya\b/g, 'Zadit')
    .replace(/\bsaya\b/g, 'zadit');

  const waLink = `https://wa.me/${whatsappNumber}?text=Halo%20Zadit%2C%20saya%20tertarik%20untuk%20berdiskusi%20mengenai%20kemitraan%20dan%20growth%20strategy.%20Mari%20jadwalkan%20pertemuan!`;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[96dvh] flex flex-col justify-center pt-24 pb-12 px-6 overflow-hidden bg-alabaster"
    >
      {/* Layered atmospheric background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Grid texture */}
        <div className="absolute inset-0 grid-bg opacity-100" />
        {/* Teal orb top-right */}
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-teal-accent/[0.055] blur-[90px]" />
        {/* Gold orb bottom-left */}
        <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full bg-gold-accent/[0.04] blur-[80px]" />
        {/* Fine radial vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(248,250,252,0) 0%, rgba(248,250,252,0.6) 100%)' }}
        />
      </motion.div>

      {/* Content wrapper with subtle scroll parallax */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10"
      >
        {/* ═══════════════════════════════════
            LEFT: Premium Editorial Typography
            ═══════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-7 text-left">


          {/* Role Rotating & Floating Avatar (Mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4"
          >
            {/* Floating Avatar - Visible only on mobile */}
            <div className="block lg:hidden relative w-12 h-12 rounded-full overflow-hidden border-2 border-teal-accent/30 shadow-lg glow-border-teal flex-shrink-0">
              <Image
                src="/zadit-foto.png"
                alt="Zadit"
                fill
                sizes="48px"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm font-heading-sans text-text-muted">
              <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-text-muted/70">Muhammad Khoiruzzadittaqwa —</span>
              <RotatingTag />
            </div>
          </motion.div>

          {/* Hero H1: Staggered word reveal */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-heading-serif font-bold tracking-tight text-text-primary leading-[1.12]">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mr-3"
              >
                {/* Highlight key words */}
                {['Konversi.', 'Dominasi.'].includes(word) ? (
                  <span className="gradient-text-teal">{word}</span>
                ) : word}
              </motion.span>
            ))}
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.55 }}
            className="text-base md:text-lg text-text-muted leading-relaxed max-w-[520px] font-sans"
          >
            {cleanSubheading}
          </motion.p>

          {/* CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.68 }}
            className="flex flex-col sm:flex-row gap-3 pt-1"
          >
            <MagneticButton
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-2 bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans font-bold uppercase tracking-wider px-8 py-4 rounded-xl text-xs text-center transition-colors duration-300 shadow-md shadow-teal-accent/20 shimmer select-none group"
            >
              <span>Jadwalkan Konsultasi Gratis</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
            </MagneticButton>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/utility/audit-engine"
              className="inline-flex items-center justify-center gap-2 border border-brand-border hover:border-teal-accent text-text-primary hover:text-teal-accent font-heading-sans font-bold uppercase tracking-wider px-8 py-4 rounded-xl text-xs bg-white transition-all duration-300 shadow-xs select-none group card-hover-lift"
            >
              <span>Diagnostik Situs Gratis</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
            </a>
          </motion.div>

          {/* Metrics — Counter with gold glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-brand-border max-w-sm"
          >
            {[
              { val: stats.years, suffix: '+', label: 'Tahun Aktif' },
              { val: stats.projects, suffix: '+', label: 'Proyek Riil' },
              { val: stats.clients, suffix: '', label: 'Mitra Lembaga' },
            ].map(({ val, suffix, label }) => (
              <div key={label}>
                <p className="text-3xl lg:text-4xl font-heading-sans font-extrabold text-gold-accent metric-counter glow-gold">
                  {val}{suffix}
                </p>
                <p className="text-[9px] font-mono tracking-wider text-text-muted uppercase mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════
            RIGHT: Visual Authority Panel
            ═══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col gap-5"
        >
          {/* Profile Photo Card — Hidden on mobile, visible on lg */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="hidden lg:block bg-white border border-brand-border p-3 rounded-2xl shadow-lg relative overflow-hidden group glow-border-teal"
          >
            <Image
              src="/zadit-foto.png"
              alt="Zadit — Digital Marketing & Branding Strategist"
              className="w-full h-72 object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
              priority
              width={640}
              height={360}
            />
            {/* Gradient overlay bottom */}
            <div className="absolute inset-x-3 bottom-3 h-20 bg-gradient-to-t from-brand-slate/40 to-transparent rounded-xl pointer-events-none" />
            {/* Role chip */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
              <div className="dark-liquid-glass text-text-inverse px-3 py-1.5 rounded-full text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-accent pulse-badge" />
                Growth Architect
              </div>
              <div className={cn(
                "dark-liquid-glass px-3 py-1.5 rounded-full text-[9px] font-mono tracking-widest uppercase",
                availabilityStatus === 'AVAILABLE' ? "text-gold-muted" : "text-amber-500"
              )}>
                {availabilityStatus === 'AVAILABLE' ? '2026 AVAILABLE' : 'CURRENTLY BUSY'}
              </div>
            </div>
          </motion.div>

          {/* Liquid Glass Status Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="liquid-glass rounded-2xl p-5 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
              <span className="text-[10px] font-mono text-text-primary font-bold uppercase tracking-widest">
                Status Sistem Real-time
              </span>
              <span className={cn(
                "flex items-center gap-1.5 text-[9px] font-mono px-2.5 py-1 rounded-full border",
                availabilityStatus === 'AVAILABLE'
                  ? "bg-teal-accent/10 text-teal-accent border-teal-accent/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              )}>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  availabilityStatus === 'AVAILABLE' ? "bg-teal-accent" : "bg-amber-500"
                )} />
                {availabilityStatus === 'AVAILABLE' ? 'ONLINE' : 'BUSY'}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'INTEGRASI DATA PUBLIK', icon: Database, val: 'SINKRONISASI AKTIF', color: 'text-teal-accent' },
                { label: 'AUTOMASI DIREKTORI B2B', icon: Globe, val: 'RUTIN DIPERBARUI', color: 'text-teal-accent' },
                { label: 'ANTREAN AUDIT WEB', icon: Zap, val: liveStats?.totalAudits ? `${liveStats.totalAudits} Kueri` : 'Aktif', color: 'text-teal-accent' },
                { label: 'PROFIL TERINDEKS', icon: Users, val: liveStats?.totalDirectories ? `${liveStats.totalDirectories} Entitas` : 'Optimal', color: 'text-teal-accent' },
                { label: 'KECEPATAN MUAT HALAMAN', icon: Check, val: lcpScore ? `${lcpScore.toFixed(2)}s` : '< 1.8s', color: 'text-teal-accent' },
              ].map(({ label, icon: Icon, val, color }) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-text-muted font-mono text-[10px] tracking-wider">{label}</span>
                  <span className={`font-mono text-[10px] ${color} flex items-center gap-1.5`}>
                    <Icon className="w-3 h-3" />
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[9px] font-sans text-text-muted/70 italic leading-relaxed pt-1 border-t border-slate-200/50">
              Metrik LCP diukur secara real-time dari browser Anda.
            </p>
          </motion.div>

          {/* Trust Badges Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="grid grid-cols-2 gap-2.5"
          >
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="bg-white border border-brand-border rounded-xl p-3 flex items-start gap-2.5 group card-hover-lift"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-accent/8 border border-teal-accent/12 flex items-center justify-center text-teal-accent flex-shrink-0 group-hover:bg-teal-accent/15 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-[9px] font-mono text-text-muted leading-tight uppercase tracking-wider pt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Gulir untuk menjelajahi</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-text-muted/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
