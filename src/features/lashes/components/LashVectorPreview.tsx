import React from 'react';
import { cn } from '@emme/ui/lib/utils';

export type LashTechniqueType = 'classic' | 'hybrid' | 'russian' | 'lifting';
export type LashCurlType = 'C' | 'D' | 'L';
export type LashMappingType = 
  | 'cat_eye' 
  | 'doll_eye' 
  | 'natural' 
  | 'wispy' 
  | 'dramatic' 
  | 'squirrel' 
  | 'spiky' 
  | 'open_eye';

interface LashVectorPreviewProps {
  technique: LashTechniqueType;
  curl?: LashCurlType;
  mapping?: LashMappingType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  selected?: boolean;
}

/**
 * Lightweight, aesthetic vector icon/graphic renderer for lash techniques
 * Matching the exact luxury color palette and geometric elegance of the Nail Modeler
 */
export function LashVectorPreview({
  technique,
  curl = 'D',
  mapping = 'cat_eye',
  size = 'md',
  className,
  selected = false
}: LashVectorPreviewProps) {
  const dimensions = {
    sm: 'w-16 h-14',
    md: 'w-24 h-20',
    lg: 'w-36 h-28'
  }[size];

  // Colors aligned with the luxury nail palette
  const lashColor = selected ? '#1D1D1F' : '#2C2C2E';
  const accentColor = selected ? '#B89382' : '#D1D1D6';
  const bgFill = selected ? '#FDFBF7' : '#FAF9F7';

  return (
    <div className={cn("relative flex items-center justify-center rounded-2xl overflow-hidden select-none", dimensions, className)}>
      <svg
        viewBox="0 0 120 90"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle background glow */}
        <rect width="120" height="90" rx="16" fill={bgFill} />
        
        {/* Eyelid guide base line */}
        <path
          d="M18 68 C40 64, 80 64, 102 68"
          stroke="#E5E5EA"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 1. CLÁSICA (Pelo a Pelo 1:1 - Clean, spaced individual single fibers) */}
        {technique === 'classic' && (
          <g strokeLinecap="round">
            {/* Fine single lashes along the lashline */}
            <path d="M 28 67 Q 27 50 24 38" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 38 65 Q 38 45 36 30" stroke={lashColor} strokeWidth="2.4" />
            <path d="M 48 64 Q 50 42 49 26" stroke={lashColor} strokeWidth="2.5" />
            <path d="M 60 64 Q 63 40 64 24" stroke={lashColor} strokeWidth="2.6" />
            <path d="M 72 64 Q 76 42 79 26" stroke={lashColor} strokeWidth="2.5" />
            <path d="M 82 65 Q 88 46 92 31" stroke={lashColor} strokeWidth="2.4" />
            <path d="M 92 67 Q 99 52 104 40" stroke={lashColor} strokeWidth="2.2" />

            {/* Accent micro-fibers */}
            <circle cx="60" cy="24" r="1.5" fill="#B89382" />
          </g>
        )}

        {/* 2. HÍBRIDAS (Mix 1:1 + Abanicos 3D - Fluffy textured layers) */}
        {technique === 'hybrid' && (
          <g strokeLinecap="round">
            {/* Single base lashes */}
            <path d="M 26 67 Q 24 52 20 40" stroke={accentColor} strokeWidth="1.8" />
            <path d="M 45 64 Q 45 42 43 27" stroke={accentColor} strokeWidth="1.8" />
            <path d="M 75 64 Q 78 44 82 28" stroke={accentColor} strokeWidth="1.8" />
            <path d="M 95 67 Q 102 52 106 38" stroke={accentColor} strokeWidth="1.8" />

            {/* 3D Fluffy Fans */}
            {/* Fan 1 (inner/center) */}
            <path d="M 35 65 Q 31 46 27 33" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 35 65 Q 35 44 34 29" stroke={lashColor} strokeWidth="2.4" />
            <path d="M 35 65 Q 39 46 42 33" stroke={lashColor} strokeWidth="2.2" />

            {/* Fan 2 (center) */}
            <path d="M 60 64 Q 54 42 50 24" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 60 64 Q 61 38 62 20" stroke={lashColor} strokeWidth="2.6" />
            <path d="M 60 64 Q 67 42 72 25" stroke={lashColor} strokeWidth="2.2" />

            {/* Fan 3 (outer cat eye wing) */}
            <path d="M 85 65 Q 86 46 88 30" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 85 65 Q 92 44 98 26" stroke={lashColor} strokeWidth="2.6" />
            <path d="M 85 65 Q 97 48 105 35" stroke={lashColor} strokeWidth="2.2" />

            <circle cx="62" cy="20" r="2" fill="#B89382" />
          </g>
        )}

        {/* 3. VOLUMEN RUSO (4D-6D - Dense, velvety multi-fiber fans) */}
        {technique === 'russian' && (
          <g strokeLinecap="round">
            {/* Dense dark base waterline */}
            <path
              d="M20 67 C42 63, 78 63, 100 67"
              stroke="#1D1D1F"
              strokeWidth="5"
            />

            {/* Dense fan clusters */}
            {/* Cluster 1 */}
            <path d="M 28 66 Q 22 50 16 36" stroke={lashColor} strokeWidth="1.8" />
            <path d="M 28 66 Q 25 48 22 32" stroke={lashColor} strokeWidth="2" />
            <path d="M 28 66 Q 28 46 27 28" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 28 66 Q 31 48 33 32" stroke={lashColor} strokeWidth="2" />
            <path d="M 28 66 Q 35 50 39 36" stroke={lashColor} strokeWidth="1.8" />

            {/* Cluster 2 (Center peak) */}
            <path d="M 50 64 Q 42 42 36 24" stroke={lashColor} strokeWidth="1.8" />
            <path d="M 50 64 Q 46 40 43 20" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 50 64 Q 50 36 51 16" stroke={lashColor} strokeWidth="2.6" />
            <path d="M 50 64 Q 55 40 59 20" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 50 64 Q 60 42 66 24" stroke={lashColor} strokeWidth="1.8" />

            {/* Cluster 3 (Outer high density) */}
            <path d="M 75 64 Q 68 42 64 24" stroke={lashColor} strokeWidth="1.8" />
            <path d="M 75 64 Q 73 40 73 18" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 75 64 Q 78 37 82 17" stroke={lashColor} strokeWidth="2.6" />
            <path d="M 75 64 Q 84 40 91 22" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 75 64 Q 89 44 98 28" stroke={lashColor} strokeWidth="1.8" />

            {/* Wing tail */}
            <path d="M 94 66 Q 102 48 108 30" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 94 66 Q 106 52 112 38" stroke={lashColor} strokeWidth="2" />
          </g>
        )}

        {/* 4. LASH LIFTING (Curved Natural Lash Arch + Keratin Glow) */}
        {technique === 'lifting' && (
          <g strokeLinecap="round">
            {/* Natural glossy curved lashes */}
            <path d="M 25 67 C 23 54, 21 44, 20 34" stroke={lashColor} strokeWidth="2.2" />
            <path d="M 35 65 C 33 50, 32 38, 32 26" stroke={lashColor} strokeWidth="2.4" />
            <path d="M 46 64 C 45 46, 46 32, 47 20" stroke={lashColor} strokeWidth="2.6" />
            <path d="M 58 64 C 58 44, 61 30, 63 18" stroke={lashColor} strokeWidth="2.8" />
            <path d="M 70 64 C 71 44, 76 31, 80 20" stroke={lashColor} strokeWidth="2.6" />
            <path d="M 82 65 C 85 48, 91 36, 96 26" stroke={lashColor} strokeWidth="2.4" />
            <path d="M 94 67 C 98 52, 105 42, 108 34" stroke={lashColor} strokeWidth="2.2" />

            {/* Keratin nourishment sparkles */}
            <path d="M 63 12 L 64 16 L 68 17 L 64 18 L 63 22 L 62 18 L 58 17 L 62 16 Z" fill="#B89382" />
            <path d="M 44 14 L 45 17 L 48 18 L 45 19 L 44 22 L 43 19 L 40 18 L 43 17 Z" fill="#D4AF37" opacity="0.8" />
          </g>
        )}

        {/* Eyelid subtle shading line */}
        <path
          d="M 22 73 C 44 70, 76 70, 98 73"
          stroke="#E5E5EA"
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />
      </svg>
    </div>
  );
}

/**
 * Curvature Profile Vector (Visualizing Side-Angle Curvature C, D, L)
 */
export function LashCurlProfileSVG({
  curl,
  selected = false,
  className
}: {
  curl: LashCurlType;
  selected?: boolean;
  className?: string;
}) {
  const strokeColor = selected ? '#1D1D1F' : '#636366';
  const baseColor = selected ? '#B89382' : '#C7C7CC';

  const paths = {
    // Curva C: 55° Natural smooth arch
    C: 'M 25 65 C 38 65, 62 50, 68 28',
    // Curva D: 70° Pronounced round doll-curl
    D: 'M 25 65 C 38 65, 56 40, 48 20',
    // Curva L: 85° Flat base with sharp foxy takeoff
    L: 'M 25 65 L 46 65 L 68 24'
  };

  return (
    <div className={cn("w-14 h-14 relative flex items-center justify-center", className)}>
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
        {/* Eyelid base point */}
        <path d="M 12 65 L 25 65" stroke={baseColor} strokeWidth="3" strokeLinecap="round" />
        <circle cx="25" cy="65" r="2.5" fill={strokeColor} />

        {/* Flat reference line */}
        <path d="M 25 65 L 65 65" stroke="#E5E5EA" strokeWidth="1.5" strokeDasharray="2 2" />

        {/* Active Curvature Lash */}
        <path
          d={paths[curl]}
          stroke={strokeColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
