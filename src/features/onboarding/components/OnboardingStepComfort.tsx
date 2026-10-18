import React from 'react';
import { motion } from 'motion/react';
import { Check, Heart, Coffee, VolumeX, Sparkles, Music, ShieldAlert, Gift } from 'lucide-react';

interface OnboardingStepComfortProps {
  comfortPreferences: string[];
  onToggle: (item: string) => void;
}

export function OnboardingStepComfort({
  comfortPreferences,
  onToggle
}: OnboardingStepComfortProps) {
  const comfortOptions = [
    { id: 'Café Frío de Cortesía', title: 'Café Frío con Hielo', desc: 'Con leche deslactosada o avena', icon: Coffee, iconBg: 'text-amber-700 bg-amber-50' },
    { id: 'Cita Silenciosa / Modo Relax', title: 'Modo Relax Silencioso', desc: 'Atención tranquila sin charla obligada', icon: VolumeX, iconBg: 'text-indigo-600 bg-indigo-50' },
    { id: 'Té Caliente / Infusión', title: 'Té o Infusión Herbal', desc: 'Manzanilla, frutos rojos o té verde', icon: Sparkles, iconBg: 'text-emerald-600 bg-emerald-50' },
    { id: 'Música Suave Lounge', title: 'Música Suave Lounge', desc: 'Playlist relajante de baja intensidad', icon: Music, iconBg: 'text-purple-600 bg-purple-50' },
    { id: 'Cutícula Extra Sensible', title: 'Cutícula Sensible', desc: 'Aviso de fresado ultra suave', icon: ShieldAlert, iconBg: 'text-pink-600 bg-pink-50' },
    { id: 'Regalo Cumpleaños Activado', title: 'Regalo Cumpleaños', desc: 'Tratamiento de parafina en tu mes', icon: Gift, iconBg: 'text-rose-600 bg-rose-50' }
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
          ¿Cómo prefieres disfrutar tu estancia?
        </h2>
        <p className="text-xs text-[#86868B]">
          Selecciona lo que te gustaría tener listo cuando nos visites.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {comfortOptions.map((item) => {
          const isSelected = comfortPreferences.includes(item.id);
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-22 cursor-pointer ${
                isSelected
                  ? 'border-[#E05286] bg-pink-50/80 shadow-sm ring-2 ring-[#E05286]/20'
                  : 'border-pink-100 bg-white hover:border-pink-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span className={`size-5 rounded-md flex items-center justify-center shrink-0 ${item.iconBg}`}>
                    <IconComponent className="size-3" />
                  </span>
                  <span className="text-[11px] font-black text-[#1D1D1F] leading-tight truncate">{item.title}</span>
                </div>
                <div className={`size-3.5 rounded-full flex items-center justify-center border shrink-0 ${
                  isSelected ? 'bg-[#E05286] text-white border-[#E05286]' : 'border-neutral-300 bg-neutral-100 text-transparent'
                }`}>
                  <Check className="size-2 stroke-[3]" />
                </div>
              </div>

              <p className="text-[9px] text-[#86868B] leading-tight line-clamp-2">
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1 text-[11px] text-[#E05286] font-bold pt-1">
        <Heart className="size-3 fill-[#E05286]" />
        <span>Servicios de cortesía 100% incluidos</span>
      </div>
    </motion.div>
  );
}

