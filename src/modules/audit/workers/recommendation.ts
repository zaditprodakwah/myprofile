import { JobOrchestrator } from '../application/job-orchestrator';
import { supabaseServer as supabase } from '@/lib/supabase-server';
import { PresenceLogger } from '@/modules/shared/infrastructure/logger';
import { v4 as uuidv4 } from 'uuid';

export class RecommendationEngine {
  private orchestrator: JobOrchestrator;

  constructor() {
    this.orchestrator = new JobOrchestrator();
  }

  public async execute(jobId: string, snapshotId: string, correlationId: string): Promise<void> {
    const logger = new PresenceLogger({ job_id: jobId, trace_id: correlationId, state: 'RECOMMENDING' });
    const startTime = Date.now();

    try {
      logger.info(`Starting recommendation generation for snapshot ${snapshotId}`);

      const { data: snapshot, error: fetchError } = await supabase
        .from('snapshots')
        .select('*')
        .eq('id', snapshotId)
        .single();

      if (fetchError || !snapshot) throw new Error('Failed to fetch snapshot data');

      const lighthouse = snapshot.lighthouse_json as any || {};
      const perf = snapshot.performance_metrics_json as any || lighthouse;
      const seo = snapshot.seo_metrics_json as any || lighthouse;
      const slopScore = lighthouse.slop_score || 0;

      const recommendations = [];

      // Generate deterministically
      if (perf.lcp_ms > 2500) {
        recommendations.push({
          id: uuidv4(),
          snapshot_id: snapshotId,
          category: 'performance',
          severity: perf.lcp_ms > 4000 ? 'high' : 'medium',
          message: 'Largest Contentful Paint terlalu lambat',
          action_items: [
            'Optimalkan image compression',
            'Gunakan lazy loading',
            'Enable CDN caching'
          ],
          rule_id: 'PERF_LCP_01'
        });
      }

      if (!seo.has_h1) {
        recommendations.push({
          id: uuidv4(),
          snapshot_id: snapshotId,
          category: 'seo',
          severity: 'high',
          message: 'Halaman tidak memiliki tag H1',
          action_items: [
            'Tambahkan tag H1 yang relevan dengan keyword',
            'Pastikan hanya ada satu H1 per halaman'
          ],
          rule_id: 'SEO_H1_01'
        });
      }

      if (slopScore > 40) {
        recommendations.push({
          id: uuidv4(),
          snapshot_id: snapshotId,
          category: 'content',
          severity: slopScore > 70 ? 'high' : 'medium',
          message: 'Terdeteksi penggunaan bahasa klise AI (AI Slop) yang tinggi',
          action_items: [
            'Hapus kata-kata klise AI (misalnya: delve, tapestry, revolutionize)',
            'Sederhanakan struktur kalimat agar lebih natural',
            'Fokus pada orisinalitas narasi bisnis dan hindari format kosong'
          ],
          rule_id: 'CONTENT_SLOP_01'
        });
      }

      if (recommendations.length > 0) {
        const { error: insertError } = await supabase.from('recommendations').insert(recommendations);
        if (insertError) throw new Error(`Failed to insert recommendations: ${insertError.message}`);
      }

      const recIds = recommendations.map(r => r.id);

      // Emit Event
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'RecommendationGenerated',
        event_version: 1,
        payload_json: { recommendation_ids: recIds },
        metadata_json: {},
        correlation_id: correlationId,
      });

      logger.info('Recommendations completed', { duration_ms: Date.now() - startTime });

    } catch (error: any) {
      logger.error('Recommendation failed', error, { duration_ms: Date.now() - startTime });
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'AuditFailed',
        event_version: 1,
        payload_json: { reason: 'RECOMMENDATION_ERROR', error_message: error.message },
        metadata_json: {},
        correlation_id: correlationId,
      });
    }
  }
}
