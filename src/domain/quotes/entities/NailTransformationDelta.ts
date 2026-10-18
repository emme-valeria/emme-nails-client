// Domain: Nail Transformation Delta (Current State -> Delta -> Target Desired State)
import {
  LengthCategory,
  NailShapeCategory,
  BaseMaterialType,
  FinishType,
  EvidenceLevel
} from './NailArtSemanticTypes';

export interface CurrentNailCondition {
  hasExistingProduct: boolean;
  existingProductType?: 'acrylic' | 'gel_overlay' | 'soft_gel_tips' | 'polygel' | 'regular_polish' | 'none';
  estimatedRegrowthWeeks?: number;
  conditionGrade: 'healthy' | 'thin_damaged' | 'broken_split' | 'reconstruction_needed';
  brokenNailsCount: number;
  currentLengthCategory: LengthCategory;
  currentShape: NailShapeCategory;
  cuticleCondition: 'clean' | 'moderate' | 'hyperkeratosis_needs_russian';
  notes?: string;
  sourceImageEvidence?: string;
  confidence: number;
}

export interface ClientDesignIntent {
  rawPrompt?: string;
  lengthPreference?: LengthCategory | 'as_reference';
  shapePreference?: NailShapeCategory | 'as_reference';
  colorPreference?: {
    dominantHex?: string;
    dominantName?: string;
    preservePalette: boolean;
  };
  finishPreference?: FinishType | 'as_reference';
  embellishmentsPreference?: 'keep_all' | 'remove_3d_charms' | 'minimal_stones_only' | 'no_stones';
  budgetCeilingMXN?: number;
  targetMaxMinutes?: number;
}

export interface TargetNailDesign {
  baseServiceCategory: string;
  lengthCategory: LengthCategory;
  shape: NailShapeCategory;
  material: BaseMaterialType;
  dominantColorHex: string;
  dominantColorName: string;
  secondaryColors: Array<{ hex: string; name: string }>;
  finish: FinishType;
  artTier: 'none' | 'simple' | 'medium' | 'detailed' | 'extreme';
  artDescription: string;
  rhinestoneCount: number;
  charms3DCount: number;
  frenchStyle?: string;
  sourceInspirationUrl?: string;
  confidence: number;
}

export interface RequiredWorkItem {
  id: string;
  category: 'removal' | 'prep' | 'reconstruction' | 'structure_extension' | 'shaping' | 'color' | 'art' | 'embellishment' | 'seal';
  name: string;
  description: string;
  deltaReason: string;
  estimatedMinutes: number;
  estimatedPrice: number;
  isMandatory: boolean;
  ruleCode: string;
}

export interface DesignTransformationDelta {
  id: string;
  current: CurrentNailCondition;
  intent: ClientDesignIntent;
  target: TargetNailDesign;
  workItems: RequiredWorkItem[];
  totalDeltaMinutes: number;
  totalDeltaPrice: number;
  complexityScore: number;
  feasibilityScore: number; // 0 to 1
  feasibilityWarnings: string[];
  recommendations: string[];
}
