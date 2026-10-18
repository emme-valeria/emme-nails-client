import React, { useState } from 'react';
import { Sparkles, Eye, Check, Sun, Moon, Gem, Sliders, Palette, Zap, Flame, RotateCcw } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { triggerHaptic, triggerSelectionVibration } from '@/shared/utils/haptics';

export type NailShapeType = 'almond' | 'square' | 'oval' | 'coffin' | 'stiletto' | 'squoval';
export type NailLengthType = 'short' | 'medium' | 'long' | 'xl';
export type NailFinishType = 'glossy' | 'matte' | 'glazed' | 'cat_eye' | 'french';
export type SkinToneType = 'porcelain' | 'fair' | 'honey' | 'bronze' | 'espresso';
export type AccentNailType = 'none' | 'french' | 'gem' | 'foil' | 'cat_eye';

export interface SkinToneConfig {
  id: SkinToneType;
  name: string;
  baseHex: string;
  shadowHex: string;
  highlightHex: string;
  knuckleHex: string;
  cuticleHex: string;
  padHex: string;
}

export const SKIN_TONES: SkinToneConfig[] = [
  { id: 'porcelain', name: 'Porcelain Rosé', baseHex: '#FCECE6', shadowHex: '#E5CCBF', highlightHex: '#FFF8F5', knuckleHex: '#E2BFB0', cuticleHex: '#DCB5A5', padHex: '#FAD8CC' },
  { id: 'fair', name: 'Fair Sand', baseHex: '#F2D7C5', shadowHex: '#D4B09B', highlightHex: '#FDEDE2', knuckleHex: '#CCA38C', cuticleHex: '#C59A83', padHex: '#ECC0A8' },
  { id: 'honey', name: 'Warm Honey', baseHex: '#DDA47B', shadowHex: '#B87E54', highlightHex: '#EFC19E', knuckleHex: '#A97048', cuticleHex: '#9F663F', padHex: '#D49265' },
  { id: 'bronze', name: 'Caramel Bronze', baseHex: '#B87B50', shadowHex: '#8C552F', highlightHex: '#D19A71', knuckleHex: '#7C4825', cuticleHex: '#733F1D', padHex: '#AA6D42' },
  { id: 'espresso', name: 'Deep Espresso', baseHex: '#693F2D', shadowHex: '#452619', highlightHex: '#855A44', knuckleHex: '#3D2014', cuticleHex: '#361A0F', padHex: '#5A3222' },
];

export interface NailColorOption {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string;
  tipHex?: string;
  description?: string;
}

// Curated palettes dynamically based on chosen finish (Sorted by preference in Mexican salons)
export const FINISH_COLOR_PALETTES: Record<NailFinishType, NailColorOption[]> = {
  glossy: [
    { id: 'rose_nude', name: 'Nude Rosé Ballet', hex: '#F3C5BA', description: 'El nude universal más pedido en México' },
    { id: 'crimson_red', name: 'Rojo Carmesí Clásico', hex: '#B81D24', description: 'Rojo vibrante atemporal de salón' },
    { id: 'milky_white', name: 'Milky Coconut', hex: '#FAF5EF', description: 'Blanco lechoso translúcido en tendencia' },
    { id: 'baby_pink', name: 'Bubble Pink Glam', hex: '#F7A7C2', description: 'Rosa dulce con brillo espejo cristalino' },
    { id: 'mocha_latte', name: 'Mocha Latte Espresso', hex: '#6F4E37', description: 'Café moca cremoso otoñal' },
    { id: 'warm_terracotta', name: 'Terracotta Warm', hex: '#E07A5F', description: 'Tono arcilla cálido contemporáneo' },
    { id: 'obsidian_dark', name: 'Obsidian Noir', hex: '#1C191B', description: 'Negro puro acabado espejo ultra chic' },
    { id: 'matcha_soft', name: 'Matcha Milk Soft', hex: '#BDD2B6', description: 'Verde pastel matcha latte' }
  ],
  glazed: [
    { id: 'glazed_milky', name: 'Milky Glazed (Hailey)', hex: '#FCF8F5', secondaryHex: '#F3E9E2', description: 'Top 1 en México: blanco aperlado nacarado' },
    { id: 'glazed_strawberry', name: 'Strawberry Glaze', hex: '#F9D4E2', secondaryHex: '#FDE4ED', description: 'Rosa translúcido con brillo perla' },
    { id: 'glazed_vanilla', name: 'Vanilla Chrome Glow', hex: '#F7EFE4', secondaryHex: '#FFF2E6', description: 'Tono mantequilla suave cromado' },
    { id: 'glazed_peach', name: 'Peach Sunset Glaze', hex: '#F9DFCB', secondaryHex: '#FDE9DC', description: 'Durazno cálido aperlado' },
    { id: 'glazed_bronze', name: 'Bronze Velvet Glaze', hex: '#D6A476', secondaryHex: '#E8CEB4', description: 'Destello bronce miel luminoso' },
    { id: 'glazed_lavender', name: 'Lavender Iridescent', hex: '#EAE0F5', secondaryHex: '#F4EEFA', description: 'Reflejos violeta cromo' }
  ],
  french: [
    { id: 'french_classic', name: 'French Clásico Nieve', hex: '#F3C5BA', tipHex: '#FFFFFF', description: 'Base nude rosé con punta blanca pura' },
    { id: 'french_babypink', name: 'French Bubble Sweet', hex: '#F7A7C2', tipHex: '#FFFFFF', description: 'Base rosa pastel con francés nítido' },
    { id: 'french_gold', name: 'Micro French Oro Real', hex: '#EFC7B4', tipHex: '#D4AF37', description: 'Línea francesa metálica dorada de lujo' },
    { id: 'french_crimson', name: 'French Cherry Red', hex: '#F3C5BA', tipHex: '#B81D24', description: 'Punta carmesí intensa sobre nude' },
    { id: 'french_black', name: 'French Obsidian Noir', hex: '#EFC7B4', tipHex: '#1D1D1F', description: 'Contorno micro minimalista negro' },
    { id: 'french_lilac', name: 'French Pastel Lilac', hex: '#ECE0DA', tipHex: '#CDB4DB', description: 'Base beige con tip lavanda suave' }
  ],
  cat_eye: [
    { id: 'cat_rosequartz', name: 'Rose Quartz 9D', hex: '#DC6C50', secondaryHex: '#F6B47C', description: 'Destellos cuarzo rosa aterciopelado top' },
    { id: 'cat_silver', name: 'Silver Galaxy Beam', hex: '#9EABB7', secondaryHex: '#EBF0F5', description: 'Plata espacial magnético de alto brillo' },
    { id: 'cat_orchid', name: 'Velvet Orchid Cat-Eye', hex: '#8B48DA', secondaryHex: '#D6B0F0', description: 'Ojo de gato púrpura magnético' },
    { id: 'cat_champagne', name: 'Champagne Sparkle', hex: '#E5BC58', secondaryHex: '#FFF5BD', description: 'Dorado sutil con brillo móvil' },
    { id: 'cat_emerald', name: 'Emerald Spark Cat-Eye', hex: '#1E8276', secondaryHex: '#A3E0DC', description: 'Verde esmeralda con haz luminoso' },
    { id: 'cat_obsidian', name: 'Midnight Obsidian', hex: '#1F2133', secondaryHex: '#8592A8', description: 'Negro cósmico con línea de luz' }
  ],
  matte: [
    { id: 'rose_nude_matte', name: 'Nude Rosé Mate', hex: '#F3C5BA', description: 'Textura suave de seda nude #1' },
    { id: 'crimson_matte', name: 'Carmesí Terciopelo', hex: '#B81D24', description: 'Rojo mate profundo aterciopelado' },
    { id: 'baby_pink_matte', name: 'Baby Pink Piel', hex: '#F7A7C2', description: 'Rosa empolvado tacto seda' },
    { id: 'mocha_matte', name: 'Cacao Mate', hex: '#6F4E37', description: 'Café chocolate sin reflejos' },
    { id: 'obsidian_matte', name: 'Obsidian Carbon Mate', hex: '#1C191B', description: 'Negro mate efecto pizarra fina' },
    { id: 'matcha_matte', name: 'Matcha Sage Mate', hex: '#BDD2B6', description: 'Verde salvia mate sobrio' }
  ]
};

// SVG Path builder with natural sculpted curves and anatomical salon apex
export function getNailSvgPath(sh: string, len: string, width = 36) {
  const normShape = (sh || 'almond').toLowerCase();
  const normLen = (len || 'medium').toLowerCase();

  let topY = 12; // short (~14mm)
  if (normLen.includes('med') || normLen === 'medium') topY = 7; // medium (~18mm)
  else if (normLen.includes('long') || normLen === 'larga') topY = 3; // long (~22mm)
  else if (normLen.includes('xl')) topY = 0; // xl (~28mm)

  const midX = width / 2;
  const leftX = 5.2;
  const rightX = width - 5.2;
  const baseY = 46;

  // 1. ALMOND: Gracefully tapered organic curve with smooth rounded dome tip (natural salon almond)
  if (normShape.includes('almond') || normShape === 'almendra') {
    return `M ${leftX} ${baseY} 
      C ${leftX} ${baseY - 14}, ${midX - 6} ${topY + 6}, ${midX - 3.5} ${topY + 1.2} 
      C ${midX - 1.8} ${topY - 0.4}, ${midX + 1.8} ${topY - 0.4}, ${midX + 3.5} ${topY + 1.2} 
      C ${midX + 6} ${topY + 6}, ${rightX} ${baseY - 14}, ${rightX} ${baseY} 
      C ${rightX - 3} ${baseY + 3.5}, ${leftX + 3} ${baseY + 3.5}, ${leftX} ${baseY} Z`;
  }

  // 2. COFFIN / BALLERINA: Sculpted tapered sidewalls with crisp flat horizontal top and micro-beveled corners
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
  if (normShape.includes('square') || normShape === 'cuadrada') {
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

  // 5. STILETTO: Razor sharp aerodynamic sculpted apex with continuous curved silhouette
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

// Single Nail Mini SVG Preview with hyper-realistic 3D lighting, apex highlight and optical finishes
export function SingleNailMiniPreviewSVG({
  shape = 'almond',
  length = 'medium',
  colorHex = '#F7A7C2',
  finish = 'glossy',
  tipHex = '#FFFFFF',
  beamAngle = 45,
  accent = 'none',
  className = "w-9 h-14"
}: {
  shape?: string;
  length?: string;
  colorHex?: string;
  finish?: string;
  tipHex?: string;
  beamAngle?: number;
  accent?: AccentNailType;
  className?: string;
}) {
  const isMatte = finish === 'matte';
  const isGlazed = finish === 'glazed';
  const isCatEye = finish === 'cat_eye' || accent === 'cat_eye';
  const isFrench = finish === 'french' || accent === 'french';
  const isGem = accent === 'gem';
  const isFoil = accent === 'foil';

  const cleanHex = colorHex.replace('#', '');
  const idPrefix = `nail-${cleanHex}-${shape}-${length}-${Math.floor(beamAngle)}`;

  return (
    <svg viewBox="0 0 36 54" className={cn("overflow-visible transition-all duration-300 drop-shadow-xs", className)}>
      <defs>
        {/* Volumetric Base Body Gradient (Realistic Apex Depth) */}
        <linearGradient id={`${idPrefix}-body-vol`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorHex} stopOpacity="1" />
          <stop offset="35%" stopColor={colorHex} stopOpacity="1" />
          <stop offset="75%" stopColor={colorHex} stopOpacity="0.94" />
          <stop offset="100%" stopColor={colorHex} stopOpacity="0.86" />
        </linearGradient>

        {/* 3D Lateral Ambient Occlusion Shadow */}
        <linearGradient id={`${idPrefix}-lateral-shadow`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="15%" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="85%" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        {/* Glossy High-Precision Curved Specular Highlight */}
        <linearGradient id={`${idPrefix}-gloss-spec`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </linearGradient>

        {/* Glazed Chrome Iridescent Pearlescent Multi-Stop Sheen */}
        <linearGradient id={`${idPrefix}-glazed-irid`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="30%" stopColor="#E9D8FD" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#FDE2E4" stopOpacity="0.75" />
          <stop offset="80%" stopColor="#FEF3C7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>

        {/* Cat-Eye 9D Velvet Halo */}
        <linearGradient id={`${idPrefix}-cateye-beam`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="58%" stopColor="#FFF1F2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </linearGradient>

        {/* Gold Leaf & Foil Metallic Pattern */}
        <pattern id={`${idPrefix}-gold-foil`} width="10" height="10" patternUnits="userSpaceOnUse">
          <polygon points="2,1 4,0 5,3 3,4" fill="#F59E0B" opacity="0.9" />
          <polygon points="6,4 9,3 8,7 5,6" fill="#FDE68A" opacity="0.95" />
          <circle cx="2" cy="7" r="1.1" fill="#D97706" opacity="0.8" />
          <polygon points="7,8 9,9 8,10" fill="#FBBF24" opacity="0.85" />
        </pattern>

        {/* Soft Drop Shadow Filter for Sculpted Acrylic Rim */}
        <filter id={`${idPrefix}-nail-depth`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#000000" floodOpacity="0.18" />
        </filter>

        {/* Clip Path for Nail Body to contain all internal layers */}
        <clipPath id={`${idPrefix}-clip`}>
          <path d={getNailSvgPath(shape, length, 36)} />
        </clipPath>
      </defs>

      {/* Main Sculpted Nail Body */}
      <g filter={`url(#${idPrefix}-nail-depth)`}>
        <path
          d={getNailSvgPath(shape, length, 36)}
          fill={`url(#${idPrefix}-body-vol)`}
          stroke="#1D1D1F"
          strokeWidth="0.65"
          strokeOpacity="0.35"
        />
      </g>

      {/* Content clipped inside the nail boundary */}
      <g clipPath={`url(#${idPrefix}-clip)`}>
        {/* 1. Lateral Curvature / C-Curve 3D Shadow */}
        <path
          d={getNailSvgPath(shape, length, 36)}
          fill={`url(#${idPrefix}-lateral-shadow)`}
        />

        {/* 2. Natural Lunula (Half Moon at Cuticle Base) */}
        <path
          d="M 10 46 C 10 40, 26 40, 26 46 Z"
          fill="#FFFFFF"
          opacity="0.14"
        />

        {/* 3. Optical Finish Specific Treatments */}

        {/* GLOSSY: Apex Specular Tube Reflection + Pinpoint Glint */}
        {!isMatte && !isGlazed && !isCatEye && (
          <g>
            <path
              d="M 9.5 12 C 8.5 22, 9.5 35, 11 42"
              fill="none"
              stroke={`url(#${idPrefix}-gloss-spec)`}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 11 15 C 10.5 24, 11.5 32, 12.5 38"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.7"
            />
            <circle cx="11.5" cy="18" r="1.2" fill="#FFFFFF" opacity="0.9" />
          </g>
        )}

        {/* GLAZED CHROME (Hailey Bieber Satin Chrome Pearlescence) */}
        {isGlazed && (
          <g>
            <ellipse
              cx="18"
              cy="23"
              rx="12"
              ry="18"
              fill={`url(#${idPrefix}-glazed-irid)`}
              style={{ mixBlendMode: 'screen' }}
            />
            <path
              d="M 10 12 C 9 22, 10 35, 12 42"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx="12" cy="18" r="1.4" fill="#FFFFFF" opacity="0.95" />
          </g>
        )}

        {/* CAT-EYE 9D (Deep Velvet & Luminous Oriented Magnetic Beam) */}
        {isCatEye && (
          <g transform={`rotate(${beamAngle - 45}, 18, 26)`}>
            <line
              x1="2"
              y1="44"
              x2="34"
              y2="8"
              stroke={`url(#${idPrefix}-cateye-beam)`}
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.65"
            />
            <line
              x1="4"
              y1="42"
              x2="32"
              y2="10"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.95"
            />
            <circle cx="18" cy="26" r="1.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        )}

        {/* FRENCH TIP: Classic or Micro with precise curved smile line */}
        {isFrench && (
          <g>
            <path
              d="M 2 17 C 12 21.5, 24 21.5, 34 17 L 36 -5 L 0 -5 Z"
              fill={tipHex}
              opacity="0.98"
            />
            <path
              d="M 2 17 C 12 21.5, 24 21.5, 34 17"
              fill="none"
              stroke="#000000"
              strokeWidth="0.6"
              opacity="0.18"
            />
            <path
              d="M 8 7 C 13 5, 23 5, 28 7"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.75"
            />
          </g>
        )}

        {/* GOLD FOIL / FLAKES ACCENT */}
        {isFoil && (
          <g>
            <rect x="5" y="8" width="26" height="34" fill={`url(#${idPrefix}-gold-foil)`} />
            <circle cx="16" cy="24" r="1.5" fill="#FDE68A" opacity="0.9" />
            <circle cx="22" cy="18" r="1.2" fill="#FBBF24" opacity="0.9" />
          </g>
        )}

        {/* MATTE VELVET FINISH */}
        {isMatte && (
          <rect
            x="0"
            y="0"
            width="36"
            height="54"
            fill="#FFFFFF"
            opacity="0.08"
            style={{ mixBlendMode: 'soft-light' }}
          />
        )}
      </g>

      {/* 4. Overlaid 3D Swarovski Crystals & Charms */}
      {isGem && (
        <g transform="translate(18, 38)" className="filter drop-shadow-sm">
          <circle cx="0" cy="0" r="3.6" fill="#D97706" />
          <polygon points="0,-3.2 2.8,-1.2 2.8,1.2 0,3.2 -2.8,1.2 -2.8,-1.2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.4" />
          <polygon points="0,-1.6 1.4,-0.6 1.4,0.6 0,1.6 -1.4,0.6 -1.4,-0.6" fill="#FFFFFF" />
          <circle cx="-0.6" cy="-0.6" r="0.7" fill="#38BDF8" opacity="0.9" />
          <circle cx="-3.4" cy="1.8" r="1.1" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.3" />
          <circle cx="3.4" cy="1.8" r="1.1" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.3" />
        </g>
      )}

      {/* Cuticle Eponychium Seal Contour (Natural Anatomy) */}
      <path
        d="M 5.8 45.5 C 11.5 48.2, 24.5 48.2, 30.2 45.5"
        fill="none"
        stroke="#000000"
        strokeWidth="0.8"
        opacity="0.2"
      />
    </svg>
  );
}

/**
 * Realistic Anatomical SVG Fingertip Frame
 * Elegantly proportioned salon model finger silhouette that provides a clean, smooth, 
 * aesthetic background to highlight the sculpted nail.
 */
export function RealisticFingerFrame({
  skin,
  fingerType = 'middle',
  className,
  children
}: {
  skin: SkinToneConfig;
  fingerType?: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
  className?: string;
  children: React.ReactNode;
}) {
  const isThumb = fingerType === 'thumb';
  const isPinky = fingerType === 'pinky';

  return (
    <div className={cn("relative flex flex-col items-center select-none group shrink-0", className)}>
      {/* Background Smooth Anatomical Skin Silhouette */}
      <svg
        viewBox="0 0 42 56"
        className="w-full h-full absolute inset-0 pointer-events-none drop-shadow-2xs"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Volumetric Subsurface Skin Gradient with Smooth Center Highlight */}
          <linearGradient id={`skin-vol-${skin.id}-${fingerType}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={skin.shadowHex} stopOpacity="0.9" />
            <stop offset="15%" stopColor={skin.baseHex} />
            <stop offset="50%" stopColor={skin.highlightHex} stopOpacity="0.95" />
            <stop offset="85%" stopColor={skin.baseHex} />
            <stop offset="100%" stopColor={skin.shadowHex} stopOpacity="0.9" />
          </linearGradient>

          {/* Smooth Fingertip Ambient Light Glow */}
          <radialGradient id={`tip-glow-${skin.id}`} cx="50%" cy="15%" r="45%">
            <stop offset="0%" stopColor={skin.highlightHex} stopOpacity="0.6" />
            <stop offset="100%" stopColor={skin.baseHex} stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Clean, Continuous Anatomical Finger Silhouette */}
        <path
          d={
            isThumb
              ? "M 4 56 C 4 34, 4 16, 9.5 7.5 C 14 1.2, 28 1.2, 32.5 7.5 C 38 16, 38 34, 38 56 Z"
              : isPinky
              ? "M 6 56 C 6 36, 6.5 18, 10.5 8 C 14.5 2, 27.5 2, 31.5 8 C 35.5 18, 36 36, 36 56 Z"
              : "M 5 56 C 5 34, 5.5 17, 9.5 7 C 14 1, 28 1, 32.5 7 C 36.5 17, 37 34, 37 56 Z"
          }
          fill={`url(#skin-vol-${skin.id}-${fingerType})`}
          stroke={skin.shadowHex}
          strokeWidth="0.65"
          strokeOpacity="0.4"
        />

        {/* Fingertip Highlight Halo */}
        <path
          d={
            isThumb
              ? "M 4 56 C 4 34, 4 16, 9.5 7.5 C 14 1.2, 28 1.2, 32.5 7.5 C 38 16, 38 34, 38 56 Z"
              : isPinky
              ? "M 6 56 C 6 36, 6.5 18, 10.5 8 C 14.5 2, 27.5 2, 31.5 8 C 35.5 18, 36 36, 36 56 Z"
              : "M 5 56 C 5 34, 5.5 17, 9.5 7 C 14 1, 28 1, 32.5 7 C 36.5 17, 37 34, 37 56 Z"
          }
          fill={`url(#tip-glow-${skin.id})`}
        />

        {/* Subtle Distal Knuckle Micro-Creases */}
        <g opacity="0.3" transform="translate(0, 48)">
          <path
            d="M 13 0 C 17 -1, 25 -1, 29 0"
            fill="none"
            stroke={skin.knuckleHex}
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        </g>

        {/* Delicate Cuticle Eponychium Base Rim (Anchoring the Nail Bed) */}
        <path
          d="M 7.5 42.5 C 13.5 45.5, 28.5 45.5, 34.5 42.5"
          fill="none"
          stroke={skin.cuticleHex}
          strokeWidth="1"
          opacity="0.35"
        />
      </svg>

      {/* Embedded Nail Node perfectly seated over the distal nail bed */}
      <div className="relative z-10 w-full flex items-center justify-center -translate-y-0.5">
        {children}
      </div>
    </div>
  );
}

export interface NailModelerVisualizerProps {
  shape?: NailShapeType | string;
  length?: NailLengthType | string;
  colorHex?: string;
  colorName?: string;
  finish?: NailFinishType | string;
  tipHex?: string;
  skinTone?: SkinToneType;
  accentNail?: AccentNailType;
  beamAngle?: number;
  lightingMode?: 'studio' | 'sun' | 'flash';
  className?: string;
  compact?: boolean;
  interactive?: boolean;
  onShapeChange?: (shape: NailShapeType) => void;
  onLengthChange?: (length: NailLengthType) => void;
  onColorChange?: (colorHex: string, colorName: string) => void;
  onFinishChange?: (finish: NailFinishType) => void;
}

export function NailModelerVisualizerSVG({
  shape = 'almond',
  length = 'medium',
  colorHex = '#F7A7C2',
  colorName = 'Bubble Pink',
  finish = 'glossy',
  tipHex = '#FFFFFF',
  skinTone = 'fair',
  accentNail = 'none',
  beamAngle = 45,
  lightingMode = 'studio',
  className,
  compact = false
}: NailModelerVisualizerProps) {
  const [viewMode, setViewMode] = useState<'hand' | 'macro'>('macro');

  const activeShape = (shape.toLowerCase() as NailShapeType) || 'almond';
  const activeLength = (length.toLowerCase() as NailLengthType) || 'medium';
  const activeColor = colorHex || '#F7A7C2';
  const activeFinish = (finish.toLowerCase() as NailFinishType) || 'glossy';

  const currentSkin = SKIN_TONES.find(s => s.id === skinTone) || SKIN_TONES[1];

  const lengthMmMap: Record<string, string> = {
    short: '14 mm',
    medium: '18 mm',
    long: '22 mm',
    xl: '28 mm'
  };

  const handleSwitchView = (mode: 'hand' | 'macro') => {
    triggerSelectionVibration();
    setViewMode(mode);
  };

  return (
    <div className={cn(
      "rounded-2xl bg-white border border-black/[0.06] shadow-2xs overflow-hidden transition-all",
      className
    )}>
      {/* Header bar */}
      <div className="px-3.5 py-2 bg-[#FBFBFD] border-b border-black/[0.04] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="size-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-3 stroke-[2.5]" />
          </span>
          <span className="text-xs font-bold text-[#1D1D1F] truncate">
            Simulador SVG Hi-Res Realista
          </span>
          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-primary text-white">
            Interactúa
          </span>
        </div>

        {/* View Switcher: Hand (5) / Macro (1) */}
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => handleSwitchView('hand')}
            className={cn(
              "px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer",
              viewMode === 'hand' 
                ? "bg-white text-[#1D1D1F] shadow-2xs" 
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
          >
            Mano Completa
          </button>
          <button
            type="button"
            onClick={() => handleSwitchView('macro')}
            className={cn(
              "px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer",
              viewMode === 'macro' 
                ? "bg-white text-[#1D1D1F] shadow-2xs" 
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
          >
            Macro Zoom
          </button>
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <div 
        className={cn(
          "p-3.5 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300 min-h-[142px]",
          lightingMode === 'studio' ? "bg-radial from-neutral-50 via-neutral-100/60 to-neutral-200/40" :
          lightingMode === 'sun' ? "bg-radial from-amber-50/80 via-orange-50/40 to-neutral-100/40" :
          "bg-radial from-neutral-900 via-neutral-950 to-black text-white"
        )}
      >
        {/* Soft Ambient Color Glow */}
        <div 
          className="absolute size-44 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-300"
          style={{ backgroundColor: activeColor }}
        />

        {viewMode === 'hand' ? (
          /* Realistic 5-Fingertip Hand Model with Reduced Length & Balanced Salon Geometry */
          <div className="flex items-end justify-center gap-2 sm:gap-2.5 relative z-10 py-1">
            
            {/* Thumb */}
            <div className="flex flex-col items-center gap-1 -rotate-12 translate-y-2.5">
              <RealisticFingerFrame skin={currentSkin} fingerType="thumb" className="w-8 h-12.5">
                <SingleNailMiniPreviewSVG 
                  shape={activeShape} 
                  length={activeLength} 
                  colorHex={activeColor} 
                  finish={activeFinish} 
                  tipHex={tipHex}
                  beamAngle={beamAngle}
                  className="w-6 h-9.5" 
                />
              </RealisticFingerFrame>
              <span className={cn("text-[8px] font-bold", lightingMode === 'flash' ? "text-neutral-400" : "text-[#86868B]")}>Pulgar</span>
            </div>

            {/* Index */}
            <div className="flex flex-col items-center gap-1 -rotate-4 translate-y-0.5">
              <RealisticFingerFrame skin={currentSkin} fingerType="index" className="w-8.5 h-13.5">
                <SingleNailMiniPreviewSVG 
                  shape={activeShape} 
                  length={activeLength} 
                  colorHex={activeColor} 
                  finish={activeFinish} 
                  tipHex={tipHex}
                  beamAngle={beamAngle}
                  className="w-6.5 h-10.5" 
                />
              </RealisticFingerFrame>
              <span className={cn("text-[8px] font-bold", lightingMode === 'flash' ? "text-neutral-400" : "text-[#86868B]")}>Índice</span>
            </div>

            {/* Middle (Hero Center) */}
            <div className="flex flex-col items-center gap-1 scale-105 -translate-y-1">
              <RealisticFingerFrame skin={currentSkin} fingerType="middle" className="w-9 h-14.5">
                <SingleNailMiniPreviewSVG 
                  shape={activeShape} 
                  length={activeLength} 
                  colorHex={activeColor} 
                  finish={activeFinish} 
                  tipHex={tipHex}
                  beamAngle={beamAngle}
                  className="w-7.5 h-11.5" 
                />
              </RealisticFingerFrame>
              <span className="text-[8px] font-extrabold text-primary">Medio</span>
            </div>

            {/* Ring (Supports Accent Nail) */}
            <div className="flex flex-col items-center gap-1 rotate-4 translate-y-0.5">
              <RealisticFingerFrame 
                skin={currentSkin} 
                fingerType="ring" 
                className={cn("w-8.5 h-13.5 transition-all", accentNail !== 'none' && "drop-shadow-xs ring-1 ring-primary/40 rounded-xl")}
              >
                <SingleNailMiniPreviewSVG 
                  shape={activeShape} 
                  length={activeLength} 
                  colorHex={activeColor} 
                  finish={activeFinish} 
                  tipHex={tipHex}
                  beamAngle={beamAngle}
                  accent={accentNail}
                  className="w-6.5 h-10.5" 
                />
              </RealisticFingerFrame>
              <span className={cn("text-[8px] font-bold", accentNail !== 'none' ? "text-primary font-black" : lightingMode === 'flash' ? "text-neutral-400" : "text-[#86868B]")}>
                {accentNail !== 'none' ? 'Anular ✨' : 'Anular'}
              </span>
            </div>

            {/* Little / Pinky */}
            <div className="flex flex-col items-center gap-1 rotate-12 translate-y-2.5">
              <RealisticFingerFrame skin={currentSkin} fingerType="pinky" className="w-7.5 h-11.5">
                <SingleNailMiniPreviewSVG 
                  shape={activeShape} 
                  length={activeLength} 
                  colorHex={activeColor} 
                  finish={activeFinish} 
                  tipHex={tipHex}
                  beamAngle={beamAngle}
                  className="w-5 h-9" 
                />
              </RealisticFingerFrame>
              <span className={cn("text-[8px] font-bold", lightingMode === 'flash' ? "text-neutral-400" : "text-[#86868B]")}>Meñique</span>
            </div>
          </div>
        ) : (
          /* Macro Single Nail Zoom with Millimeter Spec Gauge (Calibrated to match Mano Completa height and width) */
          <div className="flex items-center justify-center gap-4 sm:gap-6 relative z-10 py-1.5 min-h-[76px]">
            {/* Millimeter Gauge lines */}
            <div className="flex flex-col justify-between h-14 text-[8px] font-mono text-[#86868B] border-r border-dashed border-black/20 pr-2">
              <span>0mm (Punta)</span>
              <span>10mm (Apex)</span>
              <span>{lengthMmMap[activeLength] || '18mm'}</span>
            </div>

            <RealisticFingerFrame skin={currentSkin} fingerType="middle" className="w-11 h-15.5 scale-105">
              <SingleNailMiniPreviewSVG 
                shape={activeShape} 
                length={activeLength} 
                colorHex={activeColor} 
                finish={activeFinish} 
                tipHex={tipHex} 
                beamAngle={beamAngle}
                accent={accentNail}
                className="w-9 h-13 drop-shadow-sm" 
              />
            </RealisticFingerFrame>

            {/* Spec tags */}
            <div className="space-y-1 text-left min-w-[125px]">
              <div className="text-xs font-black capitalize text-[#1D1D1F] flex items-center justify-between">
                <span>{activeShape}</span>
                <span className="text-[8.5px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded-md capitalize">
                  {activeLength}
                </span>
              </div>
              <div className="text-[10px] text-[#86868B] capitalize flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: activeColor }} />
                <span className="truncate max-w-[105px] font-bold text-[#1D1D1F]">{colorName}</span>
              </div>
              <div className="text-[10px] font-semibold text-primary capitalize flex items-center justify-between">
                <span>{activeFinish}</span>
                <span className="text-[8.5px] text-[#86868B] font-mono">{lengthMmMap[activeLength] || '18mm'}</span>
              </div>
              {accentNail !== 'none' && (
                <div className="text-[9px] font-bold text-amber-600">
                  Acento: {accentNail.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Footnote Tag */}
      <div className="px-3.5 py-1.5 bg-[#FBFBFD] border-t border-black/[0.04] flex items-center justify-between text-[10px]">
        <span className="text-[#86868B] capitalize truncate">
          {activeShape} · {activeLength} · {activeFinish}
        </span>
        <span className="font-bold text-[#1D1D1F] flex items-center gap-1 shrink-0">
          <span className="size-2 rounded-full" style={{ backgroundColor: activeColor }} />
          {colorName}
        </span>
      </div>
    </div>
  );
}
