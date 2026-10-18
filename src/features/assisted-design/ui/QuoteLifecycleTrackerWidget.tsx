import React from 'react';
import {
  QuoteStateMachineContext,
  QuoteLifecycleState,
  QuoteStateMachine
} from '@/domain/quotes/services/quote-state-machine';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Layers,
  ArrowRight,
  History,
  FileCheck
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export interface QuoteLifecycleTrackerWidgetProps {
  context?: QuoteStateMachineContext;
  onApproveByArtist?: () => void;
  className?: string;
}

const LIFECYCLE_STEPS: { id: QuoteLifecycleState; label: string; actor: string }[] = [
  { id: 'ANALYZING_IMAGES', label: 'Análisis IA', actor: 'Gemini Vision' },
  { id: 'PRICED_DETERMINISTIC', label: 'Tarificación', actor: 'Pricing Engine v2' },
  { id: 'ARTIST_CABIN_REVIEW', label: 'Revisión Cabina', actor: 'Especialista Master' },
  { id: 'APPROVED_FINAL', label: 'Aprobación Final', actor: 'Sistema Emme' },
  { id: 'BOOKING_LOCKED', label: 'Pase VIP Creado', actor: 'Agenda Emme' },
];

export const QuoteLifecycleTrackerWidget: React.FC<QuoteLifecycleTrackerWidgetProps> = ({
  context,
  onApproveByArtist,
  className,
}) => {
  const currentCtx = context || QuoteStateMachine.createQuote('quote_demo_982');

  const getStepStatus = (stepId: QuoteLifecycleState) => {
    const order: QuoteLifecycleState[] = [
      'DRAFT',
      'ANALYZING_IMAGES',
      'ANALYSIS_COMPLETE',
      'PRICED_DETERMINISTIC',
      'REVIEW_REQUIRED',
      'ARTIST_CABIN_REVIEW',
      'APPROVED_FINAL',
      'PRESENTED_TO_CLIENT',
      'ACCEPTED_BY_CLIENT',
      'BOOKING_LOCKED',
      'DEPOSIT_PAID',
    ];

    const currIdx = order.indexOf(currentCtx.currentState);
    const stepIdx = order.indexOf(stepId);

    if (currIdx > stepIdx) return 'completed';
    if (currIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div id="quote-lifecycle-tracker-widget" className={cn("bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <FileCheck className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              Trazabilidad & Ciclo de Cotización
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Máquina de estados determinista con auditoría inmutable
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="px-2 py-0.5 bg-muted rounded">Catálogo: {currentCtx.catalogVersion}</span>
          <span className="px-2 py-0.5 bg-muted rounded">Reglas: {currentCtx.ruleVersion}</span>
        </div>
      </div>

      {/* Visual State Progress Bar */}
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative z-10">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const status = getStepStatus(step.id);
            return (
              <div
                key={step.id}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  status === 'completed'
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
                    : status === 'current'
                    ? "bg-primary/10 border-primary text-primary ring-1 ring-primary"
                    : "bg-muted/20 border-border/40 text-muted-foreground"
                )}
              >
                <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center mb-1 text-xs font-bold font-mono">
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="font-semibold text-xs text-foreground truncate">{step.label}</div>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">{step.actor}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Artist Cabin Gate Action (if in review) */}
      {currentCtx.currentState === 'ARTIST_CABIN_REVIEW' && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                Revisión requerida por artista de cabina
              </p>
              <p className="text-xs text-muted-foreground">
                Confirma el tiempo de mano alzada y el inventario de pedrería.
              </p>
            </div>
          </div>
          {onApproveByArtist && (
            <button
              type="button"
              onClick={onApproveByArtist}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all shrink-0"
            >
              Aprobar Cotización
            </button>
          )}
        </div>
      )}

      {/* Audit Trail Timeline */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <History className="w-3.5 h-3.5" />
          <span>Registro de Auditoría ({currentCtx.auditTrail.length})</span>
        </div>
        <div className="space-y-1.5 font-mono text-[11px]">
          {currentCtx.auditTrail.map((audit, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30">
              <span className="text-foreground">{audit.reason}</span>
              <span className="text-muted-foreground">{new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
