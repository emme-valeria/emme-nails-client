export type InspirationSource = 'salon_portfolio' | 'emme_curated' | 'licensed_external' | 'generated' | 'client_upload' | 'external_link';

export interface DesignInspiration {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  finish?: 'glossy' | 'matte' | 'chrome' | 'cat_eye' | 'velvet' | 'aura' | 'jelly' | 'milky';
  colors: string[];
  shape?: 'square' | 'almond' | 'coffin' | 'oval' | 'squoval';
  complexity: 'basic' | 'intermediate' | 'advanced' | 'custom_hand_painted';
  estimatedDurationMinutes: number;
  pricingModifiers: string[];
  source: InspirationSource;
  sourceUrl?: string;
  attribution?: string;
  tenantId?: string;
  popularityScore?: number;
}

export interface NailProcedureStep {
  id: string;
  stepNumber: number;
  name: string;
  category: 'prep' | 'structure' | 'color' | 'art' | 'finish' | 'aftercare';
  description: string;
  productsUsed: string[];
  confidence: number; // 0 to 1
  estimatedMinutes: number;
  estimatedPrice: number;
  isRequired: boolean;
  isActive: boolean;
  notes?: string;
}

export interface LayerAttributeDetail<T = string> {
  value: T;
  label: string;
  confidence: number;
  description?: string;
  effectDescription?: string;
  extraCost?: number;
}

export interface DetailedLayerAnalysis {
  structure: LayerAttributeDetail<string>;
  shape: LayerAttributeDetail<'square' | 'almond' | 'coffin' | 'oval' | 'stiletto' | 'squoval'>;
  length: LayerAttributeDetail<'short' | 'medium' | 'long' | 'xl'>;
  chromatics: {
    dominantColorHex: string;
    dominantColorName: string;
    secondaryColorHex?: string;
    secondaryColorName?: string;
    tipColorHex?: string;
    palette: Array<{ hex: string; name: string; role: string }>;
    confidence: number;
  };
  finish: LayerAttributeDetail<'glossy' | 'matte' | 'glazed' | 'chrome' | 'cat_eye' | 'velvet' | 'aura' | 'jelly' | 'milky'>;
  nailArt: {
    complexity: 'simple' | 'medium' | 'french' | '3d_charms' | 'art_illustration';
    elements: string[];
    confidence: number;
    difficultyRating: 'Básico' | 'Intermedio' | 'Avanzado' | 'Master';
  };
}

export interface DetailedEstimateRange {
  minPrice: number;
  maxPrice: number;
  likelyPrice: number;
  currency: 'MXN' | 'USD';
  estimatedDurationMinutes: number;
  confidenceScore: number;
  confidenceTier: 'Alta Certeza' | 'Buena Precisión' | 'Estimado Preliminar';
  toleranceMargin: number;
  itemizedBreakdown: Array<{
    id: string;
    item: string;
    amount: number;
    confidence: number;
    category: string;
    included: boolean;
  }>;
}

export interface NailPhotoDetailedAnalysis {
  id: string;
  sourceImageUrl: string;
  analyzedAt: string;
  overallConfidence: number;
  overallReasoning: string;
  layers: DetailedLayerAnalysis;
  procedureSteps: NailProcedureStep[];
  estimateRange: DetailedEstimateRange;
  recommendedTechnicianTier: 'Estilista General' | 'Especialista Senior' | 'Nail Artist Master';
  suggestedAttributes: SuggestedDesignAttributes;
}

export interface SuggestedDesignAttributes {
  baseServiceCategory?: string;
  finish?: 'glossy' | 'matte' | 'chrome' | 'glazed' | 'cat_eye' | 'velvet' | 'aura' | 'jelly' | 'milky';
  colors?: string[];
  shape?: 'square' | 'almond' | 'coffin' | 'oval' | 'stiletto' | 'squoval';
  length?: 'short' | 'medium' | 'long' | 'xl';
  complexity?: 'simple' | 'medium' | 'french' | '3d_charms' | 'art_illustration';
  decorations?: string[];
  confidence: number;
  reasoning?: string;
  detailedAnalysis?: NailPhotoDetailedAnalysis;
}

export interface ReferenceImage {
  id: string;
  kind: 'uploaded' | 'external_link' | 'salon_portfolio' | 'emme_curated';
  url: string;
  sourceUrl?: string;
  caption?: string;
  extractedAttributes?: SuggestedDesignAttributes;
  detailedAnalysis?: NailPhotoDetailedAnalysis;
}

