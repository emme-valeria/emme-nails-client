import React from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { Input } from '@emme/ui/input';
import { SegmentedCapsuleTabs } from '@/shared/components/SegmentedCapsuleTabs';

interface ServiceToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  layoutMode?: 'grid' | 'list';
  onLayoutModeChange?: (mode: 'grid' | 'list') => void;
  totalCount?: number;
}

export function ServiceToolbar({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategorySelect,
  layoutMode = 'grid',
  onLayoutModeChange,
  totalCount,
}: ServiceToolbarProps) {
  const filterCategories = ['Todas', ...categories];

  return (
    <div className="space-y-3 pb-2">
      {/* Search Input & View Toggle Bar */}
      <div className="flex items-center gap-2">
        <div className="relative group flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#86868B] group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Buscar por tratamiento o técnica..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 sm:h-11 pl-10 pr-9 bg-white/90 backdrop-blur-xs border border-black/[0.05] rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-xs transition-all text-xs sm:text-sm font-medium focus-visible:ring-primary/20 placeholder:text-[#86868B]/60 text-[#1D1D1F]"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-neutral-100 transition-all text-[#86868B] hover:text-[#1D1D1F] cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Layout Mode Toggle */}
        {onLayoutModeChange && (
          <SegmentedCapsuleTabs<'grid' | 'list'>
            size="sm"
            value={layoutMode}
            onChange={(mode) => onLayoutModeChange(mode)}
            layoutId="serviceToolbarLayoutPill"
            items={[
              { id: 'grid', label: '', icon: LayoutGrid },
              { id: 'list', label: '', icon: List },
            ]}
          />
        )}
      </div>

      {/* Category Pills Bar with SegmentedCapsuleTabs */}
      <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth py-0.5">
        <SegmentedCapsuleTabs<string>
          size="sm"
          value={selectedCategory}
          onChange={(cat) => onCategorySelect(cat)}
          layoutId="serviceCategoryPill"
          items={filterCategories.map(cat => ({
            id: cat,
            label: cat,
            count: cat === 'Todas' ? totalCount : undefined,
          }))}
        />
      </div>
    </div>
  );
}

