import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

interface WizardNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  nextLabel?: string;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  totalMXN?: number;
}

export function WizardNavigation({
  onBack,
  onNext,
  canNext = true,
  nextLabel,
  isFirstStep = false,
  isLastStep = false,
  isSubmitting = false,
  totalMXN
}: WizardNavigationProps) {
  const defaultLabel = isLastStep ? 'Confirmar Cita' : 'Continuar';
  const label = nextLabel || defaultLabel;

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <div className="flex items-center gap-3">
        {!isFirstStep && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="h-11 px-5 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-md font-bold text-xs text-foreground hover:bg-white dark:hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="size-4 stroke-[2.25]" />
            <span>Atrás</span>
          </button>
        )}

        {totalMXN !== undefined && totalMXN > 0 && (
          <div className="flex items-baseline gap-1.5 pl-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total:</span>
            <span className="text-base font-black text-primary">${totalMXN} MXN</span>
          </div>
        )}
      </div>

      {onNext && (
        <button
          type="button"
          disabled={!canNext || isSubmitting}
          onClick={onNext}
          className={cn(
            "h-11 px-7 rounded-full font-bold text-xs sm:text-sm text-white apple-button bg-primary hover:brightness-105 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(224,82,134,0.25)] flex items-center gap-2 cursor-pointer ml-auto",
            (!canNext || isSubmitting) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <span>Procesando...</span>
          ) : (
            <>
              <span>{label}</span>
              {isLastStep ? <Check className="size-4 stroke-[2.5]" /> : <ArrowRight className="size-4 stroke-[2.25]" />}
            </>
          )}
        </button>
      )}
    </div>
  );
}

