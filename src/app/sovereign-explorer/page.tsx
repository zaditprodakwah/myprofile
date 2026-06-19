import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from 'react';
import Link from 'next/link';
import { getReferenceItems } from '@/lib/data-server';
import { Database, BookOpen, CheckSquare, BarChart3, Globe, Search, ArrowRight, ShieldAlert } from 'lucide-react';
import ReferenceExplorerClient from './ReferenceExplorerClient';

export const revalidate = 3600; // ISR cache 1 hour

export default async function SovereignExplorerPage() {
  const referenceItems = await getReferenceItems();

  const explorerSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Bank Data Referensi & Playbook Pertumbuhan | Zadit Growth Engine",
    "description": "Gudang wawasan bisnis terintegrasi yang berisi playbook pertumbuhan B2B, checklist SEO teknis Next.js, dan telemetri indikator ekonomi makro terpercaya.",
    "url": "https://muhzadit.vercel.app/sovereign-explorer",
    "publisher": {
      "@type": "Person",
      "name": "Muhammad Khoiruzzadittaqwa",
      "jobTitle": "Full-Stack Growth Architect"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(explorerSchema) }}
      />
      <Header />
      <main className="bg-alabaster min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Breadcrumb */}
          <nav className="text-xs font-mono text-text-muted flex gap-2 items-center">
            <Link href="/" className="hover:text-teal-accent">Home</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Bank Data Referensi</span>
          </nav>

          {/* Page Title Header */}
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase block">
              {'// Rujukan Pertumbuhan & Intelijen Data B2B'}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
              Bank Data Referensi & Playbook
            </h1>
            <p className="text-sm md:text-base text-text-muted leading-relaxed">
              Koleksi playbook taktis, standardisasi teknis SEO, dan visualisasi indikator makroekonomi untuk memandu pengambilan keputusan bisnis berbasis data.
            </p>
          </div>

          {/* Client-Side Interactive Filter and Telemetry Workstation */}
          <ReferenceExplorerClient initialItems={referenceItems} />

        </div>
      </main>
      <Footer />
    </>
  );
}
