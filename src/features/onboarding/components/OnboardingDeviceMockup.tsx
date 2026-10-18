import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Battery, User, Sparkles, Check, Zap } from 'lucide-react';
import { OnboardingState } from '../types';
import emmeMascotImg from '@/assets/images/emme_pet_clean_1786682432329.jpg';
import { FloatingPet } from './FloatingPet';

interface OnboardingDeviceMockupProps {
  currentStep: number;
  state: OnboardingState;
  userName: string;
}

export function OnboardingDeviceMockup({
  currentStep,
  state,
  userName
}: OnboardingDeviceMockupProps) {
  const displayName = state.clientName.trim() || userName;

  return (
    <div className="relative w-full max-w-[320px] h-[560px] rounded-[44px] bg-[#FFFFFF] p-3 shadow-2xl border-4 border-pink-100/90 flex flex-col justify-between overflow-hidden select-none">
      {/* Dynamic Island Notch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-primary rounded-full z-30 flex items-center justify-between px-3">
        <div className="size-1.5 rounded-full bg-[#E05286] animate-pulse" />
        <div className="size-2 rounded-full bg-neutral-800 border border-neutral-700" />
      </div>

      {/* Screen Canvas Container */}
      <div className="w-full h-full rounded-[36px] bg-[#FBFBFD] text-[#1D1D1F] border border-pink-100 overflow-hidden flex flex-col relative">
        {/* Status Bar */}
        <div className="pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-[#1D1D1F] relative z-20">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-[#1D1D1F]/80">
            <Wifi className="size-3" />
            <Battery className="size-3.5" />
          </div>
        </div>

        {/* Screen Dynamic Content */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {/* Step 0: Splash */}
            {currentStep === 0 && (
              <motion.div
                key="step-0-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3 text-center flex flex-col items-center justify-center"
              >
                <div className="w-full h-36 flex items-center justify-center relative">
                  <FloatingPet
                    src={emmeMascotImg}
                    alt="EMME Mascot"
                    size={140}
                  />
                </div>

                <div className="p-3 w-full rounded-2xl bg-white border border-pink-100 text-left space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span>Disponibilidad en vivo:</span>
                    <span className="text-[#E05286] font-bold">Hoy 16:30</span>
                  </div>
                  <p className="text-[10px] text-[#86868B]">Reserva inmediata sin esperas</p>
                </div>
              </motion.div>
            )}

            {/* Step 1: AI Showcase */}
            {currentStep === 1 && (
              <motion.div
                key="step-1-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3 text-left"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block text-center">
                  EMME AI
                </span>

                <div className="p-3.5 rounded-2xl bg-white border border-purple-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-purple-100 text-purple-600 border border-purple-200 flex items-center justify-center text-xs font-black">
                      <Zap className="size-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-[#86868B] uppercase font-bold block">Cotización</span>
                      <h4 className="text-xs font-black text-[#1D1D1F]">Calculada con IA</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-black/5 mt-2">
                    <span className="text-[10px] text-[#86868B]">Precio Exacto</span>
                    <span className="text-xs font-black text-purple-600">$850 MXN</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Name */}
            {currentStep === 2 && (
              <motion.div
                key="step-2-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3 text-left"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E05286] block text-center">
                  Ficha de Bienvenida
                </span>

                <div className="p-3.5 rounded-2xl bg-white border border-pink-100 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-pink-50 text-[#E05286] border border-pink-200 flex items-center justify-center text-xs font-black">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[9px] text-[#86868B] uppercase font-bold block">Cliente</span>
                      <h4 className="text-xs font-black text-[#1D1D1F]">{displayName}</h4>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#86868B] leading-snug pt-1">
                    Atención personalizada en EMME Studio.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: WhatsApp */}
            {currentStep === 3 && (
              <motion.div
                key="step-3-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3 text-left"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E05286] block text-center">
                  Contacto Directo
                </span>

                <div className="p-3.5 rounded-2xl bg-white border border-pink-100 space-y-2 shadow-2xs">
                  <span className="text-[9px] text-[#86868B] uppercase font-bold block">WhatsApp Registrado</span>
                  <div className="flex items-center justify-between text-xs font-black text-[#1D1D1F]">
                    <span>{state.clientContact || '+52 33 3173 3925'}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Verificado</span>
                  </div>
                  <p className="text-[10px] text-[#86868B] leading-snug">
                    Confirmaciones y avisos de citas en tiempo real.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#1D1D1F]/20 rounded-full z-20" />
      </div>
    </div>
  );
}
