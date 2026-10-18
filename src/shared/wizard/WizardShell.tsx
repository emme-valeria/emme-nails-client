import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WizardSummary } from './WizardSummary';
import { WizardNavigation } from './WizardNavigation';
import { WizardShellProps } from './wizard.types';
import { cn } from '@emme/ui/lib/utils';

export function WizardShell({
  currentStep,
  totalSteps,
  stepTitle,
  stepSubtitle,
  onBack,
  onNext,
  canNext = true,
  nextLabel,
  isSubmitting = false,
  summaryItems,
  priceEstimate,
  livePreviewConfig,
  showNavigation = true,
  children
}: WizardShellProps) {
  // Extract quick summary for mobile bottom bar e.g. "Medium · Almond"
  const summaryInlineText = summaryItems
    .slice(0, 2)
    .map((item) => item.value)
    .filter(Boolean)
    .join(' · ') || 'Selecciona tus opciones';

  const progressPercentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto relative pb-28 md:pb-16 text-left">
      {/* Dynamic Ambient Color Orbs matching Cotizar con IA */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#E05286]/15 via-pink-400/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-28 -left-28 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-300/15 via-[#E05286]/8 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-pink-200/15 dark:bg-pink-900/10 blur-3xl pointer-events-none -z-10" />

      {/* Header Stepper - Limpio, sin duplicación de etiquetas, porcentajes ni puntos decorativos */}
      <header className="mb-5 sm:mb-6 pt-1 space-y-3 sm:space-y-4">
        {/* Barra superior con navegación hacia atrás, indicador de progreso segmentado y 'Paso X de Y' */}
        <div className="flex items-center gap-3 w-full">
          {(currentStep > 1 || onBack) && (
            <button
              type="button"
              onClick={onBack}
              className="size-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.15] border border-black/[0.04] dark:border-white/[0.08] flex items-center justify-center text-foreground transition-all cursor-pointer shadow-none active:scale-95 shrink-0"
              aria-label="Volver al paso anterior"
            >
              <ArrowLeft className="size-4 stroke-[2.25]" />
            </button>
          )}

          {/* Barra de progreso segmentada */}
          <div className="flex-1 grid grid-cols-4 gap-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx + 1 <= currentStep
                    ? "bg-primary shadow-xs"
                    : "bg-black/[0.06] dark:bg-white/[0.08]"
                )}
              />
            ))}
          </div>

          <span className="font-semibold text-muted-foreground text-xs tracking-tight shrink-0">
            Paso {currentStep} de {totalSteps}
          </span>
        </div>

        {/* Título principal unificado en un solo bloque en negrita con único texto de apoyo */}
        <div className="px-0.5">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
            {stepTitle}
          </h1>
          {stepSubtitle && (
            <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-0.5 leading-snug">
              {stepSubtitle}
            </p>
          )}
        </div>
      </header>

      {/* Main Grid Layout: Interactive Body + Desktop Sticky Live Preview Summary (Open Layout, No outer bounding card) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left Column: Decision Options & Question Body */}
        <div className="md:col-span-7 xl:col-span-7 space-y-6">
          <div className="min-h-[280px]">{children}</div>

          {/* Desktop & Tablet Navigation Footer */}
          {showNavigation && (
            <div className="hidden md:block pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
              <WizardNavigation
                onBack={onBack}
                onNext={onNext}
                canNext={canNext}
                nextLabel={nextLabel}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === totalSteps}
                isSubmitting={isSubmitting}
                totalMXN={priceEstimate?.totalMXN || priceEstimate?.minMXN}
              />
            </div>
          )}
        </div>

        {/* Right Column (Desktop & Tablet): Persistent Live Summary Card */}
        <div className="hidden md:block md:col-span-5 xl:col-span-5 sticky top-24">
          <WizardSummary
            items={summaryItems}
            priceEstimate={priceEstimate}
            livePreviewConfig={livePreviewConfig}
            title="Tu Selección en Tiempo Real"
          />
        </div>
      </div>

      {/* Mobile-Only Bottom Sticky Summary & Continue Bar - Strictly for mobile screens (< md) */}
      {showNavigation && (
        <div 
          className="md:hidden fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 max-w-lg mx-auto z-[60] liquid-glass rounded-2xl border border-white/80 dark:border-white/15 p-2.5 sm:p-3 shadow-2xl backdrop-blur-2xl transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            {/* Resumen apilado sin truncamiento agresivo */}
            <div className="flex flex-col justify-center min-w-0 flex-1 pr-2">
              <span className="text-xs sm:text-[13px] font-bold text-foreground leading-tight tracking-tight line-clamp-1">
                {summaryItems[0]?.value || 'Servicio'}
              </span>
              {priceEstimate && (
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-primary font-black text-sm sm:text-base leading-none whitespace-nowrap">
                    ${priceEstimate.totalMXN || priceEstimate.minMXN || 0} MXN
                  </span>
                  {summaryItems[1]?.value && (
                    <span className="text-[10.5px] text-muted-foreground font-medium truncate">
                      · {summaryItems[1].value}
                    </span>
                  )}
                </div>
              )}
            </div>

            {onNext && (
              <button
                type="button"
                disabled={!canNext || isSubmitting}
                onClick={onNext}
                className={cn(
                  "shrink-0 h-10 px-5 sm:px-6 rounded-full font-bold text-xs sm:text-sm text-white apple-button bg-primary hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-primary/25 flex items-center justify-center gap-1.5 cursor-pointer ml-auto",
                  (!canNext || isSubmitting) && "opacity-50 cursor-not-allowed"
                )}
              >
                <span>
                  {isSubmitting
                    ? 'Procesando...'
                    : nextLabel || (currentStep === totalSteps ? 'Confirmar Cita' : 'Continuar')}
                </span>
                <ArrowRight className="size-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

