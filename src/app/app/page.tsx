'use client';

import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarNav from "@/components/SidebarNav";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Clock, Zap, Shield, ArrowRight, Activity, Globe, MessageSquare, AlertCircle } from 'lucide-react';
import EntityDrawer, { Entity } from "@/components/EntityDrawer";
import { cn } from "@/lib/utils";

export default function OperationalDashboard() {
  const [stats, setStats] = useState({ totalClaims: 0, pendingClaims: 0, totalAudits: 0, systemHealth: 'Optimal' });
  const [activities, setActivities] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  // Fetch real data from Supabase
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Get claims count
        const { count: totalClaims } = await supabase.from('directory_leads').select('*', { count: 'exact', head: true });
        const { count: pendingClaims } = await supabase.from('directory_leads').select('*', { count: 'exact', head: true }).eq('status', 'PENDING');
        
        // Get audits count
        const { count: totalAudits } = await supabase.from('utility_leads').select('*', { count: 'exact', head: true });

        setStats({
          totalClaims: totalClaims || 0,
          pendingClaims: pendingClaims || 0,
          totalAudits: totalAudits || 0,
          systemHealth: 'Optimal'
        });

        // Load recent activity stream (Directory leads & Utility leads combined)
        const { data: claimsData } = await supabase
          .from('directory_leads')
          .select('id, lead_name, target_site_url, status, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        const { data: auditsData } = await supabase
          .from('utility_leads')
          .select('id, lead_name, target_site_url, accessibility_score, status, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        const claimsList = (claimsData || []).map(item => ({
          id: item.id,
          type: 'claim',
          title: `Klaim Profil: ${item.target_site_url}`,
          user: item.lead_name,
          details: `Mengajukan verifikasi hak akses kepemilikan`,
          status: item.status,
          date: new Date(item.created_at),
          raw: item
        }));

        const auditsList = (auditsData || []).map(item => ({
          id: item.id,
          type: 'audit',
          title: `Audit Website: ${item.target_site_url}`,
          user: item.lead_name,
          details: `Skor Aksesibilitas (A11y): ${item.accessibility_score || 0}/100`,
          status: item.status || 'SUCCESS',
          date: new Date(item.created_at),
          raw: item
        }));

        const combined = [...claimsList, ...auditsList].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
        setActivities(combined);

      } catch (err) {
        console.error('Failed to load operational dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Filter activities list based on metric card click dynamically via useMemo
  const filteredActivities = React.useMemo(() => {
    if (activeFilter === 'All') {
      return activities;
    } else if (activeFilter === 'Claims') {
      return activities.filter(a => a.type === 'claim');
    } else if (activeFilter === 'Audits') {
      return activities.filter(a => a.type === 'audit');
    }
    return activities;
  }, [activeFilter, activities]);

  // Click activity stream triggers dynamic EntityDrawer fetch
  const handleActivityClick = async (act: any) => {
    // If it's a claim or audit related to a domain/name, look up entity from directory_entities
    try {
      const searchTarget = act.raw.target_site_url;
      const { data } = await supabase
        .from('directory_entities')
        .select('*')
        .or(`name.ilike.%${searchTarget}%,website_url.ilike.%${searchTarget}%`)
        .limit(1)
        .maybeSingle();

      if (data) {
        const formattedEntity: Entity = {
          id: String(data.id || ''),
          name: String(data.name || ''),
          slug: String(data.slug || ''),
          category: data.entity_type === 'agency' ? 'Agensi / Kemitraan' : 'Layanan / Lembaga',
          tagline: String(data.tagline || data.description || ''),
          address: String(data.raw_metadata?.address || 'Alamat terdaftar'),
          phone: String(data.contact_phone || ''),
          email: String(data.contact_email || ''),
          website: String(data.website_url || ''),
          trustScore: Number(data.trust_score || 4.0),
          verified: data.verification_status === 'VERIFIED',
          city: String(data.city_slug || 'jakarta-selatan'),
          google_maps_url: data.google_maps_url ? String(data.google_maps_url) : undefined
        };
        setSelectedEntity(formattedEntity);
      } else {
        // Fallback mockup entity so the UI loads cleanly
        setSelectedEntity({
          id: 'temp-entity-id',
          name: act.raw.target_site_url || act.user,
          slug: 'temporary-slug',
          category: act.type === 'claim' ? 'Klaim Menunggu Validasi' : 'Website Audit',
          tagline: `Aktivitas tercatat oleh ${act.user}`,
          address: 'Data tersimpan di Supabase Leads',
          phone: '',
          email: '',
          website: act.raw.target_site_url,
          trustScore: 4.0,
          verified: false,
          city: 'jakarta-selatan'
        });
      }
    } catch (err) {
      console.error('Error fetching associated entity for activity drawer:', err);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header title */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">Operational Control Center</span>
              <h1 className="text-3xl font-heading-serif font-bold text-text-primary">Dashboard Operasional</h1>
            </div>
            <div className="bg-white border border-brand-border px-4 py-2 rounded-xl text-xs font-mono text-text-muted flex items-center gap-2 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-accent pulse-badge" /> Status Sistem: {stats.systemHealth}
            </div>
          </div>

          {/* Metric Cards Grid (Filters activities list on click) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div 
              onClick={() => setActiveFilter('All')}
              className={cn(
                "bg-white border p-5 rounded-2xl cursor-pointer hover:shadow-md transition-all shadow-xs",
                activeFilter === 'All' ? "border-teal-accent border-l-4 border-l-teal-accent bg-teal-50/20" : "border-brand-border"
              )}
            >
              <div className="flex justify-between items-start text-text-muted">
                <span className="text-[10px] font-mono uppercase tracking-wider">Aktivitas Sistem</span>
                <Activity className="w-4 h-4 text-teal-accent" />
              </div>
              <p className="text-2xl font-bold font-mono text-text-primary mt-3">{activities.length}</p>
              <p className="text-[10px] text-text-muted mt-1">Total log terbaru dipantau</p>
            </div>

            <div 
              onClick={() => setActiveFilter('Claims')}
              className={cn(
                "bg-white border p-5 rounded-2xl cursor-pointer hover:shadow-md transition-all shadow-xs",
                activeFilter === 'Claims' ? "border-teal-accent border-l-4 border-l-teal-accent bg-teal-50/20" : "border-brand-border"
              )}
            >
              <div className="flex justify-between items-start text-text-muted">
                <span className="text-[10px] font-mono uppercase tracking-wider">Permohonan Klaim</span>
                <Shield className="w-4 h-4 text-teal-accent" />
              </div>
              <p className="text-2xl font-bold font-mono text-text-primary mt-3">{stats.totalClaims}</p>
              <p className="text-[10px] text-text-muted mt-1">{stats.pendingClaims} Menunggu validasi admin</p>
            </div>

            <div 
              onClick={() => setActiveFilter('Audits')}
              className={cn(
                "bg-white border p-5 rounded-2xl cursor-pointer hover:shadow-md transition-all shadow-xs",
                activeFilter === 'Audits' ? "border-teal-accent border-l-4 border-l-teal-accent bg-teal-50/20" : "border-brand-border"
              )}
            >
              <div className="flex justify-between items-start text-text-muted">
                <span className="text-[10px] font-mono uppercase tracking-wider">Audit Website</span>
                <Zap className="w-4 h-4 text-teal-accent" />
              </div>
              <p className="text-2xl font-bold font-mono text-text-primary mt-3">{stats.totalAudits}</p>
              <p className="text-[10px] text-text-muted mt-1">Laporan optimasi CWV berjalan</p>
            </div>

            <div className="bg-white border border-brand-border p-5 rounded-2xl shadow-xs">
              <div className="flex justify-between items-start text-text-muted">
                <span className="text-[10px] font-mono uppercase tracking-wider">Situs Web Integrasi</span>
                <Globe className="w-4 h-4 text-teal-accent" />
              </div>
              <p className="text-2xl font-bold font-mono text-text-primary mt-3">2/2</p>
              <p className="text-[10px] text-text-muted mt-1">Xendit API & Supabase Terhubung</p>
            </div>

          </div>

          {/* Main Area: Stream Logs list */}
          <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
              <CheckCircle className="w-4.5 h-4.5 text-teal-accent" />
              <h3 className="font-heading-sans font-bold text-sm text-text-primary uppercase tracking-wide">
                Stream Log Aktivitas ({activeFilter === 'All' ? 'Semua' : activeFilter === 'Claims' ? 'Klaim' : 'Audit'})
              </h3>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-14 bg-offwhite animate-pulse border border-brand-border rounded-xl" />
                ))}
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <AlertCircle className="w-6 h-6 text-gold-accent mx-auto" />
                <p className="text-xs font-bold text-text-primary">Tidak Ada Aktivitas Tercatat</p>
                <p className="text-[10px] text-text-muted">Belum ada log logistik data lead masuk.</p>
              </div>
            ) : (
              <div className="divide-y divide-brand-border/60">
                {filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => handleActivityClick(act)}
                    className="py-4 flex justify-between items-center hover:bg-offwhite/40 cursor-pointer px-2 rounded-xl transition-all group"
                  >
                    <div className="space-y-1 pr-4 max-w-[80%]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs text-text-primary group-hover:text-teal-accent transition-colors leading-tight">
                          {act.title}
                        </span>
                        <span className={cn(
                          "text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0",
                          act.type === 'claim' ? "bg-blue-50 text-blue-700" : "bg-teal-50 text-teal-700"
                        )}>
                          {act.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed">
                        Diajukan oleh: <b className="text-text-primary">{act.user}</b> — {act.details}
                      </p>
                    </div>

                    <div className="text-right shrink-0 space-y-1.5">
                      <span className="text-[9px] font-mono text-text-muted block">
                        {act.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} {act.date.toLocaleTimeString().split(' ')[0]}
                      </span>
                      <span className={cn(
                        "text-[8px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase",
                        act.status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-teal-50 text-teal-700 border-teal-100"
                      )}>
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Dynamic Drawer detail */}
      <EntityDrawer
        key={selectedEntity?.id || 'none'}
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
      />

      <SidebarNav />
      <Footer />
    </>
  );
}
