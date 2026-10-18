import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share2, PlusSquare, Sparkles, Smartphone, Check } from 'lucide-react';
import { PwaPlatform } from '../types';

interface PwaInstallPromptProps {
  isOpen: boolean;
  platform: PwaPlatform;
  onInstall: () => Promise<boolean>;
  onDismiss: () => void;
}

export function PwaInstallPrompt({
  isOpen,
  platform,
  onInstall,
  onDismiss
}: PwaInstallPromptProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (!isOpen || platform === 'standalone') return null;

  const handleInstallClick = async () => {
    if (platform === 'ios') {
      setShowIosGuide(true);
      return;
    }

    setIsInstalling(true);
    try {
      await onInstall();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-24 sm:bottom-8 inset-x-0 mx-auto z-[150] max-w-sm w-[calc(100%-2rem)] flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full p-4 sm:p-5 rounded-[28px] bg-white/95 dark:bg-[#1C1C1E]/95 text-[#1D1D1F] dark:text-white border border-pink-100 dark:border-pink-900/40 shadow-[0_20px_50px_-10px_rgba(224,82,134,0.22)] relative overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle Pink Header Tint */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E05286] via-[#F28BAE] to-[#E05286]" />

          <button
            onClick={onDismiss}
            className="absolute top-3.5 right-3.5 size-7 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="size-3.5" />
          </button>

          {!showIosGuide ? (
            <div className="space-y-3.5 text-left">
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#E05286] to-[#F28BAE] text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/25">
                  <Sparkles className="size-5 stroke-[2.5]" />
                </div>
                <div className="flex-1 pr-6">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E05286] bg-pink-50 dark:bg-pink-950/60 px-2.5 py-0.5 rounded-full border border-pink-100 dark:border-pink-900/40 inline-block">
                    App Web Exclusiva
                  </span>
                  <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-white mt-1 leading-tight">
                    Instalar Emme Studio
                  </h3>
                  <p className="text-xs text-[#86868B] dark:text-neutral-400 leading-relaxed mt-0.5">
                    Accede directo desde tu pantalla de inicio, recibe recordatorios y abre tus citas al instante.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="flex-1 h-10 rounded-2xl bg-gradient-to-r from-[#E05286] to-[#F28BAE] hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-500/20 active:scale-[0.98] cursor-pointer"
                >
                  <Download className="size-3.5 stroke-[2.5]" />
                  <span>{platform === 'ios' ? 'Ver cómo instalar' : 'Instalar App'}</span>
                </button>
                <button
                  onClick={onDismiss}
                  className="px-4 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#86868B] dark:text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Ahora no
                </button>
              </div>
            </div>
          ) : (
            /* iOS Specific Step-by-Step Guide */
            <div className="space-y-3.5 text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1D1D1F] dark:text-white flex items-center gap-1.5">
                  <Smartphone className="size-4 text-[#E05286]" />
                  Instalar en tu iPhone
                </h4>
              </div>

              <div className="space-y-2 text-[11px] text-[#1D1D1F] dark:text-neutral-200">
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-100/80 dark:border-pink-900/40">
                  <div className="size-6 rounded-lg bg-white dark:bg-neutral-800 text-[#E05286] flex items-center justify-center shadow-xs shrink-0 font-black text-[11px]">
                    1
                  </div>
                  <span>
                    Toca el botón <strong>Compartir</strong> <Share2 className="inline size-3 text-[#E05286] mx-0.5" /> en la barra inferior de Safari.
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-100/80 dark:border-pink-900/40">
                  <div className="size-6 rounded-lg bg-white dark:bg-neutral-800 text-[#E05286] flex items-center justify-center shadow-xs shrink-0 font-black text-[11px]">
                    2
                  </div>
                  <span>
                    Baja en las opciones y toca <strong>'Agregar a inicio'</strong> <PlusSquare className="inline size-3 text-[#E05286] mx-0.5" />.
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-100/80 dark:border-pink-900/40">
                  <div className="size-6 rounded-lg bg-white dark:bg-neutral-800 text-[#E05286] flex items-center justify-center shadow-xs shrink-0 font-black text-[11px]">
                    3
                  </div>
                  <span>
                    Toca <strong>'Agregar'</strong> arriba a la derecha. ¡Listo!
                  </span>
                </div>
              </div>

              <button
                onClick={onDismiss}
                className="w-full h-10 rounded-2xl bg-gradient-to-r from-[#E05286] to-[#F28BAE] hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-500/20 active:scale-[0.98] cursor-pointer"
              >
                <Check className="size-3.5 stroke-[3]" />
                <span>Entendido</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
