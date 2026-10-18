import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, RotateCcw, Check, Clock, AlertTriangle, 
  Scissors, Palette, Gem, Leaf, Info
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerSelectionVibration } from '@/shared/utils/haptics';

export type LookType = 'care' | 'color' | 'extensions' | 'refill' | 'removal';
export type ExtensionLengthOption = 'short' | 'medium' | 'long';
export type ExtensionTechOption = 'soft_gel' | 'acrylic' | 'polygel';
export type ColorSubTypeOption = 'semi' | 'rubber';
export type RefillTimeOption = 'up_to_3_weeks' | 'more_than_3_weeks';

export interface LastAppointmentData {
  id: string;
  dateStr: string;
  serviceTitle: string;
  technique: string;
  shape: string;
  length?: string;
  finish: string;
  colorName: string;
  staffName: string;
  priceMXN: number;
  weeksAgo: number;
}

interface LookSelectionStepProps {
  selectedLook: LookType | null;
  onSelectLook: (look: LookType) => void;
  // Extension sub-options
  extensionLength?: ExtensionLengthOption;
  onSelectExtensionLength?: (len: ExtensionLengthOption) => void;
  extensionTech: ExtensionTechOption;
  onSelectExtensionTech: (tech: ExtensionTechOption) => void;
  // Color sub-options
  colorSubType: ColorSubTypeOption;
  onSelectColorSubType: (type: ColorSubTypeOption) => void;
  // Refill sub-options
  refillTimeOption: RefillTimeOption;
  onSelectRefillTimeOption: (option: RefillTimeOption) => void;
  isConvertedToNewSet: boolean;
  // Repeat appointment
  lastAppointment?: LastAppointmentData | null;
  onRepeatLastAppointment: () => void;
  isRepeated: boolean;
}

export function LookSelectionStep({
  selectedLook,
  onSelectLook,
  extensionTech,
  onSelectExtensionTech,
  colorSubType,
  onSelectColorSubType,
  refillTimeOption,
  onSelectRefillTimeOption,
  isConvertedToNewSet,
  lastAppointment,
  onRepeatLastAppointment,
  isRepeated
}: LookSelectionStepProps) {

  // Main looks in 2x2 grid (Uñas cuidadas, Color, Extensiones, Relleno)
  const GRID_LOOK_OPTIONS = [
    {
      id: 'care' as LookType,
      title: 'Uñas cuidadas',
      subtitle: 'Manicura rusa limpia',
      meta: '40 min · $280',
      icon: Leaf,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10'
    },
    {
      id: 'color' as LookType,
      title: 'Color que dure',
      subtitle: 'Semi o rubber base',
      meta: '60 min · $380',
      icon: Palette,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500/10'
    },
    {
      id: 'extensions' as LookType,
      title: 'Largo y forma',
      subtitle: 'Extensiones nuevas',
      meta: '80 min · desde $480',
      icon: Gem,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10'
    },
    {
      id: 'refill' as LookType,
      title: 'Relleno',
      subtitle: 'Mantenimiento de set',
      meta: '60 min · $340',
      icon: RotateCcw,
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-500/10'
    }
  ];

  const handleLookClick = (lookId: LookType) => {
    triggerSelectionVibration();
    onSelectLook(lookId);
  };

  return (
    <div className="space-y-4 text-left w-full max-w-lg md:max-w-none mx-auto pb-4">

      {/* ---------------------------------------------------- */}
      {/* 1. CLIENTA RECURRENTE: REPETIR MI ÚLTIMA CITA       */}
      {/* ---------------------------------------------------- */}
      {lastAppointment && (
        <div
          onClick={() => {
            triggerSelectionVibration();
            onRepeatLastAppointment();
          }}
          className={cn(
            "p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 select-none",
            isRepeated
              ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
              : "bg-card hover:bg-muted/40 border-border"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              isRepeated ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}>
              <RotateCcw className="size-4.5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                  Repetir mi última cita
                </span>
                <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                  (hace {lastAppointment.weeksAgo} semanas)
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {lastAppointment.serviceTitle} · {lastAppointment.colorName} · ${lastAppointment.priceMXN}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors pointer-events-none",
              isRepeated
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            {isRepeated ? "✓ Elegida" : "Repetir"}
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. CUADRÍCULA 2x2 LIMPIA DE SERVICIOS PRINCIPALES    */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Elige tu estilo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {GRID_LOOK_OPTIONS.map((item) => {
            const isSelected = selectedLook === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLookClick(item.id)}
                className={cn(
                  "p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2.5 min-h-[115px] outline-none",
                  isSelected
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                    : "bg-card hover:bg-muted/40 border-border"
                )}
              >
                <div className={cn(
                  "size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "bg-primary text-white" : cn(item.iconBg, item.iconColor)
                )}>
                  <Icon className="size-4.5" />
                </div>

                <div className="space-y-0.5 w-full">
                  <div className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {item.meta}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-selectores condicionales según el servicio seleccionado */}
        <AnimatePresence>
          {/* Sub-selector para Extensiones ("Técnica") */}
          {selectedLook === 'extensions' && (
            <motion.div
              key="sub-extensions"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-2 mt-1"
            >
              <div className="flex items-center justify-between px-0.5">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Técnica de extensión
                </label>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-background rounded-xl border border-border">
                {[
                  { id: 'soft_gel' as ExtensionTechOption, name: 'Soft Gel' },
                  { id: 'acrylic' as ExtensionTechOption, name: 'Acrílico' },
                  { id: 'polygel' as ExtensionTechOption, name: 'Polygel' }
                ].map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      onSelectExtensionTech(tech.id);
                    }}
                    className={cn(
                      "py-2 px-1 text-center rounded-lg text-xs font-medium transition-all cursor-pointer",
                      extensionTech === tech.id
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tech.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sub-selector para Color (Semipermanente vs Rubber) */}
          {selectedLook === 'color' && (
            <motion.div
              key="sub-color"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-2 mt-1"
            >
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Tipo de esmaltado
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectColorSubType('semi');
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer",
                    colorSubType === 'semi'
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                      : "bg-card border-border hover:bg-muted text-foreground"
                  )}
                >
                  <div className="font-bold text-xs">Semipermanente</div>
                  <div className={cn("text-[10px]", colorSubType === 'semi' ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    Hasta 21 días
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectColorSubType('rubber');
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer",
                    colorSubType === 'rubber'
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                      : "bg-card border-border hover:bg-muted text-foreground"
                  )}
                >
                  <div className="font-bold text-xs">Rubber Base</div>
                  <div className={cn("text-[10px]", colorSubType === 'rubber' ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    Nivelador y refuerzo
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Sub-selector para Relleno (Regla de 3 semanas) */}
          {selectedLook === 'refill' && (
            <motion.div
              key="sub-refill"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-2 mt-1"
            >
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
                <span className="font-semibold">Tiempo desde tu última cita:</span>
                <span>Regla de 3 semanas</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectRefillTimeOption('up_to_3_weeks');
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer",
                    refillTimeOption === 'up_to_3_weeks'
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                      : "bg-card border-border hover:bg-muted text-foreground"
                  )}
                >
                  <div className="font-bold text-xs">Hasta 3 semanas</div>
                  <div className={cn("text-[10px]", refillTimeOption === 'up_to_3_weeks' ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    Relleno normal
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectRefillTimeOption('more_than_3_weeks');
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer",
                    refillTimeOption === 'more_than_3_weeks'
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                      : "bg-card border-border hover:bg-muted text-foreground"
                  )}
                >
                  <div className="font-bold text-xs">Más de 3 semanas</div>
                  <div className={cn("text-[10px]", refillTimeOption === 'more_than_3_weeks' ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    Pasa a Set Nuevo
                  </div>
                </button>
              </div>

              {refillTimeOption === 'more_than_3_weeks' && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Info className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Por seguridad de la uña, se agendará como Set Nuevo.</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. SOLO RETIRO (OPCIÓN DIRECTA)                      */}
      {/* ---------------------------------------------------- */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => handleLookClick('removal')}
          className={cn(
            "w-full text-center p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 outline-none",
            selectedLook === 'removal'
              ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
              : "bg-card hover:bg-muted/40 border-border"
          )}
        >
          <div className={cn(
            "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            selectedLook === 'removal' ? "bg-primary text-white" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          )}>
            <Scissors className="size-4" />
          </div>

          <div className="text-center">
            <span className="text-xs sm:text-sm font-bold text-foreground">
              Solo retiro
            </span>
            <span className="text-[11px] text-muted-foreground ml-2">
              · Retiro seguro · 35 min · $180
            </span>
          </div>
        </button>
      </div>

    </div>
  );
}
