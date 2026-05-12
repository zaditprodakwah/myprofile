import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Briefcase, Zap, Heart, Star } from "lucide-react";

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#020617] pt-32 pb-24">
      <Header />
      <div className="max-w-4xl mx-auto px-6 space-y-12 mb-32">
        <header className="space-y-4">
          <Badge variant="outline" className="text-indigo-500 border-indigo-500/20">Join the Mission</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white">Future of Intelligence</h1>
          <p className="text-slate-400 text-lg">Bekerja di garis depan inovasi AI dan strategi digital bersama talenta terbaik di industri.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Zap className="text-yellow-500" />
            <h3 className="font-bold text-white">Impact Driven</h3>
            <p className="text-sm text-slate-400">Setiap baris kode dan strategi yang Anda buat berdampak langsung pada kesuksesan mitra global kami.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Heart className="text-pink-500" />
            <h3 className="font-bold text-white">Radical Culture</h3>
            <p className="text-sm text-slate-400">Kami menghargai otonomi, transparansi radikal, dan pertumbuhan berkelanjutan sebagai prinsip inti tim kami.</p>
          </div>
        </section>

        <article className="prose prose-invert prose-slate max-w-none space-y-8 text-center py-12">
          <div className="p-12 rounded-[40px] bg-blue-600/10 border border-blue-500/20">
            <h2 className="text-white mt-0">Current Openings</h2>
            <p className="text-slate-400">
              Saat ini kami tidak membuka posisi aktif, namun kami selalu mencari talenta luar biasa. 
              Kirimkan CV dan portofolio Anda ke <span className="text-blue-400 font-bold">muhzadit@gmail.com</span> untuk pertimbangan di masa depan.
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  );
}
