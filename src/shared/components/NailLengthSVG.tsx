import React from 'react';
import { getRealisticNailPath } from './NailShapeSVG';

export type NailLengthId = 'short' | 'medium' | 'long' | 'xl' | 'Short' | 'Medium' | 'Long' | 'XL' | string;

interface NailLengthSVGProps {
  length: NailLengthId;
  shape?: string;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
  showGuides?: boolean;
  compact?: boolean;
}

export function NailLengthSVG({
  length = 'short',
  shape = 'almond',
  fillColor = '#F3C5BA',
  strokeColor = '#1D1D1F',
  className = 'w-7 h-10',
  showGuides = false,
  compact = false
}: NailLengthSVGProps) {
  const norm = String(length).toLowerCase();

  let mmVal = '~2-3 mm';
  let mmShort = '+2mm';
  let topY = 12;

  if (norm.includes('med') || norm.includes('2') || norm === 'medium') {
    mmVal = '~6-8 mm';
    mmShort = '+6mm';
    topY = 7;
  } else if (norm.includes('lar') || norm.includes('long') || norm.includes('3')) {
    mmVal = '~10-12 mm';
    mmShort = '+11mm';
    topY = 3;
  } else if (norm.includes('xl') || norm.includes('extra') || norm.includes('4')) {
    mmVal = '~15+ mm';
    mmShort = '+16mm';
    topY = 0;
  }

  const safeId = `nail-len-${norm.replace(/[^a-z0-9]/g, '') || 'short'}-${fillColor.replace(/[^a-z0-9]/gi, '')}`;
  const nailPath = getRealisticNailPath(shape, norm, 36);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <svg
          viewBox="0 0 36 54"
          className="w-7 h-9.5 shrink-0 overflow-visible drop-shadow-2xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`${safeId}-compact-polish`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fillColor} />
              <stop offset="100%" stopColor={fillColor} stopOpacity="0.88" />
            </linearGradient>

            <clipPath id={`${safeId}-compact-clip`}>
              <path d={nailPath} />
            </clipPath>
          </defs>

          {/* Pure Nail Plate (Without Finger) */}
          <g>
            <path
              d={nailPath}
              fill={`url(#${safeId}-compact-polish)`}
              stroke={strokeColor}
              strokeWidth="0.6"
              strokeOpacity="0.35"
            />
            <g clipPath={`url(#${safeId}-compact-clip)`}>
              <path
                d="M 10 12 C 9 22, 10 35, 11 42"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>
          </g>
        </svg>
        <span className="text-[10px] font-black text-primary tracking-tight">{mmShort}</span>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 36 54"
      className={`${className} overflow-visible transition-all duration-300 drop-shadow-xs`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Volumetric Nail Polish Gradient */}
        <linearGradient id={`${safeId}-polish`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="35%" stopColor={fillColor} />
          <stop offset="75%" stopColor={fillColor} stopOpacity="0.94" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0.86" />
        </linearGradient>

        {/* 3D Lateral Ambient Occlusion Shadow */}
        <linearGradient id={`${safeId}-lateral`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="15%" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="85%" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        {/* Glossy High-Precision Curved Specular Highlight */}
        <linearGradient id={`${safeId}-spec`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </linearGradient>

        {/* Soft Drop Shadow Filter for Sculpted Acrylic Rim */}
        <filter id={`${safeId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="0.9" floodColor="#000000" floodOpacity="0.18" />
        </filter>

        {/* Clip Path for Nail Body */}
        <clipPath id={`${safeId}-clip`}>
          <path d={nailPath} />
        </clipPath>
      </defs>

      {/* Sculpted Pure Nail Node (without finger) */}
      <g>
        {/* Main Nail Body with 3D Drop Shadow */}
        <g filter={`url(#${safeId}-shadow)`}>
          <path
            d={nailPath}
            fill={`url(#${safeId}-polish)`}
            stroke={strokeColor}
            strokeWidth="0.65"
            strokeOpacity="0.35"
          />
        </g>

        {/* Clipped Inner Lighting & Highlights */}
        <g clipPath={`url(#${safeId}-clip)`}>
          {/* C-Curve 3D Shadow */}
          <path
            d={nailPath}
            fill={`url(#${safeId}-lateral)`}
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
            stroke={`url(#${safeId}-spec)`}
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

      {/* Measurement Guide / Millimeter Label when requested */}
      {showGuides && (
        <g opacity="0.85">
          <line x1="0" y1={topY} x2="36" y2={topY} stroke="#1D1D1F" strokeWidth="0.7" strokeDasharray="1.5,1.5" />
          <rect x="7" y={Math.max(0, topY - 6.5)} width="22" height="6" rx="3" fill="#1D1D1F" />
          <text x="18" y={Math.max(4.5, topY - 2)} textAnchor="middle" fontSize="4.2" fontWeight="900" fill="#FFFFFF">
            {mmVal}
          </text>
        </g>
      )}
    </svg>
  );
}
