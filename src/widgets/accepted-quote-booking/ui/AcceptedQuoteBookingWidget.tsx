import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WizardShell } from '@/shared/wizard/WizardShell';
import { useWizard } from '@/shared/wizard/useWizard';
import { quoteStore } from '@/domains/quotes/quoteStore';
import { appointmentStore } from '@/domains/appointments/appointmentStore';
import { AcceptedQuoteReviewStep } from '@/features/accept-quote/ui/AcceptedQuoteReviewStep';
import { AppointmentSlotSelector } from '@/features/select-availability/ui/AppointmentSlotSelector';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function AcceptedQuoteBookingWidget() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const quote = quoteStore.getQuoteById(quoteId || 'quote-101');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const wizard = useWizard({
    totalSteps: 2,
    initialData: {
      accepted: false,
      artistId: 'valeria',
      dateISO: new Date().toISOString().split('T')[0],
      timeSlot: '04:00 PM'
    }
  });

  if (!quote) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cotización no encontrada.
      </div>
    );
  }

  const total = quote.confirmedPriceMXN || quote.estimatedMinPriceMXN;
  const deposit = quote.depositRequiredMXN || Math.round(total * 0.3);

  const priceEstimateObj = {
    totalMXN: total,
    depositMXN: deposit,
    breakdown: [{ label: 'Cotización Aprobada', amountMXN: total }]
  };

  const summaryItems = [
    { label: 'Cotización', value: `#${quote.id}` },
    { label: 'Servicio', value: quote.baseServiceName },
    { label: 'Estructura', value: `${quote.length} · ${quote.shape}` },
    { label: 'Acabado', value: quote.finish },
    ...(wizard.currentStep === 2
      ? [
          { label: 'Fecha', value: wizard.data.dateISO },
          { label: 'Hora', value: wizard.data.timeSlot }
        ]
      : [])
  ];

  const handlePayAndConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      quoteStore.updateQuoteStatus(quote.id, 'booked');
      appointmentStore.addAppointment({
        type: 'accepted_quote',
        quoteId: quote.id,
        serviceName: quote.baseServiceName,
        length: quote.length,
        shape: quote.shape,
        finish: quote.finish,
        nailArtDetails: quote.details,
        artistName: 'Valeria Arriaza',
        dateISO: wizard.data.dateISO,
        timeSlot: wizard.data.timeSlot,
        totalMXN: total,
        depositPaidMXN: deposit,
        status: 'confirmed'
      });
      setIsSubmitting(false);
      setIsBooked(true);
    }, 600);
  };

  if (isBooked) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-card border border-border/80 shadow-lg text-center space-y-5">
        <div className="size-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-foreground">¡Cita Agendada Exitosamente!</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tu cotización <strong>#{quote.id}</strong> ha sido agendada para el <strong>{wizard.data.dateISO} a las {wizard.data.timeSlot}</strong>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-primary/10 text-primary text-xs font-bold space-y-1 text-left border border-primary/20">
          <div className="flex justify-between">
            <span>Total servicio:</span>
            <span>${total} MXN</span>
          </div>
          <div className="flex justify-between font-black">
            <span>Anticipo pagado:</span>
            <span>${deposit} MXN</span>
          </div>
          <div className="flex justify-between text-muted-foreground font-normal border-t border-primary/20 pt-1">
            <span>Saldo restante:</span>
            <span>${total - deposit} MXN</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/agenda')}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-primary hover:brightness-105 font-extrabold text-xs text-white cursor-pointer shadow-md transition-all active:scale-95"
          >
            Ver Cita en Agenda
          </button>
          <button
            type="button"
            onClick={() => navigate('/booking')}
            className="w-full sm:w-auto h-11 px-5 rounded-2xl border border-border font-bold text-xs text-foreground hover:bg-secondary/60 cursor-pointer"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <WizardShell
      currentStep={wizard.currentStep}
      totalSteps={wizard.totalSteps}
      stepTitle={
        wizard.currentStep === 1
          ? 'Revisar Cotización Recibida'
          : 'Seleccionar Horario y Pagar Anticipo'
      }
      stepSubtitle={
        wizard.currentStep === 1
          ? 'El salón ha preparado la siguiente propuesta formal.'
          : 'Elige el horario de tu preferencia para asegurar tu cita.'
      }
      onBack={wizard.prevStep}
      onNext={wizard.currentStep === 2 ? handlePayAndConfirm : undefined}
      canNext={true}
      nextLabel="Pagar Anticipo y Confirmar Cita"
      isSubmitting={isSubmitting}
      summaryItems={summaryItems}
      priceEstimate={priceEstimateObj}
    >
      {/* Step 1 — Review quote */}
      {wizard.currentStep === 1 && (
        <AcceptedQuoteReviewStep
          quote={quote}
          onAccept={() => {
            wizard.updateData({ accepted: true });
            wizard.nextStep();
          }}
          onRequestChanges={() => {
            alert('Enviando solicitud de ajuste a la manicurista...');
          }}
          onDecline={() => {
            navigate('/booking');
          }}
        />
      )}

      {/* Step 2 — Select slot and pay */}
      {wizard.currentStep === 2 && (
        <AppointmentSlotSelector
          selectedArtistId={wizard.data.artistId}
          selectedDate={wizard.data.dateISO}
          selectedSlot={wizard.data.timeSlot}
          onSelectArtist={(artId) => wizard.updateData({ artistId: artId })}
          onSelectDate={(dt) => wizard.updateData({ dateISO: dt })}
          onSelectSlot={(slt) => wizard.updateData({ timeSlot: slt })}
        />
      )}
    </WizardShell>
  );
}
