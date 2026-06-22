'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, CheckCircle, XCircle, AlertCircle, Play, Eye, ThumbsUp, MessageSquare, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

export default function VideoAuditorPage() {
  const [url, setUrl] = useState('');
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audited, setAudited] = useState(false);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setAudited(true);
    try {
      const res = await fetch(`/api/utility/youtube-audit?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setVideo(data.data);
      } else {
        setVideo(null);
        setError(data.error || 'Sistem kami tidak dapat menganalisis video tersebut. Pastikan tautan YouTube valid.');
      }
    } catch (err) {
      setError('Koneksi terputus. Silakan periksa jaringan Anda dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // SEO Audit Logic
  const getAuditScore = () => {
    if (!video) return 0;
    let score = 30; // base score
    const snippet = video.snippet;
    if (snippet.title.length >= 40 && snippet.title.length <= 70) score += 20;
    if (snippet.description.length > 200) score += 20;
    if (snippet.tags && snippet.tags.length >= 5) score += 20;
    if (snippet.tags && snippet.tags.length > 15) score += 10;
    return Math.min(score, 100);
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          
          {/* Page Header */}
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-mono tracking-widest text-red-500 uppercase block flex items-center justify-center md:justify-start gap-1.5">
              <Youtube className="w-4 h-4" /> YouTube Video Auditor & SEO
            </span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
              Audit SEO Video YouTube Anda
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed">
              Dapatkan analisis instan untuk optimasi tags, kualitas deskripsi, struktur judul, dan saran taktis untuk meningkatkan visibilitas video Anda di pencarian YouTube & Google.
            </p>
          </div>

          {/* Form Input */}
          <form onSubmit={handleAudit} className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Youtube className="w-5 h-5 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                placeholder="contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-offwhite border border-brand-border rounded-xl pl-12 pr-4 py-3.5 text-xs text-text-primary focus:ring-2 focus:ring-red-500 outline-none font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase font-bold py-3.5 px-8 rounded-xl cursor-pointer transition-colors shrink-0 disabled:opacity-50"
            >
              {loading ? 'Mengaudit...' : 'Uji Skor SEO Video Anda →'}
            </button>
          </form>

          {/* Error Panel */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-xl font-sans flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Panel */}
          {loading ? (
            <div className="bg-white border border-brand-border rounded-2xl p-8 space-y-6 animate-pulse">
              <div className="h-6 bg-offwhite rounded w-2/3" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-offwhite rounded" />
                <div className="h-16 bg-offwhite rounded" />
                <div className="h-16 bg-offwhite rounded" />
              </div>
            </div>
          ) : video ? (() => {
            const score = getAuditScore();
            const tags = video.snippet.tags || [];
            return (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Meta Summary Card */}
                <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 shadow-xs">
                  
                  {/* Thumbnail */}
                  <div className="md:col-span-4 relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center group border border-brand-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url} 
                      alt={video.snippet.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-white" />
                    </div>
                  </div>

                  {/* Title & Stats */}
                  <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full border border-red-200 uppercase font-bold">
                        YouTube SEO Audit
                      </span>
                      <h3 className="text-lg md:text-xl font-bold leading-snug text-text-primary">
                        {video.snippet.title}
                      </h3>
                      <p className="text-xs text-text-muted">Kanal: {video.snippet.channelTitle}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 border-t border-brand-border/60 pt-4 text-center">
                      <div className="bg-offwhite p-2.5 rounded-xl space-y-1">
                        <Eye className="w-4 h-4 text-text-muted mx-auto" />
                        <div className="text-xs font-bold text-text-primary font-mono">{Number(video.statistics.viewCount).toLocaleString('id-ID')}</div>
                        <div className="text-[9px] text-text-muted uppercase">Views</div>
                      </div>
                      <div className="bg-offwhite p-2.5 rounded-xl space-y-1">
                        <ThumbsUp className="w-4 h-4 text-text-muted mx-auto" />
                        <div className="text-xs font-bold text-text-primary font-mono">{Number(video.statistics.likeCount || 0).toLocaleString('id-ID')}</div>
                        <div className="text-[9px] text-text-muted uppercase">Likes</div>
                      </div>
                      <div className="bg-offwhite p-2.5 rounded-xl space-y-1">
                        <MessageSquare className="w-4 h-4 text-text-muted mx-auto" />
                        <div className="text-xs font-bold text-text-primary font-mono">{Number(video.statistics.commentCount || 0).toLocaleString('id-ID')}</div>
                        <div className="text-[9px] text-text-muted uppercase">Comments</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Checklist Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Score */}
                  <div className="md:col-span-4 bg-brand-slate text-white border border-brand-mid p-6 rounded-2xl text-center flex flex-col justify-center items-center shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl" />
                    <Award className="w-8 h-8 text-red-500 mb-2" />
                    <span className="text-xs font-mono text-text-inverse/60 uppercase">SEO Score</span>
                    <div className="text-5xl font-black font-mono text-white my-2">{score}%</div>
                    <span className="text-[10px] text-text-inverse/50">Diuji via Google Video Platform</span>
                  </div>

                  {/* Checklist items */}
                  <div className="md:col-span-8 bg-white border border-brand-border p-6 rounded-2xl space-y-4 shadow-xs">
                    <h4 className="text-xs font-mono text-text-primary uppercase tracking-wider mb-2">Checklist Optimasi</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-2">
                        {video.snippet.title.length >= 40 && video.snippet.title.length <= 70 ? (
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                        )}
                        <span>Panjang Judul ({video.snippet.title.length} karakter - Target: 40-70)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {video.snippet.description.length > 200 ? (
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                        )}
                        <span>Kerapian Deskripsi ({video.snippet.description.length} karakter - Target: &gt; 200)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tags.length >= 5 ? (
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                        )}
                        <span>Kepadatan Tags/Kata Kunci ({tags.length} terpasang - Target: min 5)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags List */}
                <div className="bg-white border border-brand-border p-6 rounded-2xl space-y-4 shadow-xs">
                  <h4 className="text-xs font-mono text-text-primary uppercase tracking-wider">Tags / Kata Kunci Video ({tags.length})</h4>
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag: string, tIdx: number) => (
                        <span key={tIdx} className="bg-offwhite border border-brand-border text-[10px] font-mono px-3 py-1 rounded-md text-text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">Tidak ada tags yang terdeteksi pada video ini. Disarankan segera menambahkannya.</p>
                  )}
                </div>

              </motion.div>
            );
          })() : audited ? (
            <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-text-muted text-sm shadow-xs space-y-3">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h4 className="font-heading-sans font-bold text-text-primary">Gagal Menghubungi Server YouTube</h4>
              <p className="text-xs max-w-md mx-auto leading-relaxed">
                Kami tidak dapat memuat data video tersebut. Pastikan link video YouTube Anda sudah benar, status visibilitas video adalah publik (bukan privat atau tidak publik), dan Anda memiliki koneksi internet aktif. Coba gunakan format standar: <strong>https://www.youtube.com/watch?v=dQw4w9WgXcQ</strong>.
              </p>
            </div>
          ) : null}

        </div>
      </main>
      <Footer />
    </>
  );
}
