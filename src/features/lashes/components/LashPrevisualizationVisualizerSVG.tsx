import React, { useState } from 'react';
import { 
  Eye, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Sliders, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Flame, 
  Layers, 
  Info,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerHaptic } from '@/shared/utils/haptics';

export type LashDensityType = 'classic_1_to_1' | 'hybrid_2d_3d' | 'russian_volume' | 'mega_volume' | 'lash_lifting';
export type LashCurvatureType = 'C' | 'D' | 'L' | 'M';
export type LashEyeMappingType = 'natural_eye' | 'cat_eye' | 'doll_eye' | 'wispy_kim';
export type LashAppointmentType = 'full_set' | 'touchup_2w' | 'touchup_3w' | 'removal_and_new';
export type LashLengthRange = 'natural' | 'medium' | 'long' | 'dramatic';

export interface LashDensityConfig {
  id: LashDensityType;
  name: string;
  subtitle: string;
  badge: string;
  basePriceMXN: number;
  durationMinutes: number;
  touchup2wPriceMXN: number;
  touchup3wPriceMXN: number;
  description: string;
  fanCount: string;
  recommendedFor: string;
}

export const LASH_DENSITIES: LashDensityConfig[] = [
  {
    id: 'classic_1_to_1',
    name: 'Clásica (1 a 1)',
    subtitle: 'Efecto Rímel Natural',
    badge: 'Más Natural',
    basePriceMXN: 750,
    durationMinutes: 75,
    touchup2wPriceMXN: 420,
    touchup3wPriceMXN: 520,
    description: 'Una extensión de seda ultra fina adherida a cada una de tus pestañas naturales.',
    fanCount: '1 extensión por pestaña',
    recommendedFor: 'Pestañas abundantes que buscan longitud y definición diaria sin maquillaje.'
  },
  {
    id: 'hybrid_2d_3d',
    name: 'Híbridas (2D / 3D)',
    subtitle: 'Textura Esponjosa & Volumen Medio',
    badge: 'Más Pedidas',
    basePriceMXN: 900,
    durationMinutes: 90,
    touchup2wPriceMXN: 500,
    touchup3wPriceMXN: 620,
    description: 'Combinación equilibrada de extensiones clásicas con abanicos de 2D/3D hechos a mano.',
    fanCount: 'Mix de 1:1 y abanicos 3D',
    recommendedFor: 'Quien busca un toque más esponjoso y tupido que el clásico sin ser pesado.'
  },
  {
    id: 'russian_volume',
    name: 'Volumen Ruso (4D / 6D)',
    subtitle: 'Densidad y Delineado Intenso',
    badge: 'Efecto Foxy Top',
    basePriceMXN: 1150,
    durationMinutes: 105,
    touchup2wPriceMXN: 600,
    touchup3wPriceMXN: 750,
    description: 'Abanicos artesanales ultralivianos de 4 a 6 fibras que multiplican tu densidad natural.',
    fanCount: '4 a 6 fibras ultra-finas (0.05mm)',
    recommendedFor: 'Efecto delineado negro permanente, miradas glamurosas y sesiones de fotos.'
  },
  {
    id: 'mega_volume',
    name: 'Mega Volumen (8D / 12D)',
    subtitle: 'Máximo Impacto & Negro Profundo',
    badge: 'Máxima Densidad',
    basePriceMXN: 1380,
    durationMinutes: 120,
    touchup2wPriceMXN: 720,
    touchup3wPriceMXN: 880,
    description: 'Micro-fibras de 0.03mm en abanicos densos para un negro total aterciopelado.',
    fanCount: '8 a 12 micro-fibras por pestaña',
    recommendedFor: 'Amantes del drama total y efecto pestañas postizas tupidas 24/7.'
  },
  {
    id: 'lash_lifting',
    name: 'Lash Lifting + Keratina',
    subtitle: 'Tratamiento sobre tu pestaña natural',
    badge: 'Sin Extensiones',
    basePriceMXN: 550,
    durationMinutes: 50,
    touchup2wPriceMXN: 550,
    touchup3wPriceMXN: 550,
    description: 'Curvado permanente de tu propia pestaña con baño de keratina y tinte negro azulado.',
    fanCount: '100% tu pestaña natural',
    recommendedFor: 'Quienes prefieren cero mantenimiento de extensiones y frotarse los ojos libremente.'
  }
];

export const LASH_CURVATURES: { id: LashCurvatureType; name: string; angle: string; desc: string; look: string }[] = [
  { id: 'C', name: 'Curva C', angle: '55° Lift', desc: 'Curvatura natural elegante', look: 'Abre la mirada con sutileza clásica' },
  { id: 'D', name: 'Curva D', angle: '70° Glam', desc: 'Curva pronunciada tipo muñeca', look: 'Efecto ojo abierto y pestaña rizada con cuchara' },
  { id: 'L', name: 'Curva L', angle: '85° Foxy', desc: 'Base recta y elevación angular', look: 'Efecto delineado Foxy Eye / Cat Eye extremo' },
  { id: 'M', name: 'Curva M', angle: '75° Lifted', desc: 'Curva suave para párpado caído', look: 'Levanta miradas encapotadas sin tocar el párpado' }
];

export const LASH_MAPPINGS: { id: LashEyeMappingType; name: string; formula: string; desc: string }[] = [
  { id: 'natural_eye', name: 'Diseño Natural', formula: '8mm - 11mm - 9mm', desc: 'Sigue la anatomía natural de tu ojo; más largas en el arco iris.' },
  { id: 'cat_eye', name: 'Ojo de Gato / Foxy', formula: '8mm - 11mm - 14mm', desc: 'Longitud creciente hacia la comisura exterior para rasgar la mirada.' },
  { id: 'doll_eye', name: 'Efecto Muñeca', formula: '9mm - 13mm - 9mm', desc: 'Longitud máxima al centro de la pupila para agrandar y redondear el ojo.' },
  { id: 'wispy_kim', name: 'Wispy / Picos Kim K', formula: 'Capas 8-14mm con picos', desc: 'Abanicos base cortos con espigas largas texturizadas estilo editorial.' }
];

export const LASH_LENGTHS: { id: LashLengthRange; label: string; range: string }[] = [
  { id: 'natural', label: 'Natural', range: '8 – 10 mm' },
  { id: 'medium', label: 'Medio Salón', range: '9 – 12 mm' },
  { id: 'long', label: 'Largo Glam', range: '10 – 14 mm' },
  { id: 'dramatic', label: 'Extremo XL', range: '11 – 16 mm' }
];

export const APPOINTMENT_TYPES: { id: LashAppointmentType; title: string; subtitle: string }[] = [
  { id: 'full_set', title: 'Primera Puesta / Set Completo', subtitle: '100% pestañas naturales cubiertas' },
  { id: 'touchup_2w', title: 'Retoque (Hasta 2 Semanas)', subtitle: 'Relleno del 50% de pestañas' },
  { id: 'touchup_3w', title: 'Retoque (Hasta 3 Semanas)', subtitle: 'Relleno del 65% de pestañas' },
  { id: 'removal_and_new', title: 'Retiro Previo + Set Nuevo', subtitle: 'Retiro seguro con gel desbonder (+ $150 MXN)' }
];

export interface LashPrevisualizationProps {
  initialDensity?: LashDensityType;
  initialCurvature?: LashCurvatureType;
  initialMapping?: LashEyeMappingType;
  initialAppointmentType?: LashAppointmentType;
  initialLength?: LashLengthRange;
  onProceedToBooking?: (selection: {
    density: LashDensityConfig;
    curvature: LashCurvatureType;
    mapping: LashEyeMappingType;
    appointmentType: LashAppointmentType;
    length: LashLengthRange;
    totalPriceMXN: number;
    durationMinutes: number;
  }) => void;
  className?: string;
}

export function LashPrevisualizationVisualizerSVG({
  initialDensity = 'hybrid_2d_3d',
  initialCurvature = 'D',
  initialMapping = 'cat_eye',
  initialAppointmentType = 'full_set',
  initialLength = 'medium',
  onProceedToBooking,
  className = ''
}: LashPrevisualizationProps) {
  const [density, setDensity] = useState<LashDensityType>(initialDensity);
  const [curvature, setCurvature] = useState<LashCurvatureType>(initialCurvature);
  const [mapping, setMapping] = useState<LashEyeMappingType>(initialMapping);
  const [appointmentType, setAppointmentType] = useState<LashAppointmentType>(initialAppointmentType);
  const [lengthRange, setLengthRange] = useState<LashLengthRange>(initialLength);
  const [viewMode, setViewMode] = useState<'front' | 'angle'>('front');

  const activeDensityConfig = LASH_DENSITIES.find(d => d.id === density) || LASH_DENSITIES[1];

  // Deterministic Pricing Calculation
  const calculateTotal = () => {
    let price = activeDensityConfig.basePriceMXN;
    let duration = activeDensityConfig.durationMinutes;

    if (appointmentType === 'touchup_2w') {
      price = activeDensityConfig.touchup2wPriceMXN;
      duration = Math.round(activeDensityConfig.durationMinutes * 0.65);
    } else if (appointmentType === 'touchup_3w') {
      price = activeDensityConfig.touchup3wPriceMXN;
      duration = Math.round(activeDensityConfig.durationMinutes * 0.8);
    } else if (appointmentType === 'removal_and_new') {
      price = activeDensityConfig.basePriceMXN + 150;
      duration = activeDensityConfig.durationMinutes + 20;
    }

    if (lengthRange === 'dramatic') {
      price += 100;
    }

    return { price, duration };
  };

  const { price: totalPriceMXN, duration: totalDurationMinutes } = calculateTotal();

  // Procedural dynamic lashes for front eye SVG
  const generateFrontLashes = () => {
    const lashes: Array<{
      id: number;
      x1: number;
      y1: number;
      cx: number;
      cy: number;
      x2: number;
      y2: number;
      strokeWidth: number;
      opacity: number;
    }> = [];

    // Density factor determines lash count & fan multiplier
    const count = density === 'classic_1_to_1' ? 32 : density === 'hybrid_2d_3d' ? 52 : density === 'russian_volume' ? 74 : density === 'mega_volume' ? 95 : 28;
    
    // Curvature modifies curl elevation
    const curlDeltaY = curvature === 'C' ? -22 : curvature === 'D' ? -28 : curvature === 'L' ? -24 : -26;
    const curlDeltaX = curvature === 'L' ? 14 : curvature === 'M' ? 8 : 4;

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1); // 0 (inner canthus) to 1 (outer canthus)
      
      // Eyelid upper lash line coordinates (smooth arc)
      const x1 = 55 + t * 190;
      const y1 = 118 - Math.sin(t * Math.PI) * 38;

      // Mapping multipliers (Cat Eye, Doll Eye, Natural, Wispy)
      let lengthFactor = 1.0;
      if (mapping === 'cat_eye') {
        lengthFactor = 0.6 + t * 0.85; // Inner 0.6x, Outer 1.45x
      } else if (mapping === 'doll_eye') {
        lengthFactor = 0.6 + Math.sin(t * Math.PI) * 0.8; // Middle 1.4x
      } else if (mapping === 'wispy_kim') {
        const isSpike = i % 5 === 0;
        lengthFactor = (0.7 + Math.sin(t * Math.PI) * 0.5) * (isSpike ? 1.4 : 0.85);
      } else {
        // Natural eye
        lengthFactor = 0.75 + Math.sin(t * Math.PI) * 0.45;
      }

      // Length preset scale
      const lengthScale = lengthRange === 'natural' ? 0.85 : lengthRange === 'medium' ? 1.0 : lengthRange === 'long' ? 1.2 : 1.35;

      const totalScale = lengthFactor * lengthScale;

      // Fanning angle based on eye position
      const fanAngleOffset = (t - 0.45) * 28;
      const x2 = x1 + fanAngleOffset * 0.8 + (t > 0.6 ? curlDeltaX : 0);
      const y2 = y1 + curlDeltaY * totalScale;

      const cx = (x1 + x2) / 2 + fanAngleOffset * 0.4;
      const cy = y1 + (curlDeltaY * 0.6) * totalScale;

      const strokeWidth = density === 'classic_1_to_1' ? 1.6 : density === 'hybrid_2d_3d' ? 1.3 : density === 'russian_volume' ? 1.0 : density === 'mega_volume' ? 0.9 : 1.4;
      const opacity = density === 'mega_volume' ? 0.95 : 0.9;

      lashes.push({
        id: i,
        x1,
        y1,
        cx,
        cy,
        x2,
        y2,
        strokeWidth,
        opacity
      });
    }

    return lashes;
  };

  const lashes = generateFrontLashes();

  const handleBooking = () => {
    triggerHaptic(12);
    if (onProceedToBooking) {
      onProceedToBooking({
        density: activeDensityConfig,
        curvature,
        mapping,
        appointmentType,
        length: lengthRange,
        totalPriceMXN,
        durationMinutes: totalDurationMinutes
      });
    }
  };

  return (
    <div className={cn("w-full bg-white rounded-3xl border border-black/[0.07] shadow-xs overflow-hidden flex flex-col", className)}>
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-black/[0.06] bg-[#FAF9F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/50 flex items-center gap-1">
              <Eye className="size-3 text-rose-600" />
              Lashista Studio
            </span>
            <span className="text-xs font-semibold text-[#86868B]">
              Simulador Visual & Cotizador Determinista
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F] mt-1">
            Personaliza tu Diseño de Pestañas
          </h2>
        </div>

        {/* View Toggle (Front vs Curvature Profile) */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-black/[0.08] shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setViewMode('front');
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              viewMode === 'front' ? "bg-[#1D1D1F] text-white shadow-2xs" : "text-[#636366] hover:text-[#1D1D1F]"
            )}
          >
            Vista Frente
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setViewMode('angle');
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              viewMode === 'angle' ? "bg-[#1D1D1F] text-white shadow-2xs" : "text-[#636366] hover:text-[#1D1D1F]"
            )}
          >
            Perfil & Curvatura
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Eye SVG on Left, Clean Deterministic Pickers on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Interactive Vector Eye Display */}
        <div className="lg:col-span-5 p-5 bg-[#FAF9F7]/50 border-b lg:border-b-0 lg:border-r border-black/[0.06] flex flex-col items-center justify-between">
          <div className="w-full text-center space-y-1 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868B]">
              Previsualización en Tiempo Real
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#1D1D1F]">
              <span>{activeDensityConfig.name}</span>
              <span className="text-black/30">•</span>
              <span>Curva {curvature}</span>
              <span className="text-black/30">•</span>
              <span className="text-primary">{LASH_MAPPINGS.find(m => m.id === mapping)?.name}</span>
            </div>
          </div>

          {/* Eye SVG Container */}
          <div className="w-full max-w-[320px] aspect-4/3 relative flex items-center justify-center bg-white rounded-2xl border border-black/[0.06] p-3 shadow-2xs overflow-hidden">
            {viewMode === 'front' ? (
              <svg
                viewBox="0 0 300 200"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Skin Background Ambient & Eyelid Crease */}
                <path d="M40 100C85 45 215 45 260 100" stroke="#E2BFB0" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" opacity="0.6"/>
                
                {/* Sclera (White of the eye) */}
                <path
                  d="M50 118C90 75 210 75 250 118C210 152 90 152 50 118Z"
                  fill="#FFFBF8"
                  stroke="#E8D1C5"
                  strokeWidth="1.6"
                />

                {/* Iris */}
                <circle cx="150" cy="116" r="32" fill="#4B382A" />
                <circle cx="150" cy="116" r="28" fill="#6A4E3D" />
                <circle cx="150" cy="116" r="24" stroke="#8D6852" strokeWidth="1.5" fill="none" opacity="0.5" />
                
                {/* Pupil */}
                <circle cx="150" cy="116" r="14" fill="#1A1513" />

                {/* Light Catch Reflective Sparkle */}
                <circle cx="143" cy="108" r="4.5" fill="#FFFFFF" fillOpacity="0.85" />
                <circle cx="156" cy="122" r="2" fill="#FFFFFF" fillOpacity="0.5" />

                {/* Lower Lash Line */}
                <path
                  d="M55 118C95 152 205 152 245 118"
                  stroke="#B89382"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                {/* Subtle Lower Lashes */}
                <path d="M90 137L87 146" stroke="#4A3B32" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                <path d="M120 142L119 152" stroke="#4A3B32" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                <path d="M150 143L150 153" stroke="#4A3B32" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                <path d="M180 141L182 151" stroke="#4A3B32" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                <path d="M210 135L214 144" stroke="#4A3B32" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>

                {/* Upper Eyelash Eyeliner Base */}
                <path
                  d="M50 118C90 75 210 75 250 118"
                  stroke="#1D1D1F"
                  strokeWidth={density === 'mega_volume' || density === 'russian_volume' ? "4" : "2.5"}
                  strokeLinecap="round"
                />

                {/* Dynamic Upper Lashes Generated with Bezier Curves */}
                {lashes.map((lash) => (
                  <path
                    key={lash.id}
                    d={`M${lash.x1} ${lash.y1} Q${lash.cx} ${lash.cy} ${lash.x2} ${lash.y2}`}
                    stroke="#141416"
                    strokeWidth={lash.strokeWidth}
                    strokeLinecap="round"
                    strokeOpacity={lash.opacity}
                  />
                ))}
              </svg>
            ) : (
              /* Profile Angle Curvature Inspection */
              <svg
                viewBox="0 0 300 200"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Eye Profile Side Contour */}
                <path d="M80 50C100 80 100 130 80 160" stroke="#D4B09B" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M80 85C120 95 130 115 130 115C130 115 110 135 80 145" fill="#FFFBF8" stroke="#D4B09B" strokeWidth="1.5"/>
                <ellipse cx="120" cy="115" rx="10" ry="16" fill="#4B382A" />
                <ellipse cx="122" cy="115" rx="5" ry="9" fill="#1A1513" />

                {/* Eyelid margin */}
                <circle cx="82" cy="92" r="3" fill="#1D1D1F" />

                {/* Natural straight lash reference line */}
                <path d="M82 92L145 92" stroke="#86868B" strokeWidth="1.2" strokeDasharray="3 3"/>
                <text x="150" y="95" fill="#86868B" fontSize="9" fontWeight="600">Pestaña Natural</text>

                {/* Active Lash Curvature Path */}
                {curvature === 'C' && (
                  <path d="M82 92C110 92 135 75 140 45" stroke="#1D1D1F" strokeWidth="3.5" strokeLinecap="round"/>
                )}
                {curvature === 'D' && (
                  <path d="M82 92C100 92 125 55 115 30" stroke="#1D1D1F" strokeWidth="3.5" strokeLinecap="round"/>
                )}
                {curvature === 'L' && (
                  <path d="M82 92L110 92L140 40" stroke="#1D1D1F" strokeWidth="3.5" strokeLinecap="round"/>
                )}
                {curvature === 'M' && (
                  <path d="M82 92L105 92C120 92 135 70 130 42" stroke="#1D1D1F" strokeWidth="3.5" strokeLinecap="round"/>
                )}

                <text x="82" y="180" fill="#1D1D1F" fontSize="11" fontWeight="bold">
                  Curva {curvature}: {LASH_CURVATURES.find(c => c.id === curvature)?.angle} ({LASH_CURVATURES.find(c => c.id === curvature)?.desc})
                </text>
              </svg>
            )}
          </div>

          {/* Quick Specs Summary under SVG */}
          <div className="w-full mt-3 p-3 bg-white rounded-xl border border-black/[0.06] text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#86868B]">
              <span>Técnica & Volumen:</span>
              <span className="font-semibold text-[#1D1D1F]">{activeDensityConfig.fanCount}</span>
            </div>
            <div className="flex items-center justify-between text-[#86868B]">
              <span>Curvatura:</span>
              <span className="font-semibold text-[#1D1D1F]">Curva {curvature} ({LASH_CURVATURES.find(c => c.id === curvature)?.angle})</span>
            </div>
            <div className="flex items-center justify-between text-[#86868B]">
              <span>Mapa de Ojo:</span>
              <span className="font-semibold text-[#1D1D1F]">{LASH_MAPPINGS.find(m => m.id === mapping)?.formula}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Deterministic Controls */}
        <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-5">
          {/* 1. Density & Technique Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                1. Selecciona Técnica & Volumen
              </span>
              <span className="text-[10px] text-[#86868B] lowercase font-normal">
                precios base de catálogo
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LASH_DENSITIES.map((d) => {
                const isSelected = density === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      triggerHaptic(8);
                      setDensity(d.id);
                    }}
                    className={cn(
                      "p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left",
                      isSelected
                        ? "border-[#1D1D1F] bg-neutral-900 text-white shadow-xs scale-[1.01]"
                        : "border-black/[0.07] bg-white text-[#1D1D1F] hover:border-black/20 hover:bg-neutral-50/70"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={cn(
                          "text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm",
                          isSelected ? "bg-white/20 text-white" : "bg-neutral-100 text-[#86868B]"
                        )}>
                          {d.badge}
                        </span>
                        <span className={cn(
                          "text-xs font-bold",
                          isSelected ? "text-amber-300" : "text-[#1D1D1F]"
                        )}>
                          ${d.basePriceMXN} MXN
                        </span>
                      </div>
                      <h4 className="text-xs font-bold truncate">{d.name}</h4>
                      <p className={cn(
                        "text-[10.5px] line-clamp-1 mt-0.5",
                        isSelected ? "text-white/80" : "text-[#86868B]"
                      )}>
                        {d.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Curvature & Eye Mapping Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-black/[0.04]">
            {/* Curvature */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1">
                <span>2. Curvatura</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {LASH_CURVATURES.map((c) => {
                  const isSelected = curvature === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setCurvature(c.id);
                      }}
                      className={cn(
                        "py-2 px-1 rounded-xl text-center border transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-2xs font-bold"
                          : "bg-[#FAF9F7] text-[#636366] border-black/[0.06] hover:bg-neutral-100"
                      )}
                    >
                      <span className="block text-xs font-extrabold">{c.id}</span>
                      <span className="block text-[9px] opacity-80 truncate">{c.angle}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Length Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1">
                <span>3. Rango de Largo</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {LASH_LENGTHS.map((l) => {
                  const isSelected = lengthRange === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setLengthRange(l.id);
                      }}
                      className={cn(
                        "py-2 px-1 rounded-xl text-center border transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-2xs font-bold"
                          : "bg-[#FAF9F7] text-[#636366] border-black/[0.06] hover:bg-neutral-100"
                      )}
                    >
                      <span className="block text-xs font-bold truncate">{l.label}</span>
                      <span className="block text-[9px] opacity-80">{l.range}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Eye Mapping Design */}
          <div className="space-y-1.5 pt-1 border-t border-black/[0.04]">
            <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <Sparkle className="size-3 text-primary" />
              4. Mapa & Diseño de Mirada
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {LASH_MAPPINGS.map((m) => {
                const isSelected = mapping === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(6);
                      setMapping(m.id);
                    }}
                    className={cn(
                      "p-2 rounded-xl text-left border transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-2xs"
                        : "bg-[#FAF9F7] text-[#1D1D1F] border-black/[0.06] hover:bg-neutral-100"
                    )}
                  >
                    <span className="block text-[11px] font-bold truncate">{m.name}</span>
                    <span className={cn(
                      "block text-[9px] truncate mt-0.5",
                      isSelected ? "text-white/70" : "text-[#86868B]"
                    )}>
                      {m.formula}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Type of Appointment (Set vs Retoque) */}
          <div className="space-y-1.5 pt-1 border-t border-black/[0.04]">
            <label className="text-xs font-bold text-[#1D1D1F] flex items-center justify-between">
              <span>5. Estado / Tipo de Cita</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {APPOINTMENT_TYPES.map((apt) => {
                const isSelected = appointmentType === apt.id;
                return (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(6);
                      setAppointmentType(apt.id);
                    }}
                    className={cn(
                      "p-2 rounded-xl text-left border transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-2xs font-semibold"
                        : "bg-[#FAF9F7] text-[#1D1D1F] border-black/[0.06] hover:bg-neutral-100"
                    )}
                  >
                    <span className="block text-[11px] font-bold truncate">{apt.title}</span>
                    <span className={cn(
                      "block text-[9px] truncate mt-0.5",
                      isSelected ? "text-white/70" : "text-[#86868B]"
                    )}>
                      {apt.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price & Duration Bottom Bar */}
          <div className="p-3.5 bg-neutral-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Precio Determinista
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-white">
                  ${totalPriceMXN} <span className="text-xs font-normal text-neutral-300">MXN</span>
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Tiempo en Cabina
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Clock className="size-3 text-amber-300" />
                  {totalDurationMinutes} minutos
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBooking}
              className="h-10 px-5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              <Calendar className="size-3.5 text-neutral-900" />
              <span>Continuar a Fecha & Hora</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
