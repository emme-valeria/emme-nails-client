import React, { useState } from 'react';
import { NormalizedQuoteCalculation, ServiceConfiguration } from '@/domain/intent/types';
import { Clock, ShieldCheck, ChevronUp, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { triggerStepVibration } from '@/shared/utils/haptics';

interface LiveBookingSummaryProps {
  quote: NormalizedQuoteCalculation;
  config: Partial<ServiceConfiguration>;
  staffName?: string;
  selectedDate?: string;
  selectedTimeSlot?: string;
  className?: string;
  onAdvance?: () => void;
  advanceButtonLabel?: string;
  isAdvanceDisabled?: boolean;
}

export function LiveBookingSummary({
  quote,
  config,
  staffName,
  selectedDate,
  selectedTimeSlot,
  className,
  onAdvance,
  advanceButtonLabel = 'Continuar',
  isAdvanceDisabled = false
}: LiveBookingSummaryProps) {
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);

  return (
    <>
      {/* Desktop Sticky Floating Card */}
      <div className={cn("hidden lg:block w-full bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-200/60 shadow-lg shadow-pink-500/5 sticky top-6 space-y-6", className)}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Resumen en Vivo</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-1 truncate max-w-[240px]">
              {config.serviceTitle || 'Servicio Seleccionado'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block font-normal">Total Estimado</span>
            <span className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight tabular-nums">
              ${quote.totalPriceMXN} <span className="text-xs font-normal text-slate-500">MXN</span>
            </span>
          </div>
        </div>

        {/* Time and Duration Badge */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <Clock className="size-4 text-primary shrink-0" />
            <span>Duración estimada:</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs">
            {quote.durationFormatted}
          </span>
        </div>

        {/* Staff / Slot if selected */}
        {(staffName || (selectedDate && selectedTimeSlot)) && (
          <div className="p-3.5 rounded-2xl bg-pink-50/50 border border-pink-100 text-xs space-y-1.5">
            {staffName && (
              <div className="flex items-center justify-between font-medium text-slate-700">
                <span className="text-slate-500 font-normal">Especialista:</span>
                <span className="font-semibold text-slate-900">{staffName}</span>
              </div>
            )}
            {selectedDate && selectedTimeSlot && (
              <div className="flex items-center justify-between font-medium text-slate-700">
                <span className="text-slate-500 font-normal">Turno:</span>
                <span className="text-primary font-semibold">{selectedDate} a las {selectedTimeSlot}</span>
              </div>
            )}
          </div>
        )}

        {/* Breakdown Items */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Desglose transparente:
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1 divide-y divide-slate-100/80">
            {quote.breakdown.map((item, idx) => (
              <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-sm">
                <span className="text-slate-600 truncate max-w-[200px] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                  {item.label}
                </span>
                <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                  +${item.amountMXN}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deposit details */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
          <ShieldCheck className="size-4 text-amber-600 shrink-0" />
          <span className="font-normal">
            Anticipo de <strong className="font-semibold text-amber-900">${quote.depositMXN} MXN</strong> (deducible en tu cita)
          </span>
        </div>

        {onAdvance && (
          <button
            type="button"
            disabled={isAdvanceDisabled}
            onClick={() => {
              triggerStepVibration();
              onAdvance();
            }}
            className={cn(
              "w-full h-12.5 px-6 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(224,82,134,0.25)] active:scale-98 transition-all cursor-pointer",
              !isAdvanceDisabled
                ? "bg-primary hover:brightness-105 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            <span>{advanceButtonLabel}</span>
          </button>
        )}
      </div>

      {/* Mobile Floating Drawer / Bottom Bar */}
      <div className="lg:hidden fixed bottom-[68px] left-0 right-0 z-[80] px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          {/* Expandable Breakdown Drawer */}
          <AnimatePresence>
            {isExpandedMobile && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsExpandedMobile(false)}
                  className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-[-1]"
                />
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="mb-3 p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
                      Desglose de Servicio
                    </span>
                    <span className="text-xs font-semibold text-primary">{quote.durationFormatted}</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {quote.breakdown.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium truncate">{item.label}</span>
                        <span className="font-semibold text-slate-900">+${item.amountMXN}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
                    <ShieldCheck className="size-4 text-amber-600 shrink-0" />
                    <span>Anticipo de <strong className="font-semibold">${quote.depositMXN} MXN</strong></span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Compact Liquid Glass Bar */}
          <div className="p-2.5 sm:p-3 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-lg shadow-pink-500/5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsExpandedMobile(!isExpandedMobile)}
              className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer flex-1 pl-1"
            >
              <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Clock className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-900 truncate">${quote.totalPriceMXN} MXN</span>
                  <span className="text-xs text-slate-500 font-normal">· {quote.durationFormatted}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate font-normal flex items-center gap-1">
                  <span>Ver desglose</span>
                  {isExpandedMobile ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
                </p>
              </div>
            </button>

            {onAdvance && (
              <button
                type="button"
                disabled={isAdvanceDisabled}
                onClick={() => {
                  triggerStepVibration();
                  onAdvance();
                }}
                className={cn(
                  "min-h-[42px] h-10 px-5 rounded-full font-semibold text-xs shadow-[0_4px_16px_rgba(224,82,134,0.25)] transition-all flex items-center justify-center shrink-0 active:scale-95 cursor-pointer",
                  !isAdvanceDisabled
                    ? "bg-primary hover:brightness-105 text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                )}
              >
                <span>{advanceButtonLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
