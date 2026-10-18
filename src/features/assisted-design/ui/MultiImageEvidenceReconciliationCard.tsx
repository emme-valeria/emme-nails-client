import React, { useState } from 'react';
import {
  ImageObservation,
  MultiImageReconciliationEngine,
  MultiImageReconciliationResult
} from '@/domain/quotes/services/multi-image-reconciliation-engine';
import { 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Eye, 
  AlertCircle, 
  ShieldCheck,
  ChevronRight,
  ZoomIn,
  RefreshCw
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { motion } from 'motion/react';

export interface MultiImageEvidenceReconciliationCardProps {
  initialObservations?: ImageObservation[];
  onReconciliationComplete?: (result: MultiImageReconciliationResult) => void;
  className?: string;
}

const SAMPLE_MULTI_ANGLE_OBSERVATIONS: ImageObservation[] = [
  {
    imageId: 'img_angle_top',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500',
    viewAngle: 'top_down',
    imageQualityScore: 0.95,
    observedAttributes: {
      shape: { value: 'almond', confidence: 0.96 },
      length: { value: 'L', confidence: 0.92 },
      finish: { value: 'glazed', confidence: 0.94 },
      dominantColorHex: { value: '#EBB6C4', confidence: 0.95 },
      artTier: { value: 'medium', confidence: 0.90 },
      hasFrench: { value: true, confidence: 0.95 },
      hasRhinestones: { value: true, count: 4, confidence: 0.88 },
    },
  },
  {
    imageId: 'img_angle_pose',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
    viewAngle: 'hand_pose',
    imageQualityScore: 0.88,
    observedAttributes: {
      shape: { value: 'almond', confidence: 0.92 },
      length: { value: 'L', confidence: 0.90 },
      finish: { value: 'glazed', confidence: 0.91 },
      dominantColorHex: { value: '#F0C2CE', confidence: 0.89 },
      artTier: { value: 'medium', confidence: 0.85 },
      hasFrench: { value: true, confidence: 0.90 },
    },
  },
  {
    imageId: 'img_angle_macro',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500',
    viewAngle: 'close_up_macro',
    imageQualityScore: 0.98,
    observedAttributes: {
      shape: { value: 'almond', confidence: 0.98 },
      finish: { value: 'glazed', confidence: 0.98 },
      dominantColorHex: { value: '#EBB6C4', confidence: 0.96 },
      hasRhinestones: { value: true, count: 4, confidence: 0.97 },
      hasCharms: { value: false, count: 0, confidence: 0.98 },
    },
  },
];

export const MultiImageEvidenceReconciliationCard: React.FC<MultiImageEvidenceReconciliationCardProps> = ({
  initialObservations = SAMPLE_MULTI_ANGLE_OBSERVATIONS,
  onReconciliationComplete,
  className,
}) => {
  const [observations] = useState<ImageObservation[]>(initialObservations);
  const [selectedImageId, setSelectedImageId] = useState<string>(observations[0]?.imageId || '');

  const result: MultiImageReconciliationResult = React.useMemo(() => {
    const res = MultiImageReconciliationEngine.reconcile(observations);
    if (onReconciliationComplete) {
      onReconciliationComplete(res);
    }
    return res;
  }, [observations, onReconciliationComplete]);

  const activeObs = observations.find(o => o.imageId === selectedImageId) || observations[0];

  return (
    <div id="multi-image-reconciliation-card" className={cn("bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6", className)}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Camera className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              Grafo de Evidencia Multi-Foto ({observations.length} Ángulos)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Reconciliación y compensación de perspectiva y oclusión
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Certeza Reconciliada: {Math.round(result.overallReconciledConfidence * 100)}%</span>
        </div>
      </div>

      {/* Image Strip with Angle Labels */}
      <div className="grid grid-cols-3 gap-3">
        {observations.map(obs => {
          const isSelected = obs.imageId === selectedImageId;
          const angleLabel =
            obs.viewAngle === 'top_down'
              ? 'Plano Cenital'
              : obs.viewAngle === 'hand_pose'
              ? 'Postura Natural'
              : 'Macro Detalle';

          return (
            <button
              key={obs.imageId}
              type="button"
              onClick={() => setSelectedImageId(obs.imageId)}
              className={cn(
                "relative group rounded-xl overflow-hidden border-2 text-left transition-all p-1.5",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border/60 hover:border-border bg-muted/20"
              )}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative bg-muted">
                <img
                  src={obs.imageUrl}
                  alt={angleLabel}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-medium text-white">
                  {angleLabel}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between px-1">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Q: {Math.round(obs.imageQualityScore * 100)}%
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Reconciled Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Silueta Resuelta</span>
          <p className="text-sm font-semibold text-foreground capitalize">
            {result.attributes.shape.resolvedValue}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            {Math.round(result.attributes.shape.confidence * 100)}% certeza
          </span>
        </div>

        <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Longitud Resuelta</span>
          <p className="text-sm font-semibold text-foreground">
            Largo {result.attributes.length.resolvedValue}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            {Math.round(result.attributes.length.confidence * 100)}% certeza
          </span>
        </div>

        <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Acabado Óptico</span>
          <p className="text-sm font-semibold text-foreground capitalize">
            {result.attributes.finish.resolvedValue}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            {Math.round(result.attributes.finish.confidence * 100)}% certeza
          </span>
        </div>

        <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Tono Dominante</span>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: result.attributes.dominantColorHex.resolvedValue }}
            />
            <span className="text-sm font-semibold text-foreground">
              {result.attributes.dominantColorHex.resolvedValue}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            {Math.round(result.attributes.dominantColorHex.confidence * 100)}% certeza
          </span>
        </div>

        <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Nail Art Tier</span>
          <p className="text-sm font-semibold text-foreground capitalize">
            Nivel {result.attributes.artTier.resolvedValue}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            {Math.round(result.attributes.artTier.confidence * 100)}% certeza
          </span>
        </div>

        <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Joyería & Cristales</span>
          <p className="text-sm font-semibold text-foreground">
            {result.attributes.embellishments.resolvedValue.stones} piedras
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            Confirmado en macro
          </span>
        </div>
      </div>

      {/* Synthesis Reasoning Box */}
      <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Síntesis de Razonamiento Multi-Imagen:</span>
        </div>
        <ul className="space-y-1 text-xs text-muted-foreground">
          {result.evidenceGraphSummary.map((summary, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-primary mt-1">•</span>
              <span>{summary}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
