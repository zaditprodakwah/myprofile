# 🚀 ZADIT GROWTH PORTFOLIO — VIBE CODING MASTER DOCUMENTATION
### Google Antigravity Stack: Gemini + Claude | Agentic Web App Build Guide
**Muhammad Khoiruzzadittaqwa (Aditt/Zadit)** — Full-Stack Growth Architect

---

## 📋 TABLE OF CONTENTS

1. [Project Overview & Vision](#1-project-overview--vision)
2. [Tech Stack & Tools](#2-tech-stack--tools)
3. [AI Agent Setup (Gemini + Claude)](#3-ai-agent-setup-gemini--claude)
4. [MCP Server Configuration](#4-mcp-server-configuration)
5. [Skill & Capability Map](#5-skill--capability-map)
6. [Sources & Resources](#6-sources--resources)
7. [Master Prompting Guide](#7-master-prompting-guide)
8. [Advanced SEO/AEO/GEO Strategy](#8-advanced-seoaeogeo-strategy)
9. [UI/UX Design System](#9-uiux-design-system)
10. [Copywriting Framework](#10-copywriting-framework)
11. [Build Sequence & Execution Plan](#11-build-sequence--execution-plan)

---

## 1. PROJECT OVERVIEW & VISION

### Identitas Proyek
```
Project Name  : zadit-portfolio (V2 — Trust Bank System)
Owner         : Muhammad Khoiruzzadittaqwa (Zadit)
Role Framing  : Full-Stack Growth Architect & Systems Integrator
Core Concept  : "The Unified Growth Engine"
Deployment    : Vercel (Hobby) + Supabase (Free) + GitHub Actions
```

### Core Concept Map
```
┌─────────────────────────────────────────────────────────────┐
│              THE UNIFIED GROWTH ENGINE                      │
│                                                             │
│  [Scrollytelling LP] ←→ [Trust Bank Directory]             │
│         ↕                        ↕                          │
│  [Multi-LLM AGC Hub] ←→ [Live Growth Utilities]            │
│         ↕                        ↕                          │
│  [Admin Command Center] ←→ [Leads Generator]               │
└─────────────────────────────────────────────────────────────┘
```

### Target Audience (Client-Centric Framing)
| Segmen | Pain Point | Hook |
|--------|-----------|------|
| Corporate HRD / Headhunter | Butuh bukti track record konkret | Case studies + live metric counters |
| UMKM / Startup Founder | Tidak tahu bagaimana digital growth | Free Audit Engine utility tool |
| Pemilik Bisnis Lokal | Ingin terlihat di Google Maps & SERP | Trust Bank Directory listing |
| Partnership / Investor | Butuh profil kredibel & proporsional | Editorial warm design + JSON-LD entity |

---

## 2. TECH STACK & TOOLS

### A. Core Framework
```json
{
  "framework": "Next.js 16 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS v4 + shadcn/ui + Aceternity UI",
  "animation": "Framer Motion + GSAP ScrollTrigger + Lenis smooth scroll",
  "database": "Supabase PostgreSQL (Free Tier)",
  "deployment": "Vercel Hobby Tier",
  "ci_cd": "GitHub Actions"
}
```

### B. package.json — Required Dependencies
```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.5.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/typography": "^0.5.15",
    "tailwind-merge": "^2.5.0",
    "clsx": "^2.1.1",

    // Animation Layer
    "gsap": "^3.12.5",
    "@studio-freight/lenis": "^1.1.14",
    "framer-motion": "^11.5.0",

    // AI / LLM Layer
    "@google/generative-ai": "^0.17.0",
    "groq-sdk": "^0.7.0",

    // Database Layer
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.1",

    // SEO & Schema Layer
    "next-sitemap": "^4.2.3",
    "googleapis": "^140.0.1",
    "schema-dts": "^1.1.2",

    // UI Components
    "lucide-react": "^0.441.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.8",

    // Analytics
    "@vercel/analytics": "^1.3.1",
    "@vercel/speed-insights": "^1.0.12"
  },
  "devDependencies": {
    "@types/gsap": "^3.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.3"
  }
}
```

### C. Environment Variables (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google AI (Gemini)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key

# Groq (Fallback LLM)
GROQ_API_KEY=your_groq_api_key

# SEO & Indexing
INDEXNOW_KEY=your_indexnow_key
NEXT_PUBLIC_SITE_URL=https://zadit.dev

# Admin Auth
ADMIN_SECRET_KEY=your_admin_secret

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 3. AI AGENT SETUP (GEMINI + CLAUDE)

### A. "Google Antigravity" Architecture
Strategi ini menggabungkan dua AI powerhouse dalam satu pipeline untuk saling melengkapi:

```
┌─────────────────────────────────────────────────────────────┐
│                 GOOGLE ANTIGRAVITY STACK                    │
│                                                             │
│  GEMINI (Google)              CLAUDE (Anthropic)            │
│  ─────────────────            ─────────────────             │
│  • Content Generation         • Code Architecture           │
│  • SEO Article Writing        • Complex Logic / Reasoning   │
│  • Google Search Grounding    • UX Copy Refinement          │
│  • Multimodal (Image→Copy)    • System Design               │
│  • Google Docs/Drive sync     • Prompt Engineering          │
│  • Gmail drafting             • Data Schema Design          │
│                                                             │
│  Orchestration Layer: Next.js API Routes                    │
└─────────────────────────────────────────────────────────────┘
```

### B. Multi-LLM Routing Engine (src/lib/llm-router.ts)
```typescript
// Routing logic: Gemini untuk content, Claude untuk code/reasoning
type LLMTask = 'content' | 'code' | 'seo' | 'copy' | 'analysis';

const LLM_ROUTER: Record<LLMTask, 'gemini' | 'claude'> = {
  content: 'gemini',    // Blog AGC, article rewriting
  code: 'claude',       // Component generation, debugging
  seo: 'gemini',        // Keyword clustering, meta generation
  copy: 'claude',       // Headline, CTA, brand voice
  analysis: 'claude',   // Data interpretation, strategy
};

// Gemini Flash as primary → Claude Sonnet as fallback
export async function routeLLM(task: LLMTask, prompt: string) {
  const model = LLM_ROUTER[task];
  
  try {
    if (model === 'gemini') {
      return await callGemini(prompt);
    } else {
      return await callClaude(prompt);
    }
  } catch (error) {
    // Fallback cross-routing
    console.warn(`Primary LLM failed, falling back...`);
    return model === 'gemini' 
      ? await callClaude(prompt)
      : await callGemini(prompt);
  }
}
```

### C. Gemini Integration (src/lib/gemini.ts)
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Model matrix sesuai task
const GEMINI_MODELS = {
  fast: 'gemini-1.5-flash',        // AGC content, SEO articles
  pro: 'gemini-1.5-pro',           // Complex analysis, long-form
  multimodal: 'gemini-1.5-flash',  // Image analysis → copy
};

export async function generateSEOContent(keyword: string, context: string) {
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODELS.fast,
    systemInstruction: `Kamu adalah SEO content writer ahli untuk pasar Indonesia. 
    Tulis konten yang memenuhi E-E-A-T Google dengan struktur:
    - H1 mengandung keyword utama
    - FAQ section dengan 5 PAA questions
    - Kesimpulan dengan CTA soft-sell
    Tone: Profesional, edukatif, conversational.`
  });

  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `Keyword: ${keyword}\nKonteks bisnis: ${context}\n\nBuat artikel SEO 800-1200 kata.` }]
    }]
  });

  return result.response.text();
}

// Google Search Grounding (Gemini eksklusif)
export async function groundedSearch(query: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    tools: [{ googleSearch: {} }],
  });

  const result = await model.generateContent(query);
  return {
    text: result.response.text(),
    groundingMetadata: result.response.candidates?.[0]?.groundingMetadata
  };
}
```

### D. Claude Integration (src/lib/claude.ts)
```typescript
// Claude diakses via Anthropic API untuk code & reasoning tasks
export async function generateComponent(spec: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: `Kamu adalah Senior React/Next.js Developer. 
      Buat komponen TypeScript yang:
      - Menggunakan Tailwind CSS v4
      - Accessible (WCAG 2.1 AA)
      - Performa optimal (Core Web Vitals)
      - Mengikuti Next.js 16 App Router conventions`,
      messages: [{ role: 'user', content: spec }]
    })
  });

  const data = await response.json();
  return data.content[0].text;
}
```

---

## 4. MCP SERVER CONFIGURATION

### A. Recommended MCP Servers untuk Project Ini

```json
// .cursor/mcp.json atau claude_desktop_config.json
{
  "mcpServers": {

    // === DEVELOPMENT CORE ===
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/zadit-portfolio"],
      "description": "Direct file read/write untuk project"
    },

    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "your_token" },
      "description": "GitHub repo management, PR, commits"
    },

    // === DATABASE ===
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "your_url",
        "SUPABASE_SERVICE_ROLE_KEY": "your_key"
      },
      "description": "Direct Supabase DB query, migration, RLS"
    },

    // === GOOGLE ECOSYSTEM ===
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": { "GDRIVE_CREDENTIALS": "path/to/credentials.json" },
      "description": "Sync portfolio docs dari Google Drive"
    },

    "google-search-console": {
      "command": "npx",
      "args": ["-y", "mcp-server-gsc"],
      "env": { "GSC_CREDENTIALS": "path/to/credentials.json" },
      "description": "Monitoring indexing, keyword performance"
    },

    // === SEO & WEB ===
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "your_key" },
      "description": "Real-time SERP research untuk keyword strategy"
    },

    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"],
      "description": "Scraping & content fetching (PAA, competitor)"
    },

    // === ANALYTICS ===
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-adapter"],
      "env": { "VERCEL_TOKEN": "your_token" },
      "description": "Deploy management, analytics, logs"
    },

    // === PRODUCTIVITY ===
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Persistent context antar sesi coding"
    }
  }
}
```

### B. MCP Usage Matrix per Task

| Task | Primary MCP | Secondary MCP |
|------|------------|---------------|
| Nulis komponen baru | `filesystem` | `github` |
| Buat/edit DB schema | `supabase` | `filesystem` |
| Research keyword SEO | `brave-search` | `fetch` |
| Sync konten dari Drive | `google-drive` | `filesystem` |
| Monitor Google indexing | `google-search-console` | — |
| Deploy & monitoring | `vercel` | `github` |
| Maintain konteks panjang | `memory` | — |

---

## 5. SKILL & CAPABILITY MAP

### A. Zadit's Core Skill Pillars (untuk Copy & Positioning)
```
PILLAR 1: ADMINISTRATIVE & SYSTEMS MANAGEMENT
  ↳ Google Workspace, MS Office, team leadership (5 staf)
  ↳ Framing: "Operational Excellence Layer"

PILLAR 2: BRANDING & DIGITAL MARKETING (10+ tahun, sejak 2015)
  ↳ SEO/AEO/GEO, Copywriting, Campaign Planning, KOL Brief
  ↳ Framing: "Conversion & Visibility Engine"

PILLAR 3: BROADCASTING & PUBLICATION
  ↳ Radio announcing, educational content, journalistic writing
  ↳ Framing: "Narrative & Voice Authority"

PILLAR 4: MATHEMATICAL ANALYTICAL THINKING
  ↳ S1 Pendidikan Matematika, IPK 3.71, 2 Research Publications
  ↳ Framing: "Data-Driven Decision Layer"
```

### B. Portfolio Proof Points (Case Studies dari Portfolio PDF)
```
CASE 1: Tiket.com Digital Marketing Strategy
  → 4C Diamond Analysis, 4P Framework, Campaign Brief
  → KPI: Multi-channel funnel (Acquisition → Referral)
  → Deliverable: Media Plan, Content Calendar, KOL Brief

CASE 2: Vidio.com KOL Campaign (World Cup 2026 Context)
  → TikTok brief creation, content flow 3-angle strategy
  → CTA: "Nonton Piala Dunia 2026 di Vidio.com, cuma Rp50.000!"

CASE 3: Vidio.com SEO Off-Page & Site Audit
  → Link building strategy, domain authority mapping
  → Technical audit: Core Web Vitals, broken links

CASE 4: Tirto.id SEO On-Page Strategy
  → Keyword research (Ubersuggest), meta optimization
  → URL architecture, SERP snippet optimization

CASE 5: Al-Bahjah Foundation Administrative Transformation
  → Led 5-person team, digital tools implementation
  → Islamic education institutional management
```

---

## 6. SOURCES & RESOURCES

### A. Official Documentation
```
Next.js 16 App Router    → https://nextjs.org/docs
Tailwind CSS v4          → https://tailwindcss.com/docs
shadcn/ui                → https://ui.shadcn.com
Supabase Docs            → https://supabase.com/docs
Framer Motion            → https://www.framer.com/motion
GSAP ScrollTrigger       → https://gsap.com/docs/v3/Plugins/ScrollTrigger
Lenis Smooth Scroll      → https://github.com/studio-freight/lenis
Gemini API               → https://ai.google.dev/docs
```

### B. SEO & Automation Tools
```
Google Indexing API      → https://developers.google.com/search/apis/indexing-api
IndexNow Protocol        → https://www.indexnow.org
Google Search Console    → https://search.google.com/search-console
Overpass API (OSM)       → https://overpass-api.de
Ubersuggest              → https://neilpatel.com/ubersuggest
Semrush API              → https://www.semrush.com/api-documentation
Ahrefs API               → https://ahrefs.com/api
```

### C. Open-Source Automation Dependencies
```bash
# PAA Scraper
pip install people-also-ask
# GitHub: sundios/people-also-ask

# Google Indexing Automation
npm install -g indexer
# GitHub: uditgoenka/indexer

# Sitemap Auto-Submit
pip install google-search-console-indexer
# GitHub: mrxehmad/google-search-console-indexer

# Selenium PAA Scraper
pip install selenium beautifulsoup4
# GitHub: octo-space/scrape-google-s-People-also-ask-questions
```

### D. Design Resources
```
Aceternity UI            → https://ui.aceternity.com (animated components)
Magic UI                 → https://magicui.design (interactive elements)
Lucide Icons             → https://lucide.dev
Google Fonts             → https://fonts.google.com
  Primary: "Plus Jakarta Sans" (brand editorial)
  Mono: "JetBrains Mono" (code sections)
Coolors Palette Tool     → https://coolors.co
```

### E. Deployment & Infrastructure
```
Vercel (Hosting)         → https://vercel.com
GitHub Actions Templates → https://github.com/actions/starter-workflows
Supabase (DB + Auth)     → https://supabase.com
Cloudflare (CDN/DNS)     → https://cloudflare.com (optional)
```

---

## 7. MASTER PROMPTING GUIDE

### A. Prompt Pembuka Project (untuk Cursor / Windsurf / Claude)

```
SYSTEM ROLE:
Kamu adalah Senior Creative Developer & GTM Growth Engineer 2026 yang menguasai:
- Next.js 16 App Router dengan TypeScript
- "Dynamic Entity Graphing" untuk SEO
- "Trust-driven pSEO Directory Platform"
- Async Admin Dashboard berbasis Supabase
- GSAP ScrollTrigger horizontal pinning
- Google Antigravity: integrasi Gemini + Claude agents

PROJECT CONTEXT:
Portfolio web Muhammad Khoiruzzadittaqwa (Zadit) — Full-Stack Growth Architect.
Target audience: Lembaga swasta, agensi, investor, UMKM, institusi pemerintah.
Design language: "Warm Corporate Editorial"
  Colors: Slate-Blue #0f172a | Alabaster #f8fafc | Teal #0d9488 | Gold #d97706
  Font: Plus Jakarta Sans (headings), Inter (body)
  Feel: Kredibilitas premium + kepercayaan institusional

BUILD SCOPE:
1. Single-page scrollytelling landing (GSAP horizontal pin pada Work Process section)
2. Trust Bank Directory /directory/[city] (Supabase dynamic)
3. Leads Generator /utility/audit-engine (simulated audit score)
4. Admin Command Center /admin/dashboard (4 tabs: Data, AI, SEO, Config)
5. Blog AGC hub /blog/[slug] (Multi-LLM generated)

CONSTRAINTS:
- Vercel Hobby Tier friendly (no long-running processes)
- Core Web Vitals: LCP <2.5s, CLS=0, INP <200ms
- No WebGL/Three.js (pakai CSS 3D transforms)
- Semua animasi harus prefers-reduced-motion compliant
- Mobile-first, WCAG 2.1 AA accessible

START: Buat struktur folder proyek terlebih dahulu, lalu mulai dari layout.tsx.
```

### B. Prompt per Komponen

**Hero Section:**
```
Buat komponen <HeroSection> untuk portfolio Zadit dengan:
- Headline: "Dari Kata ke Konversi. Dari Data ke Dominasi." 
- Sub: "Fullstack Growth Architect yang memadukan SEO teknikal, 
  copywriting konversi, dan strategi digital yang terukur."
- Animated text reveal menggunakan Framer Motion (stagger 0.1s per kata)
- Background: Slate-Blue #0f172a dengan subtle grid pattern CSS
- CTA Primary: "Lihat Studi Kasus →" (scroll to #case-studies)
- CTA Secondary: "Ajak Partnership" (scroll to #contact)
- Floating badge: "Available for Projects" dengan pulse animation
- Statistik baris: "10+ Tahun | 50+ Proyek | 3 Klien Institusional"
- Desain editorial, bukan startup-flashy
```

**Process Section (Horizontal Scroll):**
```
Buat <ProcessSection> dengan GSAP ScrollTrigger horizontal pinning:
Langkah 1: "Discovery & Diagnosis" — Audit digital, riset audiens, gap analysis
Langkah 2: "Strategy Architecture" — Blueprint konten, keyword mapping, funnel design
Langkah 3: "Content & Copy Creation" — SEO articles, copywriting konversi, visual brief
Langkah 4: "Technical Implementation" — On-page SEO, schema markup, Core Web Vitals
Langkah 5: "Executive Documentation" — Pitch deck, KOL brief, media plan
Langkah 6: "Continuous Optimization" — Analytics review, A/B test, AGC maintenance

Setiap step: nomor besar (01-06), ikon Lucide, deskripsi 2 baris.
Pin section: saat user scroll vertikal 600vh, cards geser horizontal.
```

**Case Studies:**
```
Buat <CaseStudiesSection> dengan:
- 3 kartu studi kasus dalam layout masonry asymmetric
- Setiap kartu: Logo klien (placeholder), Metric besar (animated counter), 
  deskripsi singkat tantangan+solusi, tag (SEO | Campaign | Copywriting)
- Animated counters: triggerkan saat masuk viewport (IntersectionObserver)
  Metric 1: "10+ Tahun Pengalaman" counter dari 0→10
  Metric 2: "+340% Organic Traffic" counter dari 0→340
  Metric 3: "5 Staf Tim Led" counter dari 0→5
- TiltCard effect: CSS 3D perspective on mouse move (vanilla JS)
- Hover: card terangkat, border teal glowing
```

**Trust Bank Directory:**
```
Buat halaman /directory/[city]/page.tsx dengan:
- Header: "Direktori Bisnis & Layanan [City]" dengan Smart Search input
- Fetch data dari Supabase table 'entities' (filter by city)
- Grid: 3 kolom card entitas (nama, kategori, rating, thumbnail)
- Card click: slide-over overlay dengan detail lengkap + CTA "Klaim Profil"
- Klaim form: nama, email, wa_number → simpan ke 'directory_leads'
- Breadcrumb + JSON-LD BreadcrumbList + LocalBusiness schema
- ISR revalidate: 3600 seconds
```

**Admin Dashboard:**
```
Buat /admin/dashboard/page.tsx dengan middleware auth:
- Auth: check ADMIN_SECRET_KEY dari cookie/header
- Layout: sidebar kiri + main content area
- Tab 1 "Data Registry": 
  Tabel entitas dari Supabase, tambah/edit/hapus
  Tombol "Import CSV", "Export JSON", "Trigger OSM Scrape"
- Tab 2 "AI Control":
  Textarea untuk edit global system prompt
  Dropdown: Gemini Flash / Claude Sonnet / Groq Llama
  Tombol "Generate Article", live RSS feed list
- Tab 3 "SEO Ops":
  Input URL → trigger Google Indexing API
  Display sitemap.xml terakhir diperbarui
  IndexNow bulk submit
- Tab 4 "Config":
  Tabel key-value dari 'system_configs' di Supabase
  Inline edit + save
```

### C. Prompt untuk Copywriting (Brand Voice Zadit)

```
BRAND VOICE BRIEF — ZADIT:
Persona: Teman strategis yang cerdas dan berpengalaman, bukan konsultan kaku.
Tone: Percaya diri tanpa arogan | Edukatif tanpa menggurui | Hangat tanpa berlebihan
Language mix: Indonesia formal-conversational (60%) + English terms (40%)

FORBIDDEN words: "terbaik", "terpercaya", "profesional" (terlalu generik)
PREFERRED words: "terukur", "berdampak", "sistematis", "evidence-based"

CTA formula:
- Soft: "Eksplorasi pendekatan saya →"
- Medium: "Lihat bagaimana prosesnya bekerja"
- Hard: "Mulai audit gratis hari ini"

Headline formula:
[Masalah audience] + [Solusi konkret] + [Bukti/Outcome]
Contoh: "Website Anda Tidak Terindeks? Saya Perbaiki dalam 48 Jam — Dengan Data."
```

### D. Prompt untuk SEO/AEO Content Generation

```
Kamu adalah SEO Content Strategist untuk portofolio Zadit.
Generate article outline untuk keyword: "[KEYWORD]"

Output harus memiliki:
1. Title tag (60 karakter, mengandung keyword di depan)
2. Meta description (155 karakter, dengan CTA)
3. H1 (sama dengan title atau variasi)
4. H2 sections (5-7 section, mengandung LSI keywords)
5. FAQ block (5 pertanyaan dari PAA format)
   Format: <QABlock> untuk FAQ schema markup
6. URL slug (pendek, keyword-rich, tanpa stopwords)
7. Internal link suggestions (ke halaman lain di site)
8. Recommended schema: Article + FAQPage + BreadcrumbList

Tone: Edukatif, authoritative, Indonesia-market friendly.
Panjang: 800-1200 kata untuk pillar, 400-600 untuk cluster.
```

---

## 8. ADVANCED SEO/AEO/GEO STRATEGY

### A. Entity-First Architecture (GEO — Generative Engine Optimization)

```typescript
// src/app/layout.tsx — JSON-LD ProfilePage Schema
const personSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Muhammad Khoiruzzadittaqwa",
    "alternateName": ["Zadit", "Aditt", "Muhzadit"],
    "jobTitle": "Full-Stack Growth Architect",
    "description": "Spesialis SEO teknikal, copywriting konversi, dan strategi digital marketing dengan pengalaman 10+ tahun sejak 2015.",
    "url": "https://zadit.dev",
    "image": "https://zadit.dev/og-profile.jpg",
    "knowsAbout": [
      "SEO Teknikal", "AEO", "GEO", "Copywriting",
      "Digital Marketing", "Brand Strategy", "Content Marketing",
      "Administrative Management", "Broadcasting"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Fullstack Digital Marketing",
        "credentialCategory": "certificate",
        "recognizedBy": { "@type": "Organization", "name": "MySkill.id" }
      }
    ],
    "sameAs": [
      "https://github.com/muhzadit",
      "https://www.linkedin.com/in/muhzadit",
      "https://kontak.link/muhzadit",
      "https://id.wikipedia.org/wiki/Pemasaran_digital"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Al-Bahjah Foundation",
      "url": "https://albahjah.or.id"
    }
  }
};
```

### B. public/llms.txt (AI Crawler Optimization)
```markdown
# Muhammad Khoiruzzadittaqwa (Zadit) — Full-Stack Growth Architect

## Core Identity
- Name: Muhammad Khoiruzzadittaqwa
- Alias: Zadit, Aditt, Muhzadit
- Location: Cirebon, West Java, Indonesia
- Contact: kontak.link/muhzadit | @muhzadit (Instagram, LinkedIn, Twitter)

## Professional Role
Full-Stack Growth Architect specializing in the intersection of:
- Technical SEO / AEO / GEO (since 2015, 10+ years)
- Conversion Copywriting & Brand Strategy  
- Digital Marketing Campaign Management
- Administrative & Institutional Systems

## Notable Work
- Digital marketing strategy for Tiket.com (4C+4P framework, KOL brief, media plan)
- SEO audit & off-page strategy for Vidio.com
- KOL campaign brief for Vidio.com World Cup 2026 broadcast
- On-page SEO optimization for Tirto.id
- Administrative transformation at Al-Bahjah Foundation (led 5-person team, 2021–present)

## Education
- S1 Pendidikan Matematika, Institut Al-Bahjah Cirebon (2022–present, IPK 3.71)
- Fullstack Digital Marketing Bootcamp, MySkill.id & eMarketing Institute (2024)

## Languages
Bahasa Indonesia (native), English (proficient), Arabic (functional)

## Availability
Open for: Freelance projects, consulting, partnership, speaking engagements
Preferred engagement: Long-term growth retainer, project-based, institutional contracts
```

### C. Programmatic PAA Loop (GitHub Actions)
```yaml
# .github/workflows/paa-scraper.yml
name: Weekly PAA Content Refresh

on:
  schedule:
    - cron: '0 3 * * 1'  # Every Monday 3AM UTC
  workflow_dispatch:

jobs:
  scrape-paa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      
      - name: Install dependencies
        run: pip install people-also-ask supabase
      
      - name: Scrape PAA Questions
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          python scripts/paa_scraper.py \
            --keywords "cara bangun website konversi tinggi,panduan SEO UMKM Indonesia,strategi digital marketing 2026,copywriting untuk landing page" \
            --output supabase
      
      - name: Trigger Vercel Revalidation
        run: |
          curl -X POST "${{ secrets.VERCEL_REVALIDATE_URL }}" \
            -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}"
```

### D. Instant Indexing Trigger (src/app/api/index-now/route.ts)
```typescript
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  const { url, type } = await request.json();
  
  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/indexing']
  );
  
  await jwtClient.authorize();
  
  // Ping Google
  const googleRes = await fetch(
    'https://indexing.googleapis.com/v3/urlNotifications:publish',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtClient.credentials.access_token}`
      },
      body: JSON.stringify({ url, type: type || 'URL_UPDATED' })
    }
  );

  // Ping IndexNow (Bing + Yandex)
  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'zadit.dev',
      key: process.env.INDEXNOW_KEY,
      urlList: [url]
    })
  });

  return NextResponse.json({ success: true, url });
}
```

### E. AEO — Answer Engine Optimization (FAQ Component)
```typescript
// src/components/QABlock.tsx
// Renders FAQ dengan schema markup untuk Google Featured Snippets

interface QA { question: string; answer: string; }

export function QABlock({ items }: { items: QA[] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="faq-block">
        {items.map((item, i) => (
          <details key={i} className="border-b border-slate-700 py-4">
            <summary className="font-semibold text-teal-400 cursor-pointer">
              {item.question}
            </summary>
            <p className="mt-2 text-slate-300 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
```

---

## 9. UI/UX DESIGN SYSTEM

### A. Design Tokens (Tailwind v4 Config)
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Brand Colors */
  --color-brand-slate: #0f172a;      /* Primary dark bg */
  --color-brand-alabaster: #f8fafc;  /* Light bg / text on dark */
  --color-brand-teal: #0d9488;       /* Accent / CTA / links */
  --color-brand-gold: #d97706;       /* Highlight / badges */
  --color-brand-slate-mid: #1e293b;  /* Card backgrounds */
  --color-brand-slate-border: #334155; /* Borders */

  /* Typography Scale */
  --font-display: "Plus Jakarta Sans", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Spacing & Radius */
  --radius-card: 1rem;
  --radius-button: 0.5rem;
  --spacing-section: 6rem;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(13, 148, 136, 0.1);
  --shadow-card-hover: 0 8px 48px rgba(13, 148, 136, 0.2);
}
```

### B. Component Design Specs

**Navigation (Sticky Right Sidebar):**
```
Position: fixed, right-6, top-1/2, transform -translateY-1/2
Items: dot indicator + label on hover
Active dot: teal #0d9488, pulsing ring
Inactive: slate-border #334155
Transition: smooth on scroll section change
```

**Cards (TiltCard with 3D CSS):**
```
Base: bg-brand-slate-mid, border border-brand-slate-border
Hover: translateZ(10px), rotateX(-2deg) rotateY(2deg)
Glow: box-shadow with teal color on hover
Transition: transform 0.15s ease (fast for responsiveness)
A11y: remove tilt effect when prefers-reduced-motion
```

**Buttons:**
```
Primary: bg-brand-teal text-white, hover:brightness-110
Secondary: border border-brand-teal text-brand-teal, hover:bg-teal-900/30
Ghost: text-slate-400, hover:text-white
All: rounded-button, px-6 py-3, font-semibold text-sm
```

**Section Layout Pattern:**
```
Max-width: 1200px, mx-auto
Padding: px-4 md:px-8 lg:px-12
Section spacing: py-24 (desktop) py-16 (mobile)
Heading: text-5xl md:text-7xl, font-display, font-bold
Sub-heading: text-xl, text-slate-400, max-w-2xl
```

### C. Animation Choreography
```
Page load:      Header fade-in (0.3s) → Hero text stagger (0.1s/word) → Stats count-up
Scroll trigger: Section fade-up (translateY 40px → 0, 0.6s ease)
Process section: GSAP horizontal pin (6 steps × 100vw = 600vw scroll)
Case studies:   Number counter triggered by IntersectionObserver (threshold 0.5)
Cards:          TiltCard on mousemove (vanilla JS, 15deg max)
CTA hover:      Scale 1.02 + shadow intensify (0.2s ease)
```

---

## 10. COPYWRITING FRAMEWORK

### A. Hero Headline Options
```
Option A (Problem-Solution):
"Konten Tanpa Strategi itu Noise.
Saya Ubah Noise Jadi Konversi."

Option B (Authority):
"10 Tahun. 50+ Proyek. Satu Sistem.
Digital Growth yang Terukur & Berdampak."

Option C (Transformational):
"Dari Kata ke Konversi.
Dari Data ke Dominasi."
[RECOMMENDED — paling high-contrast & memorable]
```

### B. Unique Value Proposition (UVP)
```
"Saya tidak hanya menulis konten atau mengoptimalkan SEO secara terpisah.
Saya merancang sistem pertumbuhan digital yang menghubungkan narasi brand,
rekayasa teknis, dan eksekusi kampanye — dalam satu alur yang terukur."
```

### C. Services Copy (Bento Grid)
```
Card 1: TECHNICAL SEO & AEO
"Pastikan bisnis Anda ditemukan — oleh manusia dan AI. 
Dari on-page optimization hingga schema markup untuk Google AI Overview."
Tag: [Core Web Vitals] [JSON-LD] [IndexNow]

Card 2: CONVERSION COPYWRITING
"Kata-kata yang bekerja. Headline yang menarik. CTA yang mengkonversi.
Berbasis psikologi audiens dan data SERP."
Tag: [Landing Page] [Email] [Ad Copy]

Card 3: CAMPAIGN & KOL MANAGEMENT
"Strategy → Brief → Execution → Report.
Campaign yang terintegrasi dari awareness sampai retention."
Tag: [Social Media] [KOL Brief] [Media Plan]

Card 4: CONTENT SYSTEM & AGC
"Ekosistem konten yang tumbuh sendiri.
Blog, pilar, cluster — terstruktur dan terindeks otomatis."
Tag: [Content Calendar] [Pillar-Cluster] [Auto-Index]

Card 5: EXECUTIVE DOCUMENTATION
"Pitch deck yang menjual. Proposal yang menang.
Narasi visual untuk investor, klien, dan stakeholder."
Tag: [Slide Deck] [Annual Report] [Brand Book]

Card 6: GROWTH ANALYTICS
"Data adalah kompas, bukan dekorasi.
Reporting yang actionable, bukan sekadar angka cantik."
Tag: [GA4] [GSC] [Heatmap]
```

### D. Partnership Section Copy
```
Headline: "Mari Bangun Sesuatu yang Berdampak"

Body: "Saya terbuka untuk kolaborasi jangka panjang dengan:
lembaga pendidikan, agensi digital, startup, dan organisasi 
yang serius membangun kehadiran digital mereka."

Partnership types:
• Retainer bulanan (growth management)
• Project-based (kampanye, audit, konten)
• Revenue share (produk digital bersama)
• Speaking & training engagement

CTA: "Kirim Brief Anda →"
Sub-CTA: "atau WhatsApp langsung: [nomor]"
```

---

## 11. BUILD SEQUENCE & EXECUTION PLAN

### A. Phase 1: Foundation (Hari 1-2)
```bash
# Inisialisasi project
npx create-next-app@latest zadit-portfolio \
  --typescript --tailwind --app --src-dir --import-alias "@/*"

# Install core dependencies
npm install gsap @studio-freight/lenis framer-motion \
  @supabase/supabase-js @google/generative-ai \
  lucide-react tailwind-merge clsx \
  @radix-ui/react-dialog @radix-ui/react-tabs \
  react-hook-form zod schema-dts next-sitemap

# Setup Tailwind v4 config
# Configure globals.css dengan design tokens
# Buat layout.tsx dengan SmoothScroll + JSON-LD
# Buat public/llms.txt
```

### B. Phase 2: Core Pages (Hari 3-5)
```
□ /                    → Landing page scrollytelling
  □ HeroSection        (animated text reveal)
  □ ProcessSection     (GSAP horizontal scroll pin)
  □ CaseStudiesSection (TiltCard + animated counters)
  □ ServicesGrid       (Bento grid layout)
  □ PartnershipCTA     (contact form + Supabase insert)
  □ SidebarNav         (IntersectionObserver sticky nav)
```

### C. Phase 3: Feature Pages (Hari 6-9)
```
□ /directory/[city]    → Trust Bank Directory
  □ Supabase fetch + ISR
  □ Card grid + overlay
  □ Claim form → leads table

□ /utility/audit-engine → Free Audit Tool
  □ Form (URL input)
  □ Simulated scoring animation
  □ Report generation
  □ Email capture → Supabase

□ /blog/[slug]         → AGC Blog Hub
  □ MDX rendering
  □ QABlock FAQ schema
  □ Dynamic sidebar CTA
  □ ISR + instant indexing trigger
```

### D. Phase 4: Admin & Automation (Hari 10-12)
```
□ /admin/dashboard     → Command Center
  □ Auth middleware
  □ Tab: Data Registry
  □ Tab: AI Control (Gemini/Claude/Groq)
  □ Tab: SEO Ops (Indexing API)
  □ Tab: Config (system_configs)

□ GitHub Actions
  □ PAA scraper workflow (weekly)
  □ Sitemap auto-submit
  □ Lighthouse CI check
```

### E. Phase 5: SEO & Launch (Hari 13-14)
```
□ Daftarkan site ke Google Search Console
□ Submit sitemap.xml
□ Trigger IndexNow untuk semua halaman
□ Setup GA4 + Vercel Analytics
□ Audit Core Web Vitals (target: LCP<2.5s, CLS=0)
□ Validasi JSON-LD di Rich Results Test
□ Submit ke Bing Webmaster Tools
□ Update public/llms.txt final version
□ Test di semua device breakpoints
```

### F. Supabase Database Schema (Quick Reference)
```sql
-- Entitas untuk Trust Bank Directory
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  city TEXT,
  description TEXT,
  contact JSONB,
  is_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads dari Directory (klaim profil)
CREATE TABLE directory_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name TEXT,
  contact_name TEXT,
  email TEXT,
  wa_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads dari Audit Engine
CREATE TABLE utility_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT,
  email TEXT,
  score JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Konten blog (AGC)
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  meta_title TEXT,
  meta_desc TEXT,
  keywords TEXT[],
  faq_items JSONB,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Konfigurasi sistem dinamis
CREATE TABLE system_configs (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PAA Questions bank
CREATE TABLE paa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT,
  question TEXT,
  answer TEXT,
  article_id UUID REFERENCES articles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🎯 QUICK REFERENCE CHEATSHEET

```
FRAMEWORK   : Next.js 16 App Router + TypeScript
STYLING     : Tailwind v4 + shadcn + Aceternity
ANIMATION   : GSAP ScrollTrigger + Lenis + Framer Motion
DATABASE    : Supabase PostgreSQL
AI PRIMARY  : Gemini 1.5 Flash (content) + Claude Sonnet (code)
DEPLOY      : Vercel Hobby + GitHub Actions
SEO STACK   : Google Indexing API + IndexNow + Next Sitemap

COLORS
  Dark BG   : #0f172a (Slate Blue)
  Light BG  : #f8fafc (Alabaster)
  Accent    : #0d9488 (Teal)
  Highlight : #d97706 (Gold)

FONTS
  Heading   : Plus Jakarta Sans (Bold 700/800)
  Body      : Inter (Regular 400, Medium 500)
  Mono      : JetBrains Mono

TARGET METRICS
  LCP       : < 2.5s
  CLS       : = 0
  INP       : < 200ms
  Lighthouse: 90+ semua kategori

PERSONA ZADIT
  Role      : Full-Stack Growth Architect
  Niche     : SEO + Copywriting + Campaign + Admin
  Since     : 2015 (digital), 2019 (professional)
  Bahasa    : ID (native) | EN (proficient) | AR (functional)
```

---

*Dokumentasi ini dibuat khusus untuk vibe coding session Zadit Growth Portfolio V2.*
*Update terakhir: Juni 2026 | Stack: Google Antigravity (Gemini + Claude)*
