import React from 'react';
import { Button } from '@emme/ui/button';
import { Award, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@emme/ui/lib/utils';

interface LoyaltyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardPoints: number;
  redeemedOffer: string | null;
  salonName?: string;
  onRedeemPerk: (title: string, cost: number) => void;
}

export function LoyaltyRewardsModal({
  isOpen,
  onClose,
  rewardPoints,
  redeemedOffer,
  salonName = 'Emme Studio',
  onRedeemPerk,
}: LoyaltyRewardsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-black/[0.04]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-[#86868B]"
        >
          <X className="size-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#ECDCC2] text-[#845E1B] text-xs font-bold uppercase tracking-wider">
            <Award className="size-4 text-[#C59B4E]" />
            <span>Emme Club Platinum Rewards</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-[#1D1D1F]">
            Tus Puntos Acumulados
          </h3>
          <p className="text-xs text-[#86868B] font-medium">
            Tienes <strong className="text-[#845E1B] font-bold">{rewardPoints} pts</strong> listos para canjear en tus tratamientos de manicura, pedicura o spa en {salonName}.
          </p>
        </div>

        <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
          {[
            { title: 'Descuento de $100 MXN en Manicura', pts: 100, desc: 'Aplicable directamente sobre el total de tu cita' },
            { title: 'Decoración Cristales Swarovski 3D', pts: 150, desc: 'Acento de joyería de lujo en 2 uñas a elección' },
            { title: 'Efecto Chrome Espejo o Foil Dorado', pts: 180, desc: 'Acabado metálico o metálico en set completo' },
            { title: 'Tratamiento de Parafina & Masaje Spa', pts: 200, desc: 'Hidratación profunda de manos con aromaterapia' }
          ].map((perk, i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl bg-[#FBFBFD] border border-black/[0.04] flex items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-sm text-[#1D1D1F]">{perk.title}</p>
                <p className="text-[11px] text-[#86868B] font-medium">{perk.desc}</p>
                <span className="inline-block text-[10px] font-bold text-[#845E1B] bg-[#FAF5EC] border border-[#ECDCC2]/70 px-2 py-0.5 rounded-full mt-1">
                  {perk.pts} Puntos
                </span>
              </div>
              <Button
                onClick={() => onRedeemPerk(perk.title, perk.pts)}
                disabled={rewardPoints < perk.pts || redeemedOffer === perk.title}
                className={cn(
                  "h-9 px-4 rounded-xl text-xs font-bold shrink-0 shadow-sm transition-all",
                  redeemedOffer === perk.title 
                    ? "bg-neutral-800 text-white" 
                    : "bg-primary hover:brightness-105 text-white"
                )}
              >
                {redeemedOffer === perk.title ? 'Canjeado ✓' : 'Canjear'}
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full h-11 rounded-2xl border-black/10 font-bold text-xs uppercase tracking-wider"
        >
          Cerrar
        </Button>
      </motion.div>
    </div>
  );
}
