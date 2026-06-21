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

export type EventNames = 'EntityResolved'
  | 'RelationshipInferred'
  | 'MentionCaptured'
  | 'GraphUpdated'
  | 'IdentityCreated'
  | 'ClaimRequested'
  | 'ClaimVerificationStarted'
  | 'ClaimVerified'
  | 'ClaimRejected'
  | 'OwnershipGranted'
  | 'OwnershipRevoked'
  | 'CreditsAdded'
  | 'CreditsDeducted'
  | 'CreditsTransferred'
  | 'SubscriptionCreated'
  | 'SubscriptionActivated'
  | 'SubscriptionExpired'
  | 'PaymentReceived'
  | 'PaymentFailed';

// ---------------------------------------------------------
// PHASE 3 & 4 EVENT PAYLOADS
// ---------------------------------------------------------

export interface EntityDiscoveredPayload {
  source_url: string;
  raw_attributes?: Record<string, any>;
}

export interface EntityResolvedPayload {
  original_id: string;
  canonical_id: string;
  rule_id: string;
  attributes?: Record<string, any>;
}

export interface RelationshipInferredPayload {
  from_id: string;
  to_id: string;
  rel_type: string;
  confidence: number;
  rule_id: string;
}

export interface MentionCapturedPayload {
  mention_id: string;
  source_url: string;
  context: string;
}

export interface GraphUpdatedPayload {
  entity_id: string;
  changes: any[];
}

export interface IdentityCreatedPayload {
  identity_id: string;
  email_hash: string;
}

export interface ClaimRequestedPayload {
  claim_id: string;
  identity_id: string;
  entity_id: string;
  verification_method: string;
}

export interface ClaimVerificationPayload {
  claim_id: string;
  reason?: string;
}

export interface OwnershipGrantedPayload {
  identity_id: string;
  entity_id: string;
  rule_id: string;
}

export interface CreditTransactionPayload {
  transaction_id: string;
  from_account?: string;
  to_account?: string;
  amount: number;
  reason: string;
}

export interface SubscriptionPayload {
  subscription_id: string;
  identity_id: string;
  plan_id: string;
}

export interface PaymentPayload {
  external_id: string;
  amount: number;
  provider: string;
}

export interface EventPayloadMap {
  JobCreated: any;
  AuditSnapshotGenerated: any;
  ScoreCalculated: any;
  RecommendationGenerated: any;
  JobCompleted: any;
  JobFailed: any;
  EntityDiscovered: EntityDiscoveredPayload;
  EntityResolved: EntityResolvedPayload;
  RelationshipInferred: RelationshipInferredPayload;
  MentionCaptured: MentionCapturedPayload;
  GraphUpdated: GraphUpdatedPayload;
  IdentityCreated: IdentityCreatedPayload;
  ClaimRequested: ClaimRequestedPayload;
  ClaimVerificationStarted: ClaimVerificationPayload;
  ClaimVerified: ClaimVerificationPayload;
  ClaimRejected: ClaimVerificationPayload;
  OwnershipGranted: OwnershipGrantedPayload;
  OwnershipRevoked: OwnershipGrantedPayload;
  CreditsAdded: CreditTransactionPayload;
  CreditsDeducted: CreditTransactionPayload;
  CreditsTransferred: CreditTransactionPayload;
  SubscriptionCreated: SubscriptionPayload;
  SubscriptionActivated: SubscriptionPayload;
  SubscriptionExpired: SubscriptionPayload;
  PaymentReceived: PaymentPayload;
  PaymentFailed: PaymentPayload;
}
