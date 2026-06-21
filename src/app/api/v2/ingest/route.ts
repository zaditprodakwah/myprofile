import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { JobOrchestrator } from '@/modules/audit/application/job-orchestrator';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const featureFlag = process.env.AUDIT_PIPELINE_V2 === 'true';
    if (!featureFlag) {
      return NextResponse.json({ error: 'Audit Pipeline V2 is disabled via Feature Flag.' }, { status: 403 });
    }

    const payload = await req.json();
    const { target_url, email, source } = payload;

    if (!target_url) {
      return NextResponse.json({ error: 'target_url is required' }, { status: 400 });
    }

    // 1. Insert into legacy utility_leads for backward compatibility & funnel tracking
    const { data: lead, error: leadError } = await supabase
      .from('utility_leads')
      .insert([
        {
          target_site_url: target_url,
          email: email || null,
          is_public: true, // Derived from logic
        }
      ])
      .select('id')
      .single();

    if (leadError) {
      console.warn('Failed to insert into utility_leads', leadError);
    }

    // 2. Create the Job
    const jobId = uuidv4();
    const { error: jobError } = await supabase.from('jobs').insert([
      {
        id: jobId,
        target_type: 'DOMAIN',
      }
    ]);

    if (jobError) {
      throw new Error(`Failed to create job: ${jobError.message}`);
    }

    // 3. Emit AuditRequested Event via Orchestrator
    const orchestrator = new JobOrchestrator();
    const correlationId = uuidv4();
    
    await orchestrator.emitEvent({
      job_id: jobId,
      aggregate_id: jobId, // The Job is the aggregate root here
      aggregate_type: 'JOB',
      event_name: 'AuditRequested',
      event_version: 1,
      payload_json: { target_url, source: source || 'web_form', lead_id: lead?.id },
      metadata_json: {},
      correlation_id: correlationId,
    });

    // 4. Return standard response
    return NextResponse.json(
      {
        job_id: jobId,
        status: 'QUEUED',
        message: 'Audit successfully requested',
        correlation_id: correlationId,
      },
      { status: 202 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
