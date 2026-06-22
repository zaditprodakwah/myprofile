'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Monitor, Building, BookOpen, Settings, X, CornerDownLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shortcutText, setShortcutText] = useState('Ctrl + K');
  const [pageSections, setPageSections] = useState<any[]>([]);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener & OS detection
  useEffect(() => {
    // Detect OS for inclusive shortcut helper
    if (typeof window !== 'undefined' && window.navigator) {
      const isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent);
      if (isMac) {
        setTimeout(() => setShortcutText('⌘K'), 0);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleCustomToggle);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleCustomToggle);
    };
  }, []);

  // Fetch results when query changes
  useEffect(() => {
    if (query.trim().length === 0) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('directory_entities')
          .select('name, slug, city_slug, entity_type')
          .ilike('name', `%${query}%`)
          .limit(5);

        if (error) throw error;
        
        const entityResults = (data || []).map((item) => ({
          type: 'entity',
          title: item.name,
          subtitle: item.entity_type === 'agency' ? 'Agensi Bisnis' : 'Layanan / Lembaga',
          url: `/directory/${item.city_slug}/${item.slug}`
        }));

        const navActions = [
          { type: 'action', title: 'Audit Performa Website', subtitle: 'Jalankan analisis kecepatan & SEO gratis', url: '/utility/audit-engine' },
          { type: 'action', title: 'Eksplorasi Direktori Wilayah', subtitle: 'Lihat data entitas bisnis regional', url: '/directory' }
        ].filter(act => act.title.toLowerCase().includes(query.toLowerCase()));

        setResults([...navActions, ...entityResults]);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Error fetching command palette matching data:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when open & gather page sections
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';

      // Gather sections for dynamic jump-links
      const sections = Array.from(document.querySelectorAll('h2[id], section[id], div[id]'))
        .filter(el => {
          const id = el.getAttribute('id');
          // Filter out generic next.js ids
          return id && !['__next', 'root'].includes(id) && el.textContent;
        })
        .map(el => {
          const title = el.tagName.startsWith('H') 
            ? el.textContent?.trim() 
            : el.getAttribute('aria-label') || el.id.replace(/-/g, ' ');
            
          return {
            title: title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Bagian Halaman',
            url: `#${el.id}`,
            desc: `Lompat ke bagian ${el.id.replace(/-/g, ' ')}`,
            icon: BookOpen
          };
        });
      
      // Deduplicate by URL
      const uniqueSections = sections.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i).slice(0, 5);
      
      setPageSections(uniqueSections);

    } else {
      document.body.style.overflow = '';
      setTimeout(() => setQuery(''), 0);
    }
  }, [isOpen]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[15vh]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-brand-slate/40 backdrop-blur-xs transition-opacity" 
      />

      {/* Palette Container */}
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-2xl bg-white border border-brand-border shadow-2xl transition-all duration-300 transform scale-100 flex flex-col">
        {/* Search Input Area */}
        <div className="relative flex items-center border-b border-brand-border/60 px-4 py-3.5">
          <Search className="w-5 h-5 text-text-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari layanan, halaman, atau wilayah..."
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              if (val.trim().length === 0) {
                setResults([]);
              }
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent font-sans text-sm text-text-primary placeholder-text-muted/65 outline-none"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary bg-offwhite border border-brand-border ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 max-h-72 overflow-y-auto p-2 space-y-1">
          {query.trim().length === 0 ? (
            /* Default Shortcuts */
            <div className="p-3 space-y-2">
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2">Pintasan Navigasi</p>
              <div className="space-y-1">
                {[
                  ...pageSections,
                  { title: 'Audit Website', url: '/utility/audit-engine', desc: 'Scan performa halaman B2B', icon: Monitor },
                  { title: 'Eksplorasi Direktori', url: '/directory', desc: 'Lihat ekosistem digital regional', icon: Building }
                ].slice(0, 6).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(item.url)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-offwhite cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-accent/10 text-teal-accent group-hover:bg-teal-accent/20">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{item.title}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-text-muted tracking-wider bg-offwhite px-2 py-0.5 rounded border border-brand-border opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Pilih <CornerDownLeft className="w-2.5 h-2.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="text-center py-8 text-xs font-mono text-text-muted animate-pulse">
              Mencari database...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-text-muted">
              Tidak ada hasil yang cocok dengan "{query}"
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item.url)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors group ${
                  selectedIndex === idx ? 'bg-teal-accent/10 border-l-4 border-l-teal-accent' : 'hover:bg-offwhite'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'action' ? 'bg-teal-accent/15 text-teal-accent' : 'bg-brand-slate/15 text-brand-slate'
                  }`}>
                    {item.type === 'action' ? <Monitor className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{item.title}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-mono text-text-muted bg-offwhite px-2 py-0.5 rounded border border-brand-border flex items-center gap-0.5 transition-opacity ${
                  selectedIndex === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  Pilih <CornerDownLeft className="w-2.5 h-2.5" />
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-brand-border/60 bg-alabaster px-4 py-2.5 flex items-center justify-between text-[9px] font-mono text-text-muted">
          <div className="flex gap-3">
            <span>↑↓ Navigasi</span>
            <span>Enter Pilih</span>
            <span>Esc Keluar</span>
          </div>
          <span>Pintasan: {shortcutText}</span>
        </div>
      </div>
    </div>
  );
}

