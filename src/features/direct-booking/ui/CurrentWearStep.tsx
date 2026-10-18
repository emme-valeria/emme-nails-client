import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Sparkles, HelpCircle, ArrowRight, 
  Paintbrush, Zap, Layers, Leaf, Palette, Gem, RefreshCw, Scissors, Info
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerSelectionVibration } from '@/shared/utils/haptics';
import { LookType } from './LookSelectionStep';

export type CurrentWearType = 'none' | 'regular_polish' | 'gel' | 'acrylic_polygel' | 'not_sure';

export interface CurrentWearOption {
  id: CurrentWearType;
  title: string;
  subtitle: string;
  badge: string;
  durationMinutes: number;
  costMXN: number;
  isZeroRemoval: boolean;
  isSafetyBuffer?: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export const CURRENT_WEAR_CATALOG: CurrentWearOption[] = [
  {
    id: 'none',
    title: 'Nada',
    subtitle: 'Al natural, sin producto previo',
    badge: 'Sin retiro · $0',
    durationMinutes: 0,
    costMXN: 0,
    isZeroRemoval: true,
    icon: Sparkles,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'regular_polish',
    title: 'Esmalte normal',
    subtitle: 'Tradicional que seca al aire',
    badge: '+10 min · $0',
    durationMinutes: 10,
    costMXN: 0,
    isZeroRemoval: false,
    icon: Paintbrush,
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600 dark:text-rose-400'
  },
  {
    id: 'gel',
    title: 'Gel o Rubber',
    subtitle: 'Semipermanente curado en lámpara',
    badge: '+20 min · $60',
    durationMinutes: 20,
    costMXN: 60,
    isZeroRemoval: false,
    icon: Zap,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 'acrylic_polygel',
    title: 'Acrílico o Polygel',
    subtitle: 'Extensiones o capas rígidas',
    badge: '+35 min · $120',
    durationMinutes: 35,
    costMXN: 120,
    isZeroRemoval: false,
    icon: Layers,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    id: 'not_sure',
    title: 'No sé qué material tengo',
    subtitle: 'Margen de tiempo preventivo para evaluar en salón',
    badge: '+30 min · $90',
    durationMinutes: 30,
    costMXN: 90,
    isZeroRemoval: false,
    isSafetyBuffer: true,
    icon: HelpCircle,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600 dark:text-amber-400'
  }
];

interface CurrentWearStepProps {
  currentWear: CurrentWearType | null;
  onSelectCurrentWear: (wear: CurrentWearType) => void;
  onAutoAdvanceIfNone?: () => void;
  isOnlyRemovalService?: boolean;
  selectedLook?: LookType | null;
  fullServiceTitle?: string;
  lookPrice?: number;
  lookDuration?: number;
  onChangeLook?: () => void;
  onContinue?: () => void;
}

export function CurrentWearStep({
  currentWear,
  onSelectCurrentWear,
  onAutoAdvanceIfNone,
  isOnlyRemovalService = false,
  selectedLook,
  fullServiceTitle,
  lookPrice,
  lookDuration,
  onChangeLook,
  onContinue
}: CurrentWearStepProps) {

  const handleSelect = (wear: CurrentWearType) => {
    triggerSelectionVibration();
    onSelectCurrentWear(wear);

    if (wear === 'none' && onAutoAdvanceIfNone && !isOnlyRemovalService) {
      setTimeout(() => {
        onAutoAdvanceIfNone();
      }, 240);
    }
  };

  // 4 opciones principales para cuadrícula 2x2
  const gridOptions = CURRENT_WEAR_CATALOG.filter(opt => opt.id !== 'not_sure');
  // Opción "No sé" para tarjeta adicional
  const notSureOption = CURRENT_WEAR_CATALOG.find(opt => opt.id === 'not_sure')!;

  return (
    <div className="space-y-4 text-left w-full max-w-lg md:max-w-none mx-auto pb-4">

      {/* ---------------------------------------------------- */}
      {/* 1. RESUMEN MINIMALISTA SIN CAJAS                    */}
      {/* ---------------------------------------------------- */}
      {fullServiceTitle && fullServiceTitle !== 'Por seleccionar' && (
        <div className="flex items-center justify-between text-xs py-1 px-1 text-muted-foreground border-b border-border/40 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-foreground truncate">
              {fullServiceTitle}
            </span>
            <span>·</span>
            <span className="text-muted-foreground tabular-nums">
              {lookDuration ? `${lookDuration} min` : ''} · ${lookPrice} MXN
            </span>
          </div>

          {onChangeLook && (
            <button
              type="button"
              onClick={onChangeLook}
              className="text-xs font-semibold text-primary hover:underline shrink-0 cursor-pointer ml-2"
            >
              Cambiar
            </button>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. CUADRÍCULA 2x2 LIMPIA: NADA, ESMALTE, GEL, ACRÍLICO */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            ¿Qué traes en tus uñas?
          </span>
          <span className="text-[11px] text-muted-foreground">
            Ajusta tiempo de retiro
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {gridOptions.map((option) => {
            const isSelected = currentWear === option.id;
            const OptionIcon = option.icon;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2.5 min-h-[115px] outline-none",
                  isSelected
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                    : "bg-card hover:bg-muted/40 border-border"
                )}
              >
                <div className={cn(
                  "size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "bg-primary text-white" : cn(option.iconBg, option.iconColor)
                )}>
                  <OptionIcon className="size-4.5" />
                </div>

                <div className="space-y-0.5 w-full">
                  <div className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {option.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {option.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. OPCIÓN "NO SÉ QUÉ MATERIAL TENGO"                 */}
      {/* ---------------------------------------------------- */}
      {notSureOption && (
        <button
          type="button"
          onClick={() => handleSelect('not_sure')}
          className={cn(
            "w-full text-center p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 outline-none",
            currentWear === 'not_sure'
              ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
              : "bg-card hover:bg-muted/40 border-border"
          )}
        >
          <div className={cn(
            "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            currentWear === 'not_sure' ? "bg-primary text-white" : notSureOption.iconBg
          )}>
            <HelpCircle className="size-4 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="text-center">
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {notSureOption.title}
            </span>
            <span className="text-[11px] text-muted-foreground ml-2">
              · {notSureOption.badge}
            </span>
          </div>
        </button>
      )}

      {/* Helper sutil si eligió "No sé" */}
      <AnimatePresence>
        {currentWear === 'not_sure' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-2.5 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-center gap-2"
          >
            <Info className="size-3.5 shrink-0 text-primary" />
            <span>Apartamos 30 min para evaluar tu uña en cabina y realizar el retiro seguro.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* 4. BOTÓN CONTINUAR                                   */}
      {/* ---------------------------------------------------- */}
      {onContinue && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onContinue}
            disabled={!currentWear}
            className={cn(
              "w-full py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all",
              currentWear
                ? "bg-primary hover:brightness-105 text-primary-foreground cursor-pointer shadow-sm active:scale-98"
                : "bg-muted text-muted-foreground/50 cursor-not-allowed border border-border/60"
            )}
          >
            <span>{currentWear ? "Continuar al diseño" : "Selecciona qué traes puesto"}</span>
            <ArrowRight className="size-4 stroke-[2.25]" />
          </button>
        </div>
      )}

    </div>
  );
}
