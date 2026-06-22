import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFParse } from 'pdf-parse';
import { JobOrchestrator } from '@/modules/audit/application/job-orchestrator';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const jobId = formData.get('jobId') as string;

    if (!file || !jobId) {
      return NextResponse.json({ success: false, error: 'File atau JobID tidak valid' }, { status: 400 });
    }

    const orchestrator = new JobOrchestrator();

    // 1. Read PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workerPath = path.resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
    PDFParse.setWorker(pathToFileURL(workerPath).href);
    const pdfParser = new PDFParse({ data: buffer });
    let text = '';
    try {
      const pdfData = await pdfParser.getText();
      text = pdfData.text;
    } finally {
      await pdfParser.destroy();
    }

    await orchestrator.emitEvent({
      job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
      event_name: 'CollectionCompleted', event_version: 1,
      payload_json: { extracted_text_length: text.length },
      metadata_json: {}, correlation_id: jobId,
    });

    // 2. Analyze with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Anda adalah pakar HR dan ATS (Applicant Tracking System).
      Analisis teks CV/Resume berikut dan berikan skor dari 0-100 untuk tiga kategori:
      1. Keterbacaan & Struktur (Accessibility)
      2. Kepadatan Kata Kunci & Relevansi Industri (Performance)
      3. Profesionalisme & Kualitas Narasi (Narrative)
      
      Teks CV:
      "${text.substring(0, 3000)}"
      
      Balas dengan format JSON murni tanpa markdown:
      {"accessibility": 85, "performance": 70, "narrative": 90}
    `;

    let scores = { accessibility: 75, performance: 75, narrative: 75 };
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '');
      const parsed = JSON.parse(responseText);
      scores = {
        accessibility: parsed.accessibility || 75,
        performance: parsed.performance || 75,
        narrative: parsed.narrative || 75
      };
      
      await orchestrator.emitEvent({
        job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
        event_name: 'AnalysisCompleted', event_version: 1,
        payload_json: { llm_raw_output: parsed },
        metadata_json: {}, correlation_id: jobId,
      });
      
    } catch (llmError: any) {
      console.warn('LLM Error in CV Audit:', llmError);
      // Fallback if API key fails
      await orchestrator.emitEvent({
        job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
        event_name: 'AuditFailed', event_version: 1,
        payload_json: { reason: 'LLM_FAILED', error: llmError.message },
        metadata_json: {}, correlation_id: jobId,
      });
    }

    // 3. Complete and Return
    await orchestrator.emitEvent({
      job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
      event_name: 'ScoringCompleted', event_version: 1,
      payload_json: { scores },
      metadata_json: {}, correlation_id: jobId,
    });
    
    await orchestrator.emitEvent({
      job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
      event_name: 'RecommendationGenerated', event_version: 1,
      payload_json: { recommendations: ['Perbarui kata kunci', 'Perbaiki format PDF ke ATS-friendly'] },
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
      data: scores
    });
  } catch (error: any) {
    console.error('Audit CV Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
