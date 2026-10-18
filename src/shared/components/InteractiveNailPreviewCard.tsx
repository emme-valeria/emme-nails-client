import React from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { NailModelerVisualizerSVG, NailShapeType, NailLengthType, NailFinishType } from './NailModelerVisualizerSVG';
import { cn } from '@emme/ui/lib/utils';

interface InteractiveNailPreviewCardProps {
  shape?: string;
  length?: string;
  colorName?: string;
  colorHex?: string;
  finish?: string;
  artStyle?: string;
  serviceTitle?: string;
  estimatedPrice?: number;
  estimatedDuration?: number;
  className?: string;
  compact?: boolean;
  interactive?: boolean;
  onShapeChange?: (shape: NailShapeType) => void;
  onLengthChange?: (length: NailLengthType) => void;
  onColorChange?: (colorHex: string, colorName: string) => void;
  onFinishChange?: (finish: NailFinishType) => void;
}

export function InteractiveNailPreviewCard({
  shape = 'Almond',
  length = 'Medium',
  colorName = 'Pink',
  colorHex = '#F4A2B8',
  finish = 'Glossy',
  artStyle,
  serviceTitle = 'Estructura Personalizada',
  estimatedPrice,
  estimatedDuration,
  className = '',
  compact = false,
  interactive = false,
  onShapeChange,
  onLengthChange,
  onColorChange,
  onFinishChange
}: InteractiveNailPreviewCardProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <NailModelerVisualizerSVG
        shape={shape}
        length={length}
        colorHex={colorHex}
        colorName={colorName}
        finish={finish}
        compact={compact}
        interactive={interactive}
        onShapeChange={onShapeChange}
        onLengthChange={onLengthChange}
        onColorChange={onColorChange}
        onFinishChange={onFinishChange}
      />

      {(estimatedPrice || serviceTitle) && (
        <div className="px-3 py-1.5 rounded-xl bg-neutral-100/70 border border-black/[0.04] flex items-center justify-between text-[11px]">
          <span className="text-[#86868B] truncate">
            {serviceTitle} {estimatedDuration ? `· ~${estimatedDuration} min` : ''}
          </span>
          {estimatedPrice && (
            <span className="font-bold text-[#1D1D1F] shrink-0">
              Est. ${estimatedPrice} MXN
            </span>
          )}
        </div>
      )}
    </div>
  );
}

