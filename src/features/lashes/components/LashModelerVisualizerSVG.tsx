import React, { useState } from 'react';
import { Sparkles, Eye, ZoomIn, ZoomOut, Sliders, Info, ShieldCheck, Check } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerHaptic } from '@/shared/utils/haptics';
import { LashTechniqueType, LashCurlType, LashMappingType } from './LashVectorPreview';

interface LashModelerVisualizerSVGProps {
  technique: LashTechniqueType;
  curl: LashCurlType;
  mapping: LashMappingType;
  appointmentType?: 'full_set' | 'touchup_2w' | 'touchup_3w' | 'removal_and_new';
  priceMXN?: number;
  durationMins?: number;
  compact?: boolean;
}

export function LashModelerVisualizerSVG({
  technique = 'hybrid',
  curl = 'D',
  mapping = 'cat_eye',
  appointmentType = 'full_set',
  priceMXN = 900,
  durationMins = 90,
  compact = false
}: LashModelerVisualizerSVGProps) {
  const [viewMode, setViewMode] = useState<'full_eye' | 'macro_zoom'>('full_eye');

  const techniqueLabels: Record<LashTechniqueType, string> = {
    classic: 'Clásica Natural (1:1)',
    hybrid: 'Híbridas Foxy (3D)',
    russian: 'Volumen Ruso (5D)',
    lifting: 'Lash Lifting + Keratina'
  };

  const mappingLabels: Record<LashMappingType, string> = {
    natural: 'Natural Anatómico',
    cat_eye: 'Cat Eye / Foxy',
    doll_eye: 'Doll Eye / Muñeca',
    wispy: 'Wispy / Kim K',
    dramatic: 'Dramatic / Glamour',
    squirrel: 'Squirrel / Ardilla',
    spiky: 'Spiky / Manga',
    open_eye: 'Open Eye / Apertura'
  };

  const curlLabels: Record<LashCurlType, { name: string; degrees: string }> = {
    C: { name: 'Curva C Natural', degrees: '55°' },
    D: { name: 'Curva D Glamour', degrees: '70°' },
    L: { name: 'Curva L Foxy Lift', degrees: '85°' }
  };

  // Length guidelines per mapping
  const mappingGuidelines: Record<LashMappingType, { inner: string; center: string; outer: string }> = {
    natural: { inner: '8 mm', center: '11 mm', outer: '8 mm' },
    cat_eye: { inner: '8 mm', center: '12 mm', outer: '16 mm (Foxy Wing)' },
    doll_eye: { inner: '9 mm', center: '12 mm (Apex)', outer: '9 mm' },
    wispy: { inner: '8 mm', center: '14 mm (Spikes)', outer: '8 mm' },
    dramatic: { inner: '9 mm', center: '15 mm (Mega)', outer: '9 mm' },
    squirrel: { inner: '8 mm', center: '13 mm (Arco)', outer: '9 mm' },
    spiky: { inner: '8 mm', center: '14 mm (Anime)', outer: '8 mm' },
    open_eye: { inner: '8 mm', center: '14 mm (Centro)', outer: '8 mm' }
  };

  const guide = mappingGuidelines[mapping] || mappingGuidelines.cat_eye;

  return (
    <div className="w-full bg-[#FAF9F7] rounded-2xl border border-black/[0.08] p-3.5 sm:p-4 shadow-2xs space-y-3">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center size-6 rounded-lg bg-rose-50 text-rose-700">
            <Sparkles className="size-3.5" />
          </span>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">
              Simulador SVG Hi-Res Realista
            </h3>
            <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-extrabold tracking-wide uppercase">
              Interactúa
            </span>
          </div>
        </div>

        {/* View Mode Toggle: Ojo Completo vs. Macro Zoom */}
        <div className="flex items-center p-0.5 bg-neutral-200/60 rounded-xl border border-black/[0.06]">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setViewMode('full_eye');
            }}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer",
              viewMode === 'full_eye'
                ? "bg-white text-[#1D1D1F] shadow-2xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
          >
            Ojo Completo
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

      {/* Interactive Eye Simulator Canvas */}
      <div className="relative w-full h-44 sm:h-52 bg-gradient-to-b from-[#FDFBF9] to-[#F5F2EB] rounded-xl border border-black/[0.05] overflow-hidden flex items-center justify-center p-2">
        {/* Millimeter Guidelines Overlay */}
        <div className="absolute top-3 left-3 text-[10px] text-[#86868B] space-y-0.5 border-l border-dashed border-black/20 pl-2 font-mono">
          <p className="flex items-center gap-1">
            <span className="w-2.5 h-[1px] bg-rose-400 inline-block" />
            Lagrimal: <span className="font-bold text-[#1D1D1F]">{guide.inner}</span>
          </p>
          <p className="flex items-center gap-1">
            <span className="w-2.5 h-[1px] bg-rose-400 inline-block" />
            Centro: <span className="font-bold text-[#1D1D1F]">{guide.center}</span>
          </p>
          <p className="flex items-center gap-1">
            <span className="w-2.5 h-[1px] bg-rose-400 inline-block" />
            Extremo: <span className="font-bold text-[#1D1D1F]">{guide.outer}</span>
          </p>
        </div>

        {/* Curvature Spec on Top Right */}
        <div className="absolute top-3 right-3 text-right">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-black/[0.08] text-[#1D1D1F] shadow-2xs">
            Curva {curl} ({curlLabels[curl]?.degrees})
          </span>
        </div>

        {/* Realistic SVG Rendering */}
        <svg
          viewBox={viewMode === 'full_eye' ? '0 0 320 200' : '80 30 160 140'}
          className="w-full h-full max-h-48 transition-all duration-300 select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Tone Gradient */}
            <radialGradient id="eyelidSkin" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F7E2D6" />
              <stop offset="60%" stopColor="#EBCBB9" />
              <stop offset="100%" stopColor="#DDB59E" />
            </radialGradient>

            {/* Iris Gradient */}
            <radialGradient id="irisGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#8A6B53" />
              <stop offset="45%" stopColor="#5E4330" />
              <stop offset="85%" stopColor="#301F14" />
              <stop offset="100%" stopColor="#1C100A" />
            </radialGradient>

            {/* Sclera / Eye White Gradient */}
            <radialGradient id="scleraGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="80%" stopColor="#F5F3F0" />
              <stop offset="100%" stopColor="#E5DFDA" />
            </radialGradient>

            {/* Silk Lash Glow Filter */}
            <filter id="lashShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Background Eyelid Skin */}
          <path
            d="M 30 110 C 60 50, 260 50, 290 110 C 290 180, 30 180, 30 110 Z"
            fill="url(#eyelidSkin)"
          />

          {/* Eye Aperture (Sclera) */}
          <path
            d="M 45 110 C 85 70, 235 70, 275 110 C 235 145, 85 145, 45 110 Z"
            fill="url(#scleraGrad)"
            stroke="#D6C1B5"
            strokeWidth="1.5"
          />

          {/* Iris & Pupil */}
          <g>
            <circle cx="160" cy="110" r="32" fill="url(#irisGrad)" />
            <circle cx="160" cy="110" r="14" fill="#0A0706" />
            {/* Catchlight reflections for realistic glossy eye */}
            <circle cx="152" cy="102" r="5" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="168" cy="118" r="2" fill="#FFFFFF" fillOpacity="0.6" />
          </g>

          {/* Eyelid Upper Crease */}
          <path
            d="M 48 88 C 110 58, 210 58, 272 88"
            stroke="#C9A28E"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Upper Eyelash Waterline (Dense black liner) */}
          <path
            d="M 45 110 C 90 74, 230 74, 275 110"
            stroke="#1D1D1F"
            strokeWidth={technique === 'russian' ? '5.5' : technique === 'hybrid' ? '4.2' : '3'}
            strokeLinecap="round"
            fill="none"
          />

          {/* ============================================================ */}
          {/* LASH FIBERS & 3D CLUSTERS ACCORDING TO TECHNIQUE & MAPPING   */}
          {/* ============================================================ */}
          <g filter="url(#lashShadow)" strokeLinecap="round">
            {/* TECHNIQUE 1: CLÁSICA 1:1 */}
            {technique === 'classic' && (
              <g stroke="#18181B">
                {/* Inner corner fibers (8-9mm) */}
                <path d="M 60 108 Q 55 90 50 78" strokeWidth="2.2" />
                <path d="M 75 102 Q 72 82 66 66" strokeWidth="2.4" />
                <path d="M 90 96 Q 88 74 84 56" strokeWidth="2.5" />
                
                {/* Mid-eye fibers (10-12mm) */}
                <path d="M 110 90 Q 110 66 106 44" strokeWidth="2.6" />
                <path d="M 130 85 Q 132 58 128 36" strokeWidth="2.7" />
                <path d="M 150 82 Q 154 54 152 30" strokeWidth="2.8" />
                <path d="M 170 82 Q 176 54 178 30" strokeWidth="2.8" />
                <path d="M 190 85 Q 200 58 206 36" strokeWidth="2.7" />
                <path d="M 210 90 Q 224 66 234 44" strokeWidth="2.6" />

                {/* Outer corner wing (Cat eye or natural) */}
                <path d="M 230 96 Q 250 72 264 50" strokeWidth="2.5" />
                <path d="M 248 102 Q 272 80 286 60" strokeWidth="2.4" />
                <path d="M 264 108 Q 290 90 302 76" strokeWidth="2.2" />
              </g>
            )}

            {/* TECHNIQUE 2: HÍBRIDAS FOXY (3D Fans + Spikes) */}
            {technique === 'hybrid' && (
              <g stroke="#111113">
                {/* Base foundation layer */}
                <path d="M 60 108 Q 54 90 48 76" strokeWidth="1.8" stroke="#3F3F46" />
                <path d="M 85 98 Q 80 76 74 58" strokeWidth="1.8" stroke="#3F3F46" />
                <path d="M 135 84 Q 138 56 134 32" strokeWidth="2" stroke="#3F3F46" />
                <path d="M 185 84 Q 194 56 200 32" strokeWidth="2" stroke="#3F3F46" />
                <path d="M 235 98 Q 256 74 270 52" strokeWidth="2" stroke="#3F3F46" />

                {/* 3D Fan Clusters */}
                {/* Fan 1 (Inner) */}
                <path d="M 72 103 Q 66 84 60 70" strokeWidth="2.4" />
                <path d="M 72 103 Q 70 82 66 66" strokeWidth="2.6" />
                <path d="M 72 103 Q 75 84 76 70" strokeWidth="2.4" />

                {/* Fan 2 */}
                <path d="M 105 92 Q 100 70 94 50" strokeWidth="2.6" />
                <path d="M 105 92 Q 106 66 104 42" strokeWidth="3" />
                <path d="M 105 92 Q 112 70 116 52" strokeWidth="2.6" />

                {/* Fan 3 (Center Arch) */}
                <path d="M 150 82 Q 146 54 140 30" strokeWidth="2.8" />
                <path d="M 150 82 Q 154 50 152 24" strokeWidth="3.2" stroke="#09090B" />
                <path d="M 150 82 Q 160 54 166 30" strokeWidth="2.8" />

                {/* Fan 4 (Center-Outer) */}
                <path d="M 195 86 Q 198 56 200 32" strokeWidth="2.8" />
                <path d="M 195 86 Q 208 52 216 26" strokeWidth="3.2" stroke="#09090B" />
                <path d="M 195 86 Q 216 58 226 36" strokeWidth="2.8" />

                {/* Fan 5 (Foxy Wing Tail 14mm) */}
                <path d="M 235 98 Q 248 70 258 46" strokeWidth="2.8" />
                <path d="M 235 98 Q 262 66 278 38" strokeWidth="3.4" stroke="#09090B" />
                <path d="M 235 98 Q 272 74 292 52" strokeWidth="2.8" />

                {/* Wing tip */}
                <path d="M 260 106 Q 288 84 308 64" strokeWidth="2.8" />
                <path d="M 260 106 Q 296 90 316 74" strokeWidth="2.5" />
              </g>
            )}

            {/* TECHNIQUE 3: VOLUMEN RUSO (Dense Multi-fiber 5D-6D) */}
            {technique === 'russian' && (
              <g stroke="#09090B">
                {/* Ultra dense black liner root */}
                <path d="M 50 110 C 90 70, 230 70, 275 110" stroke="#000000" strokeWidth="6.5" />

                {/* 5-fiber Fan Clusters across entire lid */}
                {[65, 90, 115, 140, 165, 190, 215, 240, 260].map((x, idx) => {
                  const isOuter = idx >= 6;
                  const spread = isOuter ? 22 : 16;
                  const lengthFactor = mapping === 'cat_eye' && isOuter ? 1.3 : 1.0;
                  return (
                    <g key={idx}>
                      <path d={`M ${x} 95 Q ${x - spread} 65 ${x - spread * 1.3} 38`} strokeWidth="2" />
                      <path d={`M ${x} 95 Q ${x - spread * 0.5} 60 ${x - spread * 0.6} 28`} strokeWidth="2.4" />
                      <path d={`M ${x} 95 Q ${x + (isOuter ? 8 : 0)} 55 ${x + (isOuter ? 14 : 0)} 20`} strokeWidth="2.8" />
                      <path d={`M ${x} 95 Q ${x + spread * 0.5} 60 ${x + spread * 0.6} 28`} strokeWidth="2.4" />
                      <path d={`M ${x} 95 Q ${x + spread} 65 ${x + spread * 1.3} 38`} strokeWidth="2" />
                    </g>
                  );
                })}
              </g>
            )}

            {/* TECHNIQUE 4: LASH LIFTING (Curled natural lashes + keratin gloss) */}
            {technique === 'lifting' && (
              <g stroke="#27272A">
                {/* Lifted upward root curve with clean natural separation */}
                <path d="M 60 108 Q 58 92 56 82" strokeWidth="2" />
                <path d="M 80 100 Q 80 80 78 66" strokeWidth="2.2" />
                <path d="M 105 92 Q 106 70 105 52" strokeWidth="2.4" />
                <path d="M 130 85 Q 132 60 130 40" strokeWidth="2.5" />
                <path d="M 160 82 Q 162 54 160 34" strokeWidth="2.6" />
                <path d="M 190 85 Q 194 60 196 40" strokeWidth="2.5" />
                <path d="M 218 92 Q 226 70 230 52" strokeWidth="2.4" />
                <path d="M 245 100 Q 256 80 262 66" strokeWidth="2.2" />
                <path d="M 268 108 Q 282 92 290 82" strokeWidth="2" />

                {/* Keratin sparkles */}
                <circle cx="160" cy="34" r="2" fill="#E07A5F" />
                <circle cx="130" cy="40" r="1.5" fill="#E07A5F" />
                <circle cx="196" cy="40" r="1.5" fill="#E07A5F" />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Bottom Configuration Capsule (Matching the exact look from user's screenshot) */}
      <div className="flex items-center justify-between text-xs px-1 text-[#1D1D1F]">
        <div className="flex items-center gap-1.5 font-bold">
          <span>{techniqueLabels[technique]}</span>
          <span className="text-black/30">•</span>
          <span className="text-[#86868B]">{curlLabels[curl]?.name}</span>
          <span className="text-black/30">•</span>
          <span className="text-rose-600 font-semibold">{mappingLabels[mapping]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#86868B]">~{durationMins} min</span>
          <span className="text-xs font-extrabold text-[#1D1D1F]">${priceMXN} MXN</span>
        </div>
      </div>
    </div>
  );
}
