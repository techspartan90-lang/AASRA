'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isCollapsed?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  isCollapsed = false,
  className = '',
  showLabel = true,
}: ThemeToggleProps) {
  const { theme, setTheme } = useApp();

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  if (isCollapsed) {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'Day' : 'Night'} Mode`}
        title={`Switch to ${isDark ? 'Day' : 'Night'} Mode`}
        className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-[#17171D] border-[#2A2028] text-[#F472B6] hover:bg-[#22141F] hover:border-[#EC4899]/50'
            : 'bg-white border-[#F1D5DE] text-[#B91C1C] hover:bg-[#FFF0F5] hover:border-[#B91C1C]/40 shadow-xs'
        } ${className}`}
      >
        <span className="sr-only">Toggle theme</span>
        <motion.div
          key={isDark ? 'dark-icon' : 'light-icon'}
          initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-[#F472B6]" />
          ) : (
            <Sun className="h-4 w-4 text-[#B91C1C]" />
          )}
        </motion.div>
      </button>
    );
  }

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-1.5 transition-all duration-200 ${
        isDark
          ? 'bg-[#111116] border-[#2A2028]'
          : 'bg-[#FFF7FA] border-[#F1D5DE]'
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
          !isDark
            ? 'bg-white text-[#111111] shadow-xs border border-[#F1D5DE]'
            : 'text-[#B8B8C2] hover:text-white hover:bg-[#17171D]/60'
        }`}
      >
        <Sun className={`h-3.5 w-3.5 ${!isDark ? 'text-[#B91C1C]' : 'text-slate-400'}`} />
        {showLabel && <span>Day Mode</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-[#17171D] text-white shadow-xs border border-[#2A2028]'
            : 'text-[#475569] hover:text-[#111111] hover:bg-white/60'
        }`}
      >
        <Moon className={`h-3.5 w-3.5 ${isDark ? 'text-[#F472B6]' : 'text-slate-500'}`} />
        {showLabel && <span>Night Mode</span>}
      </button>
    </div>
  );
}
