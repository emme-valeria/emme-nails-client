import React from 'react';
import { QuoteInboxWidget as BaseWidget } from '@/features/quote-management/ui/QuoteInboxWidget';
import { QuoteRequest, Quote } from '@/domain/quotes/entities/QuoteRequest';

interface Props {
  requests?: QuoteRequest[];
  onQuoteCreated?: (quote: Quote) => void;
}

export function QuoteInboxWidget(props: Props) {
  return <BaseWidget {...props} />;
}
