import {
  SemanticNailSetModel,
  SalonPricingCatalog,
  CalculatedNailQuote,
  ItemizedQuoteLine,
  BaseServiceCategory,
  LengthCategory,
  NailShapeCategory,
  FinishType,
  SingleNailSemantic
} from '../entities/NailArtSemanticTypes';

/**
 * Standard Emme Salon Pricing Catalog
 * Semantic extraction is universal; pricing is salon-specific.
 */
export const DEFAULT_SALON_CATALOG: SalonPricingCatalog = {
  salonId: 'emme_studio_flagship',
  salonName: 'Emme Studio & Lounge',
  currency: 'MXN',
  taxRate: 0, // Direct salon tax included
  minimumCharge: 380,
  approvalThresholds: {
    minConfidence: 0.78,
    maxPriceRangeWidthPercent: 22,
    requireApprovalForHandPaintedHigh: true,
    requireApprovalForUnknownMaterial: true,
  },
  baseServices: {
    rubber_base_leveling: {
      id: 'srv_rubber_base',
      name: 'Nivelación Rubber Base (Uña Natural)',
      semanticCategory: 'base_service',
      description: 'Manicura rusa combinada + refuerzo y nivelación de lámina ungueal',
      pricingUnit: 'fixed',
      basePrice: 480,
      stackable: false,
      includedWith: ['prep_russian', 'color_single', 'top_gloss'],
      active: true,
    },
    soft_gel_extensions: {
      id: 'srv_soft_gel',
      name: 'Extensiones Soft Gel (Gel-X System)',
      semanticCategory: 'base_service',
      description: 'Tips de gel flexible esculpido con adhesión libre de monómero',
      pricingUnit: 'fixed',
      basePrice: 620,
      stackable: false,
      includedWith: ['prep_russian', 'color_single', 'top_gloss'],
      active: true,
    },
    acrylic_sculpted: {
      id: 'srv_acrylic_sculpted',
      name: 'Acrílico Escultural Orgánico',
      semanticCategory: 'base_service',
      description: 'Estructura escultural sobre forma con polímero premium',
      pricingUnit: 'fixed',
      basePrice: 680,
      stackable: false,
      includedWith: ['prep_russian', 'color_single', 'top_gloss'],
      active: true,
    },
    gel_manicure: {
      id: 'srv_gel_manicure',
      name: 'Gel Semipermanente Clásico',
      semanticCategory: 'base_service',
      description: 'Manicura exprés con esmaltado semipermanente de 2 capas',
      pricingUnit: 'fixed',
      basePrice: 380,
      stackable: false,
      includedWith: ['prep_basic', 'color_single', 'top_gloss'],
      active: true,
    },
    builder_gel_overlay: {
      id: 'srv_builder_overlay',
      name: 'Overlay Builder Gel / BIAB',
      semanticCategory: 'base_service',
      description: 'Refuerzo de gel de construcción de alta densidad',
      pricingUnit: 'fixed',
      basePrice: 540,
      stackable: false,
      includedWith: ['prep_russian', 'color_single', 'top_gloss'],
      active: true,
    },
    polygel_extensions: {
      id: 'srv_polygel_ext',
      name: 'Extensiones Dual Polygel Híbrido',
      semanticCategory: 'base_service',
      description: 'Sistema híbrido acrigel ultraligero y resistente',
      pricingUnit: 'fixed',
      basePrice: 650,
      stackable: false,
      includedWith: ['prep_russian', 'color_single', 'top_gloss'],
      active: true,
    },
    basic_manicure: {
      id: 'srv_basic_mani',
      name: 'Manicura Spa Limpia',
      semanticCategory: 'base_service',
      description: 'Limpieza profunda, exfoliación e hidratación sin esmalte',
      pricingUnit: 'fixed',
      basePrice: 320,
      stackable: false,
      active: true,
    },
    maintenance_refill: {
      id: 'srv_refill',
      name: 'Retoque / Relleno de Crecimiento',
      semanticCategory: 'base_service',
      description: 'Balance de ápice y renovación de color (hasta 3 semanas)',
      pricingUnit: 'fixed',
      basePrice: 420,
      stackable: false,
      active: true,
    },
    removal_and_new: {
      id: 'srv_removal_new',
      name: 'Retiro Cuidadoso + Aplicación Nueva',
      semanticCategory: 'base_service',
      description: 'Remoción con torno y broca de carburo sin daño a lámina',
      pricingUnit: 'fixed',
      basePrice: 120,
      stackable: true,
      active: true,
    },
    other: {
      id: 'srv_custom',
      name: 'Servicio Personalizado en Cabina',
      semanticCategory: 'base_service',
      description: 'Diagnóstico en mesa de manicura',
      pricingUnit: 'fixed',
      basePrice: 450,
      stackable: false,
      active: true,
    },
  },
  lengthSurcharges: {
    XS: 0,
    S: 0,
    M: 0, // Medium is included in standard salon base
    L: 60,
    XL: 120,
    XXL: 180,
    XXXL: 250,
    CUSTOM: 80,
    UNKNOWN: 0,
  },
  shapeSurcharges: {
    almond: 0, // Included
    round: 0, // Included
    square: 0, // Included
    squoval: 0, // Included
    oval: 0, // Included
    coffin: 30, // Precision shaping surcharge
    stiletto: 40,
    ballerina: 30,
    edge: 60,
    lipstick: 50,
    flare: 50,
    mountain_peak: 40,
    duck: 60,
    tapered_square: 20,
    custom: 50,
    unknown: 0,
  },
  finishAddons: {
    glazed: {
      id: 'fin_glazed',
      name: 'Efecto Glazed Donut / Pearl Chrome',
      semanticCategory: 'finish',
      description: 'Polvo de mica perlado pulido sobre base lechosa',
      pricingUnit: 'fixed',
      basePrice: 90,
      stackable: true,
      active: true,
    },
    chrome: {
      id: 'fin_chrome',
      name: 'Efecto Mirror Chrome Metálico',
      semanticCategory: 'finish',
      description: 'Pigmento de cromo espejo alta reflectividad',
      pricingUnit: 'fixed',
      basePrice: 110,
      stackable: true,
      active: true,
    },
    magnetic_cat_eye: {
      id: 'fin_cateye',
      name: 'Efecto 9D Velvet Cat-Eye',
      semanticCategory: 'finish',
      description: 'Partículas magnéticas orientadas con imán cilíndrico',
      pricingUnit: 'fixed',
      basePrice: 95,
      stackable: true,
      active: true,
    },
    velvet_magnetic: {
      id: 'fin_velvet',
      name: 'Efecto Terciopelo Magnético',
      semanticCategory: 'finish',
      description: 'Efecto de profundidad multidireccional',
      pricingUnit: 'fixed',
      basePrice: 95,
      stackable: true,
      active: true,
    },
    matte: {
      id: 'fin_matte',
      name: 'Acabado Velvet Matte',
      semanticCategory: 'finish',
      description: 'Top coat mate aterciopelado anti-manchas',
      pricingUnit: 'fixed',
      basePrice: 40,
      stackable: true,
      active: true,
    },
    gloss: {
      id: 'fin_gloss',
      name: 'Top Coat Brillo Espejo (Incluido)',
      semanticCategory: 'finish',
      description: 'Brillo ultra duradero no-wipe',
      pricingUnit: 'fixed',
      basePrice: 0,
      stackable: false,
      active: true,
    },
    satin: {
      id: 'fin_satin',
      name: 'Acabado Satinado Suave',
      semanticCategory: 'finish',
      description: 'Brillo sedoso natural',
      pricingUnit: 'fixed',
      basePrice: 40,
      stackable: true,
      active: true,
    },
    mirror: {
      id: 'fin_mirror',
      name: 'Efecto Espejo Líquido',
      semanticCategory: 'finish',
      description: 'Cromo plateado o dorado reflectante',
      pricingUnit: 'fixed',
      basePrice: 110,
      stackable: true,
      active: true,
    },
    pearl: {
      id: 'fin_pearl',
      name: 'Pigmento Ostra Nácar',
      semanticCategory: 'finish',
      description: 'Destellos sutiles de nácar natural',
      pricingUnit: 'fixed',
      basePrice: 85,
      stackable: true,
      active: true,
    },
    aurora: {
      id: 'fin_aurora',
      name: 'Efecto Aurora Boreal Holo',
      semanticCategory: 'finish',
      description: 'Transición prismática multicolor',
      pricingUnit: 'fixed',
      basePrice: 120,
      stackable: true,
      active: true,
    },
    holographic: {
      id: 'fin_holo',
      name: 'Polvo Holográfico Láser',
      semanticCategory: 'finish',
      description: 'Reflejo arcoíris de alta densidad',
      pricingUnit: 'fixed',
      basePrice: 120,
      stackable: true,
      active: true,
    },
    glitter: {
      id: 'fin_glitter',
      name: 'Topping Glitter Encapsulado',
      semanticCategory: 'finish',
      description: 'Micro-destellos finos o chuncky',
      pricingUnit: 'fixed',
      basePrice: 60,
      stackable: true,
      active: true,
    },
    reflective_glitter: {
      id: 'fin_reflective',
      name: 'Glitter Reflectivo Flash',
      semanticCategory: 'finish',
      description: 'Pigmento reactivo a la luz y fotografía',
      pricingUnit: 'fixed',
      basePrice: 75,
      stackable: true,
      active: true,
    },
    sugar: {
      id: 'fin_sugar',
      name: 'Efecto Textura Sugar Effect',
      semanticCategory: 'finish',
      description: 'Micro-cristales espolvoreados en relieve',
      pricingUnit: 'fixed',
      basePrice: 70,
      stackable: true,
      active: true,
    },
  },
  artTiers: {
    simple: {
      id: 'art_simple',
      name: 'Nail Art Minimalista / Líneas / Puntos',
      semanticCategory: 'nail_art',
      description: 'Trazos sencillos o foil en 1 a 2 uñas',
      pricingUnit: 'per_nail',
      basePrice: 35,
      stackable: true,
      active: true,
    },
    medium: {
      id: 'art_medium',
      name: 'Nail Art Intermedio (Florales / Ondas)',
      semanticCategory: 'nail_art',
      description: 'Mano alzada intermedia, degradados aura o geometría',
      pricingUnit: 'per_nail',
      basePrice: 65,
      stackable: true,
      active: true,
    },
    detailed: {
      id: 'art_detailed',
      name: 'Nail Art Avanzado / Micro-Ilustración',
      semanticCategory: 'nail_art',
      description: 'Pintura detallada de precisión, sombreados o personajes',
      pricingUnit: 'per_nail',
      basePrice: 110,
      stackable: true,
      active: true,
    },
    extreme: {
      id: 'art_extreme',
      name: 'Master Art & Escultura 3D Compleja',
      semanticCategory: 'nail_art',
      description: 'Ilustración artística hiperrealista o volumen escultural',
      pricingUnit: 'per_nail',
      basePrice: 160,
      stackable: true,
      active: true,
    },
  },
  embellishments: {
    rhinestones: {
      id: 'emb_rhinestone',
      name: 'Cristales Tipo Swarovski',
      semanticCategory: 'embellishment',
      description: 'Cristales facetados con pegamento de resina UV',
      pricingUnit: 'per_item',
      basePrice: 8,
      includedQuantity: 2, // 2 small stones included as promo
      additionalUnitPrice: 8,
      stackable: true,
      active: true,
    },
    charms3D: {
      id: 'emb_charm3d',
      name: 'Dijes / Moños 3D Encapsulados',
      semanticCategory: 'embellishment',
      description: 'Dijes de resina, moños o perlas con anclaje de acrílico',
      pricingUnit: 'per_item',
      basePrice: 35,
      stackable: true,
      active: true,
    },
    goldFoil: {
      id: 'emb_foil',
      name: 'Lámina de Oro / Foil Metálico',
      semanticCategory: 'embellishment',
      description: 'Acentos dorados o plateados encapsulados',
      pricingUnit: 'per_nail',
      basePrice: 25,
      stackable: true,
      active: true,
    },
  },
  frenchAddon: {
    id: 'addon_french',
    name: 'Técnica French (Punta Francesa)',
    semanticCategory: 'technique',
    description: 'Sonrisa clásica, micro-french o V-shape',
    pricingUnit: 'fixed',
    basePrice: 80,
    stackable: true,
    active: true,
  },
  removalAddon: {
    id: 'addon_removal',
    name: 'Retiro de Set Anterior',
    semanticCategory: 'removal',
    description: 'Retiro seguro sin limado invasivo',
    pricingUnit: 'fixed',
    basePrice: 90,
    stackable: true,
    active: true,
  },
};

/**
 * Universal Semantic Pricing Engine
 * Implements the full pricing formulas, Anti-Double-Charging logic,
 * Uncertainty range calculations, and Artist Approval threshold rules.
 */
export class NailSemanticPricingEngine {
  /**
   * Calculates a complete, standardized quote from semantic model + salon catalog
   */
  public static calculateQuote(
    semantic: SemanticNailSetModel,
    catalog: SalonPricingCatalog = DEFAULT_SALON_CATALOG
  ): CalculatedNailQuote {
    const lines: ItemizedQuoteLine[] = [];
    const antiDoubleChargingApplied: string[] = [];
    const assumptions: string[] = [...semantic.assumptions];
    const uncertainties: string[] = [...semantic.uncertainties];
    const approvalReasons: string[] = [];

    // 1. Base Service Resolution
    const baseServiceDef = catalog.baseServices[semantic.baseService.category] || catalog.baseServices.rubber_base_leveling;
    const baseServiceLine: ItemizedQuoteLine = {
      id: baseServiceDef.id,
      category: 'Servicio Base',
      name: baseServiceDef.name,
      unitPrice: baseServiceDef.basePrice,
      totalPrice: baseServiceDef.basePrice,
      isIncluded: false,
      confidence: semantic.baseService.confidence,
      note: baseServiceDef.description,
    };
    lines.push(baseServiceLine);

    // Record Anti-Double-Charging inclusions from base service (e.g. standard color + gloss top included)
    if (baseServiceDef.includedWith) {
      if (baseServiceDef.includedWith.includes('color_single')) {
        antiDoubleChargingApplied.push(`1 Tono base sólido incluido en ${baseServiceDef.name}`);
      }
      if (baseServiceDef.includedWith.includes('top_gloss')) {
        antiDoubleChargingApplied.push(`Top coat brillo protector incluido sin cargo extra`);
      }
    }

    // 2. Length Surcharge
    const lengthCat = semantic.globalAttributes.length.category;
    const lengthCost = catalog.lengthSurcharges[lengthCat] ?? 0;
    if (lengthCost > 0) {
      lines.push({
        id: `len_${lengthCat.toLowerCase()}`,
        category: 'Longitud',
        name: `Largo ${lengthCat} (${semantic.globalAttributes.length.mmEstimate})`,
        unitPrice: lengthCost,
        totalPrice: lengthCost,
        isIncluded: false,
        confidence: semantic.globalAttributes.length.confidence,
        note: 'Suplemento de estructura por extensión adicional',
      });
    } else {
      lines.push({
        id: `len_${lengthCat.toLowerCase()}`,
        category: 'Longitud',
        name: `Largo ${lengthCat} (${semantic.globalAttributes.length.mmEstimate})`,
        unitPrice: 0,
        totalPrice: 0,
        isIncluded: true,
        confidence: semantic.globalAttributes.length.confidence,
        note: 'Incluido en el servicio base',
      });
    }

    // 3. Shape Surcharge
    const shapeCat = semantic.globalAttributes.shape.category;
    const shapeCost = catalog.shapeSurcharges[shapeCat] ?? 0;
    if (shapeCost > 0) {
      lines.push({
        id: `shape_${shapeCat.toLowerCase()}`,
        category: 'Forma & Limado',
        name: `Forma ${shapeCat.toUpperCase()} de Precisión`,
        unitPrice: shapeCost,
        totalPrice: shapeCost,
        isIncluded: false,
        confidence: semantic.globalAttributes.shape.confidence,
        note: 'Esculpido y alineación de bordes libres',
      });
    } else {
      lines.push({
        id: `shape_${shapeCat.toLowerCase()}`,
        category: 'Forma & Limado',
        name: `Forma ${shapeCat.toUpperCase()}`,
        unitPrice: 0,
        totalPrice: 0,
        isIncluded: true,
        confidence: semantic.globalAttributes.shape.confidence,
        note: 'Incluido en el servicio base',
      });
    }

    // 4. Optical Finish Addons
    const finish = semantic.globalAttributes.primaryFinish;
    if (finish && finish !== 'gloss') {
      const finishDef = catalog.finishAddons[finish];
      if (finishDef && finishDef.basePrice > 0) {
        lines.push({
          id: finishDef.id,
          category: 'Acabado Óptico',
          name: finishDef.name,
          unitPrice: finishDef.basePrice,
          totalPrice: finishDef.basePrice,
          isIncluded: false,
          confidence: 0.92,
          note: finishDef.description,
        });
      }
    }

    // 5. French Technique
    if (semantic.globalAttributes.french?.detected) {
      const frenchDef = catalog.frenchAddon;
      lines.push({
        id: frenchDef.id,
        category: 'Técnica French',
        name: `${frenchDef.name} (${semantic.globalAttributes.french.style})`,
        unitPrice: frenchDef.basePrice,
        totalPrice: frenchDef.basePrice,
        isIncluded: false,
        confidence: 0.94,
        note: `${semantic.globalAttributes.french.affectedNailsCount} uñas con diseño francés`,
      });
    }

    // 6. Nail Art by Complexity & Nails Count
    const art = semantic.globalAttributes.art;
    if (art.isHandPainted && art.affectedNailsCount > 0) {
      const tierDef = catalog.artTiers[art.complexityTier] || catalog.artTiers.simple;
      const totalArtPrice = tierDef.basePrice * art.affectedNailsCount;
      lines.push({
        id: tierDef.id,
        category: 'Nail Art a Mano Alzada',
        name: tierDef.name,
        quantityDescription: `${art.affectedNailsCount} uñas (${art.elements.join(', ')})`,
        unitPrice: tierDef.basePrice,
        totalPrice: totalArtPrice,
        isIncluded: false,
        confidence: art.evidence === 'OBSERVED' ? 0.95 : 0.82,
        note: `Nivel de detalle: ${art.complexityTier.toUpperCase()}`,
      });

      if (art.complexityTier === 'extreme' || art.complexityTier === 'detailed') {
        approvalReasons.push(`Diseño a mano alzada de alta complejidad (${art.complexityTier}) requiere validación de tiempo en cabina.`);
      }
    }

    // 7. Embellishments (Rhinestones & 3D Charms with min-max quantities)
    const emb = semantic.globalAttributes.embellishments;
    if (emb.hasRhinestones && emb.estimatedRhinestoneCount.max > 0) {
      const stoneDef = catalog.embellishments.rhinestones;
      const count = emb.estimatedRhinestoneCount.min;
      const billableCount = Math.max(0, count - (stoneDef.includedQuantity || 0));
      const stoneTotal = billableCount * (stoneDef.additionalUnitPrice || stoneDef.basePrice);

      if (stoneTotal > 0) {
        lines.push({
          id: stoneDef.id,
          category: 'Pedrería & Cristales',
          name: stoneDef.name,
          quantityDescription: `~${count} piezas estimadas (${stoneDef.includedQuantity || 0} de cortesía)`,
          unitPrice: stoneDef.additionalUnitPrice || stoneDef.basePrice,
          totalPrice: stoneTotal,
          isIncluded: false,
          confidence: 0.85,
          note: `Rango detectado: ${emb.estimatedRhinestoneCount.min} a ${emb.estimatedRhinestoneCount.max} cristales`,
        });
      }
    }

    if (emb.hasCharms && emb.charmCount > 0) {
      const charmDef = catalog.embellishments.charms3D;
      const charmTotal = emb.charmCount * charmDef.basePrice;
      lines.push({
        id: charmDef.id,
        category: 'Dijes 3D & Relieve',
        name: charmDef.name,
        quantityDescription: `${emb.charmCount} dije(s) 3D`,
        unitPrice: charmDef.basePrice,
        totalPrice: charmTotal,
        isIncluded: false,
        confidence: 0.9,
        note: 'Encapsulado y anclaje con estructura UV',
      });
    }

    // 8. Removal if detected
    if (semantic.nailCondition.needsRemoval) {
      const remDef = catalog.removalAddon;
      lines.push({
        id: remDef.id,
        category: 'Retiro & Preparación',
        name: remDef.name,
        unitPrice: remDef.basePrice,
        totalPrice: remDef.basePrice,
        isIncluded: false,
        confidence: 0.88,
        note: 'Retiro seguro de producto previo',
      });
    }

    // 9. Totals Calculation
    const billableLines = lines.filter(l => !l.isIncluded);
    const subtotal = billableLines.reduce((acc, l) => acc + l.totalPrice, 0);
    const taxes = Math.round(subtotal * catalog.taxRate);
    const discounts = 0;
    const estimatedTotal = Math.max(catalog.minimumCharge, subtotal + taxes - discounts);

    // 10. Uncertainty Range Calculation (Min - Max)
    // Range factors in stone count uncertainty and complexity variations
    const stoneUncertaintyMaxDiff = emb.hasRhinestones
      ? (emb.estimatedRhinestoneCount.max - emb.estimatedRhinestoneCount.min) * (catalog.embellishments.rhinestones.additionalUnitPrice || 8)
      : 0;

    const lengthUncertainty = semantic.globalAttributes.length.confidence < 0.85 ? 40 : 0;
    const artUncertainty = art.isHandPainted && art.evidence !== 'OBSERVED' ? 50 : 20;

    const minPrice = Math.max(catalog.minimumCharge, estimatedTotal - 20);
    const maxPrice = estimatedTotal + stoneUncertaintyMaxDiff + lengthUncertainty + artUncertainty;
    const rangeWidthPercent = Math.round(((maxPrice - minPrice) / estimatedTotal) * 100);

    // 11. Approval Logic Check per Salon Rules
    let requiresApproval = false;
    if (semantic.overallConfidence < catalog.approvalThresholds.minConfidence) {
      requiresApproval = true;
      approvalReasons.push(`Certeza global de IA (${Math.round(semantic.overallConfidence * 100)}%) inferior al umbral de confianza (${Math.round(catalog.approvalThresholds.minConfidence * 100)}%).`);
    }

    if (rangeWidthPercent > catalog.approvalThresholds.maxPriceRangeWidthPercent) {
      requiresApproval = true;
      approvalReasons.push(`Amplitud de rango de precio (${rangeWidthPercent}%) supera el margen automático del salón (${catalog.approvalThresholds.maxPriceRangeWidthPercent}%).`);
    }

    if (catalog.approvalThresholds.requireApprovalForHandPaintedHigh && (art.complexityTier === 'detailed' || art.complexityTier === 'extreme')) {
      requiresApproval = true;
      if (!approvalReasons.some(r => r.includes('mano alzada'))) {
        approvalReasons.push('El diseño incluye nail art a mano alzada de alta complejidad que debe ser confirmado por la especialista.');
      }
    }

    const confidenceTier: 'Alta Certeza' | 'Buena Precisión' | 'Revisión en Cabina Requerida' =
      semantic.overallConfidence >= 0.88 && !requiresApproval
        ? 'Alta Certeza'
        : semantic.overallConfidence >= 0.75
        ? 'Buena Precisión'
        : 'Revisión en Cabina Requerida';

    return {
      catalogVersion: '2026.1-standard',
      currency: catalog.currency,
      baseService: baseServiceLine,
      lines,
      subtotal,
      taxes,
      discounts,
      estimatedTotal,
      estimatedRange: {
        min: minPrice,
        max: maxPrice,
        likely: estimatedTotal,
        rangeWidthPercent,
      },
      estimatedDurationMinutes: {
        min: semantic.laborFactors.totalLaborMinutesMin,
        max: semantic.laborFactors.totalLaborMinutesMax,
        likely: Math.round((semantic.laborFactors.totalLaborMinutesMin + semantic.laborFactors.totalLaborMinutesMax) / 2),
      },
      confidence: semantic.overallConfidence,
      confidenceTier,
      requiresArtistApproval: requiresApproval || semantic.requiresArtistApproval,
      approvalReasons: Array.from(new Set([...semantic.approvalReasons, ...approvalReasons])),
      assumptions,
      uncertainties,
      antiDoubleChargingApplied,
    };
  }

  /**
   * Applies an artist technician override to the calculated quote
   */
  public static applyArtistOverride(
    quote: CalculatedNailQuote,
    params: {
      adjustedTotal: number;
      reasonCode: string;
      technicianNote: string;
    }
  ): CalculatedNailQuote {
    const adjustment = params.adjustedTotal - quote.estimatedTotal;
    return {
      ...quote,
      estimatedTotal: params.adjustedTotal,
      estimatedRange: {
        min: params.adjustedTotal,
        max: params.adjustedTotal,
        likely: params.adjustedTotal,
        rangeWidthPercent: 0,
      },
      requiresArtistApproval: false,
      artistOverride: {
        isApplied: true,
        originalTotal: quote.estimatedTotal,
        adjustedTotal: params.adjustedTotal,
        adjustmentAmount: adjustment,
        reasonCode: params.reasonCode,
        technicianNote: params.technicianNote,
        approvedAt: new Date().toISOString(),
      },
    };
  }
}
