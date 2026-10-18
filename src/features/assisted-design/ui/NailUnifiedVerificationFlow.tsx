import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Palette,
  Scissors,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Camera,
  Layers,
  Sparkle,
  SlidersHorizontal,
  CalendarCheck,
  ShieldCheck,
  Copy,
  Info,
  Lock,
  Unlock,
  CheckCheck,
  Zap
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';
import {
  NailPhotoDetailedAnalysis,
  NailProcedureStep,
} from '@/domain/quotes/entities/Inspiration';
import {
  SingleNailMiniPreviewSVG,
  NailShapeType,
  NailLengthType,
  NailFinishType,
  FINISH_COLOR_PALETTES,
} from '@/shared/components/NailModelerVisualizerSVG';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';
import {
  triggerSelectionVibration,
  triggerConfirmedVibration,
} from '@/shared/utils/haptics';

export interface NailUnifiedVerificationFlowProps {
  analysis: NailPhotoDetailedAnalysis;
  imageUrl?: string;
  onApplyToQuote?: (updatedAnalysis: NailPhotoDetailedAnalysis) => void;
  onBookAppointment?: (updatedAnalysis: NailPhotoDetailedAnalysis) => void;
  onSelectNewPhoto?: () => void;
  className?: string;
}

const SHAPE_OPTIONS: { id: NailShapeType; label: string; vibe: string }[] = [
  { id: 'almond', label: 'Almendra', vibe: 'Elegante y estiliza los dedos' },
  { id: 'square', label: 'Cuadrada', vibe: 'Clásica, limpia y estructurada' },
  { id: 'squoval', label: 'Squoval', vibe: 'Bordes suaves, natural y resistente' },
  { id: 'coffin', label: 'Coffin / Ballerina', vibe: 'Moderna y estilizada' },
  { id: 'oval', label: 'Ovalada', vibe: 'Armoniosa y femenina' },
  { id: 'stiletto', label: 'Stiletto', vibe: 'Vanguardista y audaz' },
];

const LENGTH_OPTIONS: { id: NailLengthType; label: string; lengthMm: string; vibe: string }[] = [
  { id: 'short', label: 'Corto (Natural)', lengthMm: '~14 mm', vibe: 'Ideal para uso diario y máxima durabilidad' },
  { id: 'medium', label: 'Medio (Equilibrado)', lengthMm: '~18 mm', vibe: 'El favorito de salón: estético y cómodo' },
  { id: 'long', label: 'Largo (Estilizado)', lengthMm: '~22 mm', vibe: 'Mayor superficie para arte y efecto visual' },
  { id: 'xl', label: 'Extra Largo (Editorial)', lengthMm: '~28 mm', vibe: 'Impacto visual dramático de pasarela' },
];

const FINISH_OPTIONS: { id: NailFinishType; label: string; description: string }[] = [
  { id: 'glazed', label: 'Glazed Chrome / Hailey', description: 'Polvo aperlado nacarado con destello iridiscente' },
  { id: 'cat_eye', label: 'Cat-Eye 9D Terciopelo', description: 'Haz de luz magnético aterciopelado multidimensional' },
  { id: 'glossy', label: 'Glossy Cristal Pro', description: 'Brillo ultra espejo con sellado UV' },
  { id: 'french', label: 'French / Punta Delineada', description: 'Sonrisa francesa nítida sobre base nude translúcida' },
  { id: 'matte', label: 'Matte Tacto Seda', description: 'Acabado aterciopelado mate sin reflejos' },
];

export function NailUnifiedVerificationFlow({
  analysis,
  imageUrl,
  onApplyToQuote,
  onBookAppointment,
  onSelectNewPhoto,
  className = '',
}: NailUnifiedVerificationFlowProps) {
  // Simplified 2-Field Focus: Only Size & Style
  const [selectedShape, setSelectedShape] = useState<NailShapeType>(
    (analysis.layers.shape.value as NailShapeType) || 'almond'
  );
  const [selectedLength, setSelectedLength] = useState<NailLengthType>(
    (analysis.layers.length.value as NailLengthType) || 'medium'
  );

  // Auto-locked AI parameters from image (with optional unlock toggle)
  const [isAdvancedUnlocked, setIsAdvancedUnlocked] = useState<boolean>(false);
  const [selectedFinish, setSelectedFinish] = useState<NailFinishType>(() => {
    const raw = analysis.layers.finish?.value as string | undefined;
    if (raw === 'glossy' || raw === 'matte' || raw === 'glazed' || raw === 'cat_eye' || raw === 'french') {
      return raw as NailFinishType;
    }
    return 'glazed';
  });

  const [selectedColorHex, setSelectedColorHex] = useState<string>(
    analysis.layers.chromatics.dominantColorHex || '#F3C5BA'
  );
  const [selectedColorName, setSelectedColorName] = useState<string>(
    analysis.layers.chromatics.dominantColorName || 'Nude Rosé Seda'
  );
  const [selectedTipHex, setSelectedTipHex] = useState<string>('#FFFFFF');

  // Build the updated verified analysis object
  const verifiedAnalysis = useMemo<NailPhotoDetailedAnalysis>(() => {
    const shapeMeta = SHAPE_OPTIONS.find((s) => s.id === selectedShape);
    const lengthMeta = LENGTH_OPTIONS.find((l) => l.id === selectedLength);
    const finishMeta = FINISH_OPTIONS.find((f) => f.id === selectedFinish);

    // Calculate dynamic estimated price adjustment based on shape & length
    let baseMin = analysis.estimateRange?.minPrice || 480;
    let baseMax = analysis.estimateRange?.maxPrice || 620;

    if (selectedLength === 'long') {
      baseMin += 60;
      baseMax += 80;
    } else if (selectedLength === 'xl') {
      baseMin += 120;
      baseMax += 150;
    }

    const domainFinishValue = (selectedFinish === 'french' ? 'glossy' : selectedFinish) as
      | 'glossy'
      | 'matte'
      | 'chrome'
      | 'glazed'
      | 'cat_eye'
      | 'velvet'
      | 'aura'
      | 'jelly'
      | 'milky';

    return {
      ...analysis,
      overallConfidence: Math.max(analysis.overallConfidence || 0.94, 0.98),
      layers: {
        ...analysis.layers,
        shape: {
          ...analysis.layers.shape,
          value: selectedShape,
          isDetected: true,
          confidence: 0.99,
          label: shapeMeta?.label || selectedShape,
        },
        length: {
          ...analysis.layers.length,
          value: selectedLength,
          isDetected: true,
          confidence: 0.99,
          label: lengthMeta?.label || selectedLength,
        },
        finish: {
          ...analysis.layers.finish,
          value: domainFinishValue,
          label: finishMeta?.label || selectedFinish,
        },
        chromatics: {
          ...analysis.layers.chromatics,
          dominantColorHex: selectedColorHex,
          dominantColorName: selectedColorName,
        },
      },
      estimateRange: {
        ...analysis.estimateRange,
        minPrice: baseMin,
        maxPrice: baseMax,
      },
    };
  }, [analysis, selectedShape, selectedLength, selectedFinish, selectedColorHex, selectedColorName, selectedTipHex]);

  const handleCopySummary = () => {
    const shapeLabel = SHAPE_OPTIONS.find((s) => s.id === selectedShape)?.label;
    const lengthLabel = LENGTH_OPTIONS.find((l) => l.id === selectedLength)?.label;
    const text = `✨ Ficha de Diseño EMME Studio ✨\n• Forma: ${shapeLabel}\n• Largo: ${lengthLabel}\n• Tono Base: ${selectedColorName} (${selectedColorHex})\n• Acabado: ${selectedFinish}\n• Estimado: $${verifiedAnalysis.estimateRange.minPrice} - $${verifiedAnalysis.estimateRange.maxPrice} MXN`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success('Ficha copiada al portapapeles');
    }
  };

  const activePalette = FINISH_COLOR_PALETTES[selectedFinish] || FINISH_COLOR_PALETTES.glossy;

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-4', className)}>
      {/* Top AI Smart Extraction Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-r from-pink-500/10 via-rose-500/5 to-purple-500/10 border border-pink-200/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#E05286] to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-base sm:text-lg text-[#1D1D1F]">
                Diseño Detectado con IA
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                98% Exactitud
              </span>
            </div>
            <p className="text-xs text-[#6E6E73] font-medium">
              Confirmación simplificada: solo define tu <strong className="text-[#1D1D1F]">Largo</strong> y <strong className="text-[#1D1D1F]">Silueta</strong>
            </p>
          </div>
        </div>

        {onSelectNewPhoto && (
          <button
            type="button"
            onClick={onSelectNewPhoto}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 border border-black/10 text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all shrink-0"
          >
            <Camera className="size-3.5 text-[#E05286]" />
            <span>Cambiar Foto</span>
          </button>
        )}
      </div>

      {/* Main Grid: Reference vs Interactive Model & 2-Choice Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        
        {/* Left Visual Comparison: Uploaded Image + Live SVG Nail Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl border border-black/[0.06] p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              Comparativa Visual en Tiempo Real
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Photo Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/5 bg-neutral-100 border border-black/5 flex items-center justify-center group shadow-inner">
                {imageUrl || analysis.sourceImageUrl ? (
                  <img
                    src={imageUrl || analysis.sourceImageUrl}
                    alt="Referencia de Uñas"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center text-[#86868B]">
                    <Camera className="size-6 mb-1 text-[#E05286]" />
                    <span className="text-[10px] font-semibold">Foto de Inspiración</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-xl bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold text-center">
                  Tu Referencia
                </div>
              </div>

              {/* Live SVG Modeler */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/5 bg-linear-to-b from-pink-50/50 to-neutral-50 border border-pink-100/80 flex flex-col items-center justify-center p-3 shadow-inner">
                <SingleNailMiniPreviewSVG
                  shape={selectedShape}
                  length={selectedLength}
                  colorHex={selectedColorHex}
                  finish={selectedFinish}
                  tipHex={selectedTipHex}
                  className="w-16 h-28 drop-shadow-md transition-all duration-300"
                />
                <div className="mt-2 text-center">
                  <span className="text-[11px] font-bold text-[#1D1D1F] block">
                    {SHAPE_OPTIONS.find((s) => s.id === selectedShape)?.label}
                  </span>
                  <span className="text-[10px] text-[#E05286] font-semibold block">
                    {LENGTH_OPTIONS.find((l) => l.id === selectedLength)?.label.split('(')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs Footnote */}
            <div className="pt-2 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-[#86868B]">
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-[#E05286]" />
                Duración: ~{verifiedAnalysis.estimateRange.estimatedDurationMinutes} min
              </span>
              <span className="font-bold text-[#1D1D1F]">
                Dificultad: {analysis.layers.nailArt?.difficultyRating || 'Intermedio'}
              </span>
            </div>
          </div>

          {/* Locked AI Attributes Info Card */}
          <div className="bg-[#FAF7F9] rounded-3xl border border-pink-200/60 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Lock className="size-3.5 text-[#E05286]" />
                Atributos Detectados & Bloqueados
              </span>
              <button
                type="button"
                onClick={() => setIsAdvancedUnlocked(!isAdvancedUnlocked)}
                className="text-[10px] font-bold text-[#E05286] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isAdvancedUnlocked ? (
                  <>
                    <Lock className="size-3" />
                    Bloquear Opciones
                  </>
                ) : (
                  <>
                    <Unlock className="size-3" />
                    Desbloquear Avanzado
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-[#6E6E73] leading-relaxed">
              El color base, acabado nacarado y técnica se calibraron automáticamente de tu foto para replicarla con exactitud.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-white border border-pink-100 flex items-center gap-2">
                <div
                  className="size-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                  style={{ backgroundColor: selectedColorHex }}
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#1D1D1F] block truncate">
                    {selectedColorName}
                  </span>
                  <span className="text-[9px] text-[#86868B] block">Color Base</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-pink-100 flex items-center gap-2">
                <Sparkle className="size-4 text-[#E05286] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#1D1D1F] block truncate">
                    {FINISH_OPTIONS.find((f) => f.id === selectedFinish)?.label.split('/')[0]}
                  </span>
                  <span className="text-[9px] text-[#86868B] block">Efecto / Acabado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 2 Clean Choices (Largo & Silueta) + Actions */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* STEP 1: SILUETA & SHAPE STYLE */}
          <div className="bg-white rounded-3xl border border-black/[0.06] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E05286] block">
                  Paso 1 de 2
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                  Silueta & Estilo de Uña
                </h4>
              </div>
              <span className="text-xs font-black text-[#E05286] px-2.5 py-1 rounded-full bg-pink-50 border border-pink-100">
                {SHAPE_OPTIONS.find((s) => s.id === selectedShape)?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SHAPE_OPTIONS.map((shape) => {
                const isSelected = selectedShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      setSelectedShape(shape.id);
                    }}
                    className={cn(
                      'p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-2.5',
                      isSelected
                        ? 'bg-pink-50/70 border-[#E05286] ring-2 ring-[#E05286]/15 shadow-xs'
                        : 'bg-white hover:bg-neutral-50 border-black/[0.06]'
                    )}
                  >
                    <div className="size-8 rounded-xl bg-white border border-black/10 flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
                      <SingleNailMiniPreviewSVG
                        shape={shape.id}
                        length={selectedLength}
                        colorHex={selectedColorHex}
                        finish={selectedFinish}
                        tipHex={selectedTipHex}
                        className="w-4 h-6"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#1D1D1F] block truncate">
                        {shape.label}
                      </span>
                      <span className="text-[10px] text-[#86868B] truncate block">
                        {shape.vibe}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="size-4 rounded-full bg-[#E05286] text-white flex items-center justify-center shrink-0">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: LARGO / SIZE */}
          <div className="bg-white rounded-3xl border border-black/[0.06] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E05286] block">
                  Paso 2 de 2
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                  Largo Deseado (Size)
                </h4>
              </div>
              <span className="text-xs font-black text-[#E05286] px-2.5 py-1 rounded-full bg-pink-50 border border-pink-100">
                {LENGTH_OPTIONS.find((l) => l.id === selectedLength)?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LENGTH_OPTIONS.map((len) => {
                const isSelected = selectedLength === len.id;
                return (
                  <button
                    key={len.id}
                    type="button"
                    onClick={() => {
                      triggerSelectionVibration();
                      setSelectedLength(len.id);
                    }}
                    className={cn(
                      'p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3',
                      isSelected
                        ? 'bg-pink-50/70 border-[#E05286] ring-2 ring-[#E05286]/15 shadow-xs'
                        : 'bg-white hover:bg-neutral-50 border-black/[0.06]'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-xl bg-white border border-black/10 flex items-center justify-center shrink-0 shadow-2xs">
                        <NailLengthSVG
                          length={len.id}
                          fillColor={selectedColorHex}
                          className="w-4 h-6"
                          showGuides={false}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#1D1D1F] block truncate">
                          {len.label}
                        </span>
                        <span className="text-[10px] text-[#86868B] block">
                          {len.lengthMm} &bull; {len.vibe}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="size-4 rounded-full bg-[#E05286] text-white flex items-center justify-center shrink-0">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Advanced Unlocked Panel (Color & Finish) */}
          {isAdvancedUnlocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl border border-pink-200 p-4 sm:p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-2">
                <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <Palette className="size-3.5 text-[#E05286]" />
                  Ajuste Manual de Color & Acabado
                </span>
                <span className="text-[10px] text-[#86868B]">Modo Experto</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1D1D1F] block">Tonalidad Base</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activePalette.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => {
                        setSelectedColorHex(color.hex);
                        setSelectedColorName(color.name);
                      }}
                      className={cn(
                        'p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all',
                        selectedColorHex === color.hex ? 'border-[#E05286] bg-pink-50' : 'border-black/5 bg-white'
                      )}
                    >
                      <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                      <span className="text-[11px] font-semibold text-[#1D1D1F] truncate">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-black/[0.05]">
                <span className="text-xs font-bold text-[#1D1D1F] block">Efecto de Salón</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {FINISH_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFinish(f.id)}
                      className={cn(
                        'p-2 rounded-xl border text-left cursor-pointer transition-all',
                        selectedFinish === f.id ? 'border-[#E05286] bg-pink-50' : 'border-black/5 bg-white'
                      )}
                    >
                      <span className="text-xs font-bold text-[#1D1D1F] block">{f.label}</span>
                      <span className="text-[10px] text-[#86868B] block truncate">{f.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Pricing & 1-Tap Booking Actions */}
          <div className="bg-linear-to-br from-[#1D1D1F] to-[#2D2D30] text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 block">
                  Cotización Transparente
                </span>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white">
                  ${verifiedAnalysis.estimateRange.minPrice} – ${verifiedAnalysis.estimateRange.maxPrice}{' '}
                  <span className="text-xs font-normal text-white/70">MXN</span>
                </div>
                <p className="text-[11px] text-white/70 mt-0.5">
                  Incluye técnica rusa de cutícula, nivelación estructural y sellado UV
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/80 shrink-0 bg-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-xs">
                <Clock className="size-4 text-pink-300" />
                <span>~{verifiedAnalysis.estimateRange.estimatedDurationMinutes} min en cabina</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {onBookAppointment && (
                <button
                  type="button"
                  onClick={() => {
                    triggerConfirmedVibration();
                    onBookAppointment(verifiedAnalysis);
                  }}
                  className="flex-1 h-12 rounded-2xl bg-[#E05286] hover:bg-[#d04377] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 active:scale-98 transition-all cursor-pointer"
                >
                  <CalendarCheck className="size-4" />
                  <span>✨ Confirmar Diseño y Agendar Cita</span>
                </button>
              )}

              {onApplyToQuote && (
                <button
                  type="button"
                  onClick={() => {
                    triggerConfirmedVibration();
                    onApplyToQuote(verifiedAnalysis);
                  }}
                  className="h-12 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                >
                  <SlidersHorizontal className="size-3.5" />
                  <span>Guardar Cotización</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopySummary}
                className="h-12 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Copiar resumen"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
