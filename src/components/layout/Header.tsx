"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMode } from "@/hooks/use-mode";
import { cn } from "@/lib/utils";
import { Menu, X, Search, Command, ChevronDown, Rocket, Shield, BookOpen, Briefcase, Zap, Radar, Settings, Grid } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ModeSwitcher } from "./ModeSwitcher";
import { SmartSearch } from "../shared/SmartSearch";
import { AnimatePresence, motion } from "framer-motion";

const solutions = [
  { label: "Ecommerce", href: "/solutions/ecommerce", icon: Rocket, description: "Scale ROAS & conversion." },
  { label: "Marketing", href: "/solutions/marketing", icon: Zap, description: "pSEO & Growth architecture." },
  { label: "Academic", href: "/solutions/academic", icon: BookOpen, description: "Research integrity systems." },
  { label: "Business", href: "/solutions/business", icon: Shield, description: "Reporting & Governance." },
];

const tools = [
  { label: "AI Tools", href: "/tools/ai", icon: Zap },
  { label: "Marketing", href: "/tools/marketing", icon: Rocket },
  { label: "Database", href: "/tools/database", icon: Settings },
];

export function Header() {
  const { mode } = useMode();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleOpenSearch = () => setSearchOpen(true);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("open-search", handleOpenSearch);
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-search", handleOpenSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-[#020617]/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Brand + Primary Nav */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Z
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight hidden sm:block">
              ZADIT<span className="text-blue-500">.</span>DEV
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            <button 
              onMouseEnter={() => setActiveMenu("solutions")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                activeMenu === "solutions" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Solutions <ChevronDown size={14} className={cn("transition-transform", activeMenu === "solutions" && "rotate-180")} />
            </button>
            
            <button 
              onMouseEnter={() => setActiveMenu("tools")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                activeMenu === "tools" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Tools <ChevronDown size={14} className={cn("transition-transform", activeMenu === "tools" && "rotate-180")} />
            </button>

            <Link href="/radar" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">
              Radar
            </Link>
            <Link href="/case-studies" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">
              Case Studies
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 hover:bg-white/10 transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={14} />
            <span className="opacity-50">Search hub...</span>
            <span className="flex items-center gap-0.5 px-1 rounded border border-white/10 bg-white/5 text-[9px] font-black">
              <Command size={8} /> K
            </span>
          </button>
          
          <div className="hidden md:block">
            <ModeSwitcher />
          </div>

          {/* Collapsible Trigger */}
          <button 
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar"))}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mega Menu Overlay */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-[#020617] border-b border-white/10 shadow-2xl py-8 px-6 hidden lg:block"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
              {activeMenu === "solutions" && (
                <>
                  <div className="col-span-1 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">Industry Hubs</h3>
                    <p className="text-sm text-slate-500">Strategi spesifik industri untuk dominasi market dan otoritas akademik.</p>
                    <Link href="/solutions" className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-blue-400 transition-colors">
                      View all solutions <Rocket size={12} />
                    </Link>
                  </div>
                  <div className="col-span-3 grid grid-cols-2 gap-4">
                    {solutions.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/0 border border-transparent hover:bg-white/5 hover:border-white/10 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                          <item.icon size={20} />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-white">{item.label}</div>
                          <div className="text-xs text-slate-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {activeMenu === "tools" && (
                <>
                  <div className="col-span-1 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">The Stack</h3>
                    <p className="text-sm text-slate-500">Kurasi tool pilihan untuk eksekusi teknis yang presisi.</p>
                    <Link href="/tools" className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-emerald-400 transition-colors">
                      Explore tools hub <Grid size={12} />
                    </Link>
                  </div>
                  <div className="col-span-3 grid grid-cols-4 gap-4">
                    {tools.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/0 border border-transparent hover:bg-white/5 hover:border-white/10 transition-all text-center group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:rotate-12 transition-transform">
                          <item.icon size={24} />
                        </div>
                        <div className="text-sm font-bold text-white">{item.label}</div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SmartSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
