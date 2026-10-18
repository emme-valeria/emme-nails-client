import React, { useState } from 'react';
import { CustomQuoteProvider, useCustomQuote } from '../model/quote-request-context';
import { NailShapeSelector, NailShape } from '@/shared/components/NailShapeSelector';
import { NailLengthSelector, NailLength } from '@/shared/components/NailLengthSelector';
import { NailColorSwatchSelector, NailColorKey } from '@/shared/components/NailColorSwatchSelector';
import { InteractiveNailPreviewCard } from '@/shared/components/InteractiveNailPreviewCard';
import { DesignFinishSelector } from '@/features/select-design/ui/DesignFinishSelector';
import { ReferenceImagesWidget } from '@/features/quote-flow/widgets/ReferenceImagesWidget';
import { PriceBreakdown } from '@/shared/components/PriceBreakdown';
import { QuoteFlowProvider } from '@/features/quote-flow/model/quote-flow.context';
import { SubmitQuoteRequestUseCase } from '@/domain/quotes/application/use-cases/submit-quote-request';
import { CalculateQuoteEstimateUseCase } from '@/domain/quotes/application/use-cases/calculate-quote-estimate';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Sparkles, ArrowLeft, ArrowRight, Send, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CustomQuoteWizardContentProps {
  onSwitchToDirectBooking: () => void;
}

function CustomQuoteWizardContent({ onSwitchToDirectBooking }: CustomQuoteWizardContentProps) {
  const { state, dispatch } = useCustomQuote();
  const [selectedColor, setSelectedColor] = useState<NailColorKey>('Pink');

  const handleNext = () => {
    if (state.currentStep === 'structured-form') dispatch({ type: 'SET_STEP', payload: 'inspiration-and-references' });
    else if (state.currentStep === 'inspiration-and-references') dispatch({ type: 'SET_STEP', payload: 'review-and-submit' });
  };

  const handleBack = () => {
    if (state.currentStep === 'inspiration-and-references') dispatch({ type: 'SET_STEP', payload: 'structured-form' });
    else if (state.currentStep === 'review-and-submit') dispatch({ type: 'SET_STEP', payload: 'inspiration-and-references' });
  };

  // Calculate estimated price range using deterministic domain use case
  const estimateUseCase = new CalculateQuoteEstimateUseCase();
  const estimate = estimateUseCase.execute({
    serviceBasePrice: 850,
    nailConfig: state.nailConfig,
    designDetails: state.designDetails,
  });

  const handleFinalSubmit = () => {
    const useCase = new SubmitQuoteRequestUseCase();
    const request = useCase.execute({
      clientId: 'cli-123',
      clientName: 'Cliente Emme',
      serviceId: state.serviceId,
      serviceTitle: state.serviceTitle,
      nailConfig: state.nailConfig,
      designDetails: state.designDetails,
      referenceImages: state.referenceImages,
      schedulePref: state.schedulePref,
    });

    dispatch({ type: 'SUBMIT_SUCCESS', payload: request });
  };

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border border-border/80 shadow-md bg-card space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase border border-primary/20 flex items-center gap-1 w-fit">
            <Sparkles className="size-3" />
            Cotización Personalizada
          </span>
          <h2 className="text-base font-black text-foreground mt-1">Cotizar Diseño Exclusivo con Simulador Visual</h2>
        </div>
        {state.currentStep !== 'structured-form' && state.currentStep !== 'submitted' && (
          <Button type="button" variant="ghost" size="sm" onClick={handleBack} className="text-xs font-bold">
            <ArrowLeft className="size-3.5 mr-1" />
            Atrás
          </Button>
        )}
      </div>

      {/* Real-time Previsualization Card (Active on steps 1 and 3) */}
      {state.currentStep !== 'submitted' && (
        <InteractiveNailPreviewCard
          shape={state.nailConfig.shape}
          length={state.nailConfig.length}
          colorName={selectedColor}
          finish={state.designDetails.finish}
          artStyle={state.designDetails.complexity}
          serviceTitle={state.serviceTitle || 'Diseño de Autor'}
          estimatedPrice={estimate.maxPrice}
          estimatedDuration={estimate.estimatedDurationMinutes}
        />
      )}

      {/* STEP 1: Structured Form Inputs */}
      {state.currentStep === 'structured-form' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-foreground">1. Configuración Estructurada del Diseño</h3>
            <p className="text-[11px] text-muted-foreground">
              Personaliza forma, largo, gama cromática y acabado para calcular tu presupuesto exacto.
            </p>
          </div>

          {/* Nail Type */}
          <div className="space-y-2">
            <label className="text-xs font-black text-foreground block uppercase tracking-wider text-muted-foreground">
              Tipo de Estructura
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { nailType: 'natural' } })}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  state.nailConfig.nailType === 'natural'
                    ? 'border-primary bg-primary/10 text-primary font-black ring-2 ring-primary/20'
                    : 'border-border/60 bg-card text-foreground'
                }`}
              >
                <span>Uña Natural (Kapping Gel)</span>
                {state.nailConfig.nailType === 'natural' && <CheckCircle2 className="size-4 text-primary" />}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { nailType: 'extension' } })}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  state.nailConfig.nailType === 'extension'
                    ? 'border-primary bg-primary/10 text-primary font-black ring-2 ring-primary/20'
                    : 'border-border/60 bg-card text-foreground'
                }`}
              >
                <span>Extensiones (Acrílico / Gel-X)</span>
                {state.nailConfig.nailType === 'extension' && <CheckCircle2 className="size-4 text-primary" />}
              </button>
            </div>
          </div>

          {/* SVG Shape Selector */}
          <NailShapeSelector
            selectedShape={state.nailConfig.shape as NailShape}
            onSelectShape={(shape) => dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { shape: shape.toLowerCase() as any } })}
          />

          {/* SVG Length Selector */}
          <NailLengthSelector
            selectedLength={state.nailConfig.length as NailLength}
            onSelectLength={(length) => dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { length: length.toLowerCase() as any } })}
          />

          {/* Color Swatch Grid: Nude · Pink · Red · White · Chrome · Dark · Custom */}
          <NailColorSwatchSelector
            selectedColor={selectedColor}
            onSelectColor={(c) => setSelectedColor(c)}
            selectedShape={state.nailConfig.shape}
          />

          {/* Real Salon Finish Swatches */}
          <DesignFinishSelector
            selectedFinish={state.designDetails.finish}
            onSelect={(finish) => dispatch({ type: 'UPDATE_DESIGN_DETAILS', payload: { finish: finish.toLowerCase() as any } })}
          />

          {/* Description Text */}
          <div className="space-y-1">
            <label className="text-xs font-black text-foreground block">Detalles o Indicaciones de Arte (Opcional)</label>
            <textarea
              rows={2}
              placeholder="Ej: 'Quiero destellos dorados en el dedo anular y efecto cromo en el resto...'"
              value={state.designDetails.description}
              onChange={(e) => dispatch({ type: 'UPDATE_DESIGN_DETAILS', payload: { description: e.target.value } })}
              className="w-full p-3 rounded-2xl border border-border/80 bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <Button
            type="button"
            onClick={handleNext}
            className="w-full bg-primary text-white text-xs font-black h-11 rounded-2xl cursor-pointer shadow-md hover:brightness-105"
          >
            <span>Siguiente: Cargar Fotos de Referencia</span>
            <ArrowRight className="size-4 ml-1.5" />
          </Button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onSwitchToDirectBooking}
              className="text-xs text-muted-foreground hover:text-primary font-bold underline"
            >
              ¿Prefieres agendar un servicio directo del catálogo? Haz clic aquí
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Inspiration & Photos */}
      {state.currentStep === 'inspiration-and-references' && (
        <QuoteFlowProvider>
          <div className="space-y-5">
            <ReferenceImagesWidget
              onAiAnalysisComplete={(analysis) => {
                let mapLength = 'medium';
                if (analysis.detectedLength.includes('Corto')) mapLength = 'short';
                if (analysis.detectedLength.includes('Largo (L)')) mapLength = 'long';
                if (analysis.detectedLength.includes('XL')) mapLength = 'xl';

                let mapShape = 'almond';
                if (analysis.detectedShape.includes('Cuadrada')) mapShape = 'square';
                if (analysis.detectedShape.includes('Ovalada')) mapShape = 'oval';
                if (analysis.detectedShape.includes('Stiletto')) mapShape = 'stiletto';
                if (analysis.detectedShape.includes('Coffin')) mapShape = 'coffin';

                dispatch({ type: 'UPDATE_NAIL_CONFIG', payload: { length: mapLength as any, shape: mapShape as any } });
                dispatch({ type: 'UPDATE_DESIGN_DETAILS', payload: { description: analysis.description, complexity: analysis.complexity.toLowerCase().includes('básico') ? 'minimal' : analysis.complexity.toLowerCase().includes('intermedio') ? 'medium' : 'intricate' as any } });
              }}
            />
            <Button
              type="button"
              onClick={handleNext}
              className="w-full bg-primary text-white text-xs font-black h-11 rounded-2xl cursor-pointer"
            >
              <span>Revisar Cotización y Enviar al Salón</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </QuoteFlowProvider>
      )}

      {/* STEP 3: Review & Submit */}
      {state.currentStep === 'review-and-submit' && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-foreground">3. Resumen de tu Solicitud de Cotización</h3>
            <p className="text-[11px] text-muted-foreground">
              Revisa los detalles finales antes de enviarlo a nuestras manicuristas para confirmación oficial.
            </p>
          </div>

          <PriceBreakdown
            items={estimate.breakdownItems.map((item) => ({
              id: item.id,
              label: item.description,
              amount: item.amount,
            }))}
            totalPrice={estimate.maxPrice}
            depositAmount={250}
            estimatedDurationMinutes={estimate.estimatedDurationMinutes}
            isEstimatedQuote={true}
          />

          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 text-xs space-y-2">
            <div className="flex justify-between font-bold">
              <span className="text-muted-foreground">Estructura & Forma:</span>
              <span className="text-foreground capitalize">{state.nailConfig.nailType} • {state.nailConfig.shape} • {state.nailConfig.length}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-muted-foreground">Color & Acabado:</span>
              <span className="text-foreground capitalize">{selectedColor} • {state.designDetails.finish}</span>
            </div>
            {state.referenceImages.length > 0 && (
              <div className="flex justify-between font-bold">
                <span className="text-muted-foreground">Fotos de Referencia:</span>
                <span className="text-primary font-black">{state.referenceImages.length} cargadas</span>
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={handleFinalSubmit}
            className="w-full bg-primary text-white text-xs font-black h-11 rounded-2xl cursor-pointer"
          >
            <Send className="size-4 mr-1.5" />
            <span>Enviar Cotización a Manicuristas para Aprobación</span>
          </Button>
        </div>
      )}

      {/* STEP 4: Submitted Confirmation */}
      {state.currentStep === 'submitted' && state.submittedRequest && (
        <div className="p-5 rounded-3xl bg-primary/5 border border-primary/20 text-center space-y-4">
          <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto shadow-md">
            <Clock className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-foreground">¡Solicitud de Cotización Recibida!</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Nuestra manicurista revisará tus imágenes y requisitos. Recibirás tu precio oficial en menos de 15 minutos para seleccionar horario y agendar.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/80 text-xs text-left space-y-1">
            <div className="flex justify-between font-extrabold">
              <span>Folio de Cotización:</span>
              <span className="text-primary">#{state.submittedRequest.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Estatus:</span>
              <span className="text-[#845E1B] font-bold">Pendiente de revisión por Manicurista</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch({ type: 'RESET' })}
            className="w-full text-xs font-bold"
          >
            Crear otra cotización
          </Button>
        </div>
      )}
    </Card>
  );
}

export function CustomQuoteWizard(props: CustomQuoteWizardContentProps) {
  return (
    <CustomQuoteProvider>
      <CustomQuoteWizardContent {...props} />
    </CustomQuoteProvider>
  );
}
