export type InputMode = 'structured' | 'photo' | 'text' | 'chat' | 'mixed';

export interface QuoteAnalyticsRecord {
  id: string;
  quoteRequestId: string;
  inputMode: InputMode;
  referenceImageCount: number;
  hasDescription: boolean;
  designTags: string[];
  finish?: string;
  shape?: string;
  length?: string;
  nailType?: string;
  addOns: string[];
  estimatedComplexity: string;
  estimatedDuration: number;
  estimatedPrice: number;
  finalPrice?: number;
  artistAdjustment?: number;
  quoteStatus: string;
  accepted: boolean;
  declined: boolean;
  appointmentCreated: boolean;
  completed: boolean;
  rebooked: boolean;
  createdAt: string;
}

export interface DesignMetricSummary {
  designName: string;
  totalRequests: number;
  acceptedCount: number;
  acceptanceRate: number;
  averagePrice: number;
  averageDurationMinutes: number;
  rebookingRate: number;
}
