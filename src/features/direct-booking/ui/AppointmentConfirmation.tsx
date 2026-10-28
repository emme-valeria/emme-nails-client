import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CalendarPlus, Clock3, MapPin, Share2, X } from 'lucide-react';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@emme/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@emme/ui/avatar';
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from '@emme/ui/dialog';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import type { Appointment } from '@/domain/appointments/entities/Appointment';
import { AppointmentStatusBadge } from '@/shared/components/AppointmentStatusBadge';
import { STAFF_MEMBERS } from '@/features/staff';
import { toast } from 'sonner';

export interface AppointmentConfirmationProps {
  appointment: Appointment;
  open: boolean;
  onClose: () => void;
  onViewAppointment: (appointment: Appointment) => void;
}

const stagger = {
  hidden: { opacity: 0, y: 8 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function escapeIcs(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function toUtcStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function AppointmentConfirmation({ appointment, open, onClose, onViewAppointment }: AppointmentConfirmationProps) {
  const prefersReducedMotion = useReducedMotion();
  const staff = STAFF_MEMBERS.find((member) => member.id === appointment.staffId);
  const start = useMemo(() => parse(`${appointment.date} ${appointment.timeSlot}`, 'yyyy-MM-dd HH:mm', new Date()), [appointment.date, appointment.timeSlot]);
  const end = useMemo(() => new Date(start.getTime() + appointment.durationMinutes * 60_000), [start, appointment.durationMinutes]);
  const dateLabel = format(start, "EEEE d 'de' MMMM", { locale: es });
  const timeLabel = format(start, 'h:mm a', { locale: es }).replace('a. m.', 'am').replace('p. m.', 'pm');
  const dateTimeLabel = `${dateLabel.charAt(0).toUpperCase()}${dateLabel.slice(1)} · ${timeLabel}`;
  const durationLabel = appointment.durationMinutes >= 60
    ? `${Math.floor(appointment.durationMinutes / 60)} h${appointment.durationMinutes % 60 ? ` ${appointment.durationMinutes % 60} min` : ''}`
    : `${appointment.durationMinutes} min`;
  const place = appointment.location?.trim();
  const fallbackText = `¡Tengo cita de ${appointment.serviceTitle} con ${appointment.staffName}!\n${dateTimeLabel}${place ? `\n${place}` : ''}`;

  const addToCalendar = () => {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//emme//Appointment//ES', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT', `UID:${appointment.id}@emme`, `DTSTAMP:${toUtcStamp(new Date())}`,
      `DTSTART:${toUtcStamp(start)}`, `DTEND:${toUtcStamp(end)}`,
      `SUMMARY:${escapeIcs(`Cita de uñas: ${appointment.serviceTitle}`)}`,
      `DESCRIPTION:${escapeIcs(`Con ${appointment.staffName}`)}`,
      ...(place ? [`LOCATION:${escapeIcs(place)}`] : []),
      'BEGIN:VALARM', 'TRIGGER:-PT24H', 'ACTION:DISPLAY', 'DESCRIPTION:Tu cita de uñas es mañana', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emme-cita-${appointment.date}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Tu cita está lista para agregar al calendario');
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mi cita en Emme', text: fallbackText });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(fallbackText);
      toast.success('Detalles de tu cita copiados');
    } catch {
      const input = document.createElement('textarea');
      input.value = fallbackText;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      toast.success('Detalles de tu cita copiados');
    }
  };

  const noMotion = prefersReducedMotion;
  const fade = noMotion ? { duration: 0.18 } : { type: 'spring' as const, stiffness: 240, damping: 30, mass: 0.9 };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Popup
          finalFocus={false}
          aria-describedby="appointment-confirmation-description"
          className="fixed inset-x-0 bottom-0 top-auto left-0 z-[200] mx-auto flex max-h-[min(92dvh,760px)] w-full max-w-[420px] translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-t-[32px] rounded-b-none border border-b-0 border-border/60 bg-background p-0 pb-[env(safe-area-inset-bottom)] text-foreground shadow-[0_-16px_60px_rgba(0,0,0,0.16)] outline-none sm:bottom-0 sm:rounded-[32px] sm:border-b sm:pb-0"
        >
        <DialogTitle className="sr-only">¡Tu cita está confirmada!</DialogTitle>
        <motion.section
          drag="y"
          dragDirectionLock
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.18 }}
          onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 650) onClose(); }}
          initial={noMotion ? { opacity: 0 } : { y: '100%' }}
          animate={noMotion ? { opacity: 1 } : { y: 0 }}
          exit={noMotion ? { opacity: 0 } : { y: '100%' }}
          transition={fade}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-4 pt-3 sm:px-7"
        >
          <div className="relative flex shrink-0 touch-none items-center justify-center pb-3">
            <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" aria-hidden="true" />
            <Button type="button" variant="ghost" size="icon" aria-label="Cerrar confirmación" onClick={onClose} className="absolute right-0 top-0">
              <X className="size-5" />
            </Button>
          </div>

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={noMotion ? { opacity: 0 } : { scale: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={noMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 240, damping: 22, delay: 0.08 }}
              className="grid size-[68px] place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15"
              aria-hidden="true"
            >
              <svg viewBox="0 0 32 32" className="size-9 overflow-visible" fill="none">
                <motion.path d="m8 16.5 5.2 5.2L24.5 10" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round"
                  initial={noMotion ? { opacity: 0 } : { pathLength: 0 }} animate={noMotion ? { opacity: 1 } : { pathLength: 1 }}
                  transition={noMotion ? { duration: 0.18 } : { duration: 0.35, delay: 0.23, ease: 'easeOut' }} />
              </svg>
            </motion.div>

            <motion.h2 custom={0} variants={stagger} initial="hidden" animate="show" className="mt-4 text-[22px] font-bold tracking-tight text-foreground">
              ¡Tu cita está confirmada!
            </motion.h2>
            <motion.p id="appointment-confirmation-description" custom={1} variants={stagger} initial="hidden" animate="show" className="mt-1 text-sm font-medium text-muted-foreground">
              {dateTimeLabel}
            </motion.p>
          </div>

          <motion.div custom={2} variants={stagger} initial="hidden" animate="show" className="mt-5 rounded-[24px] border border-border/70 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <Avatar size="lg" className="size-12">
                {staff?.avatar && <AvatarImage src={staff.avatar} alt={appointment.staffName} />}
                <AvatarFallback>{appointment.staffName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('')}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[11px] font-medium text-muted-foreground">Tu manicurista</p>
                <p className="truncate text-sm font-semibold text-foreground">{appointment.staffName}</p>
              </div>
              <AppointmentStatusBadge status={appointment.status} size="sm" />
            </div>
            <div className="space-y-3 pt-3 text-left">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Tu servicio</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{appointment.serviceTitle}</p>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><Clock3 className="size-4" />Duración</span>
                <span className="font-medium text-foreground">{durationLabel}</span>
              </div>
              <div className="flex items-start justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" />Lugar</span>
                <span className="text-right font-medium text-foreground">{place || 'Por confirmar con tu manicurista'}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 text-sm">
                <span className="text-muted-foreground">Total de tu servicio</span>
                <span className="font-semibold text-foreground">${appointment.totalPrice.toLocaleString('es-MX')} MXN</span>
              </div>
              {appointment.depositPaid > 0 && (
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Anticipo</span>
                  <span className="font-semibold text-foreground">${appointment.depositPaid.toLocaleString('es-MX')} MXN</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div custom={3} variants={stagger} initial="hidden" animate="show" className="mt-4 flex flex-col gap-2.5">
            <Button type="button" size="lg" className="w-full" onClick={addToCalendar}>
              <CalendarPlus className="size-4" />Agregar a mi calendario
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full" onClick={share}>
              <Share2 className="size-4" />Compartir
            </Button>
            <Button type="button" variant="ghost" className="min-h-11 w-full text-primary" onClick={() => onViewAppointment(appointment)}>
              Ver mi cita
            </Button>
          </motion.div>
        </motion.section>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}

export const MOCK_APPOINTMENT_CONFIRMATION: Appointment = {
  id: 'mock-appointment-emme',
  bookingType: 'direct_booking',
  clientId: 'mock-client',
  clientName: 'Clienta de prueba',
  serviceId: 'e1',
  serviceTitle: 'Extensiones Soft Gel (Gel-X)',
  staffId: 'staff-1',
  staffName: 'Emme V.',
  date: '2026-10-23',
  timeSlot: '16:00',
  durationMinutes: 70,
  totalPrice: 680,
  depositPaid: 340,
  status: 'confirmed',
  createdAt: '2026-10-19T12:00:00.000Z',
};
