export interface BaseEvent {
  id: string;
  job_id: string;
  aggregate_id: string;
  aggregate_type: string;
  event_name: string;
  event_version: number;
  event_sequence?: number; // BIGSERIAL ordering
  payload_json: Record<string, any>;
  metadata_json: Record<string, any>;
  correlation_id: string;
  causation_id?: string;
  occurred_at: string;
}

export interface AuditRequestedEvent extends BaseEvent {
  event_name: 'AuditRequested';
  payload_json: {
    target_url: string;
    source: string;
    lead_id?: string;
  };
}

export interface AuditValidatedEvent extends BaseEvent {
  event_name: 'AuditValidated';
  payload_json: {
    entity_id: string;
    domain_id: string;
  };
}

export interface DiscoveryCompletedEvent extends BaseEvent {
  event_name: 'DiscoveryCompleted';
  payload_json: {
    sitemap_found: boolean;
    paths_discovered: string[];
  };
}

export interface AuditStartedEvent extends BaseEvent {
  event_name: 'AuditStarted';
  payload_json: {
    worker_id: string;
    audit_run_id: string;
  };
}

export interface AuditCollectedEvent extends BaseEvent {
  event_name: 'AuditCollected';
  payload_json: {
    snapshot_id: string;
    lighthouse_metrics: Record<string, any>;
  };
}

export interface SnapshotNormalizedEvent extends BaseEvent {
  event_name: 'SnapshotNormalized';
  payload_json: {
    snapshot_id: string;
  };
}

export interface ScoreComputedEvent extends BaseEvent {
  event_name: 'ScoreComputed';
  payload_json: {
    snapshot_id: string;
    scores: {
      performance: number;
      seo: number;
      accessibility: number;
      best_practices: number;
      composite: number;
    };
  };
}

export interface SnapshotCreatedEvent extends BaseEvent {
  event_name: 'SnapshotCreated';
  payload_json: {
    snapshot_id: string;
  };
}

export interface RecommendationGeneratedEvent extends BaseEvent {
  event_name: 'RecommendationGenerated';
  payload_json: {
    recommendation_ids: string[];
  };
}

export interface DirectoryPublishedEvent extends BaseEvent {
  event_name: 'DirectoryPublished';
  payload_json: {
    directory_url: string;
  };
}

export interface AuditCompletedEvent extends BaseEvent {
  event_name: 'AuditCompleted';
  payload_json: {
    success: boolean;
  };
}

export interface AuditFailedEvent extends BaseEvent {
  event_name: 'AuditFailed';
  payload_json: {
    reason: string;
    error_message: string;
  };
}

export interface EntityDiscoveredEvent extends BaseEvent {
  event_name: 'EntityDiscovered';
  payload_json: {
    source_url: string;
    raw_attributes: Record<string, any>;
  };
}

export interface EntityResolvedEvent extends BaseEvent {
  event_name: 'EntityResolved';
  payload_json: {
    original_id: string;
    canonical_id: string;
    rule_id: string;
  };
}

export interface RelationshipInferredEvent extends BaseEvent {
  event_name: 'RelationshipInferred';
  payload_json: {
    from_id: string;
    to_id: string;
    rel_type: string;
    confidence: number;
    rule_id: string;
  };
}

export interface MentionCapturedEvent extends BaseEvent {
  event_name: 'MentionCaptured';
  payload_json: {
    mention_id: string;
    source_url: string;
    context: string;
  };
}

export interface GraphUpdatedEvent extends BaseEvent {
  event_name: 'GraphUpdated';
  payload_json: {
    entity_id: string;
    changes: any[];
  };
}
