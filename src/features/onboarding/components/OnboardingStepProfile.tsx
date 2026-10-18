import React from 'react';
import { motion } from 'motion/react';
import { User, Phone, Coffee, ShieldCheck, Check, VolumeX, Sparkles, Droplets, Music, ShieldAlert, Gift } from 'lucide-react';

interface OnboardingStepProfileProps {
  clientName: string;
  clientContact: string;
  comfortPreferences: string[];
  onUpdate: (updates: { clientName?: string; clientContact?: string; comfortPreferences?: string[] }) => void;
}

export function OnboardingStepProfile({
  clientName,
  clientContact,
  comfortPreferences,
  onUpdate
}: OnboardingStepProfileProps) {
  const comfortOptions = [
    { id: 'Café Frío de Cortesía', label: 'Café Frío', category: 'Bebida', icon: Coffee },
    { id: 'Té Caliente / Infusión', label: 'Té o Infusión', category: 'Bebida', icon: Sparkles },
    { id: 'Agua Mineral / Natural', label: 'Agua Mineral', category: 'Bebida', icon: Droplets },
    { id: 'Cita Silenciosa / Modo Relax', label: 'Modo Relax / Silencioso', category: 'Ambiente', icon: VolumeX },
    { id: 'Música Suave / Lounge', label: 'Música Suave', category: 'Ambiente', icon: Music },
    { id: 'Cutícula Sensible', label: 'Cutícula Sensible', category: 'Cuidado', icon: ShieldAlert },
    { id: 'Regalo Cumpleaños Activado', label: 'Regalo Cumpleaños', category: 'Beneficio', icon: Gift }
  ];

  const toggleComfort = (item: string) => {
    const exists = comfortPreferences.includes(item);
    const updated = exists
      ? comfortPreferences.filter(p => p !== item)
      : [...comfortPreferences, item];
    onUpdate({ comfortPreferences: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto space-y-4 text-[#1D1D1F]"
    >
      <div className="space-y-1 text-left">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#E05286]">Paso 5 de 6</span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
          Tu Experiencia & Ficha
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Personaliza tu estancia en el salón. Todos los campos son opcionales.
        </p>
      </div>

      {/* Only 1 or 2 Minimal Optional Fields with clean White & Pink Input styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {/* Field 1: Name / Nickname */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-[#1D1D1F] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-[#E05286]" />
              ¿Cómo te llamamos?
            </span>
            <span className="text-[10px] text-[#86868B] font-bold">(Opcional)</span>
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => onUpdate({ clientName: e.target.value })}
            placeholder="Ej. Valeria Arriaza"
            className="w-full h-11 px-3.5 rounded-xl bg-white border border-pink-100/90 text-[#1D1D1F] font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E05286] transition-all shadow-xs"
          />
        </div>

        {/* Field 2: Contact (WhatsApp or Instagram) */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-[#1D1D1F] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-[#E05286]" />
              WhatsApp o Instagram
            </span>
            <span className="text-[10px] text-[#86868B] font-bold">(Opcional)</span>
          </label>
          <input
            type="text"
            value={clientContact}
            onChange={(e) => onUpdate({ clientContact: e.target.value })}
            placeholder="Ej. +52 55 1234 5678 o @valeria"
            className="w-full h-11 px-3.5 rounded-xl bg-white border border-pink-100/90 text-[#1D1D1F] font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E05286] transition-all shadow-xs"
          />
        </div>
      </div>

      {/* 1-Tap Comfort Chips (Zero typing required!) */}
      <div className="space-y-2 text-left pt-1">
        <label className="text-xs font-black uppercase tracking-wider text-[#1D1D1F] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Coffee className="size-3.5 text-[#E05286]" />
            Preferencias de Confort durante tu Cita:
          </span>
          <span className="text-[10px] text-[#E05286] font-bold">(1-Toque)</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {comfortOptions.map((item) => {
            const isSelected = comfortPreferences.includes(item.id);
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleComfort(item.id)}
                className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'border-[#E05286] bg-[#E05286] text-white shadow-xs'
                    : 'border-pink-100/80 bg-white text-[#1D1D1F] hover:border-pink-300'
                }`}
              >
                <IconComponent className="size-3.5 shrink-0" />
                <span>{item.label}</span>
                {isSelected && <Check className="size-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-white border border-pink-100/80 flex items-center gap-2.5 text-left text-xs text-[#86868B] shadow-xs">
        <ShieldCheck className="size-4 text-[#E05286] flex-shrink-0" />
        <span>Garantía EMME: Servicio con instrumental esterilizado en autoclave individual.</span>
      </div>
    </motion.div>
  );
}
