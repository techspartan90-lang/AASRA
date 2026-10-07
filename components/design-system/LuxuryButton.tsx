'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function LuxuryButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: LuxuryButtonProps) {
  const sizeStyles = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'min-h-[44px] px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'min-h-[50px] px-7 py-3 text-base rounded-2xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#FD1053] hover:bg-[#e00b46] active:bg-[#c4093c] text-white font-semibold shadow-[0_2px_12px_-1px_rgba(253,16,83,0.35)] hover:shadow-[0_4px_20px_-1px_rgba(253,16,83,0.5)] border border-transparent',
    secondary:
      'bg-[#474747]/10 hover:bg-[#474747]/15 dark:bg-white/5 dark:hover:bg-white/10 text-[#333333] dark:text-white font-medium border border-[#474747]/20 dark:border-white/10 hover:border-[#FD1053]/40 shadow-xs',
    tertiary:
      'bg-transparent hover:bg-[#474747]/8 dark:hover:bg-white/5 text-[#474747] dark:text-[#D6D6D6] hover:text-[#FD1053] dark:hover:text-[#FD1053] font-medium border border-transparent',
    ghost:
      'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#333333] dark:text-white font-medium',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold shadow-sm',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center cursor-pointer transition-all duration-200 outline-hidden select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
