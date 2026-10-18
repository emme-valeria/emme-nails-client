import React from 'react';
import { SummaryItem, PriceEstimate } from './wizard.types';
import { Sparkles, Tag, CheckCircle2 } from 'lucide-react';
import { InteractiveNailPreviewCard } from '@/shared/components/InteractiveNailPreviewCard';

interface LivePreviewConfig {
  shape?: string;
  length?: string;
  colorName?: string;
  colorHex?: string;
  finish?: string;
  artStyle?: string;
  serviceTitle?: string;
  estimatedPrice?: number;
  estimatedDuration?: number;
}

interface WizardSummaryProps {
  items: SummaryItem[];
  priceEstimate?: PriceEstimate;
  title?: string;
  className?: string;
  compactMobile?: boolean;
  onContinue?: () => void;
  canContinue?: boolean;
  continueLabel?: string;
  livePreviewConfig?: LivePreviewConfig;
}

export function WizardSummary({
  items,
  priceEstimate,
  title = "Resumen de Selección",
  className = "",
  compactMobile = false,
  onContinue,
  canContinue = true,
  continueLabel = "Continuar",
  livePreviewConfig
}: WizardSummaryProps) {
  const hasItems = items && items.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Live Previsualization Stage inside Sidebar */}
      {livePreviewConfig && (
        <InteractiveNailPreviewCard
          shape={livePreviewConfig.shape}
          length={livePreviewConfig.length}
          colorName={livePreviewConfig.colorName}
          colorHex={livePreviewConfig.colorHex}
          finish={livePreviewConfig.finish}
          artStyle={livePreviewConfig.artStyle}
          serviceTitle={livePreviewConfig.serviceTitle}
          estimatedPrice={livePreviewConfig.estimatedPrice || (priceEstimate?.totalMXN)}
          estimatedDuration={livePreviewConfig.estimatedDuration}
          compact={true}
        />
      )}

      {/* Summary Container - Liquid Glass Sub */}
      <div className="liquid-glass-sub border border-white/60 dark:border-white/10 rounded-3xl p-4 sm:p-5 shadow-lg shadow-pink-500/5 backdrop-blur-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="size-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {title}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 border border-pink-200/60 dark:border-pink-800/40 px-2.5 py-0.5 rounded-full">
            En tiempo real
          </span>
        </div>

        {/* Selected Options List */}
        {hasItems ? (
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between text-xs gap-3 py-1.5 px-2 rounded-xl bg-white/40 dark:bg-white/5 border border-black/[0.03] dark:border-white/[0.04]"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block truncate">
                    {item.label}
                  </span>
                  <span className="font-semibold text-foreground block truncate">
                    {item.value}
                  </span>
                </div>
                {item.detail && (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                    {item.detail}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center space-y-1">
            <p className="text-xs font-bold text-muted-foreground">
              Aún no has hecho selecciones
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Elige las opciones a la izquierda para armar tu cita.
            </p>
          </div>
        )}

        {/* Price Estimate Breakdown */}
        {priceEstimate && (
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
            {priceEstimate.isEstimateOnly ? (
              <div className="py-2 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
                  <span>Estimado Aproximado:</span>
                  <span className="text-sm font-black">
                    ${priceEstimate.minMXN || priceEstimate.totalMXN} – ${priceEstimate.maxMXN || (priceEstimate.totalMXN + 300)} MXN
                  </span>
                </div>
                <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 leading-tight">
                  *Precio final confirmado personalmente por la manicurista según técnica y detalles.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Tag className="size-3.5 text-primary" /> Total Estimado:
                  </span>
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    ${priceEstimate.totalMXN} MXN
                  </span>
                </div>

                {priceEstimate.depositMXN > 0 && (
                  <div className="flex items-center justify-between pt-1.5 border-t border-black/[0.04] dark:border-white/[0.06] text-xs">
                    <span className="font-semibold text-primary">Anticipo requerido:</span>
                    <span className="font-bold text-primary text-sm">
                      ${priceEstimate.depositMXN} MXN
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile inline continue trigger inside summary when embedded */}
        {onContinue && compactMobile && (
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className={`w-full h-11 rounded-full font-bold text-xs text-white apple-button bg-primary hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(224,82,134,0.25)] ${
              !canContinue ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <CheckCircle2 className="size-4 stroke-[2.5]" />
            <span>{continueLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
