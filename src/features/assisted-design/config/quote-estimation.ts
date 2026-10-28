import { DEFAULT_SALON_CATALOG } from '@/domain/quotes/services/nail-semantic-pricing-engine';

/**
 * Duraciones orientativas para los detalles de diseño. El catálogo actual del
 * salón define precios, pero no tiempos por detalle. Ajustar aquí al validar
 * estos minutos con el equipo de Emme.
 */
export const NAIL_DETAIL_DURATION_MINUTES: Record<string, number> = {
  chrome: 12,
  pearl: 10,
  glossy: 0,
  french: 15,
  rhinestones: 12,
  charms: 15,
  handPainted: 20,
  glitter: 10,
  default: 12,
};

export function getNailDetailUnitPrice(label: string): number {
  const name = label.toLocaleLowerCase('es-MX');
  const catalog = DEFAULT_SALON_CATALOG;

  if (/swarovski|cristal|piedra|rhinestone/.test(name)) return catalog.embellishments.rhinestones.additionalUnitPrice ?? catalog.embellishments.rhinestones.basePrice;
  if (/joyer[ií]a|dije|charm|moño|perla 3d/.test(name)) return catalog.embellishments.charms3D.basePrice;
  if (/franc[eé]s|french/.test(name)) return catalog.frenchAddon.basePrice;
  if (/chrome|cromo|espejo|mirror/.test(name)) return catalog.finishAddons.chrome.basePrice;
  if (/glazed|glaseado/.test(name)) return catalog.finishAddons.glazed.basePrice;
  if (/perlado|n[aá]car|pearl/.test(name)) return catalog.finishAddons.pearl.basePrice;
  if (/glitter|brillantina|purpurina/.test(name)) return catalog.finishAddons.glitter.basePrice;
  if (/mano alzada|pintado|nail art|dise[nñ]o/.test(name)) return catalog.artTiers.medium.basePrice;
  if (/glossy|brillo/.test(name)) return catalog.finishAddons.gloss.basePrice;
  return catalog.artTiers.simple.basePrice;
}

export function getNailDetailDuration(label: string): number {
  const name = label.toLocaleLowerCase('es-MX');
  if (/swarovski|cristal|piedra|rhinestone/.test(name)) return NAIL_DETAIL_DURATION_MINUTES.rhinestones;
  if (/joyer[ií]a|dije|charm|moño/.test(name)) return NAIL_DETAIL_DURATION_MINUTES.charms;
  if (/franc[eé]s|french/.test(name)) return NAIL_DETAIL_DURATION_MINUTES.french;
  if (/chrome|cromo|espejo|mirror/.test(name)) return NAIL_DETAIL_DURATION_MINUTES.chrome;
  if (/perlado|n[aá]car|pearl/.test(name)) return NAIL_DETAIL_DURATION_MINUTES.pearl;
  if (/glitter|brillantina|purpurina/.test(name)) return NAIL_DETAIL_DURATION_MINUTES.glitter;
  if (/mano alzada|pintado|nail art|dise[nñ]o/.test(name)) return NAIL_DETAIL_DURATION_MINUTES.handPainted;
  if (/glossy|brillo/.test(name)) return NAIL_DETAIL_DURATION_MINUTES.glossy;
  return NAIL_DETAIL_DURATION_MINUTES.default;
}

export function getNailBasePrice(technique: string): number {
  const normalized = technique.toLocaleLowerCase('es-MX');
  const services = DEFAULT_SALON_CATALOG.baseServices;
  if (/ac[rí]lic/.test(normalized)) return services.acrylic_sculpted.basePrice;
  if (/poly.?gel|acrigel/.test(normalized)) return services.polygel_extensions.basePrice;
  if (/rubber|nivelaci/.test(normalized)) return services.rubber_base_leveling.basePrice;
  if (/builder|biab/.test(normalized)) return services.builder_gel_overlay.basePrice;
  if (/russian|rusa|estructura|soft.?gel|gel.?x|extensi/.test(normalized)) return services.soft_gel_extensions.basePrice;
  if (/semi|gel clásico|esmaltado/.test(normalized)) return services.gel_manicure.basePrice;
  return services.other.basePrice;
}
