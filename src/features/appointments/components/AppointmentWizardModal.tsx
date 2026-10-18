import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@emme/ui/dialog';
import { DirectBookingFlow } from '@/features/direct-booking/ui/DirectBookingFlow';

interface AppointmentWizardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AppointmentWizardModal({ isOpen, onOpenChange, onSuccess }: AppointmentWizardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-4 sm:p-6 overflow-hidden bg-background border-none shadow-2xl rounded-3xl outline-none max-h-[92vh] overflow-y-auto custom-scrollbar">
        <DialogTitle className="sr-only">Agendar Cita Directa</DialogTitle>
        <DirectBookingFlow
          isModal
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentWizardModal;
