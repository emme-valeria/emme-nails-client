import React from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { NailShapeSVG } from '@/shared/components/NailShapeSVG';

export type NailColorOption = 'Nude' | 'Pink' | 'Red' | 'White' | 'Chrome' | 'Dark' | 'Custom';

interface ColorSwatch {
  id: NailColorOption;
  name: string;
  subtitle: string;
  hex: string;
  gradient: string;
  finishTag: string;
}

const COLOR_SWATCHES: ColorSwatch[] = [
  {
    id: 'Nude',
    name: 'Nude Rose Gold',
    subtitle: 'Elegante, discreto y natural',
    hex: '#E8C5B0',
    gradient: 'from-[#F3D7C6] to-[#D3A992]',
    finishTag: 'Soft Cream'
  },
  {
    id: 'Pink',
    name: 'Baby Pink / Magenta',
    subtitle: 'Femenino, dulce y sofisticado',
    hex: '#F4A2B8',
    gradient: 'from-[#FFB7CA] to-[#E05286]',
    finishTag: 'Glossy Sheer'
  },
  {
    id: 'Red',
    name: 'Rojo Carmesí Pasión',
    subtitle: 'Clásico, empoderado e intenso',
    hex: '#C8102E',
    gradient: 'from-[#E63946] to-[#9B001C]',
    finishTag: 'High Pigment'
  },
  {
    id: 'White',
    name: 'Blanco Lechoso / Milk',
    subtitle: 'Limpio, pulcro e ideal para french',
    hex: '#F8F9FA',
    gradient: 'from-[#FFFFFF] to-[#E2E8F0]',
    finishTag: 'Milky Finish'
  },
  {
    id: 'Chrome',
    name: 'Efecto Espejado Cromo',
    subtitle: 'Reflejo metálico holográfico',
    hex: '#E5D9F2',
    gradient: 'from-[#E0C3FC] to-[#8EC5FC]',
    finishTag: 'Chrome Mirror'
  },
  {
    id: 'Dark',
    name: 'Negro Azabache / Noche',
    subtitle: 'Dramático, moderno y gótico chic',
    hex: '#201B1E',
    gradient: 'from-[#3A3238] to-[#120F11]',
    finishTag: 'Deep Dark'
  },
  {
    id: 'Custom',
    name: 'Tono Personalizado AI',
    subtitle: 'Mezcla especial según tu referencia',
    hex: '#E05286',
    gradient: 'from-[#FF758C] to-[#FF7EB3]',
    finishTag: 'Custom Blend'
  }
];

interface NailColorSwatchSelectorProps {
  selectedColor: NailColorOption;
  selectedColorHex?: string;
  onSelectColor: (color: NailColorOption, hex: string) => void;
}

export function NailColorSwatchSelector({
  selectedColor,
  onSelectColor
}: NailColorSwatchSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
          4. Elige tu Gama Cromática o Tono Base:
        </label>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="size-3" /> Swatches Reales
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {COLOR_SWATCHES.map((swatch) => {
          const isSelected = selectedColor === swatch.id;

          return (
            <button
              key={swatch.id}
              type="button"
              onClick={() => onSelectColor(swatch.id, swatch.hex)}
              className={`group p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2.5 relative ${
                isSelected
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-md shadow-primary/10'
                  : 'bg-card border-border/70 hover:border-primary/40 hover:bg-secondary/30'
              }`}
            >
              {/* Color sphere swatch */}
              <div className="relative">
                <div
                  className={`size-10 sm:size-14 rounded-full bg-gradient-to-br ${swatch.gradient} border-2 border-white shadow-md flex items-center justify-center transition-transform group-hover:scale-110`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {/* Miniature nail vector inside swatch */}
                  <NailShapeSVG shape="Almond" fillColor={swatch.hex} className="w-4 h-7 sm:w-5 sm:h-9 drop-shadow-xs" />
                </div>

                {isSelected && (
                  <div className="absolute -top-1 -right-1 size-4.5 sm:size-5 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white shadow-xs">
                    <Check className="size-2.5 sm:size-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title & subtitle */}
              <div className="space-y-0.5 w-full">
                <span className="text-xs font-extrabold text-foreground block truncate">
                  {swatch.id}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground block line-clamp-1">
                  {swatch.finishTag}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
