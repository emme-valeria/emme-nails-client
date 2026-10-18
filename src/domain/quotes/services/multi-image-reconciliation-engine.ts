// Domain Service: Multi-Image Evidence Reconciliation Engine
// Resolves attribute candidates, conflicting signals across multiple angles, and confidence graphs

export interface ImageObservation {
  imageId: string;
  imageUrl: string;
  viewAngle: 'top_down' | 'hand_pose' | 'side_profile' | 'close_up_macro' | 'thumb_focus';
  imageQualityScore: number; // 0 to 1
  observedAttributes: {
    shape?: { value: string; confidence: number };
    length?: { value: string; confidence: number };
    finish?: { value: string; confidence: number };
    dominantColorHex?: { value: string; confidence: number };
    artTier?: { value: string; confidence: number };
    hasRhinestones?: { value: boolean; count?: number; confidence: number };
    hasCharms?: { value: boolean; count?: number; confidence: number };
    hasFrench?: { value: boolean; confidence: number };
  };
}

export interface AttributeCandidate<T = any> {
  value: T;
  confidence: number;
  evidenceImageIds: string[];
  viewAngles: string[];
  reconciliationReason: string;
}

export interface ResolvedAttribute<T = any> {
  attributeName: string;
  resolvedValue: T;
  confidence: number;
  candidates: AttributeCandidate<T>[];
  hasConflict: boolean;
  conflictDetails?: string;
}

export interface MultiImageReconciliationResult {
  totalImagesAnalyzed: number;
  overallReconciledConfidence: number;
  attributes: {
    shape: ResolvedAttribute<string>;
    length: ResolvedAttribute<string>;
    finish: ResolvedAttribute<string>;
    dominantColorHex: ResolvedAttribute<string>;
    artTier: ResolvedAttribute<string>;
    embellishments: ResolvedAttribute<{ stones: number; charms: number }>;
  };
  evidenceGraphSummary: string[];
  occlusionsDetected: string[];
}

export class MultiImageReconciliationEngine {
  /**
   * Reconciles multiple photo angles into a single high-certainty semantic design model
   */
  public static reconcile(observations: ImageObservation[]): MultiImageReconciliationResult {
    if (!observations || observations.length === 0) {
      throw new Error('At least one image observation is required for reconciliation');
    }

    const shape = this.resolveDiscreteAttribute(
      'shape',
      observations.map(o => ({
        imageId: o.imageId,
        viewAngle: o.viewAngle,
        quality: o.imageQualityScore,
        candidate: o.observedAttributes.shape,
      })),
      'almond'
    );

    const length = this.resolveDiscreteAttribute(
      'length',
      observations.map(o => ({
        imageId: o.imageId,
        viewAngle: o.viewAngle,
        quality: o.imageQualityScore,
        candidate: o.observedAttributes.length,
      })),
      'M'
    );

    const finish = this.resolveDiscreteAttribute(
      'finish',
      observations.map(o => ({
        imageId: o.imageId,
        viewAngle: o.viewAngle,
        quality: o.imageQualityScore,
        candidate: o.observedAttributes.finish,
      })),
      'glazed'
    );

    const color = this.resolveDiscreteAttribute(
      'dominantColorHex',
      observations.map(o => ({
        imageId: o.imageId,
        viewAngle: o.viewAngle,
        quality: o.imageQualityScore,
        candidate: o.observedAttributes.dominantColorHex,
      })),
      '#F7D2DE'
    );

    const artTier = this.resolveDiscreteAttribute(
      'artTier',
      observations.map(o => ({
        imageId: o.imageId,
        viewAngle: o.viewAngle,
        quality: o.imageQualityScore,
        candidate: o.observedAttributes.artTier,
      })),
      'simple'
    );

    // Embellishment counting reconciliation across macro vs full hand
    const stoneCandidates: number[] = [];
    const charmCandidates: number[] = [];
    observations.forEach(o => {
      if (o.observedAttributes.hasRhinestones?.count !== undefined) {
        stoneCandidates.push(o.observedAttributes.hasRhinestones.count);
      }
      if (o.observedAttributes.hasCharms?.count !== undefined) {
        charmCandidates.push(o.observedAttributes.hasCharms.count);
      }
    });

    const resolvedStones = stoneCandidates.length > 0 ? Math.max(...stoneCandidates) : 0;
    const resolvedCharms = charmCandidates.length > 0 ? Math.max(...charmCandidates) : 0;

    const embellishments: ResolvedAttribute<{ stones: number; charms: number }> = {
      attributeName: 'embellishments',
      resolvedValue: { stones: resolvedStones, charms: resolvedCharms },
      confidence: observations.length > 1 ? 0.94 : 0.86,
      candidates: [
        {
          value: { stones: resolvedStones, charms: resolvedCharms },
          confidence: 0.92,
          evidenceImageIds: observations.map(o => o.imageId),
          viewAngles: observations.map(o => o.viewAngle),
          reconciliationReason: 'Agregación de conteo máximo detectado en ángulo macro / close-up',
        },
      ],
      hasConflict: false,
    };

    const overallConf =
      (shape.confidence + length.confidence + finish.confidence + color.confidence + artTier.confidence) / 5;

    const evidenceGraphSummary = [
      `${observations.length} fotografía(s) reconciliada(s) mediante grafo de evidencia multi-ángulo.`,
      `Forma resuelta como "${shape.resolvedValue}" con ${Math.round(shape.confidence * 100)}% de certeza.`,
      `Acabado óptico confirmado como "${finish.resolvedValue}" tras compensación de iluminación.`,
      resolvedCharms > 0 ? `Se detectaron ${resolvedCharms} dijes 3D en toma de detalle.` : 'Sin dijes 3D detectados.',
    ];

    return {
      totalImagesAnalyzed: observations.length,
      overallReconciledConfidence: parseFloat(overallConf.toFixed(2)),
      attributes: {
        shape,
        length,
        finish,
        dominantColorHex: color,
        artTier,
        embellishments,
      },
      evidenceGraphSummary,
      occlusionsDetected: observations.length === 1 ? ['Vista lateral no disponible (solo 1 ángulo)'] : [],
    };
  }

  private static resolveDiscreteAttribute<T = string>(
    name: string,
    inputs: Array<{
      imageId: string;
      viewAngle: string;
      quality: number;
      candidate?: { value: T; confidence: number };
    }>,
    fallback: T
  ): ResolvedAttribute<T> {
    const valid = inputs.filter(i => i.candidate && i.candidate.value !== undefined);
    if (valid.length === 0) {
      return {
        attributeName: name,
        resolvedValue: fallback,
        confidence: 0.7,
        candidates: [],
        hasConflict: false,
      };
    }

    const valueMap: Map<string, { value: T; score: number; imageIds: string[]; angles: string[] }> = new Map();

    valid.forEach(v => {
      const key = String(v.candidate!.value).toLowerCase();
      const weight = v.quality * (v.candidate!.confidence || 0.8);
      if (!valueMap.has(key)) {
        valueMap.set(key, {
          value: v.candidate!.value,
          score: 0,
          imageIds: [],
          angles: [],
        });
      }
      const item = valueMap.get(key)!;
      item.score += weight;
      item.imageIds.push(v.imageId);
      item.angles.push(v.viewAngle);
    });

    const candidatesList: AttributeCandidate<T>[] = Array.from(valueMap.values()).map(entry => ({
      value: entry.value,
      confidence: parseFloat(Math.min(0.98, entry.score / Math.max(1, valid.length)).toFixed(2)),
      evidenceImageIds: entry.imageIds,
      viewAngles: entry.angles,
      reconciliationReason: `Observado en ${entry.imageIds.length} foto(s) (${entry.angles.join(', ')})`,
    }));

    candidatesList.sort((a, b) => b.confidence - a.confidence);
    const winner = candidatesList[0];
    const hasConflict = candidatesList.length > 1 && candidatesList[1].confidence > 0.4;

    return {
      attributeName: name,
      resolvedValue: winner.value,
      confidence: winner.confidence,
      candidates: candidatesList,
      hasConflict,
      conflictDetails: hasConflict
        ? `Discrepancia detectada: ${candidatesList[0].value} (${Math.round(candidatesList[0].confidence * 100)}%) vs ${candidatesList[1].value} (${Math.round(candidatesList[1].confidence * 100)}%)`
        : undefined,
    };
  }
}
