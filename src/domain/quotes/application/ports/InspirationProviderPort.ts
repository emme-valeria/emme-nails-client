import { DesignInspiration } from '../../entities/Inspiration';

export interface InspirationSearchInput {
  query?: string;
  category?: string;
  finish?: string;
  tags?: string[];
  source?: 'salon_portfolio' | 'emme_curated' | 'all';
}

export interface InspirationProviderPort {
  searchInspirations(input: InspirationSearchInput): Promise<DesignInspiration[]>;
  getPopularInspirations(): Promise<DesignInspiration[]>;
}
