import React, { useState } from 'react';
import { Award, Gift, Check } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';

interface LoyaltyPerksChatWidgetProps {
  userPoints?: number;
  onApplyPerk: (perkTitle: string, discountAmount: number) => void;
}

const PERKS_OPTIONS = [
  { id: 'perk-1', title: '$100 MXN Descuento en Cita', points: 100, discount: 100, desc: 'Aplica en tu siguiente servicio' },
  { id: 'perk-2', title: 'Cristales Swarovski 3D (x2)', points: 150, discount: 50, desc: 'Decoración de lujo en 2 uñas' },
  { id: 'perk-3', title: 'Efecto Chrome Espejo Gratis', points: 180, discount: 80, desc: 'Acabado metálico en set completo' },
  { id: 'perk-4', title: 'Spa Masaje & Parafina Hidratante', points: 200, discount: 120, desc: 'Sesión spa de manos o pies' },
];

export function LoyaltyPerksChatWidget({ userPoints = 250, onApplyPerk }: LoyaltyPerksChatWidgetProps) {
  const [redeemedId, setRedeemedId] = useState<string | null>(null);

  const handleRedeem = (perk: typeof PERKS_OPTIONS[0]) => {
    if (userPoints < perk.points) {
      toast.error('Puntos insuficientes');
      return;
    }
    setRedeemedId(perk.id);
    onApplyPerk(perk.title, perk.discount);
    toast.success(`¡Beneficio "${perk.title}" activado! 🎉`, {
      description: 'Se aplicará en tu propuesta de cita en chat.'
    });
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Award className="size-4 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Emme Club Platinum Rewards</h4>
            <p className="text-[10.5px] text-[#86868B]">
              Tienes <strong className="text-amber-700 font-bold">{userPoints} Puntos acumulados</strong>
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-amber-700 border-amber-200 bg-amber-50">
          VIP Rewards
        </Badge>
      </div>

      {/* Containerless Flush Perks List */}
      <div className="divide-y divide-black/[0.05] max-h-[280px] overflow-y-auto custom-scrollbar">
        {PERKS_OPTIONS.map(perk => {
          const isRedeemed = redeemedId === perk.id;
          const canRedeem = userPoints >= perk.points;

          return (
            <div
              key={perk.id}
              className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#F8F8FA] transition-colors"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Gift className="size-3.5 text-amber-600 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-[#1D1D1F] truncate">{perk.title}</span>
                </div>
                <p className="text-[11px] text-[#86868B] line-clamp-1">{perk.desc}</p>
                <span className="text-[9.5px] font-semibold text-amber-700">
                  {perk.points} Puntos requeridos
                </span>
              </div>

              <Button
                size="sm"
                disabled={!canRedeem || isRedeemed}
                onClick={() => handleRedeem(perk)}
                className={cn(
                  "h-8 px-3 rounded-lg font-bold text-xs shrink-0 active:scale-95 transition-all cursor-pointer",
                  isRedeemed 
                    ? "bg-emerald-600 text-white" 
                    : canRedeem 
                      ? "bg-primary hover:brightness-105 text-white shadow-2xs" 
                      : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                )}
              >
                {isRedeemed ? 'Aplicado ✓' : 'Canjear'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
