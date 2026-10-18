import React from 'react';
import { QuoteResponseWidget as BaseWidget } from '@/features/custom-quote/ui/QuoteResponseWidget';
import { Quote } from '@/domain/quotes/entities/QuoteRequest';

interface Props {
  quote?: Quote;
  onAcceptAndBookSlot?: () => void;
  onRequestChanges?: (reason: string) => void;
  onDeclineQuote?: () => void;
}

export function QuoteResponseWidget(props: Props) {
  return <BaseWidget {...props} />;
}
