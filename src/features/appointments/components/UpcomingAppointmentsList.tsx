import React, { useMemo } from 'react';
import { Button } from '@emme/ui/button';
import { Calendar, Clock, Trash2, Plus, CalendarPlus } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseLocalDate, cn } from '@emme/ui/lib/utils';
import type { Appointment, Service } from '@/app/AppContext';

interface UpcomingAppointmentsListProps {
  upcomingAppointments: Appointment[];
  services: Service[];
  generateGoogleCalendarLink: (apt: Appointment) => string;
  onOpenAgendarModal: () => void;
  onSelectCancelApt: (apt: Appointment) => void;
}

interface DateGroup {
  key: string;
  title: string;
  badge?: string;
  appointments: Appointment[];
}

export function UpcomingAppointmentsList({
  upcomingAppointments,
  services,
  generateGoogleCalendarLink,
  onOpenAgendarModal,
  onSelectCancelApt,
}: UpcomingAppointmentsListProps) {
  // Group upcoming appointments by Month & Year or relative timeframe
  const groupedAppointments = useMemo<DateGroup[]>(() => {
    if (upcomingAppointments.length === 0) return [];

    const groupsMap = new Map<string, DateGroup>();

    upcomingAppointments.forEach((apt) => {
      const aptDate = parseLocalDate(apt.date);
      const monthKey = format(aptDate, 'yyyy-MM');
      const monthTitle = format(aptDate, "MMMM 'de' yyyy", { locale: es });
      
      let badge = '';
      if (isToday(aptDate)) {
        badge = 'Hoy';
      } else if (isTomorrow(aptDate)) {
        badge = 'Mañana';
      } else if (isThisWeek(aptDate)) {
        badge = 'Esta semana';
      } else {
        const daysAway = differenceInDays(aptDate, new Date());
        if (daysAway > 0 && daysAway <= 14) {
          badge = `En ${daysAway} días`;
        }
      }

      const existingGroup = groupsMap.get(monthKey);
      if (existingGroup) {
        existingGroup.appointments.push(apt);
        if (!existingGroup.badge && badge) {
          existingGroup.badge = badge;
        } else if (existingGroup.badge !== 'Hoy' && badge === 'Hoy') {
          existingGroup.badge = badge;
        }
      } else {
        groupsMap.set(monthKey, {
          key: monthKey,
          title: monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1),
          badge: badge,
          appointments: [apt]
        });
      }
    });

    return Array.from(groupsMap.values());
  }, [upcomingAppointments]);

  return (
    <div className="w-full bg-transparent">
      {groupedAppointments.length > 0 ? (
        <div className="flex flex-col gap-6">
          {groupedAppointments.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              {/* iOS Section Header */}
              <div className="flex items-center justify-between px-2">
                <h3 className="font-display font-bold text-xs uppercase tracking-[0.14em] text-[#86868B]">
                  {group.title}
                </h3>
                {group.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/[0.04] dark:bg-white/[0.08] text-foreground px-2.5 py-0.5 rounded-full border border-white/40 dark:border-white/10">
                    {group.badge}
                  </span>
                )}
              </div>

              {/* Glass List Container */}
              <div className="material-thin dark:bg-[#1E1E1E]/60 rounded-[24px] divide-y divide-black/[0.04] dark:divide-white/[0.06] overflow-hidden">
                {group.appointments.map((apt) => {
                  const service = services.find((s) => s.id === apt.serviceId) || {
                    id: apt.serviceId,
                    name: apt.notes?.split('•')?.find(n => n.includes('Servicio:'))?.replace('Servicio:', '').trim() || 'Servicio Personalizado',
                    price: 450,
                    duration: 60,
                    category: 'Manicura y Uñas',
                    isActive: true,
                  };
                  const aptDate = parseLocalDate(apt.date);
                  const isConfirmed = apt.status === 'confirmed';

                  return (
                    <div
                      key={apt.id}
                      className="p-5 sm:p-6 hover:bg-white/50 dark:hover:bg-white/[0.04] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Left: Capsule & Info */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {/* Compact Date Capsule */}
                        <div
                          className={cn(
                            "w-[56px] py-2 rounded-2xl flex flex-col items-center justify-center shrink-0 border text-center shadow-xs",
                            isConfirmed
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "bg-black/[0.04] dark:bg-white/[0.06] border-white/30 dark:border-white/10 text-foreground"
                          )}
                        >
                          <span className="text-[10px] font-extrabold uppercase tracking-wider leading-none">
                            {format(aptDate, 'EEE', { locale: es })}
                          </span>
                          <span className="text-xl font-display font-black leading-none mt-1.5">
                            {format(aptDate, 'd')}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-[#1D1D1F] dark:text-white truncate">
                              {service?.name || 'Tratamiento'}
                            </h4>
                            <span className="text-xs font-extrabold text-primary shrink-0">
                              ${service?.price} MXN
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-[#86868B] flex-wrap font-medium">
                            <span className="inline-flex items-center gap-1 text-[#1D1D1F] dark:text-white font-semibold">
                              <Clock className="size-3.5 text-primary shrink-0" />
                              <span>{apt.startTime} - {apt.endTime}</span>
                            </span>
                            <span>•</span>
                            <span>{service?.duration || 60} min</span>
                            <span>•</span>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
                                isConfirmed
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                              )}
                            >
                              <span className={cn("size-1.5 rounded-full", isConfirmed ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                              {isConfirmed ? 'Confirmada' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.04] dark:border-white/[0.06]">
                        <a
                          href={generateGoogleCalendarLink(apt)}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[44px] h-11 px-4 rounded-full border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.1] text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <CalendarPlus className="size-3.5 text-primary" />
                          <span>Google Cal</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => onSelectCancelApt(apt)}
                          className="min-h-[44px] h-11 px-4 rounded-full border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/[0.06] hover:bg-rose-500/10 text-foreground hover:text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Glass Empty State */
        <div className="material-thin dark:bg-[#1E1E1E]/60 rounded-[28px] py-16 px-6 text-center space-y-4">
          <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
            <Calendar className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-lg text-[#1D1D1F] dark:text-white">
              No tienes citas próximas
            </h4>
            <p className="text-sm text-[#86868B] max-w-sm mx-auto leading-relaxed">
              Elige el día y tratamiento ideal para consentirte en nuestro estudio.
            </p>
          </div>
          <Button
            onClick={onOpenAgendarModal}
            className="min-h-[44px] h-12 px-6 rounded-full bg-primary hover:brightness-105 text-white font-bold text-sm shadow-[0_8px_20px_rgba(224,82,134,0.25)] flex items-center gap-2 mx-auto cursor-pointer active:scale-[0.97]"
          >
            <Plus className="size-4 stroke-[2.4]" />
            <span>Agendar Cita Ahora</span>
          </Button>
        </div>
      )}
    </div>
  );
}
