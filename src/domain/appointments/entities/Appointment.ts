export interface Appointment {
  id: string;
  bookingType: 'direct_booking' | 'quote_conversion';
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceTitle: string;
  quoteId?: string;
  staffId: string;
  staffName: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  totalPrice: number;
  depositPaid: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
