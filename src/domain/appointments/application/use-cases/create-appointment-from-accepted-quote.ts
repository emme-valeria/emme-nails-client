import { Quote } from '@/domain/quotes/entities/QuoteRequest';
import { Appointment } from '../../entities/Appointment';

export interface CreateAppointmentFromQuoteInput {
  quote: Quote;
  date: string;
  timeSlot: string;
}

export class CreateAppointmentFromAcceptedQuoteUseCase {
  public execute(input: CreateAppointmentFromQuoteInput): Appointment {
    return {
      id: `apt-quote-${Date.now()}`,
      bookingType: 'quote_conversion',
      clientId: input.quote.clientId,
      clientName: 'Cliente Emme',
      serviceId: 'custom-quote-service',
      serviceTitle: `Cotización Personalizada (#${input.quote.id.slice(-4)})`,
      quoteId: input.quote.id,
      staffId: input.quote.staffId,
      staffName: input.quote.staffName,
      date: input.date,
      timeSlot: input.timeSlot,
      durationMinutes: input.quote.estimatedDurationMinutes,
      totalPrice: input.quote.totalPrice,
      depositPaid: input.quote.requiredDeposit,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  }
}
