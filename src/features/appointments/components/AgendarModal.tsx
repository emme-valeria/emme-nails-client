import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@emme/ui/dialog';
import { DirectBookingFlow } from '@/features/direct-booking/ui/DirectBookingFlow';

interface AgendarModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialServiceId?: string;
}

export function AgendarModal({
  isOpen,
  onOpenChange,
  initialServiceId,
}: AgendarModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-4 sm:p-6 overflow-hidden bg-background border-none shadow-2xl rounded-3xl outline-none max-h-[92vh] overflow-y-auto custom-scrollbar">
        <DialogTitle className="sr-only">Agendar Cita</DialogTitle>
        <DirectBookingFlow 
          isModal
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

