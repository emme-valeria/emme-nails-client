import { QuoteRequest } from '@/entities/quote/types';

const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'quote-101',
    createdAt: '2026-08-11T14:30:00Z',
    baseServiceId: 'gel-extensions',
    baseServiceName: 'Gel extensions',
    length: 'Medium',
    shape: 'Almond',
    explanationMode: 'combined',
    referenceImages: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80'],
    descriptionText: 'Efecto chrome rosado con detalles florales sutiles.',
    finish: 'Chrome',
    details: ['Flowers', 'French'],
    estimatedMinPriceMXN: 900,
    estimatedMaxPriceMXN: 1300,
    confirmedPriceMXN: 1100,
    durationMinutes: 150,
    depositRequiredMXN: 300,
    validUntilDate: '2026-08-18',
    status: 'accepted'
  }
];

class QuoteStore {
  private quotes: QuoteRequest[] = INITIAL_QUOTES;

  getQuotes(): QuoteRequest[] {
    return this.quotes;
  }

  getQuoteById(id: string): QuoteRequest | undefined {
    return this.quotes.find((q) => q.id === id) || this.quotes[0];
  }

  addQuote(quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>): QuoteRequest {
    const newQuote: QuoteRequest = {
      ...quote,
      id: `quote-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    this.quotes.unshift(newQuote);
    return newQuote;
  }

  updateQuoteStatus(id: string, status: QuoteRequest['status']): void {
    const found = this.quotes.find((q) => q.id === id);
    if (found) {
      found.status = status;
    }
  }
}

export const quoteStore = new QuoteStore();
