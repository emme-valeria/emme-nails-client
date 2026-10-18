import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { NailShapeSVG } from './NailShapeSVG';

export type NailColorKey = 'Nude' | 'Pink' | 'Red' | 'White' | 'Chrome' | 'Dark' | 'Custom';

export interface NailColorOption {
  id: NailColorKey;
  name: string;
  subtitle: string;
  finishTag: string;
  hexColor: string;
  gradient: string;
  swatchBorderClass?: string;
  description: string;
}

export const NAIL_COLOR_OPTIONS: NailColorOption[] = [
  {
    id: 'Nude',
    name: 'Nude Warmth',
    subtitle: 'Nude Natural',
    finishTag: 'Transparente / Sheer',
    hexColor: '#E8C5B0',
    gradient: 'bg-gradient-to-tr from-[#DDB59E] via-[#E8C5B0] to-[#F5E1D3]',
    description: 'Tono natural atemporal que estiliza las manos con sutileza.'
  },
  {
    id: 'Pink',
    name: 'Blush Pink',
    subtitle: 'Rosa Tierno',
    finishTag: 'Brillo Glossy',
    hexColor: '#F4A2B8',
    gradient: 'bg-gradient-to-tr from-[#E07A9A] via-[#F4A2B8] to-[#FFC2D1]',
    description: 'Rosa femenino, fresco y versátil para cualquier ocasión.'
  },
  {
    id: 'Red',
    name: 'Ruby Red',
    subtitle: 'Rojo Carmesí',
    finishTag: 'Alta Pigmentación',
    hexColor: '#C8102E',
    gradient: 'bg-gradient-to-tr from-[#900018] via-[#C8102E] to-[#E63946]',
    description: 'Rojo pasional clásico y audaz con brillo cristalino.'
  },
  {
    id: 'White',
    name: 'Milky White',
    subtitle: 'Blanco Lechoso',
    finishTag: 'Efecto Latte / French',
    hexColor: '#F8F9FA',
    gradient: 'bg-gradient-to-tr from-[#E9ECEF] via-[#F8F9FA] to-[#FFFFFF]',
    swatchBorderClass: 'border-slate-300/80',
    description: 'Blanco lechoso impecable, base ideal para French o arte.'
  },
  {
    id: 'Chrome',
    name: 'Glazed Chrome',
    subtitle: 'Efecto Espejo',
    finishTag: 'Efecto Donut / Iridiscente',
    hexColor: '#E5D9F2',
    gradient: 'bg-gradient-to-tr from-[#F3E7E9] via-[#E3D5CA] to-[#A3CEF1] saturate-150',
    description: 'Destello iridiscente que refleja la luz con magia metálica.'
  },
  {
    id: 'Dark',
    name: 'Obsidian Dark',
    subtitle: 'Negro & Tonos Profundos',
    finishTag: 'Lujo Intenso',
    hexColor: '#201B1E',
    gradient: 'bg-gradient-to-tr from-[#0F0C0E] via-[#201B1E] to-[#382F35]',
    description: 'Negro azabache o borgoña profundo con acabado de alta costura.'
  },
  {
    id: 'Custom',
    name: 'Personalizado / Foto',
    subtitle: 'Paleta Exclusiva',
    finishTag: 'Multicolor / Nail Art',
    hexColor: '#E05286',
    gradient: 'bg-gradient-to-tr from-[#FF9A9E] via-[#FECFEF] to-[#a1c4fd]',
    description: 'Carga tu foto de referencia o elige una combinación de varios tonos.'
  }
];

interface NailColorSwatchSelectorProps {
  selectedColor: NailColorKey | string;
  onSelectColor: (color: NailColorKey) => void;
  selectedShape?: string;
}

export function NailColorSwatchSelector({
  selectedColor,
  onSelectColor,
  selectedShape = 'almond'
}: NailColorSwatchSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
          Gama de Color (Color Swatches)
        </label>
        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
          <Sparkles className="size-3" />
          Muestra Real de Tono
        </span>
      </div>

      {/* Grid: Nude · Pink · Red · White · Chrome · Dark · Custom */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {NAIL_COLOR_OPTIONS.map((opt) => {
          const isSelected = selectedColor === opt.id || selectedColor === opt.name;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectColor(opt.id)}
              className={`group relative p-2 sm:p-3 rounded-2xl border text-left flex flex-col justify-between gap-1.5 sm:gap-3 transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-md sm:scale-[1.02]'
                  : 'bg-card border-border/70 hover:border-primary/40 hover:bg-secondary/40'
              }`}
            >
              {/* Header: Color Swatch Circle & Mini Nail Preview */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 w-full">
                {/* Actual Color Swatch Circle */}
                <div
                  className={`size-6 sm:size-9 rounded-full ${opt.gradient} border-2 ${
                    opt.swatchBorderClass || 'border-white'
                  } shadow-sm shrink-0 transition-transform group-hover:scale-110 relative flex items-center justify-center`}
                  style={{ backgroundColor: opt.hexColor }}
                >
                  {/* Subtle inner shine gloss */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-white/40 pointer-events-none" />
                </div>

                {/* Small visual nail preview showing the exact swatch color on an almond uña */}
                <div className="bg-secondary/60 p-0.5 sm:p-1 rounded-xl border border-border/40 shrink-0 group-hover:scale-105 transition-transform">
                  <NailShapeSVG
                    shape={selectedShape}
                    fillColor={opt.hexColor}
                    className="w-4 h-6 sm:w-5 sm:h-8"
                    showDetails={false}
                  />
                </div>
              </div>

              {/* Title, Subtitle, and Finish Tag */}
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] sm:text-xs font-black text-foreground block truncate">
                    {opt.id}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 sm:static size-3 sm:size-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                      <Check className="size-2 sm:size-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <span className="hidden sm:block text-[10px] text-muted-foreground line-clamp-1">
                  {opt.subtitle}
                </span>

                <span className="inline-block text-[8px] sm:text-[9px] font-extrabold text-primary bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-full">
                  {opt.finishTag}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
