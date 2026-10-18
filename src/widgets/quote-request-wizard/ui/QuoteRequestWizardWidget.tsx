import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WizardShell } from '@/shared/wizard/WizardShell';
import { useWizard } from '@/shared/wizard/useWizard';
import { ServiceSelector } from '@/features/select-service/ui/ServiceSelector';
import { NailConfigurationStep } from '@/features/configure-nails/ui/NailConfigurationStep';
import { NailLength } from '@/features/configure-nails/ui/NailLengthSelector';
import { NailShape } from '@/features/configure-nails/ui/NailShapeSelector';
import { ReferenceUploader } from '@/features/upload-reference/ui/ReferenceUploader';
import { DesignFinishSelector, FinishType } from '@/features/select-design/ui/DesignFinishSelector';
import { NailArtDetail } from '@/features/select-design/ui/NailArtSelector';
import { QuoteReviewStep } from '@/features/submit-quote-request/ui/QuoteReviewStep';
import { calculateQuoteEstimate } from '@/domains/pricing/pricing';
import { quoteStore } from '@/domains/quotes/quoteStore';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const BASE_SERVICES_QUOTE = [
  { id: 'gel-manicure', name: 'Gel manicure', description: 'Base para uñas naturales o baño de gel.' },
  { id: 'acrylic-set', name: 'Acrylic set', description: 'Extensión escultural de alta durabilidad.' },
  { id: 'gel-extensions', name: 'Gel extensions', description: 'Tips de gel suave / polygel ligero.' },
  { id: 'not-sure', name: 'Not sure', description: 'Asesoría de técnica según tu foto de referencia.' }
];

export function QuoteRequestWizardWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilled = location.state?.prefilledData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdQuoteId, setCreatedQuoteId] = useState<string | null>(null);

  const wizard = useWizard({
    totalSteps: 5,
    initialData: {
      baseServiceId: prefilled?.baseServiceId || 'gel-extensions',
      length: (prefilled?.length as NailLength) || 'Medium',
      shape: (prefilled?.shape as NailShape) || 'Almond',
      explanationMode: 'upload' as 'inspiration' | 'upload' | 'describe' | 'combined',
      referenceImages: prefilled?.imageUrl ? [prefilled.imageUrl] : ([] as string[]),
      descriptionText: prefilled?.descriptionText || '',
      finish: (prefilled?.finish as FinishType) || 'Chrome',
      details: (prefilled?.details as NailArtDetail[]) || ['Flowers', 'French']
    }
  });

  const selectedBaseService =
    BASE_SERVICES_QUOTE.find((s) => s.id === wizard.data.baseServiceId) || BASE_SERVICES_QUOTE[0];

  const estimate = calculateQuoteEstimate(
    wizard.data.baseServiceId,
    wizard.data.length,
    wizard.data.finish,
    wizard.data.details
  );

  const priceEstimateObj = {
    totalMXN: estimate.minMXN,
    depositMXN: estimate.depositMXN,
    minMXN: estimate.minMXN,
    maxMXN: estimate.maxMXN,
    isEstimateOnly: true,
    breakdown: []
  };

  const summaryItems = [
    { label: 'Servicio Base', value: selectedBaseService.name },
    { label: 'Largo y Forma', value: `${wizard.data.length} · ${wizard.data.shape}` },
    { label: 'Acabado', value: wizard.data.finish },
    { label: 'Detalles Arte', value: wizard.data.details.length > 0 ? wizard.data.details.join(', ') : 'Ninguno' },
    { label: 'Referencias', value: `${wizard.data.referenceImages.length} fotos` }
  ];

  const handleSubmitQuote = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const created = quoteStore.addQuote({
        baseServiceId: wizard.data.baseServiceId,
        baseServiceName: selectedBaseService.name,
        length: wizard.data.length,
        shape: wizard.data.shape,
        explanationMode: wizard.data.explanationMode,
        referenceImages: wizard.data.referenceImages,
        descriptionText: wizard.data.descriptionText,
        finish: wizard.data.finish,
        details: wizard.data.details,
        estimatedMinPriceMXN: estimate.minMXN,
        estimatedMaxPriceMXN: estimate.maxMXN,
        depositRequiredMXN: estimate.depositMXN
      });
      setIsSubmitting(false);
      setCreatedQuoteId(created.id);
    }, 600);
  };

  if (createdQuoteId) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-card border border-border/80 shadow-lg text-center space-y-5">
        <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-8 stroke-[3]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-foreground">¡Solicitud de Cotización Enviada!</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Hemos registrado tu solicitud con folio <strong>#{createdQuoteId}</strong>. La manicurista confirmará los detalles y precio exacto en breve.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 text-xs text-foreground space-y-1 text-left">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rango estimado:</span>
            <span className="font-extrabold">${estimate.minMXN} – ${estimate.maxMXN} MXN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Detalles:</span>
            <span className="font-bold">{wizard.data.finish} · {wizard.data.details.join(', ')}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/quotes/${createdQuoteId}/book`)}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-primary font-extrabold text-xs text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Simular Respuesta y Agendar Cita</span>
            <ArrowRight className="size-4" />
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

  const livePreviewData = {
    shape: wizard.data.shape,
    length: wizard.data.length,
    colorName: 'Pink',
    finish: wizard.data.finish,
    artStyle: wizard.data.details.length > 0 ? wizard.data.details.join(', ') : 'Custom',
    serviceTitle: selectedBaseService.name,
    estimatedPrice: estimate.minMXN,
    estimatedDuration: 90
  };

  return (
    <WizardShell
      currentStep={wizard.currentStep}
      totalSteps={wizard.totalSteps}
      stepTitle={
        wizard.currentStep === 1
          ? '¿Qué servicio necesitas?'
          : wizard.currentStep === 2
          ? 'Cuéntanos sobre tus uñas'
          : wizard.currentStep === 3
          ? '¿Cómo prefieres explicar tu diseño?'
          : wizard.currentStep === 4
          ? '¿Qué estilo y acabado buscas?'
          : 'Revisa y envía tu cotización'
      }
      stepSubtitle={
        wizard.currentStep === 1
          ? 'Selecciona el servicio base aproximado o elige "Not sure".'
          : wizard.currentStep === 2
          ? 'Elige el largo y la forma deseada.'
          : wizard.currentStep === 3
          ? 'Puedes elegir inspiración, adjuntar fotos o describir tu idea.'
          : wizard.currentStep === 4
          ? 'Indica el acabado y los elementos de arte.'
          : 'Presupuesto aproximado listo. Revisa antes de enviar.'
      }
      onBack={wizard.prevStep}
      onNext={wizard.nextStep}
      canNext={true}
      isSubmitting={isSubmitting}
      summaryItems={summaryItems}
      priceEstimate={priceEstimateObj}
      livePreviewConfig={livePreviewData}
    >
      {/* Step 1 — Choose the base service */}
      {wizard.currentStep === 1 && (
        <ServiceSelector
          services={BASE_SERVICES_QUOTE}
          selectedId={wizard.data.baseServiceId}
          showPrices={false}
          onSelect={(id) => wizard.autoAdvance({ baseServiceId: id })}
        />
      )}

      {/* Step 2 — Choose nail setup */}
      {wizard.currentStep === 2 && (
        <NailConfigurationStep
          length={wizard.data.length}
          shape={wizard.data.shape}
          onChangeLength={(len) => wizard.updateData({ length: len })}
          onChangeShape={(shp) => wizard.updateData({ shape: shp })}
        />
      )}

      {/* Step 3 — Choose how to explain the design */}
      {wizard.currentStep === 3 && (
        <ReferenceUploader
          explanationMode={wizard.data.explanationMode}
          referenceImages={wizard.data.referenceImages}
          descriptionText={wizard.data.descriptionText}
          onModeChange={(mode) => wizard.updateData({ explanationMode: mode })}
          onImagesChange={(imgs) => wizard.updateData({ referenceImages: imgs })}
          onDescriptionChange={(txt) => wizard.updateData({ descriptionText: txt })}
          onNavigateToInspiration={() => navigate('/quotes/inspiration')}
        />
      )}

      {/* Step 4 — Choose design characteristics */}
      {wizard.currentStep === 4 && (
        <div className="space-y-6">
          <DesignFinishSelector
            selectedFinish={wizard.data.finish}
            onSelect={(fin) => wizard.updateData({ finish: fin })}
          />

          <hr className="border-border/40" />

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
              Detalles de Nail Art
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(['French', 'Aura', 'Flowers', 'Charms', '3D'] as NailArtDetail[]).map((detail) => {
                const isSelected = wizard.data.details.includes(detail);

                return (
                  <button
                    key={detail}
                    type="button"
                    onClick={() => {
                      const updated = isSelected
                        ? wizard.data.details.filter((d) => d !== detail)
                        : [...wizard.data.details, detail];
                      wizard.updateData({ details: updated });
                    }}
                    className={`p-3 rounded-2xl border font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-card border-border/70 hover:bg-secondary/40 text-foreground'
                    }`}
                  >
                    {detail}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 5 — Review and submit */}
      {wizard.currentStep === 5 && (
        <QuoteReviewStep
          baseServiceName={selectedBaseService.name}
          length={wizard.data.length}
          shape={wizard.data.shape}
          finish={wizard.data.finish}
          details={wizard.data.details}
          referenceImagesCount={wizard.data.referenceImages.length}
          minMXN={estimate.minMXN}
          maxMXN={estimate.maxMXN}
          depositMXN={estimate.depositMXN}
          onEdit={() => wizard.goToStep(1)}
          onSubmit={handleSubmitQuote}
          isSubmitting={isSubmitting}
        />
      )}
    </WizardShell>
  );
}
