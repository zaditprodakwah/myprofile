'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { 
  Shield, Database, Cpu, Search, Settings, Check, RefreshCw, 
  Save, Send, Plus, Trash2, Edit2, X, 
  Briefcase, MapPin, User, CheckCircle2, Upload
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Service, CaseStudy, City, Entity, Article, UtilityLead, DirectoryLead, ContactLead, SiteContent } from '@/lib/types';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'leads' | 'content' | 'portfolio' | 'directory' | 'blog' | 'seo' | 'config'>('leads');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: '', type: 'success' });

  // Sub-tabs
  const [leadsTab, setLeadsTab] = useState<'utility' | 'directory' | 'contact'>('utility');
  const [portfolioTab, setPortfolioTab] = useState<'services' | 'cases'>('services');
  const [seoDirTab, setSeoDirTab] = useState<'cities' | 'entities'>('cities');

  // Leads state
  const [utilityLeads, setUtilityLeads] = useState<UtilityLead[]>([]);
  const [directoryLeads, setDirectoryLeads] = useState<DirectoryLead[]>([]);
  const [contactLeads, setContactLeads] = useState<ContactLead[]>([]);

  // Site Content state
  const [siteContents, setSiteContents] = useState<SiteContent[]>([]);
  
  // Portfolio state
  const [services, setServices] = useState<Service[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  // Directory state
  const [cities, setCities] = useState<City[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [bulkJson, setBulkJson] = useState('');

  // Blog state
  const [articles, setArticles] = useState<Article[]>([]);
  const [rssFeedUrl, setRssFeedUrl] = useState('https://news.google.com/rss/search?q=seo+growth+marketing+indonesia&hl=id&gl=ID&ceid=ID:id');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState('');

  // System Configs state
  const [sysConfigs, setSysConfigs] = useState({
    whatsapp_number: '6282316363177',
    available_status: 'AVAILABLE',
    ai_prompt: '',
    site_title: '',
    analytics_id: '',
    rss_feeds: '[]',
    link_hijacks: '[]',
    sovereign_emergency_lock: 'false',
    sovereign_macro_fallback: '{}',
    sovereign_fiscal_fallback: '{}'
  });

  // Dynamic Forms State
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', icon_name: 'Globe', tags: '', display_order: 0, size: 'large', is_active: true
  });

  const [showCaseForm, setShowCaseForm] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [caseForm, setCaseForm] = useState({
    sector_badge: '', client_name: '', challenge: '', approach: '', metrics: '[]', testimonial_text: '', testimonial_author: '', testimonial_role: '', tech_tags: '', display_order: 0, is_active: true
  });

  const [showCityForm, setShowCityForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [cityForm, setCityForm] = useState({
    name: '', slug: '', latitude: 0.0, longitude: 0.0, target_niche: ''
  });

  const [showEntityForm, setShowEntityForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [entityForm, setEntityForm] = useState({
    city_slug: '', entity_type: 'service', name: '', slug: '', tagline: '', description: '', contact_phone: '', contact_email: '', website_url: '', logo_url: '', address: '', google_maps_url: '', verification_status: 'unverified', trust_score: 0.0, affiliate_url: ''
  });

  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '', slug: '', content: '', meta_title: '', meta_description: '', semantic_keywords: '', author_name: 'Muhammad Khoiruzzadittaqwa', is_published: true
  });

  // Helper: Show notification
  const triggerMessage = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage({ text: '', type: 'success' }), 4000);
  }, []);

  // Guard Auth Check — verifikasi via API server-side, bukan env publik
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: secretKey }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Kunci rahasia tidak cocok. Silakan periksa kembali.');
      }
    } catch {
      setAuthError('Koneksi ke server gagal.');
    }
  };

  // FETCH DATA FUNCTIONS
  const fetchLeads = useCallback(async () => {
    try {
      const { data: uLeads } = await supabase.from('utility_leads').select('*').order('created_at', { ascending: false });
      const { data: dLeads } = await supabase.from('directory_leads').select('*').order('created_at', { ascending: false });
      const { data: cLeads } = await supabase.from('contact_leads').select('*').order('created_at', { ascending: false });
      
      if (uLeads) setUtilityLeads(uLeads as UtilityLead[]);
      if (dLeads) setDirectoryLeads(dLeads as DirectoryLead[]);
      if (cLeads) setContactLeads(cLeads as ContactLead[]);
    } catch (err) {
      console.error('Leads fetch error', err);
    }
  }, []);

  const fetchSiteContent = useCallback(async () => {
    try {
      const { data } = await supabase.from('site_content').select('*').order('section_key');
      if (data) setSiteContents(data as SiteContent[]);
    } catch (err) {
      console.error('SiteContent fetch error', err);
    }
  }, []);

  const fetchPortfolio = useCallback(async () => {
    try {
      const { data: svcs } = await supabase.from('services').select('*').order('display_order');
      const { data: cases } = await supabase.from('case_studies').select('*').order('display_order');
      if (svcs) setServices(svcs as Service[]);
      if (cases) setCaseStudies(cases as CaseStudy[]);
    } catch (err) {
      console.error('Portfolio fetch error', err);
    }
  }, []);

  const fetchDirectory = useCallback(async () => {
    try {
      const { data: cts } = await supabase.from('cities').select('*').order('name');
      const { data: ents } = await supabase.from('entities').select('*').order('name');
      if (cts) setCities(cts as City[]);
      if (ents) setEntities(ents as Entity[]);
    } catch (err) {
      console.error('Directory fetch error', err);
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    try {
      const { data } = await supabase.from('articles').select('*').order('published_at', { ascending: false });
      if (data) setArticles(data as Article[]);
    } catch (err) {
      console.error('Articles fetch error', err);
    }
  }, []);

  const fetchConfigs = useCallback(async () => {
    try {
      const { data } = await supabase.from('system_configs').select('*');
      if (data) {
        const confObj = { ...sysConfigs };
        data.forEach((item) => {
          const k = item.key as keyof typeof sysConfigs;
          if (k in confObj) {
            confObj[k] = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
          }
        });
        setSysConfigs(confObj);
      }
    } catch (err) {
      console.error('Configs fetch error', err);
    }
  }, [sysConfigs]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setIsLoading(true);
      if (activeTab === 'leads') await fetchLeads();
      else if (activeTab === 'content') await fetchSiteContent();
      else if (activeTab === 'portfolio') await fetchPortfolio();
      else if (activeTab === 'directory') await fetchDirectory();
      else if (activeTab === 'blog') await fetchArticles();
      else if (activeTab === 'config') await fetchConfigs();
      setIsLoading(false);
    };

    loadData();
  }, [isAuthenticated, activeTab, fetchLeads, fetchSiteContent, fetchPortfolio, fetchDirectory, fetchArticles, fetchConfigs]);

  // LEADS STATUS MANAGEMENT
  const handleUpdateStatus = async (table: 'utility_leads' | 'directory_leads' | 'contact_leads', id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      
      triggerMessage(`Status lead berhasil diperbarui menjadi ${newStatus}`);
      await fetchLeads();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal update status', 'error');
    }
  };

  // SITE CONTENT CRUD
  const handleSaveSiteContent = async (key: string, val: string) => {
    try {
      const { error } = await supabase.from('site_content').upsert({ section_key: key, value: val }, { onConflict: 'section_key' });
      if (error) throw error;
      triggerMessage(`Konten [${key}] berhasil disimpan!`);
      await fetchSiteContent();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menyimpan konten', 'error');
    }
  };

  // SERVICES CRUD
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = serviceForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const svcPayload = {
        title: serviceForm.title,
        description: serviceForm.description,
        icon_name: serviceForm.icon_name,
        tags: tagsArray,
        display_order: Number(serviceForm.display_order),
        size: serviceForm.size,
        is_active: serviceForm.is_active
      };

      if (editingService) {
        const { error } = await supabase.from('services').update(svcPayload).eq('id', editingService.id);
        if (error) throw error;
        triggerMessage('Layanan berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('services').insert([svcPayload]);
        if (error) throw error;
        triggerMessage('Layanan baru ditambahkan!');
      }

      setServiceForm({ title: '', description: '', icon_name: 'Globe', tags: '', display_order: 0, size: 'large', is_active: true });
      setEditingService(null);
      setShowServiceForm(false);
      await fetchPortfolio();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menyimpan layanan', 'error');
    }
  };

  const handleEditService = (svc: Service) => {
    setEditingService(svc);
    setServiceForm({
      title: svc.title,
      description: svc.description,
      icon_name: svc.icon_name,
      tags: svc.tags.join(', '),
      display_order: svc.display_order,
      size: svc.size,
      is_active: svc.is_active
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Hapus layanan ini secara permanen?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      triggerMessage('Layanan berhasil dihapus');
      await fetchPortfolio();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menghapus layanan', 'error');
    }
  };

  // CASE STUDIES CRUD
  const handleCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedMetrics = JSON.parse(caseForm.metrics);
      const tagsArray = caseForm.tech_tags.split(',').map(t => t.trim()).filter(Boolean);
      const casePayload = {
        sector_badge: caseForm.sector_badge,
        client_name: caseForm.client_name,
        challenge: caseForm.challenge,
        approach: caseForm.approach,
        metrics: parsedMetrics,
        testimonial_text: caseForm.testimonial_text || null,
        testimonial_author: caseForm.testimonial_author || null,
        testimonial_role: caseForm.testimonial_role || null,
        tech_tags: tagsArray,
        display_order: Number(caseForm.display_order),
        is_active: caseForm.is_active
      };

      if (editingCase) {
        const { error } = await supabase.from('case_studies').update(casePayload).eq('id', editingCase.id);
        if (error) throw error;
        triggerMessage('Studi kasus diperbarui!');
      } else {
        const { error } = await supabase.from('case_studies').insert([casePayload]);
        if (error) throw error;
        triggerMessage('Studi kasus baru ditambahkan!');
      }

      setCaseForm({ sector_badge: '', client_name: '', challenge: '', approach: '', metrics: '[]', testimonial_text: '', testimonial_author: '', testimonial_role: '', tech_tags: '', display_order: 0, is_active: true });
      setEditingCase(null);
      setShowCaseForm(false);
      await fetchPortfolio();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menyimpan studi kasus. Pastikan format JSON metrics valid.', 'error');
    }
  };

  const handleEditCase = (cs: CaseStudy) => {
    setEditingCase(cs);
    setCaseForm({
      sector_badge: cs.sector_badge,
      client_name: cs.client_name,
      challenge: cs.challenge,
      approach: cs.approach,
      metrics: JSON.stringify(cs.metrics || []),
      testimonial_text: cs.testimonial_text || '',
      testimonial_author: cs.testimonial_author || '',
      testimonial_role: cs.testimonial_role || '',
      tech_tags: cs.tech_tags.join(', '),
      display_order: cs.display_order,
      is_active: cs.is_active
    });
    setShowCaseForm(true);
  };

  const handleDeleteCase = async (id: string) => {
    if (!confirm('Hapus studi kasus ini secara permanen?')) return;
    try {
      const { error } = await supabase.from('case_studies').delete().eq('id', id);
      if (error) throw error;
      triggerMessage('Studi kasus berhasil dihapus');
      await fetchPortfolio();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menghapus studi kasus', 'error');
    }
  };

  // CITIES CRUD
  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cityPayload = {
        name: cityForm.name,
        slug: cityForm.slug.toLowerCase().trim(),
        latitude: Number(cityForm.latitude),
        longitude: Number(cityForm.longitude),
        target_niche: cityForm.target_niche || null
      };

      if (editingCity) {
        const { error } = await supabase.from('cities').update(cityPayload).eq('id', editingCity.id);
        if (error) throw error;
        triggerMessage('Kota diperbarui!');
      } else {
        const { error } = await supabase.from('cities').insert([cityPayload]);
        if (error) throw error;
        triggerMessage('Kota baru ditambahkan!');
      }

      setCityForm({ name: '', slug: '', latitude: 0, longitude: 0, target_niche: '' });
      setEditingCity(null);
      setShowCityForm(false);
      await fetchDirectory();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menyimpan kota', 'error');
    }
  };

  const handleDeleteCity = async (id: string) => {
    if (!confirm('Hapus kota ini? Semua profil bisnis yang terhubung dengannya mungkin terpengaruh.')) return;
    try {
      const { error } = await supabase.from('cities').delete().eq('id', id);
      if (error) throw error;
      triggerMessage('Kota berhasil dihapus');
      await fetchDirectory();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menghapus kota', 'error');
    }
  };

  // ENTITIES CRUD
  const handleEntitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectCity = cities.find(c => c.slug === entityForm.city_slug.toLowerCase());
      const entPayload = {
        city_id: selectCity ? selectCity.id : null,
        city_slug: entityForm.city_slug.toLowerCase().trim(),
        entity_type: entityForm.entity_type as Entity['entity_type'],
        name: entityForm.name,
        slug: entityForm.slug.toLowerCase().trim(),
        tagline: entityForm.tagline || null,
        description: entityForm.description || null,
        contact_phone: entityForm.contact_phone || null,
        contact_email: entityForm.contact_email || null,
        website_url: entityForm.website_url || null,
        logo_url: entityForm.logo_url || null,
        address: entityForm.address || null,
        google_maps_url: entityForm.google_maps_url || null,
        verification_status: entityForm.verification_status as Entity['verification_status'],
        trust_score: Number(entityForm.trust_score),
        affiliate_url: entityForm.affiliate_url || null
      };

      if (editingEntity) {
        const { error } = await supabase.from('entities').update(entPayload).eq('id', editingEntity.id);
        if (error) throw error;
        triggerMessage('Entitas bisnis berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('entities').insert([entPayload]);
        if (error) throw error;
        triggerMessage('Entitas bisnis baru ditambahkan!');
      }

      setEntityForm({
        city_slug: '', entity_type: 'service', name: '', slug: '', tagline: '', description: '', contact_phone: '', contact_email: '', website_url: '', logo_url: '', address: '', google_maps_url: '', verification_status: 'unverified', trust_score: 0.0, affiliate_url: ''
      });
      setEditingEntity(null);
      setShowEntityForm(false);
      await fetchDirectory();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menyimpan entitas', 'error');
    }
  };

  const handleEditEntity = (ent: Entity) => {
    setEditingEntity(ent);
    setEntityForm({
      city_slug: ent.city_slug,
      entity_type: ent.entity_type,
      name: ent.name,
      slug: ent.slug,
      tagline: ent.tagline || '',
      description: ent.description || '',
      contact_phone: ent.contact_phone || '',
      contact_email: ent.contact_email || '',
      website_url: ent.website_url || '',
      logo_url: ent.logo_url || '',
      address: ent.address || '',
      google_maps_url: ent.google_maps_url || '',
      verification_status: ent.verification_status,
      trust_score: ent.trust_score,
      affiliate_url: ent.affiliate_url || ''
    });
    setShowEntityForm(true);
  };

  const handleDeleteEntity = async (id: string) => {
    if (!confirm('Hapus profil bisnis ini secara permanen?')) return;
    try {
      const { error } = await supabase.from('entities').delete().eq('id', id);
      if (error) throw error;
      triggerMessage('Profil bisnis berhasil dihapus');
      await fetchDirectory();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menghapus entitas', 'error');
    }
  };

  // BULK IMPORT
  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) {
        triggerMessage('Format harus berupa array JSON entitas!', 'error');
        return;
      }

      const cleanPayloads = parsed.map(item => ({
        city_slug: String(item.city_slug || '').toLowerCase().trim(),
        entity_type: String(item.entity_type || 'service'),
        name: String(item.name || ''),
        slug: String(item.slug || '').toLowerCase().trim() || String(item.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        tagline: item.tagline || null,
        description: item.description || null,
        contact_phone: item.contact_phone || null,
        contact_email: item.contact_email || null,
        website_url: item.website_url || null,
        logo_url: item.logo_url || null,
        address: item.address || null,
        google_maps_url: item.google_maps_url || null,
        verification_status: item.verification_status || 'unverified',
        trust_score: Number(item.trust_score || 0.0),
        affiliate_url: item.affiliate_url || null
      }));

      const { error } = await supabase.from('entities').insert(cleanPayloads);
      if (error) throw error;

      triggerMessage(`Sukses bulk import ${cleanPayloads.length} entitas bisnis!`);
      setBulkJson('');
      await fetchDirectory();
    } catch (err) {
      triggerMessage('Gagal bulk import: ' + ((err as Error).message || 'Format JSON tidak valid'), 'error');
    }
  };

  // BLOG ARTICLES CRUD
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const keywordsArray = articleForm.semantic_keywords.split(',').map(k => k.trim()).filter(Boolean);
      const articlePayload = {
        title: articleForm.title,
        slug: articleForm.slug.toLowerCase().trim(),
        content: articleForm.content,
        meta_title: articleForm.meta_title || null,
        meta_description: articleForm.meta_description || null,
        semantic_keywords: keywordsArray,
        author_name: articleForm.author_name,
        is_published: articleForm.is_published,
        published_at: editingArticle?.published_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingArticle) {
        const { error } = await supabase.from('articles').update(articlePayload).eq('id', editingArticle.id);
        if (error) throw error;
        triggerMessage('Artikel berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('articles').insert([articlePayload]);
        if (error) throw error;
        triggerMessage('Artikel baru berhasil diterbitkan!');
      }

      setArticleForm({ title: '', slug: '', content: '', meta_title: '', meta_description: '', semantic_keywords: '', author_name: 'Muhammad Khoiruzzadittaqwa', is_published: true });
      setEditingArticle(null);
      setShowArticleForm(false);
      await fetchArticles();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menyimpan artikel', 'error');
    }
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title,
      slug: art.slug,
      content: art.content,
      meta_title: art.meta_title || '',
      meta_description: art.meta_description || '',
      semantic_keywords: (art.semantic_keywords || []).join(', '),
      author_name: art.author_name || 'Muhammad Khoiruzzadittaqwa',
      is_published: art.is_published
    });
    setShowArticleForm(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Hapus artikel ini secara permanen?')) return;
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      triggerMessage('Artikel berhasil dihapus');
      await fetchArticles();
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menghapus artikel', 'error');
    }
  };

  // RSS INGEST AGC ACTION
  const handleTriggerScraper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScraping(true);
    setScrapeResult('');

    try {
      const res = await fetch('/api/agc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secretKey, feedUrl: rssFeedUrl })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Gagal scraping RSS feed.');
      }

      const data = await res.json();
      setScrapeResult(data.message || 'Scraping feed sukses dijalankan.');
      triggerMessage('Proses Ingest RSS Feed selesai!');
      await fetchArticles();
    } catch (err) {
      setScrapeResult('Error: ' + (err as Error).message);
      triggerMessage((err as Error).message, 'error');
    } finally {
      setIsScraping(false);
    }
  };

  // SYSTEM CONFIG SAVE
  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Loop values and save to Supabase system_configs
      const keys = Object.keys(sysConfigs) as Array<keyof typeof sysConfigs>;
      for (const k of keys) {
        const cleanVal: string = sysConfigs[k];
        let valToSave: any = cleanVal;
        if (k === 'available_status' || k === 'whatsapp_number' || k === 'site_title' || k === 'analytics_id' || k === 'sovereign_emergency_lock') {
          // Keep as string value inside json
          valToSave = cleanVal.trim();
        } else {
          try {
            if (cleanVal.startsWith('[') || cleanVal.startsWith('{')) {
              valToSave = JSON.parse(cleanVal);
            }
          } catch(e) {}
        }
        
        // Let supabase-js serialize valToSave natively (it handles primitive strings and objects appropriately for JSONB)
        const { error } = await supabase.from('system_configs').upsert({
          key: k,
          value: valToSave
        }, { onConflict: 'key' });
        
        if (error) throw error;
      }
      
      triggerMessage('Sistem konfigurasi global berhasil disimpan!');
    } catch (err) {
      triggerMessage((err as Error).message || 'Gagal menyimpan konfigurasi', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-alabaster pt-32 pb-24 px-6 flex items-center justify-center min-h-[90vh]">
          <div className="bg-white border border-brand-border rounded-2xl p-8 w-full max-w-md shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <Shield className="w-10 h-10 text-gold-accent mx-auto" />
              <h1 className="text-xl font-heading-serif font-bold text-text-primary">Growth OS Admin Gate</h1>
              <p className="text-xs text-text-muted">Masukkan kunci rahasia administrator untuk membuka panel navigasi.</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Kunci Rahasia Admin"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder-text-muted/65 focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all text-center"
                />
              </div>

              {authError && <p className="text-xs text-red-600 text-center font-mono">{authError}</p>}

              <button
                type="submit"
                className="w-full bg-teal-accent hover:bg-teal-glow text-white font-heading-sans font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-xs"
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
      <main className={`flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen ${sysConfigs.sovereign_emergency_lock === 'true' ? 'border-[4px] border-red-500/40 animate-pulse' : ''}`}>
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-mono text-gold-accent tracking-widest uppercase">{'// SYSTEM COMMAND CENTER'}</span>
              <h1 className="text-3xl font-heading-serif font-bold text-text-primary mt-1">Zadit Growth OS V2</h1>
            </div>
            <div className="flex gap-2">
              <span className="bg-teal-accent/10 border border-teal-accent/20 text-teal-accent font-mono text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 uppercase">
                <Check className="w-4 h-4" /> Mode Admin Aktif
              </span>
            </div>
          </div>

          {/* Action Message Banner */}
          {actionMessage.text && (
            <div className={cn(
              "p-4 rounded-xl border text-xs font-mono flex items-center gap-2.5 animate-fade-in",
              actionMessage.type === 'success' 
                ? "bg-teal-accent/5 border-teal-accent/25 text-teal-accent" 
                : "bg-red-500/5 border-red-500/25 text-red-600"
            )}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-brand-border gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('leads')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeTab === 'leads' ? "border-teal-accent text-teal-accent font-semibold" : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              <User className="w-4 h-4" /> Prospek Leads
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeTab === 'content' ? "border-teal-accent text-teal-accent font-semibold" : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              <Database className="w-4 h-4" /> Landing Page
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeTab === 'portfolio' ? "border-teal-accent text-teal-accent font-semibold" : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              <Briefcase className="w-4 h-4" /> Layanan & Portofolio
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeTab === 'directory' ? "border-teal-accent text-teal-accent font-semibold" : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              <MapPin className="w-4 h-4" /> Direktori pSEO
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeTab === 'blog' ? "border-teal-accent text-teal-accent font-semibold" : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              <Cpu className="w-4 h-4" /> Blog & AGC
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeTab === 'seo' ? "border-teal-accent text-teal-accent font-semibold" : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              <Search className="w-4 h-4" /> Indexing Ops
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeTab === 'config' ? "border-teal-accent text-teal-accent font-semibold" : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              <Settings className="w-4 h-4" /> Pengaturan Global
            </button>
          </div>

          {/* Main Dashboard Panel */}
          <div className="bg-white border border-brand-border rounded-2xl p-6 lg:p-8 shadow-sm min-h-[500px]">
            {isLoading && (
              <div className="py-24 text-center text-text-muted font-mono text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Sedang memperbarui data registry...
              </div>
            )}

            {!isLoading && (
              <>
                {/* 1. LEADS TAB */}
                {activeTab === 'leads' && (
                  <div className="space-y-6">
                    <div className="flex border-b border-brand-border gap-2 pb-2">
                      <button
                        onClick={() => setLeadsTab('utility')}
                        className={cn("px-4 py-2 font-mono text-xs uppercase rounded-lg", leadsTab === 'utility' ? "bg-brand-slate text-white" : "text-text-muted hover:bg-offwhite")}
                      >
                        Request Audit ({utilityLeads.length})
                      </button>
                      <button
                        onClick={() => setLeadsTab('directory')}
                        className={cn("px-4 py-2 font-mono text-xs uppercase rounded-lg", leadsTab === 'directory' ? "bg-brand-slate text-white" : "text-text-muted hover:bg-offwhite")}
                      >
                        Klaim Direktori ({directoryLeads.length})
                      </button>
                      <button
                        onClick={() => setLeadsTab('contact')}
                        className={cn("px-4 py-2 font-mono text-xs uppercase rounded-lg", leadsTab === 'contact' ? "bg-brand-slate text-white" : "text-text-muted hover:bg-offwhite")}
                      >
                        Kemitraan Wizard ({contactLeads.length})
                      </button>
                    </div>

                    {/* Utility Leads Table */}
                    {leadsTab === 'utility' && (
                      <div className="overflow-x-auto border border-brand-border rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-offwhite text-text-primary font-mono uppercase text-[10px] tracking-wider border-b border-brand-border">
                            <tr>
                              <th className="p-4">Nama</th>
                              <th className="p-4">WhatsApp / Email</th>
                              <th className="p-4">Target URL</th>
                              <th className="p-4">Waktu</th>
                              <th className="p-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                            {utilityLeads.length === 0 ? (
                              <tr><td colSpan={5} className="p-4 text-center">Belum ada permintaan audit.</td></tr>
                            ) : (
                              utilityLeads.map((l) => (
                                <tr key={l.id} className="hover:bg-offwhite/50">
                                  <td className="p-4 font-semibold text-text-primary">{l.lead_name}</td>
                                  <td className="p-4">
                                    WA: <a href={`https://wa.me/${l.contact_info.whatsapp}`} target="_blank" className="text-teal-accent hover:underline">{l.contact_info.whatsapp}</a>
                                    {l.contact_info.email && <div className="text-[10px] text-text-muted/70">{l.contact_info.email}</div>}
                                  </td>
                                  <td className="p-4">
                                    <a href={l.target_site_url} target="_blank" className="text-teal-accent hover:underline font-mono">{l.target_site_url}</a>
                                  </td>
                                  <td className="p-4 text-[10px] font-mono">{l.created_at ? new Date(l.created_at).toLocaleString('id-ID') : '-'}</td>
                                  <td className="p-4">
                                    <select
                                      value={l.status}
                                      onChange={(e) => handleUpdateStatus('utility_leads', l.id, e.target.value)}
                                      className={cn("bg-offwhite border border-brand-border rounded px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer outline-none focus:ring-1 focus:ring-teal-accent", 
                                        l.status === 'WON' ? "text-teal-accent font-bold" : l.status === 'CONTACTED' ? "text-blue-600 font-bold" : "text-gold-accent font-bold"
                                      )}
                                    >
                                      <option value="PENDING">PENDING</option>
                                      <option value="CONTACTED">CONTACTED</option>
                                      <option value="WON">WON</option>
                                    </select>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Directory Leads Table */}
                    {leadsTab === 'directory' && (
                      <div className="overflow-x-auto border border-brand-border rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-offwhite text-text-primary font-mono uppercase text-[10px] tracking-wider border-b border-brand-border">
                            <tr>
                              <th className="p-4">Nama Pengklaim</th>
                              <th className="p-4">Kontak / Jabatan</th>
                              <th className="p-4">Nama Entitas</th>
                              <th className="p-4">Waktu</th>
                              <th className="p-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                            {directoryLeads.length === 0 ? (
                              <tr><td colSpan={5} className="p-4 text-center">Belum ada klaim direktori.</td></tr>
                            ) : (
                              directoryLeads.map((l) => (
                                <tr key={l.id} className="hover:bg-offwhite/50">
                                  <td className="p-4 font-semibold text-text-primary">{l.lead_name}</td>
                                  <td className="p-4">
                                    WA: <a href={`https://wa.me/${l.contact_info.whatsapp}`} target="_blank" className="text-teal-accent hover:underline">{l.contact_info.whatsapp}</a>
                                    <div className="text-[10px] text-text-muted/70">{l.contact_info.role || 'Perwakilan'}</div>
                                    {l.contact_info.email && <div className="text-[10px] text-text-muted/70">{l.contact_info.email}</div>}
                                  </td>
                                  <td className="p-4 font-semibold">{l.target_site_url || 'Profil Direktori'}</td>
                                  <td className="p-4 text-[10px] font-mono">{l.created_at ? new Date(l.created_at).toLocaleString('id-ID') : '-'}</td>
                                  <td className="p-4">
                                    <select
                                      value={l.status}
                                      onChange={(e) => handleUpdateStatus('directory_leads', l.id, e.target.value)}
                                      className={cn("bg-offwhite border border-brand-border rounded px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer outline-none focus:ring-1 focus:ring-teal-accent", 
                                        l.status === 'WON' ? "text-teal-accent font-bold" : l.status === 'CONTACTED' ? "text-blue-600 font-bold" : "text-gold-accent font-bold"
                                      )}
                                    >
                                      <option value="PENDING">PENDING</option>
                                      <option value="CONTACTED">CONTACTED</option>
                                      <option value="WON">WON</option>
                                    </select>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Partnership Wizard Leads Table */}
                    {leadsTab === 'contact' && (
                      <div className="overflow-x-auto border border-brand-border rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-offwhite text-text-primary font-mono uppercase text-[10px] tracking-wider border-b border-brand-border">
                            <tr>
                              <th className="p-4">Nama Prospek</th>
                              <th className="p-4">Tipe & Kebutuhan</th>
                              <th className="p-4">Deskripsi Proyek</th>
                              <th className="p-4">Kontak</th>
                              <th className="p-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                            {contactLeads.length === 0 ? (
                              <tr><td colSpan={5} className="p-4 text-center">Belum ada pengajuan kemitraan dari wizard.</td></tr>
                            ) : (
                              contactLeads.map((l) => (
                                <tr key={l.id} className="hover:bg-offwhite/50">
                                  <td className="p-4 font-semibold text-text-primary">{l.lead_name}</td>
                                  <td className="p-4">
                                    <span className="bg-teal-accent/5 border border-teal-accent/15 px-2 py-0.5 rounded text-[10px] text-teal-accent font-mono uppercase">{l.visitor_type || 'Klien'}</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {(l.needs || []).map((n, idx) => (
                                        <span key={idx} className="bg-offwhite border border-brand-border px-1.5 py-0.2 rounded text-[8px] text-text-muted font-mono">{n}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-4 max-w-xs truncate" title={l.project_description}>{l.project_description || 'Tanpa keterangan tambahan'}</td>
                                  <td className="p-4">
                                    WA: <a href={`https://wa.me/${l.contact_info.whatsapp}`} target="_blank" className="text-teal-accent hover:underline">{l.contact_info.whatsapp}</a>
                                    {l.contact_info.email && <div className="text-[10px] text-text-muted/70">{l.contact_info.email}</div>}
                                  </td>
                                  <td className="p-4">
                                    <select
                                      value={l.status}
                                      onChange={(e) => handleUpdateStatus('contact_leads', l.id, e.target.value)}
                                      className={cn("bg-offwhite border border-brand-border rounded px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer outline-none focus:ring-1 focus:ring-teal-accent", 
                                        l.status === 'WON' ? "text-teal-accent font-bold" : l.status === 'CONTACTED' ? "text-blue-600 font-bold" : "text-gold-accent font-bold"
                                      )}
                                    >
                                      <option value="PENDING">PENDING</option>
                                      <option value="CONTACTED">CONTACTED</option>
                                      <option value="WON">WON</option>
                                    </select>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. LANDING PAGE CONTENT EDITOR */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-heading-serif font-bold text-text-primary">Kelola Konten Teks Landing Page</h3>
                      <p className="text-xs text-text-muted">Ubah copy utama situs web di bawah ini secara real-time tanpa perlu melakukan deploy ulang.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-4xl">
                      {siteContents.length === 0 ? (
                        <div className="p-4 border border-brand-border text-center text-xs text-text-muted font-mono rounded-xl">Memuat site_content default seeding...</div>
                      ) : (
                        siteContents.map((content) => (
                          <div key={content.id} className="bg-offwhite border border-brand-border rounded-2xl p-6 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-xs font-bold text-gold-accent uppercase">{content.section_key}</span>
                              <span className="text-[10px] font-mono text-text-muted uppercase">Tipe: {content.content_type}</span>
                            </div>
                            
                            <textarea
                              rows={3}
                              defaultValue={content.value}
                              id={`content-${content.section_key}`}
                              className="w-full bg-white border border-brand-border rounded-xl p-4 font-sans text-sm text-text-primary outline-none focus:ring-2 focus:ring-teal-accent focus:border-transparent transition-all leading-relaxed"
                            />

                            <div className="flex justify-end">
                              <button
                                onClick={() => {
                                  const textVal = (document.getElementById(`content-${content.section_key}`) as HTMLTextAreaElement)?.value || '';
                                  handleSaveSiteContent(content.section_key, textVal);
                                }}
                                className="inline-flex items-center gap-1.5 bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans font-bold uppercase tracking-wider px-5 py-2 rounded-xl text-[10px] transition-all cursor-pointer shadow-sm"
                              >
                                <Save className="w-3.5 h-3.5" /> Simpan Perubahan
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. LAYANAN & PORTFOLIO TAB */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-6">
                    <div className="flex border-b border-brand-border gap-2 pb-2 justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPortfolioTab('services')}
                          className={cn("px-4 py-2 font-mono text-xs uppercase rounded-lg", portfolioTab === 'services' ? "bg-brand-slate text-white" : "text-text-muted hover:bg-offwhite")}
                        >
                          Layanan Bento Grid ({services.length})
                        </button>
                        <button
                          onClick={() => setPortfolioTab('cases')}
                          className={cn("px-4 py-2 font-mono text-xs uppercase rounded-lg", portfolioTab === 'cases' ? "bg-brand-slate text-white" : "text-text-muted hover:bg-offwhite")}
                        >
                          Studi Kasus V2 ({caseStudies.length})
                        </button>
                      </div>

                      {portfolioTab === 'services' && (
                        <button
                          onClick={() => { setEditingService(null); setShowServiceForm(!showServiceForm); }}
                          className="inline-flex items-center gap-1 bg-teal-accent text-white text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah Layanan
                        </button>
                      )}

                      {portfolioTab === 'cases' && (
                        <button
                          onClick={() => { setEditingCase(null); setShowCaseForm(!showCaseForm); }}
                          className="inline-flex items-center gap-1 bg-teal-accent text-white text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah Studi Kasus
                        </button>
                      )}
                    </div>

                    {/* Services Form (Add/Edit) */}
                    {showServiceForm && (
                      <form onSubmit={handleServiceSubmit} className="bg-offwhite border border-brand-border p-6 rounded-2xl space-y-4 max-w-2xl animate-fade-in">
                        <div className="flex justify-between items-center border-b border-brand-border pb-2">
                          <h4 className="font-heading-sans font-bold text-xs uppercase text-gold-accent">{editingService ? '// Edit Layanan' : '// Tambah Layanan Baru'}</h4>
                          <button type="button" onClick={() => setShowServiceForm(false)} className="text-text-muted"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Judul Layanan</label>
                            <input
                              type="text"
                              required
                              value={serviceForm.title}
                              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Nama Ikon Lucide</label>
                            <input
                              type="text"
                              required
                              value={serviceForm.icon_name}
                              onChange={(e) => setServiceForm({ ...serviceForm, icon_name: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="Globe, BarChart3, Search, PenTool, FileText"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Deskripsi Layanan</label>
                            <textarea
                              required
                              rows={3}
                              value={serviceForm.description}
                              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl p-3 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Tags (Pisahkan Koma)</label>
                            <input
                              type="text"
                              value={serviceForm.tags}
                              onChange={(e) => setServiceForm({ ...serviceForm, tags: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="Next.js 16, TypeScript, Supabase"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Bento Size</label>
                              <select
                                value={serviceForm.size}
                                onChange={(e) => setServiceForm({ ...serviceForm, size: e.target.value })}
                                className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              >
                                <option value="large">Large (8/12 Col)</option>
                                <option value="small">Small (4/12 Col)</option>
                                <option value="full">Full (12/12 Col)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Order Tampilan</label>
                              <input
                                type="number"
                                value={serviceForm.display_order}
                                onChange={(e) => setServiceForm({ ...serviceForm, display_order: Number(e.target.value) })}
                                className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-4">
                            <input
                              type="checkbox"
                              id="service_active"
                              checked={serviceForm.is_active}
                              onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })}
                              className="w-4 h-4 accent-teal-accent"
                            />
                            <label htmlFor="service_active" className="text-xs font-mono text-text-muted uppercase">Tampilkan di Landing Page</label>
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-teal-accent text-white font-mono uppercase text-xs font-bold py-3 rounded-xl">
                          Simpan Layanan
                        </button>
                      </form>
                    )}

                    {/* Services List Table */}
                    {portfolioTab === 'services' && !showServiceForm && (
                      <div className="overflow-x-auto border border-brand-border rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-offwhite text-text-primary font-mono uppercase text-[10px] tracking-wider border-b border-brand-border">
                            <tr>
                              <th className="p-4">Ikon & Judul</th>
                              <th className="p-4">Deskripsi</th>
                              <th className="p-4">Tags / Sizing</th>
                              <th className="p-4">Status / Order</th>
                              <th className="p-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                            {services.length === 0 ? (
                              <tr><td colSpan={5} className="p-4 text-center">Belum ada data layanan di database.</td></tr>
                            ) : (
                              services.map((svc) => (
                                <tr key={svc.id} className="hover:bg-offwhite/50">
                                  <td className="p-4">
                                    <div className="flex items-center gap-2.5">
                                      <div className="bg-teal-accent/10 p-2 rounded text-teal-accent font-mono text-xs font-bold">{svc.icon_name}</div>
                                      <div className="font-semibold text-text-primary">{svc.title}</div>
                                    </div>
                                  </td>
                                  <td className="p-4 max-w-xs truncate">{svc.description}</td>
                                  <td className="p-4 font-mono text-[10px]">
                                    <div className="flex flex-wrap gap-1 mb-1">
                                      {svc.tags.map((t, idx) => <span key={idx} className="bg-offwhite border px-1 rounded">{t}</span>)}
                                    </div>
                                    <span className="text-text-muted/60 uppercase">Ukuran: {svc.size}</span>
                                  </td>
                                  <td className="p-4 font-mono">
                                    <span className={cn("px-1.5 py-0.5 rounded text-[9px]", svc.is_active ? "bg-teal-accent/5 text-teal-accent border border-teal-accent/25" : "bg-red-500/5 text-red-600 border border-red-500/25")}>
                                      {svc.is_active ? 'AKTIF' : 'DRAFT'}
                                    </span>
                                    <div className="text-[10px] text-text-muted/70 mt-1">Order: {svc.display_order}</div>
                                  </td>
                                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                    <button onClick={() => handleEditService(svc)} className="text-teal-accent hover:text-teal-glow inline-flex items-center gap-0.5"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                                    <button onClick={() => handleDeleteService(svc.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-0.5"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Case Studies Form (Add/Edit) */}
                    {showCaseForm && (
                      <form onSubmit={handleCaseSubmit} className="bg-offwhite border border-brand-border p-6 rounded-2xl space-y-4 max-w-2xl animate-fade-in">
                        <div className="flex justify-between items-center border-b border-brand-border pb-2">
                          <h4 className="font-heading-sans font-bold text-xs uppercase text-gold-accent">{editingCase ? '// Edit Studi Kasus' : '// Tambah Studi Kasus Baru'}</h4>
                          <button type="button" onClick={() => setShowCaseForm(false)} className="text-text-muted"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Client Name</label>
                            <input
                              type="text"
                              required
                              value={caseForm.client_name}
                              onChange={(e) => setCaseForm({ ...caseForm, client_name: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Sector Badge</label>
                            <input
                              type="text"
                              required
                              value={caseForm.sector_badge}
                              onChange={(e) => setCaseForm({ ...caseForm, sector_badge: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="Sektor Publik & Swasta"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Tantangan (Challenge)</label>
                            <textarea
                              required
                              rows={2}
                              value={caseForm.challenge}
                              onChange={(e) => setCaseForm({ ...caseForm, challenge: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl p-3 text-xs"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Pendekatan (Approach)</label>
                            <textarea
                              required
                              rows={2}
                              value={caseForm.approach}
                              onChange={(e) => setCaseForm({ ...caseForm, approach: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl p-3 text-xs"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Matriks Hasil (JSON Array)</label>
                            <textarea
                              required
                              rows={2}
                              value={caseForm.metrics}
                              onChange={(e) => setCaseForm({ ...caseForm, metrics: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl p-3 font-mono text-xs"
                              placeholder='[{"label": "Keterbacaan Google", "value": "+148%", "number": 148}]'
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Tech Tags (Koma separated)</label>
                            <input
                              type="text"
                              value={caseForm.tech_tags}
                              onChange={(e) => setCaseForm({ ...caseForm, tech_tags: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="SEO Teknikal, Next.js, ISR"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Display Order</label>
                            <input
                              type="number"
                              value={caseForm.display_order}
                              onChange={(e) => setCaseForm({ ...caseForm, display_order: Number(e.target.value) })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>

                          <div className="col-span-2 border-t border-brand-border pt-3 space-y-3">
                            <span className="block text-[10px] font-mono text-gold-accent uppercase">{"// TESTIMONIAL KLIEN (OPSIONAL)"}</span>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-3">
                                <label className="block text-[9px] font-mono text-text-muted uppercase mb-1">Isi Testimoni</label>
                                <textarea
                                  rows={2}
                                  value={caseForm.testimonial_text}
                                  onChange={(e) => setCaseForm({ ...caseForm, testimonial_text: e.target.value })}
                                  className="w-full bg-white border border-brand-border rounded-xl p-3 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono text-text-muted uppercase mb-1">Nama Pemberi</label>
                                <input
                                  type="text"
                                  value={caseForm.testimonial_author}
                                  onChange={(e) => setCaseForm({ ...caseForm, testimonial_author: e.target.value })}
                                  className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[9px] font-mono text-text-muted uppercase mb-1">Jabatan / Perusahaan</label>
                                <input
                                  type="text"
                                  value={caseForm.testimonial_role}
                                  onChange={(e) => setCaseForm({ ...caseForm, testimonial_role: e.target.value })}
                                  className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="checkbox"
                              id="case_active"
                              checked={caseForm.is_active}
                              onChange={(e) => setCaseForm({ ...caseForm, is_active: e.target.checked })}
                              className="w-4 h-4 accent-teal-accent"
                            />
                            <label htmlFor="case_active" className="text-xs font-mono text-text-muted uppercase">Tampilkan di Landing Page</label>
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-teal-accent text-white font-mono uppercase text-xs font-bold py-3 rounded-xl">
                          Simpan Studi Kasus
                        </button>
                      </form>
                    )}

                    {/* Case Studies List Table */}
                    {portfolioTab === 'cases' && !showCaseForm && (
                      <div className="overflow-x-auto border border-brand-border rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-offwhite text-text-primary font-mono uppercase text-[10px] tracking-wider border-b border-brand-border">
                            <tr>
                              <th className="p-4">Klien / Sektor</th>
                              <th className="p-4">Challenge / Approach</th>
                              <th className="p-4">Metrik Hasil</th>
                              <th className="p-4">Status / Order</th>
                              <th className="p-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                            {caseStudies.length === 0 ? (
                              <tr><td colSpan={5} className="p-4 text-center">Belum ada data studi kasus di database.</td></tr>
                            ) : (
                              caseStudies.map((cs) => (
                                <tr key={cs.id} className="hover:bg-offwhite/50">
                                  <td className="p-4">
                                    <div className="font-semibold text-text-primary leading-tight">{cs.client_name}</div>
                                    <span className="text-[10px] font-mono uppercase text-teal-accent tracking-wider">{cs.sector_badge}</span>
                                  </td>
                                  <td className="p-4 max-w-xs text-[11px] space-y-1">
                                    <div className="truncate"><strong className="text-text-primary">Tantangan:</strong> {cs.challenge}</div>
                                    <div className="truncate"><strong className="text-text-primary">Pendekatan:</strong> {cs.approach}</div>
                                  </td>
                                  <td className="p-4 font-mono text-[10px]">
                                    {(cs.metrics || []).map((m, idx) => (
                                      <div key={idx} className="bg-teal-accent/5 px-2 py-0.5 rounded border border-teal-accent/10 mt-0.5 inline-block mr-1">
                                        {m.label}: <strong>{m.value}</strong>
                                      </div>
                                    ))}
                                  </td>
                                  <td className="p-4 font-mono">
                                    <span className={cn("px-1.5 py-0.5 rounded text-[9px]", cs.is_active ? "bg-teal-accent/5 text-teal-accent border border-teal-accent/25" : "bg-red-500/5 text-red-600 border border-red-500/25")}>
                                      {cs.is_active ? 'AKTIF' : 'DRAFT'}
                                    </span>
                                    <div className="text-[10px] text-text-muted/70 mt-1">Order: {cs.display_order}</div>
                                  </td>
                                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                    <button onClick={() => handleEditCase(cs)} className="text-teal-accent hover:text-teal-glow inline-flex items-center gap-0.5"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                                    <button onClick={() => handleDeleteCase(cs.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-0.5"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. DIREKTORI PSEO TAB */}
                {activeTab === 'directory' && (
                  <div className="space-y-6">
                    <div className="flex border-b border-brand-border gap-2 pb-2 justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSeoDirTab('cities')}
                          className={cn("px-4 py-2 font-mono text-xs uppercase rounded-lg", seoDirTab === 'cities' ? "bg-brand-slate text-white" : "text-text-muted hover:bg-offwhite")}
                        >
                          Kota Wilayah ({cities.length})
                        </button>
                        <button
                          onClick={() => setSeoDirTab('entities')}
                          className={cn("px-4 py-2 font-mono text-xs uppercase rounded-lg", seoDirTab === 'entities' ? "bg-brand-slate text-white" : "text-text-muted hover:bg-offwhite")}
                        >
                          Entitas Profil Bisnis ({entities.length})
                        </button>
                      </div>

                      {seoDirTab === 'cities' && (
                        <button
                          onClick={() => { setEditingCity(null); setShowCityForm(!showCityForm); }}
                          className="inline-flex items-center gap-1 bg-teal-accent text-white text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah Kota
                        </button>
                      )}

                      {seoDirTab === 'entities' && (
                        <button
                          onClick={() => { setEditingEntity(null); setShowEntityForm(!showEntityForm); }}
                          className="inline-flex items-center gap-1 bg-teal-accent text-white text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah Profil Bisnis
                        </button>
                      )}
                    </div>

                    {/* Cities Form (Add/Edit) */}
                    {showCityForm && (
                      <form onSubmit={handleCitySubmit} className="bg-offwhite border border-brand-border p-6 rounded-2xl space-y-4 max-w-md animate-fade-in">
                        <div className="flex justify-between items-center border-b border-brand-border pb-2">
                          <h4 className="font-heading-sans font-bold text-xs uppercase text-gold-accent">{editingCity ? '// Edit Kota' : '// Tambah Kota Baru'}</h4>
                          <button type="button" onClick={() => setShowCityForm(false)} className="text-text-muted"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Nama Kota</label>
                            <input
                              type="text"
                              required
                              value={cityForm.name}
                              onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="Cirebon"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Slug URL</label>
                            <input
                              type="text"
                              required
                              value={cityForm.slug}
                              onChange={(e) => setCityForm({ ...cityForm, slug: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="cirebon"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Latitude</label>
                              <input
                                type="number"
                                step="any"
                                required
                                value={cityForm.latitude}
                                onChange={(e) => setCityForm({ ...cityForm, latitude: Number(e.target.value) })}
                                className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                                placeholder="-6.7216"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Longitude</label>
                              <input
                                type="number"
                                step="any"
                                required
                                value={cityForm.longitude}
                                onChange={(e) => setCityForm({ ...cityForm, longitude: Number(e.target.value) })}
                                className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                                placeholder="108.556"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Target Niche Bisnis</label>
                            <input
                              type="text"
                              value={cityForm.target_niche}
                              onChange={(e) => setCityForm({ ...cityForm, target_niche: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="UMKM & Layanan Publik Regional"
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-teal-accent text-white font-mono uppercase text-xs font-bold py-3 rounded-xl">
                          Simpan Kota
                        </button>
                      </form>
                    )}

                    {/* Cities List */}
                    {seoDirTab === 'cities' && !showCityForm && (
                      <div className="overflow-x-auto border border-brand-border rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-offwhite text-text-primary font-mono uppercase text-[10px] tracking-wider border-b border-brand-border">
                            <tr>
                              <th className="p-4">Nama Kota</th>
                              <th className="p-4">Slug URL</th>
                              <th className="p-4">Koordinat</th>
                              <th className="p-4">Target Niche</th>
                              <th className="p-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                            {cities.length === 0 ? (
                              <tr><td colSpan={5} className="p-4 text-center">Belum ada kota di direktori.</td></tr>
                            ) : (
                              cities.map((c) => (
                                <tr key={c.id} className="hover:bg-offwhite/50">
                                  <td className="p-4 font-semibold text-text-primary flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold-accent" /> {c.name}</td>
                                  <td className="p-4 font-mono">{c.slug}</td>
                                  <td className="p-4 font-mono text-[10px]">{c.latitude}, {c.longitude}</td>
                                  <td className="p-4">{c.target_niche || '-'}</td>
                                  <td className="p-4 text-right">
                                    <button onClick={() => handleDeleteCity(c.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-0.5"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Entities Form (Add/Edit) */}
                    {showEntityForm && (
                      <form onSubmit={handleEntitySubmit} className="bg-offwhite border border-brand-border p-6 rounded-2xl space-y-4 max-w-2xl animate-fade-in">
                        <div className="flex justify-between items-center border-b border-brand-border pb-2">
                          <h4 className="font-heading-sans font-bold text-xs uppercase text-gold-accent">{editingEntity ? '// Edit Profil Bisnis' : '// Tambah Profil Bisnis Baru'}</h4>
                          <button type="button" onClick={() => setShowEntityForm(false)} className="text-text-muted"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Pilih Kota (Slug)</label>
                            <select
                              required
                              value={entityForm.city_slug}
                              onChange={(e) => setEntityForm({ ...entityForm, city_slug: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            >
                              <option value="">-- Pilih Kota --</option>
                              {cities.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Tipe Entitas</label>
                            <select
                              required
                              value={entityForm.entity_type}
                              onChange={(e) => setEntityForm({ ...entityForm, entity_type: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            >
                              <option value="service">Service (Layanan)</option>
                              <option value="institution">Institution (Lembaga)</option>
                              <option value="agency">Agency (Agensi)</option>
                              <option value="brand">Brand (Merek)</option>
                              <option value="product">Product (Produk)</option>
                              <option value="individual">Individual (Perorangan)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Nama Profil</label>
                            <input
                              type="text"
                              required
                              value={entityForm.name}
                              onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="Contoh: Klinik Pratama Sehat"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Slug URL</label>
                            <input
                              type="text"
                              required
                              value={entityForm.slug}
                              onChange={(e) => setEntityForm({ ...entityForm, slug: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="klinik-pratama-sehat"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Tagline Singkat</label>
                            <input
                              type="text"
                              value={entityForm.tagline}
                              onChange={(e) => setEntityForm({ ...entityForm, tagline: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Deskripsi Lengkap</label>
                            <textarea
                              rows={3}
                              value={entityForm.description}
                              onChange={(e) => setEntityForm({ ...entityForm, description: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl p-3 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Kontak Telepon / WA</label>
                            <input
                              type="text"
                              value={entityForm.contact_phone}
                              onChange={(e) => setEntityForm({ ...entityForm, contact_phone: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Kontak Email</label>
                            <input
                              type="email"
                              value={entityForm.contact_email}
                              onChange={(e) => setEntityForm({ ...entityForm, contact_email: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Alamat Google Business / Alamat Fisik</label>
                            <input
                              type="text"
                              value={entityForm.address}
                              onChange={(e) => setEntityForm({ ...entityForm, address: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="Jl. Ahmad Yani No. 12, Cirebon"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Google Maps Share URL</label>
                            <input
                              type="url"
                              value={entityForm.google_maps_url}
                              onChange={(e) => setEntityForm({ ...entityForm, google_maps_url: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="https://maps.google.com/?q=..."
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Website URL Resmi</label>
                            <input
                              type="url"
                              value={entityForm.website_url}
                              onChange={(e) => setEntityForm({ ...entityForm, website_url: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Logo / Image URL</label>
                            <input
                              type="text"
                              value={entityForm.logo_url}
                              onChange={(e) => setEntityForm({ ...entityForm, logo_url: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Trust Score (0.0 - 5.0)</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={entityForm.trust_score}
                                onChange={(e) => setEntityForm({ ...entityForm, trust_score: Number(e.target.value) })}
                                className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Status Verifikasi</label>
                              <select
                                value={entityForm.verification_status}
                                onChange={(e) => setEntityForm({ ...entityForm, verification_status: e.target.value })}
                                className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              >
                                <option value="unverified">Unverified (Belum Klaim)</option>
                                <option value="claimed">Claimed (Menunggu Verifikasi)</option>
                                <option value="verified">Verified (Terverifikasi)</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Affiliate URL (Opsional)</label>
                            <input
                              type="url"
                              value={entityForm.affiliate_url}
                              onChange={(e) => setEntityForm({ ...entityForm, affiliate_url: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-teal-accent text-white font-mono uppercase text-xs font-bold py-3 rounded-xl">
                          Simpan Profil Bisnis
                        </button>
                      </form>
                    )}

                    {/* Entities Table */}
                    {seoDirTab === 'entities' && !showEntityForm && (
                      <div className="space-y-4">
                        
                        {/* Bulk Import Section */}
                        <div className="bg-offwhite border border-brand-border rounded-2xl p-6 space-y-3 max-w-2xl">
                          <span className="text-xs font-mono text-gold-accent uppercase tracking-widest flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> BULK IMPORT PROFILE BISNIS (JSON)</span>
                          <textarea
                            rows={4}
                            value={bulkJson}
                            onChange={(e) => setBulkJson(e.target.value)}
                            placeholder='Paste array JSON disini, format: [{"name": "Bisnis A", "city_slug": "cirebon", "entity_type": "service", ...}]'
                            className="w-full bg-white border border-brand-border rounded-xl p-3 font-mono text-[10px] outline-none"
                          />
                          <button
                            onClick={handleBulkImport}
                            className="bg-teal-accent hover:bg-brand-slate text-text-inverse font-mono text-[10px] uppercase font-bold py-2 px-4 rounded-xl cursor-pointer"
                          >
                            Jalankan Bulk Ingest
                          </button>
                        </div>

                        <div className="overflow-x-auto border border-brand-border rounded-xl">
                          <table className="w-full text-left font-sans text-xs text-text-muted">
                            <thead className="bg-offwhite text-text-primary font-mono uppercase text-[10px] tracking-wider border-b border-brand-border">
                              <tr>
                                <th className="p-4">Nama Profil</th>
                                <th className="p-4">Tipe & Kota</th>
                                <th className="p-4">Kontak / Web</th>
                                <th className="p-4">Trust Score / Status</th>
                                <th className="p-4 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                              {entities.length === 0 ? (
                                <tr><td colSpan={5} className="p-4 text-center">Belum ada profil bisnis terdaftar.</td></tr>
                              ) : (
                                entities.map((ent) => (
                                  <tr key={ent.id} className="hover:bg-offwhite/50">
                                    <td className="p-4">
                                      <div className="font-semibold text-text-primary">{ent.name}</div>
                                      <div className="text-[10px] text-text-muted/70 truncate max-w-xs">{ent.tagline}</div>
                                    </td>
                                    <td className="p-4">
                                      <span className="bg-teal-accent/5 border px-1.5 py-0.2 rounded text-[9px] font-mono uppercase text-teal-accent">{ent.entity_type}</span>
                                      <div className="text-[10px] font-mono mt-1 text-text-primary">/{ent.city_slug}</div>
                                    </td>
                                    <td className="p-4 space-y-0.5 text-[11px]">
                                      {ent.contact_phone && <div>Telp: {ent.contact_phone}</div>}
                                      {ent.website_url && <div><a href={ent.website_url} target="_blank" className="text-teal-accent hover:underline">Website Link</a></div>}
                                    </td>
                                    <td className="p-4 font-mono">
                                      <div>Skor: <strong>{ent.trust_score}</strong>/5.0</div>
                                      <span className={cn("inline-block px-1 rounded text-[8px] mt-1 font-bold", 
                                        ent.verification_status === 'verified' ? "bg-teal-accent/5 text-teal-accent border border-teal-accent/15" : ent.verification_status === 'claimed' ? "bg-blue-500/5 text-blue-600 border border-blue-500/15" : "bg-offwhite border text-text-muted"
                                      )}>
                                        {ent.verification_status.toUpperCase()}
                                      </span>
                                    </td>
                                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                      <button onClick={() => handleEditEntity(ent)} className="text-teal-accent hover:text-teal-glow inline-flex items-center gap-0.5"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                                      <button onClick={() => handleDeleteEntity(ent.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-0.5"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. BLOG ARTICLES & AGC SCRAPER TAB */}
                {activeTab === 'blog' && (
                  <div className="space-y-6">
                    <div className="flex border-b border-brand-border gap-2 pb-2 justify-between items-center">
                      <h3 className="text-lg font-heading-serif font-bold text-text-primary">Blog Manager & AGC Engine</h3>
                      
                      <button
                        onClick={() => { setEditingArticle(null); setShowArticleForm(!showArticleForm); }}
                        className="inline-flex items-center gap-1 bg-teal-accent text-white text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tulis Artikel Manual
                      </button>
                    </div>

                    {/* RSS Scraper Panel */}
                    {!showArticleForm && (
                      <form onSubmit={handleTriggerScraper} className="bg-offwhite border border-brand-border rounded-2xl p-6 space-y-4 max-w-3xl">
                        <span className="text-xs font-mono text-gold-accent uppercase tracking-widest flex items-center gap-1.5"><Cpu className="w-4 h-4" /> TRIGER AGC FEED AGREGATOR</span>
                        <p className="text-xs text-text-muted leading-relaxed">
                          Tarik RSS Feed Google News atau feed eksternal. Sistem akan secara otomatis mengunduh artikel asli, mengirimkannya ke Google Gemini Flash untuk ditulis ulang secara SEO-friendly menggunakan format Definition-Lead, dan menerbitkannya.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="url"
                            required
                            value={rssFeedUrl}
                            onChange={(e) => setRssFeedUrl(e.target.value)}
                            className="flex-grow bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs text-text-primary focus:ring-1 focus:ring-teal-accent outline-none"
                            placeholder="RSS Feed URL"
                          />
                          <button
                            type="submit"
                            disabled={isScraping}
                            className="bg-teal-accent hover:bg-brand-slate text-text-inverse font-mono text-xs uppercase font-bold px-6 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {isScraping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {isScraping ? 'Mengkaji Feed & AI Rewrite...' : 'Ingest RSS Feed'}
                          </button>
                        </div>

                        {scrapeResult && (
                          <div className="p-4 rounded-xl border bg-white border-brand-border text-xs font-mono text-text-muted mt-2">
                            {scrapeResult}
                          </div>
                        )}
                      </form>
                    )}

                    {/* Article Write Form */}
                    {showArticleForm && (
                      <form onSubmit={handleArticleSubmit} className="bg-offwhite border border-brand-border p-6 rounded-2xl space-y-4 max-w-4xl animate-fade-in">
                        <div className="flex justify-between items-center border-b border-brand-border pb-2">
                          <h4 className="font-heading-sans font-bold text-xs uppercase text-gold-accent">{editingArticle ? '// Edit Artikel' : '// Tulis Artikel Baru'}</h4>
                          <button type="button" onClick={() => setShowArticleForm(false)} className="text-text-muted"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Judul Artikel</label>
                            <input
                              type="text"
                              required
                              value={articleForm.title}
                              onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Slug URL</label>
                            <input
                              type="text"
                              required
                              value={articleForm.slug}
                              onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs text-text-muted"
                              placeholder="panduan-seo-terbaru"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Isi Konten (HTML / Markdown)</label>
                            <textarea
                              required
                              rows={12}
                              value={articleForm.content}
                              onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl p-4 font-mono text-xs text-text-primary leading-relaxed"
                              placeholder="Tulis artikel menggunakan tag HTML bersih atau markdown..."
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Meta Title</label>
                            <input
                              type="text"
                              value={articleForm.meta_title}
                              onChange={(e) => setArticleForm({ ...articleForm, meta_title: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Meta Description</label>
                            <input
                              type="text"
                              value={articleForm.meta_description}
                              onChange={(e) => setArticleForm({ ...articleForm, meta_description: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Keywords Semantik (Pisahkan Koma)</label>
                            <input
                              type="text"
                              value={articleForm.semantic_keywords}
                              onChange={(e) => setArticleForm({ ...articleForm, semantic_keywords: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                              placeholder="seo cirebon, growth marketing"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Nama Penulis</label>
                            <input
                              type="text"
                              required
                              value={articleForm.author_name}
                              onChange={(e) => setArticleForm({ ...articleForm, author_name: e.target.value })}
                              className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-2 col-span-2">
                            <input
                              type="checkbox"
                              id="article_published"
                              checked={articleForm.is_published}
                              onChange={(e) => setArticleForm({ ...articleForm, is_published: e.target.checked })}
                              className="w-4 h-4 accent-teal-accent"
                            />
                            <label htmlFor="article_published" className="text-xs font-mono text-text-muted uppercase">Terbitkan Langsung</label>
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-teal-accent text-white font-mono uppercase text-xs font-bold py-3 rounded-xl">
                          Terbitkan Artikel
                        </button>
                      </form>
                    )}

                    {/* Articles List */}
                    {!showArticleForm && (
                      <div className="overflow-x-auto border border-brand-border rounded-xl">
                        <table className="w-full text-left font-sans text-xs text-text-muted">
                          <thead className="bg-offwhite text-text-primary font-mono uppercase text-[10px] tracking-wider border-b border-brand-border">
                            <tr>
                              <th className="p-4">Judul Artikel</th>
                              <th className="p-4">Slug URL</th>
                              <th className="p-4">Sumber / Ingest</th>
                              <th className="p-4">Status / Publikasi</th>
                              <th className="p-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                            {articles.length === 0 ? (
                              <tr><td colSpan={5} className="p-4 text-center">Belum ada artikel di database.</td></tr>
                            ) : (
                              articles.map((art) => (
                                <tr key={art.id} className="hover:bg-offwhite/50">
                                  <td className="p-4 font-semibold text-text-primary leading-snug">{art.title}</td>
                                  <td className="p-4 font-mono text-[10px] text-teal-accent">/blog/{art.slug}</td>
                                  <td className="p-4 font-mono text-[10px] max-w-xs truncate" title={art.source_feed}>
                                    {art.source_feed ? 'AGC: ' + art.source_feed : 'Manual / UGC'}
                                  </td>
                                  <td className="p-4 font-mono text-[10px]">
                                    <span className={cn("px-1 py-0.5 rounded text-[8px]", art.is_published ? "bg-teal-accent/5 text-teal-accent border border-teal-accent/15" : "bg-red-500/5 text-red-600 border border-red-500/15")}>
                                      {art.is_published ? 'PUBLISHED' : 'DRAFT'}
                                    </span>
                                    <div className="text-[9px] text-text-muted/65 mt-1">{art.published_at ? new Date(art.published_at).toLocaleDateString('id-ID') : '-'}</div>
                                  </td>
                                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                    <button onClick={() => handleEditArticle(art)} className="text-teal-accent hover:text-teal-glow inline-flex items-center gap-0.5"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                                    <button onClick={() => handleDeleteArticle(art.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-0.5"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. SEO OPERATIONS & GOOGLE INDEXING TAB */}
                {activeTab === 'seo' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="space-y-2">
                      <h3 className="text-lg font-heading-serif font-bold text-text-primary">SEO Operations & Google Indexing</h3>
                      <p className="text-xs text-text-muted leading-relaxed">Kirim sinyal update URL secara instan ke API Google Search Indexing dan IndexNow.</p>
                    </div>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const urlField = (document.getElementById('instant-index-url') as HTMLInputElement)?.value;
                      if (!urlField) return;
                      
                      setIsLoading(true);
                      try {
                        const res = await fetch('/api/index-now', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ url: urlField, type: 'URL_UPDATED' }),
                        });
                        if (res.ok) {
                          triggerMessage('Sinyal indexing berhasil dikirim ke Google & IndexNow!');
                        } else {
                          const text = await res.text();
                          triggerMessage(`Gagal: ${text}`, 'error');
                        }
                      } catch (err) {
                        triggerMessage((err as Error).message || 'Gagal mengirim indexing', 'error');
                      } finally {
                        setIsLoading(false);
                      }
                    }} className="max-w-2xl bg-offwhite border border-brand-border rounded-xl p-6 space-y-4">
                      <h4 className="text-xs font-mono text-gold-accent uppercase tracking-wider">{'// INSTANT INDEXING TRIGGER'}</h4>
                      
                      <div>
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">URL Target Indexing</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            id="instant-index-url"
                            required
                            placeholder="https://muhzadit.vercel.app/blog/artikel-baru"
                            className="flex-grow bg-white border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder-text-muted/65 focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                          />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-teal-accent hover:bg-teal-glow text-white font-heading-sans font-bold uppercase tracking-wider px-6 rounded-xl transition-all flex-shrink-0 cursor-pointer text-xs"
                          >
                            <Send className="w-4 h-4" /> Submit URL
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="max-w-2xl bg-offwhite border border-brand-border rounded-xl p-6 space-y-2">
                      <h4 className="text-xs font-mono text-text-primary uppercase tracking-wider">{'// TELEMETRY STATE MAP'}</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono text-text-muted pt-2">
                        <div>Sitemap URL: <Link href="/sitemap.xml" className="text-teal-accent font-semibold hover:underline">/sitemap.xml</Link></div>
                        <div>Sitemap Engine: <span className="text-teal-accent font-semibold">Dynamic Active</span></div>
                        <div>robots.txt State: <span className="text-text-primary font-semibold">AI-Optimized</span></div>
                        <div>API Indexing Key: <span className="text-teal-accent font-semibold">JWT Key Loaded</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. SYSTEM GLOBAL CONFIG TAB */}
                {activeTab === 'config' && (
                  <form onSubmit={handleSaveConfigs} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-heading-serif font-bold text-text-primary">Sistem Konfigurasi Global</h3>
                      <p className="text-xs text-text-muted leading-relaxed">Kelola variabel dasar sistem yang memandu jalannya ekosistem portfolio.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                      <div>
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Nomor WhatsApp Penerima CTA</label>
                        <input
                          type="text"
                          required
                          value={sysConfigs.whatsapp_number}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, whatsapp_number: e.target.value })}
                          className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Status Ketersediaan Proyek</label>
                        <select
                          value={sysConfigs.available_status}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, available_status: e.target.value })}
                          className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none"
                        >
                          <option value="AVAILABLE">AVAILABLE (Tersedia Proyek)</option>
                          <option value="BUSY">BUSY (Sedang Sibuk)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Site Title Utama</label>
                        <input
                          type="text"
                          required
                          value={sysConfigs.site_title}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, site_title: e.target.value })}
                          className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Google Analytics Measurement ID</label>
                        <input
                          type="text"
                          required
                          value={sysConfigs.analytics_id}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, analytics_id: e.target.value })}
                          className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Sistem AI Prompt default (AGC)</label>
                        <textarea
                          rows={4}
                          required
                          value={sysConfigs.ai_prompt}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, ai_prompt: e.target.value })}
                          className="w-full bg-offwhite border border-brand-border rounded-xl p-4 font-sans text-sm text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none leading-relaxed"
                        />
                      </div>
                      
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Multi RSS Feeds (JSON Array)</label>
                        <textarea
                          rows={4}
                          required
                          value={sysConfigs.rss_feeds}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, rss_feeds: e.target.value })}
                          placeholder='[{"id":"1","name":"Tech","url":"https://.../rss","is_active":true}]'
                          className="w-full bg-offwhite border border-brand-border rounded-xl p-4 font-mono text-xs text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none leading-relaxed"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Link Hijacking / Affiliate Keywords (JSON Array)</label>
                        <textarea
                          rows={4}
                          required
                          value={sysConfigs.link_hijacks}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, link_hijacks: e.target.value })}
                          placeholder='[{"keyword":"Hosting","url":"https://...","is_dofollow":false}]'
                          className="w-full bg-offwhite border border-brand-border rounded-xl p-4 font-mono text-xs text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none leading-relaxed"
                        />
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 pt-6 pb-2 border-t border-brand-border">
                        <h4 className="text-lg font-bold font-heading-serif">Sovereign Open Data Integration</h4>
                        <p className="text-xs text-text-muted mt-1">Konfigurasi API Publik Pemerintah dan Proteksi Darurat (Sovereign Emergency Lock).</p>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                        <div>
                          <label className="block text-sm font-bold text-red-900 mb-1">Sovereign Emergency Lock</label>
                          <p className="text-xs text-red-700">Aktifkan untuk memaksa sistem menggunakan Local Cache Fallback saat server BPS/Kemenkeu/Bappenas *downtime* (Mencegah UI render macet).</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={sysConfigs.sovereign_emergency_lock === 'true'}
                            onChange={(e) => setSysConfigs({ ...sysConfigs, sovereign_emergency_lock: e.target.checked ? 'true' : 'false' })}
                          />
                          <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>

                      <div className="col-span-1">
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Macro Economics Fallback (JSON)</label>
                        <textarea
                          rows={4}
                          value={sysConfigs.sovereign_macro_fallback}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, sovereign_macro_fallback: e.target.value })}
                          className="w-full bg-offwhite border border-brand-border rounded-xl p-4 font-mono text-xs text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none leading-relaxed"
                          placeholder='{"gdpGrowth":"5.01%","inflationRate":"2.56%"}'
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Fiscal Data Fallback (JSON)</label>
                        <textarea
                          rows={4}
                          value={sysConfigs.sovereign_fiscal_fallback}
                          onChange={(e) => setSysConfigs({ ...sysConfigs, sovereign_fiscal_fallback: e.target.value })}
                          className="w-full bg-offwhite border border-brand-border rounded-xl p-4 font-mono text-xs text-text-primary focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none leading-relaxed"
                          placeholder='{"department":"Kemenkeu","allocationAmount":"Rp 1.000 T"}'
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-teal-accent hover:bg-teal-glow text-white font-heading-sans font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer text-xs"
                      >
                        <Save className="w-4 h-4" /> Simpan Konfigurasi Global
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
