import React, { useState } from 'react';
import { useQuoteFlow } from '../model/quote-flow.context';
import { Check, ChevronRight, LayoutGrid, List, Sparkles, SlidersHorizontal } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export const CUSTOM_SERVICES = [
  {
    id: 'srv-1',
    title: 'Acrílico Esculpido Custom',
    desc: 'Set de extensiones en acrílico con esculpido personalizado.',
    basePrice: 650,
  },
  {
    id: 'srv-2',
    title: 'Gel Soft Extensions',
    desc: 'Extensiones de gel flexibles de curado rápido con acabado natural.',
    basePrice: 600,
  },
  {
    id: 'srv-3',
    title: 'Nail Art sobre Uña Natural',
    desc: 'Nivelación de uña natural con Kapping Gel y diseño exclusivo.',
    basePrice: 450,
  },
  {
    id: 'srv-4',
    title: 'Remoción + Set Nuevo Custom',
    desc: 'Retiro higiénico de producto anterior más aplicación de set nuevo.',
    basePrice: 750,
  },
];

export function ServiceSelectionWidget() {
  const { state, dispatch } = useQuoteFlow();
  const [layoutMode, setLayoutMode] = useState<'sliding' | 'grid' | 'list'>('sliding');

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-[#1D1D1F]">1. Selecciona el Tipo de Servicio</h3>
          <p className="text-[11px] text-[#86868B]">
            Elige la técnica base para tu cotización. Podrás personalizar largo, forma y diseño después.
          </p>
        </div>

        {/* Layout Switcher: Deslizable | Cuadrícula | Lista */}
        <div className="flex items-center bg-[#F2F2F7] p-0.5 rounded-lg border border-black/[0.06] shrink-0">
          <button
            type="button"
            onClick={() => setLayoutMode('sliding')}
            className={cn(
              "px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              layoutMode === 'sliding'
                ? "bg-white text-[#1D1D1F] shadow-2xs font-extrabold"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
            title="Vista Deslizable"
          >
            <SlidersHorizontal className="size-3.5" />
            <span className="hidden xs:inline">Desliz.</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            className={cn(
              "px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              layoutMode === 'grid'
                ? "bg-white text-[#1D1D1F] shadow-2xs font-extrabold"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
            title="Vista Cuadrícula"
          >
            <LayoutGrid className="size-3.5 text-primary" />
            <span className="hidden xs:inline">Cuadrícula</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('list')}
            className={cn(
              "px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              layoutMode === 'list'
                ? "bg-white text-[#1D1D1F] shadow-2xs font-extrabold"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
            title="Vista Lista"
          >
            <List className="size-3.5" />
            <span className="hidden xs:inline">Lista</span>
          </button>
        </div>
      </div>

      {layoutMode === 'sliding' ? (
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar p-2 snap-x snap-mandatory">
          {CUSTOM_SERVICES.map((srv) => {
            const isSelected = state.serviceId === srv.id || (!state.serviceId && srv.id === 'srv-1');
            return (
              <div
                key={srv.id}
                onClick={() =>
                  dispatch({
                    type: 'SELECT_SERVICE',
                    payload: { id: srv.id, title: srv.title, basePrice: srv.basePrice },
                  })
                }
                className={cn(
                  "snap-start shrink-0 w-[240px] p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer active:scale-[0.99] bg-white group",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-black/[0.06] hover:border-primary/40 hover:bg-[#F8F8FA]"
                )}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Sparkles className="size-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#1D1D1F] truncate group-hover:text-primary transition-colors">
                        {srv.title}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                        isSelected ? "bg-primary border-primary text-white" : "border-black/20 group-hover:border-primary/40"
                      )}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#86868B] line-clamp-2 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Desde ${srv.basePrice} MXN</span>
                  <span className="text-[10px] text-[#86868B] font-semibold">Técnica Profesional</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CUSTOM_SERVICES.map((srv) => {
            const isSelected = state.serviceId === srv.id || (!state.serviceId && srv.id === 'srv-1');
            return (
              <div
                key={srv.id}
                onClick={() =>
                  dispatch({
                    type: 'SELECT_SERVICE',
                    payload: { id: srv.id, title: srv.title, basePrice: srv.basePrice },
                  })
                }
                className={cn(
                  "p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer active:scale-[0.99] bg-white",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-black/[0.06] hover:border-primary/40 hover:bg-[#F8F8FA]"
                )}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Sparkles className="size-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#1D1D1F] truncate">
                        {srv.title}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                        isSelected ? "bg-primary border-primary text-white" : "border-black/20"
                      )}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#86868B] line-clamp-2 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Desde ${srv.basePrice} MXN</span>
                  <span className="text-[10px] text-[#86868B] font-semibold">Técnica Profesional</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="divide-y divide-black/[0.05] border border-black/[0.05] rounded-2xl overflow-hidden bg-white">
          {CUSTOM_SERVICES.map((srv) => {
            const isSelected = state.serviceId === srv.id || (!state.serviceId && srv.id === 'srv-1');
            return (
              <div
                key={srv.id}
                onClick={() =>
                  dispatch({
                    type: 'SELECT_SERVICE',
                    payload: { id: srv.id, title: srv.title, basePrice: srv.basePrice },
                  })
                }
                className={cn(
                  "p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer group",
                  isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
                )}
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-[#1D1D1F] group-hover:text-primary transition-colors truncate">
                      {srv.title}
                    </span>
                    <span className="text-xs font-bold text-primary shrink-0">Desde ${srv.basePrice} MXN</span>
                  </div>
                  <p className="text-[11px] text-[#86868B] line-clamp-1">{srv.desc}</p>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  {isSelected ? (
                    <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  ) : (
                    <ChevronRight className="size-4 text-[#86868B] group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
