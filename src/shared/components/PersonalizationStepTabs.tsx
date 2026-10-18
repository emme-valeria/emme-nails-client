import React from 'react';
import { SegmentedCapsuleTabs, TabItem } from './SegmentedCapsuleTabs';

export type CustomizerSubStep = 'shape' | 'length' | 'finish' | 'color' | 'extras';

export interface PersonalizationStepTabsProps {
  activeSubStep: CustomizerSubStep;
  onChange: (subStep: CustomizerSubStep) => void;
  shapeLabel?: string;
  lengthLabel?: string;
  finishLabel?: string;
  colorHex?: string;
  extrasCount?: number;
  onTabClick?: (subStep: CustomizerSubStep) => void;
  className?: string;
}

export function PersonalizationStepTabs({
  activeSubStep,
  onChange,
  shapeLabel,
  lengthLabel,
  finishLabel,
  colorHex,
  extrasCount = 0,
  onTabClick,
  className,
}: PersonalizationStepTabsProps) {
  const tabs: TabItem<CustomizerSubStep>[] = [
    {
      id: 'shape',
      label: '1. Forma',
      detail: shapeLabel ? `(${shapeLabel})` : undefined,
    },
    {
      id: 'length',
      label: '2. Largo',
      detail: lengthLabel ? `(${lengthLabel})` : undefined,
    },
    {
      id: 'finish',
      label: '3. Acabado',
      detail: finishLabel ? `(${finishLabel})` : undefined,
    },
    {
      id: 'color',
      label: '4. Color',
      colorDot: colorHex,
    },
    {
      id: 'extras',
      label: '5. Extras',
      count: extrasCount > 0 ? extrasCount : undefined,
    },
  ];

  return (
    <SegmentedCapsuleTabs<CustomizerSubStep>
      items={tabs}
      value={activeSubStep}
      onChange={onChange}
      onTabClick={onTabClick}
      fullWidth
      size="sm"
      layoutId="personalization-flow-substeps"
      className={className}
    />
  );
}
