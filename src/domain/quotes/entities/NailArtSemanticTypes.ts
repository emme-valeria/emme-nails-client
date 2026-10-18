// Nail Art Semantic Pricing & Quotation Standard Types (per specification)

export type EvidenceLevel = 'OBSERVED' | 'STRONGLY_INFERRED' | 'INFERRED' | 'UNCERTAIN' | 'NOT_DETECTABLE';

export type LengthCategory = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'CUSTOM' | 'UNKNOWN';

export type NailShapeCategory =
  | 'round'
  | 'oval'
  | 'square'
  | 'squoval'
  | 'almond'
  | 'coffin'
  | 'ballerina'
  | 'stiletto'
  | 'edge'
  | 'lipstick'
  | 'flare'
  | 'mountain_peak'
  | 'duck'
  | 'tapered_square'
  | 'custom'
  | 'unknown';

export type BaseMaterialType =
  | 'natural_nail'
  | 'gel'
  | 'gel_polish'
  | 'builder_gel'
  | 'biab'
  | 'rubber_base'
  | 'acrylic'
  | 'polygel'
  | 'soft_gel'
  | 'hard_gel'
  | 'other'
  | 'unknown';

export type BaseServiceCategory =
  | 'basic_manicure'
  | 'gel_manicure'
  | 'builder_gel_overlay'
  | 'rubber_base_leveling'
  | 'soft_gel_extensions'
  | 'acrylic_sculpted'
  | 'polygel_extensions'
  | 'maintenance_refill'
  | 'removal_and_new'
  | 'other';

export type FinishType =
  | 'gloss'
  | 'matte'
  | 'satin'
  | 'chrome'
  | 'mirror'
  | 'glazed'
  | 'pearl'
  | 'aurora'
  | 'holographic'
  | 'magnetic_cat_eye'
  | 'velvet_magnetic'
  | 'glitter'
  | 'reflective_glitter'
  | 'sugar';

export type CoverageType = 'none' | 'minimal' | 'accent' | 'partial' | 'half' | 'majority' | 'full';

export type FingerId = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
export type HandId = 'left' | 'right';

export interface SingleNailSemantic {
  finger: FingerId;
  hand: HandId;
  lengthCategory: LengthCategory;
  shape: NailShapeCategory;
  structure: BaseMaterialType;
  baseColorHex: string;
  baseColorName: string;
  secondaryColorHex?: string;
  finishes: FinishType[];
  hasFrench: boolean;
  frenchStyle?: string;
  hasGradient: boolean;
  artType?: string;
  artDescription?: string;
  artComplexity: number; // 0 (none) to 5 (extreme)
  embellishments: Array<{
    type: string;
    quantity: number;
    material: string;
  }>;
  confidence: number;
  evidence: EvidenceLevel;
}

export interface SemanticNailSetModel {
  id: string;
  sourceImageUrl: string;
  analyzedAt: string;
  imageQuality: {
    resolution: 'low' | 'medium' | 'high' | 'ultra';
    clarityScore: number; // 0 to 1
    nailVisibilityCount: number;
    qualityScore: number;
  };
  baseService: {
    category: BaseServiceCategory;
    name: string;
    evidence: EvidenceLevel;
    confidence: number;
  };
  nailCondition: {
    existingProduct: boolean;
    productType?: string;
    needsRemoval: boolean;
    needsRepairCount: number;
  };
  globalAttributes: {
    length: { category: LengthCategory; confidence: number; evidence: EvidenceLevel; mmEstimate: string };
    shape: { category: NailShapeCategory; confidence: number; evidence: EvidenceLevel };
    dominantColorHex: string;
    dominantColorName: string;
    secondaryColors: Array<{ hex: string; name: string; role: string }>;
    primaryFinish: FinishType;
    finishes: FinishType[];
    french?: {
      detected: boolean;
      style: string;
      tipColorHex: string;
      affectedNailsCount: number;
    };
    art: {
      isHandPainted: boolean;
      artCategory: string;
      complexityTier: 'simple' | 'medium' | 'detailed' | 'extreme';
      affectedNailsCount: number;
      elements: string[];
      evidence: EvidenceLevel;
    };
    embellishments: {
      hasCharms: boolean;
      hasRhinestones: boolean;
      estimatedRhinestoneCount: { min: number; max: number };
      charmCount: number;
      elements: string[];
    };
    specialEffects: string[];
  };
  nails: SingleNailSemantic[];
  complexityScore: number; // 1 to 10
  laborFactors: {
    preparationMinutes: number;
    structureMinutes: number;
    colorMinutes: number;
    artMinutes: number;
    finishingMinutes: number;
    totalLaborMinutesMin: number;
    totalLaborMinutesMax: number;
  };
  overallConfidence: number;
  uncertainties: string[];
  assumptions: string[];
  requiresArtistApproval: boolean;
  approvalReasons: string[];
}

// Salon Specific Catalog Schema
export interface SalonPriceItem {
  id: string;
  name: string;
  semanticCategory: string;
  description: string;
  pricingUnit: 'fixed' | 'per_nail' | 'per_item' | 'per_layer' | 'tier';
  basePrice: number;
  includedQuantity?: number;
  additionalUnitPrice?: number;
  stackable: boolean;
  replaces?: string[]; // Anti-double-charging: item IDs that this replaces
  includedWith?: string[]; // Item IDs where this is included for free
  active: boolean;
}

export interface SalonPricingCatalog {
  salonId: string;
  salonName: string;
  currency: 'MXN' | 'USD';
  taxRate: number; // e.g. 0.16 for 16% IVA or 0
  minimumCharge: number;
  approvalThresholds: {
    minConfidence: number; // default 0.75
    maxPriceRangeWidthPercent: number; // default 20%
    requireApprovalForHandPaintedHigh: boolean;
    requireApprovalForUnknownMaterial: boolean;
  };
  baseServices: Record<BaseServiceCategory, SalonPriceItem>;
  lengthSurcharges: Record<LengthCategory, number>;
  shapeSurcharges: Record<NailShapeCategory, number>;
  finishAddons: Record<FinishType, SalonPriceItem>;
  artTiers: {
    simple: SalonPriceItem;
    medium: SalonPriceItem;
    detailed: SalonPriceItem;
    extreme: SalonPriceItem;
  };
  embellishments: {
    rhinestones: SalonPriceItem;
    charms3D: SalonPriceItem;
    goldFoil: SalonPriceItem;
  };
  frenchAddon: SalonPriceItem;
  removalAddon: SalonPriceItem;
}

export interface ItemizedQuoteLine {
  id: string;
  category: string;
  name: string;
  quantityDescription?: string;
  unitPrice: number;
  totalPrice: number;
  isIncluded: boolean;
  confidence: number;
  note?: string;
}

export interface CalculatedNailQuote {
  catalogVersion: string;
  currency: 'MXN' | 'USD';
  baseService: ItemizedQuoteLine;
  lines: ItemizedQuoteLine[];
  subtotal: number;
  taxes: number;
  discounts: number;
  estimatedTotal: number;
  estimatedRange: {
    min: number;
    max: number;
    likely: number;
    rangeWidthPercent: number;
  };
  estimatedDurationMinutes: {
    min: number;
    max: number;
    likely: number;
  };
  confidence: number;
  confidenceTier: 'Alta Certeza' | 'Buena Precisión' | 'Revisión en Cabina Requerida';
  requiresArtistApproval: boolean;
  approvalReasons: string[];
  assumptions: string[];
  uncertainties: string[];
  antiDoubleChargingApplied: string[];
  artistOverride?: {
    isApplied: boolean;
    originalTotal: number;
    adjustedTotal: number;
    adjustmentAmount: number;
    reasonCode: string;
    technicianNote: string;
    approvedAt: string;
  };
}
