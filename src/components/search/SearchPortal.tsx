"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, Radar, Zap, Layers, ChevronRight, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Dummy data for initial implementation - will be connected to Supabase search later
const searchCategories = [
  {
    title: "Radar Intelligence",
    icon: Radar,
    items: [
      { id: "r1", label: "Programmatic SEO Trends 2026", href: "/radar/1", category: "SEO" },
      { id: "r2", label: "Llama 3 vs Gemini 1.5 for Growth", href: "/radar/2", category: "AI" },
    ]
  },
  {
    title: "Solutions",
    icon: Layers,
    items: [
      { id: "s1", label: "High CAC Problem in Ecommerce", href: "/solutions/ecommerce/high-cac-low-roas", category: "Ecommerce" },
      { id: "s2", label: "Research Methodology in Academic", href: "/solutions/education/research-methodology-confusion", category: "Education" },
    ]
  },
  {
    title: "Authority Stack",
    icon: Zap,
    items: [
      { id: "t1", label: "Ahrefs for Authority Growth", href: "/tools/seo/ahrefs", category: "SEO" },
      { id: "t2", label: "Cursor for Rapid Engineering", href: "/tools/engineering/cursor", category: "Eng" },
    ]
  }
];

export function SearchPortal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") setIsOpen(false);
      
      if (e.key === "Enter" && isOpen && query.length > 0) {
        handleSearch(query);
      }
    };

    window.addEventListener("open-search", handleOpen);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-search", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, query]);

  const handleSearch = (q: string) => {
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  const filteredCategories = searchCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase()) || 
      item.category.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const totalItems = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 flex items-center gap-4 border-b border-white/5 bg-white/2">
              <Search className="text-slate-500" size={20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search intelligence, tools, or solutions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-600 font-medium"
              />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-black text-slate-500">
                ESC
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat, catIdx) => (
                  <div key={cat.title} className="mb-4 last:mb-0">
                    <h3 className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <cat.icon size={12} /> {cat.title}
                    </h3>
                    <div className="space-y-1">
                      {cat.items.map((item, itemIdx) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.href)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                            "hover:bg-white/5 text-left"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                              {item.label}
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-bold text-slate-500 group-hover:text-blue-500 group-hover:border-blue-500/30">
                              {item.category}
                            </span>
                          </div>
                          <ChevronRight size={14} className="text-slate-700 group-hover:text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-600">
                    <Search size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-400">No results found for "{query}"</p>
                    <p className="text-xs text-slate-600">Try searching for keywords like "SEO", "AI", or "ROI".</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/5 bg-white/2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black text-slate-500">↑↓</kbd>
                  <span className="text-[10px] text-slate-600 font-bold uppercase">Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black text-slate-500">ENTER</kbd>
                  <span className="text-[10px] text-slate-600 font-bold uppercase">Select</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-bold italic">
                Zadit Search Engine v1.0
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
