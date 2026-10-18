import React, { useState } from 'react';
import { cn } from '@emme/ui/lib/utils';
import { HandId, FingerId, SingleNailSemantic, LengthCategory, NailShapeCategory } from '@/domain/quotes/entities/NailArtSemanticTypes';
import { SingleNailMiniPreviewSVG } from './NailModelerVisualizerSVG';
import { triggerSelectionVibration } from '@/shared/utils/haptics';
import { SegmentedCapsuleTabs } from '@/shared/components/SegmentedCapsuleTabs';

export interface HandNailVisualizerSVGProps {
  nails?: SingleNailSemantic[];
  selectedHand?: HandId;
  onSelectHand?: (hand: HandId) => void;
  selectedFinger?: FingerId | null;
  onSelectFinger?: (finger: FingerId) => void;
  defaultShape?: NailShapeCategory;
  defaultLength?: LengthCategory;
  defaultColorHex?: string;
  defaultFinish?: string;
  accentFingerId?: FingerId;
  className?: string;
  interactive?: boolean;
}

const FINGER_ORDER: { id: FingerId; label: string; short: string; heightFactor: number }[] = [
  { id: 'thumb', label: 'Pulgar', short: 'P', heightFactor: 0.85 },
  { id: 'index', label: 'Índice', short: 'I', heightFactor: 0.95 },
  { id: 'middle', label: 'Medio', short: 'M', heightFactor: 1.0 },
  { id: 'ring', label: 'Anular', short: 'A', heightFactor: 0.92 },
  { id: 'pinky', label: 'Meñique', short: 'm', heightFactor: 0.78 },
];

export function HandNailVisualizerSVG({
  nails,
  selectedHand = 'left',
  onSelectHand,
  selectedFinger = null,
  onSelectFinger,
  defaultShape = 'almond',
  defaultLength = 'M',
  defaultColorHex = '#F7D2DE',
  defaultFinish = 'glazed',
  accentFingerId = 'ring',
  className = '',
  interactive = true,
}: HandNailVisualizerSVGProps) {
  const [activeHand, setActiveHand] = useState<HandId>(selectedHand);
  const [hoveredFinger, setHoveredFinger] = useState<FingerId | null>(null);

  const handleHandChange = (hand: HandId) => {
    triggerSelectionVibration();
    setActiveHand(hand);
    if (onSelectHand) onSelectHand(hand);
  };

  const getFingerData = (fingerId: FingerId) => {
    if (nails && nails.length > 0) {
      const match = nails.find((n) => n.hand === activeHand && n.finger === fingerId);
      if (match) return match;
    }
    const isAccent = fingerId === accentFingerId;
    return {
      finger: fingerId,
      hand: activeHand,
      shape: defaultShape,
      lengthCategory: defaultLength,
      baseColorHex: defaultColorHex,
      baseColorName: isAccent ? 'Acento' : 'Tono Principal',
      finishes: [defaultFinish as any],
      hasFrench: isAccent,
      hasGradient: false,
      artComplexity: isAccent ? 3 : 0,
      artDescription: isAccent ? 'Acento Decorativo / Pearl Chrome' : 'Esmaltado Sólido',
      confidence: 0.98,
    };
  };

  return (
    <div className={cn('w-full flex flex-col items-center select-none space-y-3', className)}>
      {/* Hand Switcher Tabs */}
      {interactive && (
        <SegmentedCapsuleTabs<HandId>
          size="sm"
          value={activeHand}
          onChange={(hand) => handleHandChange(hand)}
          layoutId="handNailVisualizerPill"
          items={[
            { id: 'left', label: 'Mano Izquierda (5 Uñas)' },
            { id: 'right', label: 'Mano Derecha (5 Uñas)' },
          ]}
        />
      )}

      {/* 5 Finger Spread Graphic with SVG nails */}
      <div className="w-full max-w-lg grid grid-cols-5 gap-2 sm:gap-3 py-1">
        {FINGER_ORDER.map(({ id, label, heightFactor }) => {
          const data = getFingerData(id);
          const isSelected = selectedFinger === id;
          const isHovered = hoveredFinger === id;
          const isAccent = id === accentFingerId;

          const shape = (data.shape || 'almond').toLowerCase() as any;
          const length = (data.lengthCategory === 'XS' || data.lengthCategory === 'S'
            ? 'short'
            : data.lengthCategory === 'L'
            ? 'long'
            : data.lengthCategory === 'XL' || data.lengthCategory === 'XXL'
            ? 'xl'
            : 'medium') as any;

          return (
            <button
              key={id}
              type="button"
              disabled={!interactive}
              onClick={() => {
                triggerSelectionVibration();
                if (onSelectFinger) onSelectFinger(id);
              }}
              onMouseEnter={() => setHoveredFinger(id)}
              onMouseLeave={() => setHoveredFinger(null)}
              className={cn(
                'relative flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-2xl transition-all duration-200 text-center cursor-pointer min-h-[150px]',
                isSelected
                  ? 'bg-pink-50 border-2 border-pink-500 shadow-xs ring-4 ring-pink-500/10 scale-[1.02]'
                  : isHovered
                  ? 'bg-neutral-100/90 border border-black/20 scale-[1.01]'
                  : isAccent
                  ? 'bg-neutral-50 border border-pink-300'
                  : 'bg-neutral-50 border border-black/[0.06]'
              )}
            >
              {/* Top Finger Tag */}
              <div className="w-full flex items-center justify-between gap-1 mb-1">
                <span className={cn(
                  "text-[10px] sm:text-[11px] font-extrabold truncate",
                  isSelected ? "text-pink-700" : "text-black"
                )}>
                  {label}
                </span>
                {isAccent && (
                  <span
                    className="size-2 rounded-full bg-pink-500 animate-pulse"
                    title="Uña con Acento"
                  />
                )}
              </div>

              {/* SVG Nail Modeler Preview */}
              <div
                className="py-1.5 flex items-center justify-center transition-transform duration-200"
                style={{
                  transform: `scale(${heightFactor})`,
                }}
              >
                <SingleNailMiniPreviewSVG
                  shape={shape}
                  length={length}
                  colorHex={data.baseColorHex || defaultColorHex}
                  finish={data.finishes?.[0] || defaultFinish}
                  className="w-8 h-12"
                />
              </div>

              {/* Bottom Specs Pill */}
              <div className="w-full mt-1.5 pt-1.5 border-t border-black/[0.06] space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block truncate">
                  {isAccent ? 'Acento' : 'Base'}
                </span>
                <div
                  className="size-3.5 mx-auto rounded-full border border-black/20 shadow-2xs"
                  style={{ backgroundColor: data.baseColorHex || defaultColorHex }}
                  title={data.baseColorName || 'Tono'}
                />
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-neutral-500 text-center">
        Toca cualquier uña para ver su protocolo anatómico y especificaciones de cabina.
      </p>
    </div>
  );
}
