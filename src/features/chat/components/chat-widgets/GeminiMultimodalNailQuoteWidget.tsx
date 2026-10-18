import React, { useState } from 'react';
import { Sparkles, Check, Clock, CalendarCheck, ShieldCheck, ArrowRight, Layers, Palette } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { NailLengthSVG } from '@/shared/components/NailLengthSVG';
import { SingleNailMiniPreviewSVG, NailShapeType, NailLengthType } from '@/shared/components/NailModelerVisualizerSVG';
import { GeminiNailImageAnalysis } from '@/shared/services/geminiService';
import { useBookingStore } from '@/features/appointments/state/booking.store';
import { useChatStore } from '../../state/useChatStore';
import { useApp } from '@/app/AppContext';
import { cn } from '@emme/ui/lib/utils';
import { toast } from 'sonner';

interface GeminiMultimodalNailQuoteWidgetProps {
  imageUrl: string;
  analysis: GeminiNailImageAnalysis;
  onProceedToBooking?: (summary: {
    serviceName: string;
    totalPrice: number;
    duration: number;
    shape: string;
    length: string;
  }) => void;
}

const SHAPE_MAP: Record<string, NailShapeType> = {
  Almendra: 'almond',
  Cuadrada: 'square',
  Coffin: 'coffin',
  Stiletto: 'stiletto',
  Ovalada: 'oval',
  Natural: 'squoval',
};

const LENGTH_MAP: Record<string, NailLengthType> = {
  'Corto (S)': 'short',
  'Medio (M)': 'medium',
  'Largo (L)': 'long',
  'Extra Largo (XL)': 'xl',
};

const SHAPES: { id: NailShapeType; label: string; name: string }[] = [
  { id: 'almond', label: 'Almendra', name: 'Almendra' },
  { id: 'square', label: 'Cuadrada', name: 'Cuadrada' },
  { id: 'coffin', label: 'Coffin', name: 'Coffin' },
  { id: 'stiletto', label: 'Stiletto', name: 'Stiletto' },
  { id: 'oval', label: 'Ovalada', name: 'Ovalada' },
  { id: 'squoval', label: 'Squoval', name: 'Squoval' },
];

const LENGTHS: { id: NailLengthType; label: string; name: string; priceAdd: number }[] = [
  { id: 'short', label: 'Corto S', name: 'Corto (S)', priceAdd: 0 },
  { id: 'medium', label: 'Medio M', name: 'Medio (M)', priceAdd: 50 },
  { id: 'long', label: 'Largo L', name: 'Largo (L)', priceAdd: 100 },
  { id: 'xl', label: 'Extra Largo XL', name: 'Extra Largo (XL)', priceAdd: 150 },
];

export function GeminiMultimodalNailQuoteWidget({
  imageUrl,
  analysis,
  onProceedToBooking,
}: GeminiMultimodalNailQuoteWidgetProps) {
  const { selectService, setNotes, setStep } = useBookingStore();
  const { selectService: chatSelectService, prefillFromQuote } = useChatStore();

  const defaultShape = SHAPE_MAP[analysis.detectedShape] || 'almond';
  const defaultLength = LENGTH_MAP[analysis.detectedLength] || 'medium';

  const [selectedShape, setSelectedShape] = useState<NailShapeType>(defaultShape);
  const [selectedLength, setSelectedLength] = useState<NailLengthType>(defaultLength);

  const lengthOption = LENGTHS.find((l) => l.id === selectedLength) || LENGTHS[1];
  const shapeOption = SHAPES.find((s) => s.id === selectedShape) || SHAPES[0];

  const calculatedTotal = (analysis.basePrice || 550) + (analysis.artPrice || 150) + lengthOption.priceAdd;
  const calculatedDuration = (analysis.estimatedDurationMinutes || 75) + (selectedLength === 'long' || selectedLength === 'xl' ? 15 : 0);

  const handleBookWithCustomization = () => {
    const serviceTitle = `${analysis.recommendedService || 'Nail Art Personalizado'} (${shapeOption.name}, ${lengthOption.name})`;

    selectService({
      id: `gemini-quote-${Date.now()}`,
      title: serviceTitle,
      category: analysis.technique || 'Soft Gel / Gel-X',
      price: calculatedTotal,
      durationMinutes: calculatedDuration,
    });

    chatSelectService({
      id: `gemini-quote-${Date.now()}`,
      name: serviceTitle,
      category: analysis.technique || 'Soft Gel',
      price: calculatedTotal,
      duration: calculatedDuration,
    });

    setNotes(
      `Cotización Gemini Multimodal:\nTécnica: ${analysis.technique}\nDiseño: ${analysis.detectedStyle}\nForma: ${shapeOption.name}\nLargo: ${lengthOption.name}\nPrecio Calculado: $${calculatedTotal} MXN`
    );

    prefillFromQuote({
      serviceName: serviceTitle,
      totalPrice: calculatedTotal,
      length: selectedLength,
      finish: 'chrome',
      artLevel: analysis.complexity === 'Master 3D' ? 'extravagant' : analysis.complexity === 'Avanzado' ? 'moderate' : 'minimal',
    });

    toast.success('¡Diseño y cotización configurados!', {
      description: `${shapeOption.name} • ${lengthOption.name} ($${calculatedTotal} MXN)`,
    });

    if (onProceedToBooking) {
      onProceedToBooking({
        serviceName: serviceTitle,
        totalPrice: calculatedTotal,
        duration: calculatedDuration,
        shape: shapeOption.name,
        length: lengthOption.name,
      });
    }
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-2 animate-in fade-in duration-300">
      {/* Multimodal AI Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/10 via-rose-500/5 to-purple-500/10 border-b border-black/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Análisis Multimodal Gemini</h4>
            <p className="text-[10px] text-[#86868B]">Extracción de técnica y cálculo inteligente</p>
          </div>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9.5px] font-bold">
          Gemini 3.7 Vision
        </Badge>
      </div>

      {/* Visual Extraction Card & Gemini Insights */}
      <div className="p-3.5 border-b border-black/[0.05] space-y-3">
        <div className="flex gap-3">
          <div className="relative size-20 sm:size-24 rounded-xl overflow-hidden bg-neutral-100 border border-black/5 shrink-0 shadow-inner">
            <img
              src={imageUrl}
              alt="Referencia de Uñas"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-1 left-1 right-1 px-1 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[8.5px] font-bold text-center truncate">
              Referencia
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                {analysis.technique || 'Soft Gel'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-[#48484A]">
                Nivel {analysis.complexity || 'Intermedio'}
              </span>
            </div>

            <h5 className="font-bold text-xs text-[#1D1D1F] line-clamp-1">
              {analysis.recommendedService || 'Nail Art Personalizado'}
            </h5>

            <p className="text-[10.5px] text-[#86868B] line-clamp-2 leading-relaxed">
              {analysis.description || analysis.detectedStyle}
            </p>

            {analysis.detectedColors && analysis.detectedColors.length > 0 && (
              <div className="flex items-center gap-1 pt-0.5">
                <Palette className="size-3 text-[#86868B] shrink-0" />
                <span className="text-[9.5px] text-[#86868B] truncate">
                  {analysis.detectedColors.join(' • ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pro Tip */}
        {analysis.stylistTip && (
          <div className="p-2.5 rounded-xl bg-pink-50/60 border border-pink-100 text-[10.5px] text-[#1D1D1F] flex items-start gap-2">
            <Sparkles className="size-3 text-primary shrink-0 mt-0.5" />
            <span className="leading-tight">
              <strong className="text-primary">Tip de Especialista:</strong> {analysis.stylistTip}
            </span>
          </div>
        )}
      </div>

      {/* Simplified User Customization: Just Shape & Size */}
      <div className="divide-y divide-black/[0.05]">
        {/* 1. Shape Selection */}
        <div className="p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-[#86868B] uppercase tracking-wider">
              1. Elige tu Forma / Silueta:
            </span>
            <span className="text-[11px] font-bold text-primary">{shapeOption.name}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {SHAPES.map((shp) => {
              const isSelected = selectedShape === shp.id;
              return (
                <button
                  key={shp.id}
                  type="button"
                  onClick={() => setSelectedShape(shp.id)}
                  className={cn(
                    'p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2',
                    isSelected
                      ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-xs'
                      : 'bg-white hover:bg-neutral-50 border-black/[0.06]'
                  )}
                >
                  <div className="size-6 rounded-lg bg-white border border-black/10 flex items-center justify-center shrink-0">
                    <SingleNailMiniPreviewSVG
                      shape={shp.id}
                      length={selectedLength}
                      colorHex="#F3C5BA"
                      finish="glazed"
                      tipHex="#FFFFFF"
                      className="w-3.5 h-5"
                    />
                  </div>
                  <span className={cn('text-[11px] truncate', isSelected ? 'font-bold text-[#1D1D1F]' : 'font-medium text-[#48484A]')}>
                    {shp.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Length Selection */}
        <div className="p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-[#86868B] uppercase tracking-wider">
              2. Elige tu Largo (Size):
            </span>
            <span className="text-[11px] font-bold text-primary">{lengthOption.name}</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {LENGTHS.map((len) => {
              const isSelected = selectedLength === len.id;
              return (
                <button
                  key={len.id}
                  type="button"
                  onClick={() => setSelectedLength(len.id)}
                  className={cn(
                    'py-2 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1',
                    isSelected
                      ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-xs'
                      : 'bg-white hover:bg-neutral-50 border-black/[0.06]'
                  )}
                >
                  <NailLengthSVG
                    length={len.id}
                    fillColor={isSelected ? '#E05286' : '#86868B'}
                    className="w-4 h-6"
                    showGuides={false}
                  />
                  <span className={cn('text-[10px] truncate', isSelected ? 'font-bold text-[#1D1D1F]' : 'font-medium text-[#48484A]')}>
                    {len.label}
                  </span>
                  {len.priceAdd > 0 && (
                    <span className="text-[9px] text-primary font-bold">
                      +${len.priceAdd}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instant Quote Calculation & 1-Click Action */}
        <div className="p-4 bg-[#FBFBFD] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#86868B] block">Cotización Final Calculada:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-primary font-display">
                  ${calculatedTotal} MXN
                </span>
                <span className="text-[11px] text-[#86868B] flex items-center gap-1">
                  <Clock className="size-3 text-[#86868B]" /> ~{calculatedDuration} min
                </span>
              </div>
            </div>

            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Precio Todo Incluido
            </Badge>
          </div>

          <Button
            type="button"
            onClick={handleBookWithCustomization}
            className="w-full h-11 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarCheck className="size-4" />
            <span>✨ Confirmar {shapeOption.name} y Agendar Cita</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
