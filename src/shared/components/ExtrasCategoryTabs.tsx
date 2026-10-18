import React from 'react';
import { RotateCcw, Gem, Leaf, Palette, Star } from 'lucide-react';
import { SegmentedCapsuleTabs, TabItem } from './SegmentedCapsuleTabs';

export type ExtrasCategoryStep = 'popular' | 'removal' | 'nail_art' | 'spa_care' | 'simulator';

export interface ExtrasCategoryTabsProps {
  activeCategory: ExtrasCategoryStep;
  onChange: (category: ExtrasCategoryStep) => void;
  hasRemovalSelected?: boolean;
  hasNailArtSelected?: boolean;
  hasSpaCareSelected?: boolean;
  hasSimulatorSelected?: boolean;
  onTabClick?: (category: ExtrasCategoryStep) => void;
  className?: string;
}

export function ExtrasCategoryTabs({
  activeCategory,
  onChange,
  hasRemovalSelected = false,
  hasNailArtSelected = false,
  hasSpaCareSelected = false,
  hasSimulatorSelected = false,
  onTabClick,
  className,
}: ExtrasCategoryTabsProps) {
  const tabs: TabItem<ExtrasCategoryStep>[] = [
    {
      id: 'popular',
      label: 'Top Extras',
      icon: Star,
    },
    {
      id: 'removal',
      label: 'Retiro',
      icon: RotateCcw,
      dotIndicator: hasRemovalSelected,
    },
    {
      id: 'nail_art',
      label: 'Nail Art',
      icon: Gem,
      dotIndicator: hasNailArtSelected,
    },
    {
      id: 'spa_care',
      label: 'Spa & Cuidado',
      icon: Leaf,
      dotIndicator: hasSpaCareSelected,
    },
    {
      id: 'simulator',
      label: 'Ajustes 3D',
      icon: Palette,
      dotIndicator: hasSimulatorSelected,
    }
  ];

  return (
    <SegmentedCapsuleTabs<ExtrasCategoryStep>
      items={tabs}
      value={activeCategory}
      onChange={onChange}
      onTabClick={onTabClick}
      fullWidth
      size="sm"
      layoutId="extras-category-tabs"
      className={className}
    />
  );
}
