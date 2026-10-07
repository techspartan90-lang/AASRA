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
        className={`group relative flex w-full items-center rounded-xl text-left transition-all duration-200 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-[#FD1053] ${
          isCollapsed
            ? 'h-11 justify-center px-0'
            : 'h-11 px-3 gap-3'
        } ${
          isActive
            ? 'bg-[#FD1053]/10 text-[#FD1053] font-semibold shadow-[0_0_15px_rgba(253,16,83,0.08)] border border-[#FD1053]/25'
            : 'text-[#D6D6D6] hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent font-medium'
        }`}
      >
        {/* Thin Luxury Accent Indicator Line on Active */}
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#FD1053] shadow-[0_0_8px_#FD1053]"
          />
        )}

        {/* Icon with subtle hover glow */}
        <div
          className={`flex shrink-0 items-center justify-center transition-all duration-200 group-hover:scale-105 ${
            isActive
              ? 'text-[#FD1053] drop-shadow-[0_0_6px_rgba(253,16,83,0.4)]'
              : 'text-[#A3A3A3] group-hover:text-white group-hover:drop-shadow-[0_0_6px_rgba(253,16,83,0.25)]'
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
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  item.badgeType === 'live'
                    ? 'bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/35 animate-pulse'
                    : 'bg-white/10 text-white border border-white/15'
                }`}
              >
                {item.badge}
              </span>
            )}

            {/* Subtle Active Indicator Dot if no badge */}
            {!item.badge && isActive && (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#FD1053] shadow-[0_0_6px_#FD1053] shrink-0"
              />
            )}
          </div>
        )}
      </button>

      {/* Accessible Tooltip for Collapsed State */}
      {isCollapsed && showTooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-xl bg-[#252525] px-3 py-2 text-xs font-semibold text-white shadow-2xl border border-white/15"
        >
          <div className="flex items-center gap-1.5">
            <span>{item.label}</span>
            {item.badge && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#FD1053] text-white font-bold uppercase">
                {item.badge}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-[10px] text-[#A3A3A3] font-normal max-w-[200px] truncate mt-0.5">
              {item.description}
            </p>
          )}
          {/* Tooltip Arrow */}
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#252525]" />
        </div>
      )}
    </div>
  );
}
