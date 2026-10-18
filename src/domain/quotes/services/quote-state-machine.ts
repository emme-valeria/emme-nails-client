// Domain Service: Quote State Machine
// Governs the formal lifecycle: DRAFT -> ANALYZED -> PRICED -> REVIEW_REQUIRED -> APPROVED -> BOOKED

export type QuoteLifecycleState =
  | 'DRAFT'
  | 'ANALYZING_IMAGES'
  | 'ANALYSIS_COMPLETE'
  | 'PRICED_DETERMINISTIC'
  | 'REVIEW_REQUIRED'
  | 'ARTIST_CABIN_REVIEW'
  | 'APPROVED_FINAL'
  | 'PRESENTED_TO_CLIENT'
  | 'ACCEPTED_BY_CLIENT'
  | 'BOOKING_LOCKED'
  | 'DEPOSIT_PAID'
  | 'EXPIRED'
  | 'REJECTED';

export interface StateTransitionAudit {
  fromState: QuoteLifecycleState;
  toState: QuoteLifecycleState;
  timestamp: string;
  actor: 'system_ai' | 'pricing_engine' | 'artist_cabin' | 'client' | 'admin';
  actorId?: string;
  reason: string;
  metadata?: Record<string, any>;
}

export interface QuoteStateMachineContext {
  quoteId: string;
  tenantId: string;
  currentState: QuoteLifecycleState;
  auditTrail: StateTransitionAudit[];
  requiresArtistReview: boolean;
  confidenceScore: number;
  unresolvedGaps: string[];
  version: number;
  catalogVersion: string;
  ruleVersion: string;
  createdAt: string;
  updatedAt: string;
}

export class QuoteStateMachine {
  /**
   * Initializes a fresh quote context
   */
  public static createQuote(quoteId: string, tenantId = 'salon_emme_polanco'): QuoteStateMachineContext {
    const now = new Date().toISOString();
    return {
      quoteId,
      tenantId,
      currentState: 'DRAFT',
      auditTrail: [
        {
          fromState: 'DRAFT',
          toState: 'DRAFT',
          timestamp: now,
          actor: 'client',
          reason: 'Cotización iniciada en cliente',
        },
      ],
      requiresArtistReview: false,
      confidenceScore: 1.0,
      unresolvedGaps: [],
      version: 1,
      catalogVersion: 'v2026.3-MX',
      ruleVersion: 'v1.4.2',
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Evaluates if state transition is allowed and records immutable audit log
   */
  public static transition(
    ctx: QuoteStateMachineContext,
    targetState: QuoteLifecycleState,
    actor: StateTransitionAudit['actor'],
    reason: string,
    metadata?: Record<string, any>
  ): QuoteStateMachineContext {
    const valid = this.isTransitionValid(ctx.currentState, targetState);
    if (!valid) {
      throw new Error(`Invalid Quote State Transition from ${ctx.currentState} to ${targetState}`);
    }

    const now = new Date().toISOString();
    const audit: StateTransitionAudit = {
      fromState: ctx.currentState,
      toState: targetState,
      timestamp: now,
      actor,
      reason,
      metadata,
    };

    return {
      ...ctx,
      currentState: targetState,
      auditTrail: [...ctx.auditTrail, audit],
      version: ctx.version + 1,
      updatedAt: now,
    };
  }

  public static isTransitionValid(from: QuoteLifecycleState, to: QuoteLifecycleState): boolean {
    const ALLOWED_EDGES: Record<QuoteLifecycleState, QuoteLifecycleState[]> = {
      DRAFT: ['ANALYZING_IMAGES', 'EXPIRED'],
      ANALYZING_IMAGES: ['ANALYSIS_COMPLETE', 'REVIEW_REQUIRED', 'EXPIRED'],
      ANALYSIS_COMPLETE: ['PRICED_DETERMINISTIC', 'REVIEW_REQUIRED', 'EXPIRED'],
      PRICED_DETERMINISTIC: ['REVIEW_REQUIRED', 'APPROVED_FINAL', 'PRESENTED_TO_CLIENT', 'EXPIRED'],
      REVIEW_REQUIRED: ['ARTIST_CABIN_REVIEW', 'EXPIRED'],
      ARTIST_CABIN_REVIEW: ['APPROVED_FINAL', 'REJECTED', 'EXPIRED'],
      APPROVED_FINAL: ['PRESENTED_TO_CLIENT', 'EXPIRED'],
      PRESENTED_TO_CLIENT: ['ACCEPTED_BY_CLIENT', 'REJECTED', 'EXPIRED'],
      ACCEPTED_BY_CLIENT: ['BOOKING_LOCKED', 'DEPOSIT_PAID', 'EXPIRED'],
      BOOKING_LOCKED: ['DEPOSIT_PAID', 'EXPIRED'],
      DEPOSIT_PAID: [],
      EXPIRED: [],
      REJECTED: [],
    };

    return (ALLOWED_EDGES[from] || []).includes(to);
  }
}
