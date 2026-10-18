import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className = '',
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-extrabold tracking-wide uppercase rounded-full transition-colors';

  const variants = {
    default: 'bg-secondary text-secondary-foreground border border-border/60',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-neutral-100 text-[#1D1D1F] border border-black/[0.06]',
    success: 'bg-primary/10 text-primary border border-primary/20',
    warning: 'bg-[#FAF5EC] text-[#845E1B] border border-[#ECDCC2]',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    outline: 'border border-border/80 text-foreground bg-transparent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-0.5 text-[10px]',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
