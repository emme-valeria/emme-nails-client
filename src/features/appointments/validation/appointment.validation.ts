import { BookingDraft } from '../state/booking.store';

export function validateAppointmentStep(step: number, draft: BookingDraft): string[] {
  const errors: string[] = [];

  if (step === 1 && !draft.selectedService) {
    errors.push('Por favor selecciona un servicio de la lista para continuar.');
  }

  if (step === 2 && !draft.selectedStaff) {
    errors.push('Por favor selecciona la especialista que te atenderá.');
  }

  if (step === 3) {
    if (!draft.selectedDate) {
      errors.push('Por favor elige la fecha deseada para tu cita.');
    }
    if (!draft.selectedTime) {
      errors.push('Por favor selecciona el horario que más te convenga.');
    }
  }

  if (step === 5) {
    if (!draft.selectedService || !draft.selectedStaff || !draft.selectedDate || !draft.selectedTime) {
      errors.push('Faltan datos requeridos para confirmar la cita. Revisa los pasos anteriores.');
    }
  }

  return errors;
}
