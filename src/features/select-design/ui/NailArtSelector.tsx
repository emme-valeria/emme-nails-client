import React from 'react';
import { Palette, Check } from 'lucide-react';

export type NailArtDetail = 'French' | 'Aura' | 'Flowers' | 'Charms' | '3D';

interface NailArtSelectorProps {
  hasNailArt: boolean;
  selectedDetails: NailArtDetail[];
  onToggleHasNailArt: (enabled: boolean) => void;
  onToggleDetail: (detail: NailArtDetail) => void;
}

const NAIL_ART_OPTIONS: Array<{
  id: NailArtDetail;
  label: string;
  description: string;
}> = [
  { id: 'French', label: 'French', description: 'Línea clásica, micro-french o de color' },
  { id: 'Aura', label: 'Aura', description: 'Efecto degradado concéntrico aireado' },
  { id: 'Flowers', label: 'Flowers', description: 'Detalles florales a mano alzada' },
  { id: 'Charms', label: 'Charms', description: 'Cristales, perlas o bisutería fina' },
  { id: '3D', label: '3D', description: 'Relieves de gel, moños, líneas 3D' }
];

export function NailArtSelector({
  hasNailArt,
  selectedDetails,
  onToggleHasNailArt,
  onToggleDetail
}: NailArtSelectorProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Toggle Box */}
      <div
        onClick={() => onToggleHasNailArt(!hasNailArt)}
        className={`p-3 sm:p-4 rounded-[1.25rem] sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4 ${
          hasNailArt
            ? 'bg-primary/10 border-primary shadow-xs'
            : 'bg-card border-border/70 hover:border-primary/40 hover:bg-secondary/40'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`size-8 sm:size-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
              hasNailArt ? 'bg-primary text-white' : 'bg-secondary text-foreground'
            }`}
          >
            <Palette className="size-4 sm:size-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-foreground">
              ¿Agregar Nail Art & Detalles?
            </h4>
            <p className="hidden sm:block text-xs text-muted-foreground">
              Personaliza con diseños pintados a mano alzada, dijes o relieves.
            </p>
          </div>
        </div>

        <input
          type="checkbox"
          checked={hasNailArt}
          onChange={(e) => onToggleHasNailArt(e.target.checked)}
          className="size-4 sm:size-5 rounded-md text-primary focus:ring-primary cursor-pointer accent-primary"
        />
      </div>

      {/* Progressive Disclosure: Only reveal options if nail art is active */}
      {hasNailArt && (
        <div className="p-3 sm:p-4 rounded-[1.25rem] sm:rounded-2xl bg-secondary/30 border border-border/50 space-y-2 sm:space-y-3 animate-in fade-in duration-300">
          <label className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-muted-foreground block">
            Selecciona los detalles deseados:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NAIL_ART_OPTIONS.map((item) => {
              const isSelected = selectedDetails.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggleDetail(item.id)}
                  className={`p-2 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-card border-border/60 hover:bg-card/80 text-foreground'
                  }`}
                >
                  <div>
                    <span className="text-[11px] sm:text-xs font-black block">{item.label}</span>
                    <span
                      className={`hidden sm:block text-[10px] line-clamp-1 ${
                        isSelected ? 'text-white/80' : 'text-muted-foreground'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>

                  {isSelected && <Check className="size-3 sm:size-3.5 shrink-0 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
