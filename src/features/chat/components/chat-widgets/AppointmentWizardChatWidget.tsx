import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, Service } from '@/app/AppContext';
import { STAFF_MEMBERS, StaffMember } from '@/features/staff';
import { useChatStore } from '../../state/useChatStore';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { 
  Wand2, Calendar, Clock, User, CheckCircle2, ChevronRight, ChevronLeft, 
  RotateCcw, DollarSign, Award, ShieldCheck, Sun, Gem, Layers, Sparkles, Check, ArrowRight, Leaf, Star
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';

interface AddOnOption {
  id: string;
  name: string;
  price: number;
  duration: number;
  badge?: string;
  icon: React.ElementType;
}

const ADD_ON_OPTIONS: AddOnOption[] = [
  { id: 'addon-1', name: 'Efecto Chrome Glazed Mirror', price: 15, duration: 15, badge: 'Tendencia', icon: Sun },
  { id: 'addon-2', name: 'Cristales Swarovski (x4)', price: 12, duration: 10, badge: 'Top', icon: Gem },
  { id: 'addon-3', name: 'Refuerzo de Keratina & Spa', price: 10, duration: 10, badge: 'Cuidado', icon: Leaf },
  { id: 'addon-4', name: 'Exfoliación Orgánica Spa', price: 15, duration: 15, badge: 'Relax', icon: Sparkles },
];

interface AppointmentWizardChatWidgetProps {
  onCompleteBooking: (summary: {
    serviceName: string;
    staffName: string;
    dateStr: string;
    timeStr: string;
    totalPrice: number;
    depositAmount: number;
    addOnsCount: number;
  }) => void;
  onProceedToDeposit?: (summary: {
    serviceName: string;
    staffName: string;
    dateStr: string;
    timeStr: string;
    totalPrice: number;
    depositAmount: number;
  }) => void;
}

export function AppointmentWizardChatWidget({
  onCompleteBooking,
  onProceedToDeposit
}: AppointmentWizardChatWidgetProps) {
  const { services, clients, addAppointment } = useApp();
  const { 
    reservation, 
    selectService, 
    selectStaff, 
    selectDateTime, 
    toggleAddOn: storeToggleAddOn,
    applyLoyaltyPoints: storeApplyLoyaltyPoints,
    removeDiscounts: storeRemoveDiscounts,
    resetReservation 
  } = useChatStore();

  const currentClient = clients[0] || { id: 'c1', name: 'Valeria Arriaza' };

  // Wizard steps: 1 (Tratamiento), 2 (Especialista + Día/Hora Slider), 3 (Extras), 4 (Resumen)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const changeStep = (newStep: 1 | 2 | 3 | 4) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const initialService = services.find(s => s.id === reservation.serviceId) || services[1] || services[0];
  const [selectedService, setSelectedService] = useState<Service | null>(initialService || null);
  const initialStaff = STAFF_MEMBERS.find(st => st.id === reservation.staffId) || STAFF_MEMBERS[0];
  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(initialStaff);
  const [selectedDate, setSelectedDate] = useState<string>(reservation.dateStr || format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string>(reservation.timeStr || '11:00');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(reservation.selectedAddOns.map(a => a.id));
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(reservation.appliedLoyaltyPoints > 0);

  const availableDates = useMemo(() => Array.from({ length: 8 }).map((_, i) => addDays(new Date(), i + 1)), []);
  const morningTimes = ['09:30', '10:45', '12:00'];
  const afternoonTimes = ['13:30', '15:00', '16:30', '18:00'];

  const categories = useMemo(() => Array.from(new Set(services.map(s => s.category))), [services]);
  const [activeCategory, setActiveCategory] = useState<string>('Top');

  const filteredServices = useMemo(() => {
    if (activeCategory === 'Top') {
      const popular = services.filter(s => s.isPopular || ['srv-1', 'srv-2', 'srv-3', 'srv-4'].includes(s.id));
      return popular.length > 0 ? popular.slice(0, 4) : services.slice(0, 4);
    }
    return services.filter(s => s.category === activeCategory);
  }, [services, activeCategory]);

  const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
    const item = ADD_ON_OPTIONS.find(a => a.id === addOnId);
    return sum + (item ? item.price : 0);
  }, 0);

  const discountAmount = useLoyaltyPoints ? 10 : 0;
  const basePrice = selectedService ? selectedService.price : 0;
  const totalPrice = Math.max(0, basePrice + addOnsTotal - discountAmount);
  const depositAmount = 150;

  const toggleAddOn = (id: string) => {
    const item = ADD_ON_OPTIONS.find(a => a.id === id);
    if (item) {
      storeToggleAddOn({
        id: item.id,
        name: item.name,
        price: item.price,
        duration: item.duration
      });
    }
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleLoyalty = (checked: boolean) => {
    setUseLoyaltyPoints(checked);
    if (checked) {
      storeApplyLoyaltyPoints(100, 10);
    } else {
      storeRemoveDiscounts();
    }
  };

  const handleConfirm = () => {
    if (!selectedService) return;

    addAppointment({
      clientId: currentClient.id,
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedTime,
      endTime: '12:30',
      status: 'confirmed',
      notes: `Wizard App Flow: ${selectedService.name} con ${selectedStaff.name}. Extras: ${selectedAddOns.length}. Total: $${totalPrice} MXN.`
    });

    toast.success('¡Cita agendada exitosamente!');

    onCompleteBooking({
      serviceName: selectedService.name,
      staffName: selectedStaff.name,
      dateStr: selectedDate,
      timeStr: selectedTime,
      totalPrice,
      depositAmount,
      addOnsCount: selectedAddOns.length
    });
  };

  const handleProceedDeposit = () => {
    if (!selectedService) return;
    if (onProceedToDeposit) {
      onProceedToDeposit({
        serviceName: selectedService.name,
        staffName: selectedStaff.name,
        dateStr: selectedDate,
        timeStr: selectedTime,
        totalPrice,
        depositAmount
      });
    }
  };

  const stepVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 15 : -15,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.18, ease: "easeOut" as const }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 15 : -15,
      opacity: 0,
      transition: { duration: 0.12, ease: "easeIn" as const }
    })
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Wand2 className="size-4 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Wizard de Reserva</h4>
            <p className="text-[10.5px] text-[#86868B]">
              {step === 1 && '1. Tratamiento'}
              {step === 2 && '2. Especialista, Fecha y Horario'}
              {step === 3 && '3. Extras Opcionales'}
              {step === 4 && '4. Resumen & Confirmación'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            resetReservation();
            setStep(1);
            setSelectedAddOns([]);
            setUseLoyaltyPoints(false);
          }}
          className="text-[10.5px] font-semibold text-[#86868B] hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3" /> Reiniciar
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-neutral-100 w-full flex">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* Main Wizard Content Area */}
      <div className="min-h-[270px] relative">
        <AnimatePresence custom={direction} mode="wait">
          {/* STEP 1: SERVICE SELECTION (Curated Top Default) */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col h-full"
            >
              {/* Category Pills */}
              <div className="px-3 py-2 bg-[#FBFBFD] border-b border-black/[0.04] flex gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveCategory('Top')}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1",
                    activeCategory === 'Top' ? "bg-[#1D1D1F] text-white shadow-2xs font-bold" : "bg-white text-[#86868B] border border-black/[0.06]"
                  )}
                >
                  <Star className={cn("size-3", activeCategory === 'Top' ? "text-amber-400 fill-amber-400" : "text-[#86868B]")} />
                  <span>⭐ Top Populares</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 whitespace-nowrap capitalize cursor-pointer",
                      activeCategory === cat ? "bg-[#1D1D1F] text-white shadow-2xs font-bold" : "bg-white text-[#86868B] border border-black/[0.06]"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Flush Service List */}
              <div className="divide-y divide-black/[0.05] max-h-[220px] overflow-y-auto custom-scrollbar">
                {filteredServices.map(service => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        selectService({
                          id: service.id,
                          name: service.name,
                          category: service.category,
                          price: service.price,
                          duration: service.duration
                        });
                      }}
                      className={cn(
                        "px-4 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer group",
                        isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#1D1D1F] group-hover:text-primary transition-colors truncate">
                            {service.name}
                          </span>
                          {isSelected && <Check className="size-3.5 text-primary stroke-[3] shrink-0" />}
                        </div>
                        <p className="text-[10.5px] text-[#86868B]">{service.duration} min • {service.category}</p>
                      </div>
                      <span className="font-bold text-xs text-[#1D1D1F] shrink-0">${service.price} MXN</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-black/[0.05] bg-[#FBFBFD] mt-auto">
                <Button
                  onClick={() => changeStep(2)}
                  disabled={!selectedService}
                  className="w-full h-10 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Continuar ({selectedService?.name || 'Selecciona uno'})</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ARTIST + SLIDING DATE & TIME SELECTION (UNIFIED WIDGET) */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col h-full divide-y divide-black/[0.05] max-h-[340px] overflow-y-auto custom-scrollbar"
            >
              {/* Artist Slider Chips */}
              <div className="p-3 bg-[#FBFBFD]">
                <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
                  1. Especialista
                </span>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
                  {STAFF_MEMBERS.map(staff => {
                    const isSelected = selectedStaff.id === staff.id;
                    return (
                      <button
                        key={staff.id}
                        type="button"
                        onClick={() => {
                          setSelectedStaff(staff);
                          selectStaff({
                            id: staff.id,
                            name: staff.name,
                            role: staff.role,
                            avatar: staff.avatar
                          });
                        }}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl border transition-all shrink-0 flex items-center gap-2 cursor-pointer text-left",
                          isSelected
                            ? "bg-white border-primary shadow-xs ring-1.5 ring-primary/20"
                            : "bg-white/70 border-black/[0.06] text-[#86868B]"
                        )}
                      >
                        <div className="size-6 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center border border-black/[0.06] shrink-0">
                          {staff.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className={cn("text-xs font-bold block truncate", isSelected ? "text-[#1D1D1F]" : "text-[#86868B]")}>
                            {staff.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliding Dates */}
              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
                    2. Fecha ({selectedStaff.name})
                  </span>
                  <span className="text-[10.5px] font-semibold text-primary capitalize">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 snap-x">
                  {availableDates.map((dateObj, idx) => {
                    const dateStr = format(dateObj, 'yyyy-MM-dd');
                    const isSelected = selectedDate === dateStr;
                    const dayName = format(dateObj, 'eee', { locale: es });
                    const dayNumber = format(dateObj, 'd');
                    const monthName = format(dateObj, 'MMM', { locale: es });
                    const isTomorrow = idx === 0;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedDate(dateStr);
                          selectDateTime(dateStr, selectedTime);
                        }}
                        className={cn(
                          "snap-start shrink-0 w-[54px] sm:w-[60px] py-1.5 px-1 rounded-xl text-center border transition-all text-xs cursor-pointer flex flex-col items-center",
                          isSelected
                            ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-xs font-bold scale-[1.02]"
                            : "bg-[#FBFBFD] border-black/[0.05] text-[#1D1D1F] hover:bg-neutral-100"
                        )}
                      >
                        <span className={cn(
                          "text-[8px] uppercase font-bold tracking-tight mb-0.5",
                          isSelected ? "text-white/70" : "text-[#86868B]"
                        )}>
                          {isTomorrow ? 'Mañana' : dayName}
                        </span>
                        <span className="text-sm font-display font-black leading-tight">
                          {dayNumber}
                        </span>
                        <span className={cn(
                          "text-[8px] capitalize",
                          isSelected ? "text-white/80" : "text-[#86868B]"
                        )}>
                          {monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Time Slots */}
              <div className="p-3 space-y-2 bg-white">
                <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">
                  3. Horarios Disponibles
                </span>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[9.5px] text-[#86868B] font-medium block mb-1">Mañana:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {morningTimes.map(time => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              setSelectedTime(time);
                              selectDateTime(selectedDate, time);
                            }}
                            className={cn(
                              "py-1.5 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer",
                              isSelected
                                ? "bg-primary text-white border-primary shadow-xs"
                                : "bg-[#FBFBFD] border-black/[0.05] text-[#1D1D1F] hover:bg-neutral-100"
                            )}
                          >
                            {time} hrs
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-[#86868B] font-medium block mb-1">Tarde:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {afternoonTimes.map(time => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              setSelectedTime(time);
                              selectDateTime(selectedDate, time);
                            }}
                            className={cn(
                              "py-1.5 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer",
                              isSelected
                                ? "bg-primary text-white border-primary shadow-xs"
                                : "bg-[#FBFBFD] border-black/[0.05] text-[#1D1D1F] hover:bg-neutral-100"
                            )}
                          >
                            {time} hrs
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-black/[0.05] bg-[#FBFBFD] flex items-center gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeStep(1)}
                  className="h-9 rounded-xl text-xs font-semibold px-3 cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  onClick={() => changeStep(3)}
                  className="flex-1 h-9 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Continuar a Extras</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: EXTRAS OPCTIONALES */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col h-full divide-y divide-black/[0.05] max-h-[300px] overflow-y-auto custom-scrollbar"
            >
              <div className="p-3 grid grid-cols-1 gap-2">
                {ADD_ON_OPTIONS.map((addon) => {
                  const isChecked = selectedAddOns.includes(addon.id);
                  const IconComp = addon.icon;
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer bg-white",
                        isChecked 
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                          : "border-black/[0.06] hover:bg-[#F8F8FA]"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn(
                          "size-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors",
                          isChecked ? "bg-primary/10 border-primary text-primary" : "bg-neutral-50 border-black/[0.08] text-[#86868B]"
                        )}>
                          <IconComp className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-[#1D1D1F] truncate block">
                            {addon.name}
                          </span>
                          <span className="text-[10px] font-semibold text-primary block">
                            +${addon.price} MXN <span className="text-[#86868B] font-normal">• +{addon.duration} min</span>
                          </span>
                        </div>
                      </div>

                      <div className={cn(
                        "size-4 rounded border flex items-center justify-center shrink-0 transition-all",
                        isChecked ? "bg-primary border-primary text-white" : "border-black/20"
                      )}>
                        {isChecked && <Check className="size-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loyalty Discount Toggle */}
              <div
                onClick={() => handleToggleLoyalty(!useLoyaltyPoints)}
                className={cn(
                  "mx-3 mb-2 p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors cursor-pointer",
                  useLoyaltyPoints ? "bg-emerald-50/70 border-emerald-300 text-emerald-900" : "bg-white border-black/[0.06] hover:bg-[#F8F8FA]"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className={cn("size-3.5 shrink-0", useLoyaltyPoints ? "text-emerald-600" : "text-amber-500")} />
                  <span className="font-bold text-xs block">Canjear 100 Puntos Emme (-$10)</span>
                </div>
                <div className={cn(
                  "size-4 rounded flex items-center justify-center transition-colors",
                  useLoyaltyPoints ? "bg-emerald-600 text-white" : "border border-black/20"
                )}>
                  {useLoyaltyPoints && <Check className="size-2.5 stroke-[3]" />}
                </div>
              </div>

              <div className="p-3 border-t border-black/[0.05] bg-[#FBFBFD] flex items-center gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeStep(2)}
                  className="h-9 rounded-xl text-xs font-semibold px-3 cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  onClick={() => changeStep(4)}
                  className="flex-1 h-9 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ver Resumen (${totalPrice} MXN)</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-4 space-y-3"
            >
              <div className="bg-[#FBFBFD] border border-black/[0.05] rounded-xl p-3 divide-y divide-black/[0.05] text-xs">
                <div className="pb-2 flex justify-between">
                  <span className="text-[#86868B]">Tratamiento:</span>
                  <span className="font-bold text-[#1D1D1F]">{selectedService?.name}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#86868B]">Especialista:</span>
                  <span className="font-semibold text-[#1D1D1F]">{selectedStaff.name}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#86868B]">Fecha & Turno:</span>
                  <span className="font-semibold text-[#1D1D1F]">{selectedDate} a las {selectedTime} hrs</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="py-2 flex justify-between text-primary font-semibold">
                    <span>Extras ({selectedAddOns.length}):</span>
                    <span>+${addOnsTotal} MXN</span>
                  </div>
                )}
                {useLoyaltyPoints && (
                  <div className="py-2 flex justify-between text-emerald-600 font-semibold">
                    <span>Descuento Fidelidad:</span>
                    <span>-$10 MXN</span>
                  </div>
                )}
                <div className="pt-2 flex justify-between items-center font-bold">
                  <span className="text-[#1D1D1F]">Total Cita:</span>
                  <span className="text-base text-primary font-bold">${totalPrice} MXN</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  onClick={handleConfirm}
                  className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Confirmar Mi Cita (${totalPrice} MXN)</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeStep(3)}
                  className="w-full h-8 rounded-lg text-xs text-[#86868B] cursor-pointer"
                >
                  Modificar extras o fecha
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
