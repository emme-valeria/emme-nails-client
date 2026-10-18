import React from 'react';
import { QuoteFlowProvider } from '@/features/quote-flow/model/quote-flow.context';
import { QuoteWizardRenderer } from '@/features/quote-flow/renderers/wizard/QuoteWizardRenderer';

interface CustomQuoteWizardWidgetProps {
  onCompleteSubmit?: () => void;
}

export function CustomQuoteWizardWidget({ onCompleteSubmit }: CustomQuoteWizardWidgetProps) {
  return (
    <QuoteFlowProvider>
      <QuoteWizardRenderer onCompleteSubmit={onCompleteSubmit} />
    </QuoteFlowProvider>
  );
}
