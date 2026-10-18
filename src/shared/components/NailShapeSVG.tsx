import React, { memo } from 'react';

export type NailShapeId = 'almond' | 'coffin' | 'square' | 'oval' | 'stiletto' | 'squoval';

interface NailShapeSVGProps {
  shape: NailShapeId | string;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
  showFinger?: boolean;
  showDetails?: boolean;
  length?: string;
}

// Parametric anatomical nail path builder on a 36x54 grid
export function getRealisticNailPath(sh: string, len: string = 'medium', width = 36) {
  const normShape = (sh || 'almond').toLowerCase();
  const normLen = (len || 'medium').toLowerCase();

  let topY = 12; // short (~14mm)
  if (normLen.includes('med') || normLen === 'medium') topY = 7; // medium (~18mm)
  else if (normLen.includes('long') || normLen === 'larga' || normLen.includes('3')) topY = 3; // long (~22mm)
  else if (normLen.includes('xl') || normLen.includes('4')) topY = 0; // xl (~28mm)

  const midX = width / 2;
  const leftX = 5.2;
  const rightX = width - 5.2;
  const baseY = 46;

  // 1. ALMOND: Gracefully tapered organic curve with smooth rounded dome tip
  if (normShape.includes('almond') || normShape.includes('almendra')) {
    return `M ${leftX} ${baseY} 
      C ${leftX} ${baseY - 14}, ${midX - 6} ${topY + 6}, ${midX - 3.5} ${topY + 1.2} 
      C ${midX - 1.8} ${topY - 0.4}, ${midX + 1.8} ${topY - 0.4}, ${midX + 3.5} ${topY + 1.2} 
      C ${midX + 6} ${topY + 6}, ${rightX} ${baseY - 14}, ${rightX} ${baseY} 
      C ${rightX - 3} ${baseY + 3.5}, ${leftX + 3} ${baseY + 3.5}, ${leftX} ${baseY} Z`;
  }

  // 2. COFFIN / BALLERINA: Sculpted tapered sidewalls with crisp flat horizontal top
  if (normShape.includes('coffin') || normShape.includes('ballerina')) {
    const taper = 6.2;
    const cornerR = 1.0;
    return `M ${leftX} ${baseY} 
      C ${leftX} ${baseY - 12}, ${leftX + taper - 0.5} ${topY + 8}, ${leftX + taper} ${topY + cornerR} 
      Q ${leftX + taper} ${topY}, ${leftX + taper + cornerR} ${topY} 
      L ${rightX - taper - cornerR} ${topY} 
      Q ${rightX - taper} ${topY}, ${rightX - taper} ${topY + cornerR} 
      C ${rightX - taper + 0.5} ${topY + 8}, ${rightX} ${baseY - 12}, ${rightX} ${baseY} 
      C ${rightX - 3} ${baseY + 3.5}, ${leftX + 3} ${baseY + 3.5}, ${leftX} ${baseY} Z`;
  }

  // 3. SQUARE: Crisp salon straight sidewalls with delicate micro-beveled corners
  if (normShape.includes('square') || normShape.includes('cuadrada')) {
    const cornerR = 1.4;
    return `M ${leftX} ${baseY} 
      L ${leftX} ${topY + cornerR} 
      Q ${leftX} ${topY}, ${leftX + cornerR} ${topY} 
      L ${rightX - cornerR} ${topY} 
      Q ${rightX} ${topY}, ${rightX} ${topY + cornerR} 
      L ${rightX} ${baseY} 
      C ${rightX - 3} ${baseY + 3.5}, ${leftX + 3} ${baseY + 3.5}, ${leftX} ${baseY} Z`;
  }

  // 4. SQUOVAL: Parallel sidewalls with gentle rounded shoulders and soft flattened top
  if (normShape.includes('squoval')) {
    return `M ${leftX} ${baseY} 
      L ${leftX} ${topY + 5.5} 
      C ${leftX} ${topY + 1.2}, ${leftX + 3.2} ${topY + 0.3}, ${midX - 2.5} ${topY + 0.2} 
      L ${midX + 2.5} ${topY + 0.2} 
      C ${rightX - 3.2} ${topY + 0.3}, ${rightX} ${topY + 1.2}, ${rightX} ${topY + 5.5} 
      L ${rightX} ${baseY} 
      C ${rightX - 3} ${baseY + 3.5}, ${leftX + 3} ${baseY + 3.5}, ${leftX} ${baseY} Z`;
  }

  // 5. STILETTO: Razor sharp aerodynamic sculpted apex
  if (normShape.includes('stiletto')) {
    return `M ${leftX} ${baseY} 
      C ${leftX + 1.2} ${baseY - 16}, ${midX - 3.2} ${topY + 3.5}, ${midX - 0.6} ${topY + 0.4} 
      Q ${midX} ${topY}, ${midX + 0.6} ${topY + 0.4} 
      C ${midX + 3.2} ${topY + 3.5}, ${rightX - 1.2} ${baseY - 16}, ${rightX} ${baseY} 
      C ${rightX - 3} ${baseY + 3.5}, ${leftX + 3} ${baseY + 3.5}, ${leftX} ${baseY} Z`;
  }

  // 6. OVAL: Classic symmetrical rounded ellipse apex
  return `M ${leftX} ${baseY} 
    C ${leftX} ${baseY - 14}, ${leftX + 1.2} ${topY + 8}, ${leftX + 4.8} ${topY + 2.2} 
    C ${leftX + 8.2} ${topY - 0.5}, ${rightX - 8.2} ${topY - 0.5}, ${rightX - 4.8} ${topY + 2.2} 
    C ${rightX - 1.2} ${topY + 8}, ${rightX} ${baseY - 14}, ${rightX} ${baseY} 
    C ${rightX - 3} ${baseY + 3.5}, ${leftX + 3} ${baseY + 3.5}, ${leftX} ${baseY} Z`;
}

export const NailShapeSVG = memo(function NailShapeSVG({
  shape = 'almond',
  fillColor = '#E05286',
  strokeColor = '#1D1D1F',
  className = 'w-7 h-10',
  showFinger = false,
  length = 'medium'
}: NailShapeSVGProps) {
  const normShape = String(shape).toLowerCase();
  const nailPath = getRealisticNailPath(normShape, length, 36);

  return (
    <svg
      viewBox="0 0 36 54"
      className={`${className} overflow-visible transition-transform duration-200 will-change-transform`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Volumetric Nail Polish Gradient */}
        <linearGradient id="nail-polish-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="40%" stopColor={fillColor} />
          <stop offset="80%" stopColor={fillColor} stopOpacity="0.92" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0.82" />
        </linearGradient>

        {/* 3D Lateral Ambient Occlusion Shadow */}
        <linearGradient id="nail-lateral-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="15%" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="85%" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        {/* Glossy High-Precision Curved Specular Highlight */}
        <linearGradient id="nail-spec-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </linearGradient>

        {/* Clip Path for Nail Body */}
        <clipPath id="nail-clip-shape">
          <path d={nailPath} />
        </clipPath>
      </defs>

      {/* Sculpted Pure Nail Body */}
      <g>
        {/* Main Nail Body */}
        <path
          d={nailPath}
          fill="url(#nail-polish-grad)"
          stroke={strokeColor}
          strokeWidth="0.65"
          strokeOpacity="0.35"
        />

        {/* Clipped Inner Lighting & Highlights */}
        <g clipPath="url(#nail-clip-shape)">
          {/* C-Curve 3D Shadow */}
          <path
            d={nailPath}
            fill="url(#nail-lateral-grad)"
          />

          {/* Natural Lunula (Cuticle Half-Moon) */}
          <path
            d="M 10 46 C 10 40, 26 40, 26 46 Z"
            fill="#FFFFFF"
            opacity="0.14"
          />

          {/* Gloss Specular Light Tube */}
          <path
            d="M 9.5 12 C 8.5 22, 9.5 35, 11 42"
            fill="none"
            stroke="url(#nail-spec-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Crisp White Specular Line */}
          <path
            d="M 11 15 C 10.5 24, 11.5 32, 12.5 38"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Pinpoint Apex Sparkle */}
          <circle cx="11.5" cy="18" r="1.2" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Cuticle Eponychium Seal Contour */}
        <path
          d="M 5.8 45.5 C 11.5 48.2, 24.5 48.2, 30.2 45.5"
          fill="none"
          stroke="#000000"
          strokeWidth="0.8"
          opacity="0.2"
        />
      </g>
    </svg>
  );
});

