import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { ShieldAlert, Database, Key, CheckCircle } from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#020617] pt-32 pb-24">
      <Header />
      <div className="max-w-4xl mx-auto px-6 space-y-12 mb-32">
        <header className="space-y-4">
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/20">Security Standards</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white">Trust & Security</h1>
          <p className="text-slate-400 text-lg">Protokol perlindungan data tingkat tinggi untuk menjaga kerahasiaan informasi strategis Anda.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Database className="text-blue-500" />
            <h3 className="font-bold text-white">Data Encryption</h3>
            <p className="text-sm text-slate-400">Seluruh data yang disimpan dienkripsi menggunakan standar AES-256 baik saat dalam transit maupun saat istirahat.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <Key className="text-amber-500" />
            <h3 className="font-bold text-white">Access Control</h3>
            <p className="text-sm text-slate-400">Protokol autentikasi multi-faktor dan kontrol akses berbasis peran (RBAC) memastikan hanya personel yang berwenang yang dapat mengakses data.</p>
          </div>
        </section>

        <article className="prose prose-invert prose-slate max-w-none space-y-8">
          <h2>1. Infrastruktur Aman</h2>
          <p>
            Platform kami berjalan di atas infrastruktur cloud yang tersertifikasi SOC2 dan ISO 27001, 
            memastikan ketersediaan tinggi dan ketahanan terhadap serangan siber.
          </p>

          <h2>2. Audit Keamanan Berkala</h2>
          <p>
            Kami melakukan pemindaian kerentanan dan audit keamanan kode secara rutin untuk mengidentifikasi 
            dan memitigasi potensi risiko sebelum dapat dimanfaatkan.
          </p>

          <h2>3. Kepatuhan Privasi</h2>
          <p>
            Zadit Hub berkomitmen penuh untuk mematuhi regulasi perlindungan data global (GDPR) 
            dan lokal dalam setiap aspek operasional kami.
          </p>
        </article>
      </div>
      <Footer />
    </main>
  );
}
