import React from 'react';
import { Card } from '@emme/ui/card';
import { Badge } from '@emme/ui/badge';
import { Button } from '@emme/ui/button';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles, MessageSquare, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseLocalDate } from '@emme/ui/lib/utils';
import type { Appointment, Service } from '@/app/AppContext';
import type { BusinessProfile } from '@/features/profile/domain';

interface NextAppointmentBannerProps {
  nextAppointment?: Appointment;
  nextService?: Service;
  profile: BusinessProfile;
  generateGoogleCalendarLink: (apt: Appointment) => string;
  onRescheduleWithAi: () => void;
}

export function NextAppointmentBanner({
  nextAppointment,
  nextService,
  profile,
  generateGoogleCalendarLink,
  onRescheduleWithAi,
}: NextAppointmentBannerProps) {
  const resolvedService = nextService || (nextAppointment ? {
    id: nextAppointment.serviceId,
    name: nextAppointment.notes?.split('•')?.find(n => n.includes('Servicio:'))?.replace('Servicio:', '').trim() || 'Sesión Confirmada',
    price: 450,
    duration: 60,
    category: 'Manicura y Uñas',
    isActive: true,
  } : null);

  if (!nextAppointment || !resolvedService) return null;

  return (
    <Card className="rounded-[28px] bg-[#1C1C1E]/90 text-white p-5 sm:p-7 space-y-4 relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-[24px] border border-white/15">
      <div className="absolute top-0 right-0 w-60 h-60 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
            <Sparkles className="size-4.5 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50 block">Atención Próxima</span>
            <h3 className="text-base sm:text-lg font-display font-extrabold text-white tracking-tight">Tu Sesión Confirmada</h3>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px] font-bold px-3 py-1 rounded-full shrink-0">
          ● Confirmada
        </Badge>
      </div>

      {/* Info Card */}
      <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 sm:p-5 backdrop-blur-md space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{resolvedService.category}</span>
            <h4 className="text-lg sm:text-2xl font-display font-bold text-white leading-tight mt-0.5">{resolvedService.name}</h4>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">Precio</span>
            <span className="text-base sm:text-xl font-display font-extrabold text-white">${resolvedService.price}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2.5 border-t border-white/10 text-xs sm:text-sm text-white/90">
          <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <Calendar className="size-4 text-white/70 shrink-0" />
            <span className="capitalize truncate font-medium">{format(parseLocalDate(nextAppointment.date), "EEE d 'de' MMM", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <Clock className="size-4 text-white/70 shrink-0" />
            <span className="font-medium">{nextAppointment.startTime} - {nextAppointment.endTime}</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5 overflow-hidden">
            <MapPin className="size-4 text-white/70 shrink-0" />
            <span className="truncate font-medium">{profile.address || 'Studio EmmeStudio'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
