'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { City, Entity } from '@/lib/types';

interface Props {
  cities: City[];
}

export default function CityDirectoryScroll({ cities }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [cityEntities, setCityEntities] = useState<Record<string, Entity[]>>({});
  const [loadingCity, setLoadingCity] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const toggleAccordion = async (citySlug: string) => {
    if (expandedCity === citySlug) {
      setExpandedCity(null);
      return;
    }
    
    setExpandedCity(citySlug);
    
    // Fetch if not already loaded
    if (!cityEntities[citySlug]) {
      setLoadingCity(citySlug);
      try {
        const res = await fetch(`/api/directory/${citySlug}`);
        const result = await res.json();
        if (result.success && result.data) {
          setCityEntities(prev => ({ ...prev, [citySlug]: result.data }));
        }
      } catch (err) {
        console.error('Failed to fetch entities', err);
      } finally {
        setLoadingCity(null);
      }
    }
  };

  if (!cities || cities.length === 0) return null;

  return (
    <section className="py-20 bg-offwhite border-y border-brand-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading-sans font-bold text-text-primary mb-4">
              Direktori Bisnis & Entitas Regional
            </h2>
            <p className="text-text-muted text-base md:text-lg">
              Jelajahi basis data entitas terverifikasi kami di berbagai kota strategis.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-xl border border-brand-border bg-white hover:border-teal-accent hover:text-teal-accent transition-colors shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-xl border border-brand-border bg-white hover:border-teal-accent hover:text-teal-accent transition-colors shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 items-start"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cities.map((city) => (
            <div 
              key={city.id} 
              className="min-w-[320px] md:min-w-[400px] snap-start bg-white border border-brand-border rounded-2xl p-6 hover:shadow-md transition-all shrink-0 flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold font-heading-sans text-text-primary mb-1">
                    {city.name}
                  </h3>
                  <div className="flex items-center text-xs text-text-muted font-mono">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-teal-accent" />
                    Target: {city.target_niche || 'Regional'}
                  </div>
                </div>
                <div className="bg-brand-slate/5 text-brand-slate font-bold font-mono text-xs px-3 py-1.5 rounded-lg flex items-center border border-brand-border/50">
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  {city.entityCount || 0}
                </div>
              </div>

              {/* Accordion Toggle */}
              <button 
                onClick={() => toggleAccordion(city.slug)}
                className="w-full flex items-center justify-between text-sm font-bold text-text-primary bg-offwhite border border-brand-border p-3 rounded-xl hover:border-teal-accent hover:text-teal-accent transition-colors mb-4"
              >
                Lihat Daftar Entitas
                {loadingCity === city.slug ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : expandedCity === city.slug ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Accordion Content */}
              {expandedCity === city.slug && (
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                  {cityEntities[city.slug]?.length > 0 ? (
                    cityEntities[city.slug].map(entity => (
                      <Link key={entity.id} href={`/directory/${city.slug}/${entity.slug}`} className="block group">
                        <div className="p-3 border border-brand-border rounded-xl bg-white hover:border-teal-accent transition-colors flex items-center justify-between">
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-text-primary group-hover:text-teal-accent truncate">{entity.name}</p>
                            <p className="text-[10px] text-text-muted font-mono mt-0.5 truncate">{entity.entity_type}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-brand-slate/30 group-hover:text-teal-accent" />
                        </div>
                      </Link>
                    ))
                  ) : loadingCity === city.slug ? null : (
                    <div className="text-center text-xs text-text-muted py-4">Belum ada entitas.</div>
                  )}
                </div>
              )}
              
              <div className="mt-auto pt-4 border-t border-brand-border">
                <Link 
                  href={`/directory/${city.slug}`}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-teal-accent group"
                >
                  Buka Halaman {city.name}
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </section>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}
