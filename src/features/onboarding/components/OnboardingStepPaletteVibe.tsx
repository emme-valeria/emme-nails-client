import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OnboardingStepPaletteVibeProps {
  colorName: string;
  colorHex: string;
  styleVibe: string;
  onUpdate: (updates: { colorName?: string; colorHex?: string; styleVibe?: string }) => void;
}

export function OnboardingStepPaletteVibe({
  colorName,
  colorHex,
  styleVibe,
  onUpdate
}: OnboardingStepPaletteVibeProps) {
  const vibes = [
    {
      id: 'Clean Girl',
      title: 'Clean Girl Aesthetic',
      desc: 'Nudes translúcidos, milky white & brillo espejo.',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&auto=format&fit=crop&q=80',
      defaultColor: { name: 'Rose Nude', hex: '#FAD2E1' }
    },
    {
      id: 'Hailey Glazed',
      title: 'Glazed Donut / Chrome',
      desc: 'Polvo de cromo perla sobre base translúcida.',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&auto=format&fit=crop&q=80',
      defaultColor: { name: 'Glazed Pearl', hex: '#F0EBE5' }
    },
    {
      id: 'Barbie Pink',
      title: 'EMME Rose & Pink',
      desc: 'Rosa icónico EMME, french rosa y blush nails.',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format&fit=crop&q=80',
      defaultColor: { name: 'EMME Rose', hex: '#E05286' }
    },
    {
      id: 'Old Money',
      title: 'Old Money & Cherry',
      desc: 'Rojo cherry clásico, vino tinto y french micro.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      defaultColor: { name: 'Cherry Rouge', hex: '#8B0000' }
    }
  ];

  const colors = [
    { name: 'EMME Rose', hex: '#E05286', isLight: false },
    { name: 'Blush Pink', hex: '#FAD2E1', isLight: true },
    { name: 'Milky White', hex: '#FFFFFF', isLight: true },
    { name: 'Nude Bare', hex: '#E8D5C4', isLight: true },
    { name: 'Soft Peach', hex: '#FCE7D8', isLight: true },
    { name: 'Cherry Rouge', hex: '#8B0000', isLight: false },
    { name: 'Glazed Chrome', hex: '#D6D3D1', isLight: true },
    { name: 'Noir Black', hex: '#1A1A1A', isLight: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto space-y-4 text-[#1D1D1F]"
    >
      <div className="space-y-1 text-left">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#E05286]">Paso 4 de 6</span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
          Tu Vibe & Gama de Color
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Selecciona tu estética predilecta para recibir recomendaciones personalizadas.
        </p>
      </div>

      {/* Moodboard Cards (2x2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {vibes.map((item) => {
          const isSelected = styleVibe.toLowerCase() === item.id.toLowerCase();
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onUpdate({
                styleVibe: item.id,
                colorName: item.defaultColor.name,
                colorHex: item.defaultColor.hex
              })}
              className={`relative h-28 sm:h-32 rounded-2xl overflow-hidden border-2 text-left transition-all group cursor-pointer ${
                isSelected
                  ? 'border-[#E05286] shadow-lg shadow-pink-500/15 ring-2 ring-[#E05286]/30'
                  : 'border-pink-100 hover:border-pink-300'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

              <div className="relative z-10 p-2.5 flex items-center justify-between">
                <span className="text-xs font-black text-white">{item.title}</span>
                <div className={`size-5 rounded-full flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-[#E05286] text-white border-[#E05286] shadow-xs'
                    : 'border-white/40 bg-black/25 text-transparent'
                }`}>
                  <Check className="size-3 stroke-[3]" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white z-10">
                <p className="text-[10px] text-neutral-200 leading-tight line-clamp-1">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Color Swatch Circles */}
      <div className="space-y-1.5 text-left pt-1">
        <label className="text-xs font-black uppercase tracking-wider text-[#1D1D1F] flex items-center justify-between">
          <span>Tono Predilecto:</span>
          <span className="text-[#E05286] font-bold">{colorName}</span>
        </label>
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
          {colors.map((c) => {
            const isSelected = colorHex.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onUpdate({ colorName: c.name, colorHex: c.hex })}
                className={`size-11 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'border-[#E05286] scale-110 shadow-md ring-2 ring-[#E05286]/30'
                    : 'border-pink-100 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && (
                  <Check className={`size-4 stroke-[3] ${c.isLight ? 'text-[#E05286]' : 'text-white'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
