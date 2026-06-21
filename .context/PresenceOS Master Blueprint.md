# **PresenceOS: Master Engineering Knowledge Base & System Architecture Blueprint**

**System Name:** PresenceOS (Digital Presence Intelligence Platform)

**Codename:** PresenceOS

**Type:** AI-Native Digital Presence Graph & Intelligence Platform

**Architecture Constraint:** Serverless-First, Edge-First, Free-Tier Friendly, Event-Driven, AI-Native, and Highly Extensible

**Document Version:** 3.0.0-PROD

## **1\. BUSINESS SPECIFICATION DOCUMENT (BSD)**

### **1.1 Visi, Misi, & Filosofi Produk**

**PresenceOS** adalah platform kecerdasan kehadiran digital (*Digital Presence Intelligence*) berbasis AI yang dirancang untuk mendeteksi, mengaudit, memperkaya, menilai, membandingkan, dan memberikan rekomendasi peningkatan jejak digital (*digital footprints*) bagi organisasi, profesional, merek, situs web, profil sosial, dan aset digital lainnya.

PresenceOS melampaui konsep alat audit web konvensional yang bersifat transien dan sekali pakai (*single-use*). Di platform ini, **audit diposisikan sebagai mekanisme akuisisi data otomatis** untuk membangun **Digital Presence Graph** (Grafik Kehadiran Digital) yang terus berkembang secara dinamis.

   \[ Alat Audit Tradisional \]             ──►             \[ Platform PresenceOS \]  
   \- Crawler web sekali pakai                            \- Grafik Kehadiran Digital Terpadu  
   \- Hasil laporan PDF statis                            \- Penyelesaian Entitas Mandiri (Self-Healing)  
   \- Retensi pengguna rendah                             \- Indeks programatis jangka panjang  
   \- Input hanya secara manual                           \- Pipeline Penemuan Mandiri (Autonomous)

* **Visi Platform:** Memetakan, mengindeks, dan menilai seluruh jejak kehadiran digital perekonomian global untuk memberikan intelijen transparan bagi manusia dan mesin pencari AI.  
* **Misi Platform:** Demokratisasi audit digital kelas enterprise melalui pipeline asinkron yang efisien untuk mengonversi data mentah menjadi aset grafik pengetahuan terstruktur.  
* **Filosofi Desain:**  
  * *AI-Native:* Model bahasa besar (LLM) tidak dipasang sebagai fitur tambahan, melainkan sebagai mesin utama pengolah rekomendasi teknis yang dinormalisasi.  
  * *Zero-Cost Baseline:* Mengoptimalkan infrastruktur serverless (Vercel, Supabase, Upstash) agar biaya operasional dasar pada tahap awal bernilai Rp0,- (Zero-Cost Stack).  
  * *Programmatic Growth:* Menjadikan setiap pencarian audit publik sebagai bahan bakar pertumbuhan landing page direktori instan yang ramah SEO.

### **1.2 Lean Canvas & Model Monetisasi (Freemium & SaaS)**

PresenceOS beroperasi menggunakan skema hibrida B2B SaaS berlangganan bulanan (*subscription*) dan kredit pembayaran fleksibel (*utility-based credits*):

* **Free Tier (Rp 0):** Akses 3 kali audit manual dasar per hari, dasbor visualisasi standar, dan data direktori publik.  
* **PRO Membership (Rp 150.000 \- Rp 300.000 / bulan):** Membuka hak klaim penuh atas profil bisnis, integrasi link WhatsApp instan pada direktori, analisis kompetitor berkala, dan unduhan laporan PDF tanpa merek (*white-label*).  
* **Enterprise / Business Intelligence (Pay-per-Use):** Akses API langsung, pencarian entitas massal (*bulk*), laporan AI Visibility mendalam, serta audit CV/Resume massal untuk perekrut.

## **2\. PRODUCT REQUIREMENTS DOCUMENT (PRD)**

### **2.1 Matriks Fitur & Modul Fungsional**

| ID Modul | Nama Modul | Prioritas | Kemampuan Utama |
| :---- | :---- | :---- | :---- |
| **MOD-01** | Ingestion Engine | P0 | Menerima URL, @username, atau file PDF CV, mendeteksi jenis input di Edge, dan mendaftarkan tugas ke antrean. |
| **MOD-02** | Web Audit Pipeline | P0 | Menjalankan Lighthouse Serverless untuk menilai Performa, Aksesibilitas, SEO, dan Keamanan situs web. |
| **MOD-03** | Social Intelligence | P0 | Scraper API pihak ketiga untuk mengekstrak pengikut, postingan, dan menghitung Engagement Rate (ER). |
| **MOD-04** | Career Intelligence | P0 | Parser CV semantik, ekstraksi keahlian, dan perhitungan kecocokan terhadap parameter ATS. |
| **MOD-05** | AI Visibility Engine | P0 | Agentik RAG untuk menyimulasikan pertanyaan ke LLM dan melacak persentase kemunculan nama merek. |
| **MOD-06** | Multi-Channel Claim | P0 | Sistem verifikasi kepemilikan aset via Meta-tag HTML, kode Bio profil, atau tautan OTP email. |
| **MOD-07** | Auto-Directory | P0 | Pembuatan direktori publik statis (SSR) berbasis SEO secara otomatis setelah audit selesai. |
| **MOD-08** | Payment Gateway | P0 | Integrasi Webhook Xendit untuk aktivasi langganan PRO dan pengisian saldo kredit secara real-time. |
| **MOD-09** | Admin Mission Control | P1 | Antarmuka konsol admin untuk mengelola sitemap crawler, menyetujui penemuan baru, dan memantau antrean. |

### **2.2 Hak Akses, Kredit, & Matriks Langganan**

┌─────────────────────────────────────────────────────────────────────────────┐  
│                            MATRIKS KONSUMSI KREDIT                          │  
├──────────────────────────────┬───────────────┬───────────────┬──────────────┤  
│ Jenis Tugas Audit            │ Akun Gratis   │ Anggota PRO   │ Enterprise   │  
├──────────────────────────────┼───────────────┼───────────────┼──────────────┤  
│ Audit Web Standar            │ 1 Kredit      │ Gratis / Unlimited│ Unlimited│  
│ Audit Sosial Media           │ 2 Kredit      │ Gratis / Unlimited│ Unlimited│  
│ Audit CV/Resume ATS          │ 3 Kredit      │ 1 Kredit      │ 0.5 Kredit   │  
│ Simulasi AI Visibility LLM   │ Tidak Didukung│ 5 Kredit      │ 2 Kredit     │  
│ Cetak Laporan PDF            │ Hanya Klien   │ Ekspor SVG    │ White-Label  │  
└──────────────────────────────┴───────────────┴───────────────┴──────────────┘

## **3\. ARSITEKTUR KECERDASAN DOMAIN-DRIVEN DESIGN (DDD)**

### **3.1 Peta Konteks (Bounded Contexts)**

PresenceOS dibagi menjadi konteks domain yang terisolasi secara logis dan berkomunikasi melalui pengiriman pesan asinkron (*domain events*):

                  ┌──────────────────────────────────────────────┐  
                  │                 BOUNDED CONTEXTS             │  
                  ├──────────────────────┬───────────────────────┤  
                  │ 1\. Identity Context  │ 2\. Audit Context      │  
                  │ \- Profile            │ \- Snapshot            │  
                  │ \- Claims             │ \- Scores              │  
                  │ \- VerificationToken  │ \- Recommendations     │  
                  ├──────────────────────┼───────────────────────┤  
                  │ 3\. Social Context    │ 4\. AI Context         │  
                  │ \- SocialProfile      │ \- LLM Mentions        │  
                  │ \- EngagementStats    │ \- CitationScore       │  
                  └──────────────────────┴───────────────────────┘

* **Identity & Membership Context:** Mengelola registrasi, profil pengguna kustom, otorisasi RBAC/ABAC, dan kepemilikan lisensi klaim aset.  
* **Audit Evaluation Context:** Mengelola pemrosesan berkala, pemicu Lighthouse, penyimpanan metadata, dan generasi skor.  
* **Autonomous Discovery Context:** Bertanggung jawab atas pencarian URL baru secara otomatis melalui parsing sitemap, pemindaian RSS, dan antrean kurasi admin.  
* **Billing Context:** Mengamankan transaksi, pembuatan tagihan pembayaran, webhook Xendit, dan sinkronisasi kredit pengguna.

## **4\. ARSITEKTUR SISTEM & ALUR KERJA (C4 LEVEL 2 CONTAINER)**

                                  \+-------------------+  
                                  |   Web Browser     |  
                                  | (Next.js/React)   |  
                                  \+---------+---------+  
                                            | HTTPS / WSS  
                                            v  
                               \+------------+------------+  
                               |     Next.js Gateway     |  
                               | (Edge Serverless BFF)   |  
                               \+----+--------------+-----+  
                                    |              |  
                      DB Operations |              | Queue Job  
                                    v              v  
                        \+-----------+----+   \+-----+------------+  
                        | Supabase Auth  |   |  Upstash QStash  |  
                        |   Postgres     |   | (Message Broker) |  
                        \+-----------+----+   \+-----+------------+  
                                    ^              |  
                                    |              | Execute Task  
                                    |              v  
                        \+-----------+----+   \+-----+------------+  
                        | Prisma/Drizzle |   | Serverless Worker|  
                        |   PostgreSQL   |   | (Node.js/Edge)   |  
                        \+----------------+   \+------------------+

### **4.1 Manajemen Antrean & Retries (Retry Strategy)**

1. **Asynchronous Dispatch:** Rute API menerima input, menghasilkan UUID tugas unik, mendaftarkannya ke Upstash Redis, dan mengirimkannya ke Upstash QStash.  
2. **Backoff Exponential:** Tugas yang gagal saat menembak API eksternal (seperti Google PSI) akan dicoba ulang otomatis sebanyak 3 kali dengan formula jeda:  
   ![][image1]  
3. **Dead Letter Queue (DLQ):** Jika gagal setelah 3 percobaan, QStash memindahkan tugas ke skema database public.dlq\_reports untuk dianalisis oleh admin secara manual.

## **5\. SPESIFIKASI BACKEND & INTEGRASI WEBHOOK**

### **5.1 Penjaga Rute & Pembatas Akses (Middleware Rate Limiting)**

Pembatasan akses API (*Rate Limiting*) diimplementasikan di Edge menggunakan token bucket algoritma via Upstash Redis.

* **Pengguna Anonim:** Maksimal 50 permintaan/jam berdasarkan identitas IP.  
* **Pengguna Terotentikasi:** Maksimal 250 permintaan/jam.  
* **Pengguna PRO/Enterprise:** Sesuai batas kredit aktif akun.

### **5.2 Implementasi Webhook Pembayaran Xendit (Serverless Edge Route)**

import { NextRequest, NextResponse } from 'next/server';  
import { createClient } from '@supabase/supabase-js';

// Inisialisasi klien Supabase dengan service role key untuk bypass RLS saat update data  
const supabase \= createClient(  
  process.env.NEXT\_PUBLIC\_SUPABASE\_URL\!,  
  process.env.SUPABASE\_SERVICE\_ROLE\_KEY\!  
);

export async function POST(req: NextRequest) {  
  try {  
    const xenditToken \= req.headers.get('x-callback-token');  
      
    // Validasi token pengirim callback dari Xendit  
    if (xenditToken \!== process.env.XENDIT\_CALLBACK\_TOKEN) {  
      return new NextResponse(  
        JSON.stringify({ error: 'Token callback tidak sah atau tidak cocok' }),   
        { status: 401, headers: { 'Content-Type': 'application/json' } }  
      );  
    }

    const payload \= await req.json();  
    const { external\_id, status, amount } \= payload;

    if (status \=== 'PAID') {  
      // Temukan rekam data pembayaran di database berdasarkan ID invoice external  
      const { data: paymentRecord, error: fetchErr } \= await supabase  
        .from('payments')  
        .select('user\_id')  
        .eq('xendit\_external\_id', external\_id)  
        .single();

      if (fetchErr || \!paymentRecord) {  
        return new NextResponse(  
          JSON.stringify({ error: 'Data pembayaran tidak ditemukan di sistem' }),   
          { status: 404, headers: { 'Content-Type': 'application/json' } }  
        );  
      }

      // Tingkatkan status keanggotaan pengguna menjadi akun PRO  
      const { error: profileErr } \= await supabase  
        .from('profiles')  
        .update({ membership\_status: 'PRO' })  
        .eq('id', paymentRecord.user\_id);

      if (profileErr) throw profileErr;

      // Perbarui status transaksi pembayaran di tabel  
      const { error: paymentUpdateErr } \= await supabase  
        .from('payments')  
        .update({ status: 'PAID', updated\_at: new Date().toISOString() })  
        .eq('xendit\_external\_id', external\_id);

      if (paymentUpdateErr) throw paymentUpdateErr;  
    }

    return NextResponse.json({ success: true, message: 'Webhook diproses sukses' });  
  } catch (err: any) {  
    return new NextResponse(  
      JSON.stringify({ error: err.message }),   
      { status: 500, headers: { 'Content-Type': 'application/json' } }  
    );  
  }  
}

## **6\. ARSITEKTUR DATABASE & SKEMA RELASIONAL (SUPABASE SQL DDL)**

Berikut adalah skema SQL komprehensif yang dirancang khusus untuk database PostgreSQL di Supabase. Skema ini dilengkapi dengan pemicu sinkronisasi akun otomatis (*triggers*), optimasi indeks pencarian, dan kebijakan keamanan tingkat baris (RLS \- *Row Level Security*).

\-- \=========================================================================  
\-- PresenceOS Core SQL Engine Setup  
\-- Safe-Run migrations: Tables, RLS, Indexes, and Autogenerated Triggers  
\-- \=========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\-- 1\. ROLE-BASED USER PROFILES  
CREATE TABLE IF NOT EXISTS public.profiles (  
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,  
    email TEXT UNIQUE NOT NULL,  
    full\_name TEXT,  
    avatar\_url TEXT,  
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),  
    membership\_status VARCHAR(50) DEFAULT 'FREE' CHECK (membership\_status IN ('FREE', 'PRO', 'ENTERPRISE')),  
    credits\_balance INTEGER DEFAULT 5 NOT NULL,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

\-- 2\. SYSTEM ORGANIZATIONS (Top-level Entities)  
CREATE TABLE IF NOT EXISTS public.organizations (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    name VARCHAR(255) NOT NULL,  
    industry VARCHAR(100),  
    employee\_range VARCHAR(50),  
    headquarters VARCHAR(255),  
    metadata JSONB DEFAULT '{}'::jsonb,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

\-- 3\. DOMAINS & NETWORKS  
CREATE TABLE IF NOT EXISTS public.domains (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    organization\_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,  
    domain\_name VARCHAR(255) UNIQUE NOT NULL,  
    registrar VARCHAR(100),  
    expires\_at TIMESTAMP WITH TIME ZONE,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

\-- 4\. SOCIAL PROFILES NODE  
CREATE TABLE IF NOT EXISTS public.social\_profiles (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    organization\_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,  
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'instagram', 'github', 'youtube', 'tiktok')),  
    username VARCHAR(150) NOT NULL,  
    profile\_url TEXT NOT NULL,  
    followers\_count INTEGER DEFAULT 0,  
    engagement\_rate NUMERIC(6,3) DEFAULT 0.000,  
    metadata JSONB DEFAULT '{}'::jsonb,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP,  
    CONSTRAINT unique\_platform\_username UNIQUE(platform, username)  
);

ALTER TABLE public.social\_profiles ENABLE ROW LEVEL SECURITY;

\-- 5\. RESUMES NODE (Career Intelligence)  
CREATE TABLE IF NOT EXISTS public.resumes (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    uploader\_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,  
    file\_path TEXT NOT NULL,  
    raw\_text TEXT,  
    parsed\_json JSONB DEFAULT '{}'::jsonb,  
    ats\_score INTEGER CHECK (ats\_score \>= 0 AND ats\_score \<= 100),  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

\-- 6\. AUDIT SNAPSHOTS (Web, Brand, performance logs)  
CREATE TABLE IF NOT EXISTS public.snapshots (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    target\_type VARCHAR(50) NOT NULL CHECK (target\_type IN ('domain', 'social', 'resume')),  
    target\_id UUID NOT NULL, \-- Generic polymorphic link  
    captured\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

ALTER TABLE public.snapshots ENABLE ROW LEVEL SECURITY;

\-- 7\. METRIC SCORES  
CREATE TABLE IF NOT EXISTS public.scores (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    snapshot\_id UUID REFERENCES public.snapshots(id) ON DELETE CASCADE NOT NULL,  
    dimension VARCHAR(50) NOT NULL, \-- 'seo', 'performance', 'security', 'ai\_visibility', 'ats'  
    score INTEGER NOT NULL CHECK (score \>= 0 AND score \<= 100),  
    metadata JSONB DEFAULT '{}'::jsonb  
);

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

\-- 8\. INTEGRATED RECOMMENDATIONS  
CREATE TABLE IF NOT EXISTS public.recommendations (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    snapshot\_id UUID REFERENCES public.snapshots(id) ON DELETE CASCADE NOT NULL,  
    dimension VARCHAR(50) NOT NULL,  
    severity VARCHAR(20) CHECK (severity IN ('critical', 'warning', 'passed')),  
    title VARCHAR(255) NOT NULL,  
    explanation TEXT NOT NULL,  
    resolution\_code TEXT,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

\-- 9\. VERIFICATION AND CLAIMS TABLE  
CREATE TABLE IF NOT EXISTS public.claims (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    user\_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,  
    target\_type VARCHAR(50) NOT NULL CHECK (target\_type IN ('organization', 'social', 'domain')),  
    target\_id UUID NOT NULL,  
    verification\_token VARCHAR(100) UNIQUE NOT NULL,  
    is\_verified BOOLEAN DEFAULT FALSE,  
    expires\_at TIMESTAMP WITH TIME ZONE NOT NULL,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP  
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

\-- \=========================================================================  
\-- AUTOGENERATED SECURE PROFILE TRIGGER (Triggered via Auth.Users)  
\-- \=========================================================================

CREATE OR REPLACE FUNCTION public.sync\_auth\_user()  
RETURNS TRIGGER AS $$  
BEGIN  
    INSERT INTO public.profiles (id, email, full\_name, avatar\_url, role)  
    VALUES (  
        NEW.id,  
        NEW.email,  
        COALESCE(NEW.raw\_user\_meta\_data-\>\>'full\_name', NEW.raw\_user\_meta\_data-\>\>'name', 'Anonymous User'),  
        COALESCE(NEW.raw\_user\_meta\_data-\>\>'avatar\_url', NEW.raw\_user\_meta\_data-\>\>'picture', NULL),  
        'USER'  
    );  
    RETURN NEW;  
END;  
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on\_supabase\_auth\_signup  
    AFTER INSERT ON auth.users  
    FOR EACH ROW EXECUTE FUNCTION public.sync\_auth\_user();

\-- \=========================================================================  
\-- INDEX DESIGN FOR HIGH READ & WRITE THROUGHPUT (Programmatic SEO)  
\-- \=========================================================================

CREATE INDEX IF NOT EXISTS idx\_profiles\_role ON public.profiles(role);  
CREATE INDEX IF NOT EXISTS idx\_domains\_lookup ON public.domains(domain\_name);  
CREATE INDEX IF NOT EXISTS idx\_social\_lookup ON public.social\_profiles(platform, username);  
CREATE INDEX IF NOT EXISTS idx\_snapshots\_generic ON public.snapshots(target\_type, target\_id);  
CREATE INDEX IF NOT EXISTS idx\_scores\_lookup ON public.scores(snapshot\_id, dimension);  
CREATE INDEX IF NOT EXISTS idx\_claims\_check ON public.claims(target\_id, user\_id) WHERE is\_verified \= FALSE;

\-- \=========================================================================  
\-- SECURE ROW-LEVEL SECURITY (RLS) ACTIONS  
\-- \=========================================================================

\-- Public select policies (Necessary for public directories to thrive on SEO)  
CREATE POLICY "Public Read for Organizations" ON public.organizations FOR SELECT USING (true);  
CREATE POLICY "Public Read for Domains" ON public.domains FOR SELECT USING (true);  
CREATE POLICY "Public Read for Social Profiles" ON public.social\_profiles FOR SELECT USING (true);  
CREATE POLICY "Public Read for Scores" ON public.scores FOR SELECT USING (true);  
CREATE POLICY "Public Read for Recommendations" ON public.recommendations FOR SELECT USING (true);

\-- Authenticated Self-profile policies  
CREATE POLICY "Users can manage their profile" ON public.profiles   
    FOR ALL USING (auth.uid() \= id);

\-- Protected Resume policies  
CREATE POLICY "Users can access their own uploaded resumes" ON public.resumes  
    FOR ALL USING (auth.uid() \= uploader\_id);

\-- Absolute Overriding Admin Access Policy  
CREATE OR REPLACE FUNCTION public.check\_is\_admin() RETURNS BOOLEAN AS $$  
BEGIN  
    RETURN EXISTS (  
        SELECT 1 FROM public.profiles   
        WHERE id \= auth.uid() AND role \= 'ADMIN'  
    );  
END;  
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admin All Access on Profiles" ON public.profiles FOR ALL USING (public.check\_is\_admin());  
CREATE POLICY "Admin All Access on Organizations" ON public.organizations FOR ALL USING (public.check\_is\_admin());  
CREATE POLICY "Admin All Access on Domains" ON public.domains FOR ALL USING (public.check\_is\_admin());  
CREATE POLICY "Admin All Access on Social Profiles" ON public.social\_profiles FOR ALL USING (public.check\_is\_admin());  
CREATE POLICY "Admin All Access on Resumes" ON public.resumes FOR ALL USING (public.check\_is\_admin());  
CREATE POLICY "Admin All Access on Snapshots" ON public.snapshots FOR ALL USING (public.check\_is\_admin());

## **7\. PRISMA SCHEMA DEFINITIONS**

datasource db {  
  provider \= "postgresql"  
  url      \= env("DATABASE\_URL")  
}

generator client {  
  provider \= "prisma-client-js"  
}

enum Role {  
  USER  
  ADMIN  
}

enum MembershipStatus {  
  FREE  
  PRO  
  ENTERPRISE  
}

enum PlatformType {  
  linkedin  
  twitter  
  instagram  
  github  
  youtube  
  tiktok  
}

enum TargetType {  
  domain  
  social  
  resume  
}

model Profile {  
  id               String           @id @db.Uuid  
  email            String           @unique  
  fullName         String?          @map("full\_name")  
  avatarUrl        String?          @map("avatar\_url")  
  role             Role             @default(USER)  
  membershipStatus MembershipStatus @default(FREE) @map("membership\_status")  
  creditsBalance   Int              @default(5) @map("credits\_balance")  
  createdAt        DateTime         @default(now()) @map("created\_at")  
  updatedAt        DateTime         @updatedAt @map("updated\_at")  
  resumes          Resume\[\]  
  claims           Claim\[\]

  @@map("profiles")  
}

model Organization {  
  id             String          @id @default(dbgenerated("gen\_random\_uuid()")) @db.Uuid  
  name           String  
  industry       String?  
  employeeRange  String?         @map("employee\_range")  
  headquarters   String?  
  metadata       Json            @default("{}")  
  createdAt      DateTime        @default(now()) @map("created\_at")  
  domains        Domain\[\]  
  socialProfiles SocialProfile\[\]

  @@map("organizations")  
}

model Domain {  
  id             String          @id @default(dbgenerated("gen\_random\_uuid()")) @db.Uuid  
  organizationId String?         @map("organization\_id") @db.Uuid  
  organization   Organization?   @relation(fields: \[organizationId\], references: \[id\], onDelete: Cascade)  
  domainName     String          @unique @map("domain\_name")  
  registrar      String?  
  expiresAt      DateTime?       @map("expires\_at")  
  createdAt      DateTime        @default(now()) @map("created\_at")

  @@map("domains")  
}

model SocialProfile {  
  id             String       @id @default(dbgenerated("gen\_random\_uuid()")) @db.Uuid  
  organizationId String?      @map("organization\_id") @db.Uuid  
  organization   Organization? @relation(fields: \[organizationId\], references: \[id\], onDelete: Cascade)  
  platform       PlatformType  
  username       String  
  profileUrl     String       @map("profile\_url")  
  followersCount Int          @default(0) @map("followers\_count")  
  engagementRate Decimal      @default(0.000) @db.Decimal(6, 3\) @map("engagement\_rate")  
  metadata       Json         @default("{}")  
  createdAt      DateTime     @default(now()) @map("created\_at")

  @@unique(\[platform, username\])  
  @@map("social\_profiles")  
}

model Resume {  
  id         String   @id @default(dbgenerated("gen\_random\_uuid()")) @db.Uuid  
  uploaderId String?  @map("uploader\_id") @db.Uuid  
  uploader   Profile? @relation(fields: \[uploaderId\], references: \[id\], onDelete: SetNull)  
  filePath   String   @map("file\_path")  
  rawText    String?  @db.Text @map("raw\_text")  
  parsedJson Json     @default("{}") @map("parsed\_json")  
  atsScore   Int?     @map("ats\_score")  
  createdAt  DateTime @default(now()) @map("created\_at")

  @@map("resumes")  
}

model Snapshot {  
  id              String           @id @default(dbgenerated("gen\_random\_uuid()")) @db.Uuid  
  targetType      TargetType       @map("target\_type")  
  targetId        String           @map("target\_id") @db.Uuid  
  capturedAt      DateTime         @default(now()) @map("captured\_at")  
  scores          Score\[\]  
  recommendations Recommendation\[\]

  @@index(\[targetType, targetId\])  
  @@map("snapshots")  
}

model Score {  
  id         String   @id @default(dbgenerated("gen\_random\_uuid()")) @db.Uuid  
  snapshotId String   @map("snapshot\_id") @db.Uuid  
  snapshot   Snapshot @relation(fields: \[snapshotId\], references: \[id\], onDelete: Cascade)  
  dimension  String  
  score      Int  
  metadata   Json     @default("{}")

  @@map("scores")  
}

model Recommendation {  
  id             String   @id @default(dbgenerated("gen\_random\_uuid()")) @db.Uuid  
  snapshotId     String   @map("snapshot\_id") @db.Uuid  
  snapshot       Snapshot @relation(fields: \[snapshotId\], references: \[id\], onDelete: Cascade)  
  dimension      String  
  severity       String  
  title          String  
  explanation    String   @db.Text  
  resolutionCode String?  @db.Text @map("resolution\_code")  
  createdAt      DateTime @default(now()) @map("created\_at")

  @@map("recommendations")  
}

model Claim {  
  id                String   @id @default(dbgenerated("gen\_random\_uuid()")) @db.Uuid  
  userId            String   @map("user\_id") @db.Uuid  
  user              Profile  @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)  
  targetType        String   @map("target\_type")  
  targetId          String   @map("target\_id") @db.Uuid  
  verificationToken String   @unique @map("verification\_token")  
  isVerified        Boolean  @default(false) @map("is\_verified")  
  expiresAt         DateTime @map("expires\_at")  
  createdAt         DateTime @default(now()) @map("created\_at")

  @@map("claims")  
}

## **8\. ALUR PIPELINE REKOMENDASI AI**

Kekuatan utama dari PresenceOS adalah penyediaan rekomendasi kode perbaikan (*actionable remediation code*) secara instan dengan parse output JSON terstruktur.

import { OpenAI } from 'openai';

const openai \= new OpenAI({ apiKey: process.env.OPENAI\_API\_KEY });

interface IssueContext {  
  dimension: string;  
  errorDescription: string;  
  failingPayload: string;  
}

export async function generateActionableRemediation(issue: IssueContext): Promise\<{  
  recommendationTitle: string;  
  explanation: string;  
  resolutionCode: string;  
}\> {  
  const prompt \= \`Analisis masalah teknis optimasi berikut dan berikan instruksi perbaikan yang jelas.  
Dimensi Audit: ${issue.dimension}  
Keterangan Eror: ${issue.errorDescription}  
Payload Konteks JSON: ${issue.failingPayload}

Kembalikan respon wajib dalam format objek JSON terstruktur dengan kunci: "recommendationTitle", "explanation", "resolutionCode".  
Pastikan nilai "resolutionCode" berisikan contoh baris kode siap pakai (seperti konfigurasi Nginx, kode komponen React, script HTML tag, dsb.) untuk memperbaiki masalah tersebut tanpa menggunakan baris komentar kosong.\`;

  const response \= await openai.chat.completions.create({  
    model: 'gpt-4o-mini',  
    response\_format: { type: 'json\_object' },  
    messages: \[  
      { role: 'system', content: 'Anda adalah pakar arsitek performa web dan SEO yang selalu memberikan respon JSON terstruktur secara konsisten.' },  
      { role: 'user', content: prompt }  
    \],  
    temperature: 0.1,  
  });

  const parsed \= JSON.parse(response.choices\[0\].message.content || '{}');  
  return {  
    recommendationTitle: parsed.recommendationTitle || 'Pemberitahuan Optimasi Sistem',  
    explanation: parsed.explanation || 'Disarankan untuk mengecek implementasi kode secara manual.',  
    resolutionCode: parsed.resolutionCode || ''  
  };  
}

## **9\. DESIGN SYSTEM & FRONTEND COMPONENT LIBRARY**

Desain antarmuka PresenceOS berlandaskan prinsip kemudahan akses (WCAG 2.2), kejelasan visual (*intuitive data visualization*), dan responsivitas penuh (mobile-first).

### **9.1 Komponen 1: Visualisasi Radial Gauge Score**

'use client';  
import React from 'react';

interface ScoreGaugeProps {  
  score: number;  
  label: string;  
  subtext?: string;  
}

export default function ScoreGauge({ score, label, subtext }: ScoreGaugeProps) {  
  // Tetapkan pengelompokan warna sesuai standar skor Lighthouse  
  const getColorClass \= (val: number) \=\> {  
    if (val \>= 90\) return { text: 'text-emerald-500', stroke: 'stroke-emerald-500', bg: 'bg-emerald-50' };  
    if (val \>= 50\) return { text: 'text-amber-500', stroke: 'stroke-amber-500', bg: 'bg-amber-50' };  
    return { text: 'text-rose-500', stroke: 'stroke-rose-500', bg: 'bg-rose-50' };  
  };

  const colors \= getColorClass(score);  
  const radius \= 40;  
  const circumference \= 2 \* Math.PI \* radius;  
  const offset \= circumference \- (score / 100\) \* circumference;

  return (  
    \<div className="flex flex-col items-center p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow"\>  
      \<div className="relative w-28 h-28"\>  
        \<svg className="w-full h-full transform \-rotate-90"\>  
          {/\* Jalur lingkaran abu-abu dasar \*/}  
          \<circle  
            cx="56"  
            cy="56"  
            r={radius}  
            className="stroke-slate-100 fill-none"  
            strokeWidth="8"  
          /\>  
          {/\* Lingkaran progress bar aktif \*/}  
          \<circle  
            cx="56"  
            cy="56"  
            r={radius}  
            className={\`fill-none transition-all duration-1000 ease-out ${colors.stroke}\`}  
            strokeWidth="8"  
            strokeDasharray={circumference}  
            strokeDashoffset={offset}  
            strokeLinecap="round"  
          /\>  
        \</svg\>  
        \<div className="absolute inset-0 flex items-center justify-center"\>  
          \<span className={\`text-2xl font-black tracking-tight ${colors.text}\`}\>{score}\</span\>  
        \</div\>  
      \</div\>  
      \<h4 className="mt-4 font-bold text-slate-800 text-sm md:text-base"\>{label}\</h4\>  
      {subtext && \<p className="text-slate-400 text-xs text-center mt-1"\>{subtext}\</p\>}  
    \</div\>  
  );  
}

### **9.2 Komponen 2: Bar Pencarian Ingestion Multifungsi**

'use client';  
import React, { useState } from 'react';

export default function PresenceCommandBar() {  
  const \[query, setQuery\] \= useState('');  
  const \[inputType, setInputType\] \= useState\<'url' | 'social' | 'resume'\>('url');  
  const \[isProcessing, setIsProcessing\] \= useState(false);

  // Deteksi otomatis format input secara real-time  
  const handleInputChange \= (e: React.ChangeEvent\<HTMLInputElement\>) \=\> {  
    const val \= e.target.value;  
    setQuery(val);  
      
    if (val.startsWith('@') || val.includes('instagram.com') || val.includes('twitter.com')) {  
      setInputType('social');  
    } else if (val.endsWith('.pdf') || val.includes('/cv/') || val.includes('/resume/')) {  
      setInputType('resume');  
    } else {  
      setInputType('url');  
    }  
  };

  const handleLaunch \= async (e: React.FormEvent) \=\> {  
    e.preventDefault();  
    if (\!query) return;

    setIsProcessing(true);  
    try {  
      const response \= await fetch('/api/ingest', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({ targetUrl: query })  
      });  
      const data \= await response.json();  
      if (response.ok) {  
        window.location.href \= \`/audit/${data.jobId}\`;  
      }  
    } catch (err) {  
      alert('Gagal menyambungkan ke server processing.');  
    } finally {  
      setIsProcessing(false);  
    }  
  };

  return (  
    \<div className="w-full max-w-2xl mx-auto p-4 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl shadow-xl"\>  
      \<form onSubmit={handleLaunch} className="flex flex-col md:flex-row gap-3 items-center"\>  
        \<div className="relative flex-1 w-full"\>  
          \<input  
            type="text"  
            required  
            disabled={isProcessing}  
            value={query}  
            onChange={handleInputChange}  
            placeholder="Ketik domain (nike.com), sosial (@nike), atau seret berkas CV..."  
            className="w-full pl-5 pr-12 py-4 bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl text-slate-800 placeholder-slate-400 font-medium transition-all text-sm md:text-base"  
          /\>  
          {/\* Label Indikator Otomatis \*/}  
          \<div className="absolute right-4 top-1/2 transform \-translate-y-1/2"\>  
            {inputType \=== 'url' && \<span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2 py-1 rounded-md uppercase"\>Web\</span\>}  
            {inputType \=== 'social' && \<span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded-md uppercase"\>Social\</span\>}  
            {inputType \=== 'resume' && \<span className="text-xs bg-amber-50 text-amber-600 font-bold px-2 py-1 rounded-md uppercase"\>Resume\</span\>}  
          \</div\>  
        \</div\>

        \<button  
          type="submit"  
          disabled={isProcessing}  
          className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl active:scale-95 transition-all text-sm shadow-md"  
        \>  
          {isProcessing ? 'Memproses...' : 'Audit Jejak'}  
        \</button\>  
      \</form\>  
    \</div\>  
  );  
}

### **9.3 Komponen 3: Wizard Langkah Verifikasi Klaim**

'use client';  
import React, { useState } from 'react';

type AssetType \= 'website' | 'social' | 'resume';

interface WizardProps {  
  assetType: AssetType;  
  assetIdentifier: string;  
  directoryId: string;  
}

export default function VerificationWizard({ assetType, assetIdentifier, directoryId }: WizardProps) {  
  const \[step, setStep\] \= useState(1);  
  const \[tokenCode\] \= useState(\`VERIFY-${Math.random().toString(36).substr(2, 6).toUpperCase()}\`);  
  const \[loading, setLoading\] \= useState(false);  
  const \[errorMsg, setErrorMsg\] \= useState('');

  const handleVerify \= async () \=\> {  
    setLoading(true);  
    setErrorMsg('');  
    try {  
      const res \= await fetch('/api/audit/verify-claim', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({  
          assetType,  
          assetIdentifier,  
          code: tokenCode,  
          directoryId  
        })  
      });  
      const data \= await res.json();  
      if (data.success) {  
        setStep(3);  
      } else {  
        setErrorMsg(data.error || 'Verifikasi gagal. Pastikan kode terpasang dengan benar.');  
      }  
    } catch (err) {  
      setErrorMsg('Eror jaringan. Hubungi support kami.');  
    } finally {  
      setLoading(false);  
    }  
  };

  return (  
    \<div className="w-full max-w-xl mx-auto p-6 bg-white border border-slate-100 rounded-3xl shadow-xl"\>  
      {/\* STEP 1: MULAI \*/}  
      {step \=== 1 && (  
        \<div className="text-center space-y-4"\>  
          \<div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold"\>?\</div\>  
          \<h3 className="text-xl font-bold text-slate-800"\>Verifikasi Kepemilikan\</h3\>  
          \<p className="text-sm text-slate-500"\>  
            Klaim \<strong\>{assetIdentifier}\</strong\> untuk membuktikan kepemilikan Anda, mengedit detail informasi profil, dan membuka dashboard analisis profesional.  
          \</p\>  
          \<button   
            onClick={() \=\> setStep(2)}   
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"  
          \>  
            Mulai Klaim Sekarang  
          \</button\>  
        \</div\>  
      )}

      {/\* STEP 2: PASANG TOKEN \*/}  
      {step \=== 2 && (  
        \<div className="space-y-4"\>  
          \<h3 className="text-lg font-bold text-slate-800"\>Pemasangan Kode Verifikasi\</h3\>  
            
          {assetType \=== 'website' && (  
            \<div className="space-y-2 text-sm text-slate-600"\>  
              \<p\>Pasang tag HTML meta berikut di dalam tag head situs Anda:\</p\>  
              \<pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto"\>  
                {\`\<meta name="presenceos-verification" content="${tokenCode}"\>\`}  
              \</pre\>  
            \</div\>  
          )}

          {assetType \=== 'social' && (  
            \<div className="space-y-2 text-sm text-slate-600"\>  
              \<p\>Salin kode acak berikut dan letakkan pada bagian \*\*Bio Profil\*\* media sosial Anda:\</p\>  
              \<div className="p-3 bg-slate-50 border-2 border-dashed border-slate-200 text-center font-mono text-lg font-bold text-indigo-600 rounded-xl select-all"\>  
                {tokenCode}  
              \</div\>  
            \</div\>  
          )}

          {assetType \=== 'resume' && (  
            \<div className="space-y-2 text-sm text-slate-600"\>  
              \<p\>Kami telah mengirimkan instruksi bertaut khusus ke email Anda (\<strong\>{assetIdentifier}\</strong\>).\</p\>  
              \<div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl text-center"\>  
                Kode Validasi Anda: {tokenCode}  
              \</div\>  
            \</div\>  
          )}

          {errorMsg && (  
            \<div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100 text-center"\>  
              ⚠ {errorMsg}  
            \</div\>  
          )}

          \<div className="flex gap-3"\>  
            \<button   
              onClick={() \=\> setStep(1)}   
              className="w-1/3 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold"  
            \>  
              Batal  
            \</button\>  
            \<button   
              onClick={handleVerify}   
              disabled={loading}  
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all"  
            \>  
              {loading ? 'Menghubungkan...' : 'Konfirmasi Pemasangan'}  
            \</button\>  
          \</div\>  
        \</div\>  
      )}

      {/\* STEP 3: SELESAI \*/}  
      {step \=== 3 && (  
        \<div className="text-center p-4 space-y-3"\>  
          \<div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto"\>✓\</div\>  
          \<h3 className="text-xl font-bold text-slate-800"\>Profil Terverifikasi\</h3\>  
          \<p className="text-sm text-slate-500"\>  
            Klaim sukses\! Akun Anda telah terikat dengan metadata profil terverifikasi di direktori utama PresenceOS.  
          \</p\>  
        \</div\>  
      )}  
    \</div\>  
  );  
}

## **10\. SPESIFIKASI ANTARMUKA PENGGUNA (OPENAPI v1 JSON/YAML)**

openapi: 3.0.3  
info:  
  title: PresenceOS Core Engine API  
  version: 1.0.0  
  description: API untuk mengelola tugas pemrosesan asinkron, verifikasi klaim, dan penarikan data jejak presence.  
servers:  
  \- url: https://api.presenceos.com/v1  
paths:  
  /ingest:  
    post:  
      summary: Daftarkan tugas audit baru  
      operationId: triggerAudit  
      requestBody:  
        required: true  
        content:  
          application/json:  
            schema:  
              type: object  
              required:  
                \- targetUrl  
              properties:  
                targetUrl:  
                  type: string  
                  format: uri  
                  example: https://tokobagus.com  
                socialHandle:  
                  type: string  
                  example: instagram/tokobagus  
                deepAudit:  
                  type: boolean  
                  default: false  
      responses:  
        '202':  
          description: Berhasil didaftarkan ke antrean QStash  
          content:  
            application/json:  
              schema:  
                type: object  
                properties:  
                  jobId:  
                    type: string  
                    example: job\_99831a\_bcde  
                  status:  
                    type: string  
                    example: processing  
                  eta\_seconds:  
                    type: integer  
                    example: 25  
        '400':  
          description: Format payload salah  
        '429':  
          description: Batas harian rate limit terlewati

  /claim:  
    post:  
      summary: Mulai inisiasi verifikasi klaim aset digital  
      operationId: createClaim  
      security:  
        \- BearerAuth: \[\]  
      requestBody:  
        required: true  
        content:  
          application/json:  
            schema:  
              type: object  
              required:  
                \- targetType  
                \- targetId  
                \- method  
              properties:  
                targetType:  
                  type: string  
                  enum: \[organization, social, domain\]  
                targetId:  
                  type: string  
                  format: uuid  
                method:  
                  type: string  
                  enum: \[meta, dns, bio, email\_otp\]  
      responses:  
        '201':  
          description: Token verifikasi sukses dibuat  
          content:  
            application/json:  
              schema:  
                type: object  
                properties:  
                  claimId:  
                    type: string  
                    format: uuid  
                  token:  
                    type: string  
                    example: VERIFY-99A8C1  
                  expiresAt:  
                    type: string  
                    format: date-time  
        '401':  
          description: Sesi otentikasi JWT tidak ditemukan

components:  
  securitySchemes:  
    BearerAuth:  
      type: http  
      scheme: bearer  
      bearerFormat: JWT

## **11\. SISTEM KONFIGURASI PROYEK**

Integrasi seluruh peraturan kualitas kode, standardisasi linter, dan format compiler diletakkan di bawah konfigurasi tunggal ini:

### **11.1 ESLint Configuration (.eslintrc.json)**

{  
  "extends": \[  
    "next/core-web-vitals",  
    "typescript",  
    "prettier"  
  \],  
  "rules": {  
    "no-explicit-any": "error",  
    "react-hooks/exhaustive-deps": "warn",  
    "eqeqeq": \["error", "always"\],  
    "no-unused-vars": "error",  
    "@typescript-eslint/explicit-function-return-type": "error"  
  }  
}

## **12\. DEVOPS, DEPLOYMENT PIPELINE, & INTEGRATED TESTS**

### **12.1 Alur Integrasi Berkelanjutan CI/CD (GitHub Actions)**

name: PresenceOS CI/CD Pipeline

on:  
  push:  
    branches: \[main, develop\]  
  pull\_request:  
    branches: \[main\]

jobs:  
  test\_and\_lint:  
    runs-on: ubuntu-latest  
    steps:  
      \- name: Checkout Code  
        uses: actions/checkout@v4

      \- name: Install Node.js  
        uses: actions/setup-node@v4  
        with:  
          node-version: 20  
          cache: 'npm'

      \- name: Install Dependencies  
        run: npm ci

      \- name: Run Prisma Schema Validation  
        run: npx prisma validate

      \- name: Execute Linting Rules  
        run: npm run lint

      \- name: Execute Test Suite  
        run: npm test

  deploy\_to\_vercel:  
    needs: test\_and\_lint  
    if: github.ref \== 'refs/heads/main'  
    runs-on: ubuntu-latest  
    steps:  
      \- name: Checkout Code  
        uses: actions/checkout@v4

      \- name: Deploy Production to Vercel  
        uses: amondnet/vercel-action@v20  
        with:  
          vercel-token: ${{ secrets.VERCEL\_TOKEN }}  
          vercel-org-id: ${{ secrets.VERCEL\_ORG\_ID }}  
          vercel-project-id: ${{ secrets.VERCEL\_PROJECT\_ID }}  
          vercel-args: '--prod'

### **12.2 Automated Integration Test Specs (Playwright E2E)**

import { test, expect } from '@playwright/test';

test.describe('PresenceOS Core User Journey Checks', () \=\> {  
  test('Should process a basic website audit request and load the report', async ({ page }) \=\> {  
    // 1\. Kunjungi beranda landing page  
    await page.goto('https://presenceos.com');  
    await expect(page).toHaveTitle(/PresenceOS/);

    // 2\. Tulis alamat domain target pada input command bar  
    const searchInput \= page.locator('input\[placeholder\*="Ketik domain"\]');  
    await searchInput.fill('https://example.com');  
      
    // 3\. Picu audit  
    await page.click('button:has-text("Audit Jejak")');

    // 4\. Pastikan rute url beralih ke halaman loading report asinkron  
    await page.waitForURL(/\\/audit\\/job\_/, { timeout: 30000 });  
    const currentUrl \= page.url();  
    expect(currentUrl).toContain('/audit/job\_');  
  });  
});

## **13\. PROGRAMMATIC SEO (PSEO) GENERATION**

Kami mengoptimalkan asupan trafik organik bebas biaya (*zero-budget marketing*) dengan menghasilkan puluhan ribu halaman dinamis sitemap yang ramah SEO.

### **13.1 Dynamic Sitemap XML Generator API**

import { createClient } from '@supabase/supabase-js';

const supabase \= createClient(  
  process.env.NEXT\_PUBLIC\_SUPABASE\_URL\!,  
  process.env.SUPABASE\_SERVICE\_ROLE\_KEY\!  
);

export async function generateDynamicXmlSitemap(): Promise\<string\> {  
  // Ambil data slug direktori publik untuk diekspor ke sitemap XML sitemap Google  
  const { data: directories, error } \= await supabase  
    .from('directories')  
    .select('slug, updated\_at')  
    .limit(50000); // Batas aman sitemap standard Google

  if (error || \!directories) {  
    throw new Error('Gagal memanen tautan direktori sitemap');  
  }

  const sitemapUrls \= directories.map((dir) \=\> \`  
    \<url\>  
      \<loc\>https://presenceos.com/direktori/profil/${dir.slug}\</loc\>  
      \<lastmod\>${new Date(dir.updated\_at).toISOString()}\</lastmod\>  
      \<changefreq\>weekly\</changefreq\>  
      \<priority\>0.8\</priority\>  
    \</url\>  
  \`).join('');

  return \`\<?xml version="1.0" encoding="UTF-8"?\>  
\<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\>  
  \<url\>  
    \<loc\>https://presenceos.com\</loc\>  
    \<changefreq\>daily\</changefreq\>  
    \<priority\>1.0\</priority\>  
  \</url\>  
  ${sitemapUrls}  
\</urlset\>\`;  
}

## **14\. STRUKTUR WORKSPACE REPOSITORI (MONOREPO DIRECTORY)**

presenceos-monorepo/  
├── .github/  
│   └── workflows/  
│       └── deploy.yml                   \# Pipeline integrasi CI/CD  
├── apps/  
│   └── web/  
│       ├── src/  
│       │   ├── app/                     \# Rute Next.js 15 App Router  
│       │   ├── components/              \# Pustaka komponen UI/UX React  
│       │   └── utils/                   \# Mesin asinkron, webhook, & AI  
│       ├── public/                      \# Skrip statis & OpenAPI spec  
│       └── package.json  
├── supabase/  
│   ├── migrations/  
│   │   └── 20260621000000\_core.sql      \# Migrasi database PostgreSQL & RLS  
│   └── config.toml  
├── prisma/  
│   └── schema.prisma                    \# Definisi model data Prisma ORM  
├── tests/  
│   └── e2e/  
│       └── audit\_flow.spec.ts           \# Skenario pengujian Playwright E2E  
├── vercel.json                          \# Aturan runtime & Cron Jobs  
└── README.md

## **15\. ENGINEERING REFERENCE LIBRARY & RECOGNIZED STANDARDS**

Tim pengembang dan asisten pengembang AI dapat merujuk ke pustaka & standar referensi resmi berikut untuk pemahaman implementasi lebih mendalam:

* **Next.js App Router Documentation:** [Vercel App Router Docs](https://nextjs.org/docs)  
* **Supabase Row Level Security Guides:** [Supabase Security Guidelines](https://supabase.com/docs/guides/auth/row-level-security)  
* **Upstash Serverless Redis & QStash Reference:** [Upstash Documentation Portal](https://upstash.com/docs)  
* **Google PageSpeed Web Service:** [PageSpeed Insights API Reference](https://developers.google.com/speed/docs/insights/v5/get-started)  
* **W3C Web Content Accessibility Guidelines (WCAG) 2.2:** [W3C WCAG Core Standards](https://www.w3.org/WAI/standards-guidelines/wcag/)  
* **OWASP Threat Modeling Reference:** [OWASP Top Ten Security Vectors](https://owasp.org/www-project-top-ten/)  
* **Xendit Core Integration Guides:** [Xendit Developers API Hub](https://developers.xendit.co/)

[image1]: <data:image/png;base64,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>