import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, X, Sparkles } from 'lucide-react';

interface WebNotificationPromptProps {
  permission: NotificationPermission | 'unsupported';
  onRequestPermission: () => Promise<string>;
}

export function WebNotificationPrompt({
  permission,
  onRequestPermission
}: WebNotificationPromptProps) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined' || permission !== 'default') return false;
    try {
      const dismissed = localStorage.getItem('emme_notif_prompt_dismissed');
      return !dismissed;
    } catch {
      return false;
    }
  });
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen || permission !== 'default') return null;

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      await onRequestPermission();
      setIsOpen(false);
    } catch (err) {
      console.warn('Notification permission error:', err);
      setIsOpen(false);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('emme_notif_prompt_dismissed', Date.now().toString());
    } catch {}
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-24 sm:bottom-8 inset-x-0 mx-auto z-[140] max-w-sm w-[calc(100%-2rem)] flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full p-4 sm:p-5 rounded-[28px] bg-white/95 dark:bg-[#1C1C1E]/95 text-[#1D1D1F] dark:text-white border border-pink-100 dark:border-pink-900/40 shadow-[0_20px_50px_-10px_rgba(224,82,134,0.22)] space-y-3.5 relative text-left backdrop-blur-xl"
        >
          {/* Subtle Pink Header Tint */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E05286] via-[#F28BAE] to-[#E05286]" />

          <button
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 size-7 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="size-3.5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#E05286] to-[#F28BAE] text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/25">
              <Bell className="size-5" />
            </div>
            <div className="flex-1 pr-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E05286] bg-pink-50 dark:bg-pink-950/60 px-2.5 py-0.5 rounded-full border border-pink-100 dark:border-pink-900/40 inline-block">
                Recordatorios VIP
              </span>
              <h4 className="text-sm font-bold text-[#1D1D1F] dark:text-white mt-1 leading-tight">
                Recordatorios de tu cita
              </h4>
              <p className="text-xs text-[#86868B] dark:text-neutral-400 leading-relaxed mt-0.5">
                Activa las notificaciones para avisarte 2 horas antes de tu turno y cuando tu cotización esté lista.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleRequest}
              disabled={isRequesting}
              className="flex-1 h-10 rounded-2xl bg-gradient-to-r from-[#E05286] to-[#F28BAE] hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-500/20 active:scale-[0.98] cursor-pointer"
            >
              <Check className="size-3.5 stroke-[3]" />
              <span>Activar avisos</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#86868B] dark:text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Ahora no
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
