import React from 'react';
import { motion } from 'motion/react';

interface AuthCardSkeletonProps {
  variant?: 'menu' | 'whatsapp' | 'email' | 'otp';
  className?: string;
}

export function AuthCardSkeleton({ variant = 'menu', className = '' }: AuthCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`space-y-4 select-none ${className}`}
    >
      {/* Skeleton Header Area */}
      <div className="flex flex-col items-center space-y-2 pb-1">
        {/* Title placeholder */}
        <div className="h-4.5 w-44 bg-neutral-200/70 dark:bg-neutral-800/70 rounded-full animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        {/* Subtitle placeholder */}
        <div className="h-3.5 w-56 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>

      {/* VIEW-SPECIFIC SKELETON ELEMENTS */}
      {variant === 'menu' && (
        <div className="space-y-3 pt-1">
          {/* Button 1 Skeleton (Google style) */}
          <div className="w-full h-[52px] rounded-[14px] bg-neutral-100/90 dark:bg-neutral-800/50 border border-black/[0.04] dark:border-white/[0.05] p-3 flex items-center justify-center gap-3 relative overflow-hidden">
            <div className="size-5 rounded-full bg-neutral-200/80 dark:bg-neutral-700/80 animate-pulse shrink-0" />
            <div className="h-3.5 w-36 bg-neutral-200/80 dark:bg-neutral-700/80 rounded-full animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Button 2 Skeleton (WhatsApp style) */}
          <div className="w-full h-[52px] rounded-[14px] bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/10 p-3 flex items-center justify-center gap-2.5 relative overflow-hidden">
            <div className="size-5 rounded-full bg-emerald-200/70 dark:bg-emerald-800/50 animate-pulse shrink-0" />
            <div className="h-3.5 w-40 bg-emerald-200/70 dark:bg-emerald-800/50 rounded-full animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Button 3 Skeleton (Email / Primary style) */}
          <div className="w-full h-[52px] rounded-[14px] bg-primary/10 dark:bg-primary/20 border border-primary/15 p-3 flex items-center justify-center gap-2.5 relative overflow-hidden">
            <div className="size-4.5 rounded-md bg-primary/25 animate-pulse shrink-0" />
            <div className="h-3.5 w-32 bg-primary/25 rounded-full animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      )}

      {variant === 'whatsapp' && (
        <div className="space-y-3.5 pt-1 text-left">
          {/* Input 1 (Name) */}
          <div className="space-y-1">
            <div className="h-3 w-20 bg-neutral-200/60 rounded-full ml-1 animate-pulse" />
            <div className="w-full h-11.5 rounded-[12px] bg-neutral-100/80 border border-black/[0.04] p-3 flex items-center gap-3 relative overflow-hidden">
              <div className="size-4 rounded-full bg-neutral-200 animate-pulse" />
              <div className="h-3.5 w-28 bg-neutral-200/70 rounded-full animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          {/* Input 2 (Phone) */}
          <div className="space-y-1">
            <div className="h-3 w-16 bg-neutral-200/60 rounded-full ml-1 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-11.5 w-20 rounded-[12px] bg-neutral-100/80 border border-black/[0.04] animate-pulse" />
              <div className="flex-1 h-11.5 rounded-[12px] bg-neutral-100/80 border border-black/[0.04] p-3 flex items-center gap-3 relative overflow-hidden">
                <div className="size-4 rounded-full bg-neutral-200 animate-pulse" />
                <div className="h-3.5 w-24 bg-neutral-200/70 rounded-full animate-pulse" />
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full h-11.5 rounded-[13px] bg-emerald-600/20 border border-emerald-600/20 mt-3 animate-pulse" />
        </div>
      )}

      {variant === 'otp' && (
        <div className="space-y-4 pt-1 text-center">
          <div className="flex justify-center gap-2.5 py-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="size-11.5 rounded-[12px] bg-neutral-100/90 border border-black/[0.04] animate-pulse relative overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            ))}
          </div>
          <div className="w-full h-11.5 rounded-[13px] bg-emerald-600/20 border border-emerald-600/20 animate-pulse" />
        </div>
      )}

      {variant === 'email' && (
        <div className="space-y-3 pt-1 text-left">
          {/* Email field */}
          <div className="space-y-1">
            <div className="h-3 w-24 bg-neutral-200/60 rounded-full ml-1 animate-pulse" />
            <div className="w-full h-11.5 rounded-[12px] bg-neutral-100/80 border border-black/[0.04] p-3 flex items-center gap-3 relative overflow-hidden">
              <div className="size-4 rounded-md bg-neutral-200 animate-pulse" />
              <div className="h-3.5 w-36 bg-neutral-200/70 rounded-full animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="h-3 w-18 bg-neutral-200/60 rounded-full ml-1 animate-pulse" />
            <div className="w-full h-11.5 rounded-[12px] bg-neutral-100/80 border border-black/[0.04] p-3 flex items-center gap-3 relative overflow-hidden">
              <div className="size-4 rounded-md bg-neutral-200 animate-pulse" />
              <div className="h-3.5 w-24 bg-neutral-200/70 rounded-full animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full h-11.5 rounded-[13px] bg-primary/25 border border-primary/20 mt-2 animate-pulse" />
        </div>
      )}

      {/* Subdued Status Line */}
      <div className="pt-2 flex items-center justify-center gap-2">
        <div className="size-1.5 rounded-full bg-primary/40 animate-ping" />
        <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 tracking-tight">
          Cargando entorno seguro...
        </span>
      </div>
    </motion.div>
  );
}
