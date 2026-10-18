import React, { useMemo, useState } from 'react';
import { Clock, History, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseLocalDate, cn } from '@emme/ui/lib/utils';
import type { Appointment, Service } from '@/app/AppContext';

interface PastAppointmentsHistoryProps {
  pastAppointments: Appointment[];
  services: Service[];
}

type FilterType = 'all' | 'completed' | 'cancelled';
const INITIAL_DISPLAY_COUNT = 5;

export function PastAppointmentsHistory({ pastAppointments, services }: PastAppointmentsHistoryProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  // Group by Month
  const groupedPast = useMemo(() => {
    let filtered = pastAppointments;
    if (filterType !== 'all') {
      filtered = pastAppointments.filter(apt => apt.status === filterType);
    }
    
    const limited = filtered.slice(0, displayCount);
    const groupsMap = new Map<string, { title: string; appointments: Appointment[] }>();

    limited.forEach((apt) => {
      const aptDate = parseLocalDate(apt.date);
      const monthKey = format(aptDate, 'yyyy-MM');
      const monthTitle = format(aptDate, "MMMM yyyy", { locale: es });

      const existingGroup = groupsMap.get(monthKey);
      if (existingGroup) {
        existingGroup.appointments.push(apt);
      } else {
        groupsMap.set(monthKey, {
          title: monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1),
          appointments: [apt]
        });
      }
    });

    return Array.from(groupsMap.values());
  }, [pastAppointments, filterType, displayCount]);

  const totalFilteredCount = pastAppointments.filter(
    apt => filterType === 'all' || apt.status === filterType
  ).length;

  return (
    <div className="w-full bg-white pb-8">
      {/* Edge-to-Edge Filter Controls */}
      <div className="sticky top-0 z-10 bg-white border-b border-black/[0.05] px-5 py-3">
        <div className="flex bg-[#F5F5F7] p-1 rounded-xl w-full">
          {(['all', 'completed', 'cancelled'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setFilterType(type);
                setDisplayCount(INITIAL_DISPLAY_COUNT);
              }}
              className={cn(
                "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center capitalize cursor-pointer",
                filterType === type
                  ? "bg-white text-[#1D1D1F] font-bold shadow-xs"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              )}
            >
              {type === 'all' ? 'Todas' : type === 'completed' ? 'Completadas' : 'Canceladas'}
            </button>
          ))}
        </div>
      </div>

      {groupedPast.length > 0 ? (
        <div className="flex flex-col">
          {groupedPast.map((group) => (
            <div key={group.title} className="flex flex-col">
              {/* Sticky Month Header */}
              <div className="bg-[#FBFBFD] border-y border-black/[0.04] px-5 py-2">
                <h3 className="font-display font-bold text-xs text-[#86868B] tracking-wide uppercase">
                  {group.title}
                </h3>
              </div>

              {/* Flush History Rows */}
              <div className="divide-y divide-black/[0.05]">
                {group.appointments.map((apt) => {
                  const service = services.find((s) => s.id === apt.serviceId) || {
                    id: apt.serviceId,
                    name: apt.notes?.split('•')?.find(n => n.includes('Servicio:'))?.replace('Servicio:', '').trim() || 'Servicio de Belleza',
                    price: 380,
                    duration: 45,
                    category: 'Manicura y Uñas',
                    isActive: true,
                  };
                  const aptDate = parseLocalDate(apt.date);
                  const isCompleted = apt.status === 'completed';

                  return (
                    <div
                      key={apt.id}
                      className="p-4 sm:p-5 hover:bg-[#F8F8FA] transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Compact Date Capsule */}
                        <div className="w-11 py-1.5 rounded-xl bg-neutral-100/80 border border-black/[0.04] flex flex-col items-center justify-center shrink-0 text-center">
                          <span className="text-[9px] font-bold uppercase tracking-wider leading-none text-[#86868B]">
                            {format(aptDate, 'EEE', { locale: es })}
                          </span>
                          <span className="text-base font-display font-bold leading-none mt-1 text-[#1D1D1F]">
                            {format(aptDate, 'd')}
                          </span>
                        </div>

                        {/* Text info */}
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#1D1D1F] truncate group-hover:text-primary transition-colors">
                            {service?.name || 'Tratamiento'}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-[#86868B]">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="size-3 text-primary" />
                              <span>{apt.startTime}</span>
                            </span>
                            <span>•</span>
                            <span>${service?.price} MXN</span>
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                            <span>Completada</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                            <XCircle className="size-3.5 text-rose-600" />
                            <span>Cancelada</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Show More Button */}
          {displayCount < totalFilteredCount && (
            <div className="p-4 border-t border-black/[0.05] text-center">
              <button
                type="button"
                onClick={() => setDisplayCount(prev => prev + 5)}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Cargar más citas anteriores...
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center space-y-3">
          <div className="size-12 rounded-full bg-neutral-100 text-[#86868B] flex items-center justify-center mx-auto">
            <History className="size-5 opacity-60" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-display font-bold text-base text-[#1D1D1F]">
              Sin historial registrado
            </h4>
            <p className="text-xs text-[#86868B] max-w-xs mx-auto">
              No tienes citas pasadas en esta categoría.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
