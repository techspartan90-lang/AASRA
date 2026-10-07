'use client';

import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export function GlassPanel({
  children,
  className = '',
  title,
  subtitle,
  badge,
  action,
  ...props
}: GlassPanelProps) {
  return (
    <section
      className={`glass-panel p-6 sm:p-8 transition-colors ${className}`}
      {...props}
    >
      {(title || subtitle || badge || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#474747]/15 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              {title && (
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#333333] dark:text-white">
                  {title}
                </h2>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
