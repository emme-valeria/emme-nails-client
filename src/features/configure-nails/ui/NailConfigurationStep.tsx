import React, { useState } from 'react';
import { NailLengthSelector, NailLength } from './NailLengthSelector';
import { NailShapeSelector, NailShape } from './NailShapeSelector';
import { NailColorSwatchSelector, NailColorKey } from '@/shared/components/NailColorSwatchSelector';
import { InteractiveNailPreviewCard } from '@/shared/components/InteractiveNailPreviewCard';

interface NailConfigurationStepProps {
  length: NailLength;
  shape: NailShape;
  onChangeLength: (length: NailLength) => void;
  onChangeShape: (shape: NailShape) => void;
  color?: NailColorKey;
  onChangeColor?: (color: NailColorKey) => void;
}

export function NailConfigurationStep({
  length,
  shape,
  onChangeLength,
  onChangeShape,
  color = 'Pink',
  onChangeColor
}: NailConfigurationStepProps) {
  const [selectedColorState, setSelectedColorState] = useState<NailColorKey>(color);

  const handleColorChange = (c: NailColorKey) => {
    setSelectedColorState(c);
    if (onChangeColor) onChangeColor(c);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Live Previsualization Card */}
      <InteractiveNailPreviewCard
        shape={shape}
        length={length}
        colorName={selectedColorState}
        finish="Glossy"
        serviceTitle="Estructura Personalizada"
      />

      {/* Decision Group 1: Length Guides */}
      <NailLengthSelector
        selectedLength={length}
        onSelect={onChangeLength}
      />

      <hr className="border-border/40" />

      {/* Decision Group 2: Shape Illustrations */}
      <NailShapeSelector
        selectedShape={shape}
        onSelect={onChangeShape}
      />

      <hr className="border-border/40" />

      {/* Decision Group 3: Color Swatches Grid (Nude, Pink, Red, White, Chrome, Dark, Custom) */}
      <NailColorSwatchSelector
        selectedColor={selectedColorState}
        onSelectColor={handleColorChange}
        selectedShape={shape}
      />
    </div>
  );
}
