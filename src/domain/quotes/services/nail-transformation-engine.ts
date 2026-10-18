import {
  CurrentNailCondition,
  ClientDesignIntent,
  TargetNailDesign,
  DesignTransformationDelta,
  RequiredWorkItem
} from '../entities/NailTransformationDelta';
import { LengthCategory, NailShapeCategory } from '../entities/NailArtSemanticTypes';

const LENGTH_RANK: Record<LengthCategory, number> = {
  XS: 1,
  S: 2,
  M: 3,
  L: 4,
  XL: 5,
  XXL: 6,
  XXXL: 7,
  CUSTOM: 3,
  UNKNOWN: 3,
};

export class NailTransformationEngine {
  /**
   * Calculates the exact delta between current natural/salon nails and desired target design
   */
  public static calculateDelta(
    current: CurrentNailCondition,
    target: TargetNailDesign,
    intent: ClientDesignIntent = {}
  ): DesignTransformationDelta {
    const workItems: RequiredWorkItem[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // 1. Check Product Removal Delta
    if (current.hasExistingProduct && current.existingProductType !== 'none') {
      const isAcr = current.existingProductType === 'acrylic';
      workItems.push({
        id: 'work_removal',
        category: 'removal',
        name: isAcr ? 'Retiro Mecánico de Acrílico Previo' : 'Retiro Suave de Gel / Soft Gel',
        description: 'Remoción cuidadosa con torno e-File sin desbaste agresivo de la placa de queratina',
        deltaReason: `Presencia de ${current.existingProductType || 'producto previo'} que debe ser removido antes de la nueva aplicación`,
        estimatedMinutes: isAcr ? 20 : 15,
        estimatedPrice: isAcr ? 120 : 90,
        isMandatory: true,
        ruleCode: 'DELTA_REMOVAL_PREV_PROD',
      });
    }

    // 2. Russian Cuticle Prep & Hygiene (Always standard in Emme)
    const needsDeepRussian = current.cuticleCondition === 'hyperkeratosis_needs_russian';
    workItems.push({
      id: 'work_prep_russian',
      category: 'prep',
      name: needsDeepRussian ? 'Manicura Rusa e-File Profunda' : 'Preparación Rusa Higiénica & Deshidratación',
      description: 'Limpieza anatómica del bolsillo de cutícula con fresa diamantada cónica y deshidratador balanceador pH',
      deltaReason: 'Garantía de anclaje libre de desprendimientos por 21+ días',
      estimatedMinutes: needsDeepRussian ? 20 : 15,
      estimatedPrice: 0, // Included in standard base service
      isMandatory: true,
      ruleCode: 'DELTA_PREP_RUSSIAN',
    });

    // 3. Broken Nails Repair / Reconstruction
    if (current.brokenNailsCount > 0 || current.conditionGrade === 'reconstruction_needed') {
      const count = Math.max(1, current.brokenNailsCount);
      workItems.push({
        id: 'work_repair',
        category: 'reconstruction',
        name: `Reconstrucción de Lámina (${count} uña${count > 1 ? 's' : ''})`,
        description: 'Reconstrucción con fibra de seda o acrigel de alta densidad para emparejar lecho ungueal',
        deltaReason: `${count} uña(s) fisurada(s) o rota(s) detectadas en estado actual`,
        estimatedMinutes: count * 8,
        estimatedPrice: count * 45,
        isMandatory: true,
        ruleCode: 'DELTA_NAIL_REPAIR',
      });
    }

    // 4. Length Tier Delta & Extension Work
    const currRank = LENGTH_RANK[current.currentLengthCategory] || 2;
    const targetRank = LENGTH_RANK[target.lengthCategory] || 3;

    if (targetRank > currRank) {
      const rankDiff = targetRank - currRank;
      const requiresSculpting = target.lengthCategory === 'L' || target.lengthCategory === 'XL' || target.lengthCategory === 'XXL';
      workItems.push({
        id: 'work_extension',
        category: 'structure_extension',
        name: requiresSculpting ? `Extensión Escultural (${target.lengthCategory})` : `Extensión Soft Gel / Tips (${target.lengthCategory})`,
        description: `Alargamiento de longitud desde ${current.currentLengthCategory} a ${target.lengthCategory} con ápice balanceado`,
        deltaReason: `Diferencia de largo (+${rankDiff} niveles de longitud solicitada)`,
        estimatedMinutes: 20 + rankDiff * 5,
        estimatedPrice: rankDiff > 1 ? 120 : 60,
        isMandatory: true,
        ruleCode: 'DELTA_LENGTH_EXTENSION',
      });
    } else {
      workItems.push({
        id: 'work_natural_overlay',
        category: 'structure_extension',
        name: 'Nivelación y Refuerzo de Placa Natural (Rubber Base)',
        description: 'Nivelación con gel elástico de alta adherencia sin necesidad de extensión',
        deltaReason: 'La longitud natural actual es suficiente para el diseño deseado',
        estimatedMinutes: 15,
        estimatedPrice: 0,
        isMandatory: true,
        ruleCode: 'DELTA_NATURAL_OVERLAY',
      });
    }

    // 5. Shape Resculpting Delta
    if (current.currentShape !== target.shape) {
      workItems.push({
        id: 'work_shaping',
        category: 'shaping',
        name: `Esculpido y Limado de Silueta ${target.shape.toUpperCase()}`,
        description: `Transición de silueta desde ${current.currentShape} hacia ${target.shape}`,
        deltaReason: `Cambio de morfología ungueal requerido`,
        estimatedMinutes: 10,
        estimatedPrice: (target.shape === 'coffin' || target.shape === 'stiletto') ? 30 : 0,
        isMandatory: true,
        ruleCode: 'DELTA_SHAPING',
      });
    }

    // 6. Colorimetría Delta
    workItems.push({
      id: 'work_color',
      category: 'color',
      name: `Esmaltado en Capas (${target.dominantColorName})`,
      description: `Aplicación de 2 capas de pigmento premium con polimerización LED 60s`,
      deltaReason: `Colorimetría objetivo seleccionada`,
      estimatedMinutes: 15,
      estimatedPrice: 0, // Included in base
      isMandatory: true,
      ruleCode: 'DELTA_COLOR_APPLICATION',
    });

    // 7. Nail Art Work Delta
    if (target.artTier !== 'none') {
      const artMinutesMap = { simple: 15, medium: 25, detailed: 40, extreme: 60 };
      const artPriceMap = { simple: 70, medium: 130, detailed: 220, extreme: 320 };
      workItems.push({
        id: 'work_art',
        category: 'art',
        name: `Nail Art: ${target.artDescription}`,
        description: `Técnica manual a mano alzada de nivel ${target.artTier.toUpperCase()}`,
        deltaReason: `Diseño artístico decorativo en set`,
        estimatedMinutes: artMinutesMap[target.artTier] || 20,
        estimatedPrice: artPriceMap[target.artTier] || 80,
        isMandatory: false,
        ruleCode: 'DELTA_NAIL_ART',
      });
    }

    // 8. 3D Charms & Rhinestones
    if (target.rhinestoneCount > 0 || target.charms3DCount > 0) {
      const stonePrice = Math.max(0, target.rhinestoneCount - 2) * 8;
      const charmPrice = target.charms3DCount * 35;
      workItems.push({
        id: 'work_embellishments',
        category: 'embellishment',
        name: `Joyería Ungueal & Dijes (${target.rhinestoneCount} piedras, ${target.charms3DCount} dijes)`,
        description: 'Anclaje con resina UV y gel de construcción para evitar caídas',
        deltaReason: 'Elementos tridimensionales decorativos',
        estimatedMinutes: 10 + target.charms3DCount * 3,
        estimatedPrice: stonePrice + charmPrice,
        isMandatory: false,
        ruleCode: 'DELTA_EMBELLISHMENTS',
      });
    }

    // 9. Diamond Shield Top Coat
    workItems.push({
      id: 'work_seal',
      category: 'seal',
      name: `Sellado Diamond Shield ${target.finish.toUpperCase()} & Óleo Botánico`,
      description: `Top coat de máxima protección UV anti-rayaduras y masaje nutritivo en cutículas`,
      deltaReason: 'Sellado final y protocolo de cuidado',
      estimatedMinutes: 8,
      estimatedPrice: target.finish !== 'gloss' ? 70 : 0,
      isMandatory: true,
      ruleCode: 'DELTA_SEAL_FINISH',
    });

    // Feasibility & Warnings Calculations
    if (current.conditionGrade === 'thin_damaged' && (target.lengthCategory === 'XL' || target.lengthCategory === 'XXL')) {
      warnings.push('La lámina ungueal actual presenta debilidad. Se recomienda largo máximo M o refuerzo de acrigel para evitar quiebres.');
      recommendations.push('Considerar nivelación con Rubber Base reforzada con calcio antes de extensiones XXL.');
    }

    if (intent.targetMaxMinutes && workItems.reduce((a, b) => a + b.estimatedMinutes, 0) > intent.targetMaxMinutes) {
      warnings.push(`El tiempo total de transformación supera tu preferencia de ${intent.targetMaxMinutes} min.`);
    }

    const totalMinutes = workItems.reduce((acc, w) => acc + w.estimatedMinutes, 0);
    const totalPrice = workItems.reduce((acc, w) => acc + w.estimatedPrice, 0);

    return {
      id: `delta_${Date.now()}`,
      current,
      intent,
      target,
      workItems,
      totalDeltaMinutes: totalMinutes,
      totalDeltaPrice: totalPrice,
      complexityScore: target.artTier === 'extreme' ? 9 : target.artTier === 'detailed' ? 7 : target.artTier === 'medium' ? 5 : 3,
      feasibilityScore: warnings.length > 0 ? 0.85 : 0.98,
      feasibilityWarnings: warnings,
      recommendations,
    };
  }
}
