import React, { useState } from 'react';
import {
  CurrentNailCondition,
  TargetNailDesign,
  ClientDesignIntent,
  DesignTransformationDelta,
  RequiredWorkItem
} from '@/domain/quotes/entities/NailTransformationDelta';
import { NailTransformationEngine } from '@/domain/quotes/services/nail-transformation-engine';
import { SingleNailMiniPreviewSVG, NailShapeType, NailLengthType, NailFinishType } from '@/shared/components/NailModelerVisualizerSVG';
import { 
  Wrench, 
  Sparkles, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@emme/ui/lib/utils';

export interface NailTransformationDeltaWidgetProps {
  initialCurrent?: CurrentNailCondition;
  initialTarget?: TargetNailDesign;
  initialIntent?: ClientDesignIntent;
  onWorkItemsChanged?: (items: RequiredWorkItem[]) => void;
  className?: string;
}

export const NailTransformationDeltaWidget: React.FC<NailTransformationDeltaWidgetProps> = ({
  initialCurrent,
  initialTarget,
  initialIntent,
  onWorkItemsChanged,
  className,
}) => {
  const [current, setCurrent] = useState<CurrentNailCondition>(
    initialCurrent || {
      hasExistingProduct: true,
      existingProductType: 'acrylic',
      conditionGrade: 'healthy',
      brokenNailsCount: 1,
      currentLengthCategory: 'S',
      currentShape: 'square',
      cuticleCondition: 'clean',
      confidence: 0.94,
    }
  );

  const [target, setTarget] = useState<TargetNailDesign>(
    initialTarget || {
      baseServiceCategory: 'Escultural Acrílico Pro',
      lengthCategory: 'L',
      shape: 'almond',
      material: 'acrylic',
      dominantColorHex: '#EBB6C4',
      dominantColorName: 'Rosa Seda Glazed',
      secondaryColors: [{ hex: '#FFFFFF', name: 'Micro French Blanco' }],
      finish: 'chrome',
      artTier: 'medium',
      artDescription: 'Micro French + Aura Glazed Donut',
      rhinestoneCount: 4,
      charms3DCount: 0,
      confidence: 0.96,
    }
  );

  const [intent, setIntent] = useState<ClientDesignIntent>(initialIntent || {});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const delta = React.useMemo(() => {
    const res = NailTransformationEngine.calculateDelta(current, target, intent);
    if (onWorkItemsChanged) {
      onWorkItemsChanged(res.workItems);
    }
    return res;
  }, [current, target, intent, onWorkItemsChanged]);

  const mapShapeToSVG = (shape: string): NailShapeType => {
    const s = shape.toLowerCase();
    if (s.includes('almond') || s.includes('almendra')) return 'almond';
    if (s.includes('coffin') || s.includes('ballerina')) return 'coffin';
    if (s.includes('oval')) return 'oval';
    if (s.includes('squoval')) return 'squoval';
    if (s.includes('stiletto')) return 'stiletto';
    return 'square';
  };

  const mapLengthToSVG = (length: string): NailLengthType => {
    if (length === 'XS' || length === 'S') return 'short';
    if (length === 'L') return 'long';
    if (length === 'XL' || length === 'XXL') return 'xl';
    return 'medium';
  };

  const mapFinishToSVG = (finish: string): NailFinishType => {
    if (finish === 'matte') return 'matte';
    if (finish === 'chrome' || finish === 'glazed') return 'glazed';
    if (finish === 'cat_eye') return 'cat_eye';
    return 'glossy';
  };

  return (
    <div id="nail-transformation-delta-widget" className={cn("bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Wrench className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              Transformación Anatómica & Protocolo de Cita
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cálculo de trabajo exacto desde el estado actual hasta el diseño objetivo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/20">
            <Clock className="w-3.5 h-3.5" />
            <span>+{delta.totalDeltaMinutes} min de sesión</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20">
            <DollarSign className="w-3.5 h-3.5" />
            <span>+${delta.totalDeltaPrice} MXN en trabajo</span>
          </div>
        </div>
      </div>

      {/* Visual Transformation Stage (Before -> Delta -> After) */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-muted/30 p-4 rounded-xl border border-border/40">
        {/* Left: Current State */}
        <div className="md:col-span-4 bg-background p-3.5 rounded-xl border border-border/60 flex items-center gap-4">
          <div className="w-16 h-20 bg-muted/40 rounded-lg flex items-center justify-center p-2 border border-border/40 shrink-0">
            <SingleNailMiniPreviewSVG
              shape={mapShapeToSVG(current.currentShape)}
              length={mapLengthToSVG(current.currentLengthCategory)}
              finish="glossy"
              colorHex="#D8A99B"
              className="w-10 h-16"
            />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Estado Inicial</span>
            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
              {current.hasExistingProduct ? `Con ${current.existingProductType || 'Acrílico'}` : 'Uña Natural'}
            </p>
            <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
              <span className="px-1.5 py-0.5 rounded bg-muted">Largo: {current.currentLengthCategory}</span>
              <span className="px-1.5 py-0.5 rounded bg-muted">Forma: {current.currentShape}</span>
              {current.brokenNailsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-medium">
                  {current.brokenNailsCount} rota
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Arrow Delta Badge */}
        <div className="md:col-span-3 flex flex-col items-center justify-center text-center py-2 md:py-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-foreground">{delta.workItems.length} Procedimientos</span>
          <span className="text-[11px] text-muted-foreground">Protocolo Emme</span>
        </div>

        {/* Right: Target Desired Design */}
        <div className="md:col-span-4 bg-background p-3.5 rounded-xl border border-primary/30 flex items-center gap-4 shadow-sm">
          <div className="w-16 h-20 bg-primary/5 rounded-lg flex items-center justify-center p-2 border border-primary/20 shrink-0">
            <SingleNailMiniPreviewSVG
              shape={mapShapeToSVG(target.shape)}
              length={mapLengthToSVG(target.lengthCategory)}
              finish={mapFinishToSVG(target.finish)}
              colorHex={target.dominantColorHex}
              className="w-10 h-16"
            />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Diseño Objetivo</span>
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
              {target.dominantColorName}
            </p>
            <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Largo: {target.lengthCategory}</span>
              <span className="px-1.5 py-0.5 rounded bg-muted">Forma: {target.shape}</span>
              <span className="px-1.5 py-0.5 rounded bg-muted">{target.finish}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings & Feasibility Check */}
      {delta.feasibilityWarnings.length > 0 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-700">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div className="space-y-0.5">
            <p className="font-semibold">Recomendación Técnica de Placa:</p>
            {delta.feasibilityWarnings.map((w, idx) => (
              <p key={idx}>{w}</p>
            ))}
          </div>
        </div>
      )}

      {/* Step by Step Work Item Protocol */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Desglose de Trabajo & Receta de Cabina ({delta.workItems.length})
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Garantía Emme de 21 días
          </span>
        </div>

        <div className="space-y-2">
          {delta.workItems.map((item, index) => {
            const isExpanded = expandedItem === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  "border rounded-xl transition-all duration-200 overflow-hidden",
                  isExpanded ? "border-primary/40 bg-card shadow-sm" : "border-border/60 bg-muted/10 hover:bg-muted/30"
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  className="w-full px-3.5 py-3 flex items-center justify-between text-left gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground font-mono text-[11px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {item.deltaReason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-foreground block">
                        {item.estimatedPrice === 0 ? 'Incluido' : `+$${item.estimatedPrice} MXN`}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        ~{item.estimatedMinutes} min
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-3 pt-1 border-t border-border/40 text-xs text-muted-foreground bg-muted/20"
                    >
                      <p className="mt-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground/80 font-mono">
                        <span>Código de regla: {item.ruleCode}</span>
                        <span>{item.isMandatory ? 'Paso Estructural Obligatorio' : 'Decoración Opcional'}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
