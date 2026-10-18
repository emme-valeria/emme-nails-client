import React from 'react';
import { cn } from '@emme/ui/lib/utils';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export type AppointmentStatusType = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in_progress';

export interface AppointmentStatusBadgeProps {
  status: AppointmentStatusType | string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function AppointmentStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: AppointmentStatusBadgeProps) {
  const config = {
    confirmed: {
      label: 'Confirmada',
      icon: CheckCircle2,
      bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-700',
      dot: 'bg-emerald-500',
    },
    pending: {
      label: 'Pendiente',
      icon: Clock,
      bg: 'bg-amber-50 border-amber-200/60 text-amber-700',
      dot: 'bg-amber-500',
    },
    completed: {
      label: 'Completada',
      icon: CheckCircle2,
      bg: 'bg-blue-50 border-blue-200/60 text-blue-700',
      dot: 'bg-blue-500',
    },
    cancelled: {
      label: 'Cancelada',
      icon: XCircle,
      bg: 'bg-rose-50 border-rose-200/60 text-rose-700',
      dot: 'bg-rose-500',
    },
    in_progress: {
      label: 'En Proceso',
      icon: AlertCircle,
      bg: 'bg-purple-50 border-purple-200/60 text-purple-700',
      dot: 'bg-purple-500',
    },
  }[status] || {
    label: status,
    icon: Clock,
    bg: 'bg-neutral-100 border-neutral-200 text-neutral-700',
    dot: 'bg-neutral-400',
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]',
        config.bg,
        className
      )}
    >
      {showIcon ? (
        <Icon className={size === 'sm' ? 'size-2.5' : 'size-3'} />
      ) : (
        <span className={cn('rounded-full shrink-0', size === 'sm' ? 'size-1.5' : 'size-2', config.dot)} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
