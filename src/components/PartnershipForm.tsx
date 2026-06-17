'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, Check, Send } from 'lucide-react';

const roles = [
  { id: 'business_owner', label: 'Pemilik Bisnis / UMKM' },
  { id: 'hrd_recruiter', label: 'HRD / Headhunter / Recruiter' },
  { id: 'investor_partner', label: 'Investor / Mitra Institusional' },
  { id: 'gov_agency', label: 'Lembaga Pemerintah / Yayasan' },
];

const needs = [
  { id: 'web_ecosystem', label: 'Website / Ekosistem Web Informatif' },
  { id: 'seo_aeo_marketing', label: 'SEO & Konten AEO/GEO Marketing' },
  { id: 'executive_doc', label: 'Slide Presentasi & Dokumen Eksekutif' },
  { id: 'analytics_audit', label: 'Analytics & Growth Audit Portal' },
];

export default function PartnershipForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    need: [] as string[],
    projectDescription: '',
    name: '',
    whatsapp: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleRoleSelect = (roleId: string) => {
    setFormData((prev) => ({ ...prev, role: roleId }));
    setTimeout(() => nextStep(), 300); // Auto-advance for better UX
  };

  const handleNeedToggle = (needId: string) => {
    setFormData((prev) => {
      const selected = prev.need.includes(needId)
        ? prev.need.filter((n) => n !== needId)
        : [...prev.need, needId];
      return { ...prev, need: selected };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) {
      setErrorMsg('Nama dan WhatsApp wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        // Prepare pre-filled WhatsApp link
        const whatsappText = `Halo Zadit, saya ${formData.name}. Saya baru saja mengisi formulir kemitraan di portofolio Anda untuk kebutuhan ${formData.need.map(n => needs.find(x => x.id === n)?.label || n).join(', ')}. Mari jadwalkan sesi diskusi singkat!`;
        const waLink = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappText)}`;
        
        // Timeout to redirect to WhatsApp for quick follow up
        setTimeout(() => {
          window.open(waLink, '_blank');
        }, 1500);
      } else {
        throw new Error('Gagal mengirim formulir');
      }
    } catch (err) {
      setErrorMsg('Gagal mengirimkan pengajuan. Silakan hubungi Zadit secara langsung.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-brand-slate py-24 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">// AJAK KEMITRAAN</span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-inverse mt-2">
            Mari Bangun Sistem Bersama
          </h2>
          <p className="text-text-muted mt-4">
            Formulir diagnosis singkat kemitraan. Isi dalam 60 detik untuk mendapatkan rekomendasi awal langsung dari Zadit.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-brand-mid/40 border border-brand-border rounded-2xl p-8 shadow-xl min-h-[400px] flex flex-col justify-between">
          
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-brand-border/40">
            <span className="text-xs font-mono text-text-muted">LANGKAH {step} DARI 4</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <span
                  key={s}
                  className={cn(
                    "w-8 h-1 rounded-full transition-all",
                    step >= s ? "bg-teal-accent" : "bg-brand-border"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-grow flex items-center justify-center">
            
            {isSuccess ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-teal-accent/10 border border-teal-accent/30 text-teal-accent flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-text-inverse">Pengajuan Kemitraan Terkirim!</h3>
                <p className="text-sm text-text-muted max-w-md mx-auto">
                  Terima kasih, data Anda telah tersimpan dengan aman. Anda akan otomatis dialihkan ke WhatsApp untuk membuka saluran komunikasi langsung.
                </p>
              </div>
            ) : (
              <div className="w-full">
                
                {/* STEP 1: Role */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl font-heading font-bold text-text-inverse text-center">Siapakah representasi Anda?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roles.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleRoleSelect(r.id)}
                          className={cn(
                            "p-5 rounded-xl border text-left font-medium text-sm transition-all duration-200 bg-brand-slate/40",
                            formData.role === r.id
                              ? "border-teal-accent text-teal-accent shadow-[0_0_15px_rgba(13,148,136,0.15)]"
                              : "border-brand-border hover:border-teal-glow/50 text-text-inverse"
                          )}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Need */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-heading font-bold text-text-inverse text-center">Layanan apa yang Anda perlukan?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {needs.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => handleNeedToggle(n.id)}
                          className={cn(
                            "p-5 rounded-xl border text-left font-medium text-sm transition-all duration-200 bg-brand-slate/40 flex justify-between items-center",
                            formData.need.includes(n.id)
                              ? "border-teal-accent text-teal-accent shadow-[0_0_15px_rgba(13,148,136,0.15)]"
                              : "border-brand-border hover:border-teal-glow/50 text-text-inverse"
                          )}
                        >
                          <span>{n.label}</span>
                          {formData.need.includes(n.id) && <Check className="w-4 h-4 text-teal-accent flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Description */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-heading font-bold text-text-inverse text-center">Ceritakan singkat tentang proyek Anda</h3>
                    <div className="max-w-lg mx-auto">
                      <textarea
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Detail target, jangka waktu, atau tantangan bisnis yang dihadapi..."
                        className="w-full bg-brand-slate border border-brand-border rounded-xl p-4 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Contact info */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-heading font-bold text-text-inverse text-center">Bagaimana cara terbaik menghubungi Anda?</h3>
                    <div className="max-w-md mx-auto space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Nama Lengkap</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Nama Anda"
                          required
                          className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Nomor WhatsApp Aktif</label>
                        <input
                          type="text"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          placeholder="Contoh: 08123456789"
                          required
                          className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Alamat Email (Opsional)</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nama@perusahaan.com"
                          className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      {errorMsg && <p className="text-xs text-red-400 mt-2 font-mono">{errorMsg}</p>}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Navigation Controls */}
          {!isSuccess && (
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-brand-border/40">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={cn(
                  "flex items-center gap-2 text-xs font-mono tracking-wider text-text-muted uppercase hover:text-text-inverse disabled:opacity-30 disabled:pointer-events-none transition-colors",
                  step === 1 && "invisible"
                )}
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={(step === 1 && !formData.role) || (step === 2 && formData.need.length === 0)}
                  className="flex items-center gap-2 bg-brand-border/40 border border-brand-border text-text-inverse text-xs font-mono tracking-wider uppercase px-5 py-2.5 rounded-xl hover:border-teal-glow transition-colors disabled:opacity-50"
                >
                  Lanjut <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-xl transition-all"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Kemitraan'} <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
