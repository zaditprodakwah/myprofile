'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Entity } from '@/lib/types';
import Image from 'next/image';

interface Props {
  entities: Entity[];
}

export default function FeaturedDirectory({ entities }: Props) {
  if (!entities || entities.length === 0) {
    return (
      <section className="py-16 bg-white border-b border-brand-border/40 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-4">
          <Building2 className="w-12 h-12 text-brand-mid/40 mx-auto animate-pulse" />
          <h3 className="text-lg font-heading-serif font-bold text-text-primary">Direktori Sedang Menyiapkan Data</h3>
          <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
            Belum ada mitra lokal yang terdaftar atau terverifikasi untuk wilayah ini. Jika Anda pemilik bisnis, daftarkan atau klaim profil bisnis Anda untuk memulai verifikasi kredibilitas publik.
          </p>
          <div className="pt-2">
            <Link 
              href="/directory"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-accent hover:underline"
            >
              Ajukan Pendaftaran Bisnis Baru <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white border-b border-brand-border/40 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-teal-accent uppercase block">
              {"// Ekosistem Direktori B2B"}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary tracking-tight">
              Mitra Lokal <span className="gradient-text-teal">Terverifikasi</span>
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Jaringan agensi, vendor, dan UMKM regional yang telah terverifikasi untuk membantu akselerasi pertumbuhan bisnis Anda.
            </p>
          </div>
          <Link 
            href="/directory"
            className="group flex items-center gap-2 text-sm font-bold text-teal-accent hover:text-teal-accent/80 transition-colors"
          >
            Lihat Semua Direktori
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-4">
          {entities.map((entity, idx) => (
            <motion.div
              key={entity.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05 }}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-alabaster border border-brand-border/60 rounded-xl hover:border-teal-accent/40 hover:shadow-xs transition-all gap-4"
            >
              {/* Left Info: Logo and Name details */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-white rounded-xl border border-brand-border/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {entity.logo_url ? (
                    <Image 
                      src={entity.logo_url} 
                      alt={`Logo ${entity.name}`} 
                      className="w-full h-full object-cover" 
                      width={48} 
                      height={48} 
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-brand-mid/40" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                      {entity.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-200/50 text-[9px] font-mono uppercase tracking-wider font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Terverifikasi
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-1 max-w-[500px]">
                    {entity.tagline || entity.description || 'Layanan bisnis lokal regional terdaftar.'}
                  </p>
                  
                  <div className="flex items-center gap-3 text-[10px] text-text-muted/80 font-mono">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-accent" />
                      <span className="capitalize">{entity.city_slug.replace('-', ' ')}</span>
                    </div>
                    {entity.trust_score > 0 && (
                      <span className="bg-gold-accent/10 text-gold-accent px-1.5 py-0.2 rounded border border-gold-accent/20">
                        Skor Kepercayaan: {entity.trust_score.toFixed(1)} / 5.0
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right CTA */}
              <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
                <Link 
                  href={`/directory/${entity.city_slug}/${entity.slug}`}
                  className="inline-flex items-center justify-center w-full md:w-auto bg-white border border-brand-border/85 hover:border-teal-accent/60 text-text-primary hover:text-teal-accent text-xs font-heading-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all group-hover:shadow-2xs"
                >
                  Buka Profil Terverifikasi →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
