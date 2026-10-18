import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { NailShapeSVG } from '@/shared/components/NailShapeSVG';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';

interface OnboardingStepNailsProps {
  shape: string;
  length: string;
  finish: string;
  artLevel: string;
  colorHex: string;
  onUpdate: (updates: { shape?: string; length?: string; finish?: string; artLevel?: string }) => void;
}

export function OnboardingStepNails({
  shape,
  length,
  finish,
  artLevel,
  colorHex,
  onUpdate
}: OnboardingStepNailsProps) {
  const shapes = [
    { id: 'Almendra', label: 'Almendra', iconShape: 'almond', tag: 'Elegante' },
    { id: 'Coffin', label: 'Coffin', iconShape: 'coffin', tag: 'Estilizada' },
    { id: 'Cuadrada', label: 'Cuadrada', iconShape: 'square', tag: 'Clásica' },
    { id: 'Squoval', label: 'Squoval', iconShape: 'squoval', tag: 'Natural' },
    { id: 'Ovalada', label: 'Ovalada', iconShape: 'oval', tag: 'Limpia' },
    { id: 'Stiletto', label: 'Stiletto', iconShape: 'stiletto', tag: 'Audaz' }
  ];

  const lengths = [
    { id: 'Corto', label: 'N° 1 Corto', mm: '+0mm (Natural)' },
    { id: 'Medio', label: 'N° 2 Medio', mm: '+5mm (Recomendado)' },
    { id: 'Largo', label: 'N° 3 Largo', mm: '+10mm (Estilizado)' },
    { id: 'XL', label: 'N° 4 XL', mm: '+15mm (Escultural)' }
  ];

  const artTiers = [
    { id: 'Básico / Liso', label: 'Liso o Francés', desc: '1-2 tonos o micro french' },
    { id: 'Glazed Chrome / Cat Eye', label: 'Cromo & Cat Eye', desc: 'Efecto perlado o magnético 3D' },
    { id: 'Nail Art 3D & Cristales', label: 'Nail Art & Cristales', desc: 'Mano alzada y pedrería' }
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
        <span className="text-[11px] font-black uppercase tracking-wider text-[#E05286]">Paso 2 de 6</span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
          Forma, Largo & Efecto
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Personaliza la estructura y acabado exacto de tus uñas.
        </p>
      </div>

      {/* 1. Shapes (6 crisp vector SVG choices) */}
      <div className="space-y-1.5 text-left">
        <label className="text-xs font-black uppercase tracking-wider text-[#1D1D1F]">
          1. Silueta Deseada:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {shapes.map((s) => {
            const isSelected = shape.toLowerCase() === s.id.toLowerCase();
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onUpdate({ shape: s.id })}
                className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-between h-24 cursor-pointer ${
                  isSelected
                    ? 'border-[#E05286] bg-pink-50/80 shadow-xs ring-1 ring-[#E05286]'
                    : 'border-pink-100/80 bg-white hover:border-pink-300'
                }`}
              >
                <div className="w-6 h-8 flex items-center justify-center pt-1">
                  <NailShapeSVG shape={s.iconShape} fillColor={isSelected ? '#E05286' : '#A3A3A3'} className="w-6 h-8" />
                </div>
                <div className="text-center">
                  <span className={`text-[11px] font-black block leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>{s.label}</span>
                  <span className="text-[9px] text-[#86868B] font-medium">{s.tag}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Length Selector */}
      <div className="space-y-1.5 text-left">
        <label className="text-xs font-black uppercase tracking-wider text-[#1D1D1F]">
          2. Longitud Habitual:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {lengths.map((l) => {
            const isSelected = length.toLowerCase().includes(l.id.toLowerCase());
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onUpdate({ length: l.id })}
                className={`p-2.5 rounded-2xl border-2 text-center flex flex-col items-center justify-between h-24 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E05286] bg-pink-50/80 shadow-xs ring-1 ring-[#E05286]'
                    : 'border-pink-100/80 bg-white hover:border-pink-300'
                }`}
              >
                <div className="h-10 flex items-center justify-center">
                  <NailLengthSVG
                    length={l.id}
                    fillColor={isSelected ? '#E05286' : '#A3A3A3'}
                    className="w-7 h-10"
                    compact={true}
                  />
                </div>
                <div className="text-center">
                  <span className={`text-[11px] font-black block leading-tight ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>
                    {l.label}
                  </span>
                  <span className="text-[9px] text-[#86868B] block">{l.mm}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Nail Art & Finish Complexity */}
      <div className="space-y-1.5 text-left pt-1">
        <label className="text-xs font-black uppercase tracking-wider text-[#1D1D1F] flex items-center justify-between">
          <span>3. Nivel de Diseño & Efecto:</span>
          <span className="text-[#E05286] font-bold lowercase text-[11px]">({artLevel})</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {artTiers.map((tier) => {
            const isSelected = artLevel.toLowerCase().includes(tier.id.toLowerCase()) || artLevel === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onUpdate({ artLevel: tier.id })}
                className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E05286] bg-pink-50/80 ring-1 ring-[#E05286]'
                    : 'border-pink-100/80 bg-white hover:border-pink-300'
                }`}
              >
                <span className={`text-xs font-black block ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>{tier.label}</span>
                <span className="text-[10px] text-[#86868B] block leading-tight mt-0.5">{tier.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
