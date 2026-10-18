import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';

interface OnboardingStepLengthProps {
  selectedLength: string;
  onSelect: (length: string) => void;
}

export function OnboardingStepLength({
  selectedLength,
  onSelect
}: OnboardingStepLengthProps) {
  const lengths = [
    { id: 'Corto', name: 'N° 1 Corto', desc: 'Cómodo para teclado y deporte' },
    { id: 'Medio', name: 'N° 2 Medio', desc: 'Equilibrio y estilo diario' },
    { id: 'Largo', name: 'N° 3 Largo', desc: 'Estilizado y elegante' },
    { id: 'XL', name: 'N° 4 XL', desc: 'Máximo impacto visual' }
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
          Largo & Extensión
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1D1D1F] tracking-tight">
          ¿Qué largo te resulta más cómodo?
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Toca una opción para ajustar el tamaño de tus extensiones.
        </p>
      </div>

      {/* iOS Inset Grouped Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.05] overflow-hidden divide-y divide-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {lengths.map((l) => {
          const isSelected = selectedLength.toLowerCase().includes(l.id.toLowerCase());
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onSelect(l.id)}
              className={`w-full min-h-[58px] sm:min-h-[62px] px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors active:bg-black/[0.03] cursor-pointer group ${
                isSelected ? 'bg-primary/[0.04]' : 'hover:bg-neutral-50/60'
              }`}
            >
              <div className="space-y-0.5 flex-1 pr-3 min-w-0">
                <span className={`text-[14px] sm:text-[15px] font-bold block leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                  {l.name}
                </span>
                <p className="text-[11px] sm:text-xs text-[#86868B] leading-tight truncate">
                  {l.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <NailLengthSVG
                  length={l.id}
                  fillColor={isSelected ? '#E05286' : '#F4A2B8'}
                  className="w-8 h-10"
                  compact={true}
                />
                <div className={`size-5 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-[#E05286] text-white shadow-2xs' : 'border border-neutral-300 bg-neutral-100/50'
                }`}>
                  {isSelected && <Check className="size-3 stroke-[3]" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

