export type IntentInputMethod = 'direct' | 'photo' | 'advisor' | 'rebook';

export type IntentCategory = 'nails' | 'lashes' | 'brows' | 'pedicure' | 'spa';

export type ClientVibeGoal = 
  | 'clean_natural' 
  | 'long_extensions' 
  | 'durable_gel' 
  | 'nail_art_statement' 
  | 'repair_removal' 
  | 'pedi_spa'
  | 'lashes_natural'
  | 'lashes_volume'
  | 'brows_lamination'
  | 'unsure';

export interface ServiceQualificationRules {
  requiresLength: boolean;
  requiresShape: boolean;
  requiresArtTier: boolean;
  requiresFinish: boolean;
  requiresRemovalCheck: boolean;
  requiresColor: boolean;
}

export interface QualifiedServiceDefinition {
  id: string;
  category: IntentCategory;
  clientTitle: string; // e.g. "Natural + Duradero"
  clientSubtitle: string; // e.g. "Manicura Rusa con Rubber Gel"
  professionalTitle: string; // e.g. "Structured Gel Manicure (Overlay)"
  badge?: string;
  description: string;
  basePriceMXN: number;
  baseDurationMinutes: number;
  whyThisFits: string[];
  rules: ServiceQualificationRules;
  imageUrl: string;
}

export interface ServiceConfiguration {
  serviceId: string;
  serviceTitle: string;
  clientVibeLabel: string;
  // Nails specific
  length?: 'natural' | 'short' | 'medium' | 'long' | 'xl';
  shape?: 'natural' | 'almond' | 'square' | 'coffin' | 'oval' | 'stiletto' | 'squoval';
  finish?: 'glossy' | 'matte' | 'chrome' | 'cat_eye' | 'jelly' | 'milky' | 'glazed' | 'french';
  artTier?: 0 | 1 | 2 | 3 | 4;
  artTags?: string[];
  hasExistingProduct?: boolean;
  primaryColor?: string;
  colorName?: string;
  referenceImageUrl?: string;
  notes?: string;

  // Lashes specific
  lashEffect?: 'classic_1to1' | 'hybrid_textured' | 'volume_glam' | 'lash_lifting';
  lashCurl?: 'c_natural' | 'd_glam' | 'l_lift';
  lashLength?: 'natural_9_11mm' | 'medium_11_13mm' | 'long_13_15mm';

  // Brows specific
  browStyle?: 'lamination_fluffy' | 'henna_tint' | 'shaping_threading' | 'brow_spa';
  browShade?: 'light_brown' | 'medium_brown' | 'dark_brown' | 'natural_match';

  // Pedicure & Spa specific
  pediSpaType?: 'jelly_aromatherapy' | 'deep_detox_dead_sea' | 'express_clean';
  pediColorHex?: string;
  pediColorName?: string;
}

export interface PriceAndDurationBreakdownItem {
  label: string;
  amountMXN: number;
  durationDeltaMinutes: number;
}

export interface NormalizedQuoteCalculation {
  basePriceMXN: number;
  totalPriceMXN: number;
  depositMXN: number;
  durationMinutes: number;
  durationFormatted: string;
  breakdown: PriceAndDurationBreakdownItem[];
  configurationSummary: string;
  depositRule: string;
}

export interface CuratedServicePackage {
  id: string;
  title: string;
  vibeTag: string;
  subtitle: string;
  priceMXN: number;
  durationMinutes: number;
  durationFormatted: string;
  imageUrl: string;
  highlights: string[];
  popularFor: string;
  defaultConfig: Partial<ServiceConfiguration>;
}

export interface AiIntentInterpretation {
  rawSource: string;
  identifiedCategory: IntentCategory;
  suggestedServiceId: string;
  suggestedServiceTitle: string;
  confidence: number;
  suggestedConfig: Partial<ServiceConfiguration>;
  explanation: string;
  estimatedPriceRange: { minMXN: number; maxMXN: number };
  estimatedMinutes: number;
}
