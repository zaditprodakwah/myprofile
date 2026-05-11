import React from "react";
import { Header } from "@/components/layout/Header";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#020617] pt-32 pb-24">
      <Header />
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <header className="space-y-4">
          <Badge variant="outline" className="text-blue-500 border-blue-500/20">Privacy Policy</Badge>
          <h1 className="text-4xl md:text-6xl font-black font-outfit">Data Integrity & Privacy</h1>
          <p className="text-slate-400 text-lg">Bagaimana kami mengelola informasi Anda dengan standar keamanan eksekutif.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Lock className="text-blue-500" />
            <h3 className="font-bold text-white">Keamanan Data</h3>
            <p className="text-sm text-slate-400">Kami menggunakan enkripsi tingkat lanjut untuk setiap data inquiry dan dokumen yang Anda kirimkan melalui platform kami.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Eye className="text-emerald-500" />
            <h3 className="font-bold text-white">Transparansi AI</h3>
            <p className="text-sm text-slate-400">Kami secara transparan menyatakan penggunaan AI dalam proses sintesis data untuk memastikan tidak ada misinformasi.</p>
          </div>
        </section>

        <article className="prose prose-invert prose-slate max-w-none space-y-8">
          <h2>1. Pengumpulan Informasi</h2>
          <p>
            Zadit mengumpulkan data yang Anda berikan secara sukarela melalui formulir Inquiry Wizard, 
            termasuk namun tidak terbatas pada nama, kontak, dan detail tantangan bisnis/akademik Anda.
          </p>

          <h2>2. Penggunaan Data</h2>
          <p>
            Data Anda hanya digunakan untuk:
            <ul>
              <li>Menyusun rencana strategis yang dipersonalisasi.</li>
              <li>Menghubungi Anda untuk konsultasi lebih lanjut.</li>
              <li>Meningkatkan akurasi algoritma mapping solusi kami.</li>
            </ul>
          </p>

          <h2>3. Cookies & Tracking</h2>
          <p>
            Kami menggunakan cookies fungsional untuk menyimpan preferensi mode (Marketing/Academic/Business) Anda 
            dan analitik anonim untuk memantau performa platform.
          </p>
        </article>
      </div>
    </main>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
      className
    )}>
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";
