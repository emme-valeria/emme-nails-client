import React, { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '@emme/ui/lib/utils';

export interface TabItem<T extends string | number = string> {
  id: T;
  label: string;
  detail?: string;
  colorDot?: string;
  dotIndicator?: boolean;
  count?: number | string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  iconPosition?: 'left' | 'right';
}

export interface SegmentedCapsuleTabsProps<T extends string | number = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  itemClassName?: string;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  layoutId?: string;
  onTabClick?: (value: T) => void;
}

export function SegmentedCapsuleTabs<T extends string | number = string>({

  items,
  value,
  onChange,
  className,
  itemClassName,
  containerClassName,
  size = 'md',
  fullWidth = false,
  layoutId,
  onTabClick,
}: SegmentedCapsuleTabsProps<T>) {
  const generatedId = useId();
  const effectiveLayoutId = layoutId || `capsule-tab-indicator-${generatedId}`;

  const sizeClasses = {
    sm: {
      container: 'p-1 gap-1',
      item: 'min-h-[36px] px-3.5 py-1.5 text-xs',
      activePill: 'rounded-full',
      icon: 'size-3.5',
    },
    md: {
      container: 'p-1.5 gap-1',
      item: 'min-h-[44px] px-4 sm:px-5 py-2 text-xs sm:text-[13px]',
      activePill: 'rounded-full',
      icon: 'size-4',
    },
    lg: {
      container: 'p-1.5 gap-1.5',
      item: 'min-h-[48px] px-6 py-2.5 text-sm sm:text-[15px]',
      activePill: 'rounded-full',
      icon: 'size-4.5',
    },
  }[size];

  return (
    <div
      role="tablist"
      className={cn(
        'bg-[#F5F5F7] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.08] rounded-full flex items-center overflow-x-auto no-scrollbar shadow-xs select-none',
        sizeClasses.container,
        fullWidth ? 'w-full' : 'w-auto max-w-full',
        containerClassName,
        className
      )}
    >
      {items.map((tab) => {
        const isSelected = value === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isSelected}
            disabled={tab.disabled}
            onClick={() => {
              if (!tab.disabled) {
                onTabClick?.(tab.id);
                onChange(tab.id);
              }
            }}
            className={cn(
              'rounded-full transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-[0.97] text-center cursor-pointer whitespace-nowrap relative z-10 flex items-center justify-center gap-2 focus-visible:outline-hidden tracking-tight',
              fullWidth ? 'flex-1' : 'shrink-0',
              sizeClasses.item,
              isSelected
                ? 'font-semibold text-[#1D1D1F] dark:text-white'
                : 'font-medium text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white',
              tab.disabled && 'opacity-40 cursor-not-allowed',
              itemClassName
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={effectiveLayoutId}
                className={cn(
                  'absolute inset-0 bg-white dark:bg-[#2C2C2E] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.04] dark:border-white/10 -z-10',
                  sizeClasses.activePill
                )}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 35,
                  mass: 0.6,
                }}
              />
            )}

            {Icon && <Icon className={cn(sizeClasses.icon, 'shrink-0', isSelected ? 'stroke-[2.2]' : 'stroke-[1.8]')} />}

            <span>{tab.label}</span>

            {tab.detail && (
              <span className={cn(
                "text-[10px] font-medium capitalize truncate max-w-[80px] sm:max-w-none transition-colors",
                isSelected ? "text-primary font-bold" : "text-primary/70"
              )}>
                {tab.detail}
              </span>
            )}

            {tab.colorDot && (
              <span
                className="size-2.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                style={{ backgroundColor: tab.colorDot }}
              />
            )}

            {tab.dotIndicator && (
              <span className="size-1.5 rounded-full bg-primary shrink-0" />
            )}

            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] font-normal px-1.5 py-0.2 rounded-full transition-colors',
                  isSelected ? 'bg-primary text-white font-bold' : 'bg-primary/10 text-primary font-semibold'
                )}
              >
                {tab.count}
              </span>
            )}

            {tab.badge && (
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-primary/10 text-primary shrink-0 tracking-wide">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
