import React from 'react';
import { Card } from '@emme/ui/card';
import { Badge } from '@emme/ui/badge';
import { Gift, Award, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { cn } from '@emme/ui/lib/utils';

interface ClubPerksWidgetProps {
  rewardPoints: number;
  onRedeemPerk: (title: string, cost: number) => void;
  redeemedOffer: string | null;
}

const perksList = [
  {
    id: 'perk-1',
    title: '10% OFF en tu Próxima Cita',
    description: 'Aplica a cualquier servicio de manicura o pedicura.',
    cost: 100,
    tag: 'Popular',
    icon: Gift,
  },
  {
    id: 'perk-2',
    title: 'Nail Art 3D o Cristales Gratis',
    description: 'Decoración especial sin costo adicional en 2 uñas.',
    cost: 150,
    tag: 'Exclusivo',
    icon: Sparkles,
  },
  {
    id: 'perk-3',
    title: 'Exfoliación & Spa de Manos',
    description: 'Tratamiento de hidratación profunda con aceites esenciales.',
    cost: 200,
    tag: 'Relax',
    icon: Award,
  },
  {
    id: 'perk-4',
    title: 'Servicio VIP & Coctel Especial',
    description: 'Atención prioritaria y bebida de cortesía durante tu cita.',
    cost: 300,
    tag: 'Premium',
    icon: Award,
  },
];

export function ClubPerksWidget({ rewardPoints, onRedeemPerk, redeemedOffer }: ClubPerksWidgetProps) {
  return (
    <div className="liquid-glass rounded-[28px] p-5 relative overflow-hidden flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Gift className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-foreground leading-none">Beneficios Club VIP</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Catálogo de Recompensas</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-extrabold border-primary/20 text-primary bg-primary/5 px-2.5 py-0.5 rounded-full">
          {rewardPoints} pts disponibles
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {perksList.map((perk) => {
          const isUnlocked = rewardPoints >= perk.cost;
          const isRedeemed = redeemedOffer === perk.title;
          const Icon = perk.icon;

          return (
            <div
              key={perk.id}
              className={cn(
                "p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5",
                isRedeemed
                  ? "border-primary/30 bg-primary/[0.03]"
                  : isUnlocked
                  ? "border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30"
                  : "border-border/50 bg-secondary/20 opacity-70"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "size-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                    isUnlocked ? "bg-[#FAF5EC] text-[#845E1B]" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="size-3.5" />
                  </div>
                  <span className="font-display font-bold text-xs text-foreground leading-tight">{perk.title}</span>
                </div>
                <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 rounded-md border-black/[0.06] text-muted-foreground shrink-0">
                  {perk.cost} pts
                </Badge>
              </div>

              <p className="text-[11px] text-muted-foreground leading-snug">{perk.description}</p>

              <Button
                type="button"
                size="sm"
                disabled={!isUnlocked || isRedeemed}
                onClick={() => onRedeemPerk(perk.title, perk.cost)}
                className={cn(
                  "w-full h-8 text-[11px] font-bold rounded-xl transition-all cursor-pointer",
                  isRedeemed
                    ? "bg-[#FAF5EC] text-[#845E1B] border border-[#845E1B]/20"
                    : isUnlocked
                    ? "bg-primary text-white hover:brightness-105 shadow-2xs"
                    : "bg-muted text-muted-foreground hover:bg-muted"
                )}
              >
                {isRedeemed ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5 stroke-[3]" />
                    <span>Canjeado</span>
                  </span>
                ) : isUnlocked ? (
                  <span className="flex items-center gap-1">
                    <span>Canjear Beneficio</span>
                    <ArrowRight className="size-3" />
                  </span>
                ) : (
                  <span>Faltan {perk.cost - rewardPoints} pts</span>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
