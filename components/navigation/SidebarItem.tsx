'use client';

import React, { useState } from 'react';
import { NavigationItem } from './navigation-config';

interface SidebarItemProps {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export function SidebarItem({
  item,
  isActive,
  isCollapsed,
  onClick,
}: SidebarItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = item.icon;

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-current={isActive ? 'page' : undefined}
        aria-label={item.label}
        className={`group relative flex w-full items-center rounded-xl text-left transition-all duration-200 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EC4899] ${
          isCollapsed
            ? 'h-11 justify-center px-0'
            : 'h-11 px-3 gap-3'
        } ${
          isActive
            ? 'bg-[#FCE7F3] text-[#111111] font-bold shadow-xs border border-[#F1D5DE] dark:bg-[#22141F] dark:text-white dark:border-[#3E1F32]'
            : 'text-[#242424] hover:text-[#111111] hover:bg-[#FFF0F5]/80 dark:text-[#B8B8C2] dark:hover:text-white dark:hover:bg-[#17171D] font-medium'
        }`}
      >
        {/* Subtle Vertical Accent Indicator Line on Active */}
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#B91C1C] dark:bg-[#EC4899] shadow-xs"
          />
        )}

        {/* Icon with subtle hover movement */}
        <div
          className={`flex shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
            isActive
              ? 'text-[#B91C1C] dark:text-[#F472B6]'
              : 'text-[#64748B] group-hover:text-[#B91C1C] dark:text-[#8E8E9A] dark:group-hover:text-[#F472B6]'
          }`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>

        {/* Label & Badges when expanded */}
        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between min-w-0">
            <span className="truncate text-xs tracking-tight">
              {item.label}
            </span>

            {/* Badge Indicator */}
            {item.badge && (
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                  item.badgeType === 'live'
                    ? 'bg-rose-100 text-[#B91C1C] border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60 animate-pulse'
                    : 'bg-[#FCE7F3] text-[#991B1B] dark:bg-[#2A1522] dark:text-[#F472B6]'
                }`}
              >
                {item.badge}
              </span>
            )}

            {/* Subtle Active Indicator Dot if no badge */}
            {!item.badge && isActive && (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#B91C1C] dark:bg-[#EC4899] shrink-0"
              />
            )}
          </div>
        )}
      </button>

      {/* Accessible Tooltip for Collapsed State */}
      {isCollapsed && showTooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-[#111111] px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl dark:bg-[#1E1E24] dark:text-white dark:border dark:border-[#2A2028]"
        >
          <div className="flex items-center gap-1.5">
            <span>{item.label}</span>
            {item.badge && (
              <span className="px-1 py-0.2 rounded text-[9px] bg-rose-600 text-white font-bold uppercase">
                {item.badge}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-[10px] text-slate-300 font-normal max-w-[200px] truncate">
              {item.description}
            </p>
          )}
          {/* Tooltip Arrow */}
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111111] dark:border-r-[#1E1E24]" />
        </div>
      )}
    </div>
  );
}
