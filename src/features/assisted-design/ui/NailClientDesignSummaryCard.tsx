import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Palette,
  Check,
  Copy,
  ChevronRight,
  Sparkle,
  Layers,
  Scissors,
  Eye,
  Info,
  CalendarCheck,
  SlidersHorizontal,
  Camera,
  HeartHandshake,
  CheckCircle2,
  Hand
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';
import { NailPhotoDetailedAnalysis } from '@/domain/quotes/entities/Inspiration';
import { SingleNailMiniPreviewSVG } from '@/shared/components/NailModelerVisualizerSVG';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';
import { HandId, FingerId } from '@/domain/quotes/entities/NailArtSemanticTypes';
import { triggerSelectionVibration, triggerConfirmedVibration } from '@/shared/utils/haptics';

export interface NailClientDesignSummaryCardProps {
  analysis: NailPhotoDetailedAnalysis;
  imageUrl?: string;
  onBookAppointment?: (analysis: NailPhotoDetailedAnalysis) => void;
  onCustomizeDetails?: (analysis: NailPhotoDetailedAnalysis) => void;
  onSelectNewPhoto?: () => void;
  onViewArtistSheet?: () => void;
  className?: string;
}

const FINGER_ORDER: { id: FingerId; label: string; heightFactor: number }[] = [
  { id: 'thumb', label: 'Pulgar', heightFactor: 0.85 },
  { id: 'index', label: 'Índice', heightFactor: 0.95 },
  { id: 'middle', label: 'Medio', heightFactor: 1.0 },
  { id: 'ring', label: 'Anular', heightFactor: 0.92 },
  { id: 'pinky', label: 'Meñique', heightFactor: 0.78 },
];

export function NailClientDesignSummaryCard({
  analysis,
  imageUrl,
  onBookAppointment,
  onCustomizeDetails,
  onSelectNewPhoto,
  onViewArtistSheet,
  className = '',
}: NailClientDesignSummaryCardProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedHand, setSelectedHand] = useState<HandId>('left');
  const [selectedFingerId, setSelectedFingerId] = useState<FingerId>('ring');

  const img = imageUrl || analysis.sourceImageUrl;
  const layers = analysis.layers;
  const estimate = analysis.estimateRange;

  const handleCopyColor = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    triggerSelectionVibration();
    toast.success(`Tono ${name} (${hex}) copiado`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const dominantHex = layers.chromatics.dominantColorHex || '#F7D2DE';
  const dominantName = layers.chromatics.dominantColorName || 'Rosa Nude Seda';
  const shape = layers.shape.value || 'almond';
  const length = layers.length.value || 'medium';
  const finish = layers.finish.value || 'glazed';

  return (
    <div className={cn('w-full text-left space-y-6', className)}>
      {/* 1. TOP EDITORIAL BANNER (Flush, edge-to-edge, white/black/pink) */}
      <div className="space-y-4 border-b border-black/[0.06] pb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {img ? (
              <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden shrink-0 border border-black/10 shadow-xs group">
                <img
                  src={img}
                  alt="Diseño de referencia"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {onSelectNewPhoto && (
                  <button
                    type="button"
                    onClick={onSelectNewPhoto}
                    title="Cambiar foto"
                    className="absolute bottom-1 right-1 size-6 rounded-lg bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <Camera className="size-3 text-pink-400" />
                  </button>
                )}
              </div>
            ) : (
              <div className="size-16 rounded-2xl bg-neutral-100 text-black flex items-center justify-center shrink-0">
                <Sparkles className="size-6 text-pink-500" />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Sparkle className="size-2.5 text-pink-400" />
                  Diseño Analizado
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {layers.structure.label}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-black tracking-tight">
                {dominantName} &bull; {layers.finish.label.split('(')[0].trim()}
              </h3>
              <p className="text-xs text-neutral-600 font-medium line-clamp-1">
                {layers.structure.description || 'Nivelación con técnica rusa y refuerzo estructural balanceado'}
              </p>
            </div>
          </div>

          {/* Pricing & Duration Hero Widget (Flush style) */}
          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-1 p-3.5 sm:p-0 rounded-2xl bg-neutral-50 sm:bg-transparent border sm:border-0 border-black/[0.06]">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                Rango Estimado en Salón
              </span>
              <div className="text-xl sm:text-2xl font-black text-black tracking-tight">
                ${estimate.minPrice} – ${estimate.maxPrice}{' '}
                <span className="text-xs font-bold text-neutral-500">MXN</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-600 font-medium">
              <Clock className="size-3.5 text-pink-500" />
              <span>~{estimate.estimatedDurationMinutes} min en cabina</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ATTRIBUTE MATRIX - FLUSH ROW (Forma, Largo, Acabado, Técnica) */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500">
          Especificaciones Clave del Set
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Forma */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors border border-black/[0.06]">
            <div className="size-11 rounded-xl bg-white border border-black/10 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
              <SingleNailMiniPreviewSVG
                shape={shape as any}
                length={length as any}
                colorHex={dominantHex}
                finish={finish as any}
                className="w-8 h-11 scale-90"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-neutral-500 uppercase block">Forma</span>
              <p className="text-xs font-bold text-black truncate">
                {layers.shape.label.split('(')[0].trim()}
              </p>
            </div>
          </div>

          {/* Largo */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors border border-black/[0.06]">
            <div className="size-11 rounded-xl bg-white border border-black/10 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
              <NailLengthSVG
                length={length as any}
                fillColor={dominantHex}
                className="w-6 h-10"
                showGuides={false}
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-neutral-500 uppercase block">Largo</span>
              <p className="text-xs font-bold text-black truncate">
                {layers.length.label.split('(')[0].trim()}
              </p>
            </div>
          </div>

          {/* Acabado */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors border border-black/[0.06]">
            <div className="size-11 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0">
              <Sparkle className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-neutral-500 uppercase block">Acabado</span>
              <p className="text-xs font-bold text-black truncate">
                {layers.finish.label.split('(')[0].trim()}
              </p>
            </div>
          </div>

          {/* Técnica */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors border border-black/[0.06]">
            <div className="size-11 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              <Layers className="size-5 text-pink-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-neutral-500 uppercase block">Técnica</span>
              <p className="text-xs font-bold text-black truncate">
                {layers.structure.value.split('+')[0].trim()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE 10-NAIL LEFT & RIGHT HAND VISUALIZER (Flush, containerless) */}
      <div className="space-y-4 pt-2 border-t border-black/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Hand className="size-3.5 text-pink-500" />
              Vista Previa Mano Izquierda / Derecha
            </h4>
            <p className="text-xs text-neutral-500">
              Visualiza los detalles de cada dedo para confirmar la armonía del diseño.
            </p>
          </div>

          {/* Hand Toggle */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                triggerSelectionVibration();
                setSelectedHand('left');
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                selectedHand === 'left'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-black'
              )}
            >
              Mano Izquierda
            </button>
            <button
              type="button"
              onClick={() => {
                triggerSelectionVibration();
                setSelectedHand('right');
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                selectedHand === 'right'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-black'
              )}
            >
              Mano Derecha
            </button>
          </div>
        </div>

        {/* 5 Finger Row */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 py-1">
          {FINGER_ORDER.map(({ id, label, heightFactor }) => {
            const isSelected = selectedFingerId === id;
            const isAccent = id === 'ring' || (id === 'middle' && layers.nailArt.complexity === 'french');

            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  triggerSelectionVibration();
                  setSelectedFingerId(id);
                }}
                className={cn(
                  'relative flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-2xl transition-all duration-200 text-center cursor-pointer min-h-[140px]',
                  isSelected
                    ? 'bg-pink-50/90 border-2 border-pink-500 shadow-xs ring-2 ring-pink-500/20 scale-[1.02]'
                    : isAccent
                    ? 'bg-neutral-50 hover:bg-pink-50/40 border border-pink-300'
                    : 'bg-neutral-50 hover:bg-neutral-100 border border-black/[0.06]'
                )}
              >
                <span className={cn(
                  "text-[10px] sm:text-xs font-extrabold truncate w-full",
                  isSelected ? "text-pink-700" : "text-black"
                )}>
                  {label}
                </span>

                <div
                  className="py-1 flex items-center justify-center transition-transform duration-200"
                  style={{ transform: `scale(${heightFactor})` }}
                >
                  <SingleNailMiniPreviewSVG
                    shape={shape as any}
                    length={length as any}
                    colorHex={isAccent && layers.chromatics.secondaryColorHex ? layers.chromatics.secondaryColorHex : dominantHex}
                    finish={finish as any}
                    className="w-8 h-12"
                  />
                </div>

                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                  {isAccent ? 'Acento' : 'Base'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. PALETTE SWATCHES & ACCENTS (Flush containerless) */}
      <div className="space-y-3 pt-2 border-t border-black/[0.06]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black text-black flex items-center gap-1.5">
            <Palette className="size-3.5 text-pink-500" />
            Paleta de Colorimetría
          </span>
          <span className="text-[11px] text-neutral-500">
            Toca un tono para copiar su código HEX
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {layers.chromatics.palette.map((color, idx) => {
            const isCopied = copiedHex === color.hex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCopyColor(color.hex, color.name)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-pink-50 hover:border-pink-300 border border-black/[0.06] transition-all text-left cursor-pointer group"
              >
                <div
                  className="size-4 rounded-full border border-black/20 shadow-2xs shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-bold text-black">
                  {color.name}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 group-hover:text-pink-600">
                  {color.hex}
                </span>
                {isCopied ? (
                  <Check className="size-3 text-pink-600" />
                ) : (
                  <Copy className="size-2.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            );
          })}
        </div>

        {layers.nailArt.elements.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-neutral-500 mr-1">Acentos incluidos:</span>
            {layers.nailArt.elements.map((el, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-black bg-pink-50 px-3 py-1 rounded-full border border-pink-200"
              >
                <Sparkles className="size-2.5 text-pink-500" />
                {el}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 5. BOTTOM ACTIONS (Flush, edge-to-edge) */}
      <div className="pt-4 border-t border-black/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {onViewArtistSheet && (
          <button
            type="button"
            onClick={onViewArtistSheet}
            className="h-11 px-4 rounded-xl text-xs font-bold text-black hover:bg-neutral-100 border border-black/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Scissors className="size-3.5 text-pink-500" />
            <span>Ver Ficha Técnica Pro Artista</span>
          </button>
        )}

        <div className="flex items-center gap-2.5">
          {onCustomizeDetails && (
            <button
              type="button"
              onClick={() => onCustomizeDetails(analysis)}
              className="flex-1 sm:flex-none h-11 px-4 rounded-xl text-xs font-bold text-black hover:bg-neutral-100 border border-black/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Personalizar Diseño</span>
            </button>
          )}

          {onBookAppointment && (
            <button
              type="button"
              onClick={() => {
                triggerConfirmedVibration();
                onBookAppointment(analysis);
              }}
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <CalendarCheck className="size-4 text-pink-400" />
              <span>Agendar con este Diseño</span>
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
