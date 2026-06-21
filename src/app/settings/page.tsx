'use client';

import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarNav from "@/components/SidebarNav";
import { Settings, Save, Check, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark');
  const [animations, setAnimations] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-teal-accent/10 border border-teal-accent/20 rounded-xl flex items-center justify-center text-teal-accent mx-auto">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-heading-serif font-bold text-text-primary">Pengaturan Sistem</h1>
            <p className="text-xs text-text-muted">Konfigurasi sederhana preferensi rendering & status operasional.</p>
          </div>

          <form onSubmit={handleSave} className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="space-y-4">
              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider">Mode Tema Visual</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`text-xs py-2 rounded-lg border font-bold ${
                      theme === 'light' 
                        ? 'bg-teal-accent border-teal-accent text-text-inverse' 
                        : 'border-brand-border text-text-muted hover:border-teal-accent bg-white'
                    }`}
                  >
                    Terang (Light)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`text-xs py-2 rounded-lg border font-bold ${
                      theme === 'dark' 
                        ? 'bg-teal-accent border-teal-accent text-text-inverse' 
                        : 'border-brand-border text-text-muted hover:border-teal-accent bg-white'
                    }`}
                  >
                    Gelap (Dark)
                  </button>
                </div>
              </div>

              {/* Micro-animations Toggle */}
              <div className="flex justify-between items-center py-2.5 border-t border-b border-brand-border/60">
                <div>
                  <span className="block text-[10px] font-mono text-text-muted uppercase tracking-wider">Animasi Mikro UI</span>
                  <span className="text-[10px] text-text-muted leading-tight">Gunakan spring transition interaktif</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={animations}
                    onChange={(e) => setAnimations(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-accent" />
                </label>
              </div>

              {/* API Integration State */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-mono text-text-muted uppercase tracking-wider">Integrasi Pihak Ketiga</span>
                <div className="bg-offwhite border border-brand-border rounded-xl p-3.5 space-y-2 text-[10px] text-text-muted">
                  <div className="flex justify-between items-center">
                    <span>Supabase Database Connection:</span>
                    <span className="text-teal-accent font-bold">Terhubung</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Xendit Payment Gateway API:</span>
                    <span className="text-teal-accent font-bold">Terhubung</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-teal-accent hover:bg-brand-slate text-text-inverse font-mono text-[10px] font-bold uppercase tracking-wider py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Konfigurasi Disimpan
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Simpan Pengaturan
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>
      <SidebarNav />
      <Footer />
    </>
  );
}
