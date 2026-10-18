import { NailConfiguration, DesignDetails, QuoteItem } from '../entities/QuoteRequest';

export class QuotePricingService {
  public static calculateEstimatedPriceRange(
    serviceBasePrice: number,
    nailConfig: NailConfiguration,
    designDetails: DesignDetails
  ): { min: number; max: number; items: QuoteItem[] } {
    const items: QuoteItem[] = [
      { id: '1', description: 'Servicio Base Gel / Set', amount: serviceBasePrice },
    ];

    let extraMin = 0;
    let extraMax = 0;

    // Length adjustments
    if (nailConfig.length === 'medium') {
      items.push({ id: 'len', description: 'Largo Mediano', amount: 50 });
      extraMin += 50;
      extraMax += 50;
    } else if (nailConfig.length === 'long') {
      items.push({ id: 'len', description: 'Largo Lardo', amount: 100 });
      extraMin += 100;
      extraMax += 100;
    } else if (nailConfig.length === 'xl') {
      items.push({ id: 'len', description: 'Largo Extra XL', amount: 150 });
      extraMin += 150;
      extraMax += 150;
    }

    // Product removal
    if (nailConfig.existingProductToRemove) {
      items.push({ id: 'remov', description: 'Remoción de producto anterior', amount: 100 });
      extraMin += 100;
      extraMax += 100;
    }

    // Broken nails repair
    if (nailConfig.brokenNailsCount > 0) {
      const repairCost = nailConfig.brokenNailsCount * 50;
      items.push({ id: 'repair', description: `Reparación de uña (${nailConfig.brokenNailsCount}x)`, amount: repairCost });
      extraMin += repairCost;
      extraMax += repairCost;
    }

    // Design finish & complexity
    if (designDetails.finish === 'chrome') {
      items.push({ id: 'fin', description: 'Efecto Chrome Espejado', amount: 150 });
      extraMin += 150;
      extraMax += 150;
    } else if (designDetails.finish === 'cat_eye') {
      items.push({ id: 'fin', description: 'Efecto Ojo de Gato 3D', amount: 120 });
      extraMin += 120;
      extraMax += 120;
    }

    if (designDetails.complexity === 'french') {
      items.push({ id: 'art', description: 'Francés / Ombré', amount: 100 });
      extraMin += 100;
      extraMax += 100;
    } else if (designDetails.complexity === '3d_charms') {
      items.push({ id: 'art', description: 'Nail Art 3D / Cristales Swarovski', amount: 200 });
      extraMin += 200;
      extraMax += 250;
    } else if (designDetails.complexity === 'art_illustration') {
      items.push({ id: 'art', description: 'Ilustración / Mano alzada personalizada', amount: 250 });
      extraMin += 250;
      extraMax += 350;
    }

    const baseSum = items.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      min: baseSum,
      max: baseSum + (extraMax - extraMin) + (designDetails.complexity === 'art_illustration' ? 150 : 50),
      items,
    };
  }

  public static calculateDurationMinutes(
    nailConfig: NailConfiguration,
    designDetails: DesignDetails
  ): number {
    let minutes = 60; // Base 1 hr

    if (nailConfig.nailType === 'extension') minutes += 30;
    if (nailConfig.length === 'long' || nailConfig.length === 'xl') minutes += 20;
    if (nailConfig.existingProductToRemove) minutes += 20;
    if (designDetails.complexity === '3d_charms' || designDetails.complexity === 'art_illustration') minutes += 30;

    return minutes;
  }
}
