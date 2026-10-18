import React from 'react';
import { Sparkles, Info, CheckCircle2, ShieldCheck } from 'lucide-react';

interface EstimateBreakdownProps {
  minMXN: number;
  maxMXN: number;
  confirmedPriceMXN?: number;
  depositMXN: number;
  items: Array<{ label: string; value: string }>;
}

export function EstimateBreakdown({
  minMXN,
  maxMXN,
  confirmedPriceMXN,
  depositMXN,
  items
}: EstimateBreakdownProps) {
  return (
    <div className="space-y-5 text-left">
      {/* Luminous Estimate & Deposit Header (Unboxed, flush, high contrast) */}
      <div className="pb-4 border-b border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="size-2.5" />
              Presupuesto Estimado
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <ShieldCheck className="size-3" />
              Garantía Emme
            </span>
          </div>

          <h4 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
            {confirmedPriceMXN
              ? `$${confirmedPriceMXN} MXN`
              : `$${minMXN} – $${maxMXN} MXN`}
          </h4>
          <p className="text-[11px] text-[#86868B]">
            Confirmado por la manicurista según la complejidad del arte en cabina.
          </p>
        </div>

        <div className="text-left sm:text-right pt-2 sm:pt-0 w-full sm:w-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block">
            Anticipo para Apartar
          </span>
          <span className="text-lg sm:text-xl font-black text-emerald-600">
            ${depositMXN} <span className="text-xs font-bold text-[#86868B]">MXN</span>
          </span>
        </div>
      </div>

      {/* Selected Items Breakdown - Flush Divider Rows (No box-in-box) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#86868B]">
            Especificaciones Solicitadas
          </span>
          <span className="text-[11px] text-[#86868B]">{items.length} detalles</span>
        </div>

        <div className="divide-y divide-black/[0.05] border-y border-black/[0.05] text-xs">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="py-2.5 flex items-center justify-between"
            >
              <span className="text-[#86868B] font-medium">{item.label}</span>
              <span className="font-bold text-[#1D1D1F] flex items-center gap-1.5 text-right">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

