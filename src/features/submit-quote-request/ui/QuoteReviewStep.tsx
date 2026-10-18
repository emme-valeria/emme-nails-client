import React from 'react';
import { EstimateBreakdown } from '@/features/calculate-estimate/ui/EstimateBreakdown';
import { Edit3, Send } from 'lucide-react';

interface QuoteReviewStepProps {
  baseServiceName: string;
  length: string;
  shape: string;
  finish: string;
  details: string[];
  referenceImagesCount: number;
  minMXN: number;
  maxMXN: number;
  depositMXN: number;
  onEdit: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function QuoteReviewStep({
  baseServiceName,
  length,
  shape,
  finish,
  details,
  referenceImagesCount,
  minMXN,
  maxMXN,
  depositMXN,
  onEdit,
  onSubmit,
  isSubmitting = false
}: QuoteReviewStepProps) {
  const summaryItems = [
    { label: 'Servicio base', value: baseServiceName },
    { label: 'Largo y Forma', value: `${length} · ${shape}` },
    { label: 'Acabado', value: finish },
    { label: 'Detalles Nail Art', value: details.length > 0 ? details.join(', ') : 'Ninguno' },
    { label: 'Fotos adjuntas', value: `${referenceImagesCount} imágen(es)` }
  ];

  return (
    <div className="space-y-6">
      <EstimateBreakdown
        minMXN={minMXN}
        maxMXN={maxMXN}
        depositMXN={depositMXN}
        items={summaryItems}
      />

      <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-black/[0.04] text-xs text-[#86868B] leading-relaxed flex items-start gap-2">
        <span className="font-bold text-[#1D1D1F] shrink-0">Nota:</span>
        <span>
          Esta solicitud envía los detalles a la manicurista para su revisión. Aún no genera una cita agendada en calendario ni requiere pago inmediato.
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onEdit}
          className="h-11 px-5 rounded-2xl border border-black/[0.08] hover:bg-neutral-50 font-bold text-xs text-[#1D1D1F] flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Edit3 className="size-4" />
          <span>Editar Opciones</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="h-11 px-6 rounded-2xl bg-primary hover:brightness-105 font-extrabold text-xs text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all ml-auto"
        >
          <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitud de Cotización'}</span>
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
