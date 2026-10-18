import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, AlertCircle, 
  HelpCircle, RotateCcw, Scissors, ShieldAlert,
  Plus, Minus, Gem, Sun, Leaf, X
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerSelectionVibration } from '@/shared/utils/haptics';

export type CurrentNailState = 'clean' | 'regular_polish' | 'gel_semi' | 'rigid_extension';
export type ExtensionIntent = 'removal_only' | 'change_set' | 'refill';
export type RefillOrigin = 'our_studio' | 'other_studio';
export type RefillAgeWeeks = '2_3_weeks' | '4_weeks' | '5_plus_weeks';

export interface DiagnosticData {
  currentNailState: CurrentNailState;
  regularPolishOption: 'remove_at_salon' | 'come_without_it';
  extensionIntent: ExtensionIntent | null;
  refillOrigin: RefillOrigin | null;
  refillAgeWeeks: RefillAgeWeeks | null;
  brokenNailsCount: number;
  targetServiceType: 'natural_manicure' | 'new_set';
  targetSystemTechnique: 'semi_rubber' | 'soft_gel' | 'acrylic' | 'polygel';
}

export interface DiagnosticComputed {
  accion_previa: string;
  es_mantenimiento: boolean;
  reconstrucciones: number;
  duracion_preparacion: number;
  costo_preparacion: number;
  serviceType: 'natural_manicure' | 'new_set' | 'refill' | 'only_removal';
  technique: 'semi_rubber' | 'soft_gel' | 'acrylic' | 'polygel';
  serviceTitle: string;
}

interface DiagnosticTreeStepProps {
  diagnosticData: DiagnosticData;
  onChange: (data: Partial<DiagnosticData>) => void;
  subScreen: '1.1_main' | '1.2_extension' | '1.3_refill';
  setSubScreen: (subScreen: '1.1_main' | '1.2_extension' | '1.3_refill') => void;
  computed: DiagnosticComputed;
}

export function DiagnosticTreeStep({
  diagnosticData,
  onChange,
  subScreen,
  setSubScreen
}: DiagnosticTreeStepProps) {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showOtherSalonModal, setShowOtherSalonModal] = useState(false);

  // Sub-pantalla 1.1: Selector de producto actual
  const handleSelectNailState = (state: CurrentNailState) => {
    triggerSelectionVibration();
    onChange({ currentNailState: state });

    if (state === 'rigid_extension') {
      if (diagnosticData.currentNailState === 'rigid_extension') {
        setSubScreen('1.2_extension');
      }
    } else {
      onChange({
        currentNailState: state,
        extensionIntent: null,
        refillOrigin: null,
        refillAgeWeeks: null,
      });
    }
  };

  // Sub-pantalla 1.2: Selección de intención con extensión rígida
  const handleSelectExtensionIntent = (intent: ExtensionIntent) => {
    triggerSelectionVibration();
    onChange({ extensionIntent: intent });

    if (intent === 'refill') {
      setSubScreen('1.3_refill');
    }
  };

  // Sub-pantalla 1.3: Procedencia del set
  const handleSelectRefillOrigin = (origin: RefillOrigin) => {
    triggerSelectionVibration();
    onChange({ refillOrigin: origin });
    if (origin === 'other_studio') {
      setShowOtherSalonModal(true);
    }
  };

  return (
    <div className="space-y-4 text-left w-full max-w-lg md:max-w-none mx-auto">
      {/* Guía rápida sutil y limpia alineada a la derecha (sin duplicar títulos ni diagnóstico) */}
      {subScreen === '1.1_main' && (
        <div className="flex items-center justify-end -mt-1 sm:-mt-2">
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer py-1 px-2 rounded-xl hover:bg-primary/5 active:scale-95"
          >
            <HelpCircle className="size-3.5" />
            <span>¿Dudas con tu producto? Guía rápida</span>
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* PANTALLA 1.1: SELECTOR PRINCIPAL (GRID 2x2 CUADRADA LIMPIA)        */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence mode="wait">
        {subScreen === '1.1_main' && (
          <motion.div
            key="screen-1.1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            {/* Cuadrícula cuadrada 2x2 de 4 tarjetas */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Tarjeta 1: Uña limpia */}
              <button
                type="button"
                onClick={() => handleSelectNailState('clean')}
                className={cn(
                  "aspect-square p-3 sm:p-4 rounded-2xl sm:rounded-3xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between outline-none relative group active:scale-[0.98]",
                  diagnosticData.currentNailState === 'clean'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                {/* Icono de check circular marcado en la esquina superior derecha */}
                <div className="w-full flex justify-end">
                  <div className={cn(
                    "size-5 sm:size-5.5 rounded-full flex items-center justify-center transition-all",
                    diagnosticData.currentNailState === 'clean'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {diagnosticData.currentNailState === 'clean' && (
                      <Check className="size-3 sm:size-3.5 stroke-[3]" />
                    )}
                  </div>
                </div>

                {/* Centro: Icono + Título + Subtítulo con alto contraste */}
                <div className="flex flex-col items-center justify-center text-center -mt-1">
                  <div className="size-10 sm:size-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-1.5 sm:mb-2 shadow-2xs">
                    <Sparkles className="size-5 sm:size-5.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold block text-foreground leading-tight">
                    Uña limpia
                  </span>
                  <span className="text-xs sm:text-[12.5px] font-semibold text-foreground/80 dark:text-zinc-200 block mt-0.5 line-clamp-1">
                    Sin nada aplicado
                  </span>
                </div>

                {/* Pastilla inferior estandarizada: 0 min · $0 */}
                <span className={cn(
                  "text-[10.5px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 rounded-full border transition-colors",
                  diagnosticData.currentNailState === 'clean'
                    ? "bg-primary/15 text-primary border-primary/25 dark:text-pink-300 font-bold"
                    : "bg-black/[0.04] dark:bg-white/[0.08] text-foreground/75 border-black/[0.06] dark:border-white/[0.08]"
                )}>
                  0 min · $0
                </span>
              </button>

              {/* Tarjeta 2: Esmalte regular */}
              <button
                type="button"
                onClick={() => handleSelectNailState('regular_polish')}
                className={cn(
                  "aspect-square p-3 sm:p-4 rounded-2xl sm:rounded-3xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between outline-none relative group active:scale-[0.98]",
                  diagnosticData.currentNailState === 'regular_polish'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                {/* Icono de check circular marcado en la esquina superior derecha */}
                <div className="w-full flex justify-end">
                  <div className={cn(
                    "size-5 sm:size-5.5 rounded-full flex items-center justify-center transition-all",
                    diagnosticData.currentNailState === 'regular_polish'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {diagnosticData.currentNailState === 'regular_polish' && (
                      <Check className="size-3 sm:size-3.5 stroke-[3]" />
                    )}
                  </div>
                </div>

                {/* Centro: Icono + Título + Subtítulo con alto contraste */}
                <div className="flex flex-col items-center justify-center text-center -mt-1">
                  <div className="size-10 sm:size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 sm:mb-2 shadow-2xs">
                    <Sun className="size-5 sm:size-5.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold block text-foreground leading-tight">
                    Esmalte regular
                  </span>
                  <span className="text-xs sm:text-[12.5px] font-semibold text-foreground/80 dark:text-zinc-200 block mt-0.5 line-clamp-1">
                    Secado al aire
                  </span>
                </div>

                {/* Pastilla inferior estandarizada: +10 min · $0 */}
                <span className={cn(
                  "text-[10.5px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 rounded-full border transition-colors",
                  diagnosticData.currentNailState === 'regular_polish'
                    ? "bg-primary/15 text-primary border-primary/25 dark:text-pink-300 font-bold"
                    : "bg-black/[0.04] dark:bg-white/[0.08] text-foreground/75 border-black/[0.06] dark:border-white/[0.08]"
                )}>
                  +10 min · $0
                </span>
              </button>

              {/* Tarjeta 3: Gel semipermanente */}
              <button
                type="button"
                onClick={() => handleSelectNailState('gel_semi')}
                className={cn(
                  "aspect-square p-3 sm:p-4 rounded-2xl sm:rounded-3xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between outline-none relative group active:scale-[0.98]",
                  diagnosticData.currentNailState === 'gel_semi'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                {/* Icono de check circular marcado en la esquina superior derecha */}
                <div className="w-full flex justify-end">
                  <div className={cn(
                    "size-5 sm:size-5.5 rounded-full flex items-center justify-center transition-all",
                    diagnosticData.currentNailState === 'gel_semi'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {diagnosticData.currentNailState === 'gel_semi' && (
                      <Check className="size-3 sm:size-3.5 stroke-[3]" />
                    )}
                  </div>
                </div>

                {/* Centro: Icono + Título + Subtítulo con alto contraste */}
                <div className="flex flex-col items-center justify-center text-center -mt-1">
                  <div className="size-10 sm:size-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 sm:mb-2 shadow-2xs">
                    <Leaf className="size-5 sm:size-5.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold block text-foreground leading-tight">
                    Gel semipermanente
                  </span>
                  <span className="text-xs sm:text-[12.5px] font-semibold text-foreground/80 dark:text-zinc-200 block mt-0.5 line-clamp-1">
                    Gelish o base rubber
                  </span>
                </div>

                {/* Pastilla inferior estandarizada: +20 min · $60 */}
                <span className={cn(
                  "text-[10.5px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 rounded-full border transition-colors",
                  diagnosticData.currentNailState === 'gel_semi'
                    ? "bg-primary/15 text-primary border-primary/25 dark:text-pink-300 font-bold"
                    : "bg-black/[0.04] dark:bg-white/[0.08] text-foreground/75 border-black/[0.06] dark:border-white/[0.08]"
                )}>
                  +20 min · $60
                </span>
              </button>

              {/* Tarjeta 4: Extensión rígida */}
              <button
                type="button"
                onClick={() => handleSelectNailState('rigid_extension')}
                className={cn(
                  "aspect-square p-3 sm:p-4 rounded-2xl sm:rounded-3xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between outline-none relative group active:scale-[0.98]",
                  diagnosticData.currentNailState === 'rigid_extension'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                {/* Icono de check circular marcado en la esquina superior derecha */}
                <div className="w-full flex justify-end">
                  <div className={cn(
                    "size-5 sm:size-5.5 rounded-full flex items-center justify-center transition-all",
                    diagnosticData.currentNailState === 'rigid_extension'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {diagnosticData.currentNailState === 'rigid_extension' && (
                      <Check className="size-3 sm:size-3.5 stroke-[3]" />
                    )}
                  </div>
                </div>

                {/* Centro: Icono + Título + Subtítulo con alto contraste */}
                <div className="flex flex-col items-center justify-center text-center -mt-1">
                  <div className="size-10 sm:size-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 sm:mb-2 shadow-2xs">
                    <Gem className="size-5 sm:size-5.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold block text-foreground leading-tight">
                    Extensión rígida
                  </span>
                  <span className="text-xs sm:text-[12.5px] font-semibold text-foreground/80 dark:text-zinc-200 block mt-0.5 line-clamp-1">
                    Acrílico, Polygel o Soft Gel
                  </span>
                </div>

                {/* Pastilla inferior estandarizada: +30 min · $120 */}
                <span className={cn(
                  "text-[10.5px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 rounded-full border transition-colors",
                  diagnosticData.currentNailState === 'rigid_extension'
                    ? "bg-primary/15 text-primary border-primary/25 dark:text-pink-300 font-bold"
                    : "bg-black/[0.04] dark:bg-white/[0.08] text-foreground/75 border-black/[0.06] dark:border-white/[0.08]"
                )}>
                  +30 min · $120
                </span>
              </button>
            </div>

            {/* Micro-opción minimalista si eligió esmalte regular */}
            {diagnosticData.currentNailState === 'regular_polish' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-xl bg-secondary/30 border border-border/60 text-xs">
                <span className="text-muted-foreground text-[11.5px]">
                  ¿Prefieres retirarlo tú antes de venir?
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      onChange({ regularPolishOption: 'come_without_it' });
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer",
                      diagnosticData.regularPolishOption === 'come_without_it'
                        ? "bg-card text-foreground font-semibold shadow-2xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Vendré sin él (0 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      onChange({ regularPolishOption: 'remove_at_salon' });
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer",
                      diagnosticData.regularPolishOption === 'remove_at_salon'
                        ? "bg-card text-foreground font-semibold shadow-2xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Retiro en salón (+10 min)
                  </button>
                </div>
              </div>
            )}

            {/* Micro-nota limpia si eligió gel */}
            {diagnosticData.currentNailState === 'gel_semi' && (
              <p className="text-[11.5px] text-muted-foreground px-1 font-medium">
                ✨ El retiro incluye manicura en seco para cuidar tu cutícula (+20 min / $60 MXN).
              </p>
            )}
          </motion.div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* PANTALLA 1.2: MICRO-BIFURCACIÓN (EXTENSIÓN RÍGIDA)                */}
        {/* ----------------------------------------------------------------- */}
        {subScreen === '1.2_extension' && (
          <motion.div
            key="screen-1.2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setSubScreen('1.1_main')}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span>Volver a estado actual</span>
              </button>
            </div>

            {/* 3 Opciones Limpias */}
            <div className="space-y-2">
              {/* Opción A: Retiro total */}
              <button
                type="button"
                onClick={() => handleSelectExtensionIntent('removal_only')}
                className={cn(
                  "w-full p-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 outline-none active:scale-[0.99]",
                  diagnosticData.extensionIntent === 'removal_only'
                    ? "bg-primary/[0.04] border-primary text-foreground ring-1 ring-primary/70 shadow-2xs"
                    : "bg-card/70 border-border/70 text-foreground hover:border-border hover:bg-secondary/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Scissors className="size-4.5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block text-foreground leading-tight">
                      Retiro total y descansar la uña
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      Remoción completa + manicura rusa nutritiva
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10.5px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    +40 min · $180
                  </span>
                  <div className={cn(
                    "size-4 rounded-full flex items-center justify-center border transition-colors",
                    diagnosticData.extensionIntent === 'removal_only'
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/80 bg-background/50"
                  )}>
                    {diagnosticData.extensionIntent === 'removal_only' && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </div>
              </button>

              {/* Opción B: Retiro y set nuevo */}
              <button
                type="button"
                onClick={() => handleSelectExtensionIntent('change_set')}
                className={cn(
                  "w-full p-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 outline-none active:scale-[0.99]",
                  diagnosticData.extensionIntent === 'change_set'
                    ? "bg-primary/[0.04] border-primary text-foreground ring-1 ring-primary/70 shadow-2xs"
                    : "bg-card/70 border-border/70 text-foreground hover:border-border hover:bg-secondary/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Gem className="size-4.5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block text-foreground leading-tight">
                      Retiro completo para aplicar un set nuevo
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      Retirar producto anterior y aplicar nueva estructura
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10.5px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    +35 min · +$100
                  </span>
                  <div className={cn(
                    "size-4 rounded-full flex items-center justify-center border transition-colors",
                    diagnosticData.extensionIntent === 'change_set'
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/80 bg-background/50"
                  )}>
                    {diagnosticData.extensionIntent === 'change_set' && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </div>
              </button>

              {/* Opción C: Relleno / retoque */}
              <button
                type="button"
                onClick={() => handleSelectExtensionIntent('refill')}
                className={cn(
                  "w-full p-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 outline-none active:scale-[0.99]",
                  diagnosticData.extensionIntent === 'refill'
                    ? "bg-primary/[0.04] border-primary text-foreground ring-1 ring-primary/70 shadow-2xs"
                    : "bg-card/70 border-border/70 text-foreground hover:border-border hover:bg-secondary/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <RotateCcw className="size-4.5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block text-foreground leading-tight">
                      Mantenimiento / Relleno
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      Retoque de crecimiento y rebalance del ápice
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-primary text-xs font-semibold">
                  <span>Validar</span>
                  <ArrowRight className="size-3" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* PANTALLA 1.3: VALIDACIÓN DEL RELLENO                              */}
        {/* ----------------------------------------------------------------- */}
        {subScreen === '1.3_refill' && (
          <motion.div
            key="screen-1.3"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setSubScreen('1.2_extension')}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span>Volver a opciones</span>
              </button>
            </div>

            {/* Pregunta 1: Procedencia */}
            <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  1. ¿Este set fue realizado en nuestro estudio?
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectRefillOrigin('our_studio')}
                  className={cn(
                    "py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                    diagnosticData.refillOrigin === 'our_studio'
                      ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                      : "bg-secondary/40 border-border/60 text-foreground hover:bg-secondary"
                  )}
                >
                  <Check className="size-3" />
                  <span>Sí, aquí</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRefillOrigin('other_studio')}
                  className={cn(
                    "py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                    diagnosticData.refillOrigin === 'other_studio'
                      ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                      : "bg-secondary/40 border-border/60 text-foreground hover:bg-secondary"
                  )}
                >
                  <AlertCircle className="size-3" />
                  <span>No, en otro salón</span>
                </button>
              </div>

              {diagnosticData.refillOrigin === 'other_studio' && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 leading-relaxed">
                  Por técnica y bioseguridad no trabajamos sobre producto de otros salones. Agendaremos <strong>Retiro Externo + Set Nuevo (+35 min / +$150 MXN)</strong>.
                </p>
              )}
            </div>

            {/* Pregunta 2: Antigüedad (si es propio) */}
            {diagnosticData.refillOrigin === 'our_studio' && (
              <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-2">
                <span className="text-xs font-semibold text-foreground block">
                  2. ¿Cuántas semanas tiene tu aplicación?
                </span>

                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: '2_3_weeks', label: '2 a 3 sem', tag: '60 min · $340' },
                    { id: '4_weeks', label: '4 sem', tag: '75 min · $390' },
                    { id: '5_plus_weeks', label: '5+ sem', tag: 'Set nuevo' },
                  ].map((item) => {
                    const isSelected = diagnosticData.refillAgeWeeks === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          triggerSelectionVibration();
                          onChange({ refillAgeWeeks: item.id as any });
                        }}
                        className={cn(
                          "py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center gap-0.5",
                          isSelected
                            ? "bg-card border-primary text-foreground ring-1 ring-primary font-bold shadow-2xs"
                            : "bg-secondary/35 border-border/60 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="font-bold text-xs">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground">{item.tag}</span>
                      </button>
                    );
                  })}
                </div>

                {diagnosticData.refillAgeWeeks === '5_plus_weeks' && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 leading-relaxed">
                    Con más de 5 semanas el ápice desplazado genera palanca. Requiere retiro y set nuevo para cuidar tu uña (+35 min).
                  </p>
                )}
              </div>
            )}

            {/* Pregunta 3: Contador de uñas dañadas */}
            {diagnosticData.refillOrigin === 'our_studio' && (
              <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-foreground block">
                    3. Uñas rotas o despegadas
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {diagnosticData.brokenNailsCount === 0 
                      ? 'Ninguna (+0 min)' 
                      : `${diagnosticData.brokenNailsCount} uña(s) · +$${diagnosticData.brokenNailsCount * 30} MXN`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (diagnosticData.brokenNailsCount > 0) {
                        triggerSelectionVibration();
                        onChange({ brokenNailsCount: diagnosticData.brokenNailsCount - 1 });
                      }
                    }}
                    disabled={diagnosticData.brokenNailsCount === 0}
                    className="size-7 rounded-lg flex items-center justify-center border border-border bg-background hover:bg-secondary active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus className="size-3 text-foreground" />
                  </button>
                  <span className="w-5 text-center font-bold font-mono text-foreground text-xs">
                    {diagnosticData.brokenNailsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (diagnosticData.brokenNailsCount < 10) {
                        triggerSelectionVibration();
                        onChange({ brokenNailsCount: diagnosticData.brokenNailsCount + 1 });
                      }
                    }}
                    disabled={diagnosticData.brokenNailsCount >= 10}
                    className="size-7 rounded-lg flex items-center justify-center border border-border bg-background hover:bg-secondary active:scale-95 cursor-pointer"
                  >
                    <Plus className="size-3 text-foreground" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------- */}
      {/* MODAL GUÍA RÁPIDA: ¿NO SABES QUÉ TRAES EN TUS UÑAS?              */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3.5 text-left"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <h3 className="text-xs sm:text-sm font-bold text-foreground">Identificación rápida</h3>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="size-6 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 cursor-pointer"
                >
                  <X className="size-3.5 text-foreground" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/50 space-y-0.5">
                  <span className="font-bold text-foreground block">Esmalte regular:</span>
                  <p className="text-muted-foreground text-[11px]">Secado al aire, se quita con acetona en segundos.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/50 space-y-0.5">
                  <span className="font-bold text-foreground block">Gel semipermanente / Rubber:</span>
                  <p className="text-muted-foreground text-[11px]">Curado en lámpara UV, flexible y no sale frotando.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/50 space-y-0.5">
                  <span className="font-bold text-foreground block">Acrílico / Polygel / Soft Gel:</span>
                  <p className="text-muted-foreground text-[11px]">Material rígido, duro y alarga la uña con tip o molde.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:brightness-105 cursor-pointer transition-all"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------- */}
      {/* MODAL INFORMATIVO: SET DE OTRO SALÓN                             */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence>
        {showOtherSalonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3.5 text-left"
            >
              <div className="size-10 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="size-5" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Garantía y Bioseguridad
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Para garantizar la durabilidad y salud de tu uña, no trabajamos sobre producto de otros salones. Agendaremos retiro + set nuevo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowOtherSalonModal(false)}
                className="w-full py-2 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:brightness-105 cursor-pointer transition-all"
              >
                Aceptar Retiro Externo + Set Nuevo
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
