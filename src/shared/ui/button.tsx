import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97] cursor-pointer';

    const variants = {
      primary: 'bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(224,82,134,0.25)] hover:brightness-105 border border-white/20',
      secondary: 'bg-black/[0.04] dark:bg-white/[0.08] text-foreground hover:bg-black/[0.07] dark:hover:bg-white/[0.12] border border-white/30 dark:border-white/10 backdrop-blur-sm',
      outline: 'border border-white/40 dark:border-white/10 bg-white/80 dark:bg-white/[0.08] text-foreground hover:bg-white dark:hover:bg-white/[0.12] shadow-2xs backdrop-blur-md',
      ghost: 'text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]',
      danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 shadow-2xs',
    };

    const sizes = {
      sm: 'min-h-[44px] h-11 px-4 text-xs rounded-full gap-1.5',
      md: 'min-h-[44px] h-12 px-5 text-sm rounded-full gap-2',
      lg: 'min-h-[48px] h-14 px-7 text-base rounded-full gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Cargando...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
