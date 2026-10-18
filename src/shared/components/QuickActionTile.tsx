import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export interface QuickActionItemProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColorClassName?: string;
  iconBgClassName?: string;
  title: string;
  description?: string;
  badge?: string;
  onClick: () => void;
  className?: string;
}

export function QuickActionTile({
  icon: Icon,
  iconColorClassName = 'text-primary',
  iconBgClassName = 'bg-primary/10 group-hover:bg-primary group-hover:text-white',
  title,
  description,
  badge,
  onClick,
  className,
}: QuickActionItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-[#F9F9FB] active:bg-[#F2F2F7] transition-colors group cursor-pointer text-left',
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div
          className={cn(
            'size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            iconBgClassName,
            iconColorClassName
          )}
        >
          <Icon className="size-4 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-[#1D1D1F] block leading-tight truncate">
              {title}
            </span>
            {badge && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.2 rounded-sm">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <span className="text-[11px] text-[#86868B] block truncate mt-0.5">
              {description}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="size-4 text-[#C5C5C7] group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}

export interface QuickActionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function QuickActionCard({ children, className }: QuickActionCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-black/[0.05]',
        className
      )}
    >
      {children}
    </div>
  );
}
