import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft,
  Gem, Feather, Clock, Scissors,
  Layers, AlertCircle, Info, Calendar
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerSelectionVibration } from '@/shared/utils/haptics';
import { useApp } from '@/app/AppContext';

export type ServiceCategoryOption = 'natural' | 'extension';
export type NaturalTechniqueOption = 'rusa' | 'gel_semi' | 'rubber_kapping';
export type ExtensionTechniqueOption = 'soft_gel' | 'acrylic' | 'polygel';
export type NailLengthSelection = 'short' | 'medium' | 'long';
export type NailTipShape = 'almond' | 'square' | 'coffin' | 'stiletto';

export interface ServiceSelectionDetails {
  category: ServiceCategoryOption;
  techniqueId: string;
  techniqueName: string;
  length?: NailLengthSelection;
  lengthLabel?: string;
  shape?: NailTipShape;
  baseDurationMinutes: number;
  addedDurationMinutes: number;
  totalDurationMinutes: number;
  basePriceMXN: number;
  addedPriceMXN: number;
  totalPriceMXN: number;
}

export interface OnboardingStepServiceProps {
  selectedService?: string;
  selectedCategory?: ServiceCategoryOption;
  selectedLength?: NailLengthSelection;
  initialSubScreen?: 'category' | 'natural_technique' | 'extension_technique' | 'length_selection';
  onSelect?: (
    serviceName: string, 
    category: ServiceCategoryOption, 
    details: ServiceSelectionDetails
  ) => void;
  onNext?: () => void;
  onBack?: () => void;
  className?: string;
}

export function OnboardingStepService({
  selectedService: propSelectedService,
  selectedCategory: propCategory,
  selectedLength: propLength,
  initialSubScreen,
  onSelect,
  onNext,
  onBack,
  className
}: OnboardingStepServiceProps) {
  const { userStyleProfile, updateUserStyleProfile } = useApp();

  // 1. Determinar categoría inicial
  const initialCat: ServiceCategoryOption = (() => {
    if (propCategory) return propCategory;
    if (userStyleProfile?.goal === 'natural_care') return 'natural';
    if (userStyleProfile?.goal === 'extensions') return 'extension';
    if (propSelectedService) {
      const lower = propSelectedService.toLowerCase();
      if (lower.includes('rusa') || lower.includes('rubber') || lower.includes('semi') || lower.includes('natural')) {
        return 'natural';
      }
    }
    return 'extension';
  })();

  const [category, setCategory] = useState<ServiceCategoryOption>(initialCat);

  // 2. Determinar técnica inicial
  const [naturalTech, setNaturalTech] = useState<NaturalTechniqueOption>(() => {
    if (propSelectedService?.toLowerCase().includes('rusa')) return 'rusa';
    if (propSelectedService?.toLowerCase().includes('gel') && !propSelectedService?.toLowerCase().includes('soft')) return 'gel_semi';
    return 'rubber_kapping';
  });

  const [extensionTech, setExtensionTech] = useState<ExtensionTechniqueOption>(() => {
    if (propSelectedService?.toLowerCase().includes('acrílico') || propSelectedService?.toLowerCase().includes('acrilico')) return 'acrylic';
    if (propSelectedService?.toLowerCase().includes('polygel')) return 'polygel';
    return 'soft_gel';
  });

  // 3. Determinar largo inicial
  const [nailLength, setNailLength] = useState<NailLengthSelection>(() => {
    if (propLength) return propLength;
    const globalLen = userStyleProfile?.length?.toLowerCase();
    if (globalLen?.includes('corto') || globalLen?.includes('short')) return 'short';
    if (globalLen?.includes('largo') || globalLen?.includes('long')) return 'long';
    return 'medium';
  });

  // 4. Silueta de punta opcional
  const [tipShape, setTipShape] = useState<NailTipShape>(() => {
    const globalShape = userStyleProfile?.shape?.toLowerCase();
    if (globalShape?.includes('cuadrada') || globalShape?.includes('square')) return 'square';
    if (globalShape?.includes('coffin')) return 'coffin';
    if (globalShape?.includes('stiletto')) return 'stiletto';
    return 'almond';
  });

  // 5. Control de subpantallas dentro del Paso 2
  const [subScreen, setSubScreen] = useState<'category' | 'natural_technique' | 'extension_technique' | 'length_selection'>(() => {
    if (initialSubScreen) return initialSubScreen;
    if (propCategory === 'extension') return 'length_selection';
    return 'category';
  });

  // Catálogo de opciones de Uña Natural
  const naturalOptions: {
    id: NaturalTechniqueOption;
    title: string;
    subtitle: string;
    badge: string;
    duration: number;
    price: number;
  }[] = [
    {
      id: 'rusa',
      title: 'Manicura Rusa / Clásica',
      subtitle: 'Limpieza profunda de cutícula, corte, limado y exfoliación. Sin color o solo base protectora.',
      badge: 'Sin color',
      duration: 40,
      price: 380
    },
    {
      id: 'gel_semi',
      title: 'Esmaltado Semipermanente (Gel)',
      subtitle: 'Color de larga duración directo sobre uña sana con secado en lámpara UV.',
      badge: 'Hasta 21 días',
      duration: 55,
      price: 450
    },
    {
      id: 'rubber_kapping',
      title: 'Nivelación con Rubber / Kapping',
      subtitle: 'Capa estructuradora que alinea la superficie, aporta grosor y evita que las uñas frágiles se rompan.',
      badge: 'Refuerzo & Ápice',
      duration: 75,
      price: 520
    }
  ];

  // Catálogo de opciones de Extensiones
  const extensionOptions: {
    id: ExtensionTechniqueOption;
    title: string;
    subtitle: string;
    badge: string;
    duration: number;
    price: number;
  }[] = [
    {
      id: 'soft_gel',
      title: 'Soft Gel / Press-on Gel (Gel-X)',
      subtitle: 'Rápido, flexible y ligero. Ideal si buscas acabado natural sin limado pesado.',
      badge: 'Técnica Rápida',
      duration: 65,
      price: 580
    },
    {
      id: 'acrylic',
      title: 'Acrílico Escultural / Tips',
      subtitle: 'Máxima resistencia y durabilidad. La técnica clásica recomendada para cualquier tipo de largo.',
      badge: 'Máxima Resistencia',
      duration: 100,
      price: 650
    },
    {
      id: 'polygel',
      title: 'Polygel / Acrylgel',
      subtitle: 'Resistencia similar al acrílico pero sin olor a monómero y significativamente más liviano.',
      badge: 'Híbrido Ligero',
      duration: 95,
      price: 680
    }
  ];

  // Catálogo del Selector Gráfico Horizontal de Largo (Corto, Medio, Largo/XL)
  const lengthOptions: {
    id: NailLengthSelection;
    label: string;
    tag: string;
    mm: string;
    moldNumber: string;
    description: string;
    addedMinutes: number;
    addedPrice: number;
  }[] = [
    {
      id: 'short',
      label: 'S · Corto',
      tag: 'Corto',
      mm: 'Hasta 3 mm fuera de la yema',
      moldNumber: 'Nº 1-2 en molde',
      description: 'Sobresale sutilmente de la yema. Ideal para trabajo en oficina o primera vez.',
      addedMinutes: 0,
      addedPrice: 0
    },
    {
      id: 'medium',
      label: 'M · Medio',
      tag: 'Medio',
      mm: 'Aprox. 0.5 a 1 cm fuera de la yema',
      moldNumber: 'Nº 3-4 en molde',
      description: 'El largo favorito: estiliza las manos y permite cualquier silueta con comodidad.',
      addedMinutes: 15,
      addedPrice: 60
    },
    {
      id: 'long',
      label: 'L / XL · Largo',
      tag: 'Largo / XL',
      mm: 'Más de 1 cm fuera de la yema',
      moldNumber: 'Nº 5+ en molde',
      description: 'Largo dramático de alto impacto. Requiere estructura reforzada y limado preciso.',
      addedMinutes: 30,
      addedPrice: 120
    }
  ];

  // Siluetas de punta opcionales
  const shapeOptions: { id: NailTipShape; label: string }[] = [
    { id: 'almond', label: 'Almendra' },
    { id: 'square', label: 'Cuadrada' },
    { id: 'coffin', label: 'Coffin' },
    { id: 'stiletto', label: 'Stiletto' }
  ];

  // Obtener técnica actual seleccionada
  const currentExtObj = extensionOptions.find(o => o.id === extensionTech) || extensionOptions[0];
  const currentNatObj = naturalOptions.find(o => o.id === naturalTech) || naturalOptions[2];
  const currentLenObj = lengthOptions.find(l => l.id === nailLength) || lengthOptions[1];

  // Cálculo dinámico del tiempo de reserva ajustado
  const calculatedTotalMinutes = category === 'extension'
    ? currentExtObj.duration + currentLenObj.addedMinutes
    : currentNatObj.duration;

  const calculatedTotalPrice = category === 'extension'
    ? currentExtObj.price + currentLenObj.addedPrice
    : currentNatObj.price;

  // Sincronización en tiempo real con el estado global de la app
  const syncWithGlobalState = (
    currentCat: ServiceCategoryOption,
    currentTechId: string,
    currentLen: NailLengthSelection,
    currentShape: NailTipShape
  ) => {
    let serviceName = '';
    let baseDur = 0;
    let addedDur = 0;
    let baseP = 0;
    let addedP = 0;
    let lengthLabel = undefined;

    if (currentCat === 'natural') {
      const selected = naturalOptions.find(o => o.id === currentTechId) || naturalOptions[2];
      serviceName = selected.title;
      baseDur = selected.duration;
      baseP = selected.price;
    } else {
      const selected = extensionOptions.find(o => o.id === currentTechId) || extensionOptions[0];
      const lenObj = lengthOptions.find(l => l.id === currentLen) || lengthOptions[1];
      serviceName = `Extensiones ${selected.title.split('/')[0].trim()} (${lenObj.tag})`;
      baseDur = selected.duration;
      addedDur = lenObj.addedMinutes;
      baseP = selected.price;
      addedP = lenObj.addedPrice;
      lengthLabel = lenObj.label;
    }

    const totalDur = baseDur + addedDur;
    const totalP = baseP + addedP;

    // 1. Actualizar perfil global en AppContext
    updateUserStyleProfile({
      goal: currentCat === 'natural' ? 'natural_care' : 'extensions',
      specificService: serviceName,
      length: currentCat === 'extension' ? (lengthLabel || 'Medio') : 'Natural',
      shape: currentCat === 'extension' ? (currentShape === 'almond' ? 'Almendra' : currentShape === 'square' ? 'Cuadrada' : currentShape === 'coffin' ? 'Coffin' : 'Stiletto') : 'Squoval',
      lastUpdated: new Date().toISOString()
    });

    // 2. Notificar al listener externo si fue provisto
    if (onSelect) {
      onSelect(serviceName, currentCat, {
        category: currentCat,
        techniqueId: currentTechId,
        techniqueName: serviceName,
        length: currentCat === 'extension' ? currentLen : undefined,
        lengthLabel,
        shape: currentCat === 'extension' ? currentShape : undefined,
        baseDurationMinutes: baseDur,
        addedDurationMinutes: addedDur,
        totalDurationMinutes: totalDur,
        basePriceMXN: baseP,
        addedPriceMXN: addedP,
        totalPriceMXN: totalP
      });
    }
  };

  // Manejar selección de categoría (2.1)
  const handleSelectCategory = (newCat: ServiceCategoryOption) => {
    triggerSelectionVibration();
    setCategory(newCat);
    if (newCat === 'natural') {
      setSubScreen('natural_technique');
      syncWithGlobalState('natural', naturalTech, nailLength, tipShape);
    } else {
      setSubScreen('extension_technique');
      syncWithGlobalState('extension', extensionTech, nailLength, tipShape);
    }
  };

  // Manejar selección de técnica de extensión (2.2B)
  const handleSelectExtensionTechnique = (techId: ExtensionTechniqueOption) => {
    triggerSelectionVibration();
    setExtensionTech(techId);
    syncWithGlobalState('extension', techId, nailLength, tipShape);
    // Transición directa al selector de largo
    setSubScreen('length_selection');
  };

  // Manejar ajuste de largo en el selector gráfico horizontal (2.3)
  const handleSelectLength = (lenId: NailLengthSelection) => {
    triggerSelectionVibration();
    setNailLength(lenId);
    syncWithGlobalState('extension', extensionTech, lenId, tipShape);
  };

  // Manejar selección de silueta de punta opcional
  const handleSelectShape = (shapeId: NailTipShape) => {
    triggerSelectionVibration();
    setTipShape(shapeId);
    syncWithGlobalState('extension', extensionTech, nailLength, shapeId);
  };

  return (
    <div className={cn("w-full max-w-lg md:max-w-none mx-auto space-y-4 text-left", className)}>
      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* PANTALLA 2.1: GRAN CATEGORÍA                              */}
        {/* ========================================================= */}
        {subScreen === 'category' && (
          <motion.div
            key="screen-2.1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Elige el tipo de servicio
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                ¿Deseas mantener tu longitud actual o añadir largo con extensiones?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Card 1: Sobre mi uña natural */}
              <button
                type="button"
                onClick={() => handleSelectCategory('natural')}
                className={cn(
                  "p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[155px] outline-none group active:scale-[0.98]",
                  category === 'natural'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="size-11 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-2xs">
                    <Feather className="size-5.5" />
                  </div>
                  <div className={cn(
                    "size-5 rounded-full flex items-center justify-center transition-all",
                    category === 'natural' ? "bg-primary text-white shadow-xs" : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {category === 'natural' && <Check className="size-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                    Sobre mi uña natural
                  </h4>
                  <p className="text-xs font-medium text-foreground/80 dark:text-zinc-200 leading-snug">
                    Mantener mi largo actual, dar fuerza o esmaltar con color.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-2 text-xs">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-foreground/75">
                    Sin alargar · Desde 40 min
                  </span>
                  <div className="flex items-center gap-1 text-primary font-bold text-xs">
                    <span>Elegir</span>
                    <ArrowRight className="size-3 stroke-[2.5]" />
                  </div>
                </div>
              </button>

              {/* Card 2: Quiero alargar mis uñas (Extensiones) */}
              <button
                type="button"
                onClick={() => handleSelectCategory('extension')}
                className={cn(
                  "p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[155px] outline-none group active:scale-[0.98]",
                  category === 'extension'
                    ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                    : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="size-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
                    <Gem className="size-5.5" />
                  </div>
                  <div className={cn(
                    "size-5 rounded-full flex items-center justify-center transition-all",
                    category === 'extension' ? "bg-primary text-white shadow-xs" : "border-2 border-muted-foreground/30 bg-background/50"
                  )}>
                    {category === 'extension' && <Check className="size-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                    Quiero alargar mis uñas (Extensiones)
                  </h4>
                  <p className="text-xs font-medium text-foreground/80 dark:text-zinc-200 leading-snug">
                    Añadir longitud con tips o molde escultural.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-2 text-xs">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-foreground/75">
                    Con extensión · Desde 60 min
                  </span>
                  <div className="flex items-center gap-1 text-primary font-bold text-xs">
                    <span>Elegir</span>
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
        {subScreen === 'natural_technique' && (
          <motion.div
            key="screen-2.2A"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setSubScreen('category')}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="size-3.5" />
                <span>Volver a tipo de servicio</span>
              </button>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Uña Natural
              </span>
            </div>

            <div className="space-y-2.5">
              {naturalOptions.map((opt) => {
                const isSelected = naturalTech === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      setNaturalTech(opt.id);
                      syncWithGlobalState('natural', opt.id, nailLength, tipShape);
                    }}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-start justify-between gap-3.5 outline-none active:scale-[0.99]",
                      isSelected
                        ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                        : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                    )}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {opt.title}
                        </span>
                        <span className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-md",
                          isSelected ? "bg-primary/20 text-primary font-bold" : "bg-secondary text-muted-foreground"
                        )}>
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80 dark:text-zinc-300 font-medium leading-normal">
                        {opt.subtitle}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                        <span className="text-muted-foreground">~{opt.duration} min</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-foreground font-bold">${opt.price} MXN</span>
                      </div>
                    </div>

                    <div className={cn(
                      "size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all",
                      isSelected ? "bg-primary text-white shadow-xs" : "border-2 border-muted-foreground/30 bg-background/50"
                    )}>
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {onNext && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNext}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Continuar con {currentNatObj.title} (~{currentNatObj.duration} min)</span>
                  <ArrowRight className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* PANTALLA 2.2B: SELECCIÓN DE TÉCNICA DE EXTENSIÓN           */}
        {/* ========================================================= */}
        {subScreen === 'extension_technique' && (
          <motion.div
            key="screen-2.2B"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setSubScreen('category')}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="size-3.5" />
                <span>Volver a tipo de servicio</span>
              </button>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Técnica de Extensión
              </span>
            </div>

            <div className="space-y-2.5">
              {extensionOptions.map((opt) => {
                const isSelected = extensionTech === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectExtensionTechnique(opt.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-start justify-between gap-3.5 outline-none active:scale-[0.99]",
                      isSelected
                        ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                        : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                    )}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {opt.title}
                        </span>
                        <span className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-md",
                          isSelected ? "bg-primary/20 text-primary font-bold" : "bg-secondary text-muted-foreground"
                        )}>
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80 dark:text-zinc-300 font-medium leading-normal">
                        {opt.subtitle}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                        <span className="text-muted-foreground">~{opt.duration} min base</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-foreground font-bold">${opt.price} MXN</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      <div className={cn(
                        "size-5 rounded-full flex items-center justify-center transition-all",
                        isSelected ? "bg-primary text-white shadow-xs" : "border-2 border-muted-foreground/30 bg-background/50"
                      )}>
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <ArrowRight className="size-3.5 text-muted-foreground/60" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* PANTALLA 2.3: SELECTOR GRÁFICO HORIZONTAL DE LARGO (AJUSTE DE TIEMPO)     */}
        {/* ========================================================================= */}
        {subScreen === 'length_selection' && (
          <motion.div
            key="screen-2.3-length"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            {/* Header de navegación superior */}
            <div className="flex items-center justify-between pb-0.5">
              <button
                type="button"
                onClick={() => setSubScreen('extension_technique')}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="size-3.5" />
                <span>Cambiar técnica ({currentExtObj.title.split('/')[0].trim()})</span>
              </button>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Multiplicador de Tiempo
              </span>
            </div>

            {/* Banner Dinámico del Tiempo de Reserva Calculado */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-primary/[0.08] via-card to-card border border-primary/20 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                  <Clock className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                      Tiempo Total de Cita
                    </span>
                    {currentLenObj.addedMinutes > 0 && (
                      <span className="text-[10.5px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
                        +{currentLenObj.addedMinutes} min por largo
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-foreground">
                      ~{calculatedTotalMinutes} min
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      · ${calculatedTotalPrice} MXN
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-muted-foreground block font-medium">Técnica base: {currentExtObj.duration} min</span>
                <span className="text-[10px] text-primary font-bold block">Largo {currentLenObj.tag}: +{currentLenObj.addedMinutes} min</span>
              </div>
            </div>

            {/* Selector Gráfico Horizontal de Largo (S / M / L-XL) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  ¿Qué largo deseas para tus extensiones?
                </label>
                <span className="text-xs font-bold text-primary">
                  {currentLenObj.label}
                </span>
              </div>

              {/* 3 Siluetas gráficas horizontales interactivas */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {lengthOptions.map((len) => {
                  const isLenSelected = nailLength === len.id;
                  return (
                    <button
                      key={len.id}
                      type="button"
                      onClick={() => handleSelectLength(len.id)}
                      className={cn(
                        "p-3 rounded-2xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-between min-h-[155px] outline-none group active:scale-[0.98]",
                        isLenSelected
                          ? "bg-primary/[0.08] dark:bg-primary/[0.16] border-2 border-primary ring-2 ring-primary/25 shadow-md shadow-primary/10"
                          : "bg-card/80 border border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/30"
                      )}
                    >
                      {/* Checkbox circular superior */}
                      <div className="w-full flex justify-end">
                        <div className={cn(
                          "size-4 rounded-full flex items-center justify-center transition-all",
                          isLenSelected ? "bg-primary text-white" : "border border-muted-foreground/30"
                        )}>
                          {isLenSelected && <Check className="size-2.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Silueta SVG vectorial de largo de uña */}
                      <div className="my-1.5 flex items-center justify-center">
                        <svg className="w-9 h-13 text-primary transition-all duration-200" viewBox="0 0 32 48" fill="none">
                          {len.id === 'short' && (
                            <>
                              {/* Lecho ungueal */}
                              <rect x="7" y="18" width="18" height="22" rx="4" className="fill-secondary/60 stroke-border" strokeWidth="1.5" />
                              {/* Borde libre Corto (<= 3mm) */}
                              <path 
                                d="M7 18 C7 11 25 11 25 18" 
                                className={cn(
                                  "transition-all duration-200", 
                                  isLenSelected ? "stroke-primary fill-primary/30 stroke-[2.5]" : "stroke-muted-foreground fill-transparent stroke-[1.75]"
                                )} 
                              />
                            </>
                          )}
                          {len.id === 'medium' && (
                            <>
                              {/* Lecho ungueal */}
                              <rect x="7" y="21" width="18" height="20" rx="4" className="fill-secondary/60 stroke-border" strokeWidth="1.5" />
                              {/* Borde libre Medio (0.5 a 1 cm) */}
                              <path 
                                d="M7 21 C7 8 25 8 25 21" 
                                className={cn(
                                  "transition-all duration-200", 
                                  isLenSelected ? "stroke-primary fill-primary/30 stroke-[2.5]" : "stroke-muted-foreground fill-transparent stroke-[1.75]"
                                )} 
                              />
                            </>
                          )}
                          {len.id === 'long' && (
                            <>
                              {/* Lecho ungueal */}
                              <rect x="7" y="25" width="18" height="17" rx="4" className="fill-secondary/60 stroke-border" strokeWidth="1.5" />
                              {/* Borde libre Largo (> 1 cm) */}
                              <path 
                                d="M7 25 C7 4 25 4 25 25" 
                                className={cn(
                                  "transition-all duration-200", 
                                  isLenSelected ? "stroke-primary fill-primary/30 stroke-[2.5]" : "stroke-muted-foreground fill-transparent stroke-[1.75]"
                                )} 
                              />
                            </>
                          )}
                        </svg>
                      </div>

                      {/* Nombre y dimensiones */}
                      <div>
                        <span className="text-xs sm:text-sm font-bold block text-foreground leading-tight">
                          {len.label}
                        </span>
                        <span className="text-[10px] text-foreground/80 dark:text-zinc-300 font-medium block mt-0.5 line-clamp-1">
                          {len.moldNumber}
                        </span>
                        <span className="text-[9.5px] text-muted-foreground block line-clamp-1">
                          {len.id === 'short' ? 'Hasta 3 mm' : len.id === 'medium' ? '0.5 - 1 cm' : '> 1 cm'}
                        </span>
                      </div>

                      {/* Pastilla con tiempo adicional y costo */}
                      <span className={cn(
                        "text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-1.5 transition-colors",
                        isLenSelected ? "bg-primary/20 text-primary font-bold" : "bg-secondary text-muted-foreground"
                      )}>
                        {len.addedMinutes > 0 ? `+${len.addedMinutes} min · +$${len.addedPrice}` : '+0 min · $0'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Aviso preventivo de cabina */}
              <div className="p-3 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11.5px] leading-relaxed">
                  <strong>Consejo de cabina:</strong> Si estás indecisa entre dos largos, elige el mayor. Si limamos de más en cabina no pasa nada, pero si falta tiempo por agendar un largo menor, no podremos terminar el diseño.
                </p>
              </div>
            </div>

            {/* Selector opcional de Punta / Silueta */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Silueta de Punta (Opcional)
                </label>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Ayuda a preparar tus limas
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {shapeOptions.map((sh) => {
                  const isShSelected = tipShape === sh.id;
                  return (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => handleSelectShape(sh.id)}
                      className={cn(
                        "py-2 px-1.5 rounded-xl border text-center transition-all text-xs cursor-pointer active:scale-95",
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

            {/* Botón de Confirmación para avanzar al Paso 3 */}
            {onNext && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNext}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Continuar con largo {currentLenObj.tag} (~{calculatedTotalMinutes} min)</span>
                  <ArrowRight className="size-3.5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Microcopy de prevención fijo al pie del Paso 2 */}
      <div className="p-3 rounded-2xl bg-secondary/30 border border-border/50 text-center">
        <p className="text-xs text-muted-foreground leading-normal font-medium">
          ✨ <strong>Nota:</strong> El diseño decorativo (francés, pedrería, mano alzada) lo elegirás en el Paso 3.
        </p>
      </div>
    </div>
  );
}

export default OnboardingStepService;
