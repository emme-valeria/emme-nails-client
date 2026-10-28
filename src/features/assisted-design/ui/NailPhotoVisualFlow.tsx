import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Camera, 
  Upload, 
  RotateCcw,
  CalendarCheck,
  ShieldCheck,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RefreshCw,
  Gem,
  Sparkle,
  Zap,
  Info,
  ImageOff,
  AlertCircle
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';
import { NailShapeSelector, NailShape, NAIL_SHAPES } from '@/shared/components/NailShapeSelector';
import { NailLengthSelector, NailLength, NAIL_LENGTHS } from '@/shared/components/NailLengthSelector';
import { NailShapeSVG } from '@/shared/components/NailShapeSVG';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';
import { 
  triggerStepVibration, 
  triggerSelectionVibration, 
  triggerConfirmedVibration 
} from '@/shared/utils/haptics';
import { 
  analyzeNailReferenceWithGemini, 
  GeminiNailImageAnalysis 
} from '@/shared/services/geminiService';
import { optimizeImageForAI } from '@/shared/utils/imageOptimizer';
import { EmmeCameraScanFlow } from './EmmeCameraScanFlow';

export type PhotoVisualStep = 'step-image' | 'step-customize' | 'step-shape' | 'step-size' | 'step-removal' | 'step-summary';

export type RemovalOptionType = 'none' | 'acrylic' | 'gelx';

export interface RemovalOption {
  id: RemovalOptionType;
  title: string;
  subtitle: string;
  description: string;
  priceMXN: number;
  durationMins: number;
  badge?: string;
  popular?: boolean;
}

export const REMOVAL_OPTIONS: RemovalOption[] = [
  {
    id: 'none',
    title: 'Sin retiro',
    subtitle: 'Gratis · 0 min',
    description: 'Uñas naturales o limpias',
    priceMXN: 0,
    durationMins: 0,
    badge: 'Sin Retiro'
  },
  {
    id: 'acrylic',
    title: 'Acrílico / Escultural',
    subtitle: '+$120 MXN · +25 min',
    description: 'Retiro con torno y cuidado de la uña',
    priceMXN: 120,
    durationMins: 25,
    popular: true,
    badge: 'Acrílico'
  },
  {
    id: 'gelx',
    title: 'Gel-X / Rubber / Gel',
    subtitle: '+$80 MXN · +15 min',
    description: 'Disolución y pulido suave',
    priceMXN: 80,
    durationMins: 15,
    badge: 'Gel-X'
  }
];

export interface NailPhotoVisualFlowProps {
  initialImageUrl?: string;
  initialStep?: PhotoVisualStep;
  initialShape?: NailShape;
  initialLength?: NailLength;
  initialRemoval?: RemovalOptionType;
  onCompleteBooking?: (data: {
    imageUrl: string;
    shape: NailShape;
    length: NailLength;
    removal: RemovalOptionType;
    totalPriceMXN: number;
    depositMXN: number;
    durationMins: number;
    geminiAnalysis?: GeminiNailImageAnalysis | null;
  }) => void;
  onProceedToAvailability?: (data: {
    imageUrl: string;
    shape: NailShape;
    length: NailLength;
    removal: RemovalOptionType;
    totalPriceMXN: number;
    depositMXN: number;
    durationMins: number;
    geminiAnalysis?: GeminiNailImageAnalysis | null;
  }) => void;
  onCancel?: () => void;
  className?: string;
}

// Convert image URL or File to optimized base64 for Gemini multimodal analysis
async function getOptimizedImageData(urlOrBlob: string | File): Promise<{ base64: string; mimeType: string }> {
  try {
    const optimized = await optimizeImageForAI(urlOrBlob, 1024, 0.82);
    return { base64: optimized.base64, mimeType: optimized.mimeType };
  } catch {
    return { base64: '', mimeType: 'image/jpeg' };
  }
}

export function NailPhotoVisualFlow({
  initialImageUrl,
  initialStep = 'step-image',
  initialShape = 'almond',
  initialLength = 'medium',
  initialRemoval = 'none',
  onCompleteBooking,
  onProceedToAvailability,
  onCancel,
  className = ''
}: NailPhotoVisualFlowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize initial step
  const normalizedInitialStep: PhotoVisualStep = 
    initialStep === 'step-shape' || initialStep === 'step-size' || initialStep === 'step-removal' 
      ? 'step-customize' 
      : initialStep;

  // Current sub-step in the flow
  const [currentStep, setCurrentStep] = useState<PhotoVisualStep>(normalizedInitialStep);

  // Selected Image state (no pre-selected image by default)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(initialImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  // Gemini Multimodal AI State
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiNailImageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [noNailsDetected, setNoNailsDetected] = useState(false);
  const [noNailsReason, setNoNailsReason] = useState<string | null>(null);

  // Configuration state
  const [selectedShape, setSelectedShape] = useState<NailShape>(initialShape);
  const [selectedLength, setSelectedLength] = useState<NailLength>(initialLength);
  const [selectedRemoval, setSelectedRemoval] = useState<RemovalOptionType>(initialRemoval);
  const [useCameraFlow, setUseCameraFlow] = useState(true);

  // Trigger Gemini Analysis when image changes
  const runGeminiImageAnalysis = async (imgSource: string | File, title?: string) => {
    try {
      setIsAnalyzing(true);
      setNoNailsDetected(false);
      setNoNailsReason(null);

      const { base64, mimeType } = await getOptimizedImageData(imgSource);
      if (!base64) {
        // Fallback default analysis if image data not accessible
        setGeminiAnalysis({
          technique: 'Soft Gel con Nivelación',
          recommendedService: 'Manicura Estructural Soft Gel',
          complexity: 'Intermedio',
          detectedStyle: title || 'Diseño de Salón',
          detectedColors: ['#F3C5BA', '#FFFFFF', '#E05286'],
          detectedShape: 'Almendra',
          detectedLength: 'Medio (M)',
          detectedExtras: [
            { name: 'Nail Art / Acabado Especial', estimatedCost: 80 }
          ],
          estimatedDurationMinutes: 80,
          basePrice: 420,
          artPrice: 80,
          totalEstimatedPrice: 500,
          description: 'Diseño elegante y estilizado con manicura rusa de precisión.',
          stylistTip: 'Recomendamos forma Almendra o Coffin para maximizar la durabilidad del set.',
          nailsDetected: true
        });
        setIsAnalyzing(false);
        return;
      }

      const result = await analyzeNailReferenceWithGemini(base64, mimeType, title);
      
      // Check if image contains nails or manicure
      if (result.nailsDetected === false) {
        setNoNailsDetected(true);
        setNoNailsReason(result.rejectionReason || 'No logramos identificar manos o uñas en la imagen proporcionada.');
        setGeminiAnalysis(result);
        setIsAnalyzing(false);
        toast.error('No se detectaron uñas en la imagen.');
        return;
      }

      setNoNailsDetected(false);
      setNoNailsReason(null);
      setGeminiAnalysis(result);

      // Auto-suggest shape if detected by Gemini
      if (result.detectedShape) {
        const sLower = result.detectedShape.toLowerCase();
        if (sLower.includes('almend') || sLower.includes('almond')) setSelectedShape('almond');
        else if (sLower.includes('coffin')) setSelectedShape('coffin');
        else if (sLower.includes('cuadr')) setSelectedShape('square');
        else if (sLower.includes('oval')) setSelectedShape('oval');
        else if (sLower.includes('stiletto')) setSelectedShape('stiletto');
        else if (sLower.includes('squoval')) setSelectedShape('squoval');
      }

      // Auto-suggest length if detected by Gemini
      if (result.detectedLength) {
        const lLower = result.detectedLength.toLowerCase();
        if (lLower.includes('corto') || lLower.includes('(s)')) setSelectedLength('short');
        else if (lLower.includes('medio') || lLower.includes('(m)')) setSelectedLength('medium');
        else if (lLower.includes('largo') || lLower.includes('(l)')) setSelectedLength('long');
        else if (lLower.includes('extra') || lLower.includes('(xl)')) setSelectedLength('xl');
      }
    } catch (err) {
      console.warn('Gemini analysis fallback:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // The camera flow owns initial image analysis; only analyze here in classic mode.
  useEffect(() => {
    if (selectedImageUrl && !useCameraFlow && currentStep === 'step-image') {
      runGeminiImageAnalysis(selectedImageUrl);
    }
  }, [selectedImageUrl, useCameraFlow, currentStep]);

  // Step metadata: 3-step streamlined flow
  const stepsList = [
    { id: 'step-image' as const, num: 1, title: 'Foto de Referencia', subtitle: 'Sube tu inspiración', shortLabel: 'Foto', icon: Camera },
    { id: 'step-customize' as const, num: 2, title: 'Personalización', subtitle: 'Forma, largo y retiro', shortLabel: 'Opciones', icon: SlidersHorizontal },
    { id: 'step-summary' as const, num: 3, title: 'Resumen & Cotización', subtitle: 'Desglose transparente', shortLabel: 'Resumen', icon: CalendarCheck },
  ];

  // Resolve current active step meta
  const currentStepKey = currentStep === 'step-shape' || currentStep === 'step-size' || currentStep === 'step-removal' 
    ? 'step-customize' 
    : currentStep;
  const currentStepIndex = stepsList.findIndex((s) => s.id === currentStepKey);
  const activeStepMeta = stepsList[currentStepIndex] || stepsList[0];

  // Calculate pricing transparently using Gemini insights + user selections
  const pricing = useMemo(() => {
    const basePrice = geminiAnalysis?.basePrice ?? 420;
    const artPrice = geminiAnalysis?.artPrice ?? 80;
    let baseDuration = geminiAnalysis?.estimatedDurationMinutes || 75;

    // Length extra
    let lengthExtra = 0;
    const lLower = selectedLength.toLowerCase();
    if (lLower === 'medium') {
      lengthExtra = 50;
    } else if (lLower === 'long') {
      lengthExtra = 100;
      baseDuration += 15;
    } else if (lLower === 'xl') {
      lengthExtra = 150;
      baseDuration += 25;
    }

    // Removal extra
    const removalObj = REMOVAL_OPTIONS.find((r) => r.id === selectedRemoval) || REMOVAL_OPTIONS[0];
    const removalExtra = removalObj.priceMXN;
    const removalDuration = removalObj.durationMins;

    const totalPriceMXN = basePrice + artPrice + lengthExtra + removalExtra;
    const depositMXN = Math.max(150, Math.round(totalPriceMXN * 0.3));
    const totalDurationMins = baseDuration + removalDuration;

    return {
      basePrice,
      artPrice,
      lengthExtra,
      removalExtra,
      totalPriceMXN,
      depositMXN,
      balanceInSalon: totalPriceMXN - depositMXN,
      totalDurationMins,
      durationFormatted: `${Math.floor(totalDurationMins / 60)}h ${totalDurationMins % 60 > 0 ? `${totalDurationMins % 60}m` : ''}`.trim()
    };
  }, [geminiAnalysis, selectedLength, selectedRemoval]);

  // Step transitions
  const handleNext = () => {
    triggerStepVibration();
    if (currentStep === 'step-image') {
      setCurrentStep('step-customize');
    } else if (currentStep === 'step-customize' || currentStep === 'step-shape' || currentStep === 'step-size' || currentStep === 'step-removal') {
      setCurrentStep('step-summary');
    }
  };

  const handleBack = () => {
    triggerStepVibration();
    if (currentStep === 'step-summary') {
      setCurrentStep('step-customize');
    } else if (currentStep === 'step-customize' || currentStep === 'step-shape' || currentStep === 'step-size' || currentStep === 'step-removal') {
      setCurrentStep('step-image');
    } else if (currentStep === 'step-image' && onCancel) {
      onCancel();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    triggerSelectionVibration();

    const localUrl = URL.createObjectURL(file);
    setSelectedImageUrl(localUrl);
    setNoNailsDetected(false);
    setNoNailsReason(null);
    setIsUploading(false);
    toast.success('¡Foto cargada! Analizando...');
    runGeminiImageAnalysis(file);
  };

  const handleFinishBooking = () => {
    triggerConfirmedVibration();
    const payload = {
      imageUrl: selectedImageUrl,
      shape: selectedShape,
      length: selectedLength,
      removal: selectedRemoval,
      totalPriceMXN: pricing.totalPriceMXN,
      depositMXN: pricing.depositMXN,
      durationMins: pricing.totalDurationMins,
      geminiAnalysis
    };

    if (onProceedToAvailability) {
      onProceedToAvailability(payload);
    } else if (onCompleteBooking) {
      onCompleteBooking(payload);
    } else {
      toast.success('¡Diseño cotizado con éxito!');
    }
  };

    if (useCameraFlow && currentStep === 'step-image') {
      return (
        <div className={cn('w-full max-w-md mx-auto space-y-4 text-left', className)}>
          <EmmeCameraScanFlow
            prefilledImageUrl={selectedImageUrl || undefined}
            onCancel={() => {
              if (onCancel) onCancel();
              else setUseCameraFlow(false);
            }}
            onProceedToBooking={(payload) => {
              if (payload.imageUrl) setSelectedImageUrl(payload.imageUrl);
              if (payload.analysis) setGeminiAnalysis(payload.analysis);
              let resolvedShape = selectedShape;
              let resolvedLength = selectedLength;
              if (payload.shape) {
                const s = payload.shape.toLowerCase();
                if (s.includes('almend') || s.includes('almond')) resolvedShape = 'almond';
                else if (s.includes('coffin')) resolvedShape = 'coffin';
                else if (s.includes('cuadr')) resolvedShape = 'square';
                else if (s.includes('oval')) resolvedShape = 'oval';
                else if (s.includes('stiletto')) resolvedShape = 'stiletto';
                else if (s.includes('squoval')) resolvedShape = 'squoval';
                setSelectedShape(resolvedShape);
              }
              if (payload.length) {
                const l = payload.length.toLowerCase();
                if (l.includes('corto') || l.includes('(s)')) resolvedLength = 'short';
                else if (l.includes('medio') || l.includes('(m)')) resolvedLength = 'medium';
                else if (l.includes('extra') || l.includes('(xl)')) resolvedLength = 'xl';
                else if (l.includes('largo') || l.includes('(l)')) resolvedLength = 'long';
                setSelectedLength(resolvedLength);
              }

              const bookingData = {
                imageUrl: payload.imageUrl,
                shape: resolvedShape,
                length: resolvedLength,
                removal: selectedRemoval,
                totalPriceMXN: payload.totalPrice,
                depositMXN: Math.round(payload.totalPrice * 0.25),
                durationMins: payload.durationMins,
                geminiAnalysis: payload.analysis,
              };

              if (onProceedToAvailability) {
                onProceedToAvailability(bookingData);
              } else if (onCompleteBooking) {
                onCompleteBooking(bookingData);
              } else {
                setUseCameraFlow(false);
                setCurrentStep('step-summary');
              }
            }}
          />

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setUseCameraFlow(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors cursor-pointer"
            >
              ¿Prefieres el modo clásico de carga de archivo? Haz clic aquí
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={cn('w-full max-w-2xl mx-auto space-y-6 text-left', className)}>
      
      {/* 1. Header & Step Progress - Fluid, Aesthetic & Interactive */}
      <div className="space-y-4 pb-2">
        {/* Step Segmented Progress Bar */}
        <div className="grid grid-cols-3 gap-2">
          {stepsList.map((st, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isAccessible = idx <= currentStepIndex || (selectedImageUrl && idx <= 1);

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  if (isAccessible) {
                    triggerStepVibration();
                    setCurrentStep(st.id);
                  }
                }}
                disabled={!isAccessible}
                aria-label={`Ir al paso ${idx + 1}: ${st.title}`}
                className={cn(
                  'group text-left transition-all duration-200 relative flex flex-col gap-1.5 focus:outline-none select-none',
                  isAccessible ? 'cursor-pointer' : 'cursor-default opacity-60'
                )}
              >
                {/* Segment Bar */}
                <div className="h-1.5 sm:h-2 w-full rounded-full bg-black/[0.05] overflow-hidden relative">
                  {isCompleted && (
                    <div className="h-full w-full bg-primary rounded-full transition-all duration-200" />
                  )}
                  {isCurrent && (
                    <div className="h-full w-full bg-primary rounded-full shadow-2xs transition-all duration-200" />
                  )}
                </div>

                {/* Desktop Step Label with Icon */}
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium transition-colors">
                  <div
                    className={cn(
                      'size-4 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors',
                      isCurrent
                        ? 'bg-primary text-white font-bold'
                        : isCompleted
                        ? 'bg-primary/15 text-primary'
                        : 'bg-black/[0.05] text-[#86868B]'
                    )}
                  >
                    {isCompleted ? <Check className="size-2.5 stroke-[3]" /> : st.num}
                  </div>
                  <span
                    className={cn(
                      'truncate transition-colors',
                      isCurrent
                        ? 'text-[#1D1D1F] font-bold'
                        : isCompleted
                        ? 'text-[#636366] group-hover:text-primary font-medium'
                        : 'text-[#86868B]'
                    )}
                  >
                    {st.shortLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Step Title & Navigation Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {currentStepIndex > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="size-10 rounded-full border border-black/[0.08] hover:border-primary/40 bg-white hover:bg-neutral-50 flex items-center justify-center text-[#1D1D1F] transition-all cursor-pointer shadow-2xs active:scale-90"
                aria-label="Volver al paso anterior"
              >
                <ArrowLeft className="size-4 stroke-[2.25]" />
              </button>
            ) : (
              onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="size-10 rounded-full border border-black/[0.08] hover:border-primary/40 bg-white hover:bg-neutral-50 flex items-center justify-center text-[#1D1D1F] transition-all cursor-pointer shadow-2xs active:scale-90"
                  title="Volver al catálogo"
                >
                  <ArrowLeft className="size-4 stroke-[2.25]" />
                </button>
              )
            )}

            {/* Snappy Lightweight Title Header */}
            <div className="space-y-0.5 transition-all duration-150">
              <p className="text-xs text-[#86868B]">
                {activeStepMeta.subtitle}
              </p>
              <h2 className="text-base sm:text-xl font-display font-bold text-[#1D1D1F] tracking-tight">
                {activeStepMeta.title}
              </h2>
            </div>
          </div>

          {/* Right Step Indicator (Paso X de 3) */}
          <div className="flex items-center">
            <span className="text-xs font-bold text-[#1D1D1F] bg-neutral-100/90 border border-black/[0.04] px-3 py-1.5 rounded-xl whitespace-nowrap shadow-2xs">
              Paso {activeStepMeta.num} de 3
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="bg-transparent p-0 shadow-none border-0">
        <AnimatePresence initial={false}>
          
          {/* ========================================================= */}
          {/* STEP 1: CLEAN PHOTO UPLOAD (APPLE HIG PREMIUM)             */}
          {/* ========================================================= */}
          {currentStep === 'step-image' && (
            <motion.div
              key="step-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {!selectedImageUrl ? (
                /* Empty State: Minimalist Soft Glass Upload Zone with Fixed 1:1 Aspect Ratio */
                <div
                  onClick={() => {
                    triggerSelectionVibration();
                    fileInputRef.current?.click();
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setIsUploading(true);
                      triggerSelectionVibration();
                      const localUrl = URL.createObjectURL(file);
                      setSelectedImageUrl(localUrl);
                      setNoNailsDetected(false);
                      setNoNailsReason(null);
                      setIsUploading(false);
                      toast.success('¡Foto cargada! Analizando...');
                      runGeminiImageAnalysis(file);
                    }
                  }}
                  className="group relative w-full aspect-square rounded-3xl border border-slate-200/60 bg-slate-50/80 backdrop-blur-md hover:bg-slate-100/60 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer active:scale-[0.99] shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                >
                  <div className="size-14 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-primary mb-3.5 group-hover:scale-105 transition-transform">
                    <Camera className="size-6 stroke-[1.75]" />
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 tracking-tight">
                    Sube tu foto de referencia
                  </h3>
                  <p className="text-xs text-slate-500 max-w-[280px] mt-1 mb-4 leading-relaxed font-normal">
                    Captura de Instagram, Pinterest o foto de tus manos
                  </p>

                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow-[0_2px_10px_rgba(224,82,134,0.22)] hover:brightness-105 transition-all">
                    <Upload className="size-3.5" />
                    <span>Elegir Foto</span>
                  </div>
                </div>
              ) : noNailsDetected ? (
                /* ========================================================= */
                /* SCREEN: NO NAILS DETECTED IN IMAGE (MINIMAL)              */
                /* ========================================================= */
                <motion.div
                  key="no-nails-detected-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full aspect-square rounded-3xl border border-rose-200/80 bg-rose-50/20 backdrop-blur-md p-8 text-center flex flex-col items-center justify-center space-y-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                >
                  {/* Red Icon */}
                  <div className="size-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200/80 shadow-2xs">
                    <ImageOff className="size-7 stroke-[2]" />
                  </div>

                  {/* Single Minimal Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    No detectamos uñas en esta foto
                  </h3>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 w-full max-w-xs">
                    <button
                      type="button"
                      onClick={() => {
                        triggerSelectionVibration();
                        fileInputRef.current?.click();
                      }}
                      className="w-full h-11 px-4 rounded-full bg-primary text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(224,82,134,0.2)] hover:brightness-105 transition-all cursor-pointer"
                    >
                      <Upload className="size-4" />
                      <span>Subir otra foto</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* State with Photo Loaded: Rounded-3xl, aspect-square (1:1), soft depth shadow & floating translucent capsule */
                <div className="space-y-5">
                  <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-slate-100/80 shadow-lg shadow-pink-500/5 bg-slate-50 group mx-auto">
                    <img
                      src={selectedImageUrl}
                      alt="Foto de referencia"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3.5 right-3.5 flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          triggerSelectionVibration();
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <RefreshCw className="size-3" />
                        <span>Cambiar foto</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={() => {
                      triggerStepVibration();
                      if (!geminiAnalysis) {
                        runGeminiImageAnalysis(selectedImageUrl);
                      }
                      setCurrentStep('step-customize');
                    }}
                    className="w-full h-12.5 px-6 rounded-full bg-primary hover:brightness-105 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(224,82,134,0.25)] cursor-pointer active:scale-98 transition-all disabled:opacity-75"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="size-4 animate-spin" />
                        <span>Analizando diseño con IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        <span>Personalizar opciones →</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: APPLE HIG LUXURY SELECTION FLOW (QUARTZ / NUDE)    */}
          {/* ========================================================= */}
          {(currentStep === 'step-customize' || currentStep === 'step-shape' || currentStep === 'step-size' || currentStep === 'step-removal') && (
            <motion.div
              key="step-customize"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-3 sm:space-y-4.5 max-w-lg mx-auto"
            >
              {/* 1. Hero Product Protagonist Card */}
              <div className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-3xl bg-white/70 backdrop-blur-md border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-center relative overflow-hidden transition-all">
                {/* Large Floating Protagonist Nail Render */}
                <div className="py-1 flex items-center justify-center filter drop-shadow-md transition-all duration-300 transform hover:scale-105">
                  <NailShapeSVG
                    shape={selectedShape}
                    length={selectedLength}
                    fillColor="#E05286"
                    className="w-11 h-16 sm:w-14 sm:h-22 transition-all duration-300"
                  />
                </div>

                {/* Clean High-End Editorial Typography */}
                <div className="mt-1 space-y-0.5">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                    {selectedShape === 'almond' ? 'Almendra' : selectedShape === 'square' ? 'Cuadrada' : selectedShape === 'coffin' ? 'Coffin' : selectedShape === 'stiletto' ? 'Stiletto' : selectedShape === 'squoval' ? 'Squoval' : selectedShape === 'oval' ? 'Ovalada' : selectedShape} · {selectedLength === 'short' ? 'Corto' : selectedLength === 'medium' ? 'Mediano' : selectedLength === 'long' ? 'Largo' : 'Extra Largo'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-normal">
                    {selectedRemoval === 'none' ? 'Sin retiro previo' : selectedRemoval === 'acrylic' ? 'Retiro de Acrílico (+30 min)' : 'Retiro de Soft Gel (+20 min)'}
                  </p>
                </div>
              </div>

              {/* 2. Integrated Minimalist Selection Layout */}
              <div className="space-y-2 sm:space-y-3 pt-0.5">
                {/* Row 1: Forma de Uña */}
                <div className="space-y-1 text-left">
                  <div className="px-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-800 tracking-tight">
                      Forma de Uña
                    </span>
                  </div>
                  
                  {/* Capsule Row with Right-Edge Gradient Fade and 24px (pr-6) end padding */}
                  <div className="relative">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 pr-6">
                      {[
                        { id: 'almond' as const, label: 'Almendra' },
                        { id: 'square' as const, label: 'Cuadrada' },
                        { id: 'coffin' as const, label: 'Coffin' },
                        { id: 'stiletto' as const, label: 'Stiletto' },
                        { id: 'squoval' as const, label: 'Squoval' },
                        { id: 'oval' as const, label: 'Ovalada' },
                      ].map((shape) => {
                        const isSelected = selectedShape.toLowerCase() === shape.id.toLowerCase();
                        return (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => {
                              triggerSelectionVibration();
                              setSelectedShape(shape.id as NailShape);
                            }}
                            className={cn(
                              "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 select-none active:scale-97 bg-white",
                              isSelected
                                ? "border-2 border-primary text-primary shadow-[0_2px_10px_rgba(224,82,134,0.18)]"
                                : "border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                            )}
                          >
                            {shape.label}
                          </button>
                        );
                      })}
                    </div>
                    {/* Subtle Right Gradient Fade */}
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent" />
                  </div>
                </div>

                {/* Row 2: Largo */}
                <div className="space-y-1 text-left">
                  <div className="px-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-800 tracking-tight">
                      Largo
                    </span>
                  </div>
                  
                  {/* Capsule Row with Right-Edge Gradient Fade and 24px (pr-6) end padding */}
                  <div className="relative">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 pr-6">
                      {[
                        { id: 'short' as const, label: 'Corto', extra: 0 },
                        { id: 'medium' as const, label: 'Mediano', extra: 50 },
                        { id: 'long' as const, label: 'Largo', extra: 100 },
                        { id: 'xl' as const, label: 'Extra Largo', extra: 150 },
                      ].map((len) => {
                        const isSelected = selectedLength.toLowerCase() === len.id.toLowerCase();
                        return (
                          <button
                            key={len.id}
                            type="button"
                            onClick={() => {
                              triggerSelectionVibration();
                              setSelectedLength(len.id as NailLength);
                            }}
                            className={cn(
                              "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 select-none active:scale-97 bg-white",
                              isSelected
                                ? "border-2 border-primary text-primary shadow-[0_2px_10px_rgba(224,82,134,0.18)]"
                                : "border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                            )}
                          >
                            <span>{len.label}</span>
                            {len.extra > 0 && (
                              <span className={cn(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full transition-colors",
                                isSelected ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                              )}>
                                +${len.extra}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {/* Subtle Right Gradient Fade */}
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent" />
                  </div>
                </div>

                {/* Row 3: Retiro Previo */}
                <div className="space-y-1 text-left">
                  <div className="px-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-800 tracking-tight">
                      Retiro Previo
                    </span>
                  </div>
                  
                  {/* Capsule Row with Right-Edge Gradient Fade and 24px (pr-6) end padding */}
                  <div className="relative">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 pr-6">
                      {[
                        { id: 'none' as const, label: 'Sin retiro', extra: 0 },
                        { id: 'acrylic' as const, label: 'Acrílico', extra: 120 },
                        { id: 'gelx' as const, label: 'Soft Gel', extra: 80 },
                      ].map((rem) => {
                        const isSelected = selectedRemoval === rem.id;
                        return (
                          <button
                            key={rem.id}
                            type="button"
                            onClick={() => {
                              triggerSelectionVibration();
                              setSelectedRemoval(rem.id as RemovalOptionType);
                            }}
                            className={cn(
                              "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 select-none active:scale-97 bg-white",
                              isSelected
                                ? "border-2 border-primary text-primary shadow-[0_2px_10px_rgba(224,82,134,0.18)]"
                                : "border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                            )}
                          >
                            <span>{rem.label}</span>
                            {rem.extra > 0 && (
                              <span className={cn(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full transition-colors",
                                isSelected ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                              )}>
                                +${rem.extra}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {/* Subtle Right Gradient Fade */}
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent" />
                  </div>
                </div>
              </div>

              {/* 3. Main Homogeneous Capsule Action Button */}
              <div className="pt-2 sm:pt-3 mb-8 sm:mb-10">
                <button
                  type="button"
                  onClick={() => {
                    triggerStepVibration();
                    setCurrentStep('step-summary');
                  }}
                  className="w-full h-12.5 px-6 rounded-full bg-primary hover:brightness-105 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(224,82,134,0.25)] cursor-pointer active:scale-98 transition-all select-none"
                >
                  <span>Ver Cotización y Resumen →</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: CLEAN EDITORIAL SUMMARY & INSTANT BOOKING         */}
          {/* ========================================================= */}
          {currentStep === 'step-summary' && (
            <motion.div
              key="step-summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="max-w-md mx-auto space-y-5 sm:space-y-6"
            >
              {/* 1. Unified Reference Photo with rounded-3xl, depth shadow and floating change-photo capsule */}
              <div className="space-y-2">
                <div className="relative w-full h-[220px] sm:h-[260px] rounded-3xl overflow-hidden border border-slate-100/80 shadow-lg shadow-pink-500/5 bg-slate-50 group mx-auto">
                  <img
                    src={selectedImageUrl}
                    alt="Referencia de diseño"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3.5 right-3.5 flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        triggerSelectionVibration();
                        fileInputRef.current?.click();
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <RefreshCw className="size-3" />
                      <span>Cambiar foto</span>
                    </button>
                  </div>
                </div>
                <div className="text-center pt-0.5">
                  <span className="text-xs font-medium text-slate-500 capitalize">
                    {selectedShape === 'almond' ? 'Almendra' : selectedShape === 'square' ? 'Cuadrada' : selectedShape === 'coffin' ? 'Coffin' : selectedShape === 'stiletto' ? 'Stiletto' : selectedShape === 'squoval' ? 'Squoval' : selectedShape === 'oval' ? 'Ovalada' : selectedShape} · {selectedLength === 'short' ? 'Corto' : selectedLength === 'medium' ? 'Mediano' : selectedLength === 'long' ? 'Largo' : 'Extra Largo'}
                  </span>
                </div>
              </div>

              {/* 2. Luxury Ticket Price Breakdown */}
              <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-100/90 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] divide-y divide-slate-100">
                <div className="pb-3 flex justify-between items-center text-sm font-medium text-slate-600">
                  <span>Manicura & Estructura Base</span>
                  <span className="font-semibold text-slate-900">${pricing.basePrice} MXN</span>
                </div>

                <div className="py-3 flex justify-between items-center text-sm font-medium text-slate-600">
                  <span>Arte & Diseño Personalizado</span>
                  <span className="font-semibold text-slate-900">+${pricing.artPrice} MXN</span>
                </div>

                {pricing.lengthExtra > 0 && (
                  <div className="py-3 flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Suplemento Largo ({selectedLength === 'short' ? 'Corto' : selectedLength === 'medium' ? 'Mediano' : selectedLength === 'long' ? 'Largo' : 'Extra Largo'})</span>
                    <span className="font-semibold text-slate-900">+${pricing.lengthExtra} MXN</span>
                  </div>
                )}

                {pricing.removalExtra > 0 && (
                  <div className="py-3 flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Retiro Previo ({selectedRemoval === 'acrylic' ? 'Acrílico' : 'Soft Gel'})</span>
                    <span className="font-semibold text-slate-900">+${pricing.removalExtra} MXN</span>
                  </div>
                )}

                {/* Prominent Total Estimado */}
                <div className="pt-4 mt-1 border-t border-slate-200/80 flex justify-between items-baseline">
                  <span className="text-base font-semibold text-slate-900">Total Estimado</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
                      ${pricing.totalPriceMXN}
                    </span>
                    <span className="text-xs font-normal text-slate-400 ml-1.5">MXN</span>
                  </div>
                </div>
              </div>

              {/* 3. Pink Booking Button at Bottom with spacious breathing room */}
              <div className="pt-2 sm:pt-3 mb-8 sm:mb-10">
                <button
                  type="button"
                  onClick={handleFinishBooking}
                  className="w-full h-12.5 px-6 rounded-full bg-primary hover:brightness-105 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(224,82,134,0.25)] cursor-pointer active:scale-98 transition-all select-none"
                >
                  <CalendarCheck className="size-4 sm:size-5" />
                  <span>Agendar Cita con este Diseño</span>
                  <ArrowRight className="size-4 sm:size-5" />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
