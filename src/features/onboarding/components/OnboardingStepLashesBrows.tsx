import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OnboardingStepLashesBrowsProps {
  lashStyle: string;
  browStyle: string;
  onUpdate: (updates: { lashStyle?: string; browStyle?: string }) => void;
}

export function OnboardingStepLashesBrows({
  lashStyle,
  browStyle,
  onUpdate
}: OnboardingStepLashesBrowsProps) {
  const lashCards = [
    {
      id: 'Foxy / Cat Eye',
      title: 'Efecto Foxy / Cat Eye',
      desc: 'Alargamiento en comisura exterior para mirada seductora.',
      image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&auto=format&fit=crop&q=80',
      badge: 'Tendencia Top'
    },
    {
      id: 'Clásicas 1:1',
      title: 'Clásicas Efecto Rímel (1:1)',
      desc: 'Pelo a pelo natural y limpio para uso diario elegante.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      badge: 'Natural'
    },
    {
      id: 'Volumen Ruso',
      title: 'Volumen Ruso & Híbrido',
      desc: 'Abanicos multidimensionales de máxima densidad y suavidad.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=80',
      badge: 'Glamour'
    },
    {
      id: 'Lash Lift Keratina',
      title: 'Lash Lift & Botox Keratina',
      desc: 'Elevación de tu pestaña natural sin extensiones.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80',
      badge: 'Nutritivo'
    }
  ];

  const browPills = [
    { id: 'Laminado de Cejas', label: 'Laminado de Cejas (Lifting)', desc: 'Fijación hacia arriba' },
    { id: 'Diseño + Henna / Tinte', label: 'Visagismo + Henna / Tinte', desc: 'Sombreado definido' },
    { id: 'Depilación con Hilo', label: 'Perfilado con Hilo / Cera', desc: 'Limpieza de marco' },
    { id: 'Solo Uñas por ahora', label: 'Solo Uñas por ahora', desc: 'Sin servicio de mirada' }
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
        <span className="text-[11px] font-black uppercase tracking-wider text-[#E05286]">Paso 3 de 6</span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
          Diseño de Mirada & Pestañas
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Técnicas personalizadas para resaltar tu forma de ojos.
        </p>
      </div>

      {/* 4 Big Photographic Cards with Rose Pink Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {lashCards.map((item) => {
          const isSelected = lashStyle.toLowerCase() === item.id.toLowerCase();
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onUpdate({ lashStyle: item.id })}
              className={`relative h-32 sm:h-36 rounded-2xl overflow-hidden border-2 text-left transition-all group cursor-pointer ${
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
                <span className="px-2 py-0.5 rounded-full bg-[#E05286]/90 backdrop-blur-md text-[9px] font-bold text-white shadow-xs">
                  {item.badge}
                </span>

                <div className={`size-5 rounded-full flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-[#E05286] text-white border-[#E05286] shadow-xs'
                    : 'border-white/40 bg-black/25 text-transparent'
                }`}>
                  <Check className="size-3 stroke-[3]" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white z-10">
                <h3 className="text-xs sm:text-sm font-black leading-tight">{item.title}</h3>
                <p className="text-[10px] text-neutral-200 leading-tight mt-0.5 line-clamp-1">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Eyebrows Selection */}
      <div className="space-y-1.5 text-left pt-1">
        <label className="text-xs font-black uppercase tracking-wider text-[#1D1D1F] flex items-center justify-between">
          <span>Cuidado de Cejas:</span>
          <span className="text-[#E05286] font-bold lowercase text-[11px]">({browStyle})</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {browPills.map((b) => {
            const isSelected = browStyle.toLowerCase() === b.id.toLowerCase();
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onUpdate({ browStyle: b.id })}
                className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E05286] bg-pink-50/80 ring-1 ring-[#E05286]'
                    : 'border-pink-100/80 bg-white hover:border-pink-300'
                }`}
              >
                <span className={`text-xs font-black block ${isSelected ? 'text-[#E05286]' : 'text-[#1D1D1F]'}`}>{b.label}</span>
                <span className="text-[10px] text-[#86868B] block">{b.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
