import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Info, 
  ShieldCheck, Gem, Feather, Clock, Scissors,
  Layers, Palette, AlertCircle
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerSelectionVibration } from '@/shared/utils/haptics';

export type ServiceCategory = 'natural' | 'extension';
export type NaturalTechnique = 'rusa' | 'gel_semi' | 'rubber_kapping';
export type ExtensionTechnique = 'soft_gel' | 'acrylic' | 'polygel';
export type RefillTechnique = 'acrylic' | 'polygel' | 'rubber_kapping';
export type NailLengthOption = 'short' | 'medium' | 'long' | 'xl';
export type NailShapeOption = 'square' | 'almond' | 'coffin' | 'stiletto';

export interface MainServiceTechniqueStepProps {
  isRefill: boolean;
  isOnlyRemoval: boolean;
  serviceCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  naturalTechnique: NaturalTechnique;
  onSelectNaturalTechnique: (tech: NaturalTechnique) => void;
  extensionTechnique: ExtensionTechnique;
  onSelectExtensionTechnique: (tech: ExtensionTechnique) => void;
  refillTechnique: RefillTechnique;
  onSelectRefillTechnique: (tech: RefillTechnique) => void;
  selectedLength: NailLengthOption;
  onSelectLength: (length: NailLengthOption) => void;
  selectedShape: NailShapeOption;
  onSelectShape: (shape: NailShapeOption) => void;
  subScreen2: '2.1_category' | '2.2A_natural' | '2.2B_extension' | '2.3_length';
  setSubScreen2: (sub: '2.1_category' | '2.2A_natural' | '2.2B_extension' | '2.3_length') => void;
}

export function MainServiceTechniqueStep({
  isRefill,
  isOnlyRemoval,
  serviceCategory,
  onSelectCategory,
  naturalTechnique,
  onSelectNaturalTechnique,
  extensionTechnique,
  onSelectExtensionTechnique,
  refillTechnique,
  onSelectRefillTechnique,
  selectedLength,
  onSelectLength,
  selectedShape,
  onSelectShape,
  subScreen2,
  setSubScreen2
}: MainServiceTechniqueStepProps) {

  // -------------------------------------------------------------
  // CASO ESPECIAL: RELLENO VALIDADO DESDE PASO 1
  // -------------------------------------------------------------
  if (isRefill) {
    const refillOptions: {
      id: RefillTechnique;
      title: string;
      subtitle: string;
      badge: string;
      specialistBadge: string;
    }[] = [
      {
        id: 'acrylic',
        title: 'Acrílico Tradicional',
        subtitle: 'Rebalance de ápice, relleno de crecimiento y reestructuración.',
        badge: '60 min',
        specialistBadge: 'Especialista en Acrílico'
      },
      {
        id: 'polygel',
        title: 'Polygel / Acrylgel',
        subtitle: 'Relleno con polímero híbrido ultraligero sin monómero.',
        badge: '60 min',
        specialistBadge: 'Especialista en Polygel'
      },
      {
        id: 'rubber_kapping',
        title: 'Rubber Base / Kapping',
        subtitle: 'Nivelación estructuradora para reforzar tu uña natural.',
        badge: '50 min',
        specialistBadge: 'Especialista en Manicura Combinada'
      }
    ];

    return (
      <div className="space-y-4 text-left w-full max-w-lg md:max-w-none mx-auto">
        {/* Banner informativo de procedencia */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
          <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Relleno validado en nuestro salón</span>
            <p className="text-[11.5px] leading-relaxed text-emerald-700 dark:text-emerald-300/90">
              Para asignar a la manicurista con la certificación exacta, confirma qué material tienes aplicado en tus uñas.
            </p>
          </div>
        </div>

        {/* Selector de Técnica para Relleno */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Técnica aplicada actualmente
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {refillOptions.map((opt) => {
              const isSelected = refillTechnique === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectRefillTechnique(opt.id);
                  }}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 outline-none active:scale-[0.99]",
                    isSelected
                      ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                      : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                  )}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {opt.title}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {opt.specialistBadge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {opt.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">
                      {opt.badge}
                    </span>
                    <div className={cn(
                      "size-5 rounded-full flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "border-2 border-muted-foreground/30 bg-background/50"
                    )}>
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Microcopy de prevención al pie */}
        <div className="p-3 rounded-2xl bg-secondary/30 border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            ✨ El diseño decorativo (francés, pedrería, mano alzada) lo elegirás en el siguiente paso.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // CASO ESPECIAL: SOLO RETIRO
  // -------------------------------------------------------------
  if (isOnlyRemoval) {
    return (
      <div className="space-y-4 text-left w-full max-w-lg md:max-w-none mx-auto">
        <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Scissors className="size-5.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Retiro Completo & Tratamiento Nutritivo
              </h3>
              <p className="text-xs text-muted-foreground">
                Retiro cuidadoso con torno de precisión para descansar y recuperar la salud de tu uña.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-secondary/40">
              <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Incluye</span>
              <span className="font-medium text-foreground">Manicura rusa en seco</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/40">
              <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Finalización</span>
              <span className="font-medium text-foreground">Base fortalecedora de queratina</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-secondary/30 border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            💡 En el siguiente paso podrás añadir extras de cabina como exfoliación orgánica o parafina térmica.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FLUJO COMPLETO: NUEVO SET / UÑA LIMPIA / CAMBIO DE SET
  // -------------------------------------------------------------
  return (
    <div className="space-y-4 text-left w-full max-w-lg md:max-w-none mx-auto">
      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* PANTALLA 2.1: GRAN CATEGORÍA (CARDS VISUALES)             */}
        {/* ========================================================= */}
        {subScreen2 === '2.1_category' && (
          <motion.div
            key="screen-2.1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Card 1: Sobre mi uña natural */}
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectCategory('natural');
                  setSubScreen2('2.2A_natural');
                }}
                className={cn(
                  "p-5 rounded-2xl sm:rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:min-h-[175px] outline-none group active:scale-[0.98]",
                  serviceCategory === 'natural'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="size-11 sm:size-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-2xs">
                    <Feather className="size-5.5 sm:size-6" />
                  </div>
                  <div className={cn(
                    "size-5 sm:size-5.5 rounded-full flex items-center justify-center transition-all",
                    serviceCategory === 'natural'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {serviceCategory === 'natural' && <Check className="size-3 sm:size-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                    Sobre mi uña natural
                  </h3>
                  <p className="text-xs sm:text-[12.5px] font-medium text-foreground/80 dark:text-zinc-200 leading-snug">
                    Mantener mi largo actual, dar fuerza o esmaltar con color.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-2 text-xs">
                  <span className="text-[10.5px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-foreground/75">
                    Sin alargar · Desde 40 min
                  </span>
                  <div className="flex items-center gap-1 text-primary font-bold text-xs">
                    <span>Elegir técnica</span>
                    <ArrowRight className="size-3 stroke-[2.5]" />
                  </div>
                </div>
              </button>

              {/* Card 2: Quiero alargar mis uñas (Extensiones) */}
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectCategory('extension');
                  setSubScreen2('2.2B_extension');
                }}
                className={cn(
                  "p-5 rounded-2xl sm:rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:min-h-[175px] outline-none group active:scale-[0.98]",
                  serviceCategory === 'extension'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="size-11 sm:size-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
                    <Gem className="size-5.5 sm:size-6" />
                  </div>
                  <div className={cn(
                    "size-5 sm:size-5.5 rounded-full flex items-center justify-center transition-all",
                    serviceCategory === 'extension'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {serviceCategory === 'extension' && <Check className="size-3 sm:size-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                    Quiero alargar mis uñas (Extensiones)
                  </h3>
                  <p className="text-xs sm:text-[12.5px] font-medium text-foreground/80 dark:text-zinc-200 leading-snug">
                    Añadir longitud con tips o molde escultural.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-2 text-xs">
                  <span className="text-[10.5px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-foreground/75">
                    Con extensión · Desde 60 min
                  </span>
                  <div className="flex items-center gap-1 text-primary font-bold text-xs">
                    <span>Elegir técnica</span>
                    <ArrowRight className="size-3 stroke-[2.5]" />
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* PANTALLA 2.2A: OPCIONES DE UÑA NATURAL                     */}
        {/* ========================================================= */}
        {subScreen2 === '2.2A_natural' && (
          <motion.div
            key="screen-2.2A"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            {/* Botón Volver a categorías */}
            <div className="flex items-center justify-between pb-0.5">
              <button
                type="button"
                onClick={() => setSubScreen2('2.1_category')}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="size-3.5" />
                <span>Volver a tipo de servicio</span>
              </button>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Uña Natural
              </span>
            </div>

            {/* 3 Tarjetas Horizontales con descripción funcional */}
            <div className="space-y-2.5">
              {/* Opción 1: Manicura Rusa / Clásica */}
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectNaturalTechnique('rusa');
                  onSelectLength('short');
                }}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-start justify-between gap-3.5 outline-none active:scale-[0.99]",
                  naturalTechnique === 'rusa'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Manicura Rusa / Clásica
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                      Sin color
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 dark:text-zinc-300 leading-normal">
                    Limpieza profunda de cutícula, corte, limado y exfoliación. Sin color o solo base protectora.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                    <span className="text-muted-foreground">~40 min</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-foreground font-bold">$380 MXN</span>
                  </div>
                </div>

                <div className={cn(
                  "size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all",
                  naturalTechnique === 'rusa'
                    ? "bg-primary text-white shadow-xs"
                    : "border-2 border-muted-foreground/30 bg-background/50"
                )}>
                  {naturalTechnique === 'rusa' && <Check className="size-3 stroke-[3]" />}
                </div>
              </button>

              {/* Opción 2: Esmaltado Semipermanente (Gel) */}
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectNaturalTechnique('gel_semi');
                  onSelectLength('short');
                }}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-start justify-between gap-3.5 outline-none active:scale-[0.99]",
                  naturalTechnique === 'gel_semi'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Esmaltado Semipermanente (Gel)
                    </span>
                    <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md">
                      Hasta 21 días
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 dark:text-zinc-300 leading-normal">
                    Color de larga duración directo sobre uña sana con secado en lámpara UV.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                    <span className="text-muted-foreground">~50-60 min</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-foreground font-bold">$450 MXN</span>
                  </div>
                </div>

                <div className={cn(
                  "size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all",
                  naturalTechnique === 'gel_semi'
                    ? "bg-primary text-white shadow-xs"
                    : "border-2 border-muted-foreground/30 bg-background/50"
                )}>
                  {naturalTechnique === 'gel_semi' && <Check className="size-3 stroke-[3]" />}
                </div>
              </button>

              {/* Opción 3: Nivelación con Rubber / Kapping */}
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectNaturalTechnique('rubber_kapping');
                  onSelectLength('short');
                }}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-start justify-between gap-3.5 outline-none active:scale-[0.99]",
                  naturalTechnique === 'rubber_kapping'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Nivelación con Rubber / Kapping
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Refuerzo & Ápice
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 dark:text-zinc-300 leading-normal">
                    Capa estructuradora que alinea la superficie, aporta grosor y evita que las uñas frágiles se rompan.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                    <span className="text-muted-foreground">~70-80 min</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-foreground font-bold">$520 MXN</span>
                  </div>
                </div>

                <div className={cn(
                  "size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all",
                  naturalTechnique === 'rubber_kapping'
                    ? "bg-primary text-white shadow-xs"
                    : "border-2 border-muted-foreground/30 bg-background/50"
                )}>
                  {naturalTechnique === 'rubber_kapping' && <Check className="size-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* PANTALLA 2.2B: OPCIONES DE EXTENSIÓN                       */}
        {/* ========================================================= */}
        {subScreen2 === '2.2B_extension' && (
          <motion.div
            key="screen-2.2B"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            {/* Botón Volver a categorías */}
            <div className="flex items-center justify-between pb-0.5">
              <button
                type="button"
                onClick={() => setSubScreen2('2.1_category')}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="size-3.5" />
                <span>Volver a tipo de servicio</span>
              </button>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Extensiones Nuevas
              </span>
            </div>

            {/* 3 Opciones de técnica con etiquetas de beneficios */}
            <div className="space-y-2.5">
              {/* Opción 1: Soft Gel / Gel-X */}
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectExtensionTechnique('soft_gel');
                  setSubScreen2('2.3_length');
                }}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-start justify-between gap-3.5 outline-none active:scale-[0.99]",
                  extensionTechnique === 'soft_gel'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Soft Gel / Press-on Gel (Gel-X)
                    </span>
                    <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md">
                      Técnica Rápida
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 dark:text-zinc-300 leading-normal">
                    Rápido, flexible y ligero. Ideal si buscas acabado natural sin limado pesado.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                    <span className="text-muted-foreground">~60-75 min</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-foreground font-bold">$580 MXN</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <div className={cn(
                    "size-5 rounded-full flex items-center justify-center transition-all",
                    extensionTechnique === 'soft_gel'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {extensionTechnique === 'soft_gel' && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground/60" />
                </div>
              </button>

              {/* Opción 2: Acrílico Tradicional */}
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectExtensionTechnique('acrylic');
                  setSubScreen2('2.3_length');
                }}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-start justify-between gap-3.5 outline-none active:scale-[0.99]",
                  extensionTechnique === 'acrylic'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Acrílico Escultural / Tips
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                      Máxima Resistencia
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 dark:text-zinc-300 leading-normal">
                    Máxima resistencia y durabilidad. La técnica clásica recomendada para cualquier tipo de largo.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                    <span className="text-muted-foreground">~90-120 min</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-foreground font-bold">$650 MXN</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <div className={cn(
                    "size-5 rounded-full flex items-center justify-center transition-all",
                    extensionTechnique === 'acrylic'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {extensionTechnique === 'acrylic' && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground/60" />
                </div>
              </button>

              {/* Opción 3: Polygel */}
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  onSelectExtensionTechnique('polygel');
                  setSubScreen2('2.3_length');
                }}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-start justify-between gap-3.5 outline-none active:scale-[0.99]",
                  extensionTechnique === 'polygel'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Polygel / Acrylgel
                    </span>
                    <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                      Híbrido Ligero
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 dark:text-zinc-300 leading-normal">
                    Resistencia similar al acrílico pero sin olor a monómero y significativamente más liviano.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                    <span className="text-muted-foreground">~90-110 min</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-foreground font-bold">$680 MXN</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <div className={cn(
                    "size-5 rounded-full flex items-center justify-center transition-all",
                    extensionTechnique === 'polygel'
                      ? "bg-primary text-white shadow-xs"
                      : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {extensionTechnique === 'polygel' && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground/60" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* PANTALLA 2.3: SELECTOR DE LARGO (OBLIGATORIO PARA EXTENSIÓN) */}
        {/* ========================================================= */}
        {subScreen2 === '2.3_length' && (
          <motion.div
            key="screen-2.3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            {/* Header del selector de largo */}
            <div className="flex items-center justify-between pb-0.5">
              <button
                type="button"
                onClick={() => setSubScreen2('2.2B_extension')}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="size-3.5" />
                <span>Cambiar técnica</span>
              </button>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Multiplicador de Tiempo
              </span>
            </div>

            {/* Selector Gráfico Horizontal de Largo (S / M / L-XL) */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {/* [ S - Corto ] */}
                <button
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectLength('short');
                  }}
                  className={cn(
                    "p-3 rounded-2xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-between min-h-[145px] outline-none group active:scale-[0.98]",
                    selectedLength === 'short'
                      ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                      : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                  )}
                >
                  <div className="w-full flex justify-end">
                    <div className={cn(
                      "size-4 rounded-full flex items-center justify-center transition-all",
                      selectedLength === 'short' ? "bg-primary text-white" : "border border-muted-foreground/30"
                    )}>
                      {selectedLength === 'short' && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Silueta SVG ilustrada Corto */}
                  <div className="my-1 flex items-center justify-center">
                    <svg className="w-8 h-12 text-primary" viewBox="0 0 32 48" fill="none">
                      <rect x="7" y="16" width="18" height="24" rx="4" className="fill-secondary/60 stroke-border" strokeWidth="1.5" />
                      <path d="M7 18 C7 10 25 10 25 18" className={cn("transition-colors", selectedLength === 'short' ? "stroke-primary fill-primary/30" : "stroke-muted-foreground fill-transparent")} strokeWidth="2" />
                    </svg>
                  </div>

                  <div>
                    <span className="text-xs sm:text-sm font-bold block text-foreground">
                      S · Corto
                    </span>
                    <span className="text-[10px] text-foreground/80 dark:text-zinc-300 font-medium block mt-0.5 line-clamp-1">
                      Hasta 3 mm · Nº 1-2
                    </span>
                  </div>

                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1",
                    selectedLength === 'short' ? "bg-primary/20 text-primary font-bold" : "bg-secondary text-muted-foreground"
                  )}>
                    +0 min · $0
                  </span>
                </button>

                {/* [ M - Medio ] */}
                <button
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectLength('medium');
                  }}
                  className={cn(
                    "p-3 rounded-2xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-between min-h-[145px] outline-none group active:scale-[0.98]",
                    selectedLength === 'medium'
                      ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                      : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                  )}
                >
                  <div className="w-full flex justify-end">
                    <div className={cn(
                      "size-4 rounded-full flex items-center justify-center transition-all",
                      selectedLength === 'medium' ? "bg-primary text-white" : "border border-muted-foreground/30"
                    )}>
                      {selectedLength === 'medium' && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Silueta SVG ilustrada Medio */}
                  <div className="my-1 flex items-center justify-center">
                    <svg className="w-8 h-12 text-primary" viewBox="0 0 32 48" fill="none">
                      <rect x="7" y="20" width="18" height="24" rx="4" className="fill-secondary/60 stroke-border" strokeWidth="1.5" />
                      <path d="M7 20 C7 8 25 8 25 20" className={cn("transition-colors", selectedLength === 'medium' ? "stroke-primary fill-primary/30" : "stroke-muted-foreground fill-transparent")} strokeWidth="2" />
                    </svg>
                  </div>

                  <div>
                    <span className="text-xs sm:text-sm font-bold block text-foreground">
                      M · Medio
                    </span>
                    <span className="text-[10px] text-foreground/80 dark:text-zinc-300 font-medium block mt-0.5 line-clamp-1">
                      0.5 a 1 cm · Nº 3-4
                    </span>
                  </div>

                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1",
                    selectedLength === 'medium' ? "bg-primary/20 text-primary font-bold" : "bg-secondary text-muted-foreground"
                  )}>
                    +15 min · +$60
                  </span>
                </button>

                {/* [ L / XL - Largo ] */}
                <button
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectLength('long');
                  }}
                  className={cn(
                    "p-3 rounded-2xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-between min-h-[145px] outline-none group active:scale-[0.98]",
                    (selectedLength === 'long' || selectedLength === 'xl')
                      ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                      : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                  )}
                >
                  <div className="w-full flex justify-end">
                    <div className={cn(
                      "size-4 rounded-full flex items-center justify-center transition-all",
                      (selectedLength === 'long' || selectedLength === 'xl') ? "bg-primary text-white" : "border border-muted-foreground/30"
                    )}>
                      {(selectedLength === 'long' || selectedLength === 'xl') && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Silueta SVG ilustrada Largo */}
                  <div className="my-1 flex items-center justify-center">
                    <svg className="w-8 h-12 text-primary" viewBox="0 0 32 48" fill="none">
                      <rect x="7" y="24" width="18" height="20" rx="4" className="fill-secondary/60 stroke-border" strokeWidth="1.5" />
                      <path d="M7 24 C7 4 25 4 25 24" className={cn("transition-colors", (selectedLength === 'long' || selectedLength === 'xl') ? "stroke-primary fill-primary/30" : "stroke-muted-foreground fill-transparent")} strokeWidth="2" />
                    </svg>
                  </div>

                  <div>
                    <span className="text-xs sm:text-sm font-bold block text-foreground">
                      L / XL · Largo
                    </span>
                    <span className="text-[10px] text-foreground/80 dark:text-zinc-300 font-medium block mt-0.5 line-clamp-1">
                      Más de 1 cm · Nº 5+
                    </span>
                  </div>

                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1",
                    (selectedLength === 'long' || selectedLength === 'xl') ? "bg-primary/20 text-primary font-bold" : "bg-secondary text-muted-foreground"
                  )}>
                    +30 min · +$120
                  </span>
                </button>
              </div>
            </div>

            {/* Aviso Sincero sobre el largo (Microcopy de prevención de fricción) */}
            <div className="p-3 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11.5px] leading-relaxed">
                <strong>Consejo de cabina:</strong> Si estás indecisa entre dos largos, elige el mayor. Si limamos de más en cabina no pasa nada, pero si nos falta tiempo por agendar un largo menor, no podremos terminar el diseño.
              </p>
            </div>

            {/* Selector opcional de Punta / Silueta */}
            <div className="space-y-2 pt-1 border-t border-border/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Silueta de Punta (Opcional)
                </label>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Ayuda a preparar tus limas
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'almond', label: 'Almendra' },
                  { id: 'square', label: 'Cuadrada' },
                  { id: 'coffin', label: 'Coffin' },
                  { id: 'stiletto', label: 'Stiletto' },
                ].map((sh) => {
                  const isShSelected = selectedShape === sh.id;
                  return (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => {
                        triggerSelectionVibration();
                        onSelectShape(sh.id as NailShapeOption);
                      }}
                      className={cn(
                        "py-2 px-1.5 rounded-xl border text-center transition-all text-xs cursor-pointer",
                        isShSelected
                          ? "bg-primary/10 border-primary text-primary font-bold shadow-2xs"
                          : "bg-card text-foreground/80 border-border/70 hover:bg-secondary/40"
                      )}
                    >
                      {sh.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Microcopy de prevención fijo al pie del Paso 2 */}
      <div className="p-3 rounded-2xl bg-secondary/30 border border-border/50 text-center">
        <p className="text-xs text-muted-foreground leading-normal">
          ✨ <strong>Nota:</strong> El diseño decorativo (francés, pedrería, mano alzada) lo elegirás en el siguiente paso.
        </p>
      </div>
    </div>
  );
}
