# **MASTER BLUEPRINT: EKOSISTEM DIGITAL "MYPROFILE"**

**Repositori:** zaditprodakwah/myprofile

**Deployment:** Vercel (Frontend & Serverless API) \+ PostgreSQL (Database)

**Fokus Arsitektur:** High-Signal Content, Privacy-First Analytics, Automated Lead Gen, Agent-Driven Development.

## **1\. Product Requirements Document (PRD)**

### **1.1. Visi Produk**

Membangun "Digital HQ" (Markas Digital) pribadi yang bukan sekadar portofolio statis, melainkan mesin otomasi yang menyerap data (*ingestion*), menyaring sampah AI (*slop auditing*), menampilkan studi kasus secara terstruktur, dan mengonversi pengunjung menjadi prospek klien (*lead generation*) secara elegan dan berpusat pada privasi.

### **1.2. Fungsionalitas Inti (Core Features)**

1. **Automated Content Pipeline:** Otomatisasi penarikan data riset, feed, dan kode sumber menggunakan RSSHub & Firecrawl.  
2. **AI Slop Firewall:** Gateway validasi menggunakan LLM-Guard untuk memastikan semua konten yang dipublikasikan memiliki *High-Signal Index* (![][image1]).  
3. **Headless Content Core:** Menggunakan **Payload CMS 3.0** (Next.js Native) untuk manajemen konten.  
4. **Lead & Traffic Generation:** Penjadwalan otomatis (Cal.com), *live chat* (Chatwoot), penangkapan surel (Mautic), dan analitik tanpa kuki (Umami).  
5. **Design Operations:** UI yang di-generate dari token Figma melalui Style Dictionary, dirender dengan komponen super-cepat (shadcn/ui \+ Radix UI).

## **2\. Arsitektur Sistem Makro & Aliran Data**

Sistem beroperasi di atas jaringan **Next.js App Router** (Vercel) dengan integrasi pihak ketiga secara *lazy-loaded* atau di belakang antrian *serverless*.

\[ SUMBER DATA EXTERNAL \]  
       │ (Firecrawl / RSSHub)  
       ▼  
┌────────────────────────────────────────────────────────┐  
│ NEXT.JS VERCEL: BACKEND ROUTE & AUTOMATION PIPELINE    │  
│ 1\. /api/ingest : Mengambil data eksternal.             │  
│ 2\. /api/audit  : AI Slop Audit Engine (LLM Guard).     │  
└──────────────────────┬─────────────────────────────────┘  
                       │ (Lolos Sensor)  
                       ▼  
┌────────────────────────────────────────────────────────┐  
│ STORAGE & CMS LAYER (Payload CMS 3.0 \+ PostgreSQL)     │  
│ \- Post / Case Studies Collection                       │  
│ \- Lead / Subscribers Collection                        │  
└──────────────────────┬─────────────────────────────────┘  
                       │ (Data Fetch SSR/ISR)  
                       ▼  
┌────────────────────────────────────────────────────────┐  
│ NEXT.JS VERCEL: FRONTEND PRESENTATION & UI/UX          │  
│ \- Komponen: shadcn/ui, Radix UI, Tailwind CSS          │  
│ \- Design Tokens: Style Dictionary (Figma Sync)         │  
└──────────────────────┬─────────────────────────────────┘  
                       │ (Client-Side Tracking/Widgets)  
     ┌─────────────────┼──────────────────┐  
     ▼                 ▼                  ▼  
 \[ UMAMI \]        \[ CHATWOOT \]        \[ CAL.COM \]  
(Analytics)       (Live Chat)         (Booking)

## **3\. Entity Relationship Diagram (ERD) & Skema Database**

Karena kita menggunakan **Payload CMS 3.0** yang terkoneksi ke database relasional (PostgreSQL via Neon/Supabase), berikut adalah skema koleksi intinya:

### **Model Relasi Database**

* **Users**: Pengelola web (Admin).  
* **Posts**: Menyimpan artikel teknis, *case study*, dan log terserap.  
* **Leads**: Menyimpan data audiens yang berlangganan *newsletter* atau mengisi form kontak.  
* **AuditLogs**: Menyimpan rekam jejak sistem saat mendeteksi konten slop.

### **Skema Payload CMS (TypeScript)**

// payload/collections/Posts.ts  
export const Posts: CollectionConfig \= {  
  slug: 'posts',  
  admin: { useAsTitle: 'title' },  
  fields: \[  
    { name: 'title', type: 'text', required: true },  
    { name: 'content', type: 'richText', required: true },  
    { name: 'sourceUrl', type: 'text' }, // Jika dari ingestion  
    {   
      name: 'qualityMetrics',   
      type: 'group',   
      fields: \[  
        { name: 'slopScore', type: 'number', max: 100 },  
        { name: 'isHighSignal', type: 'checkbox', defaultValue: false }  
      \]   
    },  
    { name: 'status', type: 'select', options: \['draft', 'published'\] }  
  \]  
}

// payload/collections/Leads.ts  
export const Leads: CollectionConfig \= {  
  slug: 'leads',  
  fields: \[  
    { name: 'email', type: 'email', required: true, unique: true },  
    { name: 'source', type: 'text' }, // e.g., 'Hero Form', 'Footer Newsletter'  
    { name: 'optIn', type: 'checkbox', defaultValue: false },  
    { name: 'createdAt', type: 'date' }  
  \]  
}

## **4\. UI/UX & Design System (Design Ops)**

UI situs ini harus memancarkan *Quiet Power*—minimalis, tipografi tegas, aksesibilitas tingkat tinggi (A11y), dan animasi yang memiliki tujuan.

### **4.1. Stack Presentasi**

* **Framework UI:** radix-ui/primitives (Aksesibilitas kibor & *screen reader*).  
* **Komponen Basis:** shadcn/ui (Kode dimiliki sepenuhnya, bukan *node\_module* yang dikunci).  
* **Styling:** tailwindcss dengan variabel CSS khusus.

### **4.2. Aliran Sinkronisasi Figma (Style Dictionary)**

Untuk memastikan warna, spasi, dan tipografi selalu akurat dari desain Figma:

1. Desainer memperbarui **Figma Tokens**.  
2. Ekspor JSON dikomit ke .github/tokens.json.  
3. GitHub Actions menjalankan **Style Dictionary** untuk menghasilkan variables.css.  
4. Tailwind mengkonsumsi variabel tersebut untuk digunakan pada *class* frontend (contoh: bg-brand-primary).

## **5\. Mesin Evaluasi Kualitas (AI Slop Audit Engine)**

Algoritma matematis dan logika API untuk menjaga kemurnian sistem.

**Formula Evaluasi:**

* **![][image2]![][image3]**: Struktur blok kode kosong (dari flamehaven01/ai-slop-detector).  
* ![][image4]: Kata klise AI (*delve, tapestry*) (Heuristik Regex / LLM Guard).  
* ![][image5]: Inkonsistensi semantik.

Semua konten yang melewati Next.js *Route Handler* /api/pipeline akan dihitung nilai ![][image6]\-nya. Jika ![][image7] (High Signal), maka konten dikomit ke koleksi Posts di Payload CMS.

## **6\. Lead Generation & Traffic Analytics**

Untuk mengubah portofolio menjadi corong akuisisi klien (*acquisition funnel*):

* **Analytics (Umami):** Diimplementasikan sebagai next/script dengan strategy="afterInteractive". Tidak menggunakan kuki sehingga bebas dari blokir adblocker ketat, menjaga privasi, namun akurat melacak *pageviews* dan *referrers*.  
* **Live Chat (Chatwoot):** Widget dirender secara dinamis (next/dynamic dengan SSR dinonaktifkan) untuk mencegah pemblokiran *render-blocking* di skor Lighthouse.  
* **Meeting Booking (Cal.com):** Ditanamkan (*embedded*) pada rute /contact atau memicu *modal pop-up* untuk menjadwalkan konsultasi arsitektur sistem.  
* **SEO & Open Graph:** Dikelola menggunakan next-seo dengan implementasi **Schema.org** (JSON-LD untuk entitas *Person* dan *Article*) agar dapat dibaca sebagai Rich Snippets oleh Google.

## **7\. Fase Implementasi (Roadmap Checklist)**

Gunakan daftar centang ini untuk melacak progres komit di repositori:

### **Fase 1: Fondasi & Pengukuran (Minggu 1\)**

* \[ \] Inisiasi repositori Next.js App Router \+ Tailwind.  
* \[ \] Siapkan konfigurasi shadcn/ui dan instal komponen dasar (Button, Input, Card).  
* \[ \] Pasang Github Actions untuk Lighthouse CI & pa11y (Aksesibilitas).  
* \[ \] Pasang script analitik Umami di /app/layout.tsx.

### **Fase 2: Sistem Desain & Konversi (Minggu 2\)**

* \[ \] Buat pipeline otomatisasi Style Dictionary dari Figma tokens.json.  
* \[ \] Implementasikan form langganan (*Newsletter Form*) yang terhubung ke /api/leads.  
* \[ \] Integrasikan *widget* Chatwoot & Cal.com.

### **Fase 3: Storage & Arsitektur Data (Minggu 3\)**

* \[ \] Setup dan deploy Payload CMS 3.0 beserta database PostgreSQL.  
* \[ \] Buat skema koleksi Posts, Leads, dan AuditLogs.  
* \[ \] Bangun UI frontend untuk merender data Posts (Blog/Case Studies).

### **Fase 4: Audit Engine & Ingestion (Minggu 4\)**

* \[ \] Buat *endpoint* /api/audit untuk mendeteksi AI Slop.  
* \[ \] Setup *cron job* via GitHub Actions untuk menyerap RSS/Firecrawl.  
* \[ \] Integrasikan pipeline dari sumber \-\> Audit Engine \-\> Payload CMS.

## **8\. Kurasi Repository Open-Source (Tech Stack)**

Berikut adalah daftar pustaka rujukan untuk instalasi:

* **Core CMS:** [Payload CMS](https://github.com/payloadcms/payload)  
* **A11y UI:** [Radix UI Primitives](https://github.com/radix-ui/primitives) / [shadcn/ui](https://github.com/shadcn/ui)  
* **Design Ops:** [Style Dictionary](https://github.com/amzn/style-dictionary)  
* **Audit Engine:** [LLM Guard](https://github.com/protectai/llm-guard) / [AI Slop Detector](https://github.com/flamehaven01/ai-slop-detector)  
* **Ingestion:** [Firecrawl](https://github.com/firecrawl/firecrawl) / [RSSHub](https://github.com/DIYgod/RSSHub)  
* **Analytics & Lead:** [Umami](https://github.com/umami-software/umami) / [Chatwoot](https://github.com/chatwoot/chatwoot)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAaCAYAAADL5WCkAAADPklEQVR4Xu2Xv2sUQRTHN6eCP1DE5sxxd3MHBweihZ4iCBaCCiaihRD/APEHxEKUWBkRLS20EpRoYWNpI1oEtRALFUVBFKuciEIi/hZ/h/h92Tfw8pzdm12OFDIfeOzN9/2YN7N7c3tRFAgEAoFcGGMuwT7DpoSNs7sHnyeU7z2sb0aRWQLzDpu412+wPdrfgQJyHvIaXmE8Vzqh/arVaofq9XqxXC4vqFarm6G1ZYw3drO0TkC/Tb5Go7FE+1wg9irsA6xX+/KCWs9go2L8FHZXxiSBuDXUP20Uj3fptdLYYZtkjC/0BFLyI+0gbHGtdwI552CTsNXalwW6ia75ScPTtFTrium1VSqVtVZwrYdrncB1BNfd0pcJFBjkCXdoH8GT/9S6Lyb+elKNfu3zAXmP9eJZp5ojWpfA33bkFlqt1jwpOGLygULjScWwwRu56ZPalxWcQ3upFu78fu1Lg+f/p78kXSJjMP8KzL1cxxCd6nhjJ8REO3Hth/XBtpGhgXvko0NZ5+UFNbfznMe0z4XcEB9dwjEvYRNYwzJcD5JWLBYXOeJGYa9h12lsz9hMcKEXsCPSsOij7EttOA+4cQeoLp78ldqnSeohSbfA1+uKwXjModHmGTu2a5cxHTF8XpqE1x325T4vNXzIU+NbtS8J14ak6RZ6+lwx2Kjj3ENT6hrOvan1RBD8Vk9mgb6BC57SvqxgE8+jzh981VZpXydcG5KmSziG3iuldpj1IavpHyTCp/4M0hJMfIZMlUqlhdrnC/KvwT4lHfw+IP+Lq0fu/bnWJRxj/4RYbYh0PKH7eHyRxjhy1qk4yv0ttTTmcEJX3y8JbN595La78cOFRQ+4+uANadkx5pwPbVDFvNG5iDvLWg/HXIZN2jHRbDYX8/ovWC0VNHKGGxrQPtqEvJuJnDuRaKwbUB/0oyXGp3Vvtl96BbKaPTfpl1zF3bLjKP6r+V2MKWZM13eCoCsm/urQX753sI8mvjN28q+skY9iftBrk64zm9iby0/8E+opUjeMeoT+QGoENncL5Zr4tYeuN3QM/UNi3/Q7t1HnbOB/wMQv/l6G8ILODwjwdVvva1GXz9ZAIBAIBAKBbPwF4HNLBq4tnmAAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAbCAYAAAB4Kn/lAAABJklEQVR4Xu2TP2vCUBTFA3Z2kU4J+QOvdHBzcnLyE4ir0MW5H6NrcWlXwcXP4KcQXAUHF/8sKm5Se264L6SnJI1KcckPLgn3nJy8d1/iOCV3w/f9tyAIzukyxjyKhvs9+/8EgV0NWrKG3gG1Q32xlgtC+xKKa5s1ASuu6ksHrGUSRVFLHgrDcMhaGvG4rlvjfiZ2jtxningSsMqxjuCVNQaeHvcyKbrai/mXYDkIDT6wxsAz4l4eFQ1escBcvKsio8ABN1Ev3M8FoXMNrrCmyK7W3PQ87wn9LWqK/+CZ9Rhd9cmhcPQaqE26Z7G7lD8W9cF6AowTOxbUUa7yEPss1gvPJ2u3EO8MwR0Nr7PhKnQMD3q/+KneAL6QdwTOUHMcomG9pOQ336BlVg8KRkI9AAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAaCAYAAABVX2cEAAAA+UlEQVR4XmNgGAVkAXl5+c1A/J9YjK4fBYAUyMnJhaGLoWtUUFDQQBdDATIyMkJABZvRhJmghl1AE2cAWvoIXQwOgBq2AilGZDGgCwpAhgFpf2RxLS0tNqB4H7IYCgDalI8uBtTwHpt3gIYLKCoqiqOL4wXYwotcwAw17Ay6BMkA6O1yqGHe6HIkA6Ahn6nlReqFFzTqCYYXUP4iMGZXAunX6HJwAJScDTIMqDABXQ4GoK5mRmKjSAYB8Td5SNp6C8WgcPuFrhhoyUyg2D1kMbIB0KC/wNgOQRcnCwANOwDMAW4wPsUGg7wJNGQDiBYVFeVBlx8FwwUAAPxYU9KnNmBVAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAYAAABCfffNAAABcklEQVR4Xu2TTSsFURjHx0tRUoqamhkzt5nR2PgAbCh2FsrGB7CUspOV5CuIlJ2tr+ALWMnCghUbXUo2Qojf0Tk6Hs3cMXPt7q+ezjnP/znPy7l3HKdDuwiCwG80GmvYfhiGsfFHUTRlx1WCJIfYB3aJzVNsjHUXu8EmlSbv/Amd/NV13QGpMdGG0lnPpFYaEry16lI3sSj9peDigy7QIzWbVk3kwptP6A6vpCapXISL7+pylmWDUmsbeopqHZalqAj/pAW+kVnWaWyG/ZyT87uRY0fn6ZWaKXIn/Qr8KyTeNI2wX8fdLeMMec0WTmJQOpNcSL8N+jhxT9L/BcK5SpKmaZ/UFHS/qossSQ3fENotdoodq6llzDfWND+eIo7jsGDSLtuvG+m3A36hOjEJsXt9aUtrRzKerq/xH5hzTiP1UEmTJBlVez7olPOzjKkNSR/NnolPOG8z3Z4dUxvP80ZI/II1fd8f1k+8LOM6dPg/PgF7tWt2EV5xEQAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAaCAYAAACHD21cAAAA3ElEQVR4XmNgGPpASUlJTUFBYaacnJwvTExeXr4EWQ0KMDY2ZgUq+AfEs1VUVPgUFRXtgOz/QFwDxJ/R1cMBSBHQFhts4kBchS4OBkANC0AK0MVBACQOcg26OBhATcWpEV0MDmAagbgXXQ4vAGroRtIMxkDnz0BXhxUAFeahawZGyy10dXgB0BAXmGZ0OTgASgaji4EAUHwxTo2ysrJ+QOcUoIuDAFBTKU6NQImzQLwOXRwEgOJ/cQYQzB+ioqI8aOJr5QkksydAiglIf4Aa8h5Eg1ISutpRMArAAACyeETnPMaJVAAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAaCAYAAAD2dwHCAAADj0lEQVR4Xu2YyWsUURDGEzcERQQZB5ylZzLjFvAQA4q4ISgiohdX9OQ/YERcQDyIeNEoKBJQPBiMoAcVRBSXS0TEiEsUT/HiJV70YFwCcUniVzP1hprPzkzPTAhI+gdFv1dVr169mtevu6euLiQkZGyoTyaT61jJJBKJOawLTENDw7xUKnURE21yOs/zDlif/w3kvwvyMZ1OL8F1GNco+wiwfcf6k6wvS3Nz82QMHoJcymazMzDBKpkIclSCsn8N1LNiJPADHtKchtFuZ7sAWzd2y8rGxsYpsVgsrvn2kc8wLhOlLb6yHkg/Nske2Y243hYfXB/acYHRBFf46SFHWF8p8Xh8LuL8hHSwzQ/49chCTb9fi2CZpPlZ+WUdUJAFPA79l66NjRJRHccOhvyqIw0WvexK1gcFya/WRbWyrRSuGK6PHFtUd438eiBtmOek33mFcVt5begP2T58HlR1uwqcqGUkfTkwbreMxaL2sS0ImlO/62OBh1V3xvpB/9j2fZjAa0D/mWvjePKqvl0FVzxOrBr0nJIjYDvbagExv2oRis7MAMXLrQ8FSmn7OAo239oKjtWAAK2mgDlBUhfYrxTI7ZyMs+fUaIG4pyQ2zs1FPrbXkD+Qu5BPkA/sg9ym6rpuQF44PdqdmUwmYX2rAsXa6wrnBJO+Zz8/3LmG60621QIWNhsxzyL2E0gvnqaz2Af6AepL7kVPWz/wQ2Sx5vuuj3nWY9wQdNetX8UgwFpXQLaVQm5VHbefbbWCmCcktrxCsc0iixe/aDQ6jW0Wuza0l7k+rk2B7zo4b2GdAH1HpcVzYPLlWsRTbKuBeo1ZMifsoGPig+sOtjlgf4qdFzN9eZcs/ODl5siB82lzaoSnIQIcDBSkBIifQYwByFW2lcLTnSBfBKQvKh73VXdadHL3WL0jlX/vu2N16r/N9N9Yuy9wegW5xXoB+sHA27cMSHgm4n2GPGKbH/B7p4XpJL3ouHjd5NNlfRg/m+ioeG+t3ReXTCQSmU76m97ofpLl0E/ALtYz8FkM+U26K5KrHOxGd94rPl9zXxwoxGWjKwD9c7/vWi9/2xa+3yWGtfsCp966/EtknwyAfNHJ29l3rJGdoDn9gAxqew37QXdPbd809xb2EWBb6NHXiQP6tMyh7SZIG/uMazz65mVG7VWlUlL5l9CNAWUDjx/XyN9BKODSIMJP0JCQkJCQkJCQf/kLDD4xu19vxhIAAAAASUVORK5CYII=>