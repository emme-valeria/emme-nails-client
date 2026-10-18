import React from 'react';
import { cn } from '@emme/ui/lib/utils';

export interface PriceTagProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'muted' | 'success';
  className?: string;
  showCurrency?: boolean;
}

export function PriceTag({
  price,
  originalPrice,
  currency = 'MXN',
  size = 'md',
  variant = 'default',
  className,
  showCurrency = true,
}: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-[14px]',
    lg: 'text-[17px]',
    xl: 'text-[22px]',
  }[size];

  const variantClasses = {
    default: 'text-[#1D1D1F]',
    primary: 'text-primary',
    muted: 'text-[#86868B]',
    success: 'text-emerald-600',
  }[variant];

  return (
    <div className={cn('inline-flex items-baseline gap-1.5 tabular-nums', className)}>
      {originalPrice !== undefined && originalPrice > price && (
        <span className="text-xs text-[#86868B] line-through font-normal">
          ${originalPrice}
        </span>
      )}
      <span className={cn('font-display font-black tracking-tight leading-none', sizeClasses, variantClasses)}>
        ${price}
      </span>
      {showCurrency && (
        <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">
          {currency}
        </span>
      )}
    </div>
  );
}
