import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { NailShapeSVG } from '@/shared/components/NailShapeSVG';

interface OnboardingStepShapeProps {
  selectedShape: string;
  colorHex?: string;
  onSelect: (shape: string) => void;
}

export function OnboardingStepShape({
  selectedShape,
  colorHex = '#E05286',
  onSelect
}: OnboardingStepShapeProps) {
  const shapes = [
    { id: 'Almendra', label: 'Almendra', desc: 'Elegante y estilizada', iconShape: 'almond' },
    { id: 'Coffin', label: 'Coffin', desc: 'Punta cónica recta', iconShape: 'coffin' },
    { id: 'Cuadrada', label: 'Cuadrada', desc: 'Bordes limpios clásicos', iconShape: 'square' },
    { id: 'Squoval', label: 'Squoval', desc: 'Cuadrada con esquinas suaves', iconShape: 'squoval' },
    { id: 'Ovalada', label: 'Ovalada', desc: 'Silueta natural suave', iconShape: 'oval' },
    { id: 'Stiletto', label: 'Stiletto', desc: 'Punta afilada y audaz', iconShape: 'stiletto' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-md mx-auto space-y-4 text-[#1D1D1F]"
    >
      <div className="space-y-1 text-left px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          Forma & Estructura
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1D1D1F] tracking-tight">
          ¿Qué forma de uña te gusta más?
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Toca una silueta para definir la base de tus sets.
        </p>
      </div>

      {/* iOS Inset Grouped Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.05] overflow-hidden divide-y divide-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {shapes.map((s) => {
          const isSelected = selectedShape.toLowerCase() === s.id.toLowerCase();
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`w-full min-h-[52px] sm:min-h-[56px] px-4 sm:px-5 py-3 flex items-center justify-between text-left transition-colors active:bg-black/[0.03] cursor-pointer group ${
                isSelected ? 'bg-primary/[0.04]' : 'hover:bg-neutral-50/60'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-pink-100/70' : 'bg-neutral-100/70'
                }`}>
                  <NailShapeSVG
                    shape={s.iconShape}
                    fillColor={isSelected ? colorHex : '#A0A0A5'}
                    className="w-5 h-8"
                  />
                </div>
                <div className="min-w-0">
                  <span className={`text-[14px] sm:text-[15px] font-bold leading-tight block ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                    {s.label}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#86868B] leading-tight block mt-0.5 truncate">
                    {s.desc}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isSelected && (
                  <div className="size-5 rounded-full bg-[#E05286] text-white flex items-center justify-center shadow-2xs">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

