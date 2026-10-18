import React from 'react';
import { useQuoteFlow } from '../model/quote-flow.context';
import { Input } from '@emme/ui/input';
import { cn } from '@emme/ui/lib/utils';
import { SegmentedCapsuleTabs, TabItem } from '@/shared/components/SegmentedCapsuleTabs';

type FinishType = 'glossy' | 'matte' | 'chrome' | 'cat_eye';

const FINISH_TABS: TabItem<FinishType>[] = [
  { id: 'glossy', label: 'Brillante' },
  { id: 'matte', label: 'Mate Velvet' },
  { id: 'chrome', label: 'Cromo (+150)' },
  { id: 'cat_eye', label: 'Cat Eye (+120)' },
];

export function DesignDetailsWidget() {
  const { state, dispatch } = useQuoteFlow();
  const { designDetails } = state;

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-[#1D1D1F]">Detalles del Diseño & Art</h3>
        <p className="text-[11px] text-[#86868B]">
          Indica el acabado, la complejidad del diseño y describe cualquier detalle especial.
        </p>
      </div>

      {/* Finish Segmented Selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Acabado Deseado:</label>
        <SegmentedCapsuleTabs<FinishType>
          items={FINISH_TABS}
          value={(designDetails.finish as FinishType) || 'glossy'}
          onChange={(fin) => dispatch({ type: 'UPDATE_DESIGN_DETAILS', payload: { finish: fin } })}
          fullWidth
          size="sm"
          layoutId="design-finish-selector"
        />
      </div>

      {/* Complexity Flush List */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Complejidad del Nail Art:</label>
        <div className="divide-y divide-black/[0.05] border border-black/[0.05] rounded-2xl overflow-hidden bg-white">
          {[
            { id: 'simple', label: 'Monocolor / Minimalista', desc: 'Sin costo extra' },
            { id: 'french', label: 'Francés / Ombré / Difuminado', desc: '+$100 MXN' },
            { id: '3d_charms', label: 'Cristales 3D & Charms', desc: '+$200 MXN' },
            { id: 'art_illustration', label: 'Ilustración / Mano Alzada', desc: '+$250 MXN' },
          ].map((comp) => {
            const isSelected = designDetails.complexity === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => dispatch({ type: 'UPDATE_DESIGN_DETAILS', payload: { complexity: comp.id as any } })}
                className={cn(
                  "p-3 flex items-center justify-between transition-colors cursor-pointer",
                  isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA]"
                )}
              >
                <div className="min-w-0">
                  <span className={cn("text-xs font-semibold block truncate", isSelected ? "text-primary font-bold" : "text-[#1D1D1F]")}>
                    {comp.label}
                  </span>
                  <span className="text-[10.5px] text-[#86868B] block">{comp.desc}</span>
                </div>
                <div className={cn(
                  "size-4 rounded-full border flex items-center justify-center shrink-0",
                  isSelected ? "border-primary bg-primary" : "border-black/20"
                )}>
                  {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Free Text Description */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Descripción Libre del Diseño:</label>
        <Input 
          placeholder="Ej: Base traslúcida con aura rosa y destellos dorados..."
          value={designDetails.description || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_DESIGN_DETAILS', payload: { description: e.target.value } })}
          className="h-9 bg-white border border-black/10 rounded-xl text-xs"
        />
      </div>
    </div>
  );
}
