"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Zap, Radar, Layers, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartSearch({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl shadow-blue-500/10 overflow-hidden"
          >
            <form onSubmit={handleSearch} className="p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <Search className="text-blue-500" size={24} />
                <input 
                  ref={inputRef}
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Zadit Intelligence..."
                  className="flex-1 bg-transparent border-none text-xl font-bold text-white focus:ring-0 placeholder:text-slate-600"
                />
                <button 
                  type="button" 
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/5 text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </form>

            <div className="p-6 space-y-8">
              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quick Navigation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <LinkItem icon={<Radar size={18} />} title="Radar Signals" href="/radar" color="text-blue-500" />
                  <LinkItem icon={<Zap size={18} />} title="Tech Stack" href="/tools" color="text-amber-500" />
                  <LinkItem icon={<Layers size={18} />} title="Solutions" href="/solutions" color="text-emerald-500" />
                  <LinkItem icon={<Sparkles size={18} />} title="Consultation" href="/contact" color="text-purple-500" />
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-blue-500">AI Recommendation</div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    "Coba cari <strong>'Enterprise AI Integration'</strong> untuk melihat roadmap implementasi kami."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 p-4 flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <div className="flex gap-4">
                <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 mr-1">ENT</kbd> to search</span>
                <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 mr-1">ESC</kbd> to close</span>
              </div>
              <div className="flex items-center gap-1">
                Zadit Intelligence v3.0
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function LinkItem({ icon, title, href, color }: { icon: React.ReactNode; title: string; href: string; color: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group"
    >
      <div className={color}>{icon}</div>
      <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{title}</span>
    </Link>
  );
}

import Link from "next/link";
