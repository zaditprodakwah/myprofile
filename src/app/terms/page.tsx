import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Scale, ShieldAlert, Heart, FileText, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Ethics, Terms & AI Disclosure | Zadit Hub",
  description: "Our commitment to ethical AI synthesis, content attribution, and transparency.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#020617] pt-32 pb-24 px-6">
      <Header />
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500">
            <Scale size={14} /> Ethics & Transparency
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">Intelligence Integrity</h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Zadit Intelligence Hub berkomitmen pada transparansi penuh dalam penggunaan AI 
            dan penghormatan terhadap kekayaan intelektual sumber informasi kami.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white/2 border border-white/5 space-y-4">
            <ShieldAlert className="text-blue-500" size={32} />
            <h3 className="text-xl font-bold text-white">AI Disclosure</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Semua ringkasan, analisis, dan take-away strategis di platform ini dihasilkan 
              oleh Zadit Synthesis Engine (Multi-LLM Hybrid). Kami memverifikasi output untuk 
              akurasi, namun AI dapat menghasilkan halusinasi. Selalu verifikasi data kritis.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white/2 border border-white/5 space-y-4">
            <Heart className="text-rose-500" size={32} />
            <h3 className="text-xl font-bold text-white">Content Ethics</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Radar kami tidak melakukan copypasta. Kami menggunakan teknik synthesis untuk 
              menambah nilai (strategic framing). Kami selalu menyertakan link ke sumber primer 
              dan menghimbau pembaca untuk mengunjungi artikel asli.
            </p>
          </div>
        </div>

        <section className="prose prose-invert prose-lg max-w-none space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <FileText className="text-slate-500" /> Terms of Service
            </h2>
            <p className="text-slate-400 text-sm">Last Updated: May 2026</p>
          </div>

          <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
            <h4 className="text-white font-bold">1. Akses Informasi</h4>
            <p>
              Penggunaan Zadit Intelligence Hub diperuntukkan bagi tujuan edukasi dan referensi strategis. 
              Kami tidak bertanggung jawab atas kerugian bisnis yang diakibatkan oleh keputusan yang 
              diambil berdasarkan analisis radar kami.
            </p>

            <h4 className="text-white font-bold">2. Hak Cipta & Atribusi</h4>
            <p>
              Kami menghormati DMCA dan hak cipta. Jika Anda adalah pemilik konten yang kami bahas 
              dan ingin kami menghapus atau menyesuaikan atribusi, silakan hubungi tim kami segera. 
              Tautan ke sumber asli selalu merupakan prioritas utama kami.
            </p>

            <h4 className="text-white font-bold">3. Disclaimer Akademik</h4>
            <p>
              Bagi pengguna di segmen Akademik: Gunakan synthesis kami sebagai titik awal riset. 
              Jangan gunakan ringkasan AI sebagai kutipan langsung tanpa memverifikasi sumber primer.
            </p>

            <h4 className="text-white font-bold">4. Reader Mode Disclosure</h4>
            <p>
              Fitur 'Reader Mode' pada Zadit Radar dirancang untuk mempermudah konsumsi informasi dengan membersihkan gangguan visual (iklan/pelacak). 
              Ini bukan pengganti kunjungan ke situs sumber. Kami tetap mendorong Anda untuk mendukung penerbit asli dengan mengunjungi tautan yang tersedia.
            </p>
          </div>
        </section>

        <footer className="pt-12 border-t border-white/5 text-center">
          <p className="text-xs text-slate-600 font-medium">
            Contact Ethics Officer: <span className="text-blue-500 underline cursor-pointer">ethics@zadit.dev</span>
          </p>
        </footer>
      </div>
      <Footer />
    </main>
  );
}
