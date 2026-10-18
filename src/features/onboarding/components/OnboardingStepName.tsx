import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Edit3, Sparkles } from 'lucide-react';

interface OnboardingStepNameProps {
  clientName: string;
  clientContact: string;
  onUpdate: (updates: { clientName?: string; clientContact?: string }) => void;
  googleDisplayName?: string | null;
  googlePhotoUrl?: string | null;
  onConfirmAdvance?: () => void;
}

export function OnboardingStepName({
  clientName,
  clientContact,
  onUpdate,
  googleDisplayName,
  googlePhotoUrl,
  onConfirmAdvance
}: OnboardingStepNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const detectedName = (clientName || googleDisplayName || 'Valeria Arriaza').trim();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as any, stiffness: 350, damping: 25 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="w-full max-w-md mx-auto space-y-4 text-[#1D1D1F]"
    >
      {/* Short conversational header */}
      <motion.div variants={itemVariants} className="space-y-1 text-left">
        <h2 className="text-xl sm:text-2xl font-black text-[#1D1D1F] tracking-tight">
          ¡Hola! ¿Cómo te gustaría que te llamemos?
        </h2>
        <p className="text-xs text-[#86868B]">
          Para personalizar tu bienvenida en EMME Studio.
        </p>
      </motion.div>

      {/* Profile Name Confirmation Card */}
      <motion.div variants={itemVariants} className="p-3.5 sm:p-4 rounded-2xl bg-white border border-pink-100 shadow-md space-y-3">
        {!isEditing ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              {googlePhotoUrl ? (
                <img
                  src={googlePhotoUrl}
                  alt={detectedName}
                  className="size-11 rounded-full object-cover border border-pink-200 shrink-0 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="size-10 sm:size-11 rounded-full bg-pink-50 text-[#E05286] font-black text-sm flex items-center justify-center border border-pink-200 shrink-0 shadow-sm">
                  {detectedName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 text-left min-w-0">
                <span className="text-[9.5px] sm:text-[10px] text-[#86868B] font-bold block uppercase tracking-wider">
                  Tu nombre registrado
                </span>
                <span className="text-sm sm:text-base font-black text-[#1D1D1F] block truncate">
                  {detectedName}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setIsEditing(true)}
                className="size-10 min-h-[44px] min-w-[44px] rounded-xl bg-pink-50/80 hover:bg-pink-100 text-[#E05286] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Cambiar nombre"
              >
                <Edit3 className="size-4" />
              </motion.button>
            </div>

            {/* Quick Confirm Button with 44px min-height */}
            <div className="flex items-center gap-2 pt-1">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#d04377' }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  onUpdate({ clientName: detectedName });
                  if (onConfirmAdvance) onConfirmAdvance();
                }}
                className="flex-1 min-h-[44px] h-11 rounded-xl bg-[#E05286] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Check className="size-4 stroke-[3]" />
                <span>Sí, es correcto</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsEditing(true)}
                className="min-h-[44px] h-11 px-3.5 sm:px-4 rounded-xl bg-white border border-pink-200 text-[#86868B] hover:text-[#1D1D1F] font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                Cambiar
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2.5 text-left"
          >
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#86868B]">
                Escribe tu nombre o apodo:
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => onUpdate({ clientName: e.target.value })}
                placeholder="Ej. Valeria Arriaza"
                autoFocus
                className="w-full min-h-[44px] h-11 px-3 sm:px-3.5 rounded-xl bg-pink-50/40 border border-pink-200 text-[#1D1D1F] font-bold text-base focus:outline-none focus:border-[#E05286] focus:ring-2 focus:ring-pink-500/15 transition-all"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  if (onConfirmAdvance && clientName.trim()) onConfirmAdvance();
                }}
                className="min-h-[40px] h-10 px-4 rounded-xl bg-[#E05286] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Check className="size-3.5 stroke-[3]" />
                <span>Guardar</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Info notice */}
      <motion.p variants={itemVariants} className="text-[11px] text-[#86868B] text-center pt-1">
        Usaremos este nombre para recibirte en tu visita.
      </motion.p>
    </motion.div>
  );
}

