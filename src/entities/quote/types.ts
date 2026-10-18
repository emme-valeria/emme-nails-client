export type QuoteStatus = 'pending' | 'accepted' | 'changes_requested' | 'declined' | 'booked';

export interface QuoteRequest {
  id: string;
  createdAt: string;
  baseServiceId: string;
  baseServiceName: string;
  length: 'Short' | 'Medium' | 'Long';
  shape: 'Square' | 'Almond' | 'Oval' | 'Coffin';
  explanationMode?: 'inspiration' | 'upload' | 'describe' | 'combined';
  inspirationId?: string;
  referenceImages: string[];
  descriptionText?: string;
  finish: 'Glossy' | 'Chrome' | 'Cat-eye' | 'Matte' | 'Jelly';
  details: string[];
  estimatedMinPriceMXN: number;
  estimatedMaxPriceMXN: number;
  confirmedPriceMXN?: number;
  durationMinutes?: number;
  depositRequiredMXN?: number;
  validUntilDate?: string;
  status: QuoteStatus;
}
