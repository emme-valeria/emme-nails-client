import React from 'react';
import { Button } from '@emme/ui/button';
import { AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { Appointment, Service } from '@/app/AppContext';

interface CancelAppointmentModalProps {
  appointment: Appointment | null;
  service?: Service;
  onClose: () => void;
  onConfirmCancel: (aptId: string) => void;
}

export function CancelAppointmentModal({
  appointment,
  service,
  onClose,
  onConfirmCancel,
}: CancelAppointmentModalProps) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="material-regular dark:bg-[#1C1C1E]/90 dark:border-white/10 rounded-[32px] max-w-md w-full p-6 sm:p-8 space-y-6 relative"
      >
        <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="size-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-display font-bold text-[#1D1D1F]">¿Cancelar esta reserva?</h3>
          <p className="text-xs text-[#86868B] font-medium leading-relaxed">
            Estás a punto de cancelar tu cita para <strong className="text-[#1D1D1F]">{service?.name || 'Tratamiento'}</strong> el día <strong className="text-[#1D1D1F]">{appointment.date}</strong> a las <strong className="text-[#1D1D1F]">{appointment.startTime} hs</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-12 rounded-2xl border-black/10 font-bold text-xs uppercase tracking-wider"
          >
            Mantener Cita
          </Button>
          <Button
            onClick={() => onConfirmCancel(appointment.id)}
            className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Sí, Cancelar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
