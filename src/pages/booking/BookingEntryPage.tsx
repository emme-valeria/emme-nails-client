import React from 'react';
import { BookingEntryWidget } from '@/widgets/booking-entry/ui/BookingEntryWidget';

export function BookingEntryPage() {
  return (
    <div className="w-full bg-background pt-0 sm:pt-1 pb-6 px-1 sm:px-4 max-w-7xl mx-auto">
      <BookingEntryWidget />
    </div>
  );
}
