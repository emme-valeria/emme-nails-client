import React from 'react';
import { useChatStore } from '../../state/useChatStore';
import { useApp } from '@/app/AppContext';
import { STAFF_MEMBERS } from '@/features/staff';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { 
  Calendar, Clock, User, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, 
  RotateCcw, Check
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@emme/ui/lib/utils';

interface AppointmentBookingFlowChatWidgetProps {
  onCompleteBooking: (bookingSummary: {
    serviceName: string;
    serviceId: string;
    staffName: string;
    dateStr: string;
    timeStr: string;
    price: number;
  }) => void;
}

export function AppointmentBookingFlowChatWidget({ onCompleteBooking }: AppointmentBookingFlowChatWidgetProps) {
  const { services, addAppointment, clients } = useApp();
  const { 
    reservation, 
    selectService, 
    selectStaff, 
    selectDateTime, 
    setStep, 
    resetReservation 
  } = useChatStore();

  const availableDates = Array.from({ length: 5 }).map((_, i) => addDays(new Date(), i + 1));
  const availableTimes = ['10:00', '11:30', '13:00', '15:00', '16:30', '18:00'];

  const currentStep = Math.min(Math.max(1, reservation.step), 4) as 1 | 2 | 3 | 4;

  const handleFinalConfirm = () => {
    if (!reservation.serviceName || !reservation.dateStr || !reservation.timeStr) return;

    const firstClient = clients[0] || { id: 'c1', name: 'Valeria Arriaza' };
    const price = reservation.totalPrice || 50;

    addAppointment({
      clientId: firstClient.id,
      serviceId: reservation.serviceId || 's1',
      date: reservation.dateStr,
      startTime: reservation.timeStr,
      endTime: reservation.endTimeStr || '12:30',
      status: 'confirmed',
      notes: `Reservado con ${reservation.staffName || 'Especialista Studio'} desde el Asistente AI`
    });

    onCompleteBooking({
      serviceName: reservation.serviceName,
      serviceId: reservation.serviceId || 's1',
      staffName: reservation.staffName || 'Especialista Studio',
      dateStr: reservation.dateStr,
      timeStr: reservation.timeStr,
      price: price
    });
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Reserva Rápida</h4>
            <p className="text-[10.5px] text-[#86868B]">Paso {currentStep} de 4</p>
          </div>
        </div>

        <button 
          onClick={resetReservation}
          className="text-[10.5px] font-semibold text-[#86868B] hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3" /> Reiniciar
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-neutral-100 w-full flex">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* STEP 1: Select Service (Flush List) */}
      {currentStep === 1 && (
        <div className="divide-y divide-black/[0.05] max-h-[280px] overflow-y-auto custom-scrollbar">
          <div className="px-4 py-2 bg-[#FBFBFD] text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
            Selecciona un Tratamiento
          </div>
          {services.slice(0, 6).map((s) => {
            const isSelected = reservation.serviceId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => selectService({ 
                  id: s.id, 
                  name: s.name, 
                  category: s.category, 
                  price: s.price, 
                  duration: s.duration 
                })}
                className={cn(
                  "px-4 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer group",
                  isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs text-[#1D1D1F] group-hover:text-primary transition-colors">{s.name}</p>
                  <p className="text-[11px] text-[#86868B] flex items-center gap-2 mt-0.5">
                    <span>{s.duration} min</span>
                    <span>•</span>
                    <span className="capitalize">{s.category}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-xs text-[#1D1D1F]">${s.price} MXN</span>
                  <ChevronRight className="size-4 text-[#86868B] group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 2: Select Staff (Flush List) */}
      {currentStep === 2 && (
        <div>
          <div className="px-4 py-2 bg-[#FBFBFD] border-b border-black/[0.04] flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
              Especialista para {reservation.serviceName}
            </span>
            <button 
              onClick={() => setStep(1)} 
              className="text-[10.5px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Cambiar
            </button>
          </div>

          <div className="divide-y divide-black/[0.05] max-h-[280px] overflow-y-auto custom-scrollbar">
            {STAFF_MEMBERS.map((staff) => {
              const isSelected = reservation.staffId === staff.id;
              return (
                <div
                  key={staff.id}
                  onClick={() => selectStaff({ 
                    id: staff.id, 
                    name: staff.name, 
                    role: staff.role, 
                    avatar: staff.avatar 
                  })}
                  className={cn(
                    "px-4 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer group",
                    isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-black/[0.06] shrink-0">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-[#1D1D1F] truncate group-hover:text-primary transition-colors">{staff.name}</p>
                      <p className="text-[10.5px] text-[#86868B] truncate">{staff.role}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-[#86868B] group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Date & Time */}
      {currentStep === 3 && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
              Fecha y Horario ({reservation.staffName})
            </span>
            <button 
              onClick={() => setStep(2)} 
              className="text-[10.5px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Cambiar Staff
            </button>
          </div>

          {/* Date row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {availableDates.map((dateObj, idx) => {
              const dateStr = format(dateObj, 'yyyy-MM-dd');
              const isSelected = reservation.dateStr === dateStr;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const time = reservation.timeStr || availableTimes[0];
                    selectDateTime(dateStr, time);
                  }}
                  className={cn(
                    "px-3 py-2 rounded-xl text-center shrink-0 border transition-all text-xs cursor-pointer",
                    isSelected
                      ? "bg-primary text-white border-primary font-bold shadow-xs"
                      : "bg-[#FBFBFD] border-black/[0.05] text-[#1D1D1F] hover:bg-neutral-100"
                  )}
                >
                  <span className="block text-[9px] uppercase opacity-80">{format(dateObj, 'eee', { locale: es })}</span>
                  <span className="block font-bold text-sm">{format(dateObj, 'd')}</span>
                </button>
              );
            })}
          </div>

          {/* Times grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {availableTimes.map((time) => {
              const isSelected = reservation.timeStr === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    const targetDate = reservation.dateStr || format(availableDates[0], 'yyyy-MM-dd');
                    selectDateTime(targetDate, time);
                  }}
                  className={cn(
                    "py-2 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer",
                    isSelected
                      ? "bg-primary text-white border-primary font-bold shadow-xs"
                      : "bg-[#FBFBFD] border-black/[0.05] text-[#1D1D1F] hover:bg-neutral-100"
                  )}
                >
                  {time} hrs
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Review & Confirm */}
      {currentStep === 4 && (
        <div className="p-4 space-y-3">
          <div className="divide-y divide-black/[0.05] text-xs">
            <div className="py-2 flex justify-between">
              <span className="text-[#86868B]">Tratamiento:</span>
              <span className="font-semibold text-[#1D1D1F]">{reservation.serviceName}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-[#86868B]">Especialista:</span>
              <span className="font-semibold text-[#1D1D1F]">{reservation.staffName}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-[#86868B]">Fecha & Hora:</span>
              <span className="font-semibold text-[#1D1D1F]">{reservation.dateStr} a las {reservation.timeStr} hrs</span>
            </div>
            <div className="py-2 flex justify-between items-center font-bold">
              <span className="text-[#1D1D1F]">Total a pagar:</span>
              <span className="text-base text-primary font-bold">${reservation.totalPrice} MXN</span>
            </div>
          </div>

          <Button
            onClick={handleFinalConfirm}
            className="w-full h-11 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="size-4" />
            <span>Confirmar Cita</span>
          </Button>
        </div>
      )}
    </div>
  );
}
