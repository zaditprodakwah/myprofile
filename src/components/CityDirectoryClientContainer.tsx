'use client';

import React, { useState, useDeferredValue } from 'react';
import { Search, SlidersHorizontal, Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import EntityDrawer, { Entity } from './EntityDrawer';

interface CityDirectoryClientContainerProps {
  initialEntities: Entity[];
  citySlug: string;
  cityName: string;
}

export default function CityDirectoryClientContainer({
  initialEntities,
  citySlug,
  cityName
}: CityDirectoryClientContainerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);

  const [filterCategory, setFilterCategory] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  // Dynamic categories list based on available entities in this city
  const categories = ['All', ...Array.from(new Set(initialEntities.map(e => e.category)))];

  // Perform instant local filtering
  const filteredEntities = initialEntities.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(deferredSearch.toLowerCase()) || 
      e.tagline.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      (e.address && e.address.toLowerCase().includes(deferredSearch.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
    const matchesVerified = !verifiedOnly || e.verified;
    
    return matchesSearch && matchesCategory && matchesVerified;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-white border border-brand-border/60 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Cari agensi, partner, atau bisnis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-offwhite border border-brand-border rounded-xl font-sans text-xs text-text-primary placeholder-text-muted/65 focus:ring-1 focus:ring-teal-accent focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex-grow w-full flex flex-wrap gap-3 items-center justify-start md:justify-end">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Kategori:
          </span>
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
                {cat === 'All' ? 'Semua' : cat}
              </button>
            ))}
          </div>

          {/* Verified Toggle */}
          <label className="flex items-center gap-2 cursor-pointer border-l border-brand-border pl-4 ml-2 py-1 select-none shrink-0">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-brand-border text-teal-accent focus:ring-teal-accent bg-offwhite"
            />
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Hanya Terverifikasi</span>
          </label>
        </div>

      </div>

      {/* Matching counts log */}
      <div className="flex justify-between items-center text-[10px] font-mono text-text-muted uppercase tracking-wider">
        <span>Menampilkan {filteredEntities.length} entitas terdaftar</span>
        {searchTerm.trim().length > 0 && (
          <span>Kata Kunci: "{searchTerm}"</span>
        )}
      </div>

      {/* Grid of Cards */}
      {filteredEntities.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <AlertCircle className="w-6 h-6 text-gold-accent mx-auto" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Entitas Tidak Ditemukan</h3>
          <p className="text-[10px] text-text-muted max-w-sm mx-auto leading-relaxed">
            Tidak ada kecocokan profil bisnis di {cityName} dengan kriteria filter tersebut. Coba sesuaikan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntities.map((ent) => (
            <div
              key={ent.id}
              onClick={() => setSelectedEntity(ent)}
              className={cn(
                "bg-white border rounded-2xl p-6 flex flex-col justify-between h-48 hover:border-teal-accent transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md",
                ent.verified 
                  ? "border-brand-border border-l-4 border-l-teal-accent" 
                  : "border-brand-border border-l-4 border-l-gold-accent/60"
              )}
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-gold-accent uppercase tracking-wider">{ent.category}</span>
                  <div>
                    {ent.verified ? (
                      <span className="bg-teal-50 text-teal-700 border border-teal-100 rounded px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold shrink-0 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Verified
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 rounded px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold shrink-0 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> Unclaimed
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading-sans font-bold text-base text-text-primary truncate">
                    {ent.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
                    {ent.tagline}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-brand-border/60">
                <span className="text-[9px] font-mono text-text-muted">SCORE: {ent.trustScore}/5.0</span>
                <span className="text-[10px] font-semibold text-teal-accent group-hover:underline">
                  {ent.verified ? 'Buka Profil Bisnis →' : 'Klaim Profil Gratis →'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shared Entity Detail Drawer overlay */}
      <EntityDrawer
        key={selectedEntity?.id || 'none'}
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
      />
    </div>
  );
}
