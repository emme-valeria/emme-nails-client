export interface AppointmentBooking {
  id: string;
  createdAt: string;
  type: 'direct_service' | 'accepted_quote';
  quoteId?: string;
  serviceName: string;
  length: string;
  shape: string;
  finish: string;
  nailArtDetails?: string[];
  artistName: string;
  dateISO: string;
  timeSlot: string;
  totalMXN: number;
  depositPaidMXN: number;
  status: 'confirmed' | 'pending_payment' | 'completed' | 'cancelled';
}
