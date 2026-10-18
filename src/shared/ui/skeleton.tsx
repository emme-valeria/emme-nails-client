import React from 'react';
import { cn } from '@emme/ui/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-neutral-200/70 dark:bg-neutral-800/60',
        className
      )}
      {...props}
    />
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="p-4 rounded-3xl bg-white border border-pink-100/80 shadow-2xs space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-2xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
}
