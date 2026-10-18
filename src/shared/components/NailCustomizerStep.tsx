import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Gem, 
  Leaf, 
  Check, 
  Sparkle
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerSelectionVibration, triggerStepVibration } from '@/shared/utils/haptics';
import { 
  NailShapeType, 
  NailLengthType, 
  NailFinishType, 
  FINISH_COLOR_PALETTES,
  SingleNailMiniPreviewSVG
} from '@/shared/components/NailModelerVisualizerSVG';

export interface NailCustomizerStepHandle {
  goToPreviousStep: () => boolean;
}

export interface NailCustomizerStepProps {
  shape?: NailShapeType;
  selectedShape?: NailShapeType;
  onSelectShape: (shape: NailShapeType) => void;
  length?: NailLengthType;
  selectedLength?: NailLengthType;
  onSelectLength: (length: NailLengthType) => void;
  selectedFinish: NailFinishType;
  onSelectFinish: (finish: NailFinishType) => void;
  selectedColorHex: string;
  selectedColorName: string;
  selectedTipHex?: string;
  onSelectColor: (colorHex: string, colorName: string, tipHex?: string) => void;
  selectedExtras: string[];
  onToggleExtra: (extraId: string) => void;
  onProceedToNextStep?: () => void;
  onContinueToSchedule?: () => void;
  onGoToPreviousStep?: () => void;
  onBackToPreviousStep?: () => void;
  onBack?: () => void;
  isExtension?: boolean;
}

// 1. FORMA DE UÑA (Píldoras)
const SHAPE_PILLS: { id: NailShapeType; label: string }[] = [
  { id: 'almond', label: 'Almendra' },
  { id: 'square', label: 'Cuadrada' },
  { id: 'coffin', label: 'Coffin' },
  { id: 'stiletto', label: 'Stiletto' },
  { id: 'squoval', label: 'Squoval' },
  { id: 'oval', label: 'Ovalada' },
];

// 2. LARGO (Píldoras con incremento de precio)
const LENGTH_PILLS: { id: NailLengthType; label: string }[] = [
  { id: 'short', label: 'Corto' },
  { id: 'medium', label: 'Mediano +$50' },
  { id: 'long', label: 'Largo +$100' },
  { id: 'xl', label: 'XL +$150' },
];

// 3. RETIRO PREVIO / TÉCNICA (Píldoras)
const REMOVAL_PILLS = [
  { id: 'none', label: 'Sin retiro' },
  { id: 'extra_removal_acrylic', label: 'Acrílico +$120' },
  { id: 'extra_removal_gelx', label: 'Soft Gel +$80' },
] as const;

// 4. EFECTO & ACABADO (Píldoras)
const FINISH_PILLS: { id: NailFinishType; label: string }[] = [
  { id: 'glossy', label: 'Glossy Espejo' },
  { id: 'glazed', label: 'Glazed Donut' },
  { id: 'matte', label: 'Velvet Mate' },
  { id: 'cat_eye', label: 'Cat-Eye 9D' },
  { id: 'french', label: 'French Clásico' },
];

// 5. EXTRAS POPULARES (Píldoras compactas)
const EXTRA_PILLS = [
  { id: 'extra_crystals_swarovski', label: 'Cristales Swarovski +$90', icon: Gem },
  { id: 'extra_gold_foil', label: 'Foil de Oro +$60', icon: Sparkles },
  { id: 'extra_jelly_spa', label: 'Jelly Spa +$140', icon: Sparkle },
  { id: 'extra_keratin_cuticle', label: 'Baño de Keratina +$50', icon: Leaf },
];

export const NailCustomizerStep = forwardRef<NailCustomizerStepHandle, NailCustomizerStepProps>(function NailCustomizerStep({
  shape,
  selectedShape,
  onSelectShape,
  length,
  selectedLength,
  onSelectLength,
  selectedFinish,
  onSelectFinish,
  selectedColorHex,
  selectedColorName,
  selectedTipHex = '#FFFFFF',
  onSelectColor,
  selectedExtras,
  onToggleExtra,
  onProceedToNextStep,
  onContinueToSchedule,
  onGoToPreviousStep,
  onBackToPreviousStep,
  onBack
}, ref) {
  const currentShape = (shape || selectedShape || 'almond') as NailShapeType;
  const currentLength = (length || selectedLength || 'short') as NailLengthType;
  const handleProceed = onProceedToNextStep || onContinueToSchedule || (() => {});
  const handleBack = onGoToPreviousStep || onBackToPreviousStep || onBack || (() => {});

  useImperativeHandle(ref, () => ({
    goToPreviousStep: () => {
      handleBack();
      return false;
    }
  }));

  // Resolve labels
  const currentShapeName = useMemo(() => {
    return SHAPE_PILLS.find(s => s.id === currentShape)?.label || currentShape;
  }, [currentShape]);

  const currentLengthName = useMemo(() => {
    const raw = LENGTH_PILLS.find(l => l.id === currentLength)?.label || currentLength;
    return raw.split(' ')[0]; // E.g. 'Corto', 'Mediano', 'Largo', 'XL'
  }, [currentLength]);

  const currentFinishName = useMemo(() => {
    return FINISH_PILLS.find(f => f.id === selectedFinish)?.label || selectedFinish;
  }, [selectedFinish]);

  // Active palette for colors
  const activePalette = useMemo(() => {
    return FINISH_COLOR_PALETTES[selectedFinish] || FINISH_COLOR_PALETTES.glossy;
  }, [selectedFinish]);

  // Retiro activo
  const hasAcrylicRemoval = selectedExtras.includes('extra_removal_acrylic');
  const hasGelRemoval = selectedExtras.includes('extra_removal_gelx');
  const activeRemovalId = hasAcrylicRemoval 
    ? 'extra_removal_acrylic' 
    : hasGelRemoval 
    ? 'extra_removal_gelx' 
    : 'none';

  const handleSelectRemoval = (type: 'none' | 'extra_removal_acrylic' | 'extra_removal_gelx') => {
    triggerSelectionVibration();
    if (type === 'none') {
      if (hasAcrylicRemoval) onToggleExtra('extra_removal_acrylic');
      if (hasGelRemoval) onToggleExtra('extra_removal_gelx');
    } else if (type === 'extra_removal_acrylic') {
      if (hasGelRemoval) onToggleExtra('extra_removal_gelx');
      if (!hasAcrylicRemoval) onToggleExtra('extra_removal_acrylic');
    } else if (type === 'extra_removal_gelx') {
      if (hasAcrylicRemoval) onToggleExtra('extra_removal_acrylic');
      if (!hasGelRemoval) onToggleExtra('extra_removal_gelx');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. HERO PREVISUALIZADOR SUPERIOR (INTEGRADO AL FONDO) */}
      <div className="relative overflow-hidden rounded-3xl bg-card/60 dark:bg-card/40 backdrop-blur-md border border-border/60 p-5 flex flex-col items-center justify-center text-center transition-all">
        {/* Ambient liquid glow behind the nail visual */}
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: selectedColorHex || '#F472B6' }}
        />

        {/* Central Large Nail Model */}
        <motion.div 
          key={`${currentShape}-${currentLength}-${selectedFinish}-${selectedColorHex}`}
          initial={{ scale: 0.94, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-28 h-36 sm:w-32 sm:h-40 flex items-center justify-center filter drop-shadow-md"
        >
          <SingleNailMiniPreviewSVG
            shape={currentShape}
            length={currentLength}
            colorHex={selectedColorHex || '#F3C5BA'}
            finish={selectedFinish}
            tipHex={selectedTipHex || '#FFFFFF'}
            accent="none"
            className="w-24 h-34 sm:w-28 sm:h-38"
          />
        </motion.div>

        {/* Dynamic Title & Secondary Subtitle */}
        <div className="relative z-10 mt-3 text-center space-y-0.5">
          <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            {currentShapeName} · {currentLengthName}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            {currentFinishName} {selectedColorName ? `· ${selectedColorName}` : ''}
          </p>
        </div>
      </div>

      {/* 2. CHIP SELECTORS EN PÍLDORAS COMPACTAS (INTEGRADO AL FONDO) */}
      <div className="space-y-5">
        {/* SECCIÓN 1: FORMA DE UÑA */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Forma de Uña
            </span>
            <span className="text-xs font-semibold text-primary capitalize">
              {currentShapeName}
            </span>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scrollbar-none snap-x snap-mandatory gap-2 py-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SHAPE_PILLS.map((s) => {
              const isActive = currentShape === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectShape(s.id);
                  }}
                  className={cn(
                    "flex-shrink-0 snap-start px-4 py-2 rounded-full border text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap",
                    isActive
                      ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary/20"
                      : "bg-card border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/40"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* SECCIÓN 2: LARGO */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Largo
            </span>
            <span className="text-xs font-semibold text-primary">
              {currentLengthName}
            </span>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scrollbar-none snap-x snap-mandatory gap-2 py-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LENGTH_PILLS.map((l) => {
              const isActive = currentLength === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectLength(l.id);
                  }}
                  className={cn(
                    "flex-shrink-0 snap-start px-4 py-2 rounded-full border text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap",
                    isActive
                      ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary/20"
                      : "bg-card border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/40"
                  )}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* SECCIÓN 3: RETIRO PREVIO / TÉCNICA */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Retiro Previo / Técnica
            </span>
            <span className="text-xs font-semibold text-primary">
              {REMOVAL_PILLS.find(r => r.id === activeRemovalId)?.label}
            </span>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scrollbar-none snap-x snap-mandatory gap-2 py-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {REMOVAL_PILLS.map((r) => {
              const isActive = activeRemovalId === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRemoval(r.id)}
                  className={cn(
                    "flex-shrink-0 snap-start px-4 py-2 rounded-full border text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap",
                    isActive
                      ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary/20"
                      : "bg-card border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/40"
                  )}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* SECCIÓN 4: EFECTO & ACABADO */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Efecto & Acabado
            </span>
            <span className="text-xs font-semibold text-primary">
              {currentFinishName}
            </span>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scrollbar-none snap-x snap-mandatory gap-2 py-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FINISH_PILLS.map((f) => {
              const isActive = selectedFinish === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectFinish(f.id);
                  }}
                  className={cn(
                    "flex-shrink-0 snap-start px-4 py-2 rounded-full border text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap",
                    isActive
                      ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary/20"
                      : "bg-card border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/40"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* SECCIÓN 5: TONO / COLOR */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tono / Color
            </span>
            <span className="text-xs font-semibold text-primary truncate max-w-[200px]">
              {selectedColorName || 'Seleccionado'}
            </span>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scrollbar-none snap-x snap-mandatory items-center gap-2.5 py-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {activePalette.map((col) => {
              const isSelected = selectedColorHex.toLowerCase() === col.hex.toLowerCase();
              return (
                <button
                  key={col.id}
                  type="button"
                  title={col.name}
                  onClick={() => {
                    triggerSelectionVibration();
                    onSelectColor(col.hex, col.name, col.tipHex);
                  }}
                  className={cn(
                    "flex-shrink-0 snap-start size-8 rounded-full border transition-all duration-200 relative cursor-pointer active:scale-90 flex items-center justify-center",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-sm border-white"
                      : "border-black/15 hover:scale-105"
                  )}
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && (
                    <Check 
                      className={cn(
                        "size-3.5", 
                        ['#FAF5EF', '#FCF8F5', '#F7EFE4', '#FAF0E6'].includes(col.hex) 
                          ? "text-slate-800" 
                          : "text-white"
                      )} 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 6: EXTRAS OPCIONALES */}
        <div className="h-px bg-border/40" />
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Extras & Cuidados (Opcional)
            </span>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scrollbar-none snap-x snap-mandatory gap-2 py-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {EXTRA_PILLS.map((ext) => {
              const isChecked = selectedExtras.includes(ext.id);
              const Icon = ext.icon;
              return (
                <button
                  key={ext.id}
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    onToggleExtra(ext.id);
                  }}
                  className={cn(
                    "flex-shrink-0 snap-start px-4 py-2 rounded-full border text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5 whitespace-nowrap",
                    isChecked
                      ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary/20"
                      : "bg-card border-border/80 text-foreground hover:border-primary/40 hover:bg-secondary/40"
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span>{ext.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. BOTÓN PRINCIPAL DE ACCIÓN (CTA ANCHO COMPLETO EN ROSA DE MARCA) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            triggerStepVibration();
            handleProceed();
          }}
          className="w-full py-3.5 bg-pink-600 text-white font-semibold rounded-2xl shadow-lg shadow-pink-500/25 hover:bg-pink-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <span>Continuar a Resumen & Confirmación</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
});

NailCustomizerStep.displayName = 'NailCustomizerStep';

export default NailCustomizerStep;
