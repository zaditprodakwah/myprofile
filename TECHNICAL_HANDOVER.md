# Technical Handover: Zadit Executive Intelligence Hub (v3.0)
**Role:** Principal Technical Writer & Lead System Architect  
**Status:** Production Ready (Post-Upgrade 3.0)  
**Stack:** Next.js 14, Supabase, Vercel, Groq/Gemini AI

---

## 1. Executive Summary & Philosophy

### Narasi Utama: "Building Revenue Systems & Reputation Infrastructure"
Zadit Executive Intelligence Hub bukan sekadar website portofolio; ini adalah sebuah **Revenue Engine** dan **Reputation Infrastructure** yang dirancang untuk mengonversi trafik menjadi otoritas tinggi. Sistem ini dibangun dengan fokus pada *Programmatic SEO (pSEO)* dan *Artificial Intelligence Optimization (AEO)* untuk mendominasi hasil pencarian modern (SGE/Perplexity/Search).

### Filosofi Operasional
*   **Academic Harm Reduction**: Pendekatan teknis untuk meminimalisir 'noise' dalam publikasi akademik dan profesional melalui sistem kurasi berbasis AI (Radar Synthesis).
*   **Shadow Protocol**: Desain arsitektur yang 'silent but powerful'. UI yang minimalis (Cinematic Dark Mode) menyembunyikan logika backend yang kompleks dan agresif dalam pengumpulan data intelijen pasar.

---

## 2. System Architecture & Tech Stack

### Data Flow Architecture
```mermaid
graph TD
    User((User/Client)) --> NextJS[Next.js App Router]
    NextJS --> Auth[ModeProvider/Auth]
    NextJS --> Search[SmartSearch AI Engine]
    
    subgraph "Intelligence Pipeline"
        Cron[Vercel Cron] --> API_Radar[/api/cron/radar]
        API_Radar --> Ingestion[Radar Ingestion Logic]
        Ingestion --> AI_Synthesis[Groq/Gemini Synthesis]
        AI_Synthesis --> DB[(Supabase DB)]
    end
    
    subgraph "Conversion Engine"
        Inquiry[InquiryWizard] --> Scoring[Lead Scoring Logic]
        Scoring --> Routing{Router}
        Routing --> WA[Fonnte WhatsApp API]
        Routing --> Email[Resend Email API]
        Routing --> SupabaseLog[Supabase Inquiries Table]
    end
    
    DB --> ISR[Incremental Static Regeneration]
    ISR --> NextJS
```

### Third-Party Integrations
| Service | Purpose | Integration Point |
| :--- | :--- | :--- |
| **Supabase** | Core Persistence & Relational DB | `src/lib/supabase/client.ts` |
| **Groq API** | Ultra-fast Llama-3 Synthesis | `src/lib/ai/ingestion.ts` |
| **Gemini API** | Contextual Backup & Vision Analysis | `src/lib/ai/ingestion.ts` |
| **Resend** | Transactional Email Infrastructure | `/api/send-email/route.ts` |
| **Fonnte** | Deterministic WhatsApp Notifications | `src/components/forms/InquiryWizard.tsx` |
| **PostHog** | Event Tracking & Heatmaps | `src/app/layout.tsx` (Provider) |
| **CMDK** | Smart Search UI Modal | `src/components/shared/SmartSearch.tsx` |

---

## 3. Files & Folder Structure Analysis

### Peta Folder Utama
```bash
.
├── src/                # Next.js 14 App Router
├── supabase/           # SQL Migrations
├── public/             # Static Assets
├── temp_docs/          # Design documents
└── data/               # Seed Data
```

---

## 4. Data Schema & Logic Flow

### Database Schema (Supabase)
Sistem menggunakan PostgreSQL relasional untuk mendukung *cross-entity linking*:
- **`radar_items`**: Menyimpan artikel intelijen hasil sintesis AI. Memiliki kolom `signal_score` untuk penentuan prioritas rendering.
- **`tools`**: Katalog perangkat lunak dengan metadata afiliasi dan `verification_status`.
- **`inquiries`**: Log aktivitas calon klien dengan metadata browser dan `lead_score`.
- **`radar_sources`**: Daftar RSS feeds yang dipantau secara otomatis.

### Smart Inquiry Engine Flow
1.  **Input**: User mengisi `InquiryWizard` (Multi-step).
2.  **Scoring**: Logic di `lib/scoring.ts` menghitung urgensi berdasarkan input (cth: Budget > $1000 = Score +50).
3.  **Routing**: 
    - Jika Score > 80: Trigger WhatsApp Priority Routing (Fonnte).
    - Jika Score < 80: Trigger Standard Email Notification (Resend).
4.  **Persistence**: Data disimpan di tabel `inquiries` untuk audit di masa depan.

### RSS Radar Mechanism
1.  **Trigger**: Vercel Cron memanggil `/api/cron/radar` setiap 24 jam.
2.  **Fetch**: Loop melalui `radar_sources` -> Ambil XML -> Konversi ke JSON.
3.  **Synthesize**: Kirim konten mentah ke Groq (Llama-3) untuk menghasilkan `summary`, `takeaway`, dan `why_it_matters`.
4.  **Upsert**: Data baru masuk ke `radar_items`.
5.  **Render**: Halaman `/radar` diperbarui secara otomatis melalui ISR (Incremental Static Regeneration).

---

## 5. Advanced SEO & EEAT Implementation

### Programmatic SEO (pSEO) Grid
Sistem menghasilkan ribuan variasi halaman melalui struktur:
- `/solutions/[industry]/[problem]`: Menargetkan "Long-tail problem keywords".
- `/tools/[category]/[slug]`: Menargetkan "Review & Comparison keywords".

### EEAT Technical Injection
- **Experience**: Komponen `Recommendations` menyuntikkan entitas terkait (Tools/Radar) untuk membuktikan kedalaman ekosistem.
- **Expertise**: `JSONLD.tsx` secara otomatis menghasilkan skema `Service`, `Organization`, dan `Article` dengan identitas terverifikasi.
- **Authoritativeness**: Radar Item menyertakan `Source Transparency` disclaimer untuk menghargai hak cipta dan menunjukkan kurasi manual.
- **Trustworthiness**: `TrustBar` di homepage menyertakan real-time stats dari database (cth: "1,200+ Intelligence Points Scanned").

---

## 6. Development Standards & Conventions

### Coding Standard
*   **Components**: Gunakan `"use client"` hanya pada level daun (leaf components) untuk memaksimalkan performa Server-Side Rendering.
*   **Performance**: Target LCP < 1.2 detik melalui `next/image` optimization dan minimalisasi Third-party JS.
*   **Styling**: Vanilla CSS + Tailwind. Gunakan utilitas premium di `globals.css` (`.glass`, `.animated-border`) untuk konsistensi visual.
*   **Naming**: 
    - PascalCase untuk komponen (`SmartSearch.tsx`).
    - camelCase untuk fungsi/utils (`formatDate.ts`).
    - snake_case untuk kolom database (`signal_score`).

### AI-Agent Optimization
Dokumen ini dirancang agar AI Coder (seperti Cursor/Antigravity) dapat membaca `TECHNICAL_HANDOVER.md` dan langsung memahami dependensi antar file tanpa perlu melakukan `grep` berlebihan.

---
**Prepared by:** Zadit Intelligence Architect  
**Date:** May 2026
