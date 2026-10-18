import { AiIntentInterpretation, ServiceConfiguration } from './types';
import { QUALIFIED_SERVICES } from './service-catalog';

export interface VisualFeatureAnalysis {
  detectedServiceId: string;
  detectedShape: string;
  detectedLength: string;
  detectedFinish: string;
  detectedColorHex: string;
  detectedColorName: string;
  detectedArtTier: number;
  detectedArtElements: string[];
  confidenceScore: number;
  missingGaps: {
    key: 'length' | 'removal' | 'shape' | 'color';
    label: string;
    description: string;
    options?: { id: string; label: string }[];
  }[];
}

export class AiIntentResolver {
  public static async interpretDesignInput(
    promptText?: string,
    imageUrl?: string
  ): Promise<AiIntentInterpretation & { visualAnalysis?: VisualFeatureAnalysis }> {
    const text = (promptText || '').toLowerCase().trim();
    const hasImage = Boolean(imageUrl && imageUrl.trim().length > 0);

    // Default configuration
    let suggestedServiceId = 'structured-gel';
    let length: ServiceConfiguration['length'] = 'short';
    let shape: ServiceConfiguration['shape'] = 'almond';
    let finish: ServiceConfiguration['finish'] = 'glossy';
    let artTier: ServiceConfiguration['artTier'] = 0;
    const artTags: string[] = [];
    let detectedColorHex = '#F6A5C0';
    let detectedColorName = 'Bubble Pink';

    // Service matching
    if (text.includes('gel x') || text.includes('gel-x') || text.includes('extension') || text.includes('alargar') || text.includes('larga')) {
      suggestedServiceId = 'gel-x-extensions';
      length = 'medium';
    } else if (text.includes('acrilico') || text.includes('escultural') || text.includes('acrylic')) {
      suggestedServiceId = 'sculpted-acrylic';
      length = 'long';
    } else if (text.includes('pedi') || text.includes('pie')) {
      suggestedServiceId = 'pedicure-spa-deluxe';
    } else if (text.includes('pestaña') || text.includes('lash')) {
      suggestedServiceId = 'lashes-volume-natural';
    } else if (text.includes('retirar') || text.includes('quitar')) {
      suggestedServiceId = 'safe-removal-only';
    }

    // Length parsing
    if (text.includes('corta') || text.includes('natural') || text.includes('short')) {
      length = 'short';
    } else if (text.includes('mediana') || text.includes('medium')) {
      length = 'medium';
    } else if (text.includes('larga') || text.includes('long') || text.includes('xl')) {
      length = 'long';
    }

    // Shape parsing
    if (text.includes('almendra') || text.includes('almond')) {
      shape = 'almond';
    } else if (text.includes('cuadrada') || text.includes('square')) {
      shape = 'square';
    } else if (text.includes('coffin') || text.includes('ballerina')) {
      shape = 'coffin';
    } else if (text.includes('oval')) {
      shape = 'oval';
    } else if (text.includes('stiletto') || text.includes('pico')) {
      shape = 'stiletto';
    }

    // Finish & Color parsing
    if (text.includes('chrome') || text.includes('cromo') || text.includes('glazed') || text.includes('hailey') || text.includes('perla')) {
      finish = 'glazed';
      detectedColorHex = '#FDF7F4';
      detectedColorName = 'Glazed Milky';
      artTags.push('Efecto Glazed Perla');
    } else if (text.includes('cat eye') || text.includes('ojo de gato') || text.includes('magnet')) {
      finish = 'cat_eye';
      detectedColorHex = '#D8B4E2';
      detectedColorName = 'Cromo Lila Cat-Eye';
      artTags.push('Efecto Cat-Eye Magnético');
    } else if (text.includes('mate') || text.includes('matte') || text.includes('terciopelo')) {
      finish = 'matte';
    } else if (text.includes('french') || text.includes('francesita') || text.includes('frances')) {
      finish = 'french';
      detectedColorHex = '#F0C9B6';
      detectedColorName = 'French Nude & White';
      artTier = 1;
      artTags.push('Línea Francesa Elegante');
    } else if (text.includes('rojo') || text.includes('red') || text.includes('vino')) {
      detectedColorHex = '#B81D24';
      detectedColorName = 'Rojo Carmesí';
    } else if (text.includes('nude') || text.includes('natural')) {
      detectedColorHex = '#F3C5BA';
      detectedColorName = 'Nude Rosé';
    } else if (text.includes('negro') || text.includes('dark') || text.includes('obsidian')) {
      detectedColorHex = '#211D20';
      detectedColorName = 'Obsidian Dark';
    }

    // Nail Art Tier parsing
    if (text.includes('3d') || text.includes('dije') || text.includes('charm') || text.includes('mano alzada') || text.includes('flor') || text.includes('marmol')) {
      artTier = (Math.max(artTier || 0, 2) as 0 | 1 | 2 | 3 | 4);
      artTags.push('Relieve 3D / Diseño elaborado');
    } else if (text.includes('cristal') || text.includes('swarovski') || text.includes('joya')) {
      artTier = 3;
      artTags.push('Incrustación de Cristales');
    }

    if (hasImage && artTier === 0 && !finish) {
      artTier = 1;
      artTags.push('Diseño extraído de referencia');
    }

    // Determine missing gaps for photo analysis
    const missingGaps: VisualFeatureAnalysis['missingGaps'] = [];
    if (!text.includes('corta') && !text.includes('mediana') && !text.includes('larga') && !text.includes('xl')) {
      missingGaps.push({
        key: 'length',
        label: 'Confirmar largo deseado',
        description: '¿Qué longitud prefieres para tus uñas?',
        options: [
          { id: 'short', label: 'Corta (Natural)' },
          { id: 'medium', label: 'Mediana' },
          { id: 'long', label: 'Larga' },
          { id: 'xl', label: 'Extra Larga' }
        ]
      });
    }

    missingGaps.push({
      key: 'removal',
      label: 'Retiro de producto anterior',
      description: '¿Cuentas con gel, acrílico o esmalte previo que requiera retiro seguro?',
      options: [
        { id: 'none', label: 'Sin producto (Uñas limpias)' },
        { id: 'gel', label: 'Retiro Gel / Rubber (+$120)' },
        { id: 'acrylic', label: 'Retiro Acrílico / Gel-X (+$180)' }
      ]
    });

    const matchedService = QUALIFIED_SERVICES.find(s => s.id === suggestedServiceId) || QUALIFIED_SERVICES[0];

    const minPrice = matchedService.basePriceMXN + (length === 'medium' ? 80 : length === 'long' ? 160 : 0) + (artTier * 120);
    const maxPrice = minPrice + 150;
    const estMinutes = matchedService.baseDurationMinutes + (artTier * 15);

    const explanation = hasImage
      ? `Detectamos un diseño ${matchedService.clientTitle} en forma ${shape} con acabado ${finish}.`
      : `Interpretamos tu solicitud para ${matchedService.clientTitle} en largo ${length} y acabado ${finish}.`;

    return {
      rawSource: promptText || imageUrl || '',
      identifiedCategory: matchedService.category,
      suggestedServiceId: matchedService.id,
      suggestedServiceTitle: matchedService.clientTitle,
      confidence: hasImage ? 0.95 : 0.88,
      explanation,
      suggestedConfig: {
        serviceId: matchedService.id,
        serviceTitle: matchedService.clientTitle,
        clientVibeLabel: `${matchedService.clientTitle} Personalizado`,
        length,
        shape,
        finish,
        artTier,
        artTags,
        hasExistingProduct: false,
        referenceImageUrl: imageUrl
      },
      estimatedPriceRange: { minMXN: minPrice, maxMXN: maxPrice },
      estimatedMinutes: estMinutes,
      visualAnalysis: {
        detectedServiceId: matchedService.id,
        detectedShape: shape,
        detectedLength: length,
        detectedFinish: finish,
        detectedColorHex,
        detectedColorName,
        detectedArtTier: artTier,
        detectedArtElements: artTags,
        confidenceScore: hasImage ? 0.95 : 0.85,
        missingGaps
      }
    };
  }
}

