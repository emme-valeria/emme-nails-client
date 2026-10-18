import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, Clock, UserCheck, Check, 
  Star, ChevronRight, ChevronLeft, Sparkles, AlertCircle
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { triggerSelectionVibration, triggerHapticFeedback } from '@/shared/utils/haptics';

export interface StaffOption {
  id: string;
  name: string;
  role: string;
  rating?: string;
  specialty?: string;
  scheduleDescription?: string;
  avatar: string;
}

export const SALON_STAFF: StaffOption[] = [
  { 
    id: 'staff-1', 
    name: 'Valeria R.', 
    role: 'Master Nail Artist', 
    rating: '5.0', 
    specialty: 'Acrílico & Manicura Rusa',
    scheduleDescription: 'Mañanas y mediodía',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'staff-2', 
    name: 'Sofía M.', 
    role: 'Senior Gel-X & Chrome', 
    rating: '4.9', 
    specialty: 'Glazed, Chrome & 3D Art',
    scheduleDescription: 'Tardes y horario extendido',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'staff-3', 
    name: 'Camila K.', 
    role: 'Senior Escultural', 
    rating: '4.9', 
    specialty: 'Estructura & Foil Art',
    scheduleDescription: 'Mediodía y fin de semana',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' 
  },
];

export interface SlotAvailabilityItem {
  time: string;
  status: 'available' | 'last_spot' | 'popular' | 'booked';
  badge?: string;
  period: 'morning' | 'afternoon';
}

/**
 * Deterministic schedule simulation based on artist and date in Mexico
 */
export function getArtistDynamicSchedule(staffId: string, dateIso: string): SlotAvailabilityItem[] {
  const dateObj = new Date(dateIso + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();
  const dayNum = dateObj.getDate();

  if (staffId === 'staff-1') {
    return [
      { time: '09:30 AM', period: 'morning', status: 'available', badge: 'Disponible' },
      { time: '11:00 AM', period: 'morning', status: 'popular', badge: 'Popular' },
      { time: '01:00 PM', period: 'afternoon', status: dayOfWeek >= 4 ? 'last_spot' : 'available', badge: dayOfWeek >= 4 ? 'Último cupo' : 'Disponible' },
      { time: '02:30 PM', period: 'afternoon', status: dayNum % 3 === 0 ? 'booked' : 'available', badge: dayNum % 3 === 0 ? 'Agotado' : 'Disponible' },
      { time: '04:30 PM', period: 'afternoon', status: 'available', badge: 'Disponible' },
      { time: '06:00 PM', period: 'afternoon', status: dayOfWeek === 6 ? 'booked' : 'available', badge: dayOfWeek === 6 ? 'Agotado' : 'Disponible' },
    ];
  } else if (staffId === 'staff-2') {
    return [
      { time: '10:30 AM', period: 'morning', status: 'available', badge: 'Disponible' },
      { time: '12:00 PM', period: 'morning', status: dayNum % 4 === 0 ? 'last_spot' : 'available', badge: dayNum % 4 === 0 ? 'Último cupo' : 'Disponible' },
      { time: '02:00 PM', period: 'afternoon', status: 'available', badge: 'Disponible' },
      { time: '03:30 PM', period: 'afternoon', status: 'popular', badge: 'Popular' },
      { time: '05:30 PM', period: 'afternoon', status: 'available', badge: 'Disponible' },
      { time: '07:00 PM', period: 'afternoon', status: dayOfWeek >= 5 ? 'last_spot' : 'available', badge: dayOfWeek >= 5 ? 'Último cupo' : 'Disponible' },
    ];
  } else {
    return [
      { time: '10:00 AM', period: 'morning', status: 'available', badge: 'Disponible' },
      { time: '11:30 AM', period: 'morning', status: dayNum % 2 === 0 ? 'last_spot' : 'available', badge: dayNum % 2 === 0 ? 'Último cupo' : 'Disponible' },
      { time: '01:30 PM', period: 'afternoon', status: 'popular', badge: 'Popular' },
      { time: '03:00 PM', period: 'afternoon', status: 'available', badge: 'Disponible' },
      { time: '04:30 PM', period: 'afternoon', status: dayOfWeek === 0 ? 'booked' : 'available', badge: dayOfWeek === 0 ? 'Agotado' : 'Disponible' },
      { time: '06:30 PM', period: 'afternoon', status: 'available', badge: 'Disponible' },
    ];
  }
}

interface AvailabilitySelectorProps {
  selectedStaffId?: string;
  onSelectStaff: (staff: StaffOption) => void;
  selectedDate?: string;
  onSelectDate: (date: string) => void;
  selectedTimeSlot?: string;
  onSelectTimeSlot: (slot: string) => void;
  className?: string;
}

export function AvailabilitySelector({
  selectedStaffId,
  onSelectStaff,
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  className,
}: AvailabilitySelectorProps) {
  const dateScrollRef = useRef<HTMLDivElement>(null);

  // Generate 14 upcoming booking dates for high booking flexibility
  const today = useMemo(() => new Date(), []);
  const availableDates = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i + 1);
      const isTomorrow = i === 0;
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const iso = d.toISOString().split('T')[0];
      
      return {
        iso,
        dayName: d.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', ''),
        dayNumber: d.getDate(),
        monthName: d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', ''),
        fullDateStr: d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }),
        tag: isTomorrow ? 'Mañana' : isWeekend ? 'Finde' : undefined,
      };
    });
  }, [today]);

  const activeStaff = useMemo(() => {
    return SALON_STAFF.find(s => s.id === selectedStaffId) || SALON_STAFF[0];
  }, [selectedStaffId]);

  const currentDateIso = selectedDate || availableDates[0].iso;
  const activeDateObj = useMemo(() => {
    return availableDates.find(d => d.iso === currentDateIso) || availableDates[0];
  }, [availableDates, currentDateIso]);

  // Dynamic slot matrix for the selected staff and date
  const dynamicSchedule = useMemo(() => {
    return getArtistDynamicSchedule(activeStaff.id, currentDateIso);
  }, [activeStaff.id, currentDateIso]);

  const morningSlots = useMemo(() => dynamicSchedule.filter(s => s.period === 'morning'), [dynamicSchedule]);
  const afternoonSlots = useMemo(() => dynamicSchedule.filter(s => s.period === 'afternoon'), [dynamicSchedule]);
  
  const availableSlotCount = useMemo(() => {
    return dynamicSchedule.filter(s => s.status !== 'booked').length;
  }, [dynamicSchedule]);

  // Find next available date if current date has zero or low spots
  const nextDateWithSpots = useMemo(() => {
    const nextDates = availableDates.filter(d => d.iso > currentDateIso);
    for (const d of nextDates) {
      const slots = getArtistDynamicSchedule(activeStaff.id, d.iso);
      const openCount = slots.filter(s => s.status !== 'booked').length;
      if (openCount >= 4) {
        return { date: d, count: openCount };
      }
    }
    return null;
  }, [availableDates, currentDateIso, activeStaff.id]);

  // Auto-align time slot when changing artist/date if current slot became booked or empty
  useEffect(() => {
    const currentSlotMatch = dynamicSchedule.find(s => s.time === selectedTimeSlot);
    if (!selectedTimeSlot || !currentSlotMatch || currentSlotMatch.status === 'booked') {
      const firstOpen = dynamicSchedule.find(s => s.status !== 'booked');
      if (firstOpen) {
        onSelectTimeSlot(firstOpen.time);
      }
    }
  }, [activeStaff.id, currentDateIso, dynamicSchedule, selectedTimeSlot, onSelectTimeSlot]);

  // Scroll helpers for the date sliding bar
  const scrollDates = (direction: 'left' | 'right') => {
    if (dateScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      dateScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleStaffClick = (staff: StaffOption) => {
    triggerSelectionVibration();
    onSelectStaff(staff);
  };

  const handleDateClick = (iso: string) => {
    triggerSelectionVibration();
    onSelectDate(iso);
  };

  const handleSlotClick = (slot: SlotAvailabilityItem) => {
    if (slot.status === 'booked') return;
    triggerSelectionVibration();
    onSelectTimeSlot(slot.time);
  };

  return (
    <div className={cn("space-y-6 text-left w-full", className)}>
      
      {/* 1. SELECCIÓN DE ESPECIALISTA */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h4 className="text-sm font-medium text-slate-700">1. Elige tu Especialista</h4>
            <p className="text-xs font-normal text-slate-500">Selecciona la artista para tu aplicación</p>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200/60 px-2.5 py-1 rounded-full shadow-xs">
            {activeStaff.name} · <span className="text-amber-500 font-semibold">★ {activeStaff.rating}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SALON_STAFF.map((staff) => {
            const isSelected = activeStaff.id === staff.id;
            return (
              <button
                key={staff.id}
                type="button"
                onClick={() => handleStaffClick(staff)}
                className={cn(
                  "p-3.5 rounded-3xl text-left flex items-center gap-3 transition-all duration-200 cursor-pointer relative select-none active:scale-[0.98]",
                  isSelected
                    ? "border-2 border-primary bg-white shadow-[0_4px_20px_rgba(224,82,134,0.14)] ring-1 ring-primary/20"
                    : "border border-slate-200/70 bg-white/80 backdrop-blur-md hover:bg-white hover:border-slate-300 shadow-lg shadow-pink-500/5"
                )}
              >
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "size-11 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all",
                      isSelected ? "border-primary bg-primary text-white" : "border-slate-200 bg-pink-50 text-primary"
                    )}
                  >
                    {staff.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {staff.name}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-500 flex items-center shrink-0">
                      ★{staff.rating}
                    </span>
                  </div>
                  <p className="text-xs font-normal text-slate-500 truncate">
                    {staff.specialty}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {staff.scheduleDescription}
                  </p>
                </div>

                {isSelected && (
                  <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SELECCIÓN DE DÍA */}
      <div className="space-y-2.5">
        
        {/* Date Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h4 className="text-sm font-medium text-slate-700">2. Selecciona Día</h4>
            <p className="text-xs font-normal text-slate-500 capitalize">
              {activeDateObj.fullDateStr} · <span className="font-semibold text-primary">{availableSlotCount} horarios disponibles</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollDates('left')}
              className="size-8 rounded-full bg-white border border-slate-200/70 hover:border-primary/40 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Días anteriores"
            >
              <ChevronLeft className="size-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={() => scrollDates('right')}
              className="size-8 rounded-full bg-white border border-slate-200/70 hover:border-primary/40 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Más días disponibles"
            >
              <ChevronRight className="size-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Horizontal Sliding Dates Strip with Right Gradient */}
        <div className="relative">
          <div 
            ref={dateScrollRef}
            className="py-1 px-1 overflow-x-auto flex gap-2.5 no-scrollbar snap-x snap-mandatory scroll-smooth pr-8"
          >
            {availableDates.map((d) => {
              const isSelected = currentDateIso === d.iso;
              const spots = getArtistDynamicSchedule(activeStaff.id, d.iso).filter(s => s.status !== 'booked').length;
              const isFull = spots === 0;

              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => handleDateClick(d.iso)}
                  className={cn(
                    "snap-start shrink-0 w-[78px] sm:w-[86px] py-3.5 px-2 rounded-3xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center select-none active:scale-97",
                    isSelected
                      ? "bg-white border-2 border-primary text-slate-900 shadow-[0_4px_20px_rgba(224,82,134,0.16)] ring-1 ring-primary/20 scale-[1.02]"
                      : "bg-white/80 backdrop-blur-md border border-slate-200/70 text-slate-700 hover:border-slate-300 shadow-lg shadow-pink-500/5 hover:bg-white"
                  )}
                >
                  {/* Badge Tag */}
                  {d.tag ? (
                    <span className={cn(
                      "text-[9px] font-semibold uppercase tracking-tight px-2 py-0.5 rounded-full mb-1 leading-none",
                      isSelected ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                    )}>
                      {d.tag}
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold uppercase tracking-tight opacity-0 mb-1 leading-none">
                      •
                    </span>
                  )}

                  <span className={cn(
                    "text-[10px] uppercase font-semibold tracking-wider block",
                    isSelected ? "text-primary" : "text-slate-400"
                  )}>
                    {d.dayName}
                  </span>

                  <span className={cn(
                    "text-xl font-display font-semibold block my-0.5 leading-tight",
                    isSelected ? "text-slate-900" : "text-slate-800"
                  )}>
                    {d.dayNumber}
                  </span>

                  <span className={cn(
                    "text-[10px] capitalize font-medium block",
                    isSelected ? "text-slate-600" : "text-slate-400"
                  )}>
                    {d.monthName}
                  </span>

                  {/* Spot count indicator dot */}
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className={cn(
                      "size-1.5 rounded-full",
                      isSelected 
                        ? "bg-primary" 
                        : isFull 
                        ? "bg-slate-300" 
                        : spots <= 2 
                        ? "bg-amber-400" 
                        : "bg-emerald-500"
                    )} />
                    <span className={cn(
                      "text-[9px] font-medium leading-none",
                      isSelected ? "text-slate-700 font-semibold" : "text-slate-400"
                    )}>
                      {isFull ? 'Lleno' : `${spots} cupos`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Gradient Fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent" />
        </div>

      </div>

      {/* 3. SELECCIÓN DE HORARIOS */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h4 className="text-sm font-medium text-slate-700">3. Elige el Horario</h4>
            <p className="text-xs font-normal text-slate-500">Selecciona el turno que mejor se adapte a tu agenda</p>
          </div>
          {selectedTimeSlot && (
            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shadow-2xs">
              Turno: {selectedTimeSlot}
            </span>
          )}
        </div>

        {/* Morning Slots */}
        <div className="space-y-2">
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Mañana & Mediodía
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {morningSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.time;
              const isBooked = slot.status === 'booked';
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={isBooked}
                  onClick={() => handleSlotClick(slot)}
                  className={cn(
                    "py-2.5 px-3 rounded-full text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[44px] select-none active:scale-97",
                    isBooked
                      ? "bg-slate-50 border border-slate-100 text-slate-300 line-through cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-white border-2 border-primary text-primary font-semibold shadow-[0_2px_10px_rgba(224,82,134,0.18)]"
                      : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  )}
                >
                  <span className="text-xs font-semibold leading-tight">{slot.time}</span>
                  {slot.badge && !isBooked && (
                    <span className={cn(
                      "text-[8.5px] mt-0.5 truncate max-w-[75px] font-medium",
                      isSelected ? "text-primary" : "text-slate-400"
                    )}>
                      {slot.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Afternoon Slots */}
        <div className="space-y-2">
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tarde & Horario Estelar
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {afternoonSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.time;
              const isBooked = slot.status === 'booked';
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={isBooked}
                  onClick={() => handleSlotClick(slot)}
                  className={cn(
                    "py-2.5 px-3 rounded-full text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[44px] select-none active:scale-97",
                    isBooked
                      ? "bg-slate-50 border border-slate-100 text-slate-300 line-through cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-white border-2 border-primary text-primary font-semibold shadow-[0_2px_10px_rgba(224,82,134,0.18)]"
                      : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  )}
                >
                  <span className="text-xs font-semibold leading-tight">{slot.time}</span>
                  {slot.badge && !isBooked && (
                    <span className={cn(
                      "text-[8.5px] mt-0.5 truncate max-w-[75px] font-medium",
                      isSelected ? "text-primary" : "text-slate-400"
                    )}>
                      {slot.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Alternative Day Suggestion */}
        {nextDateWithSpots && availableSlotCount <= 3 && (
          <div className="p-3 rounded-3xl bg-amber-50/70 border border-amber-200/80 backdrop-blur-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="size-4 shrink-0 text-amber-600" />
              <span className="text-xs font-normal">
                ¿Buscas más horarios? <strong>{nextDateWithSpots.date.dayName} {nextDateWithSpots.date.dayNumber} {nextDateWithSpots.date.monthName}</strong> tiene {nextDateWithSpots.count} cupos libres
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleDateClick(nextDateWithSpots.date.iso)}
              className="text-xs font-semibold text-amber-900 underline hover:no-underline shrink-0 ml-2 cursor-pointer"
            >
              Ver día →
            </button>
          </div>
        )}

      </div>

      {/* 4. FLOATING SUMMARY CAPSULE CARD */}
      <div className="p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-lg shadow-pink-500/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-4 stroke-[2]" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-900 truncate">
              Cita con {activeStaff.name}
            </p>
            <p className="text-[11px] font-normal text-slate-500 capitalize truncate">
              {activeDateObj.dayName} {activeDateObj.dayNumber} {activeDateObj.monthName} · <strong className="text-primary font-semibold">{selectedTimeSlot || 'Elige tu turno'}</strong>
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full shrink-0">
          Garantía de Tiempo
        </span>
      </div>

    </div>
  );
}

export default AvailabilitySelector;
