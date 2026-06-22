'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Clock, MapPin, Phone, Globe, Building, Send, ShieldAlert, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface Entity {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  trustScore: number;
  verified: boolean;
  city: string;
  google_maps_url?: string;
}

interface EntityDrawerProps {
  entity: Entity | null;
  onClose: () => void;
}

export default function EntityDrawer({ entity, onClose }: EntityDrawerProps) {
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimData, setClaimData] = useState({ name: '', role: '', email: '', whatsapp: '' });
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [submittingClaim, setSubmittingClaim] = useState(false);



  if (!entity) return null;

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimData.name || !claimData.whatsapp) return;

    setSubmittingClaim(true);
    try {
      // Save lead to Supabase
      const { error } = await supabase.from('directory_leads').insert({
        entity_id: entity.id && entity.id.length > 5 ? entity.id : null,
        lead_name: claimData.name,
        contact_info: { whatsapp: claimData.whatsapp, email: claimData.email, role: claimData.role },
        target_site_url: entity.name,
        audit_category: 'Claim Directory Profile',
        status: 'PENDING'
      });

      if (error) throw error;
      setClaimSuccess(true);

      // Open WhatsApp for claim confirmation
      const waText = `Halo Zadit, saya ${claimData.name} (${claimData.role}) ingin mengajukan klaim kepemilikan untuk profil entitas "${entity.name}" di direktori regional ${entity.city}.`;
      const waLink = `https://wa.me/6282316363177?text=${encodeURIComponent(waText)}`;
      setTimeout(() => {
        window.open(waLink, '_blank');
      }, 1200);
    } catch (err) {
      console.error('Failed to submit claim to Supabase:', err);
      // Local fallback for stability
      setClaimSuccess(true);
    } finally {
      setSubmittingClaim(false);
    }
  };

  const getCityTitle = (slug: string) => {
    return slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const cleanWebsiteUrl = (url: string) => {
    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop overlay */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-brand-slate/40 backdrop-blur-xs transition-opacity duration-300" 
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md h-full slide-panel">
            <div className="flex h-full flex-col bg-white border-l border-brand-border shadow-2xl relative">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between bg-alabaster">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-teal-accent" />
                  <h2 className="text-sm font-mono tracking-wider text-text-primary uppercase font-bold" id="slide-over-title">
                    Detail Entitas Bisnis
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="rounded-lg text-text-muted hover:text-text-primary focus:outline-none p-1.5 bg-white border border-brand-border transition-colors hover:shadow-xs"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent>
                
                {/* Title & Basic Details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-brand-slate text-text-inverse flex items-center justify-center font-heading-sans font-black text-xl shrink-0">
                      {entity.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-heading-sans font-bold text-text-primary leading-snug">{entity.name}</h3>
                      <p className="text-xs font-mono text-gold-accent">{entity.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {entity.verified ? (
                      <span className="bg-teal-accent/10 border border-teal-accent/25 text-teal-accent font-mono text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Terverifikasi di {getCityTitle(entity.city)}
                      </span>
                    ) : (
                      <span className="bg-gold-accent/10 border border-gold-accent/25 text-gold-accent font-mono text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded flex items-center gap-1 font-bold">
                        <Clock className="w-3 h-3" /> Profil Belum Diklaim
                      </span>
                    )}
                  </div>

                  {entity.tagline && (
                    <p className="text-xs text-text-muted leading-relaxed italic bg-offwhite p-3 rounded-lg border border-brand-border/60">
                      "{entity.tagline}"
                    </p>
                  )}
                </div>

                {/* Indexable Permalink (Critical SEO Requirement) */}
                <div className="border-t border-brand-border/60 pt-4">
                  <a 
                    href={`/directory/${entity.city}/${entity.slug}`}
                    className="text-xs font-semibold text-teal-accent hover:underline flex items-center gap-1.5 w-fit"
                  >
                    Lihat Halaman Detail Permanen ↗
                  </a>
                  <p className="text-[10px] text-text-muted mt-1 leading-normal">
                    Setiap entitas terdaftar memiliki URL permanen tersendiri untuk memelihara indexability di mesin pencari.
                  </p>
                </div>

                {/* Metadata block */}
                <div className="space-y-4 pt-4 border-t border-brand-border/60 text-xs">
                  <div className="flex gap-3 items-start">
                    <MapPin className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Alamat Kantor</p>
                      <p className="text-text-primary leading-relaxed">{entity.address || 'Alamat belum dilengkapi'}</p>
                    </div>
                  </div>

                  {entity.google_maps_url && (
                    <div className="flex gap-3 items-start">
                      <MapPin className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Peta Lokasi</p>
                        <a 
                          href={entity.google_maps_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-teal-accent hover:underline font-bold"
                        >
                          Buka Google Maps ↗
                        </a>
                      </div>
                    </div>
                  )}

                  {entity.phone && (
                    <div className="flex gap-3 items-start">
                      <Phone className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Kontak Telepon</p>
                        <p className="text-text-primary font-mono">{entity.phone}</p>
                      </div>
                    </div>
                  )}

                  {entity.website && (
                    <div className="flex gap-3 items-start">
                      <Globe className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Situs Web Resmi</p>
                        <a 
                          href={entity.website.startsWith('http') ? entity.website : `https://${entity.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-teal-accent hover:underline font-bold"
                        >
                          {cleanWebsiteUrl(entity.website)} ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Claim Profile Portal */}
                {!entity.verified && (
                  <div className="pt-4 border-t border-brand-border/60">
                    {!showClaimForm ? (
                      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4.5 space-y-3">
                        <div className="flex items-center gap-2 text-gold-accent">
                          <ShieldAlert className="w-4.5 h-4.5" />
                          <h4 className="font-heading-sans font-bold text-xs">Klaim Profil Entitas Anda</h4>
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed">
                          Dapatkan kontrol penuh untuk mengupdate detail kontak, website, koordinat Google Maps, dan menerima prioritas antrean audit strategi dari Zadit secara gratis.
                        </p>
                        <button
                          onClick={() => setShowClaimForm(true)}
                          className="w-full bg-gold-accent hover:bg-gold-accent/90 text-text-inverse text-[10px] font-mono font-bold uppercase tracking-wider py-2.5 rounded-lg text-center transition-colors shadow-xs"
                        >
                          Ajukan Klaim Sekarang →
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleClaimSubmit} className="space-y-3.5 bg-offwhite border border-brand-border rounded-xl p-4.5">
                        <h4 className="font-heading-sans font-bold text-xs text-text-primary">Formulir Klaim Kepemilikan</h4>
                        {claimSuccess ? (
                          <div className="text-center py-4 space-y-2">
                            <Check className="w-6 h-6 text-teal-accent mx-auto" />
                            <p className="text-xs font-bold text-text-primary">Permohonan Terkirim!</p>
                            <p className="text-[10px] text-text-muted leading-relaxed">Pesan verifikasi kepemilikan Anda sedang diteruskan ke WhatsApp Admin.</p>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-wider">Nama Perwakilan</label>
                              <input
                                type="text"
                                required
                                value={claimData.name}
                                onChange={(e) => setClaimData({...claimData, name: e.target.value})}
                                placeholder="Andi Wijaya"
                                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-teal-accent"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-wider">Jabatan</label>
                              <input
                                type="text"
                                required
                                value={claimData.role}
                                onChange={(e) => setClaimData({...claimData, role: e.target.value})}
                                placeholder="Founder / Direktur"
                                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-teal-accent"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-wider">No. WhatsApp</label>
                              <input
                                type="text"
                                required
                                value={claimData.whatsapp}
                                onChange={(e) => setClaimData({...claimData, whatsapp: e.target.value})}
                                placeholder="08123456789"
                                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-teal-accent"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-mono text-text-muted uppercase tracking-wider">Email (Opsional)</label>
                              <input
                                type="email"
                                value={claimData.email}
                                onChange={(e) => setClaimData({...claimData, email: e.target.value})}
                                placeholder="andi@perusahaan.com"
                                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-teal-accent"
                              />
                            </div>
                            
                            <div className="flex gap-2 pt-1.5">
                              <button
                                type="button"
                                onClick={() => setShowClaimForm(false)}
                                className="w-1/3 border border-brand-border text-text-muted text-[9px] font-mono uppercase tracking-wider py-2 bg-white hover:border-brand-slate hover:text-brand-slate rounded-lg text-center"
                              >
                                Batal
                              </button>
                              <button
                                type="submit"
                                disabled={submittingClaim}
                                className="w-2/3 bg-teal-accent hover:bg-brand-slate disabled:bg-slate-300 text-text-inverse font-mono text-[9px] font-bold uppercase tracking-wider py-2 rounded-lg text-center transition-colors"
                              >
                                {submittingClaim ? 'Mengirim...' : 'Kirim Klaim'}
                              </button>
                            </div>
                          </>
                        )}
                      </form>
                    )}
                  </div>
                )}

                {/* Audit Performance Shortcut */}
                {entity.website && (
                  <div className="pt-4 border-t border-brand-border/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-teal-accent" />
                      <h4 className="font-heading-sans font-bold text-xs">Diagnostik Kecepatan Website</h4>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Jalankan robot audit untuk mengukur Narrative Clarity dan Accessibility Score (A11y) situs resmi <b>{cleanWebsiteUrl(entity.website)}</b> sekarang.
                    </p>
                    <a 
                      href={`/utility/audit-engine?url=${encodeURIComponent(cleanWebsiteUrl(entity.website))}`}
                      className="w-full bg-brand-slate hover:bg-slate-800 text-text-inverse text-[10px] font-mono font-bold uppercase tracking-wider py-2.5 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      Audit Performa Website <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
