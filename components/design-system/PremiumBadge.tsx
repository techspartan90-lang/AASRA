'use client';

import React from 'react';

export type BadgeTone = 'elevated' | 'medium' | 'stable' | 'low' | 'neutral' | 'live';

interface PremiumBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function PremiumBadge({
  children,
  tone = 'neutral',
  size = 'md',
  pulse = false,
  className = '',
  icon,
}: PremiumBadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const toneStyles: Record<BadgeTone, { container: string; dot?: string }> = {
    elevated: {
      container:
        'bg-[#FD1053]/10 text-[#FD1053] border border-[#FD1053]/30 dark:bg-[#FD1053]/15 font-bold',
      dot: 'bg-[#FD1053]',
    },
    medium: {
      container:
        'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 font-semibold',
      dot: 'bg-amber-500',
    },
    stable: {
      container:
        'bg-[#474747]/10 text-[#474747] dark:bg-white/5 dark:text-[#D6D6D6] border border-[#474747]/20 dark:border-white/10 font-medium',
      dot: 'bg-[#474747] dark:bg-[#D6D6D6]',
    },
    low: {
      container:
        'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-semibold',
      dot: 'bg-emerald-500',
    },
    neutral: {
      container:
        'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20 font-medium',
      dot: 'bg-slate-400',
    },
    live: {
      container:
        'bg-[#FD1053]/12 text-[#FD1053] border border-[#FD1053]/35 font-bold uppercase tracking-wider',
      dot: 'bg-[#FD1053]',
    },
  };

  const selectedTone = toneStyles[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide transition-colors ${sizeStyles[size]} ${selectedTone.container} ${className}`}
    >
      {pulse ? (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedTone.dot}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${selectedTone.dot}`}
          />
        </span>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : selectedTone.dot ? (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedTone.dot}`} />
      ) : null}
      <span className="truncate">{children}</span>
    </span>
  );
}
