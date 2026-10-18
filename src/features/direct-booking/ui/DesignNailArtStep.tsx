import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Palette, Gem, Award, Check, 
  ArrowRight, Info, Plus, CheckCircle2
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerSelectionVibration } from '@/shared/utils/haptics';
import { NailArtTierOption, NailArtTierConfig, NAIL_ART_TIER_OPTIONS } from './DirectBookingFlow';
import { NailFinishType } from '@/shared/components/NailModelerVisualizerSVG';
import { SALON_EXTRAS_CATALOG } from '@/widgets/service-qualification/ui/ServiceQualificationEngine';
import { CurrentWearType, CurrentWearOption } from './CurrentWearStep';
import { LookType } from './LookSelectionStep';

interface DesignNailArtStepProps {
  selectedArtTier: NailArtTierOption | null;
  onSelectArtTier: (tier: NailArtTierOption) => void;
  selectedFinish: NailFinishType;
  onSelectFinish: (finish: NailFinishType) => void;
  selectedColorHex: string;
  selectedColorName: string;
  onSelectColor: (hex: string, name: string) => void;
  selectedExtras: string[];
  onToggleExtra: (extraId: string) => void;
  designNotes: string;
  onChangeDesignNotes: (notes: string) => void;
  fullServiceTitle?: string;
  lookPrice?: number;
  lookDuration?: number;
  currentWear?: CurrentWearType | null;
  wearOption?: CurrentWearOption | null;
  serviceDurationMinutes?: number;
  totalPriceMXN?: number;
  selectedLook?: LookType | null;
  onChangePreviousStep?: () => void;
  onContinue?: () => void;
}

export function DesignNailArtStep({
  selectedArtTier,
  onSelectArtTier,
  selectedFinish,
  onSelectFinish,
  selectedColorHex,
  selectedColorName,
  onSelectColor,
  selectedExtras,
  onToggleExtra,
  designNotes,
  onChangeDesignNotes,
  fullServiceTitle,
  lookPrice,
  lookDuration,
  currentWear,
  wearOption,
  serviceDurationMinutes,
  totalPriceMXN,
  selectedLook,
  onChangePreviousStep,
  onContinue
}: DesignNailArtStepProps) {

  const handleTierClick = (tierId: NailArtTierOption) => {
    triggerSelectionVibration();
    onSelectArtTier(tierId);
  };

  const COLOR_OPTIONS = [
    { name: 'Nude Rosé Ballet', hex: '#F3C5BA' },
    { name: 'Milky White', hex: '#F5F5F0' },
    { name: 'French Soft Pink', hex: '#FAD2E1' },
    { name: 'Classic Rouge', hex: '#9E2A2B' },
    { name: 'Espresso Glaze', hex: '#4A3525' },
    { name: 'Lavender Mist', hex: '#D6C7E8' },
    { name: 'Chrome Rose Quartz', hex: '#E8B4B8' },
    { name: 'Pure Noir', hex: '#1E1E1E' }
  ];

  const FINISH_OPTIONS_LIST = [
    { id: 'glossy' as NailFinishType, label: 'Brillante', meta: 'Incluido' },
    { id: 'glazed' as NailFinishType, label: 'Glazed / Cromo', meta: '+$50 MXN' },
    { id: 'matte' as NailFinishType, label: 'Mate', meta: '+$40 MXN' },
    { id: 'cat_eye' as NailFinishType, label: 'Ojo de Gato', meta: '+$60 MXN' },
  ];

  return (
    <div className="space-y-4 text-left w-full max-w-lg md:max-w-none mx-auto pb-4">

      {/* ---------------------------------------------------- */}
      {/* 1. RESUMEN MINIMALISTA SIN CAJAS                    */}
      {/* ---------------------------------------------------- */}
      {fullServiceTitle && fullServiceTitle !== 'Por seleccionar' && (
        <div className="flex items-center justify-between text-xs py-1 px-1 text-muted-foreground border-b border-border/40 pb-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="font-semibold text-foreground truncate">
              {fullServiceTitle}
            </span>
            {currentWear && currentWear !== 'none' && wearOption && (
              <>
                <span>·</span>
                <span className="text-muted-foreground">
                  Retiro: {wearOption.title}
                </span>
              </>
            )}
            <span>·</span>
            <span className="text-muted-foreground tabular-nums">
              {serviceDurationMinutes ? `~${serviceDurationMinutes} min` : ''} · ${totalPriceMXN || lookPrice || 0} MXN
            </span>
          </div>

          {onChangePreviousStep && (
            <button
              type="button"
              onClick={onChangePreviousStep}
              className="text-xs font-semibold text-primary hover:underline shrink-0 cursor-pointer ml-2"
            >
              Cambiar
            </button>
          )}
        </div>
      )}

      {/* Aviso sutil si eligió manicura rusa sin color en paso 1 */}
      {selectedLook === 'care' && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <Info className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug">
            Elegiste <strong>Uñas cuidadas (sin esmalte)</strong>. Para mantenerlas naturales, elige <em>Liso / Sin diseño</em>. Si deseas color o arte, puedes seleccionarlo aquí.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. CUADRÍCULA 2x2 LIMPIA: NIVEL DE DECORACIÓN       */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Nivel de decoración
          </span>
          <span className="text-[11px] text-muted-foreground">
            {selectedArtTier 
              ? NAIL_ART_TIER_OPTIONS.find(t => t.id === selectedArtTier)?.title 
              : 'Selecciona una opción'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {NAIL_ART_TIER_OPTIONS.map((tier) => {
            const isSelected = selectedArtTier === tier.id;
            const TierIcon = tier.id === 'A0' 
              ? Sparkles 
              : tier.id === 'A1' 
              ? Palette 
              : tier.id === 'A2' 
              ? Gem 
              : Award;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => handleTierClick(tier.id)}
                className={cn(
                  "p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2.5 min-h-[115px] outline-none",
                  isSelected
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                    : "bg-card hover:bg-muted/40 border-border"
                )}
              >
                <div className={cn(
                  "size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  <TierIcon className="size-4.5" />
                </div>

                <div className="space-y-0.5 w-full">
                  <div className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {tier.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {tier.durationMinutes > 0 ? `+${tier.durationMinutes} min` : '0 min'} · {tier.priceMXN > 0 ? `+$${tier.priceMXN}` : '$0'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. EFECTO & ACABADO (CUADRÍCULA LIMPIA)               */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-2 pt-2 border-t border-border/40">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Efecto y acabado
          </span>
          <span className="text-[11px] text-muted-foreground">
            {FINISH_OPTIONS_LIST.find(f => f.id === selectedFinish)?.label}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FINISH_OPTIONS_LIST.map((fin) => {
            const isFinSelected = selectedFinish === fin.id;
            return (
              <button
                key={fin.id}
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectFinish(fin.id);
                }}
                className={cn(
                  "p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[75px] outline-none",
                  isFinSelected
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                    : "bg-card hover:bg-muted/40 border-border"
                )}
              >
                <span className="text-xs font-bold text-foreground leading-tight">
                  {fin.label}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {fin.meta}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. PALETA DE COLOR BASE                             */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-2 pt-2 border-t border-border/40">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Color base
          </span>
          <span className="text-[11px] text-muted-foreground">
            {selectedColorName}
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 custom-scrollbar px-1">
          {COLOR_OPTIONS.map((col) => {
            const isColSelected = selectedColorHex === col.hex;
            return (
              <button
                key={col.hex}
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectColor(col.hex, col.name);
                }}
                className={cn(
                  "size-10 sm:size-11 rounded-full border-2 transition-all cursor-pointer shrink-0 flex items-center justify-center relative active:scale-95",
                  isColSelected
                    ? "border-primary ring-2 ring-primary/40 scale-105"
                    : "border-black/10 dark:border-white/20 hover:scale-105"
                )}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              >
                {isColSelected && (
                  <Check className={cn(
                    "size-4 stroke-[3]",
                    col.hex === '#F5F5F0' || col.hex === '#FAD2E1' || col.hex === '#F3C5BA' 
                      ? "text-neutral-800" 
                      : "text-white"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. EXTRAS DE CABINA (2 COLUMNAS LIMPIAS)            */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-2 pt-2 border-t border-border/40">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Extras de cabina (Opcional)
          </span>
          {selectedExtras.length > 0 && (
            <span className="text-[11px] text-primary font-semibold">
              {selectedExtras.length} seleccionado(s)
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {SALON_EXTRAS_CATALOG.slice(0, 4).map((extra) => {
            const isChecked = selectedExtras.includes(extra.id);
            return (
              <button
                key={extra.id}
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onToggleExtra(extra.id);
                }}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 min-h-[85px] outline-none",
                  isChecked
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                    : "bg-card hover:bg-muted/40 border-border"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground leading-tight truncate">
                    {extra.name}
                  </span>
                  <div className={cn(
                    "size-4 rounded-full flex items-center justify-center shrink-0 transition-all",
                    isChecked ? "bg-primary text-white" : "border border-border bg-background"
                  )}>
                    {isChecked && <Check className="size-2 stroke-[3]" />}
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground truncate">
                  +{extra.durationMins} min · +${extra.priceMXN}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 6. COMENTARIOS / NOTAS                              */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-1.5 pt-2 border-t border-border/40">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block px-1">
          Inspiración o notas para la manicurista (Opcional)
        </label>
        <input
          type="text"
          value={designNotes}
          onChange={(e) => onChangeDesignNotes(e.target.value)}
          placeholder="Ej. Tonos milky, detalles dorados, inspirada en mi vestido..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      {/* ---------------------------------------------------- */}
      {/* 7. BOTÓN CONTINUAR                                   */}
      {/* ---------------------------------------------------- */}
      {onContinue && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onContinue}
            disabled={!selectedArtTier}
            className={cn(
              "w-full py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all",
              selectedArtTier
                ? "bg-primary hover:brightness-105 text-primary-foreground cursor-pointer shadow-sm active:scale-98"
                : "bg-muted text-muted-foreground/50 cursor-not-allowed border border-border/60"
            )}
          >
            <span>{selectedArtTier ? "Continuar a fecha y hora" : "Elige nivel de decoración para continuar"}</span>
            <ArrowRight className="size-4 stroke-[2.25]" />
          </button>
        </div>
      )}

    </div>
  );
}
