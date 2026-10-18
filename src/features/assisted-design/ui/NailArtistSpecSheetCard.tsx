import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Palette,
  Sparkles,
  Scissors,
  Check,
  Copy,
  UserCheck,
  Sparkle,
  Sliders,
  CalendarCheck,
  Edit3,
  X,
  Layers,
  ChevronRight,
  Info,
  Camera,
  RotateCcw,
  Hand
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';
import {
  NailPhotoDetailedAnalysis,
  NailProcedureStep,
} from '@/domain/quotes/entities/Inspiration';
import { SingleNailMiniPreviewSVG } from '@/shared/components/NailModelerVisualizerSVG';
import { HandId, FingerId } from '@/domain/quotes/entities/NailArtSemanticTypes';
import { triggerSelectionVibration, triggerConfirmedVibration } from '@/shared/utils/haptics';

export interface NailArtistSpecSheetCardProps {
  analysis: NailPhotoDetailedAnalysis;
  imageUrl?: string;
  onApproveSpec?: (updatedAnalysis: NailPhotoDetailedAnalysis) => void;
  onBookOrProceed?: (analysis: NailPhotoDetailedAnalysis) => void;
  onBackToClientView?: () => void;
  className?: string;
}

export interface DetailedFingerSpec {
  id: FingerId;
  hand: HandId;
  name: string;
  fingerName: string;
  role: string;
  colorHex: string;
  colorName: string;
  finish: string;
  artDetail: string;
  curingTime: string;
  apexThickness: string;
  hasAccent: boolean;
  hasFrench?: boolean;
  hasCharm?: boolean;
  confidence: number;
  evidence: 'OBSERVED' | 'INFERRED' | 'CLIENT_CUSTOMIZED';
}

const REASON_CODES = [
  { code: 'CUSTOM_ART_COMPLEXITY', label: 'Complejidad de Arte Mayor a la Estimada' },
  { code: 'DAMAGED_NAIL_PLATE', label: 'Reparación / Reconstrucción de Lámina Ungueal' },
  { code: 'LENGTH_ADJUSTMENT', label: 'Ajuste de Largo Final Solicitado por Clienta' },
  { code: 'EXTRA_REMOVAL_TIME', label: 'Retiro de Producto Previo Complejo' },
  { code: 'PREMIUM_MATERIAL', label: 'Uso de Material de Colección / Joyería de Autor' },
  { code: 'PROMO_DISCOUNT', label: 'Cortesía / Descuento Autorizado en Cabina' },
];

const FINGER_ORDER: { id: FingerId; name: string; short: string; heightFactor: number }[] = [
  { id: 'thumb', name: 'Pulgar', short: 'P', heightFactor: 0.85 },
  { id: 'index', name: 'Índice', short: 'I', heightFactor: 0.95 },
  { id: 'middle', name: 'Medio', short: 'M', heightFactor: 1.0 },
  { id: 'ring', name: 'Anular', short: 'A', heightFactor: 0.92 },
  { id: 'pinky', name: 'Meñique', short: 'm', heightFactor: 0.78 },
];

export function NailArtistSpecSheetCard({
  analysis,
  imageUrl,
  onApproveSpec,
  onBookOrProceed,
  onBackToClientView,
  className = '',
}: NailArtistSpecSheetCardProps) {
  const [selectedHand, setSelectedHand] = useState<HandId>('left');
  const [selectedFingerId, setSelectedFingerId] = useState<FingerId>('ring');
  const [viewScope, setViewScope] = useState<'selected_hand' | 'both_hands'>('selected_hand');
  const [activeSubView, setActiveSubView] = useState<'fingers' | 'steps' | 'materials'>('fingers');
  const [activeSteps, setActiveSteps] = useState<NailProcedureStep[]>(analysis.procedureSteps);

  // Specialist Cabin Override State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [customPriceInput, setCustomPriceInput] = useState<string>(String(analysis.estimateRange.likelyPrice));
  const [overrideReasonCode, setOverrideReasonCode] = useState<string>(REASON_CODES[0].code);
  const [overrideTechnicianNote, setOverrideTechnicianNote] = useState<string>('');
  const [isArtistApproved, setIsArtistApproved] = useState(false);
  const [appliedOverride, setAppliedOverride] = useState<{
    adjustedPrice: number;
    reason: string;
    note: string;
  } | null>(null);

  const layers = analysis.layers;
  const estimate = analysis.estimateRange;
  const dominantHex = layers.chromatics.dominantColorHex || '#F7D2DE';
  const dominantName = layers.chromatics.dominantColorName || 'Rosa Nude Suave';
  const secondaryHex = layers.chromatics.secondaryColorHex || '#FFFFFF';
  const finish = layers.finish.value || 'glazed';
  const shape = layers.shape.value || 'almond';
  const length = layers.length.value || 'medium';

  // 10-Finger Complete Simulated Mapping (Left & Right Hands)
  const full10FingerSpecs: Record<string, DetailedFingerSpec> = useMemo(() => {
    const isFrench = layers.nailArt.complexity === 'french';
    const is3D = layers.nailArt.complexity === '3d_charms';
    const isComplex = layers.nailArt.complexity === 'art_illustration' || is3D;

    return {
      // LEFT HAND
      'left-thumb': {
        id: 'thumb',
        hand: 'left',
        name: 'Mano Izquierda • Pulgar',
        fingerName: 'Pulgar',
        role: 'Base Sólida Monocromática',
        colorHex: dominantHex,
        colorName: dominantName,
        finish: layers.finish.label,
        artDetail: 'Nivelación uniforme + sellado de bordes laterales con técnica rusa',
        curingTime: 'LED 60s',
        apexThickness: '1.4 mm (Punto de Tensión)',
        hasAccent: false,
        confidence: 0.98,
        evidence: 'OBSERVED',
      },
      'left-index': {
        id: 'index',
        hand: 'left',
        name: 'Mano Izquierda • Índice',
        fingerName: 'Índice',
        role: isFrench ? 'Micro-French Delineado' : 'Base Sólida Monocromática',
        colorHex: dominantHex,
        colorName: dominantName,
        finish: layers.finish.label,
        artDetail: isFrench
          ? 'Micro-French blanco con pincel 00 ultra fino sobre base nivelada'
          : 'Esmaltado pro bajo cutícula con sellado anti-desprendimiento',
        curingTime: isFrench ? 'LED 60s + 30s flash' : 'LED 60s',
        apexThickness: '1.3 mm',
        hasAccent: isFrench,
        hasFrench: isFrench,
        confidence: 0.95,
        evidence: 'OBSERVED',
      },
      'left-middle': {
        id: 'middle',
        hand: 'left',
        name: 'Mano Izquierda • Medio',
        fingerName: 'Medio',
        role: isFrench ? 'Micro-French Delineado' : 'Base Sólida Monocromática',
        colorHex: dominantHex,
        colorName: dominantName,
        finish: layers.finish.label,
        artDetail: isFrench
          ? 'Sonrisa simétrica Micro-French alineada con el centro ungueal'
          : 'Esmaltado uniforme con brillo efecto espejo',
        curingTime: isFrench ? 'LED 60s + 30s flash' : 'LED 60s',
        apexThickness: '1.3 mm',
        hasAccent: isFrench,
        hasFrench: isFrench,
        confidence: 0.96,
        evidence: 'OBSERVED',
      },
      'left-ring': {
        id: 'ring',
        hand: 'left',
        name: 'Mano Izquierda • Anular (Acento)',
        fingerName: 'Anular',
        role: 'Uña Protagonista / Acento Decorativo',
        colorHex: is3D ? dominantHex : secondaryHex,
        colorName: is3D ? dominantName : 'Pigmento Perla Glazed',
        finish: layers.finish.label,
        artDetail: is3D
          ? 'Charms 3D de alta fijación + Micro-cristales Swarovski sellados con gel de construcción'
          : layers.nailArt.elements.length > 0
          ? layers.nailArt.elements.join(' + ')
          : 'Efecto Glazed Pearl de alta intensidad y destello nacarado',
        curingTime: 'LED 90s (anclaje estructural)',
        apexThickness: '1.5 mm (Reforzado)',
        hasAccent: true,
        hasCharm: is3D,
        confidence: 0.99,
        evidence: 'OBSERVED',
      },
      'left-pinky': {
        id: 'pinky',
        hand: 'left',
        name: 'Mano Izquierda • Meñique',
        fingerName: 'Meñique',
        role: 'Base Sólida Monocromática',
        colorHex: dominantHex,
        colorName: dominantName,
        finish: layers.finish.label,
        artDetail: 'Limpieza de cutícula milimétrica y sellado perimetral reforzado',
        curingTime: 'LED 60s',
        apexThickness: '1.1 mm',
        hasAccent: false,
        confidence: 0.97,
        evidence: 'OBSERVED',
      },

      // RIGHT HAND
      'right-thumb': {
        id: 'thumb',
        hand: 'right',
        name: 'Mano Derecha • Pulgar',
        fingerName: 'Pulgar',
        role: 'Base Sólida Monocromática',
        colorHex: dominantHex,
        colorName: dominantName,
        finish: layers.finish.label,
        artDetail: 'Nivelación uniforme + sellado de bordes laterales con técnica rusa',
        curingTime: 'LED 60s',
        apexThickness: '1.4 mm (Punto de Tensión)',
        hasAccent: false,
        confidence: 0.98,
        evidence: 'OBSERVED',
      },
      'right-index': {
        id: 'index',
        hand: 'right',
        name: 'Mano Derecha • Índice',
        fingerName: 'Índice',
        role: isFrench ? 'Micro-French Delineado' : 'Base Sólida Monocromática',
        colorHex: dominantHex,
        colorName: dominantName,
        finish: layers.finish.label,
        artDetail: isFrench
          ? 'Micro-French blanco con pincel 00 ultra fino simétrico'
          : 'Esmaltado pro bajo cutícula con sellado anti-desprendimiento',
        curingTime: isFrench ? 'LED 60s + 30s flash' : 'LED 60s',
        apexThickness: '1.3 mm',
        hasAccent: isFrench,
        hasFrench: isFrench,
        confidence: 0.95,
        evidence: 'OBSERVED',
      },
      'right-middle': {
        id: 'middle',
        hand: 'right',
        name: 'Mano Derecha • Medio',
        fingerName: 'Medio',
        role: isFrench ? 'Micro-French Delineado' : 'Base Sólida Monocromática',
        colorHex: dominantHex,
        colorName: dominantName,
        finish: layers.finish.label,
        artDetail: isFrench
          ? 'Sonrisa simétrica Micro-French alineada con el centro ungueal'
          : 'Esmaltado uniforme con brillo efecto espejo',
        curingTime: isFrench ? 'LED 60s + 30s flash' : 'LED 60s',
        apexThickness: '1.3 mm',
        hasAccent: isFrench,
        hasFrench: isFrench,
        confidence: 0.96,
        evidence: 'OBSERVED',
      },
      'right-ring': {
        id: 'ring',
        hand: 'right',
        name: 'Mano Derecha • Anular (Acento)',
        fingerName: 'Anular',
        role: 'Uña Protagonista / Acento Decorativo',
        colorHex: is3D ? dominantHex : secondaryHex,
        colorName: is3D ? dominantName : 'Pigmento Perla Glazed',
        finish: layers.finish.label,
        artDetail: is3D
          ? 'Charms 3D de alta fijación + Micro-cristales Swarovski simétricos'
          : layers.nailArt.elements.length > 0
          ? layers.nailArt.elements.join(' + ')
          : 'Efecto Glazed Pearl de alta intensidad y destello nacarado',
        curingTime: 'LED 90s (anclaje estructural)',
        apexThickness: '1.5 mm (Reforzado)',
        hasAccent: true,
        hasCharm: is3D,
        confidence: 0.99,
        evidence: 'OBSERVED',
      },
      'right-pinky': {
        id: 'pinky',
        hand: 'right',
        name: 'Mano Derecha • Meñique',
        fingerName: 'Meñique',
        role: 'Base Sólida Monocromática',
        colorHex: dominantHex,
        colorName: dominantName,
        finish: layers.finish.label,
        artDetail: 'Limpieza de cutícula milimétrica y sellado perimetral reforzado',
        curingTime: 'LED 60s',
        apexThickness: '1.1 mm',
        hasAccent: false,
        confidence: 0.97,
        evidence: 'OBSERVED',
      },
    };
  }, [dominantHex, dominantName, secondaryHex, layers]);

  const currentFingerKey = `${selectedHand}-${selectedFingerId}`;
  const currentFinger = full10FingerSpecs[currentFingerKey] || full10FingerSpecs['left-ring'];

  const toggleStep = (stepId: string) => {
    triggerSelectionVibration();
    setActiveSteps(prev =>
      prev.map(s => (s.id === stepId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(customPriceInput);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Ingresa un monto válido para el presupuesto de cabina');
      return;
    }

    const reasonObj = REASON_CODES.find(r => r.code === overrideReasonCode);
    const reasonLabel = reasonObj?.label || overrideReasonCode;

    setAppliedOverride({
      adjustedPrice: priceNum,
      reason: reasonLabel,
      note: overrideTechnicianNote,
    });
    setIsArtistApproved(true);
    setShowOverrideModal(false);
    triggerConfirmedVibration();
    toast.success(`Presupuesto de cabina ajustado a $${priceNum} MXN por la especialista`);
  };

  const handleCopySpecText = () => {
    const activeList = activeSteps.filter(s => s.isActive);
    const currentPrice = appliedOverride ? appliedOverride.adjustedPrice : estimate.likelyPrice;

    const text = `📋 FICHA TÉCNICA PRO • EMME SALON\n` +
      `----------------------------------------\n` +
      `Estructura Base: ${layers.structure.label}\n` +
      `Forma: ${layers.shape.label} | Largo: ${layers.length.label}\n` +
      `Color Base: ${dominantName} (${dominantHex})\n` +
      `Acabado Óptico: ${layers.finish.label}\n` +
      `Nail Art: ${layers.nailArt.elements.join(', ') || 'Monocromático Limpio'}\n` +
      `Certeza IA: ${Math.round(analysis.overallConfidence * 100)}%\n` +
      `Tiempo Estimado: ${estimate.estimatedDurationMinutes} min\n` +
      `Presupuesto Final Cabina: $${currentPrice} MXN\n` +
      (appliedOverride ? `[Ajuste Especialista: $${appliedOverride.adjustedPrice} MXN - ${appliedOverride.reason}]\n` : '') +
      `\nPASOS TÉCNICOS (${activeList.length}):\n` +
      activeList.map(s => `[${s.stepNumber}] ${s.name} (${s.estimatedMinutes}m) - $${s.estimatedPrice} MXN`).join('\n') +
      `\n\nMAPEO DE 10 UÑAS:\n` +
      Object.values(full10FingerSpecs).map(f => `• ${f.name}: ${f.role} | Ápice: ${f.apexThickness} | ${f.artDetail}`).join('\n');

    navigator.clipboard.writeText(text);
    triggerSelectionVibration();
    toast.success('Ficha técnica completa copiada al portapapeles');
  };

  const currentPrice = appliedOverride ? appliedOverride.adjustedPrice : estimate.likelyPrice;

  return (
    <div className={cn('w-full text-left space-y-6', className)}>
      {/* 1. TOP HEADER & PRO BADGE (Flush & Containerless) */}
      <div className="space-y-3 border-b border-black/[0.06] pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                <Scissors className="size-3 text-pink-400" />
                Ficha Técnica Pro Artista
              </span>
              <span className="text-[11px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="size-3 text-pink-500" />
                Certeza IA: {Math.round(analysis.overallConfidence * 100)}%
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {layers.structure.label} &bull; Curvatura C &bull; Técnica Rusa
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              Mapeo Anatómico de 10 Uñas & Protocolo de Cabina
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium">
              Especificación detallada uña por uña para que clienta y artista compartan exactamente el mismo estándar de aplicación.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setShowOverrideModal(true)}
              className="h-9 px-3.5 rounded-xl text-xs font-bold text-black bg-neutral-100 hover:bg-pink-50 hover:text-pink-600 border border-black/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="size-3.5 text-pink-500" />
              <span>Ajustar Precio</span>
            </button>

            <button
              type="button"
              onClick={handleCopySpecText}
              className="h-9 px-3.5 rounded-xl text-xs font-bold text-black bg-neutral-100 hover:bg-neutral-200 border border-black/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="size-3.5" />
              <span>Copiar Ficha</span>
            </button>

            {onBackToClientView && (
              <button
                type="button"
                onClick={onBackToClientView}
                className="h-9 px-3.5 rounded-xl text-xs font-bold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Vista Resumen
              </button>
            )}
          </div>
        </div>

        {/* Applied Specialist Adjustment Banner */}
        {appliedOverride && (
          <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-pink-600 shrink-0" />
              <div>
                <span className="font-bold text-black">
                  Ajuste Especialista Aplicado: ${appliedOverride.adjustedPrice} MXN
                </span>
                <p className="text-[11px] text-neutral-600">
                  Motivo: {appliedOverride.reason} {appliedOverride.note && `(${appliedOverride.note})`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowOverrideModal(true)}
              className="text-xs font-bold text-pink-600 hover:underline cursor-pointer"
            >
              Modificar
            </button>
          </div>
        )}
      </div>

      {/* 2. SUB-NAVIGATION TABS (Containerless underline/pills) */}
      <div className="flex items-center gap-2 border-b border-black/[0.06] pb-3 text-xs overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => {
            triggerSelectionVibration();
            setActiveSubView('fingers');
          }}
          className={cn(
            'px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2',
            activeSubView === 'fingers'
              ? 'bg-black text-white shadow-xs'
              : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
          )}
        >
          <Hand className="size-3.5 text-pink-400" />
          <span>Mapeo Mano Izq / Der (10 Uñas)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSelectionVibration();
            setActiveSubView('steps');
          }}
          className={cn(
            'px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2',
            activeSubView === 'steps'
              ? 'bg-black text-white shadow-xs'
              : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
          )}
        >
          <Layers className="size-3.5 text-pink-400" />
          <span>Receta Técnica de Aplicación ({activeSteps.filter(s => s.isActive).length}/{activeSteps.length} Pasos)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSelectionVibration();
            setActiveSubView('materials');
          }}
          className={cn(
            'px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2',
            activeSubView === 'materials'
              ? 'bg-black text-white shadow-xs'
              : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
          )}
        >
          <Palette className="size-3.5 text-pink-400" />
          <span>Materiales, Curado & Colorimetría</span>
        </button>
      </div>

      {/* 3. MAIN CONTENT VIEWS */}
      {activeSubView === 'fingers' && (
        <div className="space-y-6">
          {/* Hand Switcher & Scope Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Hand Toggle Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  setSelectedHand('left');
                  setViewScope('selected_hand');
                }}
                className={cn(
                  'flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2',
                  selectedHand === 'left' && viewScope === 'selected_hand'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                )}
              >
                <div className="size-2 rounded-full bg-pink-400" />
                <span>Mano Izquierda (5 Uñas)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  setSelectedHand('right');
                  setViewScope('selected_hand');
                }}
                className={cn(
                  'flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2',
                  selectedHand === 'right' && viewScope === 'selected_hand'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                )}
              >
                <div className="size-2 rounded-full bg-pink-400" />
                <span>Mano Derecha (5 Uñas)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  setViewScope('both_hands');
                }}
                className={cn(
                  'hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer items-center justify-center gap-1.5',
                  viewScope === 'both_hands'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                )}
              >
                <span>Ver Ambas (10)</span>
              </button>
            </div>

            <span className="text-xs text-neutral-500 font-medium">
              Toca cualquier uña para ver su protocolo de ápice, curado y arte
            </span>
          </div>

          {/* 5-Fingers Spread Interactive Row (Containerless, massive tap targets) */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 py-1">
            {FINGER_ORDER.map(({ id, name, heightFactor }) => {
              const fingerKey = `${selectedHand}-${id}`;
              const spec = full10FingerSpecs[fingerKey];
              const isSelected = selectedFingerId === id;
              const isAccent = spec?.hasAccent;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    triggerSelectionVibration();
                    setSelectedFingerId(id);
                  }}
                  className={cn(
                    'relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-200 text-center cursor-pointer min-h-[170px]',
                    isSelected
                      ? 'bg-pink-50/80 border-2 border-pink-500 shadow-sm ring-4 ring-pink-500/10 scale-[1.02]'
                      : isAccent
                      ? 'bg-neutral-50 hover:bg-pink-50/40 border border-pink-300'
                      : 'bg-neutral-50 hover:bg-neutral-100 border border-black/[0.06]'
                  )}
                >
                  {/* Top Finger Header */}
                  <div className="w-full flex items-center justify-between gap-1 mb-1">
                    <span className={cn(
                      "text-[11px] font-extrabold truncate",
                      isSelected ? "text-pink-700" : "text-black"
                    )}>
                      {name}
                    </span>
                    {isAccent && (
                      <span className="size-2 rounded-full bg-pink-500 animate-pulse" title="Uña con Acento Decorativo" />
                    )}
                  </div>

                  {/* SVG Nail Mini Visualizer */}
                  <div
                    className="py-1.5 flex items-center justify-center transition-transform duration-200"
                    style={{ transform: `scale(${heightFactor})` }}
                  >
                    <SingleNailMiniPreviewSVG
                      shape={shape as any}
                      length={length as any}
                      colorHex={spec?.colorHex || dominantHex}
                      finish={finish as any}
                      className="w-9 h-14"
                    />
                  </div>

                  {/* Bottom Role & Swatch */}
                  <div className="w-full mt-2 pt-2 border-t border-black/[0.06] space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block truncate">
                      {isAccent ? 'Acento Art' : 'Base'}
                    </span>
                    <div
                      className="size-3.5 mx-auto rounded-full border border-black/20 shadow-2xs"
                      style={{ backgroundColor: spec?.colorHex || dominantHex }}
                      title={spec?.colorName}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* FLUSH SELECTED FINGER SPECIFICATION BAR (Containerless, spacious) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-black/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <div
                  className="size-7 rounded-full border-2 border-white shadow-xs shrink-0 ring-1 ring-black/10"
                  style={{ backgroundColor: currentFinger.colorHex }}
                />
                <div>
                  <h4 className="text-sm sm:text-base font-black text-black flex items-center gap-2">
                    <span>{currentFinger.name}</span>
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100 border border-pink-200 px-2.5 py-0.5 rounded-full">
                      {currentFinger.role}
                    </span>
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium">
                    Tono: <span className="font-bold text-black">{currentFinger.colorName}</span> ({currentFinger.colorHex}) &bull; {currentFinger.finish}
                  </p>
                </div>
              </div>

              {/* Protocol Badges */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <div className="flex items-center gap-1 bg-white border border-black/10 px-2.5 py-1 rounded-xl">
                  <Clock className="size-3 text-neutral-500" />
                  <span className="font-semibold text-neutral-600">Curado:</span>
                  <span className="font-mono font-black text-black">{currentFinger.curingTime}</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-black/10 px-2.5 py-1 rounded-xl">
                  <ShieldCheck className="size-3 text-pink-500" />
                  <span className="font-semibold text-neutral-600">Ápice:</span>
                  <span className="font-mono font-black text-pink-600">{currentFinger.apexThickness}</span>
                </div>
              </div>
            </div>

            {/* Spec Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block">
                  Técnica & Arte Asignado
                </span>
                <p className="font-medium text-neutral-800 leading-relaxed">
                  {currentFinger.artDetail}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block">
                  Sellado & Acabado Óptico
                </span>
                <p className="font-medium text-neutral-800 leading-relaxed">
                  {currentFinger.finish} &bull; Sellado en cutícula y bordes libres con Top Coat UV Pro anti-amarilleo.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block">
                  Validación IA & Cabina
                </span>
                <div className="flex items-center gap-1.5 font-bold text-pink-600 mt-0.5">
                  <CheckCircle2 className="size-4" />
                  <span>{currentFinger.evidence} (Certeza {Math.round(currentFinger.confidence * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ALL 10 NAILS FLUSH OVERVIEW LIST (If requested or toggled) */}
          {viewScope === 'both_hands' && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-black">
                Desglose Completo de las 10 Uñas (Mano Izquierda + Mano Derecha)
              </h4>
              <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
                {Object.values(full10FingerSpecs).map((spec) => (
                  <div
                    key={`${spec.hand}-${spec.id}`}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="size-4 rounded-full border border-black/20 shadow-2xs shrink-0"
                        style={{ backgroundColor: spec.colorHex }}
                      />
                      <div>
                        <span className="font-bold text-black">{spec.name}</span>
                        <span className="text-neutral-500 ml-2">({spec.role})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-neutral-600 font-medium sm:text-right">
                      <span>Ápice: <strong className="text-black">{spec.apexThickness}</strong></span>
                      <span>Curado: <strong className="text-black">{spec.curingTime}</strong></span>
                      {spec.hasAccent && (
                        <span className="text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
                          Acento
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. RECIPE VIEW (Pasos de Cabina) */}
      {activeSubView === 'steps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-600 font-medium">
            <span>Protocolo de {activeSteps.length} pasos técnicos para salón profesional:</span>
            <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
              Garantía Anti-Doble Cargo Activa
            </span>
          </div>

          <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
            {activeSteps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors',
                  step.isActive ? 'opacity-100' : 'opacity-40 line-through'
                )}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className={cn(
                      'size-7 rounded-xl flex items-center justify-center font-black text-xs transition-colors shrink-0 cursor-pointer mt-0.5',
                      step.isActive
                        ? 'bg-black text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    )}
                  >
                    {step.stepNumber}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-black">
                        {step.name}
                      </h4>
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                        {step.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 max-w-xl">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-0.5">
                      <span>Productos & Materiales: {step.productsUsed?.join(', ') || 'Productos Estándar de Cabina'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-between shrink-0 pt-2 sm:pt-0">
                  <span className="text-xs font-black text-black">
                    ${step.estimatedPrice} MXN
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                    <Clock className="size-3 text-pink-500" />
                    <span>~{step.estimatedMinutes} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MATERIALS & COLORIMETRY VIEW */}
      {activeSubView === 'materials' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-black">
              Colorimetría & Fórmulas Químicas Detectadas
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {layers.chromatics.palette.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-neutral-50 border border-black/[0.08]"
                >
                  <div
                    className="size-5 rounded-full border border-black/20 shadow-2xs shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-xs">
                    <span className="font-bold text-black block">{color.name}</span>
                    <span className="text-[10px] font-mono text-neutral-500">{color.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-black/[0.06]">
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-black block">Curvatura & Estructura Mecánica:</span>
              <p className="text-neutral-600">
                Lámina preparada con torno diamantado ruso a 15,000 RPM. Nivelación con Rubber Base / Acrílico Monómero Pro para soporte de ápice balanceado sin limado excesivo.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-black block">Sellado & Compatibilidad UV:</span>
              <p className="text-neutral-600">
                Polimerización en lámpara LED dual 48W por 60s. Aplicación de Top Coat UV sin capa de dispersión para asegurar máxima durabilidad de brillo cristal anti-rayas por 21+ días.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. BOTTOM SUMMARY & CTA BAR (Flush, edge-to-edge) */}
      <div className="pt-4 border-t border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Presupuesto Total Cabina Estimado
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-black">
              ${currentPrice} <span className="text-xs font-bold text-neutral-500">MXN</span>
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              (~{estimate.estimatedDurationMinutes} min en mesa)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onBookOrProceed && (
            <button
              type="button"
              onClick={() => {
                triggerConfirmedVibration();
                onBookOrProceed(analysis);
              }}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <CalendarCheck className="size-4 text-pink-400" />
              <span>Continuar a Fecha & Especialista</span>
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MODAL: Specialist Price Override */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="size-4 text-pink-500" />
                <h3 className="text-sm font-black text-black">
                  Ajuste de Presupuesto en Cabina
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="size-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleApplyOverride} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-black block">
                  Nuevo Monto Cabina (MXN)
                </label>
                <input
                  type="number"
                  min="100"
                  max="5000"
                  value={customPriceInput}
                  onChange={(e) => setCustomPriceInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-black/15 font-mono text-sm font-bold text-black focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-black block">
                  Motivo del Ajuste Técnico
                </label>
                <select
                  value={overrideReasonCode}
                  onChange={(e) => setOverrideReasonCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-black/15 text-xs text-black focus:outline-none focus:border-pink-500 bg-white"
                >
                  {REASON_CODES.map(r => (
                    <option key={r.code} value={r.code}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-black block">
                  Nota Interna de Cabina (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={overrideTechnicianNote}
                  onChange={(e) => setOverrideTechnicianNote(e.target.value)}
                  placeholder="Ej: Clienta solicitó largo XL y 4 cristales Swarovski adicionales."
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs text-black focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="h-9 px-4 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold cursor-pointer"
                >
                  Guardar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
