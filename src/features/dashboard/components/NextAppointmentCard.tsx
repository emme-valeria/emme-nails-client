import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn, parseLocalDate } from '@emme/ui/lib/utils';
import { PriceTag } from '@/shared/components/PriceTag';
import { AppointmentStatusBadge } from '@/shared/components/AppointmentStatusBadge';
import type { Appointment, Service, BusinessProfile } from '@/app/AppContext';

interface NextAppointmentCardProps {
  appointment?: Appointment;
  service?: Service | null;
  profile?: BusinessProfile;
  className?: string;
  onReschedule?: () => void;
  onCancel?: (id: string) => void;
  onBookNew?: () => void;
}

export function generateGoogleCalendarLink(apt: Appointment): string {
  if (!apt) return '#';
  const title = encodeURIComponent(`Cita en Emme Studio - ${apt.serviceId}`);
  const details = encodeURIComponent(`Notas: ${apt.notes || 'Cita de manicura'}`);
  const location = encodeURIComponent('Calle Principal 123, Madrid');
  
  const cleanDate = apt.date.replace(/-/g, '');
  const cleanStart = apt.startTime.replace(':', '') + '00';
  const cleanEnd = apt.endTime.replace(':', '') + '00';
  
  const dates = `${cleanDate}T${cleanStart}/${cleanDate}T${cleanEnd}`;
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

export const NextAppointmentCard: React.FC<NextAppointmentCardProps> = ({
  appointment,
  service,
  profile,
  className = '',
  onReschedule,
  onCancel,
}) => {
  if (!appointment || !service) return null;

  return (
    <div className={cn("w-full liquid-glass rounded-[28px] overflow-hidden", className)}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AppointmentStatusBadge status={appointment.status} size="sm" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">#{appointment.id.slice(-4).toUpperCase()}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-[#1D1D1F] dark:text-white tracking-tight leading-tight truncate">
              {service.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{service.duration} minutos de sesión</p>
          </div>
          <PriceTag price={service.price} size="lg" variant="primary" />
        </div>

        <div className="mt-5 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3 text-[#1D1D1F] dark:text-white">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Calendar className="size-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider">Fecha</span>
              <span className="font-bold capitalize">
                {format(parseLocalDate(appointment.date), "EEEE d 'de' MMMM", { locale: es })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#1D1D1F] dark:text-white">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="size-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider">Horario</span>
              <span className="font-bold">{appointment.startTime} - {appointment.endTime}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-black/[0.04] dark:border-white/[0.06]">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile?.address || profile?.name || 'Calle Principal 123, Madrid')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-xs sm:text-sm text-[#1D1D1F] dark:text-white hover:text-primary transition-colors py-1 group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <MapPin className="size-4 text-primary shrink-0" />
              <span className="font-medium truncate">{profile?.address || 'Calle Principal 123, Madrid'}</span>
            </div>
            <ExternalLink className="size-3.5 text-slate-500 group-hover:text-primary shrink-0" />
          </a>
        </div>
      </div>

      {/* Edge-to-Edge Action Bar */}
      <div className="flex flex-row border-t border-black/[0.04] dark:border-white/[0.06] divide-x divide-black/[0.04] dark:divide-white/[0.06] bg-white/40 dark:bg-white/[0.02]">
        <button
          type="button"
          onClick={onReschedule}
          className="flex-1 min-h-[44px] py-3 text-xs sm:text-sm font-bold text-[#1D1D1F] dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.06] active:scale-[0.98] transition-all cursor-pointer"
        >
          Reprogramar Horario
        </button>
        <button
          type="button"
          onClick={() => onCancel && onCancel(appointment.id)}
          className="flex-1 min-h-[44px] py-3 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-500/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          Cancelar Cita
        </button>
      </div>
    </div>
  );
};
