import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface AppStartupSplashProps {
  isOffline?: boolean;
  onRetry?: () => void;
}

export function AppStartupSplash({ isOffline, onRetry }: AppStartupSplashProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFF8FA] text-[#1D1D1F] select-none"
    >
      <div className="flex flex-col items-center max-w-xs text-center space-y-6 px-6">
        {/* Brand Icon & Monogram */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="size-20 rounded-3xl bg-gradient-to-tr from-[#E05286] to-[#F28BAE] text-white shadow-xl shadow-pink-500/25 flex items-center justify-center relative"
          >
            <Sparkles className="size-10 stroke-[2.2] animate-pulse" />
          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 rounded-3xl bg-[#E05286]/20 -z-10 blur-md"
          />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <motion.h1
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-3xl font-display font-black tracking-tight"
          >
            <span className="text-[#E05286]">emme</span>
            <span className="text-[#1D1D1F]/80">nails</span>
          </motion.h1>
          <motion.p
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-xs text-[#86868B] font-medium tracking-wide uppercase"
          >
            Studio & Exclusive Design
          </motion.p>
        </div>

        {/* Status Indicator / Offline handling */}
        <div className="pt-4 flex flex-col items-center gap-2">
          {isOffline ? (
            <div className="space-y-2">
              <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Sin conexión a internet
              </span>
              <p className="text-[11px] text-[#86868B]">Cargando datos guardados...</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2 px-4 py-1.5 rounded-xl bg-[#E05286] text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
                >
                  Reintentar
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#86868B]">
              <div className="size-1.5 rounded-full bg-[#E05286] animate-ping" />
              <span className="text-[11px] font-semibold text-[#86868B]">Iniciando experiencia...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
