import React from 'react';
import { useQuoteFlow } from '../../model/quote-flow.context';
import { ServiceSelectionWidget } from '../../widgets/ServiceSelectionWidget';
import { NailConfigurationWidget } from '../../widgets/NailConfigurationWidget';
import { DesignDetailsWidget } from '../../widgets/DesignDetailsWidget';
import { ReferenceImagesWidget } from '../../widgets/ReferenceImagesWidget';
import { SchedulePreferencesWidget } from '../../widgets/SchedulePreferencesWidget';
import { QuoteReviewWidget } from '../../widgets/QuoteReviewWidget';
import { Sparkles, Bot, Send } from 'lucide-react';
import { Button } from '@emme/ui/button';

interface QuoteChatRendererProps {
  onCompleteSubmit?: () => void;
}

export function QuoteChatRenderer({ onCompleteSubmit }: QuoteChatRendererProps) {
  const { state, dispatch, nextStep, prevStep } = useQuoteFlow();
  const { currentStep } = state;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* AI Bot Message Card Header */}
      <div className="flex gap-3 p-4 rounded-3xl bg-card border border-border/80 shadow-xs">
        <div className="size-9 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
          <Bot className="size-5" />
        </div>
        <div className="space-y-1 text-xs">
          <span className="font-extrabold text-foreground">Asistente Virtual EMME Custom Quote</span>
          <p className="text-muted-foreground leading-relaxed">
            Te guiémos paso a paso para configurar tu diseño único. Elige cada detalle y responderemos con una cotización oficial garantizada.
          </p>
        </div>
      </div>

      {/* Embedded Dynamic Step Widget inside Chat Bubble Container */}
      <div className="p-5 rounded-3xl bg-secondary/30 border border-border/60 space-y-4 shadow-xs">
        {currentStep === 'service-selection' && <ServiceSelectionWidget />}
        {currentStep === 'nail-configuration' && <NailConfigurationWidget />}
        {currentStep === 'design-details' && <DesignDetailsWidget />}
        {currentStep === 'reference-images' && <ReferenceImagesWidget />}
        {currentStep === 'schedule-preferences' && <SchedulePreferencesWidget />}
        {currentStep === 'review-submit' && (
          <QuoteReviewWidget onSubmitRequest={onCompleteSubmit} />
        )}

        {/* Quick Action Buttons inside Chat Step */}
        {currentStep !== 'review-submit' && (
          <div className="flex justify-between items-center pt-2 border-t border-border/40">
            {state.stepIndex > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="h-9 px-4 rounded-xl text-xs font-bold"
              >
                Atrás
              </Button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              onClick={nextStep}
              className="h-9 px-5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 ml-auto gap-1 cursor-pointer"
            >
              <span>Continuar</span>
              <Send className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
