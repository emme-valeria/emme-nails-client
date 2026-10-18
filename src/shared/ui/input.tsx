import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-xs font-extrabold text-foreground tracking-tight block">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-muted-foreground flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-10 px-3.5 rounded-2xl bg-secondary/40 border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-card ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-border/60 hover:border-border'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-muted-foreground flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] font-bold text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
