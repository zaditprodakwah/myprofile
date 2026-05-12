"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, MessageSquare, Send, MapPin, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AIPulse } from "@/components/ui/AIPulse";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white pt-32 selection:bg-blue-500/30">
      <Header />
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Hero */}
        <section className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-500">
            <MessageSquare size={16} /> Direct Access
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight">
            Let's Engineer <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-400">
              Your Growth.
            </span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium">
            Mau konsultasi strategis, bedah kampanye, atau butuh bantuan akademik yang presisi? 
            Langsung aja tulis pesan di bawah. Saya pantau radar pesan masuk 24/7. Sikat!
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 pb-24">
          {/* Contact Form */}
          <section className="p-1 rounded-[40px] bg-linear-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/10">
            <div className="bg-[#0b1120] rounded-[38px] p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-hidden transition-all text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@enterprise.com"
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-hidden transition-all text-sm" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Subject / Industry</label>
                <select className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-hidden transition-all text-sm appearance-none">
                  <option>Marketing Growth Partnership</option>
                  <option>Academic Research Mentoring</option>
                  <option>Business Intelligence Project</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Message</label>
                <textarea 
                  rows={5}
                  placeholder="Describe your bottleneck or objective..."
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 focus:border-blue-500 outline-hidden transition-all text-sm resize-none" 
                />
              </div>
              <button className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3">
                Kirim Request Intelijen, Sikat! <Send size={18} />
              </button>
            </div>
          </section>

          {/* Quick Contact Info */}
          <aside className="space-y-12">
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Fast Channels</h3>
              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Email</div>
                    <div className="text-sm font-bold text-white">muhzadit@gmail.com</div>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">WhatsApp</div>
                    <div className="text-sm font-bold text-white">+62 895 3217 01031</div>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Location</div>
                    <div className="text-sm font-bold text-white">Cirebon, Indonesia</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/2 border border-white/5 space-y-4">
              <h4 className="text-sm font-bold text-white">Operating Hours</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our intelligence systems run 24/7. Human responses are prioritized Monday-Friday, 09:00 - 17:00 (GMT+7).
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
      <AIPulse 
        messages={[
          "Beres! Nanti kalau ada pesan masuk, radar langsung kasih notif ke saya.",
          "Waduh, ada ide project gokil? Langsung aja kirim, sikat!",
          "Tenang, data Anda aman di enkripsi radar Zadit Hub.",
          "Lagi nunggu sinyal kolaborasi baru nih... Sikat!",
        ]}
      />
    </main>
  );
}
