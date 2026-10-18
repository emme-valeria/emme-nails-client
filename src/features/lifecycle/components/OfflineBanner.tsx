import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export function OfflineBanner({ isOnline }: OfflineBannerProps) {
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnectedToast(true);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <>
      {/* Offline Floating Bar */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-[92%] sm:w-auto px-4 py-2 rounded-2xl bg-neutral-900/90 text-white backdrop-blur-md shadow-xl border border-white/10 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <WifiOff className="size-3.5" />
              </div>
              <div>
                <p className="font-bold leading-tight">Modo Sin Conexión</p>
                <p className="text-[10px] text-neutral-300">Visualizando citas y datos guardados</p>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="size-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              title="Reintentar conexión"
            >
              <RefreshCw className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reconnected Toast */}
      <AnimatePresence>
        {showReconnectedToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-2xl bg-emerald-600/95 text-white backdrop-blur-md shadow-xl border border-emerald-400/30 flex items-center gap-2 text-xs font-bold"
          >
            <Wifi className="size-3.5" />
            <span>Conexión restablecida</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
