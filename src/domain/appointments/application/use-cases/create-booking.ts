import { Appointment } from '../../entities/Appointment';

export interface CreateBookingInput {
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceTitle: string;
  staffId: string;
  staffName: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  totalPrice: number;
  depositAmount: number;
}

export class CreateBookingUseCase {
  public execute(input: CreateBookingInput): Appointment {
    return {
      id: `apt-dir-${Date.now()}`,
      bookingType: 'direct_booking',
      clientId: input.clientId,
      clientName: input.clientName,
      serviceId: input.serviceId,
      serviceTitle: input.serviceTitle,
      staffId: input.staffId,
      staffName: input.staffName,
      date: input.date,
      timeSlot: input.timeSlot,
      durationMinutes: input.durationMinutes,
      totalPrice: input.totalPrice,
      depositPaid: input.depositAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  }
}
