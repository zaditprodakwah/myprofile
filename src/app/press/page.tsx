import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Newspaper, Download, Share2, Info } from "lucide-react";

export default function PressPage() {
  return (
    <main className="min-h-screen bg-[#020617] pt-32 pb-24">
      <Header />
      <div className="max-w-4xl mx-auto px-6 space-y-12 mb-32">
        <header className="space-y-4">
          <Badge variant="outline" className="text-slate-500 border-white/10">Press & Media</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white">Brand Assets</h1>
          <p className="text-slate-400 text-lg">Resource resmi dan informasi terkini untuk jurnalis, mitra, dan publik.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Download className="text-blue-500" />
            <h3 className="font-bold text-white">Media Kit</h3>
            <p className="text-sm text-slate-400">Unduh logo resmi, panduan gaya visual, dan foto profil kepemimpinan untuk penggunaan publik.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Info className="text-emerald-500" />
            <h3 className="font-bold text-white">About Zadit Hub</h3>
            <p className="text-sm text-slate-400">Zadit Intelligence Hub adalah agregator strategi dan teknologi yang dirancang untuk mempercepat pertumbuhan entitas di era AI.</p>
          </div>
        </section>

        <article className="prose prose-invert prose-slate max-w-none space-y-8">
          <h2>Kontak Media</h2>
          <p>
            Untuk pertanyaan media, permintaan wawancara, atau kolaborasi konten, silakan hubungi tim komunikasi kami di:
            <br />
            <span className="text-blue-400 font-bold">muhzadit@gmail.com</span>
          </p>

          <h2>Berita Terbaru</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 italic text-slate-400">
            Belum ada siaran pers aktif untuk saat ini. Ikuti Radar kami untuk update industri terkini.
          </div>
        </article>
      </div>
      <Footer />
    </main>
  );
}
