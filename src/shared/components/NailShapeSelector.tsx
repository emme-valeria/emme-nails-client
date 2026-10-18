import React, { useState } from 'react';
import { Check, LayoutGrid, List, SlidersHorizontal, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { NailShapeSVG } from './NailShapeSVG';
import { cn } from '@emme/ui/lib/utils';

export type NailShape = 'square' | 'almond' | 'coffin' | 'oval' | 'stiletto' | 'squoval';

export interface NailShapeOption {
  id: NailShape;
  label: string;
  description: string;
  popular?: boolean;
  vibe?: string;
}

export const NAIL_SHAPES: NailShapeOption[] = [
  { id: 'almond', label: 'Almendra', description: 'Elegante, estiliza y afina visualmente los dedos', popular: true, vibe: 'Estilizada & Chic' },
  { id: 'square', label: 'Cuadrada', description: 'Líneas rectas definidas, estructura clásica y fuerte', popular: true, vibe: 'Clásica & Fuerte' },
  { id: 'coffin', label: 'Coffin / Ballerina', description: 'Tendencia cónica con punta recta estructural', popular: true, vibe: 'Moderna & Glam' },
  { id: 'squoval', label: 'Squoval', description: 'Híbrida de bordes rectos con esquinas suaves redondeadas', vibe: 'Práctica & Cómoda' },
  { id: 'oval', label: 'Ovalada', description: 'Curvatura suave, aspecto natural y armonioso', vibe: 'Suave & Natural' },
  { id: 'stiletto', label: 'Stiletto', description: 'Punta audaz, afilada y vanguardista para nail art', vibe: 'Audaz & Impactante' }
];

export interface NailShapeSelectorProps {
  selectedShape: NailShape | string;
  onSelectShape: (shape: NailShape) => void;
  accentColor?: string;
  defaultLayout?: 'sliding' | 'grid' | 'list';
  showLayoutToggle?: boolean;
}

export function NailShapeSelector({
  selectedShape,
  onSelectShape,
  accentColor = '#F3C5BA',
  defaultLayout = 'sliding',
  showLayoutToggle = true
}: NailShapeSelectorProps) {
  const [layoutMode, setLayoutMode] = useState<'sliding' | 'grid' | 'list'>(defaultLayout);

  return (
    <div className="space-y-3.5">
      {/* Header with Title, Selected Shape and 3 Layout Toggles */}
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#86868B]">
            Silueta & Forma de Uña
          </label>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full capitalize">
            {selectedShape}
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
            {NAIL_SHAPES.map((shape) => {
              const isSelected = selectedShape.toLowerCase() === shape.id.toLowerCase();
              return (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => onSelectShape(shape.id)}
                  className={cn(
                    "snap-start shrink-0 w-[150px] sm:w-[170px] p-4 rounded-3xl border text-center flex flex-col items-center justify-between gap-3 transition-all cursor-pointer active:scale-95 bg-white select-none relative",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 shadow-md bg-primary/[0.03] scale-[1.02]"
                      : "border-black/[0.06] hover:border-primary/40 hover:bg-[#FBFBFD] shadow-2xs"
                  )}
                >
                  {/* Top Badge */}
                  <div className="w-full flex items-center justify-between min-h-[20px]">
                    {shape.popular ? (
                      <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#86868B]">{shape.vibe?.split(' ')[0]}</span>
                    )}

                    {isSelected && (
                      <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center shadow-2xs">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Nail SVG Frame */}
                  <div className="w-20 h-24 rounded-2xl bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 border border-black/[0.05] flex items-center justify-center p-2 shadow-2xs">
                    <NailShapeSVG
                      shape={shape.id}
                      fillColor={accentColor || '#F3C5BA'}
                      className="w-10 h-16"
                    />
                  </div>

                  {/* Labels */}
                  <div className="w-full space-y-1 text-center">
                    <span className="text-sm font-display font-bold text-[#1D1D1F] block truncate">
                      {shape.label}
                    </span>
                    <p className="text-[11px] text-[#86868B] line-clamp-2 leading-tight">
                      {shape.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-[#86868B]">
            <span>Desliza para explorar más formas</span>
            <ChevronRight className="size-3.5" />
          </div>
        </div>
      )}

      {/* 2. GRID LAYOUT */}
      {layoutMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {NAIL_SHAPES.map((shape) => {
            const isSelected = selectedShape.toLowerCase() === shape.id.toLowerCase();
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => onSelectShape(shape.id)}
                className={cn(
                  "relative p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between gap-2.5 transition-all cursor-pointer active:scale-98 bg-white",
                  isSelected
                    ? "bg-primary/[0.03] border-primary ring-2 ring-primary/20 shadow-xs scale-[1.02]"
                    : "border-black/[0.06] hover:border-primary/40 hover:bg-[#FBFBFD]"
                )}
              >
                <div className="w-full aspect-square max-w-[64px] rounded-xl bg-gradient-to-b from-neutral-50/80 to-neutral-100/90 border border-black/[0.06] flex items-center justify-center p-1 shadow-2xs">
                  <NailShapeSVG
                    shape={shape.id}
                    fillColor={accentColor || '#F3C5BA'}
                    className="w-8 h-12"
                  />
                </div>

                <div className="space-y-0.5 w-full text-center">
                  <span className="text-xs font-bold text-[#1D1D1F] block truncate">
                    {shape.label}
                  </span>
                  {shape.popular && (
                    <span className="inline-block text-[8.5px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded-md">
                      Popular
                    </span>
                  )}
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
          {NAIL_SHAPES.map((shape) => {
            const isSelected = selectedShape.toLowerCase() === shape.id.toLowerCase();
            return (
              <div
                key={shape.id}
                onClick={() => onSelectShape(shape.id)}
                className={cn(
                  "px-4 py-3.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.99] select-none",
                  isSelected
                    ? "bg-primary/5 font-semibold text-[#1D1D1F]"
                    : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="size-12 rounded-xl bg-gradient-to-b from-neutral-50/80 to-neutral-100/90 border border-black/[0.06] flex items-center justify-center shrink-0 p-1 shadow-2xs">
                    <NailShapeSVG
                      shape={shape.id}
                      fillColor={accentColor || '#F3C5BA'}
                      className="w-7 h-10"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#1D1D1F]">
                        {shape.label}
                      </span>
                      {shape.popular && (
                        <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-1.5 py-0.2 rounded-md shrink-0">
                          Popular
                        </span>
                      )}
                      {shape.vibe && (
                        <span className="hidden md:inline text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded-md">
                          {shape.vibe}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#86868B] truncate sm:whitespace-normal mt-0.5 leading-snug">
                      {shape.description}
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

