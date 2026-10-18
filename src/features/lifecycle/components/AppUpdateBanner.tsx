import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface AppUpdateBannerProps {
  hasUpdate: boolean;
  onUpdate: () => void;
}

export function AppUpdateBanner({ hasUpdate, onUpdate }: AppUpdateBannerProps) {
  if (!hasUpdate) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-[92%] sm:w-auto px-4 py-2 rounded-2xl bg-neutral-900 text-white shadow-xl border border-white/10 flex items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-pink-500/20 text-[#F28BAE] flex items-center justify-center shrink-0">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <p className="font-bold leading-tight">Nueva versión de Emme</p>
            <p className="text-[10px] text-neutral-300">Nuevas mejoras de diseño disponibles</p>
          </div>
        </div>

        <button
          onClick={onUpdate}
          className="h-7 px-3 rounded-lg bg-[#E05286] hover:bg-[#d04377] text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="size-3" />
          <span>Actualizar</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
