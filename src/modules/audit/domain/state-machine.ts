export enum AuditState {
  QUEUED = 'QUEUED',
  VALIDATING = 'VALIDATING',
  DISCOVERING = 'DISCOVERING',
  AUDITING = 'AUDITING',
  COLLECTING = 'COLLECTING',
  NORMALIZING = 'NORMALIZING',
  SCORING = 'SCORING',
  RECOMMENDING = 'RECOMMENDING',
  AI_ENRICHMENT = 'AI_ENRICHMENT',
  VALIDATING_AI = 'VALIDATING_AI',
  PERSISTING = 'PERSISTING',
  PUBLISHING = 'PUBLISHING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface TransitionContext {
  retry_count: number;
  max_retries: number;
}

export const ALLOWED_TRANSITIONS: Record<AuditState, AuditState[]> = {
  [AuditState.QUEUED]: [AuditState.VALIDATING, AuditState.CANCELLED, AuditState.EXPIRED, AuditState.FAILED],
  [AuditState.VALIDATING]: [AuditState.DISCOVERING, AuditState.FAILED],
  [AuditState.DISCOVERING]: [AuditState.AUDITING, AuditState.FAILED],
  [AuditState.AUDITING]: [AuditState.COLLECTING, AuditState.FAILED],
  [AuditState.COLLECTING]: [AuditState.NORMALIZING, AuditState.FAILED],
  [AuditState.NORMALIZING]: [AuditState.SCORING, AuditState.FAILED],
  [AuditState.SCORING]: [AuditState.RECOMMENDING, AuditState.FAILED],
  [AuditState.RECOMMENDING]: [AuditState.PUBLISHING, AuditState.FAILED], // Skipping AI for Phase 2
  [AuditState.AI_ENRICHMENT]: [AuditState.VALIDATING_AI, AuditState.FAILED],
  [AuditState.VALIDATING_AI]: [AuditState.PERSISTING, AuditState.AI_ENRICHMENT, AuditState.FAILED],
  [AuditState.PERSISTING]: [AuditState.PUBLISHING, AuditState.FAILED],
  [AuditState.PUBLISHING]: [AuditState.COMPLETED, AuditState.FAILED],
  [AuditState.COMPLETED]: [],
  [AuditState.FAILED]: [],
  [AuditState.CANCELLED]: [],
  [AuditState.EXPIRED]: [],
};

export class AuditStateMachine {
  private currentState: AuditState;
  private readonly context: TransitionContext;

  constructor(initialState: AuditState = AuditState.QUEUED, context?: Partial<TransitionContext>) {
    this.currentState = initialState;
    this.context = {
      retry_count: context?.retry_count || 0,
      max_retries: context?.max_retries || 3,
    };
  }

  public getState(): AuditState {
    return this.currentState;
  }

  public canTransitionTo(nextState: AuditState): boolean {
    const allowed = ALLOWED_TRANSITIONS[this.currentState];
    return allowed ? allowed.includes(nextState) : false;
  }

  public transitionTo(nextState: AuditState): void {
    if (!this.canTransitionTo(nextState)) {
      throw new Error(`Invalid transition from ${this.currentState} to ${nextState}`);
    }
    this.currentState = nextState;
  }

  public fail(): void {
    if (this.canTransitionTo(AuditState.FAILED)) {
      this.currentState = AuditState.FAILED;
    } else {
      throw new Error(`Cannot fail from ${this.currentState}`);
    }
  }

  public handleRetry(retryState: AuditState): boolean {
    if (this.context.retry_count < this.context.max_retries) {
      if (this.canTransitionTo(retryState)) {
        this.context.retry_count++;
        this.currentState = retryState;
        return true;
      }
    }
    return false; // Retry exhausted or invalid transition
  }
}
