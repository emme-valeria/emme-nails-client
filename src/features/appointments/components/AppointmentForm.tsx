import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addMinutes, isAfter, isBefore, parse, getDay } from 'date-fns';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Search,
  Sparkles,
  X,
  Star,
  Wand2,
  Receipt,
  User,
  ShieldCheck,
  Check,
  Gem,
  Leaf,
  Sparkle,
  UserCheck,
  RotateCcw,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Input } from '@emme/ui/input';
import { Label } from '@emme/ui/label';
import { cn } from '@emme/ui/lib/utils';
import { useApp, type Service } from '@/app/AppContext';
import { STAFF_MEMBERS, StaffMember } from '@/features/staff';
import { toast } from 'sonner';
import { SegmentedCapsuleTabs } from '@/shared/components/SegmentedCapsuleTabs';
import { triggerHapticFeedback, triggerSelectionVibration } from '@/shared/utils/haptics';

interface AppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialDate?: Date;
  initialStartTime?: string;
  initialServiceId?: string;
  initialClientId?: string;
  initialStaffId?: string;
}

interface AddOnOption {
  id: string;
  name: string;
  category: 'popular' | 'removal' | 'nail_art' | 'spa';
  price: number;
  duration: number;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ADD_ON_OPTIONS: AddOnOption[] = [
  { id: 'addon-removal-gelx', name: 'Retiro de Set Previo (Gel-X / Rubber)', category: 'removal', price: 10, duration: 15, badge: 'Recomendado', icon: RotateCcw },
  { id: 'addon-1', name: 'Efecto Chrome / Glazed Donut', category: 'popular', price: 10, duration: 15, badge: 'Tendencia', icon: Sparkles },
  { id: 'addon-2', name: 'Cristales Swarovski (x4 uñas)', category: 'popular', price: 8, duration: 10, badge: 'Popular', icon: Gem },
  { id: 'addon-foil', name: 'Foil de Oro / Plata Encapsulado', category: 'nail_art', price: 8, duration: 10, icon: Sparkle },
  { id: 'addon-3', name: 'Baño de Keratina & Cuticle Care', category: 'spa', price: 12, duration: 10, badge: 'Salud Uñas', icon: Leaf },
  { id: 'addon-4', name: 'Jelly Spa Exfoliación Relajante', category: 'spa', price: 15, duration: 15, badge: 'Relax', icon: Flame },
];

type AppointmentStep = 1 | 2 | 3 | 4;

export function AppointmentForm({ 
  onSuccess, 
  onCancel, 
  initialDate, 
  initialStartTime,
  initialServiceId,
  initialClientId,
  initialStaffId
}: AppointmentFormProps) {
  const { clients, services, addAppointment, appointments, profile } = useApp();
  
  const activeClient = useMemo(() => {
    if (initialClientId) return clients.find(c => c.id === initialClientId) || clients[0];
    return clients.find(c => c.isVip) || clients[0] || null;
  }, [clients, initialClientId]);

  const defaultService = useMemo(() => {
    if (initialServiceId) return services.find(s => s.id === initialServiceId);
    return null;
  }, [services, initialServiceId]);

  const [step, setStep] = useState<AppointmentStep>(defaultService ? 2 : 1);
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(defaultService);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(() => {
    if (initialStaffId) return STAFF_MEMBERS.find(s => s.id === initialStaffId) || STAFF_MEMBERS[0];
    return STAFF_MEMBERS[0];
  });
  
  const [date, setDate] = useState<string>(format(initialDate || new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState<string>(initialStartTime || '');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [customAiIdea, setCustomAiIdea] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (defaultService && !selectedService) setSelectedService(defaultService);
  }, [defaultService]);

  const categories = Array.from(new Set(services.filter(s => s.isActive).map(s => s.category)));
  const [activeCategory, setActiveCategory] = useState('Top');

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (!s.isActive) return false;
      const matchesSearch = s.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                            (s.description && s.description.toLowerCase().includes(serviceSearchTerm.toLowerCase()));
      if (!matchesSearch) return false;

      if (activeCategory === 'Top') {
        return s.isPopular || ['srv-1', 'srv-2', 'srv-3', 'srv-4'].includes(s.id);
      }
      if (activeCategory === 'Todas') {
        return true;
      }
      return s.category === activeCategory;
    });
  }, [services, serviceSearchTerm, activeCategory]);

  // Add-ons total calculation
  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((acc, id) => {
      const item = ADD_ON_OPTIONS.find(a => a.id === id);
      return acc + (item ? item.price : 0);
    }, 0);
  }, [selectedAddOns]);

  const addOnsDuration = useMemo(() => {
    return selectedAddOns.reduce((acc, id) => {
      const item = ADD_ON_OPTIONS.find(a => a.id === id);
      return acc + (item ? item.duration : 0);
    }, 0);
  }, [selectedAddOns]);

  // Staff extra fee
  const staffExtraFee = selectedStaff?.extraFee || 0;

  // Active Promo Discount Calculation
  const activePromo = useMemo(() => {
    if (!selectedService || !profile.promotions) return null;
    return profile.promotions.find(p => p.isActive && p.serviceId === selectedService.id);
  }, [selectedService, profile.promotions]);

  const discountValue = useMemo(() => {
    if (!selectedService || !activePromo) return 0;
    if (activePromo.discountType === 'percentage') {
      return Math.round((selectedService.price * activePromo.discountValue) / 100);
    }
    return activePromo.discountValue;
  }, [selectedService, activePromo]);

  // Total Final Calculations
  const totalPrice = useMemo(() => {
    const base = selectedService ? selectedService.price : 0;
    return Math.max(0, base + addOnsTotal + staffExtraFee - discountValue);
  }, [selectedService, addOnsTotal, staffExtraFee, discountValue]);

  const totalDuration = useMemo(() => {
    const base = selectedService ? selectedService.duration : 30;
    return base + addOnsDuration;
  }, [selectedService, addOnsDuration]);

  // Slots calculation
  const availableSlots = useMemo(() => {
    if (!date || !profile.workingHours) return [];
    const selectedDate = new Date(date + 'T00:00:00');
    
    const specialDate = profile.salonConfig?.specialDates?.find(sd => {
      if (sd.type === 'vacation' && sd.endDate) {
        const start = new Date(sd.date + 'T00:00:00');
        const end = new Date(sd.endDate + 'T23:59:59');
        return selectedDate >= start && selectedDate <= end;
      }
      return sd.date === date;
    });

    let openStr = '', closeStr = '', isActive = false;

    if (specialDate) {
      if (specialDate.type === 'holiday' || specialDate.type === 'vacation') return [];
      if (specialDate.type === 'reduced') {
        openStr = specialDate.open || '09:00';
        closeStr = specialDate.close || '14:00';
        isActive = true;
      }
    } else {
      const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      const dayKey = dayNames[getDay(selectedDate)];
      const hours = profile.workingHours[dayKey];
      if (!hours || !hours.active) return [];
      openStr = hours.open; closeStr = hours.close; isActive = true;
    }

    if (!isActive) return [];

    const slots: string[] = [];
    const openTime = parse(openStr, 'HH:mm', selectedDate);
    const closeTime = parse(closeStr, 'HH:mm', selectedDate);
    
    let current = openTime;

    while (isBefore(current, closeTime)) {
      const timeStr = format(current, 'HH:mm');
      const apptStart = current;
      const apptEnd = addMinutes(current, totalDuration);

      if (isAfter(apptEnd, closeTime)) {
        current = addMinutes(current, 30);
        continue;
      }

      const isBusy = appointments.filter(a => a.date === date && a.status !== 'cancelled').some(apt => {
        const aptStart = parse(apt.startTime, 'HH:mm', selectedDate);
        const aptEnd = parse(apt.endTime, 'HH:mm', selectedDate);
        return (apptStart < aptEnd && apptEnd > aptStart);
      });

      let isInBreak = false;
      if (!specialDate) {
        const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const dayKey = dayNames[getDay(selectedDate)];
        const hours = profile.workingHours[dayKey];
        if (hours?.breakActive && hours.breakStart && hours.breakEnd) {
          const bStart = parse(hours.breakStart, 'HH:mm', selectedDate);
          const bEnd = parse(hours.breakEnd, 'HH:mm', selectedDate);
          if (apptStart < bEnd && apptEnd > bStart) {
            isInBreak = true;
          }
        }
      }

      if (!isBusy && !isInBreak) slots.push(timeStr);
      current = addMinutes(current, 30);
    }
    return slots;
  }, [date, profile.workingHours, profile.salonConfig, appointments, totalDuration]);

  const toggleAddOn = (id: string) => {
    triggerHapticFeedback(8);
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    if (!activeClient || !selectedService || !startTime) {
      toast.error('Por favor completa los detalles para confirmar la cita');
      return;
    }
    const [h, m] = startTime.split(':').map(Number);
    const startDateObj = new Date();
    startDateObj.setHours(h, m, 0);
    const endDateObj = addMinutes(startDateObj, totalDuration);
    
    const fullNotes = [
      `Especialista: ${selectedStaff?.name || 'Cualquiera'}`,
      selectedAddOns.length > 0 ? `Add-ons: ${selectedAddOns.map(id => ADD_ON_OPTIONS.find(a => a.id === id)?.name).join(', ')}` : '',
      customAiIdea ? `Diseño AI: ${customAiIdea}` : '',
      notes ? `Nota cliente: ${notes}` : ''
    ].filter(Boolean).join(' | ');

    addAppointment({
      clientId: activeClient.id,
      serviceId: selectedService.id,
      date,
      startTime,
      endTime: format(endDateObj, 'HH:mm'),
      status: 'pending',
      notes: fullNotes,
    });

    toast.success('¡Cita agendada con éxito!', {
      description: `Te esperamos el ${date} a las ${startTime} hrs con ${selectedStaff?.name || 'tu especialista'}. Total: $${totalPrice} MXN.`,
      icon: <CheckCircle2 className="size-5 text-emerald-500" />
    });
    onSuccess();
  };

  const stepTabs = [
    { id: 1 as AppointmentStep, label: '1. Servicio', detail: selectedService ? selectedService.name : undefined },
    { id: 2 as AppointmentStep, label: '2. Artista', detail: selectedStaff ? selectedStaff.name : undefined },
    { id: 3 as AppointmentStep, label: '3. Fecha & Turno', detail: startTime ? `${date} ${startTime}` : undefined },
    { id: 4 as AppointmentStep, label: '4. Extras & Resumen' },
  ];

  const stepTitles = {
    1: {
      title: '¿Qué servicio base deseas agendar?',
      subtitle: 'Explora nuestro catálogo de manicura, extensiones y pedicura.',
    },
    2: {
      title: 'Elige a tu manicurista especialista',
      subtitle: 'Selecciona la técnica de tu preferencia para tu tratamiento.',
    },
    3: {
      title: 'Selecciona la fecha y turno disponible',
      subtitle: 'Horarios actualizados en tiempo real según disponibilidad.',
    },
    4: {
      title: 'Personaliza con extras y confirma tu cita',
      subtitle: 'Añade toques especiales, notas y revisa el resumen final.',
    },
  }[step];

  return (
    <div className="flex flex-col h-full bg-white text-[#1D1D1F] select-none">
      {/* Header Bar matching Cotizar Uñas Flow */}
      <div className="px-5 sm:px-6 pt-5 pb-4 shrink-0 bg-white border-b border-border/80 space-y-3 sm:space-y-4">
        {/* 1. Top Navigation & Step Indicator */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  setStep((step - 1) as AppointmentStep);
                }}
                className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1 px-1.5 sm:px-2 -ml-1 sm:-ml-2 rounded-lg hover:bg-secondary/60"
              >
                <ArrowLeft className="size-3.5 sm:size-4" />
                <span>Volver</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
                <Sparkles className="size-3.5" />
                <span>Agendar Cita Directa</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-muted-foreground/80 bg-secondary/80 px-2.5 sm:px-3 py-1 rounded-full border border-border/40">
                Paso {step} de 4
              </span>
              <button 
                onClick={onCancel}
                className="size-7 sm:size-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full h-1 sm:h-1.5 bg-secondary/80 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Title & Subtitle */}
        <div className="space-y-0.5 sm:space-y-1">
          <h2 className="text-base sm:text-xl font-black text-foreground tracking-tight">
            {stepTitles.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
            {stepTitles.subtitle}
          </p>
        </div>
      </div>

      {/* Segmented Sub-Step Capsule Tabs */}
      <div className="px-4 py-2 bg-[#FBFBFD] border-b border-black/[0.05]">
        <SegmentedCapsuleTabs<AppointmentStep>
          value={step}
          onChange={(newStep) => {
            triggerSelectionVibration();
            setStep(newStep);
          }}
          size="sm"
          layoutId="appointment-modal-tabs"
          items={stepTabs}
        />
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" initial={false}>
          {/* STEP 1: SERVICE (Containerless Flush List) */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full"
            >
              {/* Search & Category Pills */}
              <div className="p-4 bg-[#FBFBFD] border-b border-black/[0.04] space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#86868B]" />
                  <Input 
                    placeholder="Buscar tratamiento o técnica..."
                    className="h-9 bg-white border border-black/[0.06] pl-9 rounded-xl text-xs"
                    value={serviceSearchTerm}
                    onChange={(e) => setServiceSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  <button
                    onClick={() => {
                      triggerHapticFeedback(8);
                      setActiveCategory('Top');
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                      activeCategory === 'Top' 
                        ? "bg-[#1D1D1F] text-white shadow-2xs font-bold" 
                        : "bg-white text-[#86868B] hover:text-[#1D1D1F] border border-black/[0.06]"
                    )}
                  >
                    <Star className={cn("size-3", activeCategory === 'Top' ? "text-amber-400 fill-amber-400" : "text-[#86868B]")} />
                    <span>Más Populares</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        triggerHapticFeedback(8);
                        setActiveCategory(cat);
                      }}
                      className={cn(
                        "px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer",
                        activeCategory === cat 
                          ? "bg-[#1D1D1F] text-white shadow-2xs font-bold" 
                          : "bg-white text-[#86868B] hover:text-[#1D1D1F] border border-black/[0.06]"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      triggerHapticFeedback(8);
                      setActiveCategory('Todas');
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer",
                      activeCategory === 'Todas' 
                        ? "bg-[#1D1D1F] text-white shadow-2xs font-bold" 
                        : "bg-white text-[#86868B] hover:text-[#1D1D1F] border border-black/[0.06]"
                    )}
                  >
                    Ver Todas
                  </button>
                </div>
              </div>

              {/* Flush Service List with Hairline Dividers */}
              <div className="divide-y divide-black/[0.05] flex-1 overflow-y-auto custom-scrollbar">
                {filteredServices.map((s) => {
                  const isSelected = selectedService?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        triggerSelectionVibration();
                        setSelectedService(s);
                        setTimeout(() => setStep(2), 150);
                      }}
                      className={cn(
                        "px-5 py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer group",
                        isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
                      )}
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-[#1D1D1F] group-hover:text-primary transition-colors truncate">
                            {s.name}
                          </span>
                          <span className="text-[9.5px] font-semibold text-[#86868B] bg-black/[0.04] px-1.5 py-0.2 rounded-md shrink-0">
                            {s.category}
                          </span>
                        </div>
                        {s.description && (
                          <p className="text-[11px] text-[#86868B] line-clamp-1">{s.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-[#86868B] pt-0.5">
                          <span className="flex items-center gap-1"><Clock className="size-3" /> {s.duration} min</span>
                          <span>•</span>
                          <span className="font-bold text-[#1D1D1F]">${s.price} MXN</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isSelected && (
                          <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                        )}
                        <ChevronRight className="size-4 text-[#86868B] group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: STAFF SELECTION (Flush List) */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full"
            >
              <div className="px-5 py-2.5 bg-[#FBFBFD] border-b border-black/[0.04] flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
                  Tratamiento: {selectedService?.name}
                </span>
                <button onClick={() => setStep(1)} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                  Cambiar
                </button>
              </div>

              <div className="divide-y divide-black/[0.05] flex-1 overflow-y-auto custom-scrollbar">
                {STAFF_MEMBERS.map((staff) => {
                  const isSelected = selectedStaff?.id === staff.id;
                  return (
                    <div
                      key={staff.id}
                      onClick={() => {
                        triggerSelectionVibration();
                        setSelectedStaff(staff);
                        setTimeout(() => setStep(3), 150);
                      }}
                      className={cn(
                        "px-5 py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer group",
                        isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-11 rounded-2xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-black/[0.06] shrink-0">
                          {staff.name.charAt(0)}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-[#1D1D1F] group-hover:text-primary transition-colors truncate">
                              {staff.name}
                            </span>
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0 bg-amber-50 px-1.5 py-0.2 rounded-md">
                              <Star className="size-2.5 fill-current text-amber-500" />
                              {staff.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#86868B] truncate">{staff.role}</p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {staff.extraFee ? (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            +${staff.extraFee} MXN
                          </span>
                        ) : null}
                        {isSelected ? (
                          <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                        ) : (
                          <ChevronRight className="size-4 text-[#86868B] group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: DATE & TIME (Unified Sliding UX) */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-3.5 overflow-y-auto custom-scrollbar"
            >
              {/* Summary Bar */}
              <div className="flex items-center justify-between text-xs pb-2.5 border-b border-black/[0.05]">
                <div>
                  <p className="font-bold text-[#1D1D1F]">{selectedService?.name}</p>
                  <p className="text-[11px] text-[#86868B]">Con {selectedStaff?.name} • {totalDuration} min</p>
                </div>
                <span className="font-black text-sm text-primary">${totalPrice} MXN</span>
              </div>

              {/* Interactive Horizontal Sliding Dates */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-1">
                    <Calendar className="size-3 text-primary" />
                    Selecciona Día
                  </Label>
                  <span className="text-[10.5px] font-semibold text-primary capitalize">
                    {date ? new Date(date + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Selecciona'}
                  </span>
                </div>

                <div className="overflow-x-auto flex gap-2 pb-1 scrollbar-none snap-x snap-mandatory">
                  {Array.from({ length: 10 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i + 1);
                    const iso = d.toISOString().split('T')[0];
                    const isSelected = date === iso;
                    const dayName = d.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', '');
                    const dayNumber = d.getDate();
                    const monthName = d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '');
                    const tag = i === 0 ? 'Mañana' : (d.getDay() === 0 || d.getDay() === 6) ? 'Finde' : undefined;

                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => {
                          triggerSelectionVibration();
                          setDate(iso);
                        }}
                        className={cn(
                          "snap-start shrink-0 w-[64px] sm:w-[70px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center border",
                          isSelected
                            ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-xs font-bold scale-[1.02]"
                            : "bg-[#FAF9F7] border-black/[0.06] text-[#1D1D1F] hover:bg-neutral-100 hover:border-black/20"
                        )}
                      >
                        {tag ? (
                          <span className={cn(
                            "text-[7.5px] font-bold uppercase tracking-tight px-1 rounded-full mb-0.5 leading-none",
                            isSelected ? "bg-white/20 text-white" : "bg-black/[0.05] text-[#86868B]"
                          )}>
                            {tag}
                          </span>
                        ) : (
                          <span className="text-[7.5px] opacity-0 mb-0.5 leading-none">•</span>
                        )}
                        <span className={cn(
                          "text-[9px] uppercase font-bold tracking-wider",
                          isSelected ? "text-white/80" : "text-[#86868B]"
                        )}>
                          {dayName}
                        </span>
                        <span className="text-base font-display font-black leading-tight my-0.5">
                          {dayNumber}
                        </span>
                        <span className={cn(
                          "text-[9px] capitalize font-medium",
                          isSelected ? "text-white/90" : "text-[#86868B]"
                        )}>
                          {monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-1">
                    <Clock className="size-3 text-primary" />
                    Horarios Disponibles
                  </Label>
                  {startTime && (
                    <span className="text-[10.5px] font-bold text-primary">
                      Turno: {startTime} hrs
                    </span>
                  )}
                </div>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = startTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            triggerSelectionVibration();
                            setStartTime(slot);
                            setTimeout(() => setStep(4), 150);
                          }}
                          className={cn(
                            "py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer",
                            isSelected 
                              ? "bg-primary text-white border-primary shadow-xs" 
                              : "bg-[#FAF9F7] text-[#1D1D1F] border-black/[0.06] hover:bg-neutral-100 hover:border-black/20"
                          )}
                        >
                          {slot} hrs
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[#86868B] bg-[#FAF9F7] rounded-2xl border border-black/[0.04]">
                    Sin horarios disponibles en esta fecha. Desliza para seleccionar otro día arriba.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 4: PERSONALIZATION & SUMMARY (Containerless Breakdown) */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full overflow-y-auto custom-scrollbar"
            >
              {/* Simplified & Elegant Add-ons Grid / List */}
              <div className="border-b border-black/[0.05]">
                <div className="px-4 py-2.5 bg-[#FAF9F7] flex items-center justify-between border-b border-black/[0.04]">
                  <span className="text-[11px] font-bold text-[#1D1D1F] flex items-center gap-1.5">
                    <Sparkles className="size-3 text-primary" />
                    Extras & Efectos Opcionales:
                  </span>
                  <span className="text-[10px] text-[#86868B]">
                    {selectedAddOns.length > 0 ? `${selectedAddOns.length} seleccionado(s)` : 'Opcional'}
                  </span>
                </div>
                
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ADD_ON_OPTIONS.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.id);
                    const IconComponent = addon.icon;
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={cn(
                          "p-3 rounded-2xl border text-left flex items-start justify-between gap-2.5 transition-all cursor-pointer bg-white active:scale-98",
                          isChecked 
                            ? "border-primary bg-primary/5 ring-1.5 ring-primary/25 shadow-2xs" 
                            : "border-black/[0.06] hover:border-primary/40 hover:bg-[#F8F8FA]"
                        )}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className={cn(
                            "size-7 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                            isChecked ? "bg-primary/10 border-primary text-primary" : "bg-neutral-50 border-black/[0.08] text-[#86868B]"
                          )}>
                            <IconComponent className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="font-bold text-xs text-[#1D1D1F] truncate block">
                                {addon.name}
                              </span>
                              {addon.badge && (
                                <span className="text-[8px] font-bold text-primary bg-primary/10 px-1 py-0.2 rounded-xs">
                                  {addon.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-primary block mt-0.5">
                              +${addon.price} MXN <span className="text-[#86868B] font-normal">• +{addon.duration} min</span>
                            </span>
                          </div>
                        </div>

                        <div className={cn(
                          "size-4 rounded-md border flex items-center justify-center shrink-0 transition-all mt-0.5",
                          isChecked ? "bg-primary border-primary text-white" : "border-black/20"
                        )}>
                          {isChecked && <Check className="size-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Custom Prompt Note */}
              <div className="p-4 border-b border-black/[0.05] space-y-1.5 bg-white">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-1">
                  <Wand2 className="size-3 text-primary" /> Idea de Diseño o Notas:
                </Label>
                <Input 
                  placeholder="Ej: Acabado perlado con francés fino..."
                  value={customAiIdea}
                  onChange={(e) => setCustomAiIdea(e.target.value)}
                  className="h-9 bg-white border border-black/10 rounded-xl text-xs"
                />
              </div>

              {/* Line-item Financial Receipt */}
              <div className="p-5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#86868B]">Tratamiento ({selectedService?.name}):</span>
                  <span className="font-bold text-[#1D1D1F]">${selectedService?.price} MXN</span>
                </div>
                {selectedStaff?.extraFee ? (
                  <div className="flex justify-between">
                    <span className="text-[#86868B]">Especialista ({selectedStaff.name}):</span>
                    <span className="font-bold text-[#1D1D1F]">+${selectedStaff.extraFee} MXN</span>
                  </div>
                ) : null}
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Extras seleccionados:</span>
                    <span className="font-bold">+${addOnsTotal} MXN</span>
                  </div>
                )}
                {discountValue > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Descuento Promoción:</span>
                    <span>-${discountValue} MXN</span>
                  </div>
                )}
                <div className="pt-2.5 border-t border-black/[0.05] flex justify-between items-baseline font-bold">
                  <span className="text-[#1D1D1F]">Total Estimado ({totalDuration} min):</span>
                  <span className="text-lg font-display font-black text-primary">${totalPrice} MXN</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 border-t border-black/[0.05] bg-[#FBFBFD] flex items-center gap-2">
        {step > 1 && (
          <Button 
            variant="outline"
            onClick={() => {
              triggerHapticFeedback(8);
              setStep((step - 1) as AppointmentStep);
            }}
            className="h-10 rounded-xl text-xs font-bold px-3 cursor-pointer"
          >
            Atrás
          </Button>
        )}

        {step < 4 ? (
          <Button 
            onClick={() => {
              triggerSelectionVibration();
              setStep((step + 1) as AppointmentStep);
            }}
            disabled={(step === 1 && !selectedService) || (step === 2 && !selectedStaff) || (step === 3 && !startTime)}
            className="flex-1 h-10 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Siguiente Paso</span>
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleFinish}
            className="flex-1 h-10 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <CheckCircle2 className="size-4" />
            <span>Confirmar Mi Cita (${totalPrice} MXN)</span>
          </Button>
        )}
      </div>
    </div>
  );
}

