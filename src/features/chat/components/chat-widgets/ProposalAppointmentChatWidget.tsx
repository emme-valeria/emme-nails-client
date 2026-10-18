import React, { useState } from 'react';
import { useApp } from '@/app/AppContext';
import { STAFF_MEMBERS, StaffMember } from '@/features/staff';
import { useChatStore } from '../../state/useChatStore';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { 
  Sparkles, Calendar, Clock, User, CheckCircle2, ChevronRight, 
  RotateCcw, ShieldCheck, ArrowRight, Gem, Check
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';

export interface ProposalAppointmentData {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  durationMinutes: number;
  staff: StaffMember;
  dateStr: string;
  timeStr: string;
  cabinet: string;
  depositRequired: number;
}

interface ProposalAppointmentChatWidgetProps {
  initialProposal?: Partial<ProposalAppointmentData>;
  onAcceptProposal: (proposal: ProposalAppointmentData) => void;
  onProceedToDeposit: (proposal: ProposalAppointmentData) => void;
  onRequestAlternative?: () => void;
}

export function ProposalAppointmentChatWidget({
  initialProposal,
  onAcceptProposal,
  onProceedToDeposit,
  onRequestAlternative
}: ProposalAppointmentChatWidgetProps) {
  const { services } = useApp();
  const { reservation, prefillFromProposal, selectDateTime } = useChatStore();

  const defaultService = services.find(s => s.id === (initialProposal?.serviceId || reservation.serviceId)) || services[1] || services[0];
  const [selectedService, setSelectedService] = useState(defaultService);
  const defaultStaff = STAFF_MEMBERS.find(st => st.id === (initialProposal?.staff?.id || reservation.staffId)) || STAFF_MEMBERS[0];
  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(
    initialProposal?.staff || defaultStaff
  );
  
  const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState<string>(initialProposal?.dateStr || reservation.dateStr || tomorrowStr);
  const [selectedTime, setSelectedTime] = useState<string>(initialProposal?.timeStr || reservation.timeStr || '11:30');
  const [includeChromeAddon, setIncludeChromeAddon] = useState<boolean>(false);

  const availableDates = Array.from({ length: 5 }).map((_, i) => addDays(new Date(), i + 1));
  const availableTimes = ['10:00', '11:30', '13:30', '15:30', '17:00'];

  const addonPrice = includeChromeAddon ? 15 : 0;
  const totalPrice = (selectedService?.price || 50) + addonPrice;
  const depositPrice = 150;

  const getCurrentProposal = (): ProposalAppointmentData => ({
    serviceId: selectedService.id,
    serviceName: selectedService.name + (includeChromeAddon ? ' + Chrome Effect' : ''),
    servicePrice: totalPrice,
    durationMinutes: selectedService.duration + (includeChromeAddon ? 15 : 0),
    staff: selectedStaff,
    dateStr: selectedDate,
    timeStr: selectedTime,
    cabinet: 'Cabina VIP #2 - Studio Luxury',
    depositRequired: depositPrice
  });

  const handleProceedDeposit = () => {
    const proposal = getCurrentProposal();
    prefillFromProposal({
      serviceId: proposal.serviceId,
      serviceName: proposal.serviceName,
      servicePrice: proposal.servicePrice,
      staffId: proposal.staff.id,
      staffName: proposal.staff.name,
      dateStr: proposal.dateStr,
      timeStr: proposal.timeStr,
      depositAmount: proposal.depositRequired
    });
    onProceedToDeposit(proposal);
  };

  const handleAcceptProposal = () => {
    const proposal = getCurrentProposal();
    prefillFromProposal({
      serviceId: proposal.serviceId,
      serviceName: proposal.serviceName,
      servicePrice: proposal.servicePrice,
      staffId: proposal.staff.id,
      staffName: proposal.staff.name,
      dateStr: proposal.dateStr,
      timeStr: proposal.timeStr,
      depositAmount: proposal.depositRequired
    });
    onAcceptProposal(proposal);
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Propuesta de Cita</h4>
            <p className="text-[10.5px] text-[#86868B]">Disponibilidad óptima calculada</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-emerald-700 border-emerald-200 bg-emerald-50">
          Recomendado
        </Badge>
      </div>

      {/* Main Containerless Details */}
      <div className="divide-y divide-black/[0.05]">
        {/* Service & Price Row */}
        <div className="px-4 py-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="font-bold text-sm text-[#1D1D1F] block">{selectedService.name}</span>
            <p className="text-[11px] text-[#86868B]">{selectedService.duration} min • {selectedService.category}</p>
          </div>
          <span className="font-bold text-base text-primary shrink-0">${totalPrice} MXN</span>
        </div>

        {/* Specialist & Slot */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={selectedStaff.avatar} 
              alt={selectedStaff.name} 
              className="size-7 rounded-full object-cover border border-black/[0.06] shrink-0" 
            />
            <div className="min-w-0">
              <span className="font-semibold text-xs text-[#1D1D1F] truncate block">{selectedStaff.name}</span>
              <span className="text-[10.5px] text-[#86868B] truncate block">{selectedStaff.role}</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#1D1D1F] shrink-0">{selectedDate} • {selectedTime}h</span>
        </div>

        {/* Chrome Effect Add-on Row */}
        <div 
          onClick={() => setIncludeChromeAddon(!includeChromeAddon)}
          className={cn(
            "px-4 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer",
            includeChromeAddon ? "bg-primary/5" : "hover:bg-[#F8F8FA]"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Gem className={cn("size-3.5 shrink-0", includeChromeAddon ? "text-primary" : "text-amber-500")} />
            <span className="text-xs font-medium text-[#1D1D1F] truncate">
              Efecto Chrome Espejo (+ $15 MXN)
            </span>
          </div>
          <div className={cn(
            "size-4 rounded flex items-center justify-center transition-colors shrink-0",
            includeChromeAddon ? "bg-primary text-white" : "border border-black/20"
          )}>
            {includeChromeAddon && <Check className="size-3 stroke-[3]" />}
          </div>
        </div>

        {/* Quick Date Adjuster */}
        <div className="px-4 py-3 bg-[#FBFBFD]">
          <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1.5">
            Ajustar Día:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {availableDates.map((dObj, idx) => {
              const dStr = format(dObj, 'yyyy-MM-dd');
              const isSel = selectedDate === dStr;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedDate(dStr);
                    selectDateTime(dStr, selectedTime);
                  }}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-center shrink-0 border transition-all text-xs cursor-pointer",
                    isSel
                      ? "bg-primary text-white border-primary font-bold shadow-2xs"
                      : "bg-white border-black/[0.05] text-[#1D1D1F] hover:bg-neutral-50"
                  )}
                >
                  <span className="block text-[8px] uppercase opacity-80">{format(dObj, 'eee', { locale: es })}</span>
                  <span className="block font-bold text-xs">{format(dObj, 'd')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-3.5 space-y-2 bg-white">
          <Button
            onClick={handleProceedDeposit}
            className="w-full h-10.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="size-4" />
            <span>Pagar Depósito Seguro ($150 MXN)</span>
            <ArrowRight className="size-4 ml-auto" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleAcceptProposal}
              className="flex-1 h-9.5 rounded-xl text-xs font-semibold border-black/10 hover:bg-neutral-50 cursor-pointer"
            >
              <CheckCircle2 className="size-3.5 text-emerald-600 mr-1" />
              <span>Confirmar Directo</span>
            </Button>

            {onRequestAlternative && (
              <Button
                variant="ghost"
                onClick={onRequestAlternative}
                className="h-9.5 text-[11px] font-semibold text-[#86868B] hover:text-[#1D1D1F] cursor-pointer"
              >
                <RotateCcw className="size-3 mr-1" /> Otro Horario
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
