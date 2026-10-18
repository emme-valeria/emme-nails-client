import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WizardShell } from '@/shared/wizard/WizardShell';
import { useWizard } from '@/shared/wizard/useWizard';
import { DIRECT_SERVICES } from '@/entities/service/types';
import { ServiceSelector } from '@/features/select-service/ui/ServiceSelector';
import { NailLengthSelector, NailLength } from '@/features/configure-nails/ui/NailLengthSelector';
import { NailShapeSelector, NailShape } from '@/features/configure-nails/ui/NailShapeSelector';
import { NailColorSwatchSelector, NailColorOption } from '@/features/select-design/ui/NailColorSwatchSelector';
import { DesignFinishSelector, FinishType } from '@/features/select-design/ui/DesignFinishSelector';
import { NailArtSelector, NailArtDetail } from '@/features/select-design/ui/NailArtSelector';
import { AppointmentSlotSelector } from '@/features/select-availability/ui/AppointmentSlotSelector';
import { BookingConfirmationStep } from '@/features/create-booking/ui/BookingConfirmationStep';
import { InteractiveNailPreviewCard } from '@/shared/components/InteractiveNailPreviewCard';
import { calculatePricing } from '@/domains/pricing/pricing';
import { appointmentStore } from '@/domains/appointments/appointmentStore';
import { CheckCircle2, Trash2, Wrench } from 'lucide-react';

export function DirectBookingWizardWidget() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const wizard = useWizard({
    totalSteps: 8,
    initialData: {
      serviceId: 'gel-manicure',
      length: 'Medium' as NailLength,
      shape: 'Almond' as NailShape,
      color: 'Pink' as NailColorOption,
      colorHex: '#F4A2B8',
      finish: 'Glossy' as FinishType,
      hasNailArt: false,
      artDetails: [] as NailArtDetail[],
      removalNeeded: false,
      repairNeeded: false,
      artistId: 'any',
      dateISO: new Date().toISOString().split('T')[0],
      timeSlot: '04:00 PM'
    }
  });

  const selectedService = DIRECT_SERVICES.find((s) => s.id === wizard.data.serviceId) || DIRECT_SERVICES[0];

  const pricing = calculatePricing({
    serviceId: wizard.data.serviceId,
    length: wizard.data.length,
    finish: wizard.data.finish,
    hasNailArt: wizard.data.hasNailArt,
    artDetails: wizard.data.artDetails
  });

  // Calculate add-on costs
  let extraCost = 0;
  if (wizard.data.removalNeeded) extraCost += 100;
  if (wizard.data.repairNeeded) extraCost += 120;
  const finalTotalMXN = pricing.totalMXN + extraCost;
  const finalDepositMXN = pricing.depositMXN;

  const livePreviewData = {
    shape: wizard.data.shape,
    length: wizard.data.length,
    colorName: wizard.data.color,
    colorHex: wizard.data.colorHex,
    finish: wizard.data.finish,
    artStyle: wizard.data.hasNailArt && wizard.data.artDetails.length > 0 ? wizard.data.artDetails.join(', ') : 'Monocolor',
    serviceTitle: selectedService.name,
    estimatedPrice: finalTotalMXN,
    estimatedDuration: selectedService.durationMinutes + (wizard.data.removalNeeded ? 20 : 0)
  };

  const summaryItems = [
    { label: 'Servicio Base', value: selectedService.name, category: 'Servicio' },
    { label: 'Largo', value: wizard.data.length, category: 'Nails' },
    { label: 'Forma', value: wizard.data.shape, category: 'Nails' },
    { label: 'Color Base', value: wizard.data.color, category: 'Design' },
    { label: 'Acabado', value: wizard.data.finish, category: 'Design' },
    ...(wizard.data.hasNailArt && wizard.data.artDetails.length > 0
      ? [{ label: 'Nail Art', value: wizard.data.artDetails.join(', '), category: 'Design' }]
      : []),
    ...(wizard.data.removalNeeded ? [{ label: 'Adicional', value: 'Retiro previo (+ $100)' }] : []),
    ...(wizard.data.repairNeeded ? [{ label: 'Adicional', value: 'Tratamiento Fortalecedor (+ $120)' }] : []),
    ...(wizard.currentStep >= 7
      ? [
          { label: 'Fecha Cita', value: wizard.data.dateISO },
          { label: 'Hora Cita', value: wizard.data.timeSlot }
        ]
      : [])
  ];

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      appointmentStore.addAppointment({
        type: 'direct_service',
        serviceName: selectedService.name,
        length: wizard.data.length,
        shape: wizard.data.shape,
        finish: wizard.data.finish,
        nailArtDetails: wizard.data.artDetails,
        artistName: wizard.data.artistId === 'any' ? 'Cualquier artista libre' : 'Valeria Arriaza',
        dateISO: wizard.data.dateISO,
        timeSlot: wizard.data.timeSlot,
        totalMXN: finalTotalMXN,
        depositPaidMXN: finalDepositMXN,
        status: 'confirmed'
      });
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 600);
  };

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-card border border-border/80 shadow-lg text-center space-y-5">
        <div className="size-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-foreground">¡Cita Confirmada y Anticipo Pagado!</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Hemos agendado tu cita de <strong>{selectedService.name}</strong> ({wizard.data.length} {wizard.data.shape}) para el <strong>{wizard.data.dateISO} a las {wizard.data.timeSlot}</strong>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-primary/10 text-primary text-xs font-bold space-y-1 text-left border border-primary/20">
          <div className="flex justify-between">
            <span>Total servicio:</span>
            <span>${finalTotalMXN} MXN</span>
          </div>
          <div className="flex justify-between font-black">
            <span>Anticipo pagado:</span>
            <span>${finalDepositMXN} MXN</span>
          </div>
          <div className="flex justify-between text-muted-foreground font-normal border-t border-primary/20 pt-1">
            <span>Saldo a pagar en salón:</span>
            <span>${finalTotalMXN - finalDepositMXN} MXN</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/agenda')}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-primary hover:brightness-105 font-extrabold text-xs text-white cursor-pointer shadow-md transition-all active:scale-95"
          >
            Ver mis Citas en Agenda
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
          ? 'Paso 1: Servicio Base'
          : wizard.currentStep === 2
          ? 'Paso 2: Largo de la Uña'
          : wizard.currentStep === 3
          ? 'Paso 3: Forma de la Uña'
          : wizard.currentStep === 4
          ? 'Paso 4: Gama Cromática'
          : wizard.currentStep === 5
          ? 'Paso 5: Acabado y Textura'
          : wizard.currentStep === 6
          ? 'Paso 6: Nail Art y Cuidados'
          : wizard.currentStep === 7
          ? 'Paso 7: Manicurista y Horario'
          : 'Paso 8: Confirma tu Reserva'
      }
      stepSubtitle={
        wizard.currentStep === 1
          ? 'Selecciona la técnica principal para tu manicura.'
          : wizard.currentStep === 2
          ? 'Selecciona la longitud milimétrica ideal para tus uñas.'
          : wizard.currentStep === 3
          ? 'Elige el contorno estilizado de las puntas.'
          : wizard.currentStep === 4
          ? 'Escoge el tono de esmalte o gama cromática base.'
          : wizard.currentStep === 5
          ? 'Añade la textura final: brillo espejo, mate o cromo.'
          : wizard.currentStep === 6
          ? 'Selecciona el nivel de arte a mano alzada o retiro previo.'
          : wizard.currentStep === 7
          ? 'Escoge a tu especialista preferida, fecha y hora libre.'
          : 'Revisa el desglose transparente y confirma tu cita con el anticipo.'
      }
      onBack={wizard.prevStep}
      onNext={wizard.nextStep}
      canNext={true}
      isSubmitting={isSubmitting}
      summaryItems={summaryItems}
      priceEstimate={{ ...pricing, totalMXN: finalTotalMXN }}
      livePreviewConfig={livePreviewData}
    >
      {/* Mobile Top Live Interactive Preview (Hidden on mobile for Steps 1-7, only shown as Grand Reveal on Step 8) */}
      {wizard.currentStep === 8 && (
        <div className="lg:hidden mb-6 mt-2">
          <InteractiveNailPreviewCard
            shape={wizard.data.shape}
            length={wizard.data.length}
            colorName={wizard.data.color}
            colorHex={wizard.data.colorHex}
            finish={wizard.data.finish}
            artStyle={wizard.data.hasNailArt && wizard.data.artDetails.length > 0 ? wizard.data.artDetails.join(', ') : 'Monocolor'}
            serviceTitle={selectedService.name}
            estimatedPrice={finalTotalMXN}
            estimatedDuration={selectedService.durationMinutes}
            compact={false} /* Full detail for the final reveal */
          />
        </div>
      )}

      {/* STEP 1 — Base Service Selection */}
      {wizard.currentStep === 1 && (
        <ServiceSelector
          services={DIRECT_SERVICES}
          selectedId={wizard.data.serviceId}
          onSelect={(id) => {
            wizard.autoAdvance({ serviceId: id });
          }}
        />
      )}

      {/* STEP 2 — Nail Length Selector */}
      {wizard.currentStep === 2 && (
        <NailLengthSelector
          selectedLength={wizard.data.length}
          onSelect={(len) => {
            wizard.autoAdvance({ length: len });
          }}
        />
      )}

      {/* STEP 3 — Nail Shape Selector */}
      {wizard.currentStep === 3 && (
        <NailShapeSelector
          selectedShape={wizard.data.shape}
          onSelect={(shp) => {
            wizard.autoAdvance({ shape: shp });
          }}
        />
      )}

      {/* STEP 4 — Color Swatch Selector */}
      {wizard.currentStep === 4 && (
        <NailColorSwatchSelector
          selectedColor={wizard.data.color}
          selectedColorHex={wizard.data.colorHex}
          onSelectColor={(col, hex) => {
            wizard.autoAdvance({ color: col, colorHex: hex });
          }}
        />
      )}

      {/* STEP 5 — Surface Finish Texture */}
      {wizard.currentStep === 5 && (
        <DesignFinishSelector
          selectedFinish={wizard.data.finish}
          onSelect={(fin) => {
            wizard.autoAdvance({ finish: fin });
          }}
        />
      )}

      {/* STEP 6 — Nail Art & Add-ons */}
      {wizard.currentStep === 6 && (
        <div className="space-y-6">
          <NailArtSelector
            hasNailArt={wizard.data.hasNailArt}
            selectedDetails={wizard.data.artDetails}
            onToggleHasNailArt={(has) => wizard.updateData({ hasNailArt: has })}
            onToggleDetail={(detail) => {
              const current = wizard.data.artDetails;
              const exists = current.includes(detail);
              const updated = exists
                ? current.filter((d) => d !== detail)
                : [...current, detail];
              wizard.updateData({ artDetails: updated });
            }}
          />

          <hr className="border-border/40" />

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
              Servicios Adicionales / Estado de la Uña:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                wizard.data.removalNeeded
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-card border-border/70 hover:bg-secondary/40 text-foreground'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={wizard.data.removalNeeded}
                    onChange={(e) => wizard.updateData({ removalNeeded: e.target.checked })}
                    className="size-4 rounded text-primary accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="font-extrabold block">Retiro de Esmalte Anterior</span>
                    <span className="text-[10px] text-muted-foreground">+ $100 MXN · 20 min</span>
                  </div>
                </div>
                <Trash2 className="size-4 text-muted-foreground" />
              </label>

              <label className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                wizard.data.repairNeeded
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-card border-border/70 hover:bg-secondary/40 text-foreground'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={wizard.data.repairNeeded}
                    onChange={(e) => wizard.updateData({ repairNeeded: e.target.checked })}
                    className="size-4 rounded text-primary accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="font-extrabold block">Tratamiento Fortalecedor</span>
                    <span className="text-[10px] text-muted-foreground">+ $120 MXN · Keratina</span>
                  </div>
                </div>
                <Wrench className="size-4 text-muted-foreground" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7 — Choose appointment slot */}
      {wizard.currentStep === 7 && (
        <AppointmentSlotSelector
          selectedArtistId={wizard.data.artistId}
          selectedDate={wizard.data.dateISO}
          selectedSlot={wizard.data.timeSlot}
          onSelectArtist={(id) => wizard.updateData({ artistId: id })}
          onSelectDate={(date) => wizard.updateData({ dateISO: date })}
          onSelectSlot={(slot) => wizard.updateData({ timeSlot: slot })}
        />
      )}

      {/* STEP 8 — Confirm & Pay Deposit */}
      {wizard.currentStep === 8 && (
        <BookingConfirmationStep
          serviceName={selectedService.name}
          length={wizard.data.length}
          shape={wizard.data.shape}
          finish={wizard.data.finish}
          artistName={wizard.data.artistId === 'any' ? 'Cualquier artista' : 'Valeria Arriaza'}
          dateString={wizard.data.dateISO}
          timeSlot={wizard.data.timeSlot}
          totalMXN={finalTotalMXN}
          depositMXN={finalDepositMXN}
          onConfirmAndPay={handleConfirmBooking}
          isSubmitting={isSubmitting}
        />
      )}
    </WizardShell>
  );
}
