'use client';

import React, { useRef, useState } from 'react';
import { Download, Loader2, CheckCircle, FileText } from 'lucide-react';

interface PdfExportGeneratorProps {
  auditResult: {
    success: boolean;
    data?: {
      accessibility?: number;
      performance?: number;
      narrative?: number;
      recommendations?: string[];
    };
  };
  formData: {
    name: string;
    whatsapp: string;
    url?: string;
    email?: string;
    socialUsername?: string;
  };
  activeTab: 'web' | 'social' | 'pdf';
}

export default function PdfExportGenerator({
  auditResult,
  formData,
  activeTab,
}: PdfExportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Dynamically import jspdf and html2canvas to prevent SSR issues
      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ]);

      const element = reportRef.current;
      if (!element) {
        throw new Error('Elemen laporan tidak ditemukan.');
      }

      // Temporarily make the hidden element visible for capturing
      element.style.display = 'block';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      // Hide the element again
      element.style.display = 'none';

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const cleanTargetName = (activeTab === 'web' ? formData.url : formData.name) || 'Audit';
      const sanitizedFilename = `ZADIT-Audit-${cleanTargetName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      pdf.save(sanitizedFilename);

    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Gagal membuat PDF. Silakan coba kembali.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getTargetLabel = () => {
    if (activeTab === 'web') return formData.url || 'Situs Web';
    if (activeTab === 'social') return `@${formData.socialUsername}` || 'Profil Sosial Media';
    return 'Dokumen CV/Resume';
  };

  const getRecommendations = () => {
    if (auditResult.data?.recommendations && auditResult.data.recommendations.length > 0) {
      return auditResult.data.recommendations;
    }
    // Default recommendations based on activeTab
    if (activeTab === 'web') {
      return [
        'Optimalkan Largest Contentful Paint (LCP) dengan mengompres gambar latar belakang dan menunda JavaScript non-kritis.',
        'Tingkatkan kontras elemen teks visual dan pastikan semua elemen interaktif memiliki label ARIA.',
        'Pasang mekanisme HTTP Caching dan optimalkan pemuatan pustaka pihak ketiga.',
      ];
    } else if (activeTab === 'pdf') {
      return [
        'Gunakan tata letak kolom tunggal standar untuk memastikan kompatibilitas penuh dengan mesin ATS.',
        'Perkaya kata kunci spesifik industri (misal: Node.js, Next.js, Cloud Native) di bagian ringkasan profil.',
        'Pastikan format file tidak mengandung gambar grafis atau bagan untuk informasi esensial.',
      ];
    }
    return [
      'Gunakan kata kunci dan penanda visual yang jelas untuk menarik audiens sasaran.',
      'Sertasikan portofolio tautan aktif langsung ke halaman layanan utama Anda.',
      'Optimalkan bio profile dengan proposisi nilai (Unique Value Proposition) yang ringkas.',
    ];
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleDownloadPdf}
        disabled={isGenerating}
        className="flex-1 bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans font-bold uppercase tracking-wider py-4 rounded-xl text-center transition-all shadow-sm text-xs flex items-center justify-center gap-2 select-none active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyusun Laporan PDF...
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" /> Unduh Laporan PDF Lengkap
          </>
        )}
      </button>

      {/* Hidden PDF template for html2canvas to capture */}
      <div
        ref={reportRef}
        style={{
          display: 'none',
          width: '800px',
          padding: '40px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#1A202C',
          backgroundColor: '#FFFFFF',
          lineHeight: '1.5',
        }}
      >
        {/* Header Branding */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0F172A', letterSpacing: '-0.025em' }}>ZADIT</h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#718096', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Growth & Performance Partners</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', backgroundColor: '#E2E8F0', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#4A5568' }}>LAPORAN AUDIT RESMI</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#718096' }}>Tanggal: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Audit Target Card */}
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detail Audit</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#718096' }}>Nama Pemohon</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>{formData.name}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#718096' }}>Target Audit</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', wordBreak: 'break-all' }}>{getTargetLabel()}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#718096' }}>Kategori Audit</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>{activeTab === 'pdf' ? 'ATS CV / Professional Resume Audit' : 'Digital Platform & Performance Audit'}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#718096' }}>Status Hasil</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#0D9488' }}>Selesai / Terverifikasi</p>
            </div>
          </div>
        </div>

        {/* Score Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '35px' }}>
          {/* Performance / ATS Score */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>PERFORMANCE</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0F172A' }}>{auditResult.data?.performance || 0}<span style={{ fontSize: '16px', color: '#718096', fontWeight: 'normal' }}>/100</span></div>
            <p style={{ margin: '8px 0 0 0', fontSize: '10px', color: '#718096' }}>Kecepatan memuat & efisiensi teknis target.</p>
          </div>

          {/* Accessibility Score */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>ACCESSIBILITY</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0F172A' }}>{auditResult.data?.accessibility || 0}<span style={{ fontSize: '16px', color: '#718096', fontWeight: 'normal' }}>/100</span></div>
            <p style={{ margin: '8px 0 0 0', fontSize: '10px', color: '#718096' }}>Kesesuaian standar navigasi & struktur teks.</p>
          </div>

          {/* Narrative / Content Score */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>NARRATIVE & SEO</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0F172A' }}>{auditResult.data?.narrative || 0}<span style={{ fontSize: '16px', color: '#718096', fontWeight: 'normal' }}>/100</span></div>
            <p style={{ margin: '8px 0 0 0', fontSize: '10px', color: '#718096' }}>Kualitas narasi profesional & optimalisasi konten.</p>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '15px', color: '#0F172A' }}>Rekomendasi Utama (Prioritas Tinggi)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {getRecommendations().map((rec, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '50%', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>!</span>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155' }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer & Call to Action */}
        <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '20px', marginTop: '30px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', color: '#0F172A' }}>Ingin Mengimplementasikan Hasil Rekomendasi Ini?</h3>
          <p style={{ margin: '0 auto 15px auto', fontSize: '11px', color: '#718096', maxWidth: '500px' }}>
            Zadit adalah mitra pertumbuhan digital Anda. Hubungi spesialis optimasi kami untuk implementasi menyeluruh atau konsultasi lanjutan secara personal.
          </p>
          <div style={{ display: 'inline-flex', gap: '20px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 20px', borderRadius: '30px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0F172A' }}>WhatsApp: +62 823-1636-3177</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0F172A' }}>Website: https://zadit.com</span>
          </div>
          <p style={{ margin: '20px 0 0 0', fontSize: '9px', color: '#A0AEC0' }}>
            Dokumen ini dihasilkan secara otomatis oleh Zadit Audit Engine V2. Isi laporan bersifat rahasia dan ditujukan bagi pemohon terdaftar.
          </p>
        </div>
      </div>
    </>
  );
}
