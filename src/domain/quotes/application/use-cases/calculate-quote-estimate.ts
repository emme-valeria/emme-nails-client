import { NailConfiguration, DesignDetails, QuoteItem } from '../../entities/QuoteRequest';
import { QuotePricingService } from '../../services/QuotePricingService';

export interface CalculateQuoteInput {
  serviceBasePrice: number;
  nailConfig: NailConfiguration;
  designDetails: DesignDetails;
}

export interface QuoteEstimateOutput {
  minPrice: number;
  maxPrice: number;
  estimatedDurationMinutes: number;
  breakdownItems: QuoteItem[];
}

export class CalculateQuoteEstimateUseCase {
  public execute(input: CalculateQuoteInput): QuoteEstimateOutput {
    const priceRange = QuotePricingService.calculateEstimatedPriceRange(
      input.serviceBasePrice,
      input.nailConfig,
      input.designDetails
    );

    const duration = QuotePricingService.calculateDurationMinutes(
      input.nailConfig,
      input.designDetails
    );

    return {
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      estimatedDurationMinutes: duration,
      breakdownItems: priceRange.items,
    };
  }
}
