import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { getArticles } from "@/lib/data-server";

export const revalidate = 3600; // ISR cache 1 hour

export default async function BlogIndexPage() {
  const articles = await getArticles();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Zadit Growth Blog",
    "description": "Wawasan taktis tentang SEO teknikal, rekayasa web Next.js, dan optimasi konversi digital.",
    "publisher": {
      "@type": "Person",
      "name": "Muhammad Khoiruzzadittaqwa"
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return 'Juni 2026';
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Breadcrumb */}
          <nav className="text-xs font-mono text-text-muted flex gap-2 items-center">
            <Link href="/" className="hover:text-teal-accent">Home</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Blog</span>
          </nav>

          {/* Heading */}
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">Artikel & Wawasan Pertumbuhan</span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
              Wawasan Pertumbuhan & SEO
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed">
              Kumpulan panduan teknis, riset E-E-A-T, analisis optimasi mesin pencari, dan rekayasa web konversi untuk mendominasi lanskap digital.
            </p>
          </div>

          {/* Blog Cards List */}
          <div className="space-y-6 pt-4">
            {articles.map((art) => (
              <Link
                key={art.slug}
                href={`/blog/${art.slug}`}
                className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 hover:border-teal-accent transition-all duration-300 hover:shadow-md group flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                    <BookOpen className="w-3.5 h-3.5 text-teal-accent" />
                    <span>{formatDate(art.published_at)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 4 Menit Baca
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors leading-snug">
                    {art.title}
                  </h2>
                  <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
                    {art.meta_description}
                  </p>
                </div>

                <div className="flex items-center justify-start md:justify-end flex-shrink-0">
                  <span className="text-xs font-semibold text-teal-accent group-hover:underline flex items-center gap-1">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
