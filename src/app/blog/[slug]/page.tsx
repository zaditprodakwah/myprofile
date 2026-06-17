import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { routeLLM } from "@/lib/llm-router";
import { supabase } from "@/lib/supabase";
import { ChevronRight, ArrowLeft, Send, Clock } from 'lucide-react';
import Link from 'next/link';

interface Article {
  title: string;
  slug: string;
  original_url: string;
  content: string;
  semantic_keywords: string;
  faq_items: Array<{ question: string; answer: string }>;
}

// Generate human-friendly title from slug
function getTitleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Dynamic server-side SEO/AEO AGC Article page
export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  let article: Article | null = null;

  try {
    // 1. Check if article exists in Supabase
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (slug === 'rekomendasi-riset-libraries-resources-ui-ux-premium-nextjs') {
      article = {
        title: 'Rekomendasi Riset Libraries & Resources UI/UX Premium Next.js',
        slug: 'rekomendasi-riset-libraries-resources-ui-ux-premium-nextjs',
        original_url: '',
        content: `
          <p><strong>Rekomendasi riset libraries, repo, dan resources terbaik</strong> untuk membangun UI/UX frontend & Design System di proyek React/Next.js/TypeScript yang mewah, premium, unik, 3D/animatif, interaktif, responsif, high-performance (khususnya mobile), dan luxurious di desktop.</p>

          <h2>1. Core Animation & Motion Library (Wajib)</h2>
          <p><strong>Motion (sebelumnya Framer Motion)</strong> adalah standar de facto untuk animasi smooth, gesture, scroll-driven, layout animations, dan micro-interactions. Ringan, performa tinggi, dan sangat kompatibel dengan Next.js (termasuk dukungan React 19). Gunakan untuk membuat feel "premium" dengan parallax, hover effects, dan transitions mewah.</p>
          <ul>
            <li><strong>Docs:</strong> <a href="https://motion.dev" target="_blank" rel="noopener noreferrer">motion.dev</a></li>
            <li><strong>Contoh Premium:</strong> Banyak situs pemenang Awwwards menggunakan library ini sebagai fondasi interaksinya.</li>
          </ul>

          <h2>2. Animated & Premium Component Libraries (Copy-Paste Style)</h2>
          <p>Untuk mempercepat visualisasi prototipe tanpa membuang waktu mendesain dari nol, kombinasi library berikut sangat disarankan:</p>
          <ul>
            <li><strong>Aceternity UI</strong> (<a href="https://ui.aceternity.com" target="_blank" rel="noopener noreferrer">ui.aceternity.com</a>): 200+ komponen cantik dengan Tailwind + Framer Motion. Sangat unik, animatif, cocok untuk landing pages mewah/SaaS. Banyak efek glow, 3D-like cards, parallax, dan interactive elements. Dipercaya oleh ribuan developer.</li>
            <li><strong>Magic UI</strong> (<a href="https://magicui.design" target="_blank" rel="noopener noreferrer">magicui.design</a>): 150++ animated components & effects (React, TS, Tailwind, Motion). Companion sempurna untuk <strong>shadcn/ui</strong>. Fokus pada landing pages premium dengan particle effects, text animations, dll. Open-source dan sangat populer.</li>
            <li><strong>HeroUI (sebelumnya NextUI)</strong> (<a href="https://heroui.com" target="_blank" rel="noopener noreferrer">heroui.com</a>): Beautiful by default, dibangun di atas React Aria + Tailwind. Animasi sangat smooth, mendukung dark mode, dan memiliki aksesibilitas tinggi secara default.</li>
          </ul>
          <p><strong>shadcn/ui + extensions (basis terbaik untuk custom premium):</strong></p>
          <ul>
            <li>Mulai dengan <strong>shadcn/ui</strong> (unstyled primitives dari Radix + Tailwind, full control & TypeScript native).</li>
            <li>Tambahkan Aceternity/Magic UI, atau paid blocks seperti Shadcnblocks.com, Shadcn Studio, dll. Banyak repo GitHub dengan shadcn-fintech, sci-fi themes, dan animated bento grids.</li>
          </ul>

          <h2>3. 3D & Immersive Experiences</h2>
          <ul>
            <li><strong>React Three Fiber (R3F) + @react-three/drei:</strong> Renderer Three.js untuk React. Declarative, mudah diintegrasikan dengan state React. Sangat cocok untuk model 3D, interactive scenes, shaders, product viewers, atau background mewah.
              <ul>
                <li>Kombinasikan dengan Framer Motion untuk hybrid 2D/3D.</li>
                <li>Contoh & Tutorial: <a href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction" target="_blank" rel="noopener noreferrer">docs.pmnd.rs</a>, saluran YouTube Wawa Sensei, atau Anderson Mancini untuk landing page 3D.</li>
                <li>Performa mobile: Optimasi dengan suspense, LOD (Level of Detail), dan matikan efek berat di layar kecil.</li>
              </ul>
            </li>
            <li><strong>Lamina & drei helpers:</strong> Untuk advanced materials & effects shading.</li>
          </ul>

          <h2>4. Design System & Tailwind-First Premium</h2>
          <ul>
            <li><strong>Tailwind CSS + shadcn/ui:</strong> Sebagai fondasi paling fleksibel untuk luxury custom look.</li>
            <li><strong>Untitled UI, AlignUI, Tailwind Plus (Tailwind UI):</strong> Koleksi components profesional, responsive, dan customizable.</li>
            <li><strong>Radix UI + React Aria:</strong> Primitives headless untuk build design system sendiri dengan aksesibilitas & interaktivitas premium.</li>
          </ul>

          <h2>5. Resources & Repos Lainnya</h2>
          <ul>
            <li><strong>Awwwards + Motion websites:</strong> Cari inspirasi situs dengan Framer Motion/R3F untuk mempelajari luxury feel.</li>
            <li><strong>GitHub Awesome lists:</strong> <code>brillout/awesome-react-components</code> dan <code>birobirobiro/awesome-shadcn-ui</code>.</li>
            <li><strong>Figma kits:</strong> Cocokkan Figma design dengan shadcn (shadcn Studio, dll.) untuk workflow design-to-code yang smooth.</li>
            <li><strong>Performance Tips:</strong>
              <ul>
                <li>Gunakan Next.js App Router + Server Components.</li>
                <li>Lazy load 3D/animasi berat menggunakan dynamic imports.</li>
                <li>Optimalkan gambar menggunakan komponen Next Image dan lakukan bundle analysis secara berkala.</li>
                <li>Lakukan pengujian intensif di mobile: R3F bisa sangat berat, prioritaskan fallback atau reduced effects.</li>
              </ul>
            </li>
          </ul>

          <h2>Kesimpulan: Stack Rekomendasi Utama untuk "Mewah & Unik"</h2>
          <ol>
            <li>Next.js App Router + TypeScript</li>
            <li>Tailwind CSS v4</li>
            <li>shadcn/ui + Aceternity/Magic UI</li>
            <li>Motion untuk animasi</li>
            <li>React Three Fiber untuk 3D elements secara selektif</li>
            <li>Custom Design Tokens + Dark Mode</li>
          </ol>
        `,
        semantic_keywords: 'ui/ux, nextjs, react, framer motion, react three fiber, design system, premium',
        faq_items: [
          { question: 'Apa library animasi terbaik untuk Next.js?', answer: 'Motion (sebelumnya Framer Motion) adalah standar utama untuk animasi smooth dan gesture di Next.js.' },
          { question: 'Bagaimana cara menambahkan interaksi 3D premium di website?', answer: 'Gunakan React Three Fiber (R3F) yang dikombinasikan dengan Framer Motion untuk perpaduan elemen 2D dan 3D yang interaktif.' },
          { question: 'Apakah React Three Fiber berat di HP/mobile?', answer: 'Bisa cukup berat. Solusinya adalah menggunakan lazy load, level of detail (LOD) yang dinamis, atau menyembunyikan efek 3D berat pada layar kecil.' }
        ]
      };
    } else if (data) {
      article = {
        title: data.title,
        slug: data.slug,
        original_url: data.original_url || '',
        content: data.content,
        semantic_keywords: Array.isArray(data.semantic_keywords) ? data.semantic_keywords.join(', ') : data.semantic_keywords || '',
        faq_items: Array.isArray(data.faq_items) ? data.faq_items : [],
      };
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

      const { error: insertError } = await supabase
        .from('articles')
        .insert(newArticle);

      if (insertError) {
        console.warn('Could not save AGC article to Supabase database', insertError);
      }

      article = {
        title: newArticle.title,
        slug: newArticle.slug,
        original_url: '',
        content: newArticle.content,
        semantic_keywords: newArticle.semantic_keywords.join(', '),
        faq_items: newArticle.faq_items
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": article.title,
        "author": {
          "@type": "Person",
          "name": "Muhammad Khoiruzzadittaqwa",
          "jobTitle": "Full-Stack Growth Architect"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Zadit Growth Engine"
        },
        "datePublished": new Date().toISOString()
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqList
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
      
      {/* Reading progress bar */}
      <div className="scroll-progress" />

      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Article Content (Left - 8 columns) */}
          <article className="lg:col-span-8 space-y-6">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary uppercase tracking-wider transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali Ke Blog
            </Link>

            <div className="space-y-4">
              <span className="text-xs font-mono text-gold-accent tracking-widest uppercase">Wawasan Pertumbuhan</span>
              <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
                {article.title}
              </h1>
              <p className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted">
                Penulis: Muhammad Khoiruzzadittaqwa | <Clock className="w-3.5 h-3.5 text-teal-accent" /> 4 Menit Baca
              </p>
            </div>

            {/* Rich text container */}
            <div 
              className="prose max-w-none prose-sm md:prose-base text-text-muted leading-relaxed space-y-6 pt-6 border-t border-brand-border prose-headings:text-text-primary prose-headings:font-heading-sans prose-a:text-teal-accent"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

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
            <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-6 shadow-sm">
              <h3 className="font-heading-sans font-bold text-text-primary text-lg">Butuh Implementasi Serupa?</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Seluruh ekosistem blog otomatis ramah pencarian, performa website cepat, dan sistem indeks konten instan ini bisa diintegrasikan langsung untuk bisnis Anda.
              </p>
              
              <a
                href={`https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20sistem%20blog%20otomatis%20dan%20optimasi%20pencarian%20seperti%20artikel%20${article.slug}.%20Mari%20jadwalkan%20diskusi!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-sm text-xs"
              >
                Konsultasikan Sekarang <Send className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-mono text-text-primary uppercase tracking-wider mb-4">ARTIKEL LAIN</h4>
              <ul className="space-y-3 text-xs">
                <li>
                  <Link href="/blog/cara-optimasi-web-umkm-indonesia" className="text-text-muted hover:text-teal-accent flex items-center gap-1.5 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-accent" /> Cara Optimasi Web UMKM Indonesia
                  </Link>
                </li>
                <li>
                  <Link href="/blog/mengapa-ai-search-mengubah-cara-kita-menulis-konten" className="text-text-muted hover:text-teal-accent flex items-center gap-1.5 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-accent" /> Mengapa AI Search Mengubah Cara Menulis Konten
                  </Link>
                </li>
                <li>
                  <Link href="/blog/panduan-seo-teknikal-nextjs" className="text-text-muted hover:text-teal-accent flex items-center gap-1.5 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-accent" /> Panduan SEO Teknikal Next.js 16
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </>
  );
}
