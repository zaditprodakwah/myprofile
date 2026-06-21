'use client';

import React, { useState, useEffect } from 'react';
import { Search, Monitor, Building, BookOpen, Clock, Check, ArrowRight, Zap, Play, HelpCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import EntityDrawer, { Entity } from './EntityDrawer';
import Link from 'next/link';

interface HomeClientContainerProps {
  latestArticles: any[];
  liveStats: any;
  whatsappNumber: string;
  availabilityStatus: string;
  headline: string;
  subheading: string;
}

export default function HomeClientContainer({
  latestArticles,
  liveStats,
  whatsappNumber,
  availabilityStatus,
  headline,
  subheading
}: HomeClientContainerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [topEntities, setTopEntities] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const router = useRouter();

  // Load top entities for preview list (max 5)
  useEffect(() => {
    async function loadTopEntities() {
      try {
        const { data, error } = await supabase
          .from('directory_entities')
          .select('*')
          .order('trust_score', { ascending: false })
          .limit(5);

        if (error) throw error;
        if (data) {
          const formatted = data.map((item: any) => ({
            id: String(item.id || ''),
            name: String(item.name || ''),
            slug: String(item.slug || ''),
            category: item.entity_type === 'agency' ? 'Agensi / Kemitraan' : 'Layanan Publik / Swasta',
            tagline: String(item.tagline || item.description || ''),
            address: String(item.raw_metadata?.address || 'Alamat terdaftar'),
            phone: String(item.contact_phone || ''),
            email: String(item.contact_email || ''),
            website: String(item.website_url || ''),
            trustScore: Number(item.trust_score || 4.0),
            verified: item.verification_status === 'VERIFIED',
            city: String(item.city_slug || 'jakarta-selatan'),
            google_maps_url: item.google_maps_url ? String(item.google_maps_url) : undefined
          }));
          setTopEntities(formatted);
        }
      } catch (err) {
        console.error('Failed to load top entities preview:', err);
      }
    }
    loadTopEntities();
  }, []);

  // Handle Autocomplete Live Search
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setAutocompleteResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        // Query matching entities from database
        const { data: dbEntities, error: entError } = await supabase
          .from('directory_entities')
          .select('*')
          .ilike('name', `%${searchQuery}%`)
          .limit(4);

        if (entError) throw entError;

        const entityMatches = (dbEntities || []).map((item) => ({
          type: 'entity',
          id: String(item.id || ''),
          name: String(item.name || ''),
          slug: String(item.slug || ''),
          category: item.entity_type === 'agency' ? 'Agensi / Kemitraan' : 'Layanan / Lembaga',
          tagline: String(item.tagline || item.description || ''),
          address: String(item.raw_metadata?.address || 'Alamat terdaftar'),
          phone: String(item.contact_phone || ''),
          email: String(item.contact_email || ''),
          website: String(item.website_url || ''),
          trustScore: Number(item.trust_score || 4.0),
          verified: item.verification_status === 'VERIFIED',
          city: String(item.city_slug || 'jakarta-selatan'),
          google_maps_url: item.google_maps_url ? String(item.google_maps_url) : undefined
        }));

        // Filter blog articles from local list
        const blogMatches = latestArticles
          .filter(art => art.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(art => ({
            type: 'blog',
            title: art.title,
            url: `/blog/${art.slug}`
          }));

        setAutocompleteResults([...entityMatches, ...blogMatches]);
        setShowDropdown(true);
      } catch (err) {
        console.error('Autocomplete query error:', err);
      } finally {
        setSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, latestArticles]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      router.push(`/directory?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (item: any) => {
    setShowDropdown(false);
    if (item.type === 'blog') {
      router.push(item.url);
    } else {
      setSelectedEntity(item);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO OS (Unified Entry Point) */}
      <section className="relative pt-12 pb-16 px-6 bg-brand-slate text-text-inverse overflow-hidden rounded-3xl glow-border-teal noise-overlay">
        {/* Glow overlay */}
        <div className="absolute -top-24 -left-24 w-[350px] h-[350px] bg-teal-accent/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[350px] h-[350px] bg-gold-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-teal-accent pulse-badge" />
            Zadit Engine Status: {availabilityStatus || 'Tersedia untuk Kemitraan'}
          </div>

          {/* Headline & Subheading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading-serif font-extrabold tracking-tight leading-tight">
              {headline || 'Growth Engineering & B2B Web Architect'}
            </h1>
            <p className="text-sm md:text-base text-text-inverse/75 max-w-xl mx-auto leading-relaxed">
              {subheading || 'Portofolio kredibilitas optimasi digital terpadu, direktori bisnis regional, dan robot audit performa website instan.'}
            </p>
          </div>

          {/* Search Box / Command Hub */}
          <div className="max-w-xl mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-inverse/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari entitas bisnis, audit performa, atau panduan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 0 && setShowDropdown(true)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-12 pr-20 py-4 font-sans text-sm text-text-inverse placeholder-text-inverse/40 focus:ring-2 focus:ring-teal-accent focus:bg-slate-900 outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-inverse/45 tracking-wider bg-slate-700 px-2 py-0.5 rounded border border-slate-600 hidden sm:inline">
                Cmd+K
              </span>
            </form>

            {/* Dropdown Auto-Complete list */}
            {showDropdown && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-border rounded-xl shadow-2xl overflow-hidden z-20 text-left divide-y divide-brand-border/60 max-h-80 overflow-y-auto"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="p-2.5 bg-alabaster flex items-center justify-between text-[10px] font-mono text-text-muted">
                  <span>Hasil Autocomplete</span>
                  {searching && <span>Mencari...</span>}
                </div>
                {autocompleteResults.length === 0 ? (
                  <div className="p-4 text-xs font-mono text-text-muted text-center">
                    Tidak ditemukan kecocokan entitas atau panduan.
                  </div>
                ) : (
                  autocompleteResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleResultClick(item)}
                      className="p-3 hover:bg-offwhite cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${
                          item.type === 'blog' ? 'bg-teal-50 text-teal-700' : 'bg-brand-slate/10 text-brand-slate'
                        }`}>
                          {item.type === 'blog' ? <BookOpen className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                            {item.type === 'blog' ? item.title : item.name}
                          </p>
                          <p className="text-[9px] font-mono text-text-muted mt-0.5">
                            {item.type === 'blog' ? 'Panduan SEO / Copywriting' : item.category}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 2 CTA MAX */}
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/utility/audit-engine"
              className="bg-teal-accent hover:bg-teal-glow text-text-inverse text-xs font-mono font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-98 flex items-center gap-1.5"
            >
              <Monitor className="w-4 h-4" /> Run Website Audit
            </Link>
            <Link
              href="/directory"
              className="bg-slate-800 hover:bg-slate-700 text-text-inverse border border-slate-700 text-xs font-mono font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all active:scale-98 flex items-center gap-1.5"
            >
              <Building className="w-4 h-4" /> Explore Directory
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ACTION SHORTCUT GRID (4 Items) */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono text-text-muted tracking-wider uppercase">Pintasan Tindakan Sistem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          <Link
            href="/utility/audit-engine"
            className="bg-white border border-brand-border hover:border-teal-accent p-5 rounded-2xl group transition-all hover:shadow-md flex flex-col justify-between h-40"
          >
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-accent w-fit border border-teal-100 group-hover:bg-teal-accent group-hover:text-text-inverse transition-colors">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading-sans font-bold text-sm text-text-primary">Run Website Audit</h3>
              <p className="text-[10px] text-text-muted mt-1 leading-normal">Audit optimasi Core Web Vitals & A11y secara instan.</p>
            </div>
          </Link>

          <Link
            href="/directory"
            className="bg-white border border-brand-border hover:border-teal-accent p-5 rounded-2xl group transition-all hover:shadow-md flex flex-col justify-between h-40"
          >
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-accent w-fit border border-teal-100 group-hover:bg-teal-accent group-hover:text-text-inverse transition-colors">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading-sans font-bold text-sm text-text-primary">Search Business</h3>
              <p className="text-[10px] text-text-muted mt-1 leading-normal">Cari entitas bisnis dan mitra regional terverifikasi.</p>
            </div>
          </Link>

          <Link
            href="/directory?filter=unclaimed"
            className="bg-white border border-brand-border hover:border-teal-accent p-5 rounded-2xl group transition-all hover:shadow-md flex flex-col justify-between h-40"
          >
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-accent w-fit border border-teal-100 group-hover:bg-teal-accent group-hover:text-text-inverse transition-colors">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading-sans font-bold text-sm text-text-primary">Claim Profile</h3>
              <p className="text-[10px] text-text-muted mt-1 leading-normal">Ambil alih kepemilikan bisnis Anda di direktori regional.</p>
            </div>
          </Link>

          <Link
            href="/app"
            className="bg-white border border-brand-border hover:border-teal-accent p-5 rounded-2xl group transition-all hover:shadow-md flex flex-col justify-between h-40"
          >
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-accent w-fit border border-teal-100 group-hover:bg-teal-accent group-hover:text-text-inverse transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading-sans font-bold text-sm text-text-primary">Open Dashboard</h3>
              <p className="text-[10px] text-text-muted mt-1 leading-normal">Monitor audit terbaru, sitemap log, & status antrean.</p>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. TRUST STRIP (MINIMAL) */}
      <section className="bg-white border border-brand-border rounded-xl p-4 flex flex-wrap justify-around items-center text-xs font-mono text-text-muted gap-4">
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-accent" /> Powered by verified data</span>
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-accent" /> {liveStats?.total_audits || '10+'} Website Audits Run</span>
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-accent" /> Live operational system</span>
      </section>

      {/* 4. DUAL PREVIEW PANEL: DIRECTORY & BLOG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Top Directory Previews (max 5) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-baseline">
            <h2 className="text-sm font-mono text-text-muted tracking-wider uppercase">Entitas Direktori Teratas</h2>
            <Link href="/directory" className="text-xs font-semibold text-teal-accent hover:underline flex items-center gap-0.5">
              Semua Entitas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="bg-white border border-brand-border rounded-2xl divide-y divide-brand-border/60 overflow-hidden shadow-xs">
            {topEntities.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-text-muted">Loading preview data...</div>
            ) : (
              topEntities.map((ent) => (
                <div
                  key={ent.id}
                  onClick={() => setSelectedEntity(ent)}
                  className="p-4.5 hover:bg-offwhite/50 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <span className="font-heading-sans font-bold text-sm text-text-primary group-hover:text-teal-accent transition-colors leading-snug">
                        {ent.name}
                      </span>
                      {ent.verified && (
                        <span className="bg-teal-50 text-teal-700 border border-teal-100 rounded px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold shrink-0">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-gold-accent">{ent.category}</p>
                    <p className="text-[11px] text-text-muted truncate leading-normal">{ent.tagline}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-teal-accent group-hover:underline flex items-center gap-0.5">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Latest Blog Previews (max 6) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-baseline">
            <h2 className="text-sm font-mono text-text-muted tracking-wider uppercase">Panduan & Insights</h2>
            <Link href="/blog" className="text-xs font-semibold text-teal-accent hover:underline flex items-center gap-0.5">
              Buka Blog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl divide-y divide-brand-border/60 overflow-hidden shadow-xs">
            {latestArticles.slice(0, 6).map((art, idx) => (
              <Link
                key={idx}
                href={`/blog/${art.slug}`}
                className="p-4.5 hover:bg-offwhite/50 transition-colors flex items-center justify-between group block"
              >
                <div className="space-y-1 max-w-[90%]">
                  <p className="text-xs font-bold text-text-primary group-hover:text-teal-accent transition-colors leading-snug">
                    {art.title}
                  </p>
                  <p className="text-[10px] font-mono text-text-muted">
                    {new Date(art.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* Dynamic Entity Drawer */}
      <EntityDrawer
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
      />

    </div>
  );
}
