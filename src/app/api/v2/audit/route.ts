import { NextRequest, NextResponse } from 'next/server';
import { JobOrchestrator } from '@/modules/audit/application/job-orchestrator';
import { v4 as uuidv4 } from 'uuid';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
    // Max 10 requests per 15 minutes (900000ms)
    if (!checkRateLimit(ip, 10, 900000)) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak permintaan (Rate limit). Silakan coba lagi dalam beberapa menit.' }, { status: 429 });
    }

    const contentType = req.headers.get('content-type') || '';
    
    let targetUrl = '';
    let source = 'web';
    let pdfFileName = '';

    // Handle FormData (e.g. from PDF CV upload or generic multipart)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const type = formData.get('type') as string; // 'web', 'social', 'pdf'
      
      if (type === 'pdf') {
        const file = formData.get('file') as File | null;
        if (!file) {
          return NextResponse.json({ success: false, error: 'File PDF tidak ditemukan' }, { status: 400 });
        }
        // In a real scenario, we upload this to Supabase Storage here and get the URL.
        // For now, we simulate the target URL as a storage reference.
        targetUrl = `storage://cv-uploads/${Date.now()}_${file.name}`;
        source = 'pdf_cv';
        pdfFileName = file.name;
      } else if (type === 'social') {
        targetUrl = formData.get('socialUsername') as string;
        source = 'social';
      } else {
        targetUrl = formData.get('url') as string;
        source = 'web';
      }
    } else {
      // Handle JSON (Fallback)
      const body = await req.json();
      targetUrl = body.url || body.socialUsername;
      source = body.type || 'web';
    }

    if (!targetUrl) {
      return NextResponse.json({ success: false, error: 'Target URL/Username wajib diisi' }, { status: 400 });
    }

    const jobId = uuidv4();
    // Create the job row BEFORE emitting events (FK requirement)
    const { supabaseServer } = await import('@/lib/supabase-server');
    const { error: jobError } = await supabaseServer
      .from('jobs')
      .insert([{ id: jobId, target_type: source.toUpperCase(), target_id: null }]);

    if (jobError) {
      throw new Error(`Gagal mendaftarkan antrean audit: ${jobError.message}`);
    }

    // Trigger the orchestration event
    const orchestrator = new JobOrchestrator();
    await orchestrator.emitEvent({
      job_id: jobId,
      aggregate_id: jobId,
      aggregate_type: 'Job',
      event_name: 'AuditRequested',
      event_version: 1,
      payload_json: {
        target_url: targetUrl,
        source: source,
      },
      metadata_json: {
        requested_via: 'v2_api',
        filename: pdfFileName || undefined
      },
      correlation_id: jobId
    });

    return NextResponse.json({
      success: true,
      data: {
        job_id: jobId,
        status: 'QUEUED',
        message: 'Audit berhasil didaftarkan ke antrean pemrosesan.'
      }
    });

  } catch (error: any) {
    console.error('v2/audit API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
