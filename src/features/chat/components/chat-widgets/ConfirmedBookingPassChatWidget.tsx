import React, { useState } from 'react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { 
  Sparkles, Calendar, Clock, User, CheckCircle2, 
  MapPin, RefreshCw, XCircle, CalendarPlus, Check
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';

export interface ConfirmedBookingPassData {
  bookingRef?: string;
  serviceName: string;
  clientName?: string;
  staffName: string;
  staffAvatar?: string;
  staffRating?: number;
  dateStr: string;
  timeStr: string;
  depositPaid: number;
  remainingBalance: number;
  location?: string;
}

interface ConfirmedBookingPassChatWidgetProps {
  passData?: Partial<ConfirmedBookingPassData>;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export function ConfirmedBookingPassChatWidget({
  passData,
  onReschedule,
  onCancel
}: ConfirmedBookingPassChatWidgetProps) {
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const refCode = passData?.bookingRef || 'apt-78333';
  const serviceName = passData?.serviceName || 'Signature Russian E-File Manicure';
  const clientName = passData?.clientName || 'Elena Gilbert';
  const staffName = passData?.staffName || 'Sofia Ivanova';
  const staffAvatar = passData?.staffAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop';
  const staffRating = passData?.staffRating || 4.98;
  const dateStr = passData?.dateStr || '2026-08-06';
  const timeStr = passData?.timeStr || '03:00 PM';
  const depositPaid = passData?.depositPaid ?? 25.00;
  const remainingBalance = passData?.remainingBalance ?? 70.00;
  const location = passData?.location || 'EMME Studio • Centro Urbano';

  const handleCalendarSync = () => {
    if (isSynced) {
      setIsSynced(false);
      toast.info('Sincronización de calendario removida');
      return;
    }

    setIsSynced(true);

    const eventTitle = encodeURIComponent(`Cita Emme Studio: ${serviceName}`);
    const eventDetails = encodeURIComponent(`Cita confirmada con ${staffName}.\nRef: #${refCode}\nDepósito pagado: $${depositPaid} MXN.\nSaldo en salón: $${remainingBalance} MXN.\nUbicación: ${location}`);
    const eventLocation = encodeURIComponent(location);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}`;

    window.open(googleCalUrl, '_blank', 'noopener,noreferrer');

    toast.success('¡Cita sincronizada con Google Calendar! 📅', {
      description: `Agregada para el ${dateStr} a las ${timeStr}`,
      icon: <CalendarPlus className="size-5 text-emerald-500" />
    });
  };

  const handleCancelPass = () => {
    setIsCancelled(true);
    toast.error('Cita cancelada con éxito', {
      description: `Tu reembolso de depósito de $${depositPaid} MXN ha sido procesado.`
    });
    if (onCancel) onCancel();
  };

  if (isCancelled) {
    return (
      <div className="bg-[#FBFBFD] border border-rose-200 rounded-2xl p-4 text-left w-full max-w-md my-1.5 animate-in fade-in duration-200">
        <div className="flex items-center gap-2.5 text-rose-600 text-xs font-bold">
          <XCircle className="size-4 shrink-0" />
          <div>
            <p>Cita #{refCode} Cancelada</p>
            <p className="text-[11px] text-[#86868B] font-normal">Reembolso de ${depositPaid} MXN en proceso.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500" />
          <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Pase de Cita Confirmada</h4>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-emerald-700 border-emerald-200 bg-emerald-50">
          #{refCode}
        </Badge>
      </div>

      {/* Containerless Line Item Rows with Hairline Dividers */}
      <div className="divide-y divide-black/[0.05]">
        {/* Service */}
        <div className="px-4 py-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="font-bold text-sm text-[#1D1D1F] block">{serviceName}</span>
            <p className="text-[11px] text-[#86868B]">Para: <strong className="text-[#1D1D1F] font-semibold">{clientName}</strong></p>
          </div>
        </div>

        {/* Date & Specialist Info */}
        <div className="px-4 py-2.5 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#86868B] uppercase font-bold block">Fecha & Horario</span>
            <p className="font-semibold text-xs text-[#1D1D1F] mt-0.5">{dateStr} • {timeStr}</p>
          </div>
          <div>
            <span className="text-[10px] text-[#86868B] uppercase font-bold block">Especialista</span>
            <p className="font-semibold text-xs text-[#1D1D1F] mt-0.5 truncate">{staffName} ({staffRating}★)</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="px-4 py-2.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-emerald-700 uppercase font-bold block">Depósito Pagado</span>
            <span className="font-bold text-xs text-emerald-700">${typeof depositPaid === 'number' ? depositPaid.toFixed(2) : depositPaid} MXN</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#86868B] uppercase font-bold block">Saldo en Salón</span>
            <span className="font-bold text-xs text-[#1D1D1F]">${typeof remainingBalance === 'number' ? remainingBalance.toFixed(2) : remainingBalance} MXN</span>
          </div>
        </div>

        {/* Location */}
        <div className="px-4 py-2 flex items-center gap-2 text-[11px] text-[#86868B] bg-[#FBFBFD]">
          <MapPin className="size-3 text-rose-500 shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {/* Actions */}
        <div className="p-3.5 space-y-2 bg-white">
          <Button
            onClick={handleCalendarSync}
            className={cn(
              "w-full h-10 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95",
              isSynced 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                : "bg-primary hover:brightness-105 text-white"
            )}
          >
            {isSynced ? (
              <>
                <Check className="size-3.5 stroke-[3]" />
                <span>✓ Sincronizado en Calendario</span>
              </>
            ) : (
              <>
                <CalendarPlus className="size-3.5" />
                <span>+ Guardar en Google / Apple Calendar</span>
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (onReschedule) onReschedule();
                else toast.info('Iniciando reprogramación...');
              }}
              className="h-9 rounded-xl text-xs font-semibold border-black/10 hover:bg-neutral-50 flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw className="size-3 text-primary" />
              <span>Reprogramar</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleCancelPass}
              className="h-9 rounded-xl text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-1 cursor-pointer"
            >
              <XCircle className="size-3" />
              <span>Cancelar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
