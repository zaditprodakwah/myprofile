import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JobOrchestrator } from '@/modules/audit/application/job-orchestrator';
import { analyzeSlop } from '@/lib/slop-detector';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const jobId = formData.get('jobId') as string;

    if (!file || !jobId) {
      return NextResponse.json({ success: false, error: 'File atau JobID tidak valid' }, { status: 400 });
    }

    const orchestrator = new JobOrchestrator();

    // 1. Read PDF — menggunakan pdf-parse yang native/standard
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';
    try {
      // Dynamic import — pdf-parse v2 exports directly (no .default)
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
      const pdfData = await pdfParse(buffer);
      text = pdfData.text || '';
    } catch (parseError: any) {
      console.warn('PDF Parse failed, proceeding with empty text:', parseError.message);
      text = '[Tidak dapat mengekstrak teks dari PDF. Kemungkinan file terproteksi atau rusak.]';
    }

    await orchestrator.emitEvent({
      job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
      event_name: 'CollectionCompleted', event_version: 1,
      payload_json: { extracted_text_length: text.length },
      metadata_json: {}, correlation_id: jobId,
    });

    // 2. Analyze with Gemini — metrik spesifik CV/Resume
    const geminiKey = process.env.GEMINI_API_KEY || '';
    let scores = {
      ats_formatting: 70,
      keyword_density: 65,
      impact_narrative: 72
    };

    if (geminiKey && text.length > 50) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        // Coba beberapa model sebagai fallback jika satu tidak tersedia
        let model;
        try {
          model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        } catch {
          model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        }

        const prompt = `
          Anda adalah pakar HR Senior dan sistem ATS (Applicant Tracking System) profesional.
          Analisis teks CV/Resume berikut secara menyeluruh dan berikan skor dari 0-100 untuk tiga kategori ini:
          
          1. "ats_formatting": Penilaian struktur & format — apakah CV mudah dibaca oleh mesin ATS? (Cek: urutan kronologis, heading yang jelas, tidak ada tabel/kolom rumit)
          2. "keyword_density": Kepadatan & relevansi kata kunci industri — apakah kata kunci profesi yang relevan ada dalam CV? (Cek: jabatan, skill teknis, tool/teknologi)
          3. "impact_narrative": Kualitas narasi & dampak — apakah pengalaman ditulis dengan kata kerja aktif + kuantifikasi hasil? (Contoh bagus: "Meningkatkan efisiensi 30%")
          
          Teks CV (maks. 3000 karakter pertama):
          "${text.substring(0, 3000)}"
          
          Balas dengan format JSON murni tanpa markdown, tanpa penjelasan tambahan:
          {"ats_formatting": 85, "keyword_density": 70, "impact_narrative": 90}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text()
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        
        const parsed = JSON.parse(responseText);
        scores = {
          ats_formatting: Math.max(0, Math.min(100, parsed.ats_formatting || 70)),
          keyword_density: Math.max(0, Math.min(100, parsed.keyword_density || 65)),
          impact_narrative: Math.max(0, Math.min(100, parsed.impact_narrative || 72)),
        };

        await orchestrator.emitEvent({
          job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
          event_name: 'AnalysisCompleted', event_version: 1,
          payload_json: { llm_raw_output: parsed, source: 'gemini' },
          metadata_json: {}, correlation_id: jobId,
        });

      } catch (llmError: any) {
        console.warn('LLM Error in CV Audit (using heuristic fallback):', llmError.message);
        // Heuristic fallback: analisis panjang teks sebagai proxy
        const wordCount = text.split(/\s+/).length;
        scores.ats_formatting = Math.min(90, 50 + Math.min(wordCount / 20, 40));
        scores.keyword_density = 60; // default conservative
        scores.impact_narrative = text.includes('%') || text.includes('meningkat') ? 75 : 60;

        await orchestrator.emitEvent({
          job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
          event_name: 'AuditFailed', event_version: 1,
          payload_json: { reason: 'LLM_UNAVAILABLE', fallback: 'heuristic', error: llmError.message },
          metadata_json: {}, correlation_id: jobId,
        });
      }
    } else {
      // Tidak ada API key — langsung gunakan heuristic
      const wordCount = text.split(/\s+/).length;
      scores.ats_formatting = Math.min(85, 45 + Math.min(wordCount / 20, 40));
      scores.keyword_density = 58;
      scores.impact_narrative = 63;
    }

    // 2.5 Perform Slop Analysis on CV Text
    const slopData = analyzeSlop(text);
    if (slopData.slopScore > 40) {
      scores.impact_narrative = Math.max(0, scores.impact_narrative - (slopData.slopScore * 0.4)); // Reduce score up to 40 points
    }

    // 3. Emit scoring & recommendation events
    await orchestrator.emitEvent({
      job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
      event_name: 'ScoringCompleted', event_version: 1,
      payload_json: { scores },
      metadata_json: {}, correlation_id: jobId,
    });

    // Generate CV-specific recommendations
    const recommendations: string[] = [];
    if (scores.ats_formatting < 70) recommendations.push('Sederhanakan format CV — hindari tabel, kolom ganda, dan gambar agar mudah dibaca sistem ATS.');
    if (scores.keyword_density < 70) recommendations.push('Tambahkan kata kunci industri yang relevan dengan posisi yang dituju (skill teknis, tools, sertifikasi).');
    if (scores.impact_narrative < 70) recommendations.push('Tulis ulang poin pengalaman dengan kata kerja aktif dan kuantifikasi hasil (contoh: "Meningkatkan sales 25%").');
    if (slopData.slopScore > 40) recommendations.push('Kurangi penggunaan kata klise AI (AI Slop) dalam deskripsi pengalaman Anda untuk memberi kesan orisinal dan profesional.');
    if (recommendations.length === 0) recommendations.push('CV Anda sudah dalam kondisi baik! Pertimbangkan menyesuaikan dengan setiap posisi yang dilamar.');

    await orchestrator.emitEvent({
      job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
      event_name: 'RecommendationGenerated', event_version: 1,
      payload_json: { recommendations },
      metadata_json: {}, correlation_id: jobId,
    });

    await orchestrator.emitEvent({
      job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
      event_name: 'AuditCompleted', event_version: 1,
      payload_json: { warnings: [] },
      metadata_json: {}, correlation_id: jobId,
    });

    return NextResponse.json({
      success: true,
      audit_type: 'cv',
      data: {
        ...scores,
        recommendations,
        word_count: text.split(/\s+/).length,
      }
    });

  } catch (error: any) {
    console.error('Audit CV Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
