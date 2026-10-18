import React from 'react';
import { QuoteFlowProvider } from '@/features/quote-flow/model/quote-flow.context';
import { QuoteChatRenderer } from '@/features/quote-flow/renderers/chat/QuoteChatRenderer';

interface CustomQuoteChatWidgetProps {
  onCompleteSubmit?: () => void;
}

export function CustomQuoteChatWidget({ onCompleteSubmit }: CustomQuoteChatWidgetProps) {
  return (
    <QuoteFlowProvider>
      <QuoteChatRenderer onCompleteSubmit={onCompleteSubmit} />
    </QuoteFlowProvider>
  );
}
