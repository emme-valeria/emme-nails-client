import { InspirationProviderPort, InspirationSearchInput } from '../../application/ports/InspirationProviderPort';
import { DesignInspiration } from '../../entities/Inspiration';

export const CURATED_INSPIRATIONS: DesignInspiration[] = [
  {
    id: 'insp-1',
    title: 'Chrome French con Flores Minimal',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
    tags: ['Chrome', 'French', 'Flores', 'Elegante', 'Trending 2026'],
    finish: 'chrome',
    colors: ['#ffffff', '#f472b6', '#e2e8f0'],
    shape: 'almond',
    complexity: 'intermediate',
    estimatedDurationMinutes: 120,
    pricingModifiers: ['Chrome', 'Nail Art'],
    source: 'salon_portfolio',
    popularityScore: 98,
  },
  {
    id: 'insp-2',
    title: 'Aura Gradient en Tonos Pastel',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80',
    tags: ['Aura', 'Gradient', 'Jelly', 'Quiet Luxury'],
    finish: 'aura',
    colors: ['#f472b6', '#c084fc', '#38bdf8'],
    shape: 'almond',
    complexity: 'intermediate',
    estimatedDurationMinutes: 105,
    pricingModifiers: ['Aura Art'],
    source: 'emme_curated',
    popularityScore: 94,
  },
  {
    id: 'insp-3',
    title: 'Ojo de Gato Terciopelo Rose Gold',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop&q=80',
    tags: ['Cat-Eye', 'Velvet', 'Rose Gold', 'Glazed'],
    finish: 'velvet',
    colors: ['#fb7185', '#e2e8f0'],
    shape: 'squoval',
    complexity: 'basic',
    estimatedDurationMinutes: 90,
    pricingModifiers: ['Velvet Effect'],
    source: 'salon_portfolio',
    popularityScore: 91,
  },
  {
    id: 'insp-4',
    title: 'Escultural 3D con Moños y Perlas',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    tags: ['3D', 'Moños', 'Perlas', 'Coquette', 'Advanced'],
    finish: 'glossy',
    colors: ['#fbcfe8', '#ffffff'],
    shape: 'coffin',
    complexity: 'advanced',
    estimatedDurationMinutes: 150,
    pricingModifiers: ['3D Charms', 'Swarovski'],
    source: 'salon_portfolio',
    popularityScore: 89,
  },
  {
    id: 'insp-5',
    title: 'Celestial Metallic Blue & Silver',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80',
    tags: ['Celestial', 'Metallic', 'Blue', 'Stars', 'Trending 2026'],
    finish: 'chrome',
    colors: ['#1e3a8a', '#e2e8f0'],
    shape: 'almond',
    complexity: 'custom_hand_painted',
    estimatedDurationMinutes: 135,
    pricingModifiers: ['Chrome', 'Mano Alzada'],
    source: 'emme_curated',
    popularityScore: 87,
  },
  {
    id: 'insp-6',
    title: 'Milky Glass con Micro-French',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',
    tags: ['Milky', 'Micro-French', 'Minimalist', 'Short Nails'],
    finish: 'milky',
    colors: ['#ffffff', '#fce7f3'],
    shape: 'square',
    complexity: 'basic',
    estimatedDurationMinutes: 75,
    pricingModifiers: ['Micro French'],
    source: 'emme_curated',
    popularityScore: 95,
  },
];

export class CuratedInspirationProvider implements InspirationProviderPort {
  public async searchInspirations(input: InspirationSearchInput): Promise<DesignInspiration[]> {
    let results = [...CURATED_INSPIRATIONS];

    if (input.source && input.source !== 'all') {
      results = results.filter((i) => i.source === input.source);
    }

    if (input.finish) {
      results = results.filter((i) => i.finish === input.finish);
    }

    if (input.query) {
      const q = input.query.toLowerCase();
      results = results.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results;
  }

  public async getPopularInspirations(): Promise<DesignInspiration[]> {
    return [...CURATED_INSPIRATIONS].sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
  }
}
