import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OnboardingStepPediToneProps {
  colorName: string;
  onSelect: (tone: { colorName: string; colorHex: string }) => void;
}

export function OnboardingStepPediTone({
  colorName,
  onSelect
}: OnboardingStepPediToneProps) {
  const tones = [
    {
      name: 'Nude Translúcido',
      hex: '#FBEBE8',
      desc: 'Limpio y natural para cualquier calzado.'
    },
    {
      name: 'EMME Rose',
      hex: '#E05286',
      desc: 'Tono insignia EMME, femenino y brillante.'
    },
    {
      name: 'French Pedi',
      hex: '#FFFFFF',
      desc: 'Punta blanca ultra fina y base lechosa.'
    },
    {
      name: 'Vino Rouge',
      hex: '#6B1D2F',
      desc: 'Elegancia clásica profunda para piel bronceada o clara.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-md mx-auto space-y-3 text-[#1D1D1F]"
    >
      <div className="space-y-1 text-left">
        <h2 className="text-xl sm:text-2xl font-black text-[#1D1D1F] tracking-tight">
          ¿Qué acabado prefieres en tus pies?
        </h2>
        <p className="text-xs text-[#86868B]">
          Toca una opción para continuar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {tones.map((t) => {
          const isSelected = colorName.toLowerCase() === t.name.toLowerCase();
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => onSelect({ colorName: t.name, colorHex: t.hex })}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 cursor-pointer ${
                isSelected
                  ? 'border-[#E05286] bg-pink-50/80 shadow-sm ring-2 ring-[#E05286]/20'
                  : 'border-pink-100 bg-white hover:border-pink-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="size-7 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: t.hex }}
                />
                {isSelected && (
                  <div className="size-4 rounded-full bg-[#E05286] text-white flex items-center justify-center">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <span className={`text-xs font-black block leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                  {t.name}
                </span>
                <p className="text-[10px] text-[#86868B] leading-tight mt-0.5">
                  {t.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
