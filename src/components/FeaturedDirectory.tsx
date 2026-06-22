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
  if (!entities || entities.length === 0) return null;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {entities.map((entity, idx) => (
            <motion.div
              key={entity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="bg-alabaster border border-brand-border rounded-2xl p-6 flex flex-col justify-between group hover:border-teal-accent/50 hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-white rounded-xl border border-brand-border flex items-center justify-center overflow-hidden">
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
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-text-primary group-hover:text-teal-accent transition-colors line-clamp-1">
                    {entity.name}
                  </h3>
                  <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                    {entity.tagline || entity.description || 'Layanan bisnis lokal'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-accent" />
                  <span className="capitalize">{entity.city_slug.replace('-', ' ')}</span>
                </div>
                {entity.trust_score > 0 && (
                  <span className="font-mono text-gold-accent font-bold">
                    TS: {entity.trust_score}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
