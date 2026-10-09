'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-i18n';

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
  const { t } = useTranslation();

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
        aria-label={`Switch to ${isDark ? t('theme.day', 'Day') : t('theme.night', 'Night')} Mode`}
        title={`Switch to ${isDark ? t('theme.day', 'Day') : t('theme.night', 'Night')} Mode`}
        className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-[#FD1053]/40'
            : 'bg-white/10 border-white/15 text-white hover:bg-white/15'
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
            <Moon className="h-4 w-4 text-[#FD1053]" />
          ) : (
            <Sun className="h-4 w-4 text-[#FD1053]" />
          )}
        </motion.div>
      </button>
    );
  }

  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-1 transition-all duration-200 ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
          !isDark
            ? 'bg-white text-[#333333] shadow-md border border-white/20'
            : 'text-[#D6D6D6] hover:text-white hover:bg-white/10'
        }`}
      >
        <Sun className={`h-3.5 w-3.5 ${!isDark ? 'text-[#FD1053]' : 'text-[#A3A3A3]'}`} />
        {showLabel && <span>{t('theme.day', 'Day')}</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-[#252525] text-white shadow-md border border-white/15'
            : 'text-[#D6D6D6] hover:text-white hover:bg-white/10'
        }`}
      >
        <Moon className={`h-3.5 w-3.5 ${isDark ? 'text-[#FD1053]' : 'text-[#A3A3A3]'}`} />
        {showLabel && <span>{t('theme.night', 'Night')}</span>}
      </button>
    </div>
  );
}
