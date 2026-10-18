import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OnboardingStepNaturalFinishProps {
  finish: string;
  onSelect: (finish: string) => void;
}

export function OnboardingStepNaturalFinish({
  finish,
  onSelect
}: OnboardingStepNaturalFinishProps) {
  const finishes = [
    {
      id: 'Glossy Brillante',
      title: 'Brillo Glossy Espejo',
      desc: 'Top coat con brillo ultra reflejante y duradero.'
    },
    {
      id: 'Satinado Mate',
      title: 'Acabado Satinado / Mate',
      desc: 'Textura terciopelo suave y discreta.'
    },
    {
      id: 'Tinte Nude / Milky',
      title: 'Tinte Suave Milky Pink',
      desc: 'Toque ligero de color porcelana saludable.'
    },
    {
      id: 'Natural Pulido',
      title: 'Pulido Natural al Aceite',
      desc: 'Brillo propio de la queratina sin esmalte.'
    }
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
          Acabado & Textura
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1D1D1F] tracking-tight">
          ¿Qué acabado final prefieres?
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Toca una opción para finalizar tu perfil de cuidado.
        </p>
      </div>

      {/* iOS Inset Grouped Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.05] overflow-hidden divide-y divide-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {finishes.map((f) => {
          const isSelected = finish.toLowerCase().includes(f.id.toLowerCase());
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelect(f.id)}
              className={`w-full min-h-[58px] sm:min-h-[62px] px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors active:bg-black/[0.03] cursor-pointer group ${
                isSelected ? 'bg-primary/[0.04]' : 'hover:bg-neutral-50/60'
              }`}
            >
              <div className="space-y-0.5 flex-1 pr-3 min-w-0">
                <span className={`text-[14px] sm:text-[15px] font-bold block leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                  {f.title}
                </span>
                <p className="text-[11px] sm:text-xs text-[#86868B] leading-tight truncate">
                  {f.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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
