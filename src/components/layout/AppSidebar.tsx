"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Home, Layers, Search, Radar, Briefcase, 
  Settings, User, LogOut, ChevronRight, BarChart3,
  Rocket, BookOpen, Shield, Globe, Zap
} from "lucide-react";
import { useMode } from "@/hooks/use-mode";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, setMode } = useMode();

  useEffect(() => {
    const handleToggle = () => setIsOpen(!isOpen);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, [isOpen]);

  const menuItems = [
    { label: "Executive Home", href: "/", icon: Home },
    { label: "Intelligence Radar", href: "/radar", icon: Radar, badge: "Live" },
    { label: "Industry Solutions", href: "/solutions", icon: Layers },
    { label: "Authority Stack", href: "/tools", icon: Zap },
    { label: "Proof of Work", href: "/case-studies", icon: Briefcase },
    { label: "Brand Frameworks", href: "/frameworks", icon: Globe },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] z-[70] bg-[#0b1120] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">Z</div>
                <div className="text-sm font-black uppercase tracking-widest">Dashboard</div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Profile / Segment */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Guest Executive</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{mode} Mode</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setMode("marketing")}
                    className={cn(
                      "p-2 rounded-lg text-[9px] font-bold border transition-all",
                      mode === "marketing" ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-slate-400"
                    )}
                  >
                    MKT
                  </button>
                  <button 
                    onClick={() => setMode("academic")}
                    className={cn(
                      "p-2 rounded-lg text-[9px] font-bold border transition-all",
                      mode === "academic" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-white/5 border-white/10 text-slate-400"
                    )}
                  >
                    ACD
                  </button>
                  <button 
                    onClick={() => setMode("business")}
                    className={cn(
                      "p-2 rounded-lg text-[9px] font-bold border transition-all",
                      mode === "business" ? "bg-amber-600 border-amber-500 text-white" : "bg-white/5 border-white/10 text-slate-400"
                    )}
                  >
                    BIZ
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2">Navigation</h3>
                {menuItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[8px] font-black uppercase text-white animate-pulse">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight size={14} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                    )}
                  </Link>
                ))}
              </nav>

              {/* Hub Metrics (EEAT Booster) */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Hub Activity</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Radar Signals</div>
                    <div className="text-xl font-black text-white">128+</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Auth Tools</div>
                    <div className="text-xl font-black text-white">50+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 space-y-4">
              <Link 
                href="/sponsor" 
                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
              >
                <Rocket size={16} /> Partner with us
              </Link>
              <div className="text-[9px] text-center text-slate-600 font-medium">
                Zadit Intelligence Hub v2.0 &copy; 2026
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
