import { NextResponse } from 'next/server';
import { getTelemetryCache } from '@/lib/telemetry-cache';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const revalidate = 21600; // 6 hours

export async function GET() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY || '';
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      data: "Di tengah suku bunga global tinggi, prioritaskan performa web sub-detik untuk menekan bounce rate dan memaksimalkan ROI konversi iklan secara organik."
    });
  }

  try {
    // Fetch telemetry from DB cache
    const fredData = await getTelemetryCache('fred_funds', 99999);
    const bpsData = await getTelemetryCache('bps_macro', 99999);
    const marketData = await getTelemetryCache('markets_telemetry', 99999);

    const gdpGrowth = bpsData?.gdpGrowth || '5.05%';
    const inflationRate = bpsData?.inflationRate || '2.75%';
    const biRate = bpsData?.biRate || '6.25%';
    const fedRate = fredData?.value ? `${fredData.value}%` : '5.25%';
    
    let usdIdr = 'Rp 16.420';
    let btcChange = '+1.2%';

    if (Array.isArray(marketData)) {
      const fxVal = marketData.find((m: any) => m.symbol === 'USD/IDR');
      if (fxVal) usdIdr = `Rp ${Number(fxVal.price).toLocaleString('id-ID')}`;
      const btcVal = marketData.find((m: any) => m.symbol === 'BTC/USD');
      if (btcVal) btcChange = `${btcVal.change >= 0 ? '+' : ''}${btcVal.change}%`;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: 'Kamu adalah Growth Architect & Analis Bisnis senior untuk pasar digital Indonesia. Berikan satu kalimat wawasan makro strategis yang tajam untuk para pelaku bisnis.'
    });

    const prompt = `Data Telemetri Pasar Terbaru:
- PDB Riil Indonesia: ${gdpGrowth}
- Inflasi Tahunan: ${inflationRate}
- BI Rate: ${biRate}
- Fed Funds Rate: ${fedRate}
- Kurs USD/IDR: ${usdIdr}
- Perubahan Harian BTC: ${btcChange}

Tuliskan 1 kalimat ringkas "AI Macro & Business Outlook" (maksimal 25 kata) dalam Bahasa Indonesia. Kalimat harus asertif, menerjemahkan data moneter tersebut menjadi petunjuk taktis bagi pemilik bisnis digital Indonesia (misalnya tentang penyesuaian biaya infrastruktur, optimalisasi SEO, atau efisiensi anggaran konversi iklan). Jangan gunakan kata pembuka, tanda kutip, atau pengantar. Tulis langsung kalimatnya.`;

    const result = await model.generateContent(prompt);
    let outlookText = result.response.text().trim();
    
    // Clean up any outer quotes that Gemini might output
    outlookText = outlookText.replace(/^["']|["']$/g, '');

    return NextResponse.json({
      success: true,
      data: outlookText
    });
  } catch (err: any) {
    console.error('Error generating AI Macro Insight:', err);
    return NextResponse.json({
      success: true,
      data: "Di tengah suku bunga global tinggi, prioritaskan performa web sub-detik untuk menekan bounce rate dan memaksimalkan ROI konversi iklan secara organik."
    });
  }
}
