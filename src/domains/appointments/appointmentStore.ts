import { AppointmentBooking } from '@/entities/appointment/types';

class AppointmentStore {
  private appointments: AppointmentBooking[] = [];

  addAppointment(apt: Omit<AppointmentBooking, 'id' | 'createdAt'>): AppointmentBooking {
    const newApt: AppointmentBooking = {
      ...apt,
      id: `apt-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    this.appointments.unshift(newApt);
    return newApt;
  }

  getAppointments(): AppointmentBooking[] {
    return this.appointments;
  }
}

export const appointmentStore = new AppointmentStore();
