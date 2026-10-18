import React from 'react';
import { QuoteRequest } from '@/domain/quotes/entities/QuoteRequest';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import { Clock, Calendar, Scissors, Sparkles } from 'lucide-react';

interface QuoteSummaryProps {
  request: QuoteRequest;
  onSelect?: () => void;
  compact?: boolean;
}

export function QuoteSummary({ request, onSelect, compact = false }: QuoteSummaryProps) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3 text-xs transition-all ${
        onSelect ? 'cursor-pointer hover:border-primary/40' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {request.clientAvatar && (
            <img src={request.clientAvatar} alt={request.clientName} className="size-8 rounded-full object-cover" />
          )}
          <div>
            <span className="font-extrabold text-foreground block">{request.clientName}</span>
            <span className="text-[10px] text-muted-foreground">ID: #{request.id}</span>
          </div>
        </div>
        <QuoteStatusBadge status={request.status} />
      </div>

      <div className="p-3 rounded-2xl bg-secondary/30 space-y-1.5">
        <div className="flex justify-between items-center font-bold text-primary">
          <span>{request.serviceTitle}</span>
          <span>{request.nailConfig.length.toUpperCase()} • {request.nailConfig.shape.toUpperCase()}</span>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-2">"{request.designDetails.description}"</p>
      </div>

      {!compact && (
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <span className="flex items-center gap-1 font-semibold">
            <Calendar className="size-3 text-primary" />
            {request.schedulePref.preferredDate || 'Fecha a convenir'}
          </span>
          <span className="font-bold text-foreground">
            {request.referenceImages.length} fotos adjuntas
          </span>
        </div>
      )}
    </div>
  );
}
