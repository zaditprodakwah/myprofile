import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL target wajib diisi.' }, { status: 400 });
    }

    // Ensure URL has protocol
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Kunci API Google Cloud tidak terkonfigurasi di server.' }, { status: 500 });
    }

    // PageSpeed Insights API request url
    const psiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      targetUrl
    )}&key=${apiKey}&category=performance&category=accessibility&category=seo&strategy=mobile`;

    const res = await fetch(psiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 } // Cache results for 60 seconds
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('PSI API Response Error:', errText);
      return NextResponse.json({ 
        error: `PageSpeed Insights gagal merespons. Status: ${res.status}. Harap periksa apakah domain valid dan dapat diakses publik.` 
      }, { status: res.status });
    }

    const data = await res.json();
    const lh = data.lighthouseResult;

    if (!lh || !lh.categories) {
      throw new Error('Hasil audit Lighthouse tidak lengkap dalam respons API.');
    }

    const perfScore = Math.round((lh.categories.performance?.score || 0) * 100);
    const a11yScore = Math.round((lh.categories.accessibility?.score || 0) * 100);
    const seoScore = Math.round((lh.categories.seo?.score || 0) * 100);

    // Extract core web vitals and speed metrics
    const lcp = lh.audits['largest-contentful-paint']?.displayValue || 'N/A';
    const cls = lh.audits['cumulative-layout-shift']?.displayValue || 'N/A';
    const fcp = lh.audits['first-contentful-paint']?.displayValue || 'N/A';
    const speedIndex = lh.audits['speed-index']?.displayValue || 'N/A';

    // Parse top 3 conversion-blocking issues
    const recommendations: Array<{ id: string; title: string; description: string }> = [];
    const auditIds = [
      'largest-contentful-paint', 
      'color-contrast', 
      'tap-targets', 
      'unused-javascript', 
      'modern-image-formats',
      'render-blocking-resources',
      'viewport'
    ];
    
    for (const id of auditIds) {
      const audit = lh.audits[id];
      if (audit && audit.score !== null && audit.score < 0.9) {
        // Strip markdown links [Text](url) to keep copy clean
        const cleanedDesc = (audit.description || '')
          .replace(/\[Learn more\]\(.*\)\.?/gi, '')
          .replace(/\[Lakukan selengkapnya\]\(.*\)\.?/gi, '')
          .replace(/\[(.*?)\]\(.*?\)/gi, '$1')
          .trim();

        recommendations.push({
          id,
          title: audit.title,
          description: cleanedDesc || 'Dibutuhkan optimasi pada bagian ini.'
        });
      }
      if (recommendations.length >= 3) break;
    }

    // Fallbacks if target site is 100% perfect
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'perfect-site',
        title: 'Ekosistem Berkinerja Baik',
        description: 'Situs Anda memiliki skor sangat tinggi. Fokus selanjutnya adalah optimasi personalisasi konversi dan penulisan copy penjualan.'
      });
    }

    return NextResponse.json({
      success: true,
      scores: {
        performance: perfScore,
        accessibility: a11yScore,
        seo: seoScore
      },
      metrics: {
        lcp,
        cls,
        fcp,
        speedIndex
      },
      recommendations
    });
  } catch (error: any) {
    console.error('Audit API Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan sistem internal.' }, { status: 500 });
  }
}
