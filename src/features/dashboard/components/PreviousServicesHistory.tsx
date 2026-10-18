import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@emme/ui/button';
import { 
  Calendar, RotateCcw, History, Clock, CheckCircle2, 
  XCircle, ArrowUpRight, ChevronDown 
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseLocalDate, cn } from '@emme/ui/lib/utils';
import type { Appointment, Service } from '@/app/AppContext';

interface PreviousServicesHistoryProps {
  completedAppointments?: Appointment[];
  pastAppointments?: Appointment[];
  services: Service[];
  showFilters?: boolean;
  limit?: number;
}

interface MonthGroup {
  key: string;
  title: string;
  appointments: Appointment[];
}

export function PreviousServicesHistory({
  completedAppointments = [],
  pastAppointments,
  services,
  showFilters = false,
  limit,
}: PreviousServicesHistoryProps) {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [displayCount, setDisplayCount] = useState<number>(limit || 10);

  // Fallback to completedAppointments if pastAppointments is not explicitly provided
  const rawList = pastAppointments && pastAppointments.length > 0 
    ? pastAppointments 
    : completedAppointments;

  // Filter appointments according to status
  const filteredAppointments = useMemo(() => {
    if (filterType === 'all') return rawList;
    return rawList.filter((apt) => apt.status === filterType);
  }, [rawList, filterType]);

  // Progressive list of appointments to render
  const visibleAppointments = useMemo(() => {
    if (limit && !showFilters) {
      return filteredAppointments.slice(0, limit);
    }
    return filteredAppointments.slice(0, displayCount);
  }, [filteredAppointments, displayCount, limit, showFilters]);

  const hasMore = !limit && visibleAppointments.length < filteredAppointments.length;
  const remainingCount = filteredAppointments.length - visibleAppointments.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  // Group visible appointments by Month & Year for clear chronological hierarchy
  const groupedPastAppointments = useMemo<MonthGroup[]>(() => {
    if (visibleAppointments.length === 0) return [];

    const groupsMap = new Map<string, { title: string; appointments: Appointment[] }>();

    visibleAppointments.forEach((apt) => {
      const aptDate = parseLocalDate(apt.date);
      const monthKey = format(aptDate, 'yyyy-MM');
      const monthTitle = format(aptDate, "MMMM 'de' yyyy", { locale: es });

      if (!groupsMap.has(monthKey)) {
        groupsMap.set(monthKey, {
          title: monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1),
          appointments: [apt],
        });
      } else {
        groupsMap.get(monthKey)!.appointments.push(apt);
      }
    });

    return Array.from(groupsMap.entries()).map(([key, data]) => ({
      key,
      title: data.title,
      appointments: data.appointments,
    }));
  }, [visibleAppointments]);

  return (
    <div className="space-y-4">
      {/* Optional Filters when in full Historial view */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-[#1D1D1F] flex items-center gap-2">
              <History className="size-4.5 sm:size-5 text-primary shrink-0" />
              <span>Historial de Sesiones Pasadas</span>
            </h3>
            <p className="text-xs text-[#86868B]">
              Registro de citas finalizadas y atenciones anteriores
            </p>
          </div>

          {/* Quick Filter Segment Pills */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1 p-1 rounded-2xl bg-neutral-100/90 border border-black/[0.04] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setFilterType('all');
                setDisplayCount(10);
              }}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center truncate",
                filterType === 'all'
                  ? "bg-primary text-white shadow-2xs"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              )}
            >
              Todas ({rawList.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterType('completed');
                setDisplayCount(10);
              }}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center truncate",
                filterType === 'completed'
                  ? "bg-primary text-white shadow-2xs"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              )}
            >
              Completadas
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterType('cancelled');
                setDisplayCount(10);
              }}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center truncate",
                filterType === 'cancelled'
                  ? "bg-primary text-white shadow-2xs"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              )}
            >
              Canceladas
            </button>
          </div>
        </div>
      )}

      {/* Grouped Month Sections */}
      {groupedPastAppointments.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {groupedPastAppointments.map((group) => (
            <div key={group.key} className="space-y-2">
              {/* Group Month Label & Count */}
              <div className="flex items-center justify-between px-2">
                <span className="text-xs sm:text-sm font-display font-bold text-[#1D1D1F] tracking-tight">
                  {group.title}
                </span>
                <span className="text-[11px] font-semibold text-[#86868B]">
                  {group.appointments.length} {group.appointments.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>

              {/* Group Container with liquid glass and hairline dividers */}
              <div className="liquid-glass rounded-2xl sm:rounded-3xl overflow-hidden divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {group.appointments.map((apt) => {
                  const service = services.find((s) => s.id === apt.serviceId);
                  const aptDate = parseLocalDate(apt.date);
                  const isCompleted = apt.status === 'completed';

                  return (
                    <div
                      key={apt.id}
                      className="p-3 sm:p-4 hover:brightness-105/[0.015] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group w-full"
                    >
                      {/* Left: Date Capsule & Details */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        {/* Compact Date Capsule */}
                        <div
                          className={cn(
                            "w-11 sm:w-13 py-1.5 sm:py-2 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-all text-center",
                            isCompleted
                              ? "bg-primary/[0.04] border-primary/15 text-[#1D1D1F]"
                              : "bg-neutral-100/70 border-black/[0.05] text-[#86868B]"
                          )}
                        >
                          <span
                            className={cn(
                              "text-[8.5px] sm:text-[9px] font-extrabold uppercase tracking-wider leading-none",
                              isCompleted ? "text-primary" : "text-[#86868B]"
                            )}
                          >
                            {format(aptDate, 'MMM', { locale: es })}
                          </span>
                          <span className="text-sm sm:text-base font-display font-black leading-none mt-1 text-[#1D1D1F]">
                            {format(aptDate, 'd')}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h5 className="font-display font-bold text-xs sm:text-sm md:text-base text-[#1D1D1F] truncate group-hover:text-primary transition-colors">
                              {service?.name || 'Tratamiento de Manicura'}
                            </h5>

                            <span
                              className={cn(
                                "text-[8.5px] sm:text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0",
                                isCompleted
                                  ? "bg-neutral-100/80 border-black/[0.06] text-[#444446]"
                                  : "bg-rose-50/70 border-rose-200/50 text-rose-700"
                              )}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 className="size-2.5 text-primary" />
                                  <span>Completada</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="size-2.5 text-rose-500" />
                                  <span>Cancelada</span>
                                </>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#86868B] font-medium flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[#1D1D1F]">
                              <Clock className="size-3 text-primary shrink-0" />
                              <span>{apt.startTime} hrs</span>
                            </span>
                            {service?.duration && (
                              <>
                                <span className="text-black/20">•</span>
                                <span>{service.duration} min</span>
                              </>
                            )}
                            {service?.price && (
                              <>
                                <span className="text-black/20">•</span>
                                <span className="font-bold text-[#1D1D1F]">
                                  ${service.price} MXN
                                </span>
                              </>
                            )}
                          </div>

                          {apt.notes && (
                            <p className="text-[10px] sm:text-[11px] text-[#86868B] italic truncate pt-0.5">
                              "{apt.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions: Right-aligned on desktop/tablet, balanced on mobile */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-stretch sm:self-center justify-end pt-1.5 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
                        {isCompleted && (
                          <Button
                            type="button"
                            onClick={() => navigate(`/agenda?add=true&serviceId=${apt.serviceId}`)}
                            size="sm"
                            className="flex-1 sm:flex-none min-h-[36px] sm:min-h-[38px] h-8 sm:h-9 px-3.5 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                            title="Volver a agendar este tratamiento"
                          >
                            <RotateCcw className="size-3" />
                            <span>Repetir</span>
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={() => navigate(`/services`)}
                          size="sm"
                          variant="outline"
                          className="flex-1 sm:flex-none min-h-[36px] sm:min-h-[38px] h-8 sm:h-9 px-3 rounded-xl border-black/10 text-[#1D1D1F] hover:bg-neutral-50 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <span>Ficha</span>
                          <ArrowUpRight className="size-3 text-[#86868B]" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-2 flex justify-center">
              <Button
                type="button"
                onClick={handleLoadMore}
                variant="outline"
                className="h-10 px-5 rounded-2xl border-black/10 hover:bg-white text-xs font-bold text-[#1D1D1F] flex items-center gap-2 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <span>Mostrar más citas ({remainingCount} restantes)</span>
                <ChevronDown className="size-4 text-primary" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-md border border-black/[0.05] text-center space-y-3">
          <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-[#86868B]">
            <Calendar className="size-5 opacity-50" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1D1D1F]">Sin citas en el historial</h4>
            <p className="text-xs text-[#86868B] mt-0.5">
              Tus atenciones completadas se organizarán aquí automáticamente por mes.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/agenda?add=true')}
            size="sm"
            className="h-8 px-4 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs cursor-pointer shadow-2xs active:scale-95"
          >
            Agendar Nueva Cita
          </Button>
        </div>
      )}
    </div>
  );
}

