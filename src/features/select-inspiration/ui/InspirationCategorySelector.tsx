import React from 'react';
import { Sparkles, Heart, Flame, Sun, Gem, Compass } from 'lucide-react';

export type InspirationStyle = 'Minimal' | 'Elegant' | 'Colorful' | 'Romantic' | 'Bold' | 'Seasonal';

interface InspirationCategorySelectorProps {
  selectedCategory: InspirationStyle | 'All';
  onSelectCategory: (category: InspirationStyle | 'All') => void;
}

const CATEGORIES: Array<{ id: InspirationStyle | 'All'; label: string; icon: React.ReactNode }> = [
  { id: 'All', label: 'Todos', icon: <Compass className="size-4" /> },
  { id: 'Minimal', label: 'Minimal', icon: <Sparkles className="size-4" /> },
  { id: 'Elegant', label: 'Elegant', icon: <Gem className="size-4" /> },
  { id: 'Colorful', label: 'Colorful', icon: <Sun className="size-4" /> },
  { id: 'Romantic', label: 'Romantic', icon: <Heart className="size-4" /> },
  { id: 'Bold', label: 'Bold', icon: <Flame className="size-4" /> },
  { id: 'Seasonal', label: 'Seasonal', icon: <Sparkles className="size-4" /> }
];

export function InspirationCategorySelector({
  selectedCategory,
  onSelectCategory
}: InspirationCategorySelectorProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              isSelected
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-card border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
