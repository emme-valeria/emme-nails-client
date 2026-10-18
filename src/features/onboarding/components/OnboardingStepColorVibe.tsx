import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OnboardingStepColorVibeProps {
  colorName: string;
  colorHex: string;
  styleVibe: string;
  onSelect: (updates: { colorName?: string; colorHex?: string; styleVibe?: string }) => void;
}

export function OnboardingStepColorVibe({
  colorName,
  colorHex,
  styleVibe,
  onSelect
}: OnboardingStepColorVibeProps) {
  const vibes = [
    { id: 'Clean Girl', label: 'Clean Girl', hex: '#FFFFFF', name: 'Milky White', desc: 'Milky white y nudes limpios' },
    { id: 'EMME Rose', label: 'EMME Rose', hex: '#E05286', name: 'EMME Rose', desc: 'Rosa característico del estudio' },
    { id: 'Glazed Chrome', label: 'Glazed Pearl', hex: '#F0EBE5', name: 'Glazed Pearl', desc: 'Perla nacarada brillante' },
    { id: 'Old Money', label: 'Cherry Rouge', hex: '#8B0000', name: 'Cherry Rouge', desc: 'Vino tinto y rojo clásico' }
  ];

  const colors = [
    { name: 'EMME Rose', hex: '#E05286', isLight: false },
    { name: 'Milky White', hex: '#FFFFFF', isLight: true },
    { name: 'Blush Nude', hex: '#FAD2E1', isLight: true },
    { name: 'Bare Nude', hex: '#E8D5C4', isLight: true },
    { name: 'Peach Soft', hex: '#FCE7D8', isLight: true },
    { name: 'Cherry Rouge', hex: '#8B0000', isLight: false },
    { name: 'Glazed Pearl', hex: '#E5E7EB', isLight: true },
    { name: 'Noir Black', hex: '#1D1D1F', isLight: false }
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
          Color & Estética
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1D1D1F] tracking-tight">
          ¿Qué paleta o vibe te inspira más?
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Toca una estética o elige un tono puntual para tu set.
        </p>
      </div>

      {/* iOS Inset Grouped Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.05] overflow-hidden divide-y divide-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {vibes.map((v) => {
          const isSelected = styleVibe.toLowerCase() === v.id.toLowerCase();
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect({ styleVibe: v.id, colorHex: v.hex, colorName: v.name })}
              className={`w-full min-h-[58px] sm:min-h-[62px] px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors active:bg-black/[0.03] cursor-pointer group ${
                isSelected ? 'bg-primary/[0.04]' : 'hover:bg-neutral-50/60'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                <div
                  className="size-9 rounded-full border border-black/10 shadow-xs shrink-0"
                  style={{ backgroundColor: v.hex }}
                />
                <div className="min-w-0">
                  <h4 className={`text-[14px] sm:text-[15px] font-bold leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                    {v.label}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#86868B] leading-tight mt-0.5 truncate">
                    {v.desc}
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

      {/* Edge-to-Edge Color Swatches */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.05] p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2">
        <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block">
          O elige un tono puntual ({colorName}):
        </span>

        <div className="flex items-center justify-between gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {colors.map((c) => {
            const isSelected = colorHex.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelect({ colorName: c.name, colorHex: c.hex })}
                className={`size-8 sm:size-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-[#E05286] scale-110 shadow-xs ring-2 ring-[#E05286]/30'
                    : 'border-black/10 shadow-2xs hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && (
                  <Check className={`size-3.5 stroke-[3] ${c.isLight ? 'text-[#E05286]' : 'text-white'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
