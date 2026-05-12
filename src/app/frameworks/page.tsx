import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { LayoutGrid, Cpu, Globe, Rocket } from "lucide-react";

export default function FrameworksPage() {
  return (
    <main className="min-h-screen bg-[#020617] pt-32 pb-24">
      <Header />
      <div className="max-w-4xl mx-auto px-6 space-y-12 mb-32">
        <header className="space-y-4">
          <Badge variant="outline" className="text-blue-500 border-blue-500/20">Institutional Frameworks</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white">Structural Intelligence</h1>
          <p className="text-slate-400 text-lg">Metodologi standar industri yang kami gunakan untuk mengeksekusi setiap proyek dengan presisi tinggi.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <LayoutGrid className="text-blue-500" />
            <h3 className="font-bold text-white">Modular Architecture</h3>
            <p className="text-sm text-slate-400">Setiap solusi dibangun di atas komponen modular yang memungkinkan skalabilitas tanpa mengorbankan integritas sistem.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Cpu className="text-emerald-500" />
            <h3 className="font-bold text-white">AI-First Engineering</h3>
            <p className="text-sm text-slate-400">Mengintegrasikan model bahasa besar dan analitik prediktif langsung ke dalam inti alur kerja operasional.</p>
          </div>
        </section>

        <article className="prose prose-invert prose-slate max-w-none space-y-8">
          <h2>1. Discovery & Audit Framework</h2>
          <p>
            Sebelum eksekusi, kami melakukan audit mendalam terhadap aset digital dan struktur data yang ada 
            untuk mengidentifikasi hambatan teknis dan peluang pertumbuhan yang tersembunyi.
          </p>

          <h2>2. Strategic Mapping</h2>
          <p>
            Mencocokkan tantangan spesifik dengan solusi teknologi yang paling efektif, 
            memastikan ROI yang terukur melalui tracking KPI yang ketat.
          </p>

          <h2>3. Continuous Optimization</h2>
          <p>
            Siklus iterasi tanpa henti berdasarkan data *real-time* untuk menjaga performa sistem tetap pada puncak efisiensi.
          </p>
        </article>
      </div>
      <Footer />
    </main>
  );
}
