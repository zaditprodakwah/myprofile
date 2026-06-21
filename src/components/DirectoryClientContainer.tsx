'use client';

import React, { useState, useEffect, useDeferredValue } from 'react';
import { Search, MapPin, Navigation, ArrowRight, ShieldAlert, Check, Clock, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import EntityDrawer, { Entity } from './EntityDrawer';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DirectoryClientContainerProps {
  cities: any[];
}

export default function DirectoryClientContainer({ cities }: DirectoryClientContainerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);

  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  // Categories extraction
  const categories = ['All', 'Agensi / Kemitraan', 'Layanan / Lembaga', 'Bisnis Lokal'];

  // Query entities from Supabase based on search term & filter
  useEffect(() => {
    async function searchEntities() {
      setLoading(true);
      try {
        let query = supabase.from('directory_entities').select('*');

        if (deferredSearch.trim().length > 0) {
          query = query.ilike('name', `%${deferredSearch}%`);
        }

        if (filterCity !== 'All') {
          query = query.eq('city_slug', filterCity);
        }

        if (verifiedOnly) {
          query = query.eq('verification_status', 'VERIFIED');
        }

        const { data, error } = await query.limit(30);

        if (error) throw error;
        if (data) {
          const formatted = data.map((item: any) => {
            const rawType = String(item.entity_type || '').toLowerCase();
            const translatedCategory = 
              rawType === 'agency' ? 'Agensi / Kemitraan' : 
              rawType === 'service' ? 'Layanan / Lembaga' : 
              'Bisnis Lokal';

            return {
              id: String(item.id || ''),
              name: String(item.name || ''),
              slug: String(item.slug || ''),
              category: translatedCategory,
              tagline: String(item.tagline || item.description || ''),
              address: String(item.raw_metadata?.address || 'Alamat terdaftar'),
              phone: String(item.contact_phone || ''),
              email: String(item.contact_email || ''),
              website: String(item.website_url || ''),
              trustScore: Number(item.trust_score || 4.0),
              verified: item.verification_status === 'VERIFIED',
              city: String(item.city_slug || 'jakarta-selatan'),
              google_maps_url: item.google_maps_url ? String(item.google_maps_url) : undefined
            };
          });

          // Category client filter
          if (filterCategory !== 'All') {
            setEntities(formatted.filter(e => e.category === filterCategory));
          } else {
            setEntities(formatted);
          }
        } else {
          setEntities([]);
        }
      } catch (err) {
        console.error('Failed to query directory database:', err);
        setEntities([]);
      } finally {
        setLoading(false);
      }
    }
    searchEntities();
  }, [deferredSearch, filterCity, filterCategory, verifiedOnly]);

  const getCityTitle = (slug: string) => {
    return slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-12">
      
      {/* Search-First Filter Box */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Cari entitas bisnis nasional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-offwhite border border-brand-border rounded-xl font-sans text-xs text-text-primary placeholder-text-muted/65 focus:ring-1 focus:ring-teal-accent focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex-grow w-full flex flex-wrap gap-3 items-center justify-start md:justify-end">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
            </span>

            {/* City select dropdown */}
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="bg-white border border-brand-border text-xs px-3 py-2 rounded-lg text-text-muted hover:border-teal-accent font-medium outline-none"
            >
              <option value="All">Semua Wilayah</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>{city.name}</option>
              ))}
            </select>

            {/* Category select buttons */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "text-[10px] px-3 py-2 rounded-lg border font-semibold transition-all",
                    filterCategory === cat
                      ? "bg-teal-accent border-teal-accent text-text-inverse shadow-xs"
                      : "border-brand-border text-text-muted hover:border-teal-accent hover:text-teal-accent bg-white"
                  )}
                >
                  {cat === 'All' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>

            {/* Verified checkbox */}
            <label className="flex items-center gap-2 cursor-pointer border-l border-brand-border pl-4 ml-2 py-1 select-none shrink-0">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-brand-border text-teal-accent focus:ring-teal-accent bg-offwhite"
              />
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Terverifikasi</span>
            </label>
          </div>
        </div>

        {/* Dynamic Search Results Grid */}
        {(searchTerm.trim().length > 0 || filterCity !== 'All' || filterCategory !== 'All' || verifiedOnly) && (
          <div className="border-t border-brand-border/60 pt-5 space-y-4">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">Hasil Pencarian Direktori</h3>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-32 bg-offwhite animate-pulse border border-brand-border rounded-xl" />
                ))}
              </div>
            ) : entities.length === 0 ? (
              <div className="text-center py-8 bg-offwhite border border-brand-border rounded-xl space-y-2">
                <AlertCircle className="w-6 h-6 text-gold-accent mx-auto" />
                <p className="text-xs font-bold text-text-primary">Entitas Tidak Ditemukan</p>
                <p className="text-[10px] text-text-muted">Coba sesuaikan kata kunci pencarian atau bersihkan filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {entities.map((ent) => (
                  <div
                    key={ent.id}
                    onClick={() => setSelectedEntity(ent)}
                    className={cn(
                      "bg-white border rounded-xl p-4.5 flex flex-col justify-between h-36 hover:border-teal-accent transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md",
                      ent.verified ? "border-brand-border border-l-4 border-l-teal-accent" : "border-brand-border border-l-4 border-l-gold-accent/60"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-gold-accent truncate max-w-[60%]">{ent.category}</span>
                        {ent.verified ? (
                          <span className="bg-teal-50 text-teal-700 border border-teal-100 rounded px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold shrink-0">
                            Verified
                          </span>
                        ) : (
                          <span className="bg-gold-50 text-gold-700 border border-gold-100 rounded px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold shrink-0">
                            Unclaimed
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading-sans font-bold text-sm text-text-primary truncate">{ent.name}</h4>
                      <p className="text-[10px] text-text-muted truncate leading-relaxed">{ent.tagline}</p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-brand-border mt-3">
                      <span className="text-[8px] font-mono text-text-muted">SCORE: {ent.trustScore}/5.0</span>
                      <span className="text-[10px] font-semibold text-teal-accent flex items-center gap-0.5">
                        Detail <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cities Navigation list (REQUIRED SEO LAYER) */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono text-text-muted tracking-wider uppercase">Wilayah Direktori Regional (SEO Index)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/directory/${city.slug}`}
              className="bg-white border border-brand-border rounded-2xl p-6 hover:border-teal-accent transition-all duration-300 hover:shadow-md group flex flex-col justify-between h-44 shadow-xs"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-lg bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent group-hover:border-teal-accent transition-colors">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-heading-sans font-bold text-lg text-text-primary group-hover:text-teal-accent transition-colors">
                    {city.name}
                  </h3>
                  {city.target_niche && (
                    <p className="text-[10px] font-mono text-gold-accent mt-0.5">{city.target_niche}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-border mt-4">
                <span className="text-[9px] font-mono text-text-muted tracking-wider uppercase flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-teal-accent" /> Koordinat: {city.latitude}, {city.longitude}
                </span>
                <span className="text-xs font-semibold text-teal-accent group-hover:underline flex items-center gap-1">
                  Buka Wilayah <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shared Entity Drawer */}
      <EntityDrawer
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
      />

    </div>
  );
}
