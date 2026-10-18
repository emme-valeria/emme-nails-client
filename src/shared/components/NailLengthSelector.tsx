import React, { useState } from 'react';
import { Check, LayoutGrid, List, SlidersHorizontal, ChevronRight, Sparkles } from 'lucide-react';
import { NailLengthSVG } from './NailLengthSVG';
import { cn } from '@emme/ui/lib/utils';

export type NailLength = 'short' | 'medium' | 'long' | 'xl' | 'Short' | 'Medium' | 'Long' | 'XL';

export interface NailLengthOption {
  id: NailLength;
  label: string;
  mm: string;
  description: string;
  extraPrice: string;
  vibe?: string;
}

export const NAIL_LENGTHS: NailLengthOption[] = [
  { id: 'short', label: 'Corta / Natural', mm: '~2–3 mm', description: 'Práctica, cómoda para teclear, oficina y día a día', extraPrice: 'Incluido', vibe: 'Comodidad Total' },
  { id: 'medium', label: 'Mediana', mm: '~6–8 mm', description: 'Equilibrio ideal entre estilizar la mano y durabilidad', extraPrice: '+$50 MXN', vibe: 'Más Popular' },
  { id: 'long', label: 'Larga', mm: '~10–12 mm', description: 'Estiliza visualmente los dedos y destaca el nail art', extraPrice: '+$100 MXN', vibe: 'Glam & Elegante' },
  { id: 'xl', label: 'Extra Larga (XL)', mm: '~15+ mm', description: 'Estructural y dramática, lienzo amplio para arte pro', extraPrice: '+$150 MXN', vibe: 'Impacto Visual' }
];

export interface NailLengthSelectorProps {
  selectedLength: NailLength | string;
  onSelectLength: (length: NailLength) => void;
  accentColor?: string;
  shape?: string;
  defaultLayout?: 'sliding' | 'grid' | 'list';
  showLayoutToggle?: boolean;
}

export function NailLengthSelector({
  selectedLength,
  onSelectLength,
  accentColor = '#F3C5BA',
  shape = 'almond',
  defaultLayout = 'sliding',
  showLayoutToggle = true
}: NailLengthSelectorProps) {
  const [layoutMode, setLayoutMode] = useState<'sliding' | 'grid' | 'list'>(defaultLayout);

  return (
    <div className="space-y-3.5">
      {/* Header with Title, Selected Length and 3 Layout Toggles */}
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#86868B]">
            2. Longitud Deseada
          </label>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full capitalize">
            {selectedLength}
          </span>
        </div>

        {showLayoutToggle && (
          <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-xl border border-black/[0.04]">
            <button
              type="button"
              onClick={() => setLayoutMode('sliding')}
              title="Vista deslizable (carrusel izquierda a derecha)"
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                layoutMode === 'sliding'
                  ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              )}
            >
              <SlidersHorizontal className="size-3.5" />
              <span className="text-[11px]">Deslizable</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('grid')}
              title="Vista de cuadrícula"
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                layoutMode === 'grid'
                  ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              )}
            >
              <LayoutGrid className="size-3.5" />
              <span className="text-[11px]">Cuadrícula</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('list')}
              title="Vista de lista detallada"
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                layoutMode === 'list'
                  ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              )}
            >
              <List className="size-3.5" />
              <span className="text-[11px]">Lista</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. SLIDING CAROUSEL (LEFT TO RIGHT) - Primary Default */}
      {layoutMode === 'sliding' && (
        <div className="relative">
          <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-1 px-0.5 snap-x snap-mandatory">
            {NAIL_LENGTHS.map((opt) => {
              const isSelected = selectedLength.toLowerCase() === opt.id.toLowerCase();
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectLength(opt.id)}
                  className={cn(
                    "snap-start shrink-0 w-[150px] sm:w-[170px] p-4 rounded-3xl border text-center flex flex-col items-center justify-between gap-3 transition-all cursor-pointer active:scale-95 bg-white select-none relative",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 shadow-md bg-primary/[0.03] scale-[1.02]"
                      : "border-black/[0.06] hover:border-primary/40 hover:bg-[#FBFBFD] shadow-2xs"
                  )}
                >
                  {/* Top Badges */}
                  <div className="w-full flex items-center justify-between min-h-[20px]">
                    <span className={cn(
                      "text-[9px] font-extrabold px-2 py-0.5 rounded-full",
                      opt.extraPrice === 'Incluido'
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-primary/10 text-primary"
                    )}>
                      {opt.extraPrice}
                    </span>

                    {isSelected && (
                      <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center shadow-2xs">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Nail Length Frame */}
                  <div className="w-20 h-24 rounded-2xl bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 border border-black/[0.05] flex items-center justify-center p-2 shadow-2xs">
                    <NailLengthSVG
                      length={opt.id}
                      shape={shape}
                      fillColor={accentColor || '#F3C5BA'}
                      className="w-10 h-16"
                      showGuides={false}
                    />
                  </div>

                  {/* Labels */}
                  <div className="w-full space-y-1 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-sm font-display font-bold text-[#1D1D1F]">
                        {opt.label}
                      </span>
                    </div>
                    <span className="inline-block text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                      {opt.mm}
                    </span>
                    <p className="text-[11px] text-[#86868B] line-clamp-2 leading-tight mt-0.5">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-[#86868B]">
            <span>Desliza para explorar más largos</span>
            <ChevronRight className="size-3.5" />
          </div>
        </div>
      )}

      {/* 2. GRID LAYOUT */}
      {layoutMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NAIL_LENGTHS.map((opt) => {
            const isSelected = selectedLength.toLowerCase() === opt.id.toLowerCase();
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectLength(opt.id)}
                className={cn(
                  "relative p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between gap-2.5 transition-all cursor-pointer active:scale-98 bg-white",
                  isSelected
                    ? "bg-primary/[0.03] border-primary ring-2 ring-primary/20 shadow-xs scale-[1.02]"
                    : "border-black/[0.06] hover:border-primary/40 hover:bg-[#FBFBFD]"
                )}
              >
                <div className="w-full aspect-square max-w-[64px] rounded-xl bg-gradient-to-b from-neutral-50/80 to-neutral-100/90 border border-black/[0.06] flex items-center justify-center p-1 shadow-2xs">
                  <NailLengthSVG
                    length={opt.id}
                    shape={shape}
                    fillColor={accentColor || '#F3C5BA'}
                    className="w-8 h-12"
                    showGuides={false}
                  />
                </div>

                <div className="space-y-1 w-full text-center">
                  <span className="text-xs font-bold text-[#1D1D1F] block truncate">
                    {opt.label}
                  </span>
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    <span className="inline-block text-[9px] font-mono font-bold text-[#86868B] bg-neutral-100 px-1.5 py-0.2 rounded-md">
                      {opt.mm}
                    </span>
                    <span className="inline-block text-[9px] font-extrabold text-primary bg-primary/10 px-1.5 py-0.2 rounded-md">
                      {opt.extraPrice}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 size-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. LIST LAYOUT */}
      {layoutMode === 'list' && (
        <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-black/[0.05]">
          {NAIL_LENGTHS.map((opt) => {
            const isSelected = selectedLength.toLowerCase() === opt.id.toLowerCase();
            return (
              <div
                key={opt.id}
                onClick={() => onSelectLength(opt.id)}
                className={cn(
                  "px-4 py-3.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.99] select-none",
                  isSelected
                    ? "bg-primary/5 font-semibold text-[#1D1D1F]"
                    : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="size-12 rounded-xl bg-gradient-to-b from-neutral-50/80 to-neutral-100/90 border border-black/[0.06] flex items-center justify-center shrink-0 p-1 shadow-2xs">
                    <NailLengthSVG
                      length={opt.id}
                      shape={shape}
                      fillColor={accentColor || '#F3C5BA'}
                      className="w-7 h-10"
                      showGuides={false}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#1D1D1F]">
                        {opt.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.2 rounded-md">
                        {opt.mm}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-extrabold px-1.5 py-0.2 rounded-md",
                          opt.extraPrice === 'Incluido'
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {opt.extraPrice}
                      </span>
                    </div>
                    <p className="text-xs text-[#86868B] truncate sm:whitespace-normal mt-0.5 leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "size-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                    isSelected ? "bg-primary border-primary text-white shadow-2xs" : "border-black/20"
                  )}
                >
                  {isSelected && <Check className="size-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

