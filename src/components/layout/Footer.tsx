"use client";

import React from "react";
import Link from "next/link";
import { Radar, Mail, MessageSquare, ExternalLink, ShieldCheck, Share2, X } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { name: "Intelligence Radar", href: "/radar" },
      { name: "Industry Solutions", href: "/solutions" },
      { name: "Case Studies", href: "/case-studies" },
      { name: "Global Search", href: "/search" },
    ],
    company: [
      { name: "Philosophy", href: "/#philosophy" },
      { name: "Executive Team", href: "/#team" },
      { name: "Careers", href: "/careers" },
      { name: "Press Kit", href: "/press" },
    ],
    legal: [
      { name: "Privacy Protocol", href: "/privacy" },
      { name: "Terms of Engagement", href: "/terms" },
      { name: "Security Audit", href: "/security" },
    ]
  };

  return (
    <footer className="relative bg-[#020617] border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 pb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform">
                <Radar size={22} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                Zadit<span className="text-blue-500">Intelligence</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Engineering high-performance revenue systems and reputation infrastructure for elite enterprises globally.
            </p>

            <div className="flex items-center gap-4">
              {[X, Share2, Mail].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Platform</h4>
            <ul className="space-y-4">
              {links.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Network</h4>
            <ul className="space-y-4">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Governance</h4>
            <ul className="space-y-4">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-4">
            <span>© {currentYear} ZADIT EXECUTIVE SALES ENGINE</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500" /> ENCRYPTED CONNECTION
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer group">
              <span className="text-[10px] font-black uppercase tracking-widest">Network Status</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
