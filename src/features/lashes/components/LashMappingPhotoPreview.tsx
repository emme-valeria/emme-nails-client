import React, { useState } from 'react';
import { Sparkles, Eye, ZoomIn, ZoomOut, Check, Layers, Ruler, ShieldCheck, Heart, Info } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerHaptic } from '@/shared/utils/haptics';
import { LashTechniqueType, LashCurlType, LashMappingType } from './LashVectorPreview';

export interface LashMappingMeta {
  id: LashMappingType;
  name: string;
  emoji: string;
  badge: string;
  tagline: string;
  lengths: number[];
  innerMm: number;
  apexMm: number;
  outerMm: number;
  highlightIndex: number;
  photoUrl: string;
  desc: string;
}

export const LASH_MAPPING_CATALOG: Record<LashMappingType, LashMappingMeta> = {
  cat_eye: {
    id: 'cat_eye',
    name: 'Cat Eye / Foxy',
    emoji: '🐱',
    badge: '⭐ Más Pedida',
    tagline: 'Alarga la mirada con efecto rasgado y lifting en el extremo exterior.',
    lengths: [8, 9, 10, 11, 12, 13, 14, 15, 16],
    innerMm: 8,
    apexMm: 14,
    outerMm: 16,
    highlightIndex: 8, // 16mm at outer
    photoUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
    desc: 'Longitudes crecientes hacia el tercio exterior para rasgar y alargar los ojos almendrados.'
  },
  doll_eye: {
    id: 'doll_eye',
    name: 'Doll Eye / Muñeca',
    emoji: '🎀',
    badge: 'Ojos Grandes',
    tagline: 'Apertura redonda y amplia en el centro para mirada dulce y despierta.',
    lengths: [9, 10, 11, 12, 12, 11, 10, 9],
    innerMm: 9,
    apexMm: 12,
    outerMm: 9,
    highlightIndex: 3, // 12mm center
    photoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    desc: 'Mayor longitud sobre la pupila para abrir verticalmente ojos almendrados o pequeños.'
  },
  natural: {
    id: 'natural',
    name: 'Natural Anatómico',
    emoji: '🍃',
    badge: 'Diario Elegante',
    tagline: 'Realza tus pestañas naturales siguiendo su arco anatómico orgánico.',
    lengths: [8, 9, 10, 11, 11, 10, 9, 8],
    innerMm: 8,
    apexMm: 11,
    outerMm: 8,
    highlightIndex: 3,
    photoUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    desc: 'Transición armoniosa sin contrastes bruscos. Ideal para el día a día en oficina.'
  },
  wispy: {
    id: 'wispy',
    name: 'Wispy / Kim K',
    emoji: '✨',
    badge: 'Tendencia 2026',
    tagline: 'Textura esponjosa con picos de longitud intercalados para volumen 3D.',
    lengths: [8, 10, 12, 14, 12, 10, 9, 8],
    innerMm: 8,
    apexMm: 14,
    outerMm: 8,
    highlightIndex: 3,
    photoUrl: 'https://images.unsplash.com/photo-1588510849487-19013e895420?auto=format&fit=crop&w=800&q=80',
    desc: 'Juego de capas con abanicos suaves de base y picos spike que rompen la uniformidad.'
  },
  dramatic: {
    id: 'dramatic',
    name: 'Dramatic / Glamour',
    emoji: '💎',
    badge: 'Alto Impacto',
    tagline: 'Volumen negro intenso, tupido y aterciopelado de alta densidad.',
    lengths: [9, 11, 13, 14, 15, 14, 13, 11, 9],
    innerMm: 9,
    apexMm: 15,
    outerMm: 9,
    highlightIndex: 4,
    photoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    desc: 'Densidad profunda con abanicos 5D-6D para eventos, sesiones de foto y noche.'
  },
  squirrel: {
    id: 'squirrel',
    name: 'Squirrel / Ardilla',
    emoji: '🐿️',
    badge: 'Párpado Caído',
    tagline: 'Punto más alto en el arco de la ceja antes de descender en la comisura.',
    lengths: [8, 9, 10, 11, 12, 13, 12, 11, 10, 9],
    innerMm: 8,
    apexMm: 13,
    outerMm: 9,
    highlightIndex: 5,
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    desc: 'Levanta miradas cansadas o con párpado encapotado sin recargar la comisura exterior.'
  },
  spiky: {
    id: 'spiky',
    name: 'Spiky / Anime Look',
    emoji: '⚡',
    badge: 'Modern & Edgy',
    tagline: 'Clústeres marcados y definidos para un efecto manga/anime de ojos expresivos.',
    lengths: [8, 10, 12, 14, 14, 12, 10, 8],
    innerMm: 8,
    apexMm: 14,
    outerMm: 8,
    highlightIndex: 3,
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    desc: 'Espaciado rítmico con spikes consolidados que simulan muñecas de porcelana y anime.'
  },
  open_eye: {
    id: 'open_eye',
    name: 'Open Eye / Apertura',
    emoji: '🤍',
    badge: 'Abre la Mirada',
    tagline: 'Máxima curvatura y longitud central para agrandar ojos encapotados.',
    lengths: [8, 9, 11, 13, 14, 13, 11, 9, 8],
    innerMm: 8,
    apexMm: 14,
    outerMm: 8,
    highlightIndex: 4,
    photoUrl: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=800&q=80',
    desc: 'Crea la ilusión óptica de ojos redondos y despiertos corrigiendo la pesadez del párpado.'
  }
};

interface LashMappingPhotoPreviewProps {
  technique: LashTechniqueType;
  curl: LashCurlType;
  mapping: LashMappingType;
  appointmentType?: 'full_set' | 'touchup_2w' | 'touchup_3w' | 'removal_and_new';
  priceMXN?: number;
  durationMins?: number;
  compact?: boolean;
}

export function LashMappingPhotoPreview({
  technique = 'hybrid',
  curl = 'D',
  mapping = 'cat_eye',
  priceMXN = 900,
  durationMins = 90,
  compact = false
}: LashMappingPhotoPreviewProps) {
  const [viewMode, setViewMode] = useState<'photo_map' | 'macro_zoom'>('photo_map');

  const currentMap = LASH_MAPPING_CATALOG[mapping] || LASH_MAPPING_CATALOG.cat_eye;

  const techniqueLabels: Record<LashTechniqueType, string> = {
    classic: 'Clásica 1:1',
    hybrid: 'Híbridas 3D',
    russian: 'Volumen Ruso 5D',
    lifting: 'Lash Lifting'
  };

  const curlLabels: Record<LashCurlType, { name: string; degrees: string }> = {
    C: { name: 'Curva C', degrees: '55°' },
    D: { name: 'Curva D', degrees: '70°' },
    L: { name: 'Curva L', degrees: '85°' }
  };

  return (
    <div className="w-full bg-[#FAF9F7] rounded-2xl border border-black/[0.08] p-3.5 sm:p-4 shadow-2xs space-y-3">
      {/* 1. Header Bar with Category & View Mode Switcher */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center size-6 rounded-lg bg-rose-50 text-rose-700">
            <Sparkles className="size-3.5" />
          </span>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">
              Visualizador Fotográfico con Mapeo
            </h3>
            <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-extrabold tracking-wide uppercase">
              Foto Real
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-0.5 bg-neutral-200/60 rounded-xl border border-black/[0.06]">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setViewMode('photo_map');
            }}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer",
              viewMode === 'photo_map'
                ? "bg-white text-[#1D1D1F] shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
          >
            Foto & Mapeo
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setViewMode('macro_zoom');
            }}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer",
              viewMode === 'macro_zoom'
                ? "bg-[#1D1D1F] text-white shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
          >
            Macro Zoom
          </button>
        </div>
      </div>

      {/* 2. Photo & Silicone Mapping Patch Interactive Display */}
      <div className="relative w-full bg-white rounded-xl border border-black/[0.06] overflow-hidden p-3 shadow-2xs space-y-3">
        {/* Main Photo Container with Eye & Overlay */}
        <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-neutral-900 border border-black/[0.08]">
          <img
            src={currentMap.photoUrl}
            alt={currentMap.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              viewMode === 'macro_zoom' ? "scale-140 object-center" : "scale-100"
            )}
            referrerPolicy="no-referrer"
          />

          {/* Vignette & Soft Gradient for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* Top Floating Chips */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold border border-white/15 flex items-center gap-1">
              <span>{currentMap.emoji}</span>
              <span>{currentMap.name}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-lg bg-rose-500/90 text-white text-[9px] font-bold shadow-2xs">
              {currentMap.badge}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[#1D1D1F] text-[10px] font-extrabold border border-black/10 shadow-2xs">
              Curva {curl} ({curlLabels[curl]?.degrees})
            </span>
          </div>

          {/* Bottom Photo Overlay Specs */}
          <div className="absolute bottom-2.5 inset-x-2.5 flex items-end justify-between z-10 text-white">
            <div className="space-y-0.5 max-w-[75%]">
              <p className="text-xs font-extrabold truncate drop-shadow-sm">
                {currentMap.tagline}
              </p>
              <p className="text-[10px] text-white/80 line-clamp-1">
                Lagrimal: <span className="font-bold text-white">{currentMap.innerMm}mm</span> • Ápice: <span className="font-bold text-rose-300">{currentMap.apexMm}mm</span> • Extremo: <span className="font-bold text-white">{currentMap.outerMm}mm</span>
              </p>
            </div>
            <span className="text-[11px] font-extrabold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
              {techniqueLabels[technique]}
            </span>
          </div>
        </div>

        {/* 3. Curved Silicone Under-Eye Patch with Length Dividers (Matching Reference Image) */}
        <div className="relative w-full bg-[#FAF5EE] rounded-xl border border-[#E8DCCB] p-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-extrabold text-[#7A6453] uppercase tracking-wider flex items-center gap-1">
              <Ruler className="size-3 text-rose-600" />
              Parche de Mapeo Milimétrico (Lash Map Tape)
            </span>
            <span className="text-[10px] font-bold text-[#8C7A6B]">
              {currentMap.lengths.length} Zonas de Longitud
            </span>
          </div>

          {/* Curved Lash Patch Graphical Bar */}
          <div className="relative w-full h-11 bg-white rounded-lg border border-[#DECDBB] shadow-inner overflow-hidden flex items-stretch">
            {currentMap.lengths.map((mm, idx) => {
              const isPeak = idx === currentMap.highlightIndex;
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center transition-colors relative border-r last:border-r-0 border-[#E8DCCB]/80",
                    isPeak ? "bg-rose-50/90 text-rose-700 font-extrabold" : "text-[#48484A] font-semibold"
                  )}
                >
                  {/* Top tick mark */}
                  <div className={cn("w-0.5 h-1.5 mb-0.5", isPeak ? "bg-rose-500" : "bg-[#C4B2A0]")} />
                  <span className={cn("text-xs leading-none", isPeak ? "text-rose-700 font-extrabold text-sm" : "text-[#2C2C2E]")}>
                    {mm}
                  </span>
                  <span className="text-[8px] text-[#8E8E93] leading-none mt-0.5">mm</span>
                  {isPeak && (
                    <div className="absolute -top-0.5 inset-x-0 h-0.5 bg-rose-500" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Guide labels under the patch */}
          <div className="flex items-center justify-between text-[9px] font-bold text-[#8C7A6B] mt-1.5 px-1">
            <span>◀ Lagrimal ({currentMap.innerMm}mm)</span>
            <span className="text-rose-700 font-extrabold">▲ Punto Focal ({currentMap.apexMm}mm)</span>
            <span>Extremo Exterior ({currentMap.outerMm}mm) ▶</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Summary Capsule (Matching the Nails Flow Palette) */}
      <div className="flex items-center justify-between text-xs px-1 text-[#1D1D1F]">
        <div className="flex items-center gap-1.5 font-bold">
          <span>{techniqueLabels[technique]}</span>
          <span className="text-black/30">•</span>
          <span className="text-[#86868B]">{curlLabels[curl]?.name}</span>
          <span className="text-black/30">•</span>
          <span className="text-rose-600 font-semibold">{currentMap.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#86868B]">~{durationMins} min</span>
          <span className="text-xs font-extrabold text-[#1D1D1F]">${priceMXN} MXN</span>
        </div>
      </div>
    </div>
  );
}
