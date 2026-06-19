import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { routeLLM } from "@/lib/llm-router";
import { supabase } from "@/lib/supabase";
import { ChevronRight, ArrowLeft, Send, Clock, Zap, Home, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import SocialShare from '@/components/SocialShare';
import ArticleInteractiveWidgets from '@/components/ArticleInteractiveWidgets';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';


interface Article {
  id?: string;
  title: string;
  slug: string;
  original_url: string;
  content: string;
  semantic_keywords: string;
  faq_items: Array<{ question: string; answer: string }>;
  published_at?: string;
}

// Generate human-friendly title from slug
function getTitleFromSlug(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  
  const { data } = await supabase
    .from('articles')
    .select('title, meta_description, semantic_keywords, slug, published_at')
    .eq('slug', slug)
    .maybeSingle();

  const title = data?.title ? `${data.title} | Zadit Growth Blog` : `${getTitleFromSlug(slug)} | Zadit Growth Blog`;
  const description = data?.meta_description || `Artikel komprehensif mengenai ${getTitleFromSlug(slug)} untuk pertumbuhan ekosistem bisnis digital modern.`;
  const keywords = Array.isArray(data?.semantic_keywords) ? data?.semantic_keywords.join(', ') : (data?.semantic_keywords || 'growth marketing, seo, digital business');
  const ogTitle = data?.title || getTitleFromSlug(slug);
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(ogTitle)}&type=blog&subtitle=${encodeURIComponent(description.substring(0, 110))}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/blog/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: data?.published_at || new Date().toISOString(),
      authors: ['Muhammad Khoiruzzadittaqwa'],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@muhzadit'
    }
  };
}


// Dynamic server-side SEO/AEO AGC Article page
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article: Article | null = null;
  let relatedPosts: any[] = [];

  try {
    // 1. Check if article exists in Supabase
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      article = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        original_url: data.original_url || '',
        content: data.content,
        semantic_keywords: Array.isArray(data.semantic_keywords) ? data.semantic_keywords.join(', ') : data.semantic_keywords || '',
        faq_items: Array.isArray(data.faq_items) ? data.faq_items : [],
        published_at: data.published_at
      };

      // Fetch related posts based on semantic keywords or just latest posts if no keywords match
      const kws = Array.isArray(data.semantic_keywords) ? data.semantic_keywords : [];
      let query = supabase.from('articles').select('id, title, slug').neq('id', data.id).limit(4);
      
      if (kws.length > 0) {
        query = query.contains('semantic_keywords', [kws[0]]);
      }
      
      const { data: relatedData } = await query;
      if (relatedData && relatedData.length > 0) {
        relatedPosts = relatedData;
      } else {
        // Fallback to latest
        const { data: latestData } = await supabase.from('articles').select('id, title, slug').neq('id', data.id).order('published_at', { ascending: false }).limit(4);
        relatedPosts = latestData || [];
      }

    } else {
      // 2. AGC Trigger: Generate article dynamically using Multi-LLM Routing
      const title = getTitleFromSlug(slug);

      const systemInstruction = `Tulis artikel SEO komprehensif dalam Bahasa Indonesia. 
      Panjang 700-1000 kata. 
      Gunakan struktur Definition-Lead pada 200 kata pertama (contoh: "X adalah Y yang berfungsi untuk Z..."). 
      Bagi artikel menjadi 3-4 subjudul H2.
      Tambahkan bagian FAQ di akhir dengan 3 pertanyaan People Also Ask (PAA) dan jawabannya.
      Gunakan format HTML yang bersih (menggunakan <p>, <h2>, <ul>, <ol>).`;

      const generatedText = await routeLLM(
        'content',
        `Topik artikel: ${title}. Keyword target: ${title.toLowerCase()}, growth marketing, strategi seo, konversi digital.`,
        systemInstruction
      );

      // Generate FAQ array dynamically using AI
      const faqPrompt = `Buat 3 FAQ (Pertanyaan dan Jawaban) format JSON array berdasarkan artikel berikut. Format output HANYA array JSON [{question: "...", answer: "..."}]. Artikel: ${generatedText.substring(0, 1000)}`;
      const rawFaq = await routeLLM('seo', faqPrompt, 'Kembalikan format JSON array saja.');
      
      let faqItems = [];
      try {
        const cleanJson = rawFaq.match(/\[\s*\{[\s\S]*\}\s*\]/)?.[0] || '[]';
        faqItems = JSON.parse(cleanJson);
      } catch {
        faqItems = [
          { question: `Apa fokus utama dari ${title}?`, answer: `Artikel ini membahas bagaimana ${title} memengaruhi peningkatan optimasi web dan digital marketing.` }
        ];
      }

      // Save generated article to Supabase for future requests
      const newArticle = {
        title,
        slug,
        content: generatedText,
        meta_title: `${title} | Zadit Growth Blog`,
        meta_description: `${title}. Panduan terlengkap mengenai optimasi ekosistem digital untuk pertumbuhan bisnis Anda secara berkelanjutan.`,
        semantic_keywords: [title.toLowerCase(), 'seo', 'growth'],
        faq_items: faqItems,
        is_published: true,
        published_at: new Date().toISOString()
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('articles')
        .insert(newArticle)
        .select('id')
        .single();

      if (insertError) {
        console.warn('Could not save AGC article to Supabase database', insertError);
      }

      article = {
        id: insertedData?.id,
        title: newArticle.title,
        slug: newArticle.slug,
        original_url: '',
        content: newArticle.content,
        semantic_keywords: newArticle.semantic_keywords.join(', '),
        faq_items: newArticle.faq_items,
        published_at: newArticle.published_at
      };
    }
  } catch (err) {
    console.error('AGC database or routing error, rendering client fallback content', err);
    // Hardcoded fallback article in case APIs are offline
    const title = getTitleFromSlug(slug);
    article = {
      title,
      slug,
      original_url: '',
      content: `
        <p><strong>${title}</strong> adalah strategi krusial dalam pertumbuhan ekosistem bisnis digital modern Indonesia.</p>
        <h2>Mengapa Ini Penting?</h2>
        <p>Dalam pasar digital yang kompetitif, memiliki visibilitas di halaman pertama mesin pencari konvensional maupun jawaban AI generatif merupakan aset defensif jangka panjang.</p>
        <h2>Langkah Implementasi Praktis</h2>
        <ul>
          <li><strong>Diagnosis Struktur:</strong> Audit kecepatan dan performa aksesibilitas web.</li>
          <li><strong>Arsitektur Konten:</strong> Petakan keyword long-tail untuk menjangkau audiens secara presisi.</li>
          <li><strong>Copywriting Konversi:</strong> Tulis pesan yang mengedepankan value dan memicu tindakan langsung.</li>
        </ul>
      `,
      semantic_keywords: 'growth marketing, seo',
      faq_items: [
        { question: `Bagaimana cara mengukur keberhasilan strategi ini?`, answer: `Evaluasi berkala terhadap traffic organik, tingkat keterbacaan entitas, dan yang terpenting: conversion rate dari formulir yang diisi.` }
      ]
    };
  }

  // Schema Markup generation
  const faqList = article.faq_items.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));

  const articleObj = generateArticleSchema(article);
  const breadcrumbObj = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: article.title, path: `/blog/${article.slug}` }
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...articleObj,
        "@context": undefined
      },
      {
        ...breadcrumbObj,
        "@context": undefined
      },
      ...(faqList.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": faqList
      }] : [])
    ]
  };


  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  const fullUrl = `${siteUrl}/blog/${article.slug}`;

  // Estimate Read Time
  const wordCount = article.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      
      {/* Reading progress bar */}
      <div className="scroll-progress" />

      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Article Content (Left - 8 columns) */}
          <article className="lg:col-span-8 space-y-6">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-text-muted mb-6">
              <Link href="/" className="hover:text-teal-accent flex items-center gap-1"><Home className="w-3 h-3" /> Beranda</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/blog" className="hover:text-teal-accent">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-text-primary truncate max-w-[200px]">{article.title}</span>
            </nav>

            <div className="space-y-4">
              <span className="text-xs font-mono text-gold-accent tracking-widest uppercase">Wawasan Pertumbuhan</span>
              <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted">
                <span>Penulis: Muhammad Khoiruzzadittaqwa</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-accent" /> {readTime} Menit Baca</span>
                {article.published_at && (
                  <span>{new Date(article.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
              </div>
            </div>

            {/* Interactive Widgets: Like, View, TTS, Bookmark */}
            <ArticleInteractiveWidgets articleId={article.id || article.slug} />

            {/* Rich text container with Definition-Lead styling */}
            <div 
              id="article-content"
              className="prose max-w-none prose-sm md:prose-base text-text-muted leading-relaxed space-y-6 pt-2 prose-headings:text-text-primary prose-headings:font-heading-sans prose-a:text-teal-accent
              [&>p:first-of-type]:text-lg [&>p:first-of-type]:md:text-xl [&>p:first-of-type]:text-text-primary [&>p:first-of-type]:font-medium [&>p:first-of-type]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Source Reference Link if ingested from external feed */}
            {article.original_url && (
              <div className="mt-8 p-4 bg-offwhite border border-brand-border rounded-xl">
                <p className="text-sm text-text-muted font-sans flex items-center gap-2">
                  <span className="font-bold">Sumber Referensi:</span> 
                  <a href={article.original_url} target="_blank" rel="nofollow noopener noreferrer" className="text-teal-accent hover:underline flex items-center gap-1">
                    Baca Artikel Asli <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            )}

            {/* Bottom Share */}
            <div className="mt-16 pt-8 border-t border-brand-border">
              <SocialShare url={fullUrl} title={article.title} />
            </div>

            {/* Dynamic FAQ Accordions */}
            {article.faq_items && article.faq_items.length > 0 && (
              <div className="pt-8 border-t border-brand-border mt-12 space-y-4">
                <span className="text-xs font-mono text-gold-accent tracking-widest uppercase">Pertanyaan Yang Sering Diajukan (FAQ)</span>
                <div className="space-y-4">
                  {article.faq_items.map((faq, idx) => (
                    <details key={idx} className="bg-white border border-brand-border rounded-xl p-5 group transition-all duration-300">
                      <summary className="font-heading-sans font-bold text-text-primary text-sm cursor-pointer list-none flex justify-between items-center select-none">
                        <span>{faq.question}</span>
                        <span className="text-teal-accent group-open:rotate-180 transition-transform duration-300">▼</span>
                      </summary>
                      <p className="text-xs md:text-sm text-text-muted mt-3 leading-relaxed pt-3 border-t border-brand-border/60">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sticky Conversion Sidebar (Right - 4 columns) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            {/* Desktop Share Widget */}
            <div className="hidden lg:block bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <SocialShare url={fullUrl} title={article.title} />
            </div>

            {/* Conversion Card */}
            <div className="bg-gradient-to-br from-brand-slate to-[#1a2b3c] border border-brand-slate rounded-2xl p-6 text-text-inverse relative overflow-hidden group shadow-xl">
              {/* Background glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-accent/20 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal-accent/20 flex items-center justify-center text-teal-accent mb-2">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-heading-sans font-bold leading-tight">
                  Butuh Implementasi Sistem Serupa?
                </h3>
                <p className="text-sm text-text-inverse/70 leading-relaxed font-sans">
                  Dapatkan arsitektur web berkecepatan tinggi, SEO teknikal, dan ekosistem data yang meningkatkan konversi bisnis Anda.
                </p>
                
                <div className="pt-2">
                  <a 
                    href={`https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20membaca%20artikel%20"${encodeURIComponent(article.title)}"%20dan%20tertarik%20berdiskusi%20kemitraan.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-teal-accent hover:bg-white hover:text-brand-slate text-text-inverse text-center font-heading-sans font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300"
                  >
                    Konsultasikan Sekarang <Send className="w-4 h-4 inline-block ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-mono text-text-primary uppercase tracking-wider mb-4">ARTIKEL TERKAIT</h4>
              {relatedPosts.length > 0 ? (
                <ul className="space-y-3 text-xs">
                  {relatedPosts.map((rp) => (
                    <li key={rp.id}>
                      <Link href={`/blog/${rp.slug}`} className="text-text-muted hover:text-teal-accent flex items-start gap-2 transition-colors">
                        <ChevronRight className="w-3.5 h-3.5 text-teal-accent shrink-0 mt-0.5" /> 
                        <span className="leading-snug">{rp.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-text-muted">Belum ada artikel terkait.</p>
              )}
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </>
  );
}
