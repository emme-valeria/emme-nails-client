import React from 'react';
import { useQuoteFlow } from '../../model/quote-flow.context';
import { ServiceSelectionWidget } from '../../widgets/ServiceSelectionWidget';
import { NailConfigurationWidget } from '../../widgets/NailConfigurationWidget';
import { DesignDetailsWidget } from '../../widgets/DesignDetailsWidget';
import { ReferenceImagesWidget } from '../../widgets/ReferenceImagesWidget';
import { SchedulePreferencesWidget } from '../../widgets/SchedulePreferencesWidget';
import { QuoteReviewWidget } from '../../widgets/QuoteReviewWidget';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@emme/ui/button';

interface QuoteWizardRendererProps {
  onCompleteSubmit?: () => void;
}

export function QuoteWizardRenderer({ onCompleteSubmit }: QuoteWizardRendererProps) {
  const { state, dispatch, nextStep, prevStep } = useQuoteFlow();
  const { currentStep, stepIndex } = state;

  const STEP_TITLES = [
    'Servicio',
    'Uñas',
    'Diseño',
    'Fotos',
    'Horario',
    'Revisión',
  ];

  return (
    <div className="space-y-4 max-w-2xl mx-auto text-left">
      {/* Header Stepper with Hairline Divider */}
      <div className="space-y-2.5 pb-3 border-b border-black/[0.05]">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="size-3.5" />
            <span>Paso {stepIndex + 1} de 6: {STEP_TITLES[stepIndex]}</span>
          </div>
          <span className="text-xs font-bold text-[#86868B]">
            Cotización Personalizada
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-6 gap-1.5">
          {STEP_TITLES.map((title, i) => (
            <div
              key={i}
              onClick={() => i < stepIndex && dispatch({ type: 'SET_STEP', payload: ['service-selection', 'nail-configuration', 'design-details', 'reference-images', 'schedule-preferences', 'review-submit'][i] as any })}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIndex ? 'bg-primary' : 'bg-neutral-200'
              } ${i < stepIndex ? 'cursor-pointer hover:opacity-80' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Active Step Component */}
      <div className="py-2">
        {currentStep === 'service-selection' && <ServiceSelectionWidget />}
        {currentStep === 'nail-configuration' && <NailConfigurationWidget />}
        {currentStep === 'design-details' && <DesignDetailsWidget />}
        {currentStep === 'reference-images' && <ReferenceImagesWidget />}
        {currentStep === 'schedule-preferences' && <SchedulePreferencesWidget />}
        {currentStep === 'review-submit' && (
          <QuoteReviewWidget
            onSubmitRequest={() => {
              if (onCompleteSubmit) onCompleteSubmit();
            }}
          />
        )}
      </div>

      {/* Navigation Footer */}
      {currentStep !== 'review-submit' && (
        <div className="flex items-center justify-between pt-3 border-t border-black/[0.05] gap-3">
          {stepIndex > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="rounded-xl text-xs font-bold gap-1 cursor-pointer h-10 px-4"
            >
              <ChevronLeft className="size-4" />
              <span>Anterior</span>
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            onClick={nextStep}
            className="rounded-xl text-xs font-bold gap-1 ml-auto bg-primary text-white hover:brightness-105 cursor-pointer h-10 px-5 shadow-xs"
          >
            <span>Siguiente</span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
