export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  googleEventId?: string;
}
