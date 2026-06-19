import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getReferenceItemBySlug } from "@/lib/data-server";
import { getSiteContent } from "@/lib/data-server";
import { Calendar, User, Tag, ArrowLeft, ArrowUpRight, BookOpen, CheckSquare, BarChart3, Globe } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo";


import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // Cache ISR hourly

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getReferenceItemBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  
  if (!item) {
    return {
      title: 'Referensi Tidak Ditemukan | Zadit Growth',
    };
  }

  const title = `${item.title} | Bank Referensi Zadit Growth`;
  const description = item.summary || `Dokumen referensi dan panduan teknis mengenai ${item.title} di Bank Referensi Zadit Growth.`;
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(item.title)}&type=reference&subtitle=${encodeURIComponent(description.substring(0, 110))}`;

  return {
    title,
    description,
    keywords: item.tags?.join(', ') || 'reference, growth, architecture',
    alternates: {
      canonical: `/sovereign-explorer/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/sovereign-explorer/${slug}`,
      type: 'article',
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

export default async function ReferenceDetailPage({ params }: Props) {

  const { slug } = await params;
  const item = await getReferenceItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    try {
      const d = dateString ? new Date(dateString) : new Date();
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return "Juni 2026";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'growth-playbook':
        return <BookOpen className="w-5 h-5 text-teal-accent" />;
      case 'seo-checklist':
        return <CheckSquare className="w-5 h-5 text-emerald-500" />;
      case 'market-benchmark':
        return <BarChart3 className="w-5 h-5 text-gold-accent" />;
      case 'civic-data':
        return <Globe className="w-5 h-5 text-blue-500" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'growth-playbook': return 'Growth Playbook';
      case 'seo-checklist': return 'SEO Checklist';
      case 'market-benchmark': return 'Market Benchmark';
      case 'civic-data': return 'Civic Data';
      default: return category;
    }
  };

  // Generate dynamic JSON-LD Schema
  const articleObj = generateArticleSchema(item);
  const breadcrumbObj = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Bank Referensi", path: "/sovereign-explorer" },
    { name: item.title, path: `/sovereign-explorer/${item.slug}` }
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
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Breadcrumb & Go Back */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-text-muted">
            <nav className="flex gap-2 items-center">
              <Link href="/" className="hover:text-teal-accent">Home</Link>
              <span>/</span>
              <Link href="/sovereign-explorer" className="hover:text-teal-accent">Bank Referensi</Link>
              <span>/</span>
              <span className="text-text-primary font-medium truncate max-w-xs">{item.title}</span>
            </nav>
            <Link 
              href="/sovereign-explorer" 
              className="inline-flex items-center gap-1.5 hover:text-teal-accent font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Bank Referensi
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Area (8 Columns) */}
            <article className="lg:col-span-8 bg-white border border-brand-border rounded-3xl p-6 md:p-10 shadow-xs space-y-6">
              
              {/* Category & Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-offwhite px-3 py-1 rounded-full border border-brand-border text-text-primary uppercase font-medium">
                  {getCategoryIcon(item.category)}
                  {getCategoryLabel(item.category)}
                </span>
                {item.source_name && (
                  <span className="text-xs font-mono text-gold-accent border-l border-brand-border pl-2.5">
                    Ref: {item.source_name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-heading-serif font-bold text-text-primary leading-tight">
                {item.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-xs font-mono text-text-muted border-y border-brand-border/60 py-3.5">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-accent" /> Oleh Zadit Growth
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-accent" /> Rilis: {formatDate(item.created_at)}
                </span>
              </div>

              {/* Main HTML Content */}
              <div 
                className="prose prose-teal max-w-none prose-sm md:prose-base text-text-primary leading-relaxed space-y-4 font-sans
                           prose-headings:font-heading-sans prose-headings:font-bold prose-headings:text-text-primary
                           prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-h4:text-base prose-h4:mt-4 prose-h4:mb-1
                           prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                           prose-strong:font-bold prose-code:font-mono prose-code:bg-offwhite prose-code:px-1 prose-code:rounded prose-code:text-teal-accent"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />

            </article>

            {/* Right Sidebar (4 Columns) */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Reference Info Card */}
              <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-mono text-text-primary uppercase tracking-wider border-b border-brand-border pb-2 font-bold">
                  {'// METADATA REFERENSI'}
                </h3>
                
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="block text-text-muted font-mono uppercase text-[9px] tracking-wider mb-1">Status Validasi</span>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
                      Terverifikasi Ahli
                    </span>
                  </div>

                  {item.source_name && (
                    <div>
                      <span className="block text-text-muted font-mono uppercase text-[9px] tracking-wider mb-1">Sumber Utama</span>
                      <span className="text-text-primary font-medium">{item.source_name}</span>
                    </div>
                  )}

                  {item.source_url && (
                    <div>
                      <span className="block text-text-muted font-mono uppercase text-[9px] tracking-wider mb-1">Tautan Sumber</span>
                      <a 
                        href={item.source_url} 
                        target="_blank" 
                        rel="nofollow noopener noreferrer"
                        className="text-teal-accent hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        Lihat Sumber Eksternal <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div>
                    <span className="block text-text-muted font-mono uppercase text-[9px] tracking-wider mb-1">Tag Artikel</span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-mono bg-offwhite border border-brand-border px-2 py-0.5 rounded text-text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA B2B Consultant */}
              <div className="bg-brand-slate border border-brand-mid rounded-3xl p-6 text-white space-y-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-accent/10 rounded-full blur-2xl" />
                <h3 className="text-lg font-heading-sans font-bold text-white leading-tight">
                  Terapkan Data ini di Bisnis Anda
                </h3>
                <p className="text-xs text-text-inverse/70 leading-relaxed">
                  Ingin merancang sistem teknis SEO sub-detik atau mengintegrasikan telemetri data pasar di platform B2B Anda? Hubungi Zadit untuk konsultasi arsitektur digital gratis.
                </p>
                <Link 
                  href="/#partnership"
                  className="block text-center bg-teal-accent hover:bg-teal-glow text-text-inverse text-xs font-heading-sans font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-200"
                >
                  Konsultasi Sekarang
                </Link>
              </div>

            </aside>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
