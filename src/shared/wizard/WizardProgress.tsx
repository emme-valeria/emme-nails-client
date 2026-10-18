import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
}

export function WizardProgress({
  currentStep,
  totalSteps,
  onBack,
  showBack = true
}: WizardProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full space-y-2 sm:space-y-3">
      <div className="flex items-center justify-between">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1 px-1.5 sm:px-2 -ml-1 sm:-ml-2 rounded-lg hover:bg-secondary/60"
          >
            <ArrowLeft className="size-3 sm:size-4" />
            <span>Volver</span>
          </button>
        ) : (
          <div />
        )}

        {/* Hide step count on mobile to reduce cognitive load, keep on desktop */}
        <span className="hidden sm:inline-block text-xs font-black uppercase tracking-wider text-muted-foreground/80 bg-secondary/80 px-3 py-1 rounded-full border border-border/40">
          Paso {currentStep} de {totalSteps}
        </span>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-1 sm:h-1.5 bg-secondary/80 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
