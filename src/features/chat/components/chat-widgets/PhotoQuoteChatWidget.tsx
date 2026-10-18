import React, { useState } from 'react';
import { Camera, Upload, ChevronRight, Sparkles, Layers, Sliders } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Badge } from '@emme/ui/badge';
import { NailCategoryExtractionCard } from '@/features/assisted-design/ui/NailCategoryExtractionCard';
import { NailPhotoDetailedAnalysis } from '@/domain/quotes/entities/Inspiration';

interface PhotoQuoteChatWidgetProps {
  onOpenGallery: () => void;
  onSelectSample: (sample: {
    title: string;
    url: string;
    style: string;
    complexity: string;
    durationMinutes: number;
    estimatedPrice: number;
    recommendedService: string;
  }) => void;
  onBookAppointmentFromAnalysis?: (analysis: NailPhotoDetailedAnalysis) => void;
  onExportToQuoteBuilder?: (analysis: NailPhotoDetailedAnalysis) => void;
}

const SAMPLE_INSPOS = [
  {
    title: 'French Chrome Ombré',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format&fit=crop&q=60',
    style: 'Francés degradé metálico con acabado espejo chrome',
    complexity: 'Intermedio',
    durationMinutes: 75,
    estimatedPrice: 55,
    recommendedService: 'Manicura Rusa + Diseño Intermedio'
  },
  {
    title: 'Nude Soft Gel + Cristales',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&auto=format&fit=crop&q=60',
    style: 'Base rubber nude con cristalería Swarovski',
    complexity: 'Avanzado',
    durationMinutes: 90,
    estimatedPrice: 65,
    recommendedService: 'Soft Gel (Full Cover) + Nail Art Avanzado'
  },
  {
    title: 'Cat Eye Velvet Rose',
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&auto=format&fit=crop&q=60',
    style: 'Efecto ojo de gato magnético terciopelo',
    complexity: 'Intermedio',
    durationMinutes: 60,
    estimatedPrice: 45,
    recommendedService: 'Esmaltado Semi-permanente + Cat Eye'
  }
];

export function PhotoQuoteChatWidget({
  onOpenGallery,
  onSelectSample,
  onBookAppointmentFromAnalysis,
  onExportToQuoteBuilder,
}: PhotoQuoteChatWidgetProps) {
  const [selectedPhotoForProcessing, setSelectedPhotoForProcessing] = useState<{
    url: string;
    desc: string;
  } | null>(null);

  if (selectedPhotoForProcessing) {
    return (
      <div className="w-full my-2 animate-in fade-in duration-200">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setSelectedPhotoForProcessing(null)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Volver a opciones de fotos
          </button>
        </div>
        <NailCategoryExtractionCard
          imageUrl={selectedPhotoForProcessing.url}
          imageDescription={selectedPhotoForProcessing.desc}
          variant="chat"
          onApplyToQuote={(analysis) => {
            if (onExportToQuoteBuilder) {
              onExportToQuoteBuilder(analysis);
            }
          }}
          onBookAppointment={(analysis) => {
            if (onBookAppointmentFromAnalysis) {
              onBookAppointmentFromAnalysis(analysis);
            }
          }}
          onSelectNewPhoto={() => setSelectedPhotoForProcessing(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Camera className="size-4 text-rose-500 shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Cotizador de Fotos AI</h4>
            <p className="text-[10.5px] text-[#86868B]">Extracción de capas, receta técnica y presupuesto</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-rose-700 border-rose-200 bg-rose-50">
          Visión AI
        </Badge>
      </div>

      {/* Upload Action */}
      <div className="p-3.5 border-b border-black/[0.05] space-y-2">
        <Button
          onClick={() => {
            setSelectedPhotoForProcessing({
              url: SAMPLE_INSPOS[0].url,
              desc: 'Foto subida para análisis multicapa y receta técnica',
            });
          }}
          className="w-full h-10 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload className="size-3.5" />
          <span>Subir y Procesar Foto en Detalle</span>
        </Button>
      </div>

      {/* Flush Inspiration Rows with Hairline Dividers */}
      <div className="divide-y divide-black/[0.05]">
        <div className="px-4 py-2 bg-[#FBFBFD] text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
          O analiza un diseño de tendencia:
        </div>
        {SAMPLE_INSPOS.map((sample, i) => (
          <div
            key={i}
            onClick={() => {
              setSelectedPhotoForProcessing({
                url: sample.url,
                desc: `${sample.title} - ${sample.style}`,
              });
              onSelectSample(sample);
            }}
            className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-[#F8F8FA] active:bg-[#F2F2F5] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={sample.url} 
                alt={sample.title}
                className="size-11 rounded-xl object-cover border border-black/[0.06] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="font-semibold text-xs text-[#1D1D1F] truncate group-hover:text-primary transition-colors block">
                  {sample.title}
                </span>
                <span className="text-[10.5px] text-[#86868B] truncate block">
                  {sample.complexity} • {sample.durationMinutes} min
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              <span className="font-bold text-xs text-primary">${sample.estimatedPrice * 10} MXN</span>
              <ChevronRight className="size-4 text-[#86868B] group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

