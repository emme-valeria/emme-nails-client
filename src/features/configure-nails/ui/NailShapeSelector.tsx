import React, { useState } from 'react';
import { Check, LayoutGrid, List } from 'lucide-react';
import { NailShapeSVG } from '@/shared/components/NailShapeSVG';

export type NailShape = 'Square' | 'Almond' | 'Oval' | 'Coffin';

interface NailShapeSelectorProps {
  selectedShape: NailShape | string;
  onSelect: (shape: NailShape) => void;
  defaultLayout?: 'list' | 'grid';
}

const SHAPE_OPTIONS: Array<{
  id: NailShape;
  label: string;
  description: string;
  vibe: string;
}> = [
  {
    id: 'Almond',
    label: 'Almond (Almendra)',
    description: 'Punta suavemente afilada elegante que afina los dedos.',
    vibe: 'Estilizada'
  },
  {
    id: 'Square',
    label: 'Square (Cuadrada)',
    description: 'Bordes rectos y esquinas definidas.',
    vibe: 'Clásica'
  },
  {
    id: 'Oval',
    label: 'Oval (Ovalada)',
    description: 'Curvatura suave clásica que estiliza con naturalidad.',
    vibe: 'Natural'
  },
  {
    id: 'Coffin',
    label: 'Coffin / Ballerina',
    description: 'Bordes cónicos con punta recta estructural moderna.',
    vibe: 'Glam'
  }
];

export function NailShapeSelector({
  selectedShape,
  onSelect,
  defaultLayout = 'grid'
}: NailShapeSelectorProps) {
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>(defaultLayout);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
          Forma de la Uña (Silueta)
        </label>
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-black/[0.04]">
          <button
            type="button"
            onClick={() => setLayoutMode('list')}
            className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              layoutMode === 'list' ? 'bg-white text-[#1D1D1F] shadow-2xs' : 'text-[#86868B]'
            }`}
          >
            <List className="size-3.5" />
            <span className="hidden sm:inline text-[11px]">Lista</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              layoutMode === 'grid' ? 'bg-white text-[#1D1D1F] shadow-2xs' : 'text-[#86868B]'
            }`}
          >
            <LayoutGrid className="size-3.5" />
            <span className="hidden sm:inline text-[11px]">Cuadrícula</span>
          </button>
        </div>
      </div>

      {layoutMode === 'list' ? (
        <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-black/[0.05]">
          {SHAPE_OPTIONS.map((opt) => {
            const isSelected = selectedShape.toLowerCase() === opt.id.toLowerCase();
            return (
              <div
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className={`px-3.5 sm:px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.99] select-none ${
                  isSelected ? 'bg-primary/5 font-semibold text-[#1D1D1F]' : 'hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-11 rounded-xl bg-gradient-to-b from-neutral-50 to-neutral-100 border border-black/[0.06] flex items-center justify-center shrink-0 p-1 shadow-2xs">
                    <NailShapeSVG
                      shape={opt.id}
                      fillColor={isSelected ? '#E05286' : '#F4A2B8'}
                      className="w-6 h-9"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[#1D1D1F]">{opt.label}</span>
                      <span className="text-[9px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded-md">{opt.vibe}</span>
                    </div>
                    <p className="text-[11px] text-[#86868B] truncate sm:whitespace-normal mt-0.5">{opt.description}</p>
                  </div>
                </div>
                <div className={`size-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'bg-primary border-primary text-white shadow-2xs' : 'border-black/20'
                }`}>
                  {isSelected && <Check className="size-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SHAPE_OPTIONS.map((opt) => {
            const isSelected = selectedShape.toLowerCase() === opt.id.toLowerCase();

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect(opt.id)}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between gap-2 transition-all cursor-pointer active:scale-98 ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-xs ring-2 ring-primary/20 scale-[1.02]'
                    : 'bg-card border-border/70 hover:border-primary/40 hover:bg-secondary/40'
                }`}
              >
                <div className="size-12 flex items-center justify-center">
                  <NailShapeSVG
                    shape={opt.id}
                    fillColor={isSelected ? '#E05286' : '#F4A2B8'}
                    className="w-7 h-11"
                  />
                </div>

                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-foreground block">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground block line-clamp-1">
                    {opt.description}
                  </span>
                </div>

                {isSelected && (
                  <div className="size-4 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
