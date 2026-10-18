import React, { useState } from 'react';
import { InspirationItem } from '@/entities/inspiration/types';
import { Sparkles, Check, SlidersHorizontal, LayoutGrid, List, ChevronRight } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

interface InspirationGridProps {
  items: InspirationItem[];
  selectedId?: string;
  onSelectImage: (item: InspirationItem) => void;
  defaultLayout?: 'sliding' | 'grid' | 'list';
  showLayoutToggle?: boolean;
}

export function InspirationGrid({
  items,
  selectedId,
  onSelectImage,
  defaultLayout = 'sliding',
  showLayoutToggle = true
}: InspirationGridProps) {
  const [layoutMode, setLayoutMode] = useState<'sliding' | 'grid' | 'list'>(defaultLayout);

  return (
    <div className="space-y-3.5">
      {showLayoutToggle && (
        <div className="flex items-center justify-between pb-0.5">
          <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">
            {items.length} Diseños Disponibles
          </span>
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
              title="Vista de lista"
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
        </div>
      )}

      {/* 1. SLIDING CAROUSEL VIEW */}
      {layoutMode === 'sliding' && (
        <div className="relative">
          <div className="flex items-stretch gap-3.5 overflow-x-auto no-scrollbar py-1 px-0.5 snap-x snap-mandatory">
            {items.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectImage(item)}
                  className={cn(
                    "snap-start shrink-0 w-[180px] sm:w-[220px] aspect-4/5 group relative rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer select-none",
                    isSelected
                      ? "border-primary ring-4 ring-primary/20 shadow-xl scale-[1.02]"
                      : "border-black/[0.06] hover:border-primary/50 hover:shadow-md"
                  )}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-white bg-primary px-2.5 py-0.5 rounded-full w-fit mb-1.5 shadow-xs">
                      {item.styleCategory}
                    </span>
                    <h5 className="text-sm font-bold line-clamp-1">{item.title}</h5>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 size-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <Check className="size-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-[#86868B]">
            <span>Desliza para explorar más opciones</span>
            <ChevronRight className="size-3.5" />
          </div>
        </div>
      )}

      {/* 2. GRID VIEW */}
      {layoutMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {items.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectImage(item)}
                className={cn(
                  "group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer aspect-4/5",
                  isSelected
                    ? "border-primary ring-4 ring-primary/20 shadow-xl scale-[1.02]"
                    : "border-black/[0.06] hover:border-primary/50 hover:shadow-md"
                )}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-3 sm:p-4 flex flex-col justify-end text-white">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-white bg-primary px-2 py-0.5 rounded-full w-fit mb-1 shadow-xs">
                    {item.styleCategory}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold line-clamp-1">{item.title}</h5>
                </div>

                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 size-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <Check className="size-4 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. LIST VIEW */}
      {layoutMode === 'list' && (
        <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-black/[0.05]">
          {items.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectImage(item)}
                className={cn(
                  "px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.99] select-none",
                  isSelected
                    ? "bg-primary/5 font-semibold text-[#1D1D1F]"
                    : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5] text-[#1D1D1F]"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="size-14 rounded-xl object-cover border border-black/[0.06] shadow-2xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1D1D1F] truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                        {item.styleCategory}
                      </span>
                    </div>
                    <p className="text-xs text-[#86868B] truncate mt-0.5">
                      {item.understoodTags?.details?.join(' • ') || 'Diseño de estudio'}
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
