import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Sliders,
  Eye,
  Info,
  Calendar,
  Send,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronDown,
  Wand2,
  FileSpreadsheet,
  Palette,
  Scissors,
  Sparkle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { Card } from '@emme/ui/card';
import { Switch } from '@emme/ui/switch';
import {
  NailPhotoDetailProcessor,
} from '@/domain/quotes/infrastructure/ai/nail-photo-detail-processor';
import {
  NailPhotoDetailedAnalysis,
  NailProcedureStep,
} from '@/domain/quotes/entities/Inspiration';
import {
  InteractiveNailPreviewCard,
} from '@/shared/components/InteractiveNailPreviewCard';
import {
  NailShapeType,
  NailLengthType,
  NailFinishType,
  FINISH_COLOR_PALETTES,
} from '@/shared/components/NailModelerVisualizerSVG';
import { NailTransformationDeltaWidget } from './NailTransformationDeltaWidget';
import { MultiImageEvidenceReconciliationCard } from './MultiImageEvidenceReconciliationCard';
import { ClientIntentCustomizerCard } from './ClientIntentCustomizerCard';
import { QuoteLifecycleTrackerWidget } from './QuoteLifecycleTrackerWidget';
import { ArtistSkillMatchingCard } from './ArtistSkillMatchingCard';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';

export interface NailPhotoDetailProcessorWidgetProps {
  initialImageUrl?: string;
  initialDescription?: string;
  onApplyConfiguration?: (analysis: NailPhotoDetailedAnalysis) => void;
  onBookAppointment?: (analysis: NailPhotoDetailedAnalysis) => void;
  onExportToQuoteBuilder?: (analysis: NailPhotoDetailedAnalysis) => void;
  className?: string;
  isCompact?: boolean;
}

const PRESET_GALLERY = [
  {
    title: 'Hailey Glazed Pearl Chrome',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
    description: 'Efecto perlado Hailey Bieber con base nude rosada y polvo cromado reflectivo',
    tag: 'Viral #1'
  },
  {
    title: 'Rose Quartz Cat-Eye Velvet 9D',
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop&q=80',
    description: 'Ojo de gato magnético terciopelo con haz de luz en tono cuarzo rosa',
    tag: 'Efecto Seda'
  },
  {
    title: 'Coquette Nude + Swarovski 3D',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80',
    description: 'Soft gel con perlas y cristales 3D Swarovski encapsulados en gel',
    tag: 'Lujo 3D'
  },
  {
    title: 'Micro French Minimalist Gold',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    description: 'Puntas micro francesas en acabado dorado metálico de alta precisión',
    tag: 'Minimal'
  }
];

export function NailPhotoDetailProcessorWidget({
  initialImageUrl = PRESET_GALLERY[0].url,
  initialDescription = PRESET_GALLERY[0].description,
  onApplyConfiguration,
  onBookAppointment,
  onExportToQuoteBuilder,
  className = '',
  isCompact = false,
}: NailPhotoDetailProcessorWidgetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(initialImageUrl);
  const [descriptionText, setDescriptionText] = useState<string>(initialDescription);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'recipe' | 'delta' | 'evidence' | 'customizer' | 'layers' | 'pricing' | 'matching' | 'lifecycle'>('delta');

  // Perform initial analysis
  const [analysis, setAnalysis] = useState<NailPhotoDetailedAnalysis>(() =>
    NailPhotoDetailProcessor.analyzeNailPhoto({
      imageUrl: initialImageUrl,
      textDescription: initialDescription,
    })
  );

  // Local interactive overrides for the simulator & recalculations
  const [selectedShape, setSelectedShape] = useState<NailShapeType>(
    (analysis.layers.shape.value as NailShapeType) || 'almond'
  );
  const [selectedLength, setSelectedLength] = useState<NailLengthType>(
    (analysis.layers.length.value as NailLengthType) || 'medium'
  );
  const [selectedFinish, setSelectedFinish] = useState<NailFinishType>(
    (analysis.layers.finish.value as NailFinishType) || 'glazed'
  );
  const [selectedColorHex, setSelectedColorHex] = useState<string>(
    analysis.layers.chromatics.dominantColorHex || '#F7D2DE'
  );
  const [selectedColorName, setSelectedColorName] = useState<string>(
    analysis.layers.chromatics.dominantColorName || 'Milky Rose Quartz'
  );

  // Steps state with active toggling
  const [steps, setSteps] = useState<NailProcedureStep[]>(analysis.procedureSteps);

  // Re-calculate estimate whenever steps or layers change
  const currentEstimate = useMemo(() => {
    return NailPhotoDetailProcessor.calculateEstimateRange(steps, analysis.layers);
  }, [steps, analysis.layers]);

  // Handle new image upload or URL change
  const handleProcessImage = (url: string, desc?: string) => {
    setIsAnalyzing(true);
    setCurrentImageUrl(url);
    if (desc) setDescriptionText(desc);

    setTimeout(() => {
      const newAnalysis = NailPhotoDetailProcessor.analyzeNailPhoto({
        imageUrl: url,
        textDescription: desc || descriptionText,
      });

      setAnalysis(newAnalysis);
      setSteps(newAnalysis.procedureSteps);
      setSelectedShape(newAnalysis.layers.shape.value as NailShapeType);
      setSelectedLength(newAnalysis.layers.length.value as NailLengthType);
      setSelectedFinish(newAnalysis.layers.finish.value as NailFinishType);
      setSelectedColorHex(newAnalysis.layers.chromatics.dominantColorHex);
      setSelectedColorName(newAnalysis.layers.chromatics.dominantColorName);
      setIsAnalyzing(false);
      toast.success('¡Foto procesada! Extracción multicapa y receta técnica completada.');
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      handleProcessImage(url, `Foto personalizada subida: ${file.name}`);
    }
  };

  const handleToggleStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return { ...step, isActive: !step.isActive };
        }
        return step;
      })
    );
  };

  const handleCopyRecipe = () => {
    const activeStepsText = steps
      .filter((s) => s.isActive)
      .map((s, idx) => `${idx + 1}. [${s.category.toUpperCase()}] ${s.name} (${Math.round(s.confidence * 100)}% Confianza) - $${s.estimatedPrice} MXN`)
      .join('\n');

    const summaryText = `💅 FICHA TÉCNICA EMME STUDIO AI:\nFoto Ref: ${currentImageUrl}\nEstructura: ${analysis.layers.structure.label}\nForma: ${selectedShape.toUpperCase()} | Largo: ${selectedLength.toUpperCase()} | Acabado: ${selectedFinish.toUpperCase()}\nEstimado: $${currentEstimate.minPrice} - $${currentEstimate.maxPrice} MXN (~${currentEstimate.estimatedDurationMinutes} min)\n\nPASOS TÉCNICOS:\n${activeStepsText}`;

    navigator.clipboard.writeText(summaryText);
    toast.success('Ficha técnica copiada al portapapeles');
  };

  return (
    <div className={cn("w-full bg-white dark:bg-card rounded-3xl border border-black/[0.06] shadow-sm p-4 sm:p-6 space-y-6 text-left", className)}>
      {/* Header with AI Vision & Confidence Tier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#1D1D1F] dark:text-foreground">
                Procesador & Visor Detallado de Uñas
              </h3>
              <Badge variant="outline" className="text-[10px] font-extrabold text-primary border-primary/30 bg-primary/5">
                Visión AI
              </Badge>
            </div>
            <p className="text-xs text-[#86868B]">
              Extracción multicapa, receta técnica de 5 pasos y rango de cotización con confianza.
            </p>
          </div>
        </div>

        {/* Global Confidence Metric Badge */}
        <div className="flex items-center gap-2 bg-[#FBFBFD] dark:bg-secondary/40 border border-black/[0.06] px-3 py-1.5 rounded-2xl self-start sm:self-auto">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          <div className="text-left">
            <span className="text-[9.5px] font-bold text-[#86868B] block uppercase tracking-wider">
              Nivel de Confianza
            </span>
            <span className="text-xs font-black text-emerald-600">
              {Math.round(currentEstimate.confidenceScore * 100)}% · {currentEstimate.confidenceTier}
            </span>
          </div>
        </div>
      </div>

      {/* Upload Zone & Quick Sample Presets */}
      <div className="space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="sm:col-span-5 p-3.5 rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 transition-all text-center flex flex-col items-center justify-center cursor-pointer group hover:shadow-xs"
          >
            <UploadCloud className="size-6 text-primary mb-1 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-black text-[#1D1D1F] dark:text-foreground">Subir Foto desde Dispositivo</p>
            <p className="text-[10px] text-[#86868B]">Analizar uñas de Instagram, Pinterest o tu galería</p>
          </div>

          <div className="sm:col-span-7 bg-[#FBFBFD] dark:bg-secondary/30 p-2.5 rounded-2xl border border-black/[0.04] flex flex-col justify-center">
            <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1.5 block">
              O prueba un set viral de tendencia:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {PRESET_GALLERY.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleProcessImage(preset.url, preset.description)}
                  className={cn(
                    "relative rounded-xl overflow-hidden aspect-square border transition-all cursor-pointer group",
                    currentImageUrl === preset.url
                      ? "ring-2 ring-primary border-transparent scale-95"
                      : "border-black/[0.08] hover:opacity-90"
                  )}
                  title={preset.title}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[8.5px] font-bold text-white leading-tight truncate">
                      {preset.tag}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio View: Dual Comparison (Photo vs Interactive Simulator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Photo Reference with Layer Markers */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-black/5 shadow-xs aspect-[4/3] sm:aspect-square">
            <img
              src={currentImageUrl}
              alt="Referencia de Uñas"
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                isAnalyzing ? "opacity-30 blur-xs" : "opacity-100"
              )}
              referrerPolicy="no-referrer"
            />

            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xs text-white p-4">
                <Wand2 className="size-8 text-primary animate-bounce mb-2" />
                <span className="text-xs font-black">Extrayendo Capas y Pigmentos...</span>
                <span className="text-[10px] text-white/80">Segmentando ápice, largo y texturas</span>
              </div>
            )}

            {/* Float Overlay Badges on Image */}
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 max-w-[85%]">
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9.5px] font-bold border border-white/20">
                {analysis.layers.structure.label}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary/80 backdrop-blur-md text-white text-[9.5px] font-bold border border-white/20">
                {selectedFinish.toUpperCase()}
              </span>
            </div>

            <div className="absolute bottom-2.5 right-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white text-[#1D1D1F] text-[10px] font-bold shadow-xs backdrop-blur-md flex items-center gap-1 transition-all"
              >
                <Camera className="size-3" />
                Cambiar
              </button>
            </div>
          </div>

          {/* Reasoning & Extracted summary card */}
          <div className="p-3 rounded-2xl bg-[#FBFBFD] dark:bg-secondary/20 border border-black/[0.04] space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-[#1D1D1F] dark:text-foreground font-black">
              <Info className="size-3.5 text-primary" />
              <span>Diagnóstico de Visión:</span>
            </div>
            <p className="text-[11px] text-[#86868B] leading-relaxed">
              {analysis.overallReasoning}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Modeler Simulator & Tweaker */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-b from-white to-[#FBFBFD] dark:from-card dark:to-secondary/20 p-4 rounded-2xl border border-black/[0.06] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-primary" />
                <h4 className="text-xs font-black text-[#1D1D1F] dark:text-foreground">
                  Simulador Visual en Tiempo Real
                </h4>
              </div>
              <span className="text-[10.5px] text-[#86868B]">
                Reactivo a tu personalización
              </span>
            </div>

            {/* Interactive SVG Renderer */}
            <div className="p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04]">
              <InteractiveNailPreviewCard
                shape={selectedShape}
                length={selectedLength}
                finish={selectedFinish}
                colorHex={selectedColorHex}
                colorName={selectedColorName}
                serviceTitle={analysis.layers.structure.label}
                estimatedPrice={currentEstimate.likelyPrice}
                estimatedDuration={currentEstimate.estimatedDurationMinutes}
                interactive={true}
                onShapeChange={(s) => setSelectedShape(s)}
                onLengthChange={(l) => setSelectedLength(l)}
                onFinishChange={(f) => setSelectedFinish(f)}
                onColorChange={(hex, name) => {
                  setSelectedColorHex(hex);
                  setSelectedColorName(name);
                }}
              />
            </div>

            {/* Quick Adjustment Chips */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#86868B] uppercase tracking-wider">Ajustes Rápidos de Capa:</span>
                <span className="text-[10px] text-primary font-bold">Cambio instantáneo en cotización</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                {/* Shape quick selector */}
                <div className="p-2 rounded-xl bg-white dark:bg-card border border-black/[0.06] space-y-1">
                  <span className="text-[9.5px] font-bold text-[#86868B] block">Forma:</span>
                  <select
                    value={selectedShape}
                    onChange={(e) => setSelectedShape(e.target.value as NailShapeType)}
                    aria-label="Seleccionar forma de uña"
                    className="w-full text-xs font-bold bg-transparent outline-none cursor-pointer"
                  >
                    <option value="almond">Almendra</option>
                    <option value="coffin">Coffin</option>
                    <option value="square">Cuadrada</option>
                    <option value="oval">Ovalada</option>
                    <option value="stiletto">Stiletto</option>
                    <option value="squoval">Squoval</option>
                  </select>
                </div>

                {/* Length quick selector */}
                <div className="p-2 rounded-xl bg-white dark:bg-card border border-black/[0.06] space-y-1">
                  <span className="text-[9.5px] font-bold text-[#86868B] block">Largo:</span>
                  <select
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value as NailLengthType)}
                    aria-label="Seleccionar largo de uña"
                    className="w-full text-xs font-bold bg-transparent outline-none cursor-pointer"
                  >
                    <option value="short">Corto (~14mm)</option>
                    <option value="medium">Medio (~18mm)</option>
                    <option value="long">Largo (~22mm)</option>
                    <option value="xl">XL (~28mm)</option>
                  </select>
                </div>

                {/* Finish quick selector */}
                <div className="p-2 rounded-xl bg-white dark:bg-card border border-black/[0.06] space-y-1">
                  <span className="text-[9.5px] font-bold text-[#86868B] block">Efecto / Finish:</span>
                  <select
                    value={selectedFinish}
                    onChange={(e) => setSelectedFinish(e.target.value as NailFinishType)}
                    aria-label="Seleccionar acabado de uña"
                    className="w-full text-xs font-bold bg-transparent outline-none cursor-pointer"
                  >
                    <option value="glazed">Glazed Pearl</option>
                    <option value="cat_eye">Cat-Eye 9D</option>
                    <option value="glossy">Glossy Mirror</option>
                    <option value="matte">Matte Silk</option>
                    <option value="french">French Tip</option>
                  </select>
                </div>

                {/* Color quick palette dropdown */}
                <div className="p-2 rounded-xl bg-white dark:bg-card border border-black/[0.06] space-y-1">
                  <span className="text-[9.5px] font-bold text-[#86868B] block">Tono Base:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="size-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: selectedColorHex }}
                    />
                    <select
                      value={selectedColorHex}
                      onChange={(e) => {
                        const hex = e.target.value;
                        const palette = FINISH_COLOR_PALETTES[selectedFinish] || FINISH_COLOR_PALETTES.glossy;
                        const found = palette.find(p => p.hex === hex);
                        setSelectedColorHex(hex);
                        if (found) setSelectedColorName(found.name);
                      }}
                      aria-label="Seleccionar color de base"
                      className="w-full text-[11px] font-bold bg-transparent outline-none truncate cursor-pointer"
                    >
                      {(FINISH_COLOR_PALETTES[selectedFinish] || FINISH_COLOR_PALETTES.glossy).map((c) => (
                        <option key={c.id} value={c.hex}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Navigation bar */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar border-b border-black/[0.06] pb-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('delta')}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'delta'
                ? "bg-primary text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5"
            )}
          >
            <Wand2 className="size-3.5" />
            <span>Transformación & Delta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'evidence'
                ? "bg-primary text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5"
            )}
          >
            <Camera className="size-3.5" />
            <span>Evidencia Multi-Foto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customizer')}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'customizer'
                ? "bg-primary text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5"
            )}
          >
            <Sliders className="size-3.5" />
            <span>Ajuste de Intención</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recipe')}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'recipe'
                ? "bg-primary text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5"
            )}
          >
            <Layers className="size-3.5" />
            <span>Receta Técnica ({steps.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('layers')}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'layers'
                ? "bg-primary text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5"
            )}
          >
            <ShieldCheck className="size-3.5" />
            <span>Capas AI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matching')}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'matching'
                ? "bg-primary text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5"
            )}
          >
            <Sparkle className="size-3.5" />
            <span>Especialistas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lifecycle')}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'lifecycle'
                ? "bg-primary text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5"
            )}
          >
            <FileSpreadsheet className="size-3.5" />
            <span>Trazabilidad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === 'pricing'
                ? "bg-primary text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5"
            )}
          >
            <DollarSign className="size-3.5" />
            <span>Rango de Cotización</span>
          </button>
        </div>

        {/* TAB DELTA: Transformation Delta */}
        {activeTab === 'delta' && (
          <NailTransformationDeltaWidget
            initialTarget={{
              baseServiceCategory: analysis.suggestedAttributes.baseServiceCategory || 'Escultural Acrílico Pro',
              lengthCategory: (analysis.layers.length.value.toUpperCase() as any) || 'M',
              shape: (analysis.layers.shape.value as any) || 'almond',
              material: 'acrylic',
              dominantColorHex: selectedColorHex,
              dominantColorName: selectedColorName,
              secondaryColors: [{ hex: '#FFFFFF', name: 'Detalle' }],
              finish: selectedFinish as any,
              artTier: (analysis.layers.nailArt.complexity as any) || 'medium',
              artDescription: analysis.layers.nailArt.elements.join(', ') || 'Diseño de foto',
              rhinestoneCount: analysis.layers.nailArt.complexity === '3d_charms' ? 6 : 0,
              charms3DCount: analysis.layers.nailArt.complexity === '3d_charms' ? 2 : 0,
              confidence: analysis.overallConfidence,
            }}
          />
        )}

        {/* TAB EVIDENCE: Multi-Image Evidence Reconciliation */}
        {activeTab === 'evidence' && (
          <MultiImageEvidenceReconciliationCard />
        )}

        {/* TAB CUSTOMIZER: Client Intent Customizer */}
        {activeTab === 'customizer' && (
          <ClientIntentCustomizerCard
            initialTarget={{
              baseServiceCategory: analysis.suggestedAttributes.baseServiceCategory || 'Escultural Acrílico Pro',
              lengthCategory: (analysis.layers.length.value.toUpperCase() as any) || 'M',
              shape: (analysis.layers.shape.value as any) || 'almond',
              material: 'acrylic',
              dominantColorHex: selectedColorHex,
              dominantColorName: selectedColorName,
              secondaryColors: [{ hex: '#FFFFFF', name: 'Detalle' }],
              finish: selectedFinish as any,
              artTier: (analysis.layers.nailArt.complexity as any) || 'medium',
              artDescription: analysis.layers.nailArt.elements.join(', ') || 'Diseño de foto',
              rhinestoneCount: 4,
              charms3DCount: 0,
              confidence: analysis.overallConfidence,
            }}
            onIntentUpdated={(newIntent, updatedTarget) => {
              setSelectedShape(updatedTarget.shape as NailShapeType);
              setSelectedLength(updatedTarget.lengthCategory === 'S' ? 'short' : updatedTarget.lengthCategory === 'L' ? 'long' : updatedTarget.lengthCategory === 'XL' ? 'xl' : 'medium');
              setSelectedColorHex(updatedTarget.dominantColorHex);
              setSelectedColorName(updatedTarget.dominantColorName);
            }}
          />
        )}

        {/* TAB MATCHING: Artist Skill Matching */}
        {activeTab === 'matching' && (
          <ArtistSkillMatchingCard
            baseDurationMinutes={currentEstimate.estimatedDurationMinutes}
          />
        )}

        {/* TAB LIFECYCLE: Quote Lifecycle & Traceability */}
        {activeTab === 'lifecycle' && (
          <QuoteLifecycleTrackerWidget />
        )}

        {/* TAB 1: 5-STEP SALON RECIPE */}
        {activeTab === 'recipe' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#86868B]">
                Secuencia requerida para lograr exactamente el diseño de la foto:
              </span>
              <button
                type="button"
                onClick={handleCopyRecipe}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="size-3" />
                Copiar Ficha Técnica
              </button>
            </div>

            <div className="space-y-2.5">
              {steps.map((step) => {
                const confPercent = Math.round(step.confidence * 100);
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left",
                      step.isActive
                        ? "bg-white dark:bg-card border-black/[0.08] shadow-2xs"
                        : "bg-neutral-100/60 dark:bg-secondary/10 border-dashed border-black/[0.05] opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Step Number Badge */}
                      <div className="size-8 rounded-xl bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.stepNumber}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs sm:text-sm font-black text-[#1D1D1F] dark:text-foreground">
                            {step.name}
                          </h5>
                          {step.isRequired && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-200/80 text-[#1D1D1F]">
                              Obligatorio
                            </span>
                          )}
                          <span className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                            confPercent >= 94 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          )}>
                            <ShieldCheck className="size-2.5" />
                            {confPercent}% Confianza
                          </span>
                        </div>

                        <p className="text-[11px] text-[#86868B] leading-relaxed">
                          {step.description}
                        </p>

                        {/* Products list pills */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span className="text-[9.5px] font-bold text-[#86868B]">Insumos:</span>
                          {step.productsUsed.map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[9px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-secondary/50 text-[#1D1D1F] dark:text-foreground"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step Metrics & Active Toggle */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
                      <div className="text-right">
                        <span className="text-xs font-black text-[#1D1D1F] dark:text-foreground block">
                          ${step.estimatedPrice} MXN
                        </span>
                        <span className="text-[10px] text-[#86868B]">
                          ~{step.estimatedMinutes} min
                        </span>
                      </div>

                      {!step.isRequired && (
                        <div className="flex items-center gap-1.5">
                          <Switch
                            checked={step.isActive}
                            onCheckedChange={() => handleToggleStep(step.id)}
                            id={`toggle-${step.id}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED LAYERS & CONFIDENCE */}
        {activeTab === 'layers' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Structure layer */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-card border border-black/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#86868B] uppercase">Capa 1: Estructura & Ápice</span>
                  <span className="text-[10px] font-black text-emerald-600">
                    {Math.round(analysis.layers.structure.confidence * 100)}% Confianza
                  </span>
                </div>
                <h5 className="text-xs font-black text-[#1D1D1F]">{analysis.layers.structure.label}</h5>
                <p className="text-[11px] text-[#86868B]">{analysis.layers.structure.description}</p>
              </div>

              {/* Finish layer */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-card border border-black/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#86868B] uppercase">Capa 2: Efecto Óptico</span>
                  <span className="text-[10px] font-black text-emerald-600">
                    {Math.round(analysis.layers.finish.confidence * 100)}% Confianza
                  </span>
                </div>
                <h5 className="text-xs font-black text-[#1D1D1F]">{analysis.layers.finish.label}</h5>
                <p className="text-[11px] text-[#86868B]">{analysis.layers.finish.effectDescription}</p>
              </div>

              {/* Chromatics layer */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-card border border-black/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#86868B] uppercase">Capa 3: Paleta Cromática</span>
                  <span className="text-[10px] font-black text-emerald-600">
                    {Math.round(analysis.layers.chromatics.confidence * 100)}% Confianza
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {analysis.layers.chromatics.palette.map((pal, idx) => (
                      <span
                        key={idx}
                        className="size-5 rounded-full border border-black/10"
                        style={{ backgroundColor: pal.hex }}
                        title={`${pal.name} (${pal.role})`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-[#1D1D1F]">{selectedColorName}</span>
                </div>
              </div>

              {/* Nail Art layer */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-card border border-black/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#86868B] uppercase">Capa 4: Nail Art & Dificultad</span>
                  <span className="text-[10px] font-black text-emerald-600">
                    {Math.round(analysis.layers.nailArt.confidence * 100)}% Confianza
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-black border-primary text-primary">
                    Nivel {analysis.layers.nailArt.difficultyRating}
                  </Badge>
                  <span className="text-xs font-bold text-[#86868B]">
                    {analysis.layers.nailArt.elements.length > 0 ? analysis.layers.nailArt.elements.join(', ') : 'Diseño Solido Limpio'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC PRICING & CONFIDENCE TOLERANCE RANGE */}
        {activeTab === 'pricing' && (
          <div className="space-y-4 bg-[#FBFBFD] dark:bg-secondary/20 p-4 rounded-2xl border border-black/[0.06]">
            {/* Range Bar Component */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#86868B]">Rango de Cotización Calculado:</span>
                <span className="text-xs font-black text-emerald-600">
                  Margen de Tolerancia: ±${currentEstimate.toleranceMargin} MXN
                </span>
              </div>

              {/* Visual Price Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-card border border-black/[0.06] shadow-2xs space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#86868B] uppercase block">Precio Mínimo</span>
                    <span className="text-sm sm:text-base font-black text-[#1D1D1F] dark:text-foreground">
                      ${currentEstimate.minPrice} MXN
                    </span>
                  </div>

                  <div className="text-center px-4 py-1.5 rounded-2xl bg-primary/10 border border-primary/20">
                    <span className="text-[10px] font-black text-primary uppercase block">Estimado Más Probable</span>
                    <span className="text-lg sm:text-2xl font-black text-primary">
                      ${currentEstimate.likelyPrice} MXN
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#86868B] uppercase block">Precio Máximo</span>
                    <span className="text-sm sm:text-base font-black text-[#1D1D1F] dark:text-foreground">
                      ${currentEstimate.maxPrice} MXN
                    </span>
                  </div>
                </div>

                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-400 h-full w-1/3" />
                  <div className="bg-primary h-full w-1/3" />
                  <div className="bg-rose-400 h-full w-1/3" />
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">
                Conceptos Incluidos en el Estimado:
              </span>
              <div className="divide-y divide-black/[0.05] bg-white dark:bg-card rounded-2xl border border-black/[0.06] overflow-hidden">
                {currentEstimate.itemizedBreakdown.map((item) => (
                  <div key={item.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-[#1D1D1F] dark:text-foreground">{item.item}</span>
                    </div>
                    <span className="font-black text-[#1D1D1F] dark:text-foreground">${item.amount} MXN</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Actions & Handoff Footer */}
      <div className="pt-2 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left w-full sm:w-auto">
          <span className="text-[10px] font-bold text-[#86868B] block">Total Estimado (~{currentEstimate.estimatedDurationMinutes} min):</span>
          <span className="text-base sm:text-lg font-black text-[#1D1D1F] dark:text-foreground">
            ${currentEstimate.minPrice} — ${currentEstimate.maxPrice} MXN
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onExportToQuoteBuilder && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onExportToQuoteBuilder(analysis)}
              className="flex-1 sm:flex-initial text-xs font-black h-11 rounded-2xl border-black/10 hover:bg-black/5 cursor-pointer"
            >
              <FileSpreadsheet className="size-3.5 mr-1 text-primary" />
              Exportar a Cotizador Oficial
            </Button>
          )}

          <Button
            type="button"
            onClick={() => {
              if (onBookAppointment) {
                onBookAppointment(analysis);
              } else if (onApplyConfiguration) {
                onApplyConfiguration(analysis);
              } else {
                toast.success('¡Configuración de diseño confirmada!');
              }
            }}
            className="flex-1 sm:flex-initial text-xs font-black h-11 px-5 rounded-2xl bg-primary hover:brightness-105 text-white shadow-xs cursor-pointer"
          >
            <Calendar className="size-3.5 mr-1" />
            Agendar con Esta Configuración
          </Button>
        </div>
      </div>
    </div>
  );
}
