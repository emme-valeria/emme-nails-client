import React from 'react';
import { Calendar, Clock, User, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';

interface BookingConfirmationStepProps {
  serviceName: string;
  length: string;
  shape: string;
  finish: string;
  artistName: string;
  dateString: string;
  timeSlot: string;
  totalMXN: number;
  depositMXN: number;
  onConfirmAndPay: () => void;
  isSubmitting?: boolean;
}

export function BookingConfirmationStep({
  serviceName,
  length,
  shape,
  finish,
  artistName,
  dateString,
  timeSlot,
  totalMXN,
  depositMXN,
  onConfirmAndPay,
  isSubmitting = false
}: BookingConfirmationStepProps) {
  return (
    <div className="space-y-6">
      {/* Confirmation Summary Card */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Confirmación de Cita
          </span>
          <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Paso Final
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-black text-foreground">{serviceName}</h3>
              <p className="text-xs font-bold text-muted-foreground mt-0.5">
                {length} · {shape} · {finish}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-primary shrink-0" />
              <span className="font-bold text-foreground">{dateString}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4 text-primary shrink-0" />
              <span className="font-bold text-foreground">{timeSlot}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground col-span-1 sm:col-span-2">
              <User className="size-4 text-primary shrink-0" />
              <span className="font-bold text-foreground">Artista: {artistName}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Deposit Callout */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">
              Total Servicio
            </span>
            <span className="text-lg font-black text-foreground">
              ${totalMXN} MXN
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-extrabold text-primary block uppercase">
              Anticipo para Reservar
            </span>
            <span className="text-lg font-black text-primary">
              ${depositMXN} MXN
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-3">
        <ShieldCheck className="size-5 text-primary shrink-0" />
        <span>
          El anticipo de ${depositMXN} MXN asegura tu lugar en la agenda. El saldo restante de ${totalMXN - depositMXN} MXN se paga al finalizar tu cita.
        </span>
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={onConfirmAndPay}
        className="w-full h-12 rounded-2xl bg-primary hover:brightness-105 active:scale-[0.98] font-extrabold text-xs text-white shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <CreditCard className="size-4" />
        <span>
          {isSubmitting
            ? 'Creando cita y procesando...'
            : `Confirmar Cita y Pagar Anticipo ($${depositMXN} MXN)`}
        </span>
      </button>
    </div>
  );
}
