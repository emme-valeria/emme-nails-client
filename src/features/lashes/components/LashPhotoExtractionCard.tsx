import React from 'react';
import { Eye, Sparkles, Check, ChevronRight, Layers, ShieldCheck, Clock, Ruler } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerHaptic } from '@/shared/utils/haptics';
import { LashPhotoDetailedAnalysis } from '@/domain/quotes/infrastructure/ai/lash-photo-detail-processor';

interface LashPhotoExtractionCardProps {
  analysis: LashPhotoDetailedAnalysis;
  onApply: () => void;
  className?: string;
}

export function LashPhotoExtractionCard({
  analysis,
  onApply,
  className
}: LashPhotoExtractionCardProps) {
  return (
    <div className={cn(
      "w-full bg-white rounded-2xl border border-black/[0.08] shadow-xs overflow-hidden p-4 space-y-3.5",
      className
    )}>
      {/* Header with Photo Thumbnail and IA Badge */}
      <div className="flex items-center gap-3">
        {analysis.referenceImageUrl ? (
          <div className="size-14 rounded-xl overflow-hidden border border-black/10 shrink-0 bg-neutral-100">
            <img
              src={analysis.referenceImageUrl}
              alt="Foto Pestañas"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="size-14 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <Eye className="size-6" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1">
              <Sparkles className="size-2.5" />
              IA Scanner Pestañas
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {analysis.technique.confidence}% Precisión
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-[#1D1D1F] truncate mt-0.5">
            {analysis.technique.label}
          </h4>
          <p className="text-xs text-[#86868B] truncate">
            {analysis.curvature.label} • {analysis.mapping.label}
          </p>
        </div>
      </div>

      {/* Extracted Specifications Grid */}
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#FAF9F7] rounded-xl border border-black/[0.05] text-center">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-[#86868B] uppercase">Densidad</span>
          <p className="text-xs font-extrabold text-[#1D1D1F]">{analysis.technique.densityLevel}</p>
        </div>
        <div className="space-y-0.5 border-x border-black/[0.06]">
          <span className="text-[10px] font-bold text-[#86868B] uppercase">Curvatura</span>
          <p className="text-xs font-extrabold text-[#1D1D1F]">{analysis.curvature.type} ({analysis.curvature.degrees.split(' ')[0]})</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-[#86868B] uppercase">Mapeo</span>
          <p className="text-xs font-extrabold text-[#1D1D1F]">{analysis.mapping.type === 'cat_eye' ? 'Cat Eye' : analysis.mapping.type === 'doll_eye' ? 'Doll Eye' : 'Natural'}</p>
        </div>
      </div>

      {/* Quote summary & apply button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] text-[#86868B] block">Cotización Salón</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-[#1D1D1F]">${analysis.estimatedPriceMXN} MXN</span>
            <span className="text-[11px] text-[#86868B]">~{analysis.estimatedTimeMins} min</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onApply();
          }}
          className="h-9 px-4 rounded-xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98 transition-all"
        >
          <span>Aplicar al Simulador</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
