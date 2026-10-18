import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, CalendarCheck, CheckCircle2, Clock, ShieldCheck, User } from 'lucide-react';
import { format, nextSaturday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useApp, type Appointment, type Service } from '@/app/AppContext';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';
import { PriceTag } from '@/shared/components/PriceTag';

interface RepeatAppointmentWidgetProps {
  completedAppointments?: Appointment[];
  services?: Service[];
  className?: string;
}

export function RepeatAppointmentWidget({
  completedAppointments = [],
  services = [],
  className
}: RepeatAppointmentWidgetProps) {
  const navigate = useNavigate();
  const { addAppointment, services: allServices } = useApp();
  const [isSuccessBooked, setIsSuccessBooked] = useState(false);
  
  const activeServicesList = services.length > 0 ? services : allServices;
  const recentValidAppointments = completedAppointments.filter(Boolean);
  
  const targetSaturday = nextSaturday(new Date());
  const formattedSaturday = format(targetSaturday, "EEEE d 'de' MMMM", { locale: es });
  const targetTime = '11:00';

  const activeService = activeServicesList.find(s => s.id === recentValidAppointments[0]?.serviceId) 
    || activeServicesList[0] 
    || { id: 's-default', name: 'Manicura Semipermanente', price: 420, duration: 55 };

  const handleInstantRebook = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const dateStr = format(targetSaturday, 'yyyy-MM-dd');
    addAppointment({
      clientId: '1',
      serviceId: activeService.id,
      date: dateStr,
      startTime: targetTime,
      endTime: '12:00',
      status: 'confirmed',
      notes: `1-Tap Rebook: ${activeService.name}`
    });
    setIsSuccessBooked(true);
    toast.success(`¡Cita agendada para el ${formattedSaturday} a las ${targetTime} AM!`);
  };

  return (
    <div className={cn("w-full liquid-glass rounded-[28px] overflow-hidden", className)}>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw className="size-4 text-primary" />
          <h3 className="text-[11px] font-bold text-[#86868B] uppercase tracking-[0.14em]">
            Repetir Sesión Habitual
          </h3>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-display font-bold text-[#1D1D1F] tracking-tight leading-tight truncate">
              {activeService.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="size-3 text-primary" />
                1-TAP RESERVA
              </span>
            </div>
            
            <div className="mt-3 space-y-1.5 text-xs text-[#1D1D1F]">
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-[#86868B] shrink-0" />
                <span className="font-medium capitalize">{formattedSaturday} · {targetTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="size-3.5 text-[#86868B] shrink-0" />
                <span className="font-medium">Especialista ({activeService.duration} min)</span>
              </div>
            </div>
          </div>
          <PriceTag price={activeService.price} size="lg" />
        </div>
      </div>

      {/* Edge-to-Edge Action Bar */}
      <div className="flex flex-row border-t border-black/[0.05] divide-x divide-black/[0.05] bg-[#FBFBFD]">
        <button
          type="button"
          onClick={() => navigate(`/book/service?serviceId=${activeService.id}`)}
          className="flex-1 py-3 text-xs font-bold text-[#1D1D1F] hover:bg-neutral-100/60 active:bg-neutral-200/50 transition-colors cursor-pointer"
        >
          Personalizar
        </button>
        <button
          type="button"
          onClick={handleInstantRebook}
          disabled={isSuccessBooked}
          className={cn(
            "flex-[2] py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer",
            isSuccessBooked 
              ? "text-emerald-700 bg-emerald-50"
              : "text-primary hover:bg-primary/5 active:bg-primary/10"
          )}
        >
          {isSuccessBooked ? (
            <>
              <CheckCircle2 className="size-4" />
              <span>¡Cita Agendada!</span>
            </>
          ) : (
            <>
              <CalendarCheck className="size-4" />
              <span>Agendar {targetTime}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
