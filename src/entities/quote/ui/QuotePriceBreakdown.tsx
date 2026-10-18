import React from 'react';
import { QuoteItem } from '@/domain/quotes/entities/QuoteRequest';

interface QuotePriceBreakdownProps {
  items: QuoteItem[];
  subtotal: number;
  discount?: number;
  depositRequired?: number;
  remainingBalance?: number;
  currency?: string;
}

export function QuotePriceBreakdown({
  items,
  subtotal,
  discount = 0,
  depositRequired,
  remainingBalance,
  currency = 'MXN',
}: QuotePriceBreakdownProps) {
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 text-xs space-y-2.5">
      <div className="font-extrabold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground">
        Desglose Detallado de Cotización
      </div>

      <div className="space-y-1.5 divide-y divide-border/30">
        {items.map((item) => (
          <div key={item.id} className="pt-1.5 flex justify-between items-center text-foreground font-medium">
            <span>• {item.description}</span>
            <span className="font-extrabold text-primary">${item.amount} {currency}</span>
          </div>
        ))}
      </div>

      {discount > 0 && (
        <div className="flex justify-between items-center text-primary font-bold pt-1">
          <span>Descuento Aplicado</span>
          <span>-${discount} {currency}</span>
        </div>
      )}

      <div className="pt-2 border-t border-border/60 flex justify-between items-center text-sm font-black text-foreground">
        <span>Total Final</span>
        <span className="text-primary">${finalTotal} {currency}</span>
      </div>

      {depositRequired !== undefined && remainingBalance !== undefined && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-[11px] font-bold">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-center">
            <span>Anticipo Hoy:</span>
            <div className="text-xs font-black text-primary">${depositRequired} {currency}</div>
          </div>
          <div className="p-2 rounded-xl bg-neutral-100 border border-black/[0.04] text-[#86868B] text-center">
            <span>Saldo en Cita:</span>
            <div className="text-xs font-black text-[#1D1D1F]">${remainingBalance} {currency}</div>
          </div>
        </div>
      )}
    </div>
  );
}
