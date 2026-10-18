import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export interface BreakdownLineItem {
  id: string;
  label: string;
  amount: number;
}

interface PriceBreakdownProps {
  items: BreakdownLineItem[];
  totalPrice: number;
  depositAmount: number;
  estimatedDurationMinutes: number;
  isEstimatedQuote?: boolean;
}

export function PriceBreakdown({
  items,
  totalPrice,
  depositAmount,
  estimatedDurationMinutes,
  isEstimatedQuote = false,
}: PriceBreakdownProps) {
  const remainingBalance = Math.max(0, totalPrice - depositAmount);

  return (
    <div className="p-4 rounded-3xl bg-card border border-border/80 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          <span>{isEstimatedQuote ? 'Estimación de Cotización' : 'Desglose del Servicio'}</span>
        </h4>
        <span className="text-[10px] text-muted-foreground font-bold">
          Duración aprox: {estimatedDurationMinutes} min
        </span>
      </div>

      <div className="space-y-1.5 text-xs">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-muted-foreground">
            <span>{item.label}</span>
            <span className="font-bold text-foreground">${item.amount} MXN</span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border/40 space-y-2">
        <div className="flex justify-between items-baseline text-sm font-black">
          <span className="text-foreground">Total {isEstimatedQuote ? 'Estimado' : ''}</span>
          <span className="text-primary text-base">${totalPrice} MXN</span>
        </div>

        <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
          <div className="flex justify-between text-xs font-bold text-foreground">
            <span>Anticipo requerido para confirmar</span>
            <span className="text-primary">${depositAmount} MXN</span>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Restante a pagar en estudio</span>
            <span>${remainingBalance} MXN</span>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1 pt-1">
          <ShieldCheck className="size-3 text-emerald-600" />
          <span>Garantía Emme: El anticipo asegura tu lugar y se descuenta del total.</span>
        </p>
      </div>
    </div>
  );
}
