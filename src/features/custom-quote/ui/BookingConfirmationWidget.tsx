import React, { useState } from 'react';
import { Quote } from '@/domain/quotes/entities/QuoteRequest';
import { Calendar, Clock, CreditCard, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@emme/ui/button';

interface BookingConfirmationWidgetProps {
  quote?: Quote;
  onAppointmentCreated?: (appointmentId: string) => void;
}

export function BookingConfirmationWidget({ quote, onAppointmentCreated }: BookingConfirmationWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-20');
  const [selectedTime, setSelectedTime] = useState<string>('16:00');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const TIME_SLOTS = ['09:30', '12:00', '14:30', '16:00', '18:30'];

  const deposit = quote?.requiredDeposit || 300;
  const remaining = quote?.remainingBalance || 800;

  const handlePayAndConfirm = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsConfirmed(true);
      if (onAppointmentCreated) {
        onAppointmentCreated(`apt-confirmed-${Date.now()}`);
      }
    }, 1200);
  };

  return (
    <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-md space-y-4 max-w-lg my-2">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-sm font-extrabold text-foreground">Confirmación de Cita & Pago de Anticipo</h3>
        </div>
      </div>

      {!isConfirmed ? (
        <>
          {/* Slot Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              <span>1. Selecciona el Día y Horario Disponible:</span>
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-bold text-foreground"
            />

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-secondary/40 text-muted-foreground border-border/60 hover:bg-secondary'
                    }`}
                  >
                    {slot} hs
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deposit Payment Box */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span>Monto de Anticipo a Pagar Hoy:</span>
              <span className="text-base font-black text-primary">${deposit} MXN</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Saldo restante a pagar en el salón:</span>
              <span className="font-bold text-foreground">${remaining} MXN</span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>Pago 100% encriptado con garantía de devolución por cancelación de 24h.</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handlePayAndConfirm}
            disabled={isProcessingPayment}
            className="w-full h-12 rounded-2xl bg-primary text-white font-extrabold text-xs shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="size-4" />
            <span>
              {isProcessingPayment ? 'Procesando Pago Seguro...' : `Pagar $${deposit} MXN y Confirmar Cita`}
            </span>
          </Button>
        </>
      ) : (
        <div className="p-6 rounded-3xl bg-primary/[0.04] border border-primary/20 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-base font-black text-[#1D1D1F]">¡Cita Confirmada con Éxito!</h4>
            <p className="text-xs text-[#86868B] font-medium mt-0.5">
              Tu turno ha sido congelado para el <strong className="text-[#1D1D1F] font-bold">{selectedDate} a las {selectedTime} hs</strong>.
            </p>
          </div>
          <p className="text-[10px] text-primary font-bold uppercase bg-primary/10 border border-primary/15 py-1.5 px-3 rounded-full inline-block">
            Pase de Cita Generado • Código #APT-{Date.now().toString().slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
}
