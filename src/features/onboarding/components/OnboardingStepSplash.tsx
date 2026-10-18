import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Store } from 'lucide-react';
import emmeMascotImg from '@/assets/images/emme_pet_clean_1786682432329.jpg';
import { FloatingPet } from './FloatingPet';

interface OnboardingStepSplashProps {
  onStart: () => void;
  onExplore: () => void;
}

export function OnboardingStepSplash({ onStart, onExplore }: OnboardingStepSplashProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative w-full max-w-md mx-auto flex flex-col justify-between items-center h-full min-h-[500px] sm:min-h-[560px] py-4 sm:py-6 px-4 text-center bg-white"
    >
      {/* EMME Official Logo / Brand Header */}
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        className="flex flex-col items-center gap-1.5"
      >
        <div className="flex items-baseline gap-1.5">
          <span className="font-luxury-italic text-3xl sm:text-4xl font-extrabold text-[#E05286] tracking-tight">emme</span>
          <span className="font-luxury text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#1D1D1F] uppercase">studio</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F7] border border-pink-100/90 text-[#E05286] text-[11px] font-bold tracking-wider uppercase shadow-2xs">
          <Sparkles className="size-3 text-[#E05286]" />
          <span>Nails & Beauty Lounge</span>
        </div>
      </motion.div>

      {/* Pure Floating Pet Mascot - 100% borderless & transparent background */}
      <div className="relative my-auto flex flex-col items-center justify-center py-4">
        {/* Soft Ambient Halo */}
        <div className="absolute size-44 sm:size-52 rounded-full bg-pink-100/50 blur-3xl pointer-events-none -z-10" />

        {/* Mascot Container - Floating transparently with continuous subtle hover */}
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
          transition={{
            scale: { delay: 0.15, duration: 0.5, type: 'spring', damping: 18 },
            opacity: { delay: 0.15, duration: 0.4 },
            y: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
          }}
          className="relative flex items-center justify-center"
        >
          <FloatingPet
            src={emmeMascotImg}
            alt="EMME Studio Mascot"
            size={230}
          />
        </motion.div>

        {/* Clean Welcoming Headline with Premium Luxury Editorial EMME Studio */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-3 space-y-1.5 max-w-xs mx-auto"
        >
          <h1 className="text-xl sm:text-2xl font-black text-[#1D1D1F] tracking-tight leading-snug">
            Bienvenida a <span className="font-luxury-italic text-2xl sm:text-3xl font-black text-[#E05286] inline-block ml-1 tracking-tight">emme studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] font-normal leading-relaxed">
            Personaliza tus servicios de uñas y pestañas a tu medida o ingresa directo al salón.
          </p>
        </motion.div>
      </div>

      {/* Clear Two Action Buttons */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="w-full space-y-2.5 pt-2"
      >
        {/* Begin Configuration */}
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#d04377' }}
          whileTap={{ scale: 0.98 }}
          id="btn-begin-configuration"
          type="button"
          onClick={onStart}
          className="w-full h-13 sm:h-14 rounded-2xl bg-[#E05286] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-pink-500/25 transition-all cursor-pointer"
        >
          <span>Empezar Configuración</span>
          <ArrowRight className="size-4.5 stroke-[3]" />
        </motion.button>

        {/* Go Direct to Salon */}
        <motion.button
          whileHover={{ scale: 1.01, backgroundColor: '#fdf2f8' }}
          whileTap={{ scale: 0.98 }}
          id="btn-go-direct-salon"
          type="button"
          onClick={onExplore}
          className="w-full h-12 rounded-2xl bg-white border border-pink-200/80 text-[#1D1D1F] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Store className="size-4 text-[#E05286]" />
          <span>Ir directo al salón</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
