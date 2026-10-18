import React from 'react';
import { BookingConfirmationWidget as BaseWidget } from '@/features/custom-quote/ui/BookingConfirmationWidget';
import { Quote } from '@/domain/quotes/entities/QuoteRequest';

interface Props {
  quote?: Quote;
  onAppointmentCreated?: (appointmentId: string) => void;
}

export function BookingConfirmationWidget(props: Props) {
  return <BaseWidget {...props} />;
}
