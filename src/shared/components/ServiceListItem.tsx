import React from 'react';
import { Clock, ChevronRight, Check } from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';
import { PriceTag } from './PriceTag';
import type { Service } from '@/app/AppContext';

export interface ServiceListItemProps {
  service: Service;
  isSelected?: boolean;
  isPopular?: boolean;
  onClick?: () => void;
  actionText?: string;
  showChevron?: boolean;
  className?: string;
}

export function ServiceListItem({
  service,
  isSelected = false,
  isPopular,
  onClick,
  showChevron = true,
  className,
}: ServiceListItemProps) {
  const isTop = isPopular ?? (service.price >= 45);

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-between p-4 transition-all cursor-pointer select-none group',
        isSelected ? 'bg-primary/[0.04]' : 'hover:bg-[#F9F9FB] active:bg-[#F2F2F7]',
        className
      )}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {service.category?.split(' ')[0] || 'Servicio'}
          </span>
          {isTop && (
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#845E1B] bg-[#FAF5EC] px-1.5 py-0.5 rounded-sm leading-none">
              MÁS PEDIDO
            </span>
          )}
        </div>

        <h4 className="text-[15px] font-bold text-[#1D1D1F] leading-tight truncate mb-1">
          {service.name}
        </h4>

        <div className="flex items-center gap-2 text-xs text-[#86868B]">
          <span className="flex items-center gap-1 font-medium text-[#636366]">
            <Clock className="size-3 shrink-0 text-primary" />
            {service.duration} min
          </span>
          {service.description && (
            <>
              <span className="text-black/15">•</span>
              <span className="truncate max-w-[240px] sm:max-w-md">{service.description}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <PriceTag price={service.price} size="md" />
        {isSelected ? (
          <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
            <Check className="size-3.5 stroke-[3]" />
          </div>
        ) : showChevron ? (
          <ChevronRight className="size-4 text-[#C5C5C7] group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
        ) : null}
      </div>
    </div>
  );
}
