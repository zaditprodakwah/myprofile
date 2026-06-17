const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '/Users/mac/Downloads/ZADITPROFILE/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      value = value.replace(/^"|"\s*$/g, '');
    }
    env[key] = value;
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, serviceKey);

async function runSeed() {
  console.log('Starting seed update...');

  // 1. Update site_content
  console.log('Updating site_content...');
  const siteContentItems = [
    {
      section_key: 'hero_headline',
      content_type: 'text',
      value: 'Dari Kata ke Konversi. Dari Data ke Dominasi.'
    },
    {
      section_key: 'hero_subheading',
      content_type: 'text',
      value: 'Saya membantu UMKM, instansi, dan lembaga publik merancang strategi pemasaran 360°, optimasi SEO teknis, dan copywriting konversi yang mengamankan pertumbuhan bisnis secara sistematis.'
    },
    {
      section_key: 'process_title',
      content_type: 'text',
      value: 'Metodologi Pertumbuhan Terpadu'
    },
    {
      section_key: 'process_subtitle',
      content_type: 'text',
      value: 'Proses kerja terukur yang dirancang untuk mengamankan kejelasan pesan, kecepatan web, dan konversi maksimal.'
    },
    {
      section_key: 'partnership_title',
      content_type: 'text',
      value: 'Mari Bangun Sistem Bersama'
    },
    {
      section_key: 'partnership_subtitle',
      content_type: 'text',
      value: 'Formulir diagnosis singkat kemitraan. Isi dalam 60 detik untuk mendapatkan rekomendasi awal langsung dari Zadit.'
    }
  ];

  for (const item of siteContentItems) {
    const { error } = await supabase
      .from('site_content')
      .upsert(item, { onConflict: 'section_key' });
    if (error) console.error(`Error upserting site_content [${item.section_key}]:`, error.message);
  }

  // 2. Update services
  console.log('Resetting and updating services...');
  const { error: deleteServicesError } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteServicesError) console.error('Error clearing services:', deleteServicesError.message);

  const servicesItems = [
    {
      title: 'Branding & Digital Marketing Strategy',
      subtitle: '360° Pemasaran',
      description: 'Penyusunan strategi pemasaran komprehensif menggunakan framework 4C Diamond dan 4P Marketing. Analisis persona audiens mendalam untuk menyelaraskan pain points konsumen dengan solusi bisnis Anda.',
      icon_name: 'Globe',
      tags: ['360° Marketing', '4C Diamond', '4P Framework', 'Brand Strategy'],
      display_order: 0,
      size: 'large',
      is_active: true
    },
    {
      title: 'SEO & Content Marketing',
      subtitle: 'Visibilitas AI & SERP',
      description: 'Riset kata kunci (keyword research) intensif, optimasi SERP Snippet (meta title, description, URL friendly), dan penulisan konten teroptimasi tinggi yang disukai Google maupun mesin AI.',
      icon_name: 'Search',
      tags: ['On-Page SEO', 'Keyword Research', 'SERP Optimization', 'Content Strategy'],
      display_order: 1,
      size: 'small',
      is_active: true
    },
    {
      title: 'Penyusunan Kampanye & Media Planning',
      subtitle: 'KOL & Media Mix',
      description: 'Perancangan kampanye digital terintegrasi, media planning dengan alokasi budget efisien, dan penyusunan draf instruksi influencer (KOL Content Brief) untuk hasil optimal.',
      icon_name: 'FileText',
      tags: ['Media Planning', 'KOL Briefing', 'Funnel Execution', 'Creative Content'],
      display_order: 2,
      size: 'small',
      is_active: true
    },
    {
      title: 'Audit Performa & SEO Teknis',
      subtitle: 'Kecepatan & Core Web Vitals',
      description: 'Pengujian responsivitas mobile, audit tautan rusak (broken link check), optimasi Core Web Vitals (LCP, CLS, FID), dan peningkatan kecepatan loading situs web secara terukur.',
      icon_name: 'BarChart3',
      tags: ['PageSpeed Audit', 'Broken Link Check', 'Core Web Vitals', 'Mobile-Friendly'],
      display_order: 3,
      size: 'large',
      is_active: true
    },
    {
      title: 'Administrasi & Manajemen Operasional',
      subtitle: 'Efisiensi Kerja',
      description: 'Pengalaman memimpin tim administratif, manajemen operasional harian organisasi, dan pemanfaatan sistem kerja digital terstruktur (Google Workspace/MS Office) untuk akurasi data maksimal.',
      icon_name: 'PenTool',
      tags: ['Team Leadership', 'Office Admin', 'Data Accuracy', 'Google Workspace'],
      display_order: 4,
      size: 'large',
      is_active: true
    }
  ];

  const { error: insertServicesError } = await supabase.from('services').insert(servicesItems);
  if (insertServicesError) console.error('Error inserting services:', insertServicesError.message);

  // 3. Update case_studies
  console.log('Resetting and updating case_studies...');
  const { error: deleteCaseError } = await supabase.from('case_studies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteCaseError) console.error('Error clearing case studies:', deleteCaseError.message);

  const caseStudiesItems = [
    {
      sector_badge: 'Audit & Optimasi SEO',
      client_name: 'tirto.id',
      challenge: 'Kecepatan muat lambat (mobile score 50/100, LCP 4.5s) dan isu broken links.',
      approach: 'Technical audit komprehensif, kompresi gambar WebP, minifikasi CSS/JS, dan redireksi 301.',
      metrics: [
        { label: 'Kecepatan LCP Target', value: '< 2.5s', number: 2.5 },
        { label: 'PageSpeed Mobile Target', value: '90+', number: 90 }
      ],
      testimonial_text: 'Optimasi SEO on-page dan technical audit yang dirumuskan memberikan arahan terstruktur untuk meningkatkan kecepatan pemuatan halaman dan visibilitas di Google.',
      testimonial_author: 'M. Khoiruzzadittaqwa',
      testimonial_role: 'SEO Specialist Candidate',
      tech_tags: ['Technical Audit', 'PageSpeed Insights', 'On-Page SEO'],
      display_order: 0,
      is_active: true
    },
    {
      sector_badge: 'Brand Campaign & Media Planning',
      client_name: 'tiket.com',
      challenge: 'Meningkatkan keterlibatan pengguna aktif, menarik pengguna baru, dan mengaktifkan kembali pengguna dormant.',
      approach: 'Merancang kampanye "Level Up Rewards" & "Referral Bonanza", serta menyusun alokasi media mix.',
      metrics: [
        { label: 'Alokasi Digital Marketing', value: '60%', number: 60 },
        { label: 'Alokasi Sosial Media', value: '30%', number: 30 }
      ],
      testimonial_text: 'Perencanaan strategi 360° digital marketing yang memetakan persona audiens Budi, Andi, dan Cici dengan pain points mereka secara presisi.',
      testimonial_author: 'M. Khoiruzzadittaqwa',
      testimonial_role: 'Digital Marketing Specialist',
      tech_tags: ['Media Planning', 'Customer Persona', 'Campaign Brief'],
      display_order: 1,
      is_active: true
    },
    {
      sector_badge: 'Influencer & Community Marketing',
      client_name: 'vidio.com',
      challenge: 'Menyebarkan informasi hak siar Piala Dunia secara fleksibel dan terjangkau (Rp50.000).',
      approach: 'Menyusun draf KOL Content Brief (TikTok/Instagram Reels) dengan alur Opening-Body-CTA yang persuasif.',
      metrics: [
        { label: 'Biaya Langganan Akses', value: 'Rp50k', number: 50 },
        { label: 'Durasi Video KOL', value: '30-60s', number: 45 }
      ],
      testimonial_text: 'Brief KOL yang terstruktur dengan skenario opening "Bosan nonton di TV?" dan CTA persuasif untuk mendorong konversi langsung.',
      testimonial_author: 'M. Khoiruzzadittaqwa',
      testimonial_role: 'KOL Specialist Candidate',
      tech_tags: ['KOL Briefing', 'TikTok Strategy', 'Content Flow'],
      display_order: 2,
      is_active: true
    }
  ];

  const { error: insertCaseError } = await supabase.from('case_studies').insert(caseStudiesItems);
  if (insertCaseError) console.error('Error inserting case studies:', insertCaseError.message);

  // 4. Update system_configs
  console.log('Updating system_configs...');
  const systemConfigs = [
    { key: 'site_title', value: 'Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect' },
    { key: 'whatsapp_number', value: '6282316363177' }
  ];

  for (const config of systemConfigs) {
    const { error } = await supabase
      .from('system_configs')
      .upsert({ key: config.key, value: JSON.stringify(config.value) }, { onConflict: 'key' });
    if (error) console.error(`Error updating config [${config.key}]:`, error.message);
  }

  // 5. Update articles table with the new static article
  console.log('Inserting real premium UI/UX article into articles table...');
  const uiuxArticle = {
    title: 'Rekomendasi Riset Libraries & Resources UI/UX Premium Next.js',
    slug: 'rekomendasi-riset-libraries-resources-ui-ux-premium-nextjs',
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
    meta_title: 'Rekomendasi Riset Libraries & Resources UI/UX Premium Next.js | Zadit Growth Blog',
    meta_description: 'Kumpulan rekomendasi libraries gerakan (Motion), komponen interaktif (Aceternity UI, Magic UI, HeroUI), rendering 3D (React Three Fiber), dan optimasi performa.',
    semantic_keywords: ['ui/ux', 'nextjs', 'react', 'motion', 'r3f', 'design system'],
    faq_items: [
      { question: 'Apa library animasi terbaik untuk Next.js?', answer: 'Motion (sebelumnya Framer Motion) adalah standar utama untuk animasi smooth dan gesture di Next.js.' },
      { question: 'Bagaimana cara menambahkan interaksi 3D premium di website?', answer: 'Gunakan React Three Fiber (R3F) yang dikombinasikan dengan Framer Motion untuk perpaduan elemen 2D dan 3D yang interaktif.' },
      { question: 'Apakah React Three Fiber berat di HP/mobile?', answer: 'Bisa cukup berat. Solusinya adalah menggunakan lazy load, level of detail (LOD) yang dinamis, atau menyembunyikan efek 3D berat pada layar kecil.' }
    ],
    is_published: true,
    published_at: new Date().toISOString()
  };

  const { error: articleError } = await supabase
    .from('articles')
    .upsert(uiuxArticle, { onConflict: 'slug' });
  
  if (articleError) {
    console.error('Error inserting UI/UX article:', articleError.message);
  } else {
    console.log('UI/UX article inserted successfully.');
  }

  console.log('Database seeding updated successfully!');
}

runSeed();
