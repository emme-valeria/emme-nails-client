import { Quote } from '../../entities/QuoteRequest';

export interface AcceptQuoteInput {
  quote: Quote;
}

export class AcceptQuoteUseCase {
  public execute(input: AcceptQuoteInput): Quote {
    return {
      ...input.quote,
      status: 'ACCEPTED',
    };
  }
}
