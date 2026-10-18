import React from 'react';
import { QuoteRequest } from '@/entities/quote/types';
import { Check, X, RefreshCw, Calendar, Clock, DollarSign, ShieldAlert } from 'lucide-react';

interface AcceptedQuoteReviewStepProps {
  quote: QuoteRequest;
  onAccept: () => void;
  onRequestChanges: () => void;
  onDecline: () => void;
}

export function AcceptedQuoteReviewStep({
  quote,
  onAccept,
  onRequestChanges,
  onDecline
}: AcceptedQuoteReviewStepProps) {
  const total = quote.confirmedPriceMXN || quote.estimatedMinPriceMXN;
  const deposit = quote.depositRequiredMXN || Math.round(total * 0.3);
  const duration = quote.durationMinutes || 120;
  const durationHours = `${Math.floor(duration / 60)}h ${duration % 60 ? `${duration % 60}m` : ''}`;

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      <div className="p-5 rounded-3xl bg-card border border-border/80 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Cotización Oficial Lista
          </span>
          <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/15 px-3 py-1 rounded-full">
            Respuesta del Salón
          </span>
        </div>

        {/* Pricing & Duration Highlight */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <span className="text-[10px] font-bold text-muted-foreground block">
              Precio Confirmado
            </span>
            <span className="text-base font-black text-primary">
              ${total} MXN
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-secondary/50 border border-border/50">
            <span className="text-[10px] font-bold text-muted-foreground block">
              Duración Cita
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {durationHours}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-secondary/50 border border-border/50">
            <span className="text-[10px] font-bold text-muted-foreground block">
              Anticipo Requerido
            </span>
            <span className="text-sm font-extrabold text-primary">
              ${deposit} MXN
            </span>
          </div>
        </div>

        {/* Validity */}
        {quote.validUntilDate && (
          <div className="p-3 rounded-2xl bg-[#FAF5EC] border border-[#ECDCC2] text-xs text-[#845E1B] flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <Calendar className="size-4 text-[#C59B4E]" /> Válida hasta:
            </span>
            <span className="font-black">{quote.validUntilDate}</span>
          </div>
        )}
      </div>

      {/* Breakdown Details */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
          Resumen de Diseño Aprobado
        </label>
        <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Servicio Base:</span>
            <span className="font-bold text-foreground">{quote.baseServiceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estructura:</span>
            <span className="font-bold text-foreground">{quote.length} · {quote.shape}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Acabado:</span>
            <span className="font-bold text-foreground">{quote.finish}</span>
          </div>
          {quote.details.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Detalles Nail Art:</span>
              <span className="font-bold text-primary">{quote.details.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Decision Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          type="button"
          onClick={onAccept}
          className="h-11 px-4 rounded-2xl bg-primary hover:brightness-105 font-extrabold text-xs text-white shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Check className="size-4 stroke-[3]" />
          <span>Aceptar Cotización</span>
        </button>

        <button
          type="button"
          onClick={onRequestChanges}
          className="h-11 px-4 rounded-2xl bg-card border border-border/80 hover:bg-secondary/60 font-bold text-xs text-foreground flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="size-4" />
          <span>Pedir Cambios</span>
        </button>

        <button
          type="button"
          onClick={onDecline}
          className="h-11 px-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <X className="size-4" />
          <span>Rechazar</span>
        </button>
      </div>
    </div>
  );
}
