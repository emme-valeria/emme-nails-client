import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OnboardingStepBrowsProps {
  selectedBrow: string;
  onSelect: (brow: string) => void;
}

export function OnboardingStepBrows({
  selectedBrow,
  onSelect
}: OnboardingStepBrowsProps) {
  const brows = [
    {
      id: 'Laminado de Cejas',
      title: 'Laminado de Cejas HD',
      desc: 'Efecto peinado fijado, ordenado y con mayor densidad.'
    },
    {
      id: 'Diseño con Henna',
      title: 'Diseño & Tinte Henna',
      desc: 'Definición y sombreado semipermanente de cejas.'
    },
    {
      id: 'Perfilado & Cera',
      title: 'Perfilado con Cera o Pinza',
      desc: 'Diseño según tu morfología facial y limpieza de arco.'
    },
    {
      id: 'Solo Pestañas',
      title: 'Solo Pestañas (Sin Cejas)',
      desc: 'Enfocar la cita exclusivamente en la extensión de pestañas.'
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
          Cejas & Visagismo
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1D1D1F] tracking-tight">
          ¿Deseas diseño de cejas complementario?
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Toca una opción para finalizar tu perfil de mirada.
        </p>
      </div>

      {/* iOS Inset Grouped Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.05] overflow-hidden divide-y divide-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {brows.map((b) => {
          const isSelected = selectedBrow === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect(b.id)}
              className={`w-full min-h-[58px] sm:min-h-[62px] px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors active:bg-black/[0.03] cursor-pointer group ${
                isSelected ? 'bg-primary/[0.04]' : 'hover:bg-neutral-50/60'
              }`}
            >
              <div className="space-y-0.5 flex-1 pr-3 min-w-0">
                <span className={`text-[14px] sm:text-[15px] font-bold block leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                  {b.title}
                </span>
                <p className="text-[11px] sm:text-xs text-[#86868B] leading-tight truncate">
                  {b.desc}
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
