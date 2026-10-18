import React from 'react';
import { Star, Gift, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface VipLoyaltyCardProps {
  rewardPoints: number;
  onViewRewards: () => void;
}

export function VipLoyaltyCard({ rewardPoints, onViewRewards }: VipLoyaltyCardProps) {
  const nextTarget = 500;
  const progressPercent = Math.min(100, (rewardPoints / nextTarget) * 100);
  const remainingPoints = Math.max(0, nextTarget - rewardPoints);

  return (
    <div className="w-full liquid-glass rounded-[28px] p-5 relative overflow-hidden group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-neutral-100 text-[#1D1D1F] flex items-center justify-center font-bold shrink-0">
            <Star className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[17px] text-[#1D1D1F] leading-none">Emme Club</h3>
            <p className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.14em] mt-1">Gold VIP</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[24px] font-display font-bold tracking-tight text-[#1D1D1F] tabular-nums">{rewardPoints}</span>
          <span className="text-[12px] font-semibold text-[#86868B] ml-1">pts</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="w-full bg-neutral-100 rounded-full h-1 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="bg-[#1D1D1F] h-full rounded-full"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-medium text-[#1D1D1F]">
          <span>
            {remainingPoints > 0 ? `Faltan ${remainingPoints} pts para el próximo beneficio` : '¡Beneficio disponible!'}
          </span>
          <span className="font-semibold tabular-nums">{Math.round(progressPercent)}%</span>
        </div>
      </div>

      <button 
        onClick={onViewRewards}
        className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-[13px] font-semibold text-[#1D1D1F] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>Ver beneficios y canjear</span>
        <ChevronRight className="size-4 text-[#86868B]" />
      </button>
    </div>
  );
}
