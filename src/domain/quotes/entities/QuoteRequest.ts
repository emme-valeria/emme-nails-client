import { QuoteStatus } from '../value-objects/QuoteStatus';

export interface NailConfiguration {
  nailType: 'natural' | 'extension';
  length: 'short' | 'medium' | 'long' | 'xl';
  shape: 'square' | 'almond' | 'coffin' | 'oval' | 'squoval';
  existingProductToRemove: boolean;
  brokenNailsCount: number;
  conditionNotes?: string;
}

export interface DesignDetails {
  colors: string[];
  finish: 'glossy' | 'matte' | 'chrome' | 'glazed' | 'cat_eye' | 'velvet' | 'aura' | 'jelly' | 'milky';
  complexity: 'simple' | 'medium' | 'french' | '3d_charms' | 'art_illustration';
  charmsGems: boolean;
  sameDesignEveryNail: boolean;
  description: string;
}

export interface SchedulePreference {
  preferredDate?: string;
  preferredTimeRange: 'morning' | 'afternoon' | 'evening';
  isFlexible: boolean;
  preferredStaffId?: string;
}

export interface QuoteRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  serviceId: string;
  serviceTitle: string;
  nailConfig: NailConfiguration;
  designDetails: DesignDetails;
  referenceImages: string[];
  schedulePref: SchedulePreference;
  status: QuoteStatus;
  createdAt: string;
  clarificationMessages?: Array<{ sender: 'salon' | 'client'; text: string; timestamp: string }>;
}

export interface QuoteItem {
  id: string;
  description: string;
  amount: number;
}

export interface Quote {
  id: string;
  quoteRequestId: string;
  clientId: string;
  staffId: string;
  staffName: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  totalPrice: number;
  requiredDeposit: number;
  remainingBalance: number;
  estimatedDurationMinutes: number;
  expirationDate: string;
  artistNotes?: string;
  createdAt: string;
}
