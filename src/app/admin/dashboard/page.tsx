'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Shield, Database, Cpu, Search, Settings, Check, RefreshCw, AlertCircle, Save, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'data' | 'ai' | 'seo' | 'config'>('data');

  // Leads Data
  const [utilityLeads, setUtilityLeads] = useState<any[]>([]);
  const [directoryLeads, setDirectoryLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // AI Prompt Settings
  const [aiModel, setAiModel] = useState('gemini-1.5-flash');
  const [systemPrompt, setSystemPrompt] = useState(
    'Kamu adalah SEO content writer ahli untuk pasar Indonesia. Tulis konten yang memenuhi E-E-A-T Google dengan struktur Definition-Lead...'
  );
  const [isSavingAI, setIsSavingAI] = useState(false);
  const [aiSaved, setAiSaved] = useState(false);

  // SEO Ops Settings
  const [indexUrl, setIndexUrl] = useState('');
  const [indexStatus, setIndexStatus] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);

  // Config Table Settings
  const [configs, setConfigs] = useState({
    siteUrl: 'https://zadit.dev',
    analyticsId: 'G-2CD1CPGEYF',
    indexNowKey: 'zadit_indexnow_key_2026',
    statusActive: 'AVAILABLE'
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  // Guard Auth Check
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify against ADMIN_SECRET_KEY or fallback
    const keyToCheck = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'zadit_growth_secret_2026';
    if (secretKey === keyToCheck) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Kunci rahasia tidak cocok. Silakan periksa kembali.');
    }
  };

  // Fetch Leads on Authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchLeads() {
      setIsLoadingLeads(true);
      try {
        const { data: uLeads } = await supabase
          .from('utility_leads')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: dLeads } = await supabase
          .from('directory_leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (uLeads) setUtilityLeads(uLeads);
        if (dLeads) setDirectoryLeads(dLeads);
      } catch (err) {
        console.error('Failed to load leads from Supabase', err);
      } finally {
        setIsLoadingLeads(false);
      }
    }

    fetchLeads();
  }, [isAuthenticated]);

  // Trigger Instant Indexing via API
  const handleIndexingTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indexUrl) return;

    setIsIndexing(true);
    setIndexStatus('');

    try {
      const res = await fetch('/api/index-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: indexUrl, type: 'URL_UPDATED' }),
      });

      if (res.ok) {
        setIndexStatus('Sukses: Sinyal indexing berhasil dikirim ke Google & IndexNow!');
      } else {
        const errText = await res.text();
        setIndexStatus(`Gagal: ${errText}`);
      }
    } catch (err) {
      setIndexStatus('Gagal mengirimkan permintaan indexing.');
      console.error(err);
    } finally {
      setIsIndexing(false);
    }
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAI(true);
    // Simulate API saving
    setTimeout(() => {
      setIsSavingAI(false);
      setAiSaved(true);
      setTimeout(() => setAiSaved(false), 2000);
    }, 800);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    // Simulate API saving
    setTimeout(() => {
      setIsSavingConfig(false);
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
    }, 800);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-brand-slate pt-32 pb-24 px-6 flex items-center justify-center min-h-[90vh]">
          <div className="bg-brand-mid/40 border border-brand-border rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <Shield className="w-10 h-10 text-gold-accent mx-auto" />
              <h1 className="text-xl font-heading font-bold text-text-inverse">Growth OS Admin Gate</h1>
              <p className="text-xs text-text-muted">Masukkan kunci rahasia administrator untuk membuka panel navigasi.</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Kunci Rahasia Admin"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all text-center"
                />
              </div>

              {authError && <p className="text-xs text-red-400 text-center font-mono">{authError}</p>}

              <button
                type="submit"
                className="w-full bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all"
              >
                Otentikasi Akses
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-brand-slate pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-mono text-gold-accent tracking-widest uppercase">// SYSTEM COMMAND CENTER</span>
              <h1 className="text-3xl font-heading font-extrabold text-text-inverse mt-1">Zadit Growth OS</h1>
            </div>
            <div className="flex gap-2">
              <span className="bg-teal-accent/10 border border-teal-accent/20 text-teal-glow font-mono text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 uppercase">
                <Check className="w-4 h-4" /> Sistem Aktif
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-brand-border/40 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('data')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all",
                activeTab === 'data'
                  ? "border-teal-accent text-teal-glow"
                  : "border-transparent text-text-muted hover:text-text-inverse"
              )}
            >
              <Database className="w-4 h-4" /> Data Registry
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all",
                activeTab === 'ai'
                  ? "border-teal-accent text-teal-glow"
                  : "border-transparent text-text-muted hover:text-text-inverse"
              )}
            >
              <Cpu className="w-4 h-4" /> AI Prompt Control
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all",
                activeTab === 'seo'
                  ? "border-teal-accent text-teal-glow"
                  : "border-transparent text-text-muted hover:text-text-inverse"
              )}
            >
              <Search className="w-4 h-4" /> SEO Indexing Ops
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all",
                activeTab === 'config'
                  ? "border-teal-accent text-teal-glow"
                  : "border-transparent text-text-muted hover:text-text-inverse"
              )}
            >
              <Settings className="w-4 h-4" /> System Config
            </button>
          </div>

          {/* Tab Contents */}
          <div className="bg-brand-mid/20 border border-brand-border rounded-2xl p-6 lg:p-8 min-h-[400px]">
            
            {/* DATA TAB */}
            {activeTab === 'data' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-text-inverse">Daftar Leads Kemitraan (Utility & Claim)</h3>
                  <p className="text-xs text-text-muted leading-relaxed">Berikut daftar prospek masuk dari formulir diagnostik web audit dan klaim direktori.</p>
                </div>

                {isLoadingLeads ? (
                  <div className="py-12 text-center text-text-muted font-mono text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Memuat data leads...
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Utility Audit Leads */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-gold-accent uppercase tracking-wider">// LEADS DIAGNOSTIK AUDIT ENGINE</h4>
                      <div className="overflow-x-auto border border-brand-border/60 rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-brand-slate text-text-inverse font-mono uppercase text-[10px] tracking-wider border-b border-brand-border/60">
                            <tr>
                              <th className="p-4">Nama</th>
                              <th className="p-4">Situs Web</th>
                              <th className="p-4">Skor A11y</th>
                              <th className="p-4">Skor Narasi</th>
                              <th className="p-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border/40">
                            {utilityLeads.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-4 text-center text-text-muted/60">Belum ada leads diagnostik masuk.</td>
                              </tr>
                            ) : (
                              utilityLeads.map((l, i) => (
                                <tr key={i} className="hover:bg-brand-mid/40">
                                  <td className="p-4 font-semibold text-text-inverse">{l.lead_name}</td>
                                  <td className="p-4">{l.target_site_url}</td>
                                  <td className="p-4 font-mono">{l.accessibility_score}/100</td>
                                  <td className="p-4 font-mono">{l.narrative_score}/100</td>
                                  <td className="p-4">
                                    <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded text-[10px] uppercase font-mono">{l.status}</span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Directory Claim Leads */}
                    <div className="space-y-2 pt-4">
                      <h4 className="text-xs font-mono text-gold-accent uppercase tracking-wider">// LEADS KLAIM DIREKTORI LOKAL</h4>
                      <div className="overflow-x-auto border border-brand-border/60 rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-brand-slate text-text-inverse font-mono uppercase text-[10px] tracking-wider border-b border-brand-border/60">
                            <tr>
                              <th className="p-4">Nama Prospek</th>
                              <th className="p-4">Nama Entitas</th>
                              <th className="p-4">Kontak Info</th>
                              <th className="p-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border/40">
                            {directoryLeads.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-4 text-center text-text-muted/60">Belum ada leads klaim direktori masuk.</td>
                              </tr>
                            ) : (
                              directoryLeads.map((l, i) => {
                                const contact = JSON.parse(l.contact_info || '{}');
                                return (
                                  <tr key={i} className="hover:bg-brand-mid/40">
                                    <td className="p-4 font-semibold text-text-inverse">{l.lead_name}</td>
                                    <td className="p-4">{l.target_site_url}</td>
                                    <td className="p-4 font-mono">WA: {contact.whatsapp} | Email: {contact.email || '-'}</td>
                                    <td className="p-4">
                                      <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded text-[10px] uppercase font-mono">{l.status}</span>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* AI CONTROL TAB */}
            {activeTab === 'ai' && (
              <form onSubmit={handleSaveAI} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-bold text-text-inverse">Konfigurasi Mesin Penulisan AI (AGC)</h3>
                  <p className="text-xs text-text-muted leading-relaxed">Atur model generator default dan instruksi sistem global untuk penulisan artikel otomatis blog.</p>
                </div>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Model Utama Penulisan</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none"
                    >
                      <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Cepat & Akurat)</option>
                      <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Kedalaman Analitik)</option>
                      <option value="groq-llama3">Groq Llama 3 8B (Sub-Second Latency)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Sistem Instruksi Global AI</label>
                    <textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={6}
                      className="w-full bg-brand-slate border border-brand-border rounded-xl p-4 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isSavingAI}
                      className="inline-flex items-center gap-2 bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
                    >
                      <Save className="w-4 h-4" /> {isSavingAI ? 'Menyimpan...' : 'Simpan Konfigurasi AI'}
                    </button>
                    {aiSaved && (
                      <span className="text-xs font-mono text-teal-glow flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Berhasil disimpan
                      </span>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* SEO TAB */}
            {activeTab === 'seo' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-bold text-text-inverse">SEO Operations & Google Indexing</h3>
                  <p className="text-xs text-text-muted leading-relaxed">Kirim sinyal update URL secara instan ke API Google Search Indexing dan IndexNow.</p>
                </div>

                <form onSubmit={handleIndexingTrigger} className="max-w-2xl bg-brand-slate/40 border border-brand-border rounded-xl p-6 space-y-4">
                  <h4 className="text-xs font-mono text-gold-accent uppercase tracking-wider">// INSTANT INDEXING TRIGGER</h4>
                  
                  <div>
                    <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">URL Target Indexing</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        required
                        value={indexUrl}
                        onChange={(e) => setIndexUrl(e.target.value)}
                        placeholder="https://zadit.dev/blog/artikel-baru"
                        className="flex-grow bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={isIndexing}
                        className="inline-flex items-center gap-2 bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading font-bold uppercase tracking-wider px-6 rounded-xl transition-all flex-shrink-0"
                      >
                        <Send className="w-4 h-4" /> {isIndexing ? 'Mengirim...' : 'Submit URL'}
                      </button>
                    </div>
                  </div>

                  {indexStatus && (
                    <div className={cn("p-4 rounded-lg border text-xs font-mono flex items-start gap-2", 
                      indexStatus.startsWith('Sukses') ? "bg-teal-accent/5 border-teal-accent/20 text-teal-glow" : "bg-red-400/5 border-red-400/20 text-red-400"
                    )}>
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{indexStatus}</span>
                    </div>
                  )}
                </form>

                <div className="max-w-2xl bg-brand-slate/20 border border-brand-border/40 rounded-xl p-6 space-y-2">
                  <h4 className="text-xs font-mono text-text-inverse uppercase tracking-wider">// TELEMETRY STATE MAP</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono text-text-muted pt-2">
                    <div>Sitemap URL: <span className="text-text-inverse">/sitemap.xml</span></div>
                    <div>Sitemap Engine: <span className="text-teal-glow">Dynamic Active</span></div>
                    <div>robots.txt State: <span className="text-text-inverse">AI-Optimized</span></div>
                    <div>API Indexing Key: <span className="text-teal-glow">JWT Key Loaded</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* CONFIG TAB */}
            {activeTab === 'config' && (
              <form onSubmit={handleSaveConfig} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-bold text-text-inverse">Sistem Konfigurasi Global</h3>
                  <p className="text-xs text-text-muted leading-relaxed">Kelola variabel dasar sistem yang memandu jalannya ekosistem portfolio.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Site URL Utama</label>
                    <input
                      type="text"
                      value={configs.siteUrl}
                      onChange={(e) => setConfigs({ ...configs, siteUrl: e.target.value })}
                      className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse focus:ring-2 focus:ring-teal-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Google Analytics ID</label>
                    <input
                      type="text"
                      value={configs.analyticsId}
                      onChange={(e) => setConfigs({ ...configs, analyticsId: e.target.value })}
                      className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse focus:ring-2 focus:ring-teal-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">IndexNow Protocol Key</label>
                    <input
                      type="text"
                      value={configs.indexNowKey}
                      onChange={(e) => setConfigs({ ...configs, indexNowKey: e.target.value })}
                      className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse focus:ring-2 focus:ring-teal-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Status Ketersediaan</label>
                    <select
                      value={configs.statusActive}
                      onChange={(e) => setConfigs({ ...configs, statusActive: e.target.value })}
                      className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse focus:ring-2 focus:ring-teal-accent"
                    >
                      <option value="AVAILABLE">AVAILABLE (Tersedia Proyek)</option>
                      <option value="BUSY">BUSY (Sedang Sibuk)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-brand-border/40">
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="inline-flex items-center gap-2 bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
                  >
                    <Save className="w-4 h-4" /> {isSavingConfig ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  {configSaved && (
                    <span className="text-xs font-mono text-teal-glow flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Berhasil disimpan
                    </span>
                  )}
                </div>
              </form>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
