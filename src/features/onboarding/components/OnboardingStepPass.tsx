import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { OnboardingState } from '../types';

interface OnboardingStepPassProps {
  state: OnboardingState;
  onFinish: (destination: 'booking' | 'explore') => void;
}

export function OnboardingStepPass({
  state,
  onFinish
}: OnboardingStepPassProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E05286', '#FAD2E1', '#FFFFFF', '#1D1D1F']
      });
    } catch {
      // safe fallback
    }
  }, []);

  const clientName = state.clientName.trim() || 'Clienta VIP';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-lg mx-auto space-y-4 text-[#1D1D1F]"
    >
      <div className="space-y-1 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 text-[#E05286] border border-pink-200 text-xs font-black shadow-2xs">
          <Sparkles className="size-3.5 text-[#E05286]" />
          <span>¡Perfil Personalizado Creado!</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
          Tu Pase VIP <span className="text-[#E05286]">EMME Studio</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B]">
          Tus preferencias ya están listas para tu próxima visita.
        </p>
      </div>

      {/* Luxury Member Card (Ahead / Luma aesthetic) */}
      <div className="relative w-full rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-white via-pink-50/60 to-pink-100/50 text-[#1D1D1F] shadow-xl border-2 border-pink-200/90 overflow-hidden text-left space-y-4">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[#E05286]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-pink-300/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#E05286] uppercase">Membresía Oficial</span>
            <h3 className="text-lg font-black tracking-tight text-[#1D1D1F]">EMME VIP CLUB</h3>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#E05286] text-white text-[11px] font-black shadow-xs">
            <Star className="size-3 fill-white" />
            <span>+100 PUNTOS</span>
          </div>
        </div>

        <div className="relative z-10 pt-2 border-t border-pink-200/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#86868B] uppercase tracking-wider block font-bold">Titular</span>
            <span className="text-base font-black text-[#1D1D1F]">{clientName}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#86868B] uppercase tracking-wider block font-bold">Técnica Principal</span>
            <span className="text-xs font-black text-[#E05286]">{state.specificService}</span>
          </div>
        </div>

        {/* Selected Badges */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-white border border-pink-200/80 shadow-2xs">
            <span className="text-[9px] text-[#86868B] block font-medium">Silueta</span>
            <span className="text-xs font-black text-[#1D1D1F]">{state.shape}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-pink-200/80 shadow-2xs">
            <span className="text-[9px] text-[#86868B] block font-medium">Largo</span>
            <span className="text-xs font-black text-[#1D1D1F]">{state.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-pink-200/80 shadow-2xs">
            <span className="text-[9px] text-[#86868B] block font-medium">Mirada</span>
            <span className="text-xs font-black text-[#1D1D1F] truncate block">{state.lashStyle}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-pink-200/80 shadow-2xs">
            <span className="text-[9px] text-[#86868B] block font-medium">Color & Vibe</span>
            <span className="text-xs font-black text-[#1D1D1F] truncate block">{state.colorName}</span>
          </div>
        </div>

        {state.comfortPreferences.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-1.5 pt-1">
            {state.comfortPreferences.map((pref, idx) => (
              <span key={idx} className="text-[10px] px-2.5 py-1 rounded-lg bg-white text-[#E05286] border border-pink-100 font-bold shadow-2xs">
                {pref}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => onFinish('booking')}
          className="w-full h-14 rounded-2xl bg-[#E05286] hover:bg-[#d04377] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all active:scale-[0.99] cursor-pointer"
        >
          <Calendar className="size-4" />
          <span>Agendar Cita en EMME Studio</span>
          <ArrowRight className="size-4 stroke-[3]" />
        </button>

        <button
          type="button"
          onClick={() => onFinish('explore')}
          className="w-full h-11 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-[#1D1D1F] font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
          Explorar Servicios y Catálogo
        </button>
      </div>
    </motion.div>
  );
}
