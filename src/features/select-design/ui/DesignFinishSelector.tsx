import React, { useState } from 'react';
import { Check, Sparkles, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export type FinishType = 'Glossy' | 'Matte' | 'Chrome' | 'Cat-eye' | 'Jelly';

interface DesignFinishSelectorProps {
  selectedFinish: FinishType | string;
  onSelect: (finish: FinishType) => void;
  defaultLayout?: 'sliding' | 'grid' | 'list';
}

const FINISH_OPTIONS: Array<{
  id: FinishType;
  label: string;
  badge: string;
  description: string;
  imageUrl: string;
  gradientBg: string;
}> = [
  {
    id: 'Glossy',
    label: 'Glossy Top',
    badge: 'Brillo Espejo',
    description: 'Acabado ultra brillante clásico y protector de larga duración.',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&auto=format&fit=crop&q=80',
    gradientBg: 'bg-gradient-to-tr from-pink-300 via-rose-200 to-white'
  },
  {
    id: 'Matte',
    label: 'Matte Velvet',
    badge: 'Terciopelo',
    description: 'Textura suave al tacto sin brillo con aspecto editorial elegante.',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&auto=format&fit=crop&q=80',
    gradientBg: 'bg-gradient-to-tr from-stone-400 to-stone-200'
  },
  {
    id: 'Chrome',
    label: 'Glazed Chrome',
    badge: 'Polvo Espejo 3D',
    description: 'Efecto metálico iridiscente (Glazed Donut / Cromo Holo).',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&auto=format&fit=crop&q=80',
    gradientBg: 'bg-gradient-to-tr from-amber-200 via-rose-300 to-purple-400'
  },
  {
    id: 'Cat-eye',
    label: 'Cat-Eye 9D',
    badge: 'Magnético Galaxia',
    description: 'Pigmentos magnéticos con destello de profundidad tridimensional.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    gradientBg: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500'
  },
  {
    id: 'Jelly',
    label: 'Jelly Translúcido',
    badge: 'Vidrio Tintado',
    description: 'Color suave con transparencia de vidrio o caramelo dulce.',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80',
    gradientBg: 'bg-gradient-to-tr from-pink-400/60 to-rose-300/40'
  }
];

export function DesignFinishSelector({
  selectedFinish,
  onSelect,
  defaultLayout = 'sliding'
}: DesignFinishSelectorProps) {
  const [layoutMode, setLayoutMode] = useState<'sliding' | 'grid' | 'list'>(defaultLayout);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
          Acabado & Textura Real (Finish Swatches)
        </label>
        
        {/* Layout Switcher: Deslizable | Cuadrícula | Lista */}
        <div className="flex items-center bg-secondary/80 p-0.5 rounded-lg border border-border/60 shrink-0">
          <button
            type="button"
            onClick={() => setLayoutMode('sliding')}
            className={cn(
              "px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              layoutMode === 'sliding'
                ? "bg-card text-foreground shadow-2xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
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
                ? "bg-card text-foreground shadow-2xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
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
                ? "bg-card text-foreground shadow-2xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Vista Lista"
          >
            <List className="size-3.5" />
            <span className="hidden xs:inline">Lista</span>
          </button>
        </div>
      </div>

      {layoutMode === 'sliding' ? (
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {FINISH_OPTIONS.map((opt) => {
            const isSelected = selectedFinish.toLowerCase() === opt.id.toLowerCase();

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect(opt.id)}
                className={cn(
                  "snap-start shrink-0 w-[140px] group relative p-4 rounded-3xl border text-center flex flex-col items-center gap-3 transition-all cursor-pointer overflow-hidden active:scale-98",
                  isSelected
                    ? "bg-primary/10 border-primary shadow-md ring-2 ring-primary/20 scale-[1.02]"
                    : "bg-card border-border/70 hover:border-primary/40 hover:bg-secondary/40"
                )}
              >
                {/* Photo Texture Swatch with Real Salon Result */}
                <div className="relative size-16 rounded-2xl overflow-hidden border border-border/60 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={opt.imageUrl}
                    alt={opt.label}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className={`absolute bottom-1 right-1 size-4 rounded-full ${opt.gradientBg} border border-white shadow-xs`} />
                </div>

                <div className="space-y-1 w-full flex flex-col items-center">
                  <span className="text-[13px] font-extrabold text-foreground block w-full truncate">
                    {opt.label}
                  </span>
                  <span className="inline-block text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full w-fit max-w-full truncate">
                    {opt.badge}
                  </span>
                </div>
                
                {isSelected && (
                  <div className="absolute top-2 right-2 size-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {FINISH_OPTIONS.map((opt) => {
            const isSelected = selectedFinish.toLowerCase() === opt.id.toLowerCase();

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect(opt.id)}
                className={cn(
                  "group relative p-3 rounded-2xl border text-center flex flex-col items-center justify-between gap-2 transition-all cursor-pointer overflow-hidden active:scale-98",
                  isSelected
                    ? "bg-primary/10 border-primary shadow-md ring-2 ring-primary/20 scale-[1.02]"
                    : "bg-card border-border/70 hover:border-primary/40 hover:bg-secondary/40"
                )}
              >
                {/* Photo Texture Swatch with Real Salon Result */}
                <div className="relative size-12 sm:size-14 rounded-2xl overflow-hidden border border-border/60 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={opt.imageUrl}
                    alt={opt.label}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className={`absolute bottom-1 right-1 size-3.5 rounded-full ${opt.gradientBg} border border-white shadow-xs`} />
                </div>

                <div className="space-y-0.5 w-full">
                  <span className="text-xs font-extrabold text-foreground block truncate">
                    {opt.label}
                  </span>
                  <span className="inline-block text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full truncate">
                    {opt.badge}
                  </span>
                </div>

                {isSelected && (
                  <div className="size-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="divide-y divide-border/60 border border-border/70 rounded-2xl overflow-hidden bg-card">
          {FINISH_OPTIONS.map((opt) => {
            const isSelected = selectedFinish.toLowerCase() === opt.id.toLowerCase();
            return (
              <div
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className={cn(
                  "p-3 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left",
                  isSelected ? "bg-primary/5 font-semibold" : "hover:bg-secondary/40 active:bg-secondary/60"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative size-10 rounded-xl overflow-hidden border border-border/60 shadow-2xs shrink-0">
                    <img
                      src={opt.imageUrl}
                      alt={opt.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-foreground truncate">{opt.label}</h4>
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded-md">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-muted-foreground truncate">{opt.description}</p>
                  </div>
                </div>

                <div
                  className={cn(
                    "size-5 rounded-full border flex items-center justify-center shrink-0",
                    isSelected ? "bg-primary border-primary text-white" : "border-border/70"
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
