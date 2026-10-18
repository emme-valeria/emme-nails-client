// Domain Service: Uncertainty Propagation Engine
// Computes mathematical price intervals [min, likely, max], confidence bounds, and artist review triggers

export interface UncertaintyFactor {
  attributeName: string;
  sourceType: 'occlusion' | 'lighting' | 'art_density_ambiguity' | 'unspecified_length' | 'charm_count_variance';
  confidence: number; // 0 to 1
  minImpactMXN: number;
  maxImpactMXN: number;
  likelyImpactMXN: number;
  explanation: string;
}

export interface UncertaintyPricingDistribution {
  minPrice: number;
  likelyPrice: number;
  maxPrice: number;
  toleranceDeltaMXN: number;
  confidenceScore: number;
  confidenceTier: 'high_certainty' | 'medium_confidence' | 'high_variance_review_needed';
  requiresArtistIntervention: boolean;
  interventionReasons: string[];
  factors: UncertaintyFactor[];
  suggestedClientRangeText: string;
}

export class UncertaintyPropagationEngine {
  public static computeDistribution(
    basePrice: number,
    factors: UncertaintyFactor[],
    artistReviewThreshold = 0.78
  ): UncertaintyPricingDistribution {
    let minDelta = 0;
    let maxDelta = 0;
    let likelyDelta = 0;
    let weightedConfidenceAcc = 0;

    factors.forEach(f => {
      minDelta += f.minImpactMXN;
      maxDelta += f.maxImpactMXN;
      likelyDelta += f.likelyImpactMXN;
      weightedConfidenceAcc += f.confidence;
    });

    const averageConfidence = factors.length > 0
      ? parseFloat((weightedConfidenceAcc / factors.length).toFixed(2))
      : 0.95;

    const minPrice = Math.max(250, basePrice + minDelta);
    const likelyPrice = Math.max(minPrice, basePrice + likelyDelta);
    const maxPrice = Math.max(likelyPrice, basePrice + maxDelta);
    const toleranceDelta = maxPrice - minPrice;

    const requiresArtistIntervention = averageConfidence < artistReviewThreshold || toleranceDelta > 280;

    let confidenceTier: UncertaintyPricingDistribution['confidenceTier'] = 'high_certainty';
    if (averageConfidence < 0.70 || toleranceDelta > 280) {
      confidenceTier = 'high_variance_review_needed';
    } else if (averageConfidence < 0.85) {
      confidenceTier = 'medium_confidence';
    }

    const interventionReasons: string[] = [];
    if (averageConfidence < artistReviewThreshold) {
      interventionReasons.push(`Certeza global (${Math.round(averageConfidence * 100)}%) inferior al umbral de aprobación automática (${Math.round(artistReviewThreshold * 100)}%).`);
    }
    if (toleranceDelta > 280) {
      interventionReasons.push(`Margen de variación técnica de $${toleranceDelta} MXN requiere validación de artista.`);
    }

    const suggestedClientRangeText = minPrice === maxPrice
      ? `$${likelyPrice} MXN`
      : `$${minPrice} - $${maxPrice} MXN (Estimado exacto: ~$${likelyPrice} MXN)`;

    return {
      minPrice,
      likelyPrice,
      maxPrice,
      toleranceDeltaMXN: toleranceDelta,
      confidenceScore: averageConfidence,
      confidenceTier,
      requiresArtistIntervention,
      interventionReasons,
      factors,
      suggestedClientRangeText,
    };
  }
}
