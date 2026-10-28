import React, { useState } from 'react';
import { Button } from '@emme/ui/button';
import { AppointmentConfirmation, MOCK_APPOINTMENT_CONFIRMATION } from './AppointmentConfirmation';

/** Ejemplo aislado para probar la confirmación con una cita ficticia tipada. */
export function AppointmentConfirmationExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>Ver ejemplo de confirmación</Button>
      <AppointmentConfirmation
        appointment={MOCK_APPOINTMENT_CONFIRMATION}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onViewAppointment={() => setIsOpen(false)}
      />
    </>
  );
}
