import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { LashStyleSVG } from './OnboardingSVGs';

interface OnboardingStepLashesProps {
  lashStyle: string;
  onSelect: (lashStyle: string) => void;
}

export function OnboardingStepLashes({
  lashStyle,
  onSelect
}: OnboardingStepLashesProps) {
  const styles = [
    {
      id: 'Foxy / Cat Eye',
      title: 'Efecto Foxy / Cat Eye',
      svgKey: 'foxy',
      desc: 'Alargamiento rasgado exterior'
    },
    {
      id: 'Clásicas 1:1',
      title: 'Clásicas Pelo a Pelo',
      svgKey: 'classic',
      desc: 'Efecto rímel limpio y sutil'
    },
    {
      id: 'Volumen Ruso & Híbrido',
      title: 'Volumen Ruso / 3D',
      svgKey: 'volume',
      desc: 'Mayor densidad y esponjosidad'
    },
    {
      id: 'Lash Lift & Botox Keratina',
      title: 'Lash Lift & Botox',
      svgKey: 'lift',
      desc: 'Elevación de tu pestaña natural'
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
          Diseño de Mirada
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1D1D1F] tracking-tight">
          ¿Te gustaría resaltar tu mirada?
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Toca una opción para elegir tu acabado de pestañas.
        </p>
      </div>

      {/* iOS Inset Grouped Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.05] overflow-hidden divide-y divide-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {styles.map((s) => {
          const isSelected = lashStyle.toLowerCase().includes(s.id.toLowerCase()) || lashStyle === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`w-full min-h-[58px] sm:min-h-[62px] px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors active:bg-black/[0.03] cursor-pointer group ${
                isSelected ? 'bg-primary/[0.04]' : 'hover:bg-neutral-50/60'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-[#E05286] text-white shadow-2xs' : 'bg-pink-50 text-[#E05286]'
                }`}>
                  <LashStyleSVG type={s.svgKey} className="w-6 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className={`text-[14px] sm:text-[15px] font-bold leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                    {s.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#86868B] leading-tight mt-0.5 truncate">
                    {s.desc}
                  </p>
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

