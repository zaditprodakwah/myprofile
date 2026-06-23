import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { ChevronRight, ArrowLeft, Send, Clock, Zap, Home, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import SocialShare from '@/components/SocialShare';
import ArticleInteractiveWidgets from '@/components/ArticleInteractiveWidgets';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { Metadata } from 'next';
import ReadingProgressBar from "@/components/ReadingProgressBar";
import BlogViewTracker from "@/components/BlogViewTracker";

interface UnifiedPost {
  id?: string;
  type: 'article' | 'reference';
  title: string;
  slug: string;
  original_url?: string;
  content: string;
  semantic_keywords: string;
  faq_items: Array<{ question: string; answer: string }>;
  published_at?: string;
  categoryLabel?: string;
  view_count?: number;
}

function getTitleFromSlug(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function parseHeadings(html: string): { headings: Array<{ id: string; text: string; level: number }>; modifiedHtml: string } {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let headingIndex = 0;

  // Match h2 and h3 tags
  const modifiedHtml = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, levelStr, attrs, content) => {
    const level = parseInt(levelStr, 10);
    const text = content.replace(/<[^>]*>?/gm, '').trim();
    const id = `heading-${headingIndex++}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    
    headings.push({ id, text, level });
    
    return `<h${level} id="${id}"${attrs}>${content}</h${level}>`;
  });

  return { headings, modifiedHtml };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  
  // 1. Try fetching from articles
  let { data: article } = await supabase
    .from('articles')
    .select('title, meta_description, semantic_keywords, slug, published_at')
    .eq('slug', slug)
    .maybeSingle();

  let title = '';
  let description = '';
  let keywords = '';
  let ogTitle = '';
  let publishedTime = '';

  if (article) {
    title = `${article.title} | Zadit Growth Hub`;
    description = article.meta_description || `Artikel komprehensif mengenai ${article.title}.`;
    keywords = Array.isArray(article.semantic_keywords) ? article.semantic_keywords.join(', ') : (article.semantic_keywords || '');
    ogTitle = article.title;
    publishedTime = article.published_at || new Date().toISOString();
  } else {
    // 2. Try fetching from reference_items
    const { data: ref } = await supabase
      .from('reference_items')
      .select('title, summary, tags, slug, created_at')
      .eq('slug', slug)
      .maybeSingle();

    if (ref) {
      title = `${ref.title} | Zadit Growth Playbook`;
      description = ref.summary || `Playbook taktis mengenai ${ref.title}.`;
      keywords = Array.isArray(ref.tags) ? ref.tags.join(', ') : '';
      ogTitle = ref.title;
      publishedTime = ref.created_at || new Date().toISOString();
    } else {
      title = `${getTitleFromSlug(slug)} | Zadit Growth Hub`;
      description = `Panduan dan wawasan mengenai ${getTitleFromSlug(slug)}.`;
      keywords = 'growth marketing, seo, data intelligence';
      ogTitle = getTitleFromSlug(slug);
      publishedTime = new Date().toISOString();
    }
  }

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
      publishedTime,
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

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: UnifiedPost | null = null;
  let relatedPosts: any[] = [];

  try {
    // 1. Try articles table
    const { data: artData } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (artData) {
      post = {
        id: artData.id,
        type: 'article',
        title: artData.title,
        slug: artData.slug,
        original_url: artData.original_url || '',
        content: artData.content,
        semantic_keywords: Array.isArray(artData.semantic_keywords) ? artData.semantic_keywords.join(', ') : artData.semantic_keywords || '',
        faq_items: Array.isArray(artData.faq_items) ? artData.faq_items : [],
        published_at: artData.published_at,
        categoryLabel: 'Artikel AI & Wawasan',
        view_count: artData.view_count || 0
      };

      // Related articles query
      const kws = Array.isArray(artData.semantic_keywords) ? artData.semantic_keywords : [];
      let query = supabase.from('articles').select('id, title, slug').neq('id', artData.id).limit(4);
      if (kws.length > 0) {
        query = query.contains('semantic_keywords', [kws[0]]);
      }
      const { data: rel } = await query;
      relatedPosts = rel || [];
    } else {
      // 2. Try reference_items table
      const { data: refData } = await supabase
        .from('reference_items')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (refData) {
        post = {
          id: refData.id,
          type: 'reference',
          title: refData.title,
          slug: refData.slug,
          original_url: refData.source_url || '',
          content: refData.content,
          semantic_keywords: Array.isArray(refData.tags) ? refData.tags.join(', ') : '',
          faq_items: [], // reference items don't have default faqs
          published_at: refData.created_at,
          categoryLabel: refData.category.replace('-', ' ').toUpperCase(),
          view_count: refData.view_count || 0
        };

        // Related references query
        const { data: relRef } = await supabase
          .from('reference_items')
          .select('id, title, slug')
          .eq('category', refData.category)
          .neq('id', refData.id)
          .limit(4);
        relatedPosts = relRef || [];
      }
    }

    if (!post) {
      const title = getTitleFromSlug(slug);
      post = {
        type: 'article',
        title: `Halaman "${title}" Belum Siap`,
        slug,
        content: `
          <p>Maaf, materi tentang <strong>${title}</strong> belum dipublikasikan atau sedang dalam proses sinkronisasi database kami.</p>
          <div style="margin-top: 30px;">
            <a href="/blog" style="background-color: #0d9488; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none;">
              Kembali Ke Growth Hub
            </a>
          </div>
        `,
        semantic_keywords: 'not found',
        faq_items: []
      };
    }
  } catch (err) {
    console.error('Database error in blog article:', err);
    post = {
      type: 'article',
      title: `Gangguan Sistem Koneksi`,
      slug,
      content: `<p>Maaf, saat ini terjadi gangguan koneksi dengan server database. Silakan muat ulang beberapa saat lagi.</p>`,
      semantic_keywords: 'error',
      faq_items: []
    };
  }

  // Schema Markup
  const faqList = post.faq_items.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));

  const articleObj = generateArticleSchema({
    title: post.title,
    slug: post.slug,
    content: post.content,
    published_at: post.published_at
  } as any);

  const breadcrumbObj = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Growth Hub", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` }
  ]);

  const schemaGraph = {
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
  const fullUrl = `${siteUrl}/blog/${post.slug}`;
  const wordCount = post.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const { headings, modifiedHtml } = parseHeadings(post.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <BlogViewTracker slug={post.slug} type={post.type} />
      <Header />
      <ReadingProgressBar />

      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <article className="lg:col-span-8 space-y-6">
            <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-text-muted mb-6">
              <Link href="/" className="hover:text-teal-accent flex items-center gap-1"><Home className="w-3 h-3" /> Beranda</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/blog" className="hover:text-teal-accent">Growth Hub</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-text-primary truncate max-w-[200px]">{post.title}</span>
            </nav>

            <div className="space-y-4">
              <span className="text-xs font-mono text-gold-accent tracking-widest uppercase">{post.categoryLabel || 'INFORMASI'}</span>
              <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted">
                <span>Penulis: Muhammad Khoiruzzadittaqwa</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-accent" /> {readTime} Menit Baca</span>
                {post.view_count !== undefined && (
                  <span>👁 {post.view_count} Dilihat</span>
                )}
                {post.published_at && (
                  <span>{new Date(post.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
              </div>
            </div>

            <ArticleInteractiveWidgets articleId={post.id || post.slug} />

            <div 
              id="article-content"
              className="prose max-w-none prose-sm md:prose-base text-text-muted leading-relaxed space-y-6 pt-2 prose-headings:text-text-primary prose-headings:font-heading-sans prose-a:text-teal-accent
              prose-h2:scroll-mt-24 prose-h3:scroll-mt-24
              [&>p:first-of-type]:text-lg [&>p:first-of-type]:md:text-xl [&>p:first-of-type]:text-text-primary [&>p:first-of-type]:font-medium [&>p:first-of-type]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: modifiedHtml }}
            />

            {post.original_url && (
              <div className="mt-8 p-4 bg-offwhite border border-brand-border rounded-xl">
                <p className="text-sm text-text-muted font-sans flex items-center gap-2">
                  <span className="font-bold">Kredit Sumber Rujukan:</span> 
                  <a href={post.original_url} target="_blank" rel="nofollow noopener noreferrer" className="text-teal-accent hover:underline flex items-center gap-1">
                    Baca Halaman Asli <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-brand-border">
              <SocialShare url={fullUrl} title={post.title} />
            </div>

            {post.faq_items && post.faq_items.length > 0 && (
              <div className="pt-8 border-t border-brand-border mt-12 space-y-4">
                <span className="text-xs font-mono text-gold-accent tracking-widest uppercase">Pertanyaan Yang Sering Diajukan (FAQ)</span>
                <div className="space-y-4">
                  {post.faq_items.map((faq, idx) => (
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

          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            {headings.length > 0 && (
              <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-mono text-text-primary uppercase tracking-wider">Daftar Isi</h4>
                <nav className="space-y-2 text-xs">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-text-muted hover:text-teal-accent transition-colors ${
                        h.level === 3 ? 'pl-4 border-l border-brand-border/60 ml-1' : 'font-medium'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            <div className="hidden lg:block bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <SocialShare url={fullUrl} title={post.title} />
            </div>

            <div className="bg-gradient-to-br from-brand-slate to-[#1a2b3c] border border-brand-slate rounded-2xl p-6 text-text-inverse relative overflow-hidden group shadow-xl">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-accent/20 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal-accent/20 flex items-center justify-center text-teal-accent mb-2">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-heading-sans font-bold leading-tight">
                  Punya Ide atau Proyek?
                </h3>
                <p className="text-sm text-text-inverse/70 leading-relaxed font-sans">
                  Diskusikan strategi dan pertumbuhan bisnis Anda bersama Zadit — dari riset pasar hingga eksekusi digital.
                </p>
                
                <div className="pt-2">
                  <a 
                    href={`https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20tertarik%20berdiskusi%20kemitraan%20setelah%20membaca%20halaman%20"${encodeURIComponent(post.title)}".`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-teal-accent hover:bg-white hover:text-brand-slate text-text-inverse text-center font-heading-sans font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300"
                  >
                    Konsultasikan Sekarang
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-mono text-text-primary uppercase tracking-wider mb-4">REKOMENDASI TERKAIT</h4>
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
                <p className="text-xs text-text-muted">Belum ada rujukan terkait.</p>
              )}
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </>
  );
}
