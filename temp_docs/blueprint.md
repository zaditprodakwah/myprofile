# **🤖 MASTER PROMPT & ADVANCED ARCHITECTURE BLUEPRINT**

**Project:** Profil Web Eksekutif, B2B Portfolio, Knowledge-Edu Showcase & Industry Radar

**Owner:** Muhammad Khoiruzzadittaqwa (Zadit)

**Persona:** Senior Full-Stack Architect, Growth Hacker, Digital Marketing Strategist, & Academic/Business Consultant.

## **⚠️ SYSTEM INSTRUCTIONS FOR AI CODER**

Act as a Staff/Principal Software Engineer, Technical SEO Expert, and Conversion Rate Optimization (CRO) Specialist. Build a high-performance, conversion-optimized personal web profile and programmatic hub based on the exact specifications in this document. Apply advanced growth hacks, strictly adhere to Core Web Vitals constraints, and implement the specific data architecture using Next.js, Supabase, Vercel, Resend, and CMDK.

## **1\. TECH STACK & INFRASTRUCTURE**

* **Frontend Framework:** Next.js 14+ (App Router). Strict use of React Server Components (RSC). Client Components only at the leaves of the tree.  
* **Backend & Database:** Supabase (PostgreSQL untuk menyimpan data form inquiries, analitik interaksi, dan agregasi RSS).  
* **Communication & Notifications (Smart Form):**  
  * **Email:** Resend API (mengirim output log/notifikasi ke muhzadit@gmail.com).  
  * **WhatsApp:** Integrasi API pihak ketiga ATAU *Smart Redirect Generator* ke https://wa.me/6282316363177 dengan *pre-filled text* dinamis.  
* **Smart Search & UI:** cmdk (Command Palette) untuk pencarian global, Tailwind CSS \+ Radix UI \+ Framer Motion.  
* **Deployment & CI/CD:** Vercel (Edge computing, Vercel Cron Jobs) terintegrasi otomatis dengan GitHub Repository.  
* **State & Data Fetching:** SWR atau React Query untuk *client-side fetching*.  
* **Performance Constraints (Core Web Vitals \- Strict):**  
  * **LCP:** \< 1.2s. (Gunakan next/image dengan priority=true).  
  * **INP:** \< 200ms. Hindari *main-thread blocking*.  
  * **CLS:** Wajib 0.00. Set *explicit width/height*.  
  * **Lighthouse Target:** 100/100/100/100.

## **2\. THE HERO ENGINE: AUDIENCE-CENTRIC & EEAT FOCUS**

Hero Section adalah **Segmented Hub** dengan desain *Compact & Focus Mode*:

* **Focus Mode UI:** Latar belakang redup (*ambient dimming*) yang menyoroti (*spotlight effect*) pada tipografi Headline.  
* **Immediate EEAT Proofing:** Letakkan *micro-badges* (Chips) di bawah Sub-headline: "Rp 85M+ Managed Budget", "Distinction Fullstack Digmar", "Data-Driven Academic Methodology".  
* **Audience-Centric Dynamic CTA (Segmentasi):** Modul interaktif (*tabs/bento cards* kecil) untuk rute khusus: Enterprise (/services\#digital-marketing), Academic (/services\#academic), Executive (/services\#business).

## **3\. ADVANCED GROWTH HACK & SMART UI/UX**

* **Smart Search (Command Palette \- Cmd \+ K):** Menu pencarian melayang untuk *fuzzy search* lintas data (Case Studies, Profil, Radar, dan Layanan).  
* **Smart Nav (Context-Aware Navigation):** Di artikel *Case Study*, navigasi atas otomatis berubah menjadi *Reading Progress Bar* dan tombol *Share/Back*.  
* **Programmatic SEO (pSEO):** Routing dinamis /solutions/\[industry\] yang me-render halaman B2B Landing Pages secara terprogram.  
* **GEO & E-E-A-T:** Format konten *Executive Summary* di puncak halaman menggunakan \<p id="executive-summary"\>.

## **4\. SMART INQUIRY ENGINE (ADVANCED FORM LOGIC)**

* **Conditional Routing & Database Sync:**  
  1. Pengguna mengisi *multi-step wizard* (Tujuan, Tantangan Bisnis, Skala/Budget).  
  2. Saat *Submit*, data **WAJIB** disimpan ke Supabase (inquiries table).  
  3. **Routing Output:** *Formal/B2B Besar* \-\> Resend Email. *Urgent/Konsultasi Akademik/Cepat* \-\> Redirect WA 082316363177 dengan teks dinamis.  
* **Smart Validation:** Menggunakan zod untuk validasi HP dan Email.

## **5\. MULTI-RSS AGGREGATOR SYSTEM (THE "INDUSTRY RADAR")**

* **Arsitektur:** Vercel Cron Jobs (setiap 4 jam) \-\> rss-parser \-\> Supabase \-\> Render di /radar menggunakan ISR.  
* **SEO Safety Rules:** Wajib rel="nofollow noopener noreferrer" pada external link, gunakan tag rel="canonical".

## **6\. PAGE-BY-PAGE OUTLINE & CONTENT ARCHITECTURE**

Implementasikan struktur UI/UX berikut secara presisi untuk setiap rute halaman:

### **A. Rute / (Home Profile)**

1. **Context-Aware Header:** Logo statis kiri, Menu Kanan, dan tombol Cmd+K Search.  
2. **Segmented Hero Hub:** Sesuai spesifikasi di Bagian 2\.  
3. **The Trust Bar (Marquee):** Menampilkan logo klien/sertifikasi.  
4. **Identity & Philosophy Section:** Teks pengantar tentang *Academic Harm Reduction*, latar pendidikan S1 Matematika, dan rekam jejak.  
5. **Pinned Case Studies:** 2-3 Kartu proyek unggulan.  
6. **Smart Inquiry Form:** Formulir di dasar halaman.

### **B. Rute /services (Knowledge-Edu & Service Showcase) \[NEW\]**

1. **Header:** "Strategic Solutions for Every Scale."  
2. **Cluster Layout (Tab/Scroll-Spy Section):**  
   * **Section 1: Digital Marketing & Reputation:** Menampilkan layanan agensi (SEO, Ads Budgeting, Copywriting) dengan referensi ke portofolio (Skintific, Vidio).  
   * **Section 2: Academic Excellence (Knowledge-Edu):** Menampilkan paket bimbingan tugas akhir, olah data, dan penyusunan makalah. UI menggunakan gaya *Pricing/Service Card* yang elegan dan edukatif.  
   * **Section 3: Business & General Needs:** Menampilkan layanan pembuatan slide presentasi, riset data, dan dokumen bisnis.  
3. **Service Details Modal:** Saat layanan diklik, muncul modal *slide-over* berisi "Deliverables", "Timeline", dan tombol CTA "Request this Service".

### **C. Rute /case-studies (Portfolio Grid)**

1. **Header:** "Engineering Growth Through Evidence."  
2. **Smart Filter Tabs:** "All", "SEO & Data", "Campaign & Marketing", "Engineering", "Academic Research".  
3. **Grid Layout:** Kartu proyek menampilkan *Cover Image*, Judul, Brand, dan 3 *Tech Stack Tags*.

### **D. Rute /case-studies/\[slug\] (Dynamic Detail)**

1. **Hero Article:** Cover Image besar, Judul H1, Role, dan Brand.  
2. **AEO Executive Summary:** Blok teks khusus di bawah judul (Font lebih besar/bold) dengan ID \#executive-summary.  
3. **Content Grid (2 Kolom Dinamis):**  
   * *Kiri (Main Content):* The Brief, The Strategy, Execution, Results.  
   * *Kanan (Sticky Sidebar):* Metrics Highlight, Tech Stack.  
4. **Internal Linking Module:** "Related Strategic Solutions".

### **E. Rute /radar (Industry Radar) & /legal (Privacy SLA)**

* Dashboard aggregator berita SEO/Tech dan halaman legalitas operasional "Shadow Protocol".

## **7\. MASTER DATA INJECTION (JSON)**

Inject this exact JSON data. This payload contains comprehensive historical, educational, analytical portfolio data, AND the new serviceClusters specifically formatted for the /services showcase.

{  
  "heroData": {  
    "hook": "Architecting Systems. Engineering Growth. Elevating Knowledge.",  
    "subHook": "Saya merancang infrastruktur digital yang tahan banting, memetakan konversi pemasaran dengan ROI terukur, serta menyediakan asistensi akademik dan bisnis berbasis presisi data.",  
    "eeatBadges": \[  
      "Rp 85M+ Managed Campaign Budget",  
      "Distinction Certified Fullstack Digmar",  
      "S1 Matematika Data-Driven Approach"  
    \],  
    "segments": \[  
      {  
        "id": "marketing",  
        "icon": "TrendingUp",  
        "label": "Marketing & Agency",  
        "action": "Skalakan Konversi Digital",  
        "route": "/services\#digital-marketing",  
        "description": "Solusi Campaign Budgeting, SEO Audit, dan Brand Reputation B2B."  
      },  
      {  
        "id": "academic",  
        "icon": "GraduationCap",  
        "label": "Academic & Education",  
        "action": "Asistensi Tugas & Riset",  
        "route": "/services\#academic",  
        "description": "Bimbingan tugas akhir, pengolahan data, dan penyusunan jurnal."  
      },  
      {  
        "id": "business",  
        "icon": "Briefcase",  
        "label": "Business & General",  
        "action": "Riset & Dokumen Profesional",  
        "route": "/services\#business",  
        "description": "Pembuatan Pitch Deck, visualisasi data, dan penyusunan dokumen bisnis."  
      }  
    \]  
  },  
  "serviceClusters": \[  
    {  
      "id": "digital-marketing",  
      "clusterTitle": "Digital Marketing, Branding & Reputation",  
      "targetAudience": "Corporate, SME, & Agency Partners",  
      "description": "Solusi end-to-end untuk mendominasi pasar digital. Dari arsitektur anggaran kampanye bernilai miliaran hingga rekayasa reputasi melalui strategi SEO Off-Page yang agresif.",  
      "services": \[  
        {  
          "name": "Campaign Strategic & Budget Architecture",  
          "deliverables": \["Full-funnel media planning", "Budget Allocation Matrix", "Timeline & KPI Tracking"\],  
          "highlight": "Proven on Skintific (Rp 85M+ Budget)"  
        },  
        {  
          "name": "Advanced Off-Page SEO & Link Building",  
          "deliverables": \["DA 80+ Media Placement", "Spam Score Mitigation", "Semantic Siloing Strategy"\],  
          "highlight": "Proven on Vidio.com (World Cup Campaign)"  
        },  
        {  
          "name": "Brand Voice Engineering & Copywriting",  
          "deliverables": \["Tone of Voice Matrix", "Conversion Copywriting", "Content Pillar Strategy"\],  
          "highlight": "Proven on by.U (Telkomsel)"  
        }  
      \]  
    },  
    {  
      "id": "academic",  
      "clusterTitle": "Academic Excellence (Knowledge-Edu)",  
      "targetAudience": "Mahasiswa S1/S2, Peneliti, & Pelajar",  
      "description": "Asistensi akademis yang berpegang pada filosofi 'Academic Harm Reduction'. Menyediakan bimbingan komprehensif, riset metodologis, dan pengolahan data tanpa melanggar integritas intelektual.",  
      "services": \[  
        {  
          "name": "Bimbingan Tugas Akhir & Skripsi/Tesis",  
          "deliverables": \["Review Metodologi", "Struktur Penulisan Akademik", "Proofreading & Parafrase Anti-Plagiasi"\],  
          "highlight": "Berbasis Logika Sistematis"  
        },  
        {  
          "name": "Analisis & Visualisasi Data Akademik",  
          "deliverables": \["Pengolahan SPSS/Excel", "Interpretasi Data Kuantitatif", "Pembuatan Grafik & Tabel Riset"\],  
          "highlight": "Latar Belakang S1 Pendidikan Matematika"  
        },  
        {  
          "name": "Penyusunan Makalah & Manajemen Sitasi",  
          "deliverables": \["Riset Literatur Dasar", "Formatting Jurnal", "Manajemen Mendeley/Zotero"\],  
          "highlight": "Sesuai Standar APA/IEEE/Harvard"  
        }  
      \]  
    },  
    {  
      "id": "business",  
      "clusterTitle": "Business Operations & General Intelligence",  
      "targetAudience": "Eksekutif, Founder Startup, & Profesional",  
      "description": "Transformasi data mentah dan ide abstrak menjadi aset visual, presentasi meyakinkan, dan dokumen strategis yang memenangkan negosiasi.",  
      "services": \[  
        {  
          "name": "Pitch Deck & Presentation Design",  
          "deliverables": \["Executive Summary Structuring", "High-conversion Slide Design", "Data Storytelling"\],  
          "highlight": "Desain Kompak & Audiens-Sentris"  
        },  
        {  
          "name": "Business Data Visualization & Dashboard",  
          "deliverables": \["Automated Sheets/Excel", "Interactive Charts", "Competitor Matrix Reports"\],  
          "highlight": "Efisiensi Operasional Terukur"  
        },  
        {  
          "name": "Penyusunan Dokumen SOP & Copy Bisnis",  
          "deliverables": \["Standard Operating Procedures", "Business Proposal Writing", "Internal Communication Memos"\],  
          "highlight": "Tersetruktur & Mudah Dipahami"  
        }  
      \]  
    }  
  \],  
  "profile": {  
    "name": "Muhammad Khoiruzzadittaqwa",  
    "role": "Senior Full-Stack Architect, Strategist, & Academic Consultant",  
    "contacts": {  
      "email": "muhzadit@gmail.com",  
      "whatsapp": "6282316363177"  
    },  
    "education": \[  
      { "institution": "STAI Al-Bahjah, Cirebon", "degree": "S1 Pendidikan Matematika", "period": "2022 \- Masih", "note": "IPK: 3.71/4.00" }  
    \],  
    "experience": \[  
      {  
        "role": "Sekretaris Kepala Divisi",  
        "company": "Yayasan LPD Al-Bahjah Cirebon",  
        "period": "Maret 2021 \- Present",  
        "description": "Mengelola divisi pendidikan secara administratif berbasis teknologi cloud. Memimpin tim beranggotakan 5 orang dari admin sekretariat sub-divisi, menciptakan efisiensi operasional harian."  
      }  
    \]  
  },  
  "caseStudies": \[  
    {  
      "slug": "skintific-campaign-architecture",  
      "title": "Campaign Strategic, Timeline & Budgeting Architecture",  
      "brand": "Skintific",  
      "category": "Campaign & Marketing",  
      "executiveSummary": "Merancang ekosistem anggaran kampanye agresif senilai Rp 85M+ untuk \#SkintificGlowUpChallenge. Implementasi pemetaan omnichannel terukur yang dioptimasi untuk ROI maksimal.",  
      "metrics": \["Rp 85M+ Total Cost Allocation", "Cross-Platform Paid Ads Strategy"\],  
      "techStack": \["Performance Marketing", "Media Planning"\]  
    },  
    {  
      "slug": "video-com-seo-audit",  
      "title": "Off-Page SEO & Domain Authority Acquisition",  
      "brand": "Vidio.com",  
      "category": "SEO & Data",  
      "executiveSummary": "Ekseskusi audit SEO Off-Page komprehensif, mengidentifikasi peluang akuisisi backlink otoritas tinggi (DA 80+) dari media nasional untuk mendominasi keyword transaksional.",  
      "metrics": \["DA 80+ Link Mapping", "Spam Score Mitigation \<3%"\],  
      "techStack": \["Ahrefs", "AEO/GEO Optimization"\]  
    },  
    {  
      "slug": "academic-data-visualization-research",  
      "title": "Data Visualization & Academic Metodology Structuring",  
      "brand": "Academic Research",  
      "category": "Academic Research",  
      "executiveSummary": "Pengolahan data mentah kualitatif dan kuantitatif menjadi visualisasi tabel dan grafik yang memenuhi standar publikasi akademik. Dikerjakan dengan presisi metodologi pendidikan matematika.",  
      "metrics": \["100% Citation Accuracy", "SPSS/Excel Automated Modeling"\],  
      "techStack": \["Data Analysis", "Academic Writing", "Mendeley"\]  
    }  
  \]  
}

## **8\. EXECUTION PHASES (Actionable Commands for AI)**

* **Phase 1: Foundation.** Initialize Next.js app. Setup Tailwind with Dark Mode Native (\#020617 base). Install dependencies: framer-motion, lucide-react, cmdk, zod, react-hook-form, resend, @supabase/supabase-js.  
* **Phase 2: Database & API.** Buat lib/supabase.ts. Buat endpoint /api/inquiry yang menangani Supabase insert, Resend Email, dan conditional WA redirect.  
* **Phase 3: The Command Center.** Bangun layout.tsx dengan Context-Aware Header dan \<CommandMenu /\> (Cmd+K).  
* **Phase 4: Home Architecture (/).** Bangun rute utama. Render *Segmented Hero*, *Trust Bar*, dan *Smart Inquiry Form*.  
* **Phase 5: Services Showcase (/services).** \[CRITICAL\] Render array serviceClusters dari JSON. Gunakan desain UI bergaya *Pricing/Service Card* per cluster (Digital Marketing, Academic, Business). Implementasikan *Slide-over Modal* (menggunakan Radix UI Dialog) saat detail layanan diklik, yang di dalamnya terdapat form order cepat (CTA).  
* **Phase 6: Portfolio & Radar (/case-studies & /radar).** Render portofolio dengan modul AEO \#executive-summary. Bangun aggregator RSS.  
* **Phase 7: Optimization.** Ensure next/image is used globally for Core Web Vitals \< 1.2s LCP. Add JSON-LD schemas (Person, ProfessionalService).