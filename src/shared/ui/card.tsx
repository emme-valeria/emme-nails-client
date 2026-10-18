import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
}

export function Card({ className = '', variant = 'default', style, children, ...props }: CardProps) {
  const baseStyles = 'rounded-[24px] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]';

  const variants = {
    default: 'bg-white/70 dark:bg-[#1E1E1E]/60 border border-white/40 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]',
    elevated: 'bg-white/80 dark:bg-[#1E1E1E]/75 border border-white/50 dark:border-white/15 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-0.5',
    glass: 'bg-white/60 dark:bg-white/[0.08] border border-white/50 dark:border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.06)]',
    interactive: 'bg-white/70 dark:bg-[#1E1E1E]/60 border border-white/40 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]',
  };

  return (
    <div 
      style={{
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        ...style,
      }}
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pb-2 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-bold text-[#1D1D1F] dark:text-foreground tracking-tight font-display ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xs sm:text-sm text-[#86868B] font-medium mt-1 ${className}`} {...props}>{children}</p>;
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-2 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center ${className}`} {...props}>{children}</div>;
}
