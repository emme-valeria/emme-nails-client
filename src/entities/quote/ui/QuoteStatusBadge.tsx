import React from 'react';
import { QuoteStatus, QUOTE_STATUS_LABELS } from '@/domain/quotes/value-objects/QuoteStatus';

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
  className?: string;
}

export function QuoteStatusBadge({ status, className = '' }: QuoteStatusBadgeProps) {
  const meta = QUOTE_STATUS_LABELS[status] || {
    label: status,
    color: 'text-gray-700',
    bg: 'bg-gray-100',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${meta.bg} ${meta.color} ${className}`}
    >
      {meta.label}
    </span>
  );
}
