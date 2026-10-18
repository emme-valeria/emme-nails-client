import React from 'react';
import { AcceptedQuoteBookingWidget } from '@/widgets/accepted-quote-booking/ui/AcceptedQuoteBookingWidget';

export function QuoteBookingPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AcceptedQuoteBookingWidget />
    </div>
  );
}
