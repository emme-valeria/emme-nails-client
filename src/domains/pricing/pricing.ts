import { PriceEstimate } from '@/shared/wizard/wizard.types';

export interface PricingInput {
  serviceId?: string;
  length?: 'Short' | 'Medium' | 'Long';
  finish?: 'Glossy' | 'Matte' | 'Chrome' | 'Cat-eye' | 'Jelly';
  hasNailArt?: boolean;
  artDetails?: string[];
}

export function calculatePricing({
  serviceId = 'gel-manicure',
  length = 'Short',
  finish = 'Glossy',
  hasNailArt = false,
  artDetails = []
}: PricingInput): PriceEstimate {
  // Base Prices in MXN
  const baseServicePrices: Record<string, { label: string; base: number }> = {
    'gel-manicure': { label: 'Gel manicure base', base: 450 },
    'acrylic-set': { label: 'Acrylic set base', base: 700 },
    'gel-extensions': { label: 'Gel extensions base', base: 800 },
    'removal': { label: 'Removal service', base: 200 },
    'repair': { label: 'Repair service', base: 150 },
    'not-sure': { label: 'Estima base', base: 500 }
  };

  const selectedBase = baseServicePrices[serviceId] || baseServicePrices['gel-manicure'];

  const lengthDeltas: Record<string, number> = {
    Short: 0,
    Medium: 100,
    Long: 200
  };

  const finishDeltas: Record<string, number> = {
    Glossy: 0,
    Matte: 50,
    Chrome: 150,
    'Cat-eye': 150,
    Jelly: 100
  };

  const detailDeltas: Record<string, number> = {
    French: 100,
    Aura: 120,
    Flowers: 150,
    Charms: 150,
    '3D': 200
  };

  const breakdown: Array<{ label: string; amountMXN: number }> = [];

  // Base
  breakdown.push({ label: selectedBase.label, amountMXN: selectedBase.base });

  // Length
  const lengthCost = lengthDeltas[length] || 0;
  if (lengthCost > 0) {
    breakdown.push({ label: `Largo: ${length}`, amountMXN: lengthCost });
  }

  // Finish
  const finishCost = finishDeltas[finish] || 0;
  if (finishCost > 0) {
    breakdown.push({ label: `Acabado: ${finish}`, amountMXN: finishCost });
  }

  // Nail Art Details
  let artCost = 0;
  if (hasNailArt || artDetails.length > 0) {
    if (artDetails.length === 0) {
      artCost = 150;
      breakdown.push({ label: 'Nail Art Básico', amountMXN: 150 });
    } else {
      artDetails.forEach((detail) => {
        const cost = detailDeltas[detail] || 100;
        artCost += cost;
        breakdown.push({ label: `Arte: ${detail}`, amountMXN: cost });
      });
    }
  }

  const totalMXN = selectedBase.base + lengthCost + finishCost + artCost;
  // Calculate standard 30% deposit rounded to nearest 50 MXN
  const depositMXN = Math.max(200, Math.round((totalMXN * 0.3) / 50) * 50);

  return {
    totalMXN,
    depositMXN,
    breakdown
  };
}

export function calculateQuoteEstimate(
  baseServiceId: string,
  length: 'Short' | 'Medium' | 'Long',
  finish: 'Glossy' | 'Chrome' | 'Cat-eye' | 'Matte' | 'Jelly',
  details: string[]
): { minMXN: number; maxMXN: number; depositMXN: number } {
  const calc = calculatePricing({
    serviceId: baseServiceId,
    length,
    finish,
    hasNailArt: details.length > 0,
    artDetails: details
  });

  const minMXN = calc.totalMXN;
  const maxMXN = calc.totalMXN + 350;
  const depositMXN = Math.max(250, Math.round((minMXN * 0.3) / 50) * 50);

  return { minMXN, maxMXN, depositMXN };
}
