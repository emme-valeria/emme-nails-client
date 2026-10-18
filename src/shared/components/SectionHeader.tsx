import React from 'react';
import { cn } from '@emme/ui/lib/utils';
import { ChevronRight } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number | string;
  badge?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  count,
  badge,
  actionText,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between px-1 py-1', className)}>
      <div className="flex items-center gap-2 min-w-0">
        <h2 className="text-[12px] font-bold text-[#86868B] uppercase tracking-[0.14em] truncate">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-[11px] font-semibold text-[#86868B] bg-black/[0.05] px-2 py-0.2 rounded-full">
            {count}
          </span>
        )}
        {badge && (
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-0.5 cursor-pointer shrink-0"
        >
          <span>{actionText}</span>
          <ChevronRight className="size-3.5" />
        </button>
      )}
    </div>
  );
}
