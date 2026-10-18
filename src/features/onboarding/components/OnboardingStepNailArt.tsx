import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Flame, Palette } from 'lucide-react';

interface OnboardingStepNailArtProps {
  selectedArt: string;
  onSelect: (artLevel: string) => void;
}

export function OnboardingStepNailArt({
  selectedArt,
  onSelect
}: OnboardingStepNailArtProps) {
  const tiers = [
    {
      id: 'Básico / Liso',
      title: 'Liso o Francés Minimalista',
      desc: '1-2 tonos lisos, micro french o baby boomer',
      icon: Sparkles
    },
    {
      id: 'Glazed Chrome / Cat Eye',
      title: 'Glazed Chrome & Cat Eye',
      desc: 'Efecto perlado Hailey Bieber o imán 3D',
      icon: Flame
    },
    {
      id: 'Nail Art 3D & Cristales',
      title: 'Nail Art & Cristalería',
      desc: 'Mano alzada, cristales y diseño de autor',
      icon: Palette
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
          ¿Qué estilo de diseño buscas?
        </h2>
        <p className="text-xs text-[#86868B]">
          Toca una opción para continuar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-1">
        {tiers.map((t) => {
          const isSelected = selectedArt.toLowerCase().includes(t.id.toLowerCase()) || selectedArt === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'border-[#E05286] bg-pink-50/80 shadow-sm ring-2 ring-[#E05286]/20'
                  : 'border-pink-100 bg-white hover:border-pink-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 pr-2">
                <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-[#E05286] text-white' : 'bg-pink-50 text-[#E05286]'
                }`}>
                  <Icon className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <span className={`text-xs font-black block leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                    {t.title}
                  </span>
                  <p className="text-[10px] text-[#86868B] leading-tight">
                    {t.desc}
                  </p>
                </div>
              </div>

              <div className={`size-4 rounded-full flex items-center justify-center border shrink-0 ${
                isSelected ? 'bg-[#E05286] text-white border-[#E05286]' : 'border-neutral-300 bg-neutral-100 text-transparent'
              }`}>
                <Check className="size-2.5 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

