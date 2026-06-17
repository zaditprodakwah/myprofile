'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '@/lib/types';
import { motion } from 'framer-motion';

interface ServicesGridProps {
  services: Service[];
}

// Spotlight Card component implementing Taste-Skill Bento 2.0 aesthetics
function SpotlightCard({ 
  svc, 
  index 
}: { 
  svc: Service; 
  index: number; 
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    setCoords({
      x: clientX - left,
      y: clientY - top
    });
  };

  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[svc.icon_name] || LucideIcons.Globe;
  
  // Bento col-spans (Layout Variance 8)
  const colSpan = svc.size === 'large' ? 'lg:col-span-8' : svc.size === 'full' ? 'lg:col-span-12' : 'lg:col-span-4';

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-white border border-brand-border rounded-[2rem] p-8 flex flex-col justify-between gap-6 transition-all duration-500 hover:border-teal-accent/40 shadow-[0_12px_24px_-10px_rgba(15,23,42,0.03)] overflow-hidden group ${colSpan}`}
    >
      {/* Spotlight Background Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(13, 148, 136, 0.07), transparent 80%)`
        }}
      />

      {/* Subtle border spotlight */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-teal-accent/30 rounded-[2rem]"
        style={{
          clipPath: `circle(80px at ${coords.x}px ${coords.y}px)`
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Animated Icon Container */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-xl bg-teal-accent/5 border border-teal-accent/10 flex items-center justify-center text-teal-accent group-hover:bg-teal-accent/10 group-hover:border-teal-accent/20 transition-colors duration-300"
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        
        <h3 className="text-lg font-heading-sans font-bold text-text-primary tracking-tight">{svc.title}</h3>
        <p className="text-xs text-text-muted leading-relaxed max-w-2xl">{svc.description}</p>
      </div>

      {/* Tech tags footer */}
      <div className="relative z-10 flex flex-wrap gap-2 pt-4 border-t border-brand-border/60">
        {svc.tags && svc.tags.map((tech) => (
          <span
            key={tech}
            className="bg-offwhite border border-brand-border text-text-muted font-mono text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-md"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section id="services" className="bg-[#f9fafb] py-24 border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">Keahlian & Layanan Utama</span>
          <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary mt-2 leading-tight">
            Layanan & Solusi Terintegrasi
          </h2>
          <p className="text-text-muted mt-4 max-w-xl text-sm leading-relaxed">
            Arsitektur pertumbuhan holistik yang menggabungkan rekayasa kode, riset analitik, optimasi mesin pencari, dan seni narasi konversi.
          </p>
        </div>

        {/* Bento Grid (Variance 8 layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {services && services.map((svc, i) => (
            <SpotlightCard key={svc.id || i} svc={svc} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
