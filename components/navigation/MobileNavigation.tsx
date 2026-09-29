'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  CORE_NAVIGATION_ITEMS,
  STAFF_WORKSPACES,
  NavigationItem,
} from './navigation-config';
import { ThemeToggle } from './ThemeToggle';
import {
  Menu,
  X,
  Shield,
  Sparkles,
  RotateCcw,
  PhoneCall,
  Bell,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavigationProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
}

export function MobileNavigation({
  currentView,
  onNavigate,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    role,
    setIsDemoModalOpen,
    resetDemoData,
    setIsEmergencyModalOpen,
    setIsCommandPaletteOpen,
    notifications,
  } = useApp();

  const isStaffRole = role !== 'victim';
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = (item: NavigationItem) => {
    if (item.id === 'support' && isStaffRole) {
      onNavigate('cases');
    } else {
      onNavigate(item.id);
    }
    setIsOpen(false);
  };

  const resolveIsActive = (itemId: string) => {
    if (itemId === 'dashboard') {
      return currentView === 'dashboard' || currentView === 'home';
    }
    if (itemId === 'support') {
      return currentView === 'support' || (isStaffRole && currentView === 'cases');
    }
    if (itemId === 'public') {
      return currentView === 'public';
    }
    return currentView === itemId;
  };

  return (
    <>
      {/* =========================================================================
          COMPACT MOBILE TOP BAR (< md)
         ========================================================================= */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#F1D5DE] bg-white/95 px-3.5 backdrop-blur-md dark:border-[#2A2028] dark:bg-[#07070A]/95 md:hidden">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F1D5DE] bg-[#FFF7FA] text-[#111111] hover:bg-[#FCE7F3] dark:border-[#2A2028] dark:bg-[#111116] dark:text-white dark:hover:bg-[#17171D] transition cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-left cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B91C1C] text-white shadow-xs">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs tracking-tight text-[#111111] dark:text-white uppercase">
                MANAS SURAKSHA
              </span>
              <p className="text-[10px] text-[#64748B] dark:text-[#B8B8C2]">
                Mind Protection
              </p>
            </div>
          </button>
        </div>

        {/* Right: Search, Emergency 112 & Theme Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            aria-label="24/7 Helpline"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-xs"
          >
            <PhoneCall className="h-3 w-3" />
            <span className="hidden xs:inline">112</span>
          </button>

          <ThemeToggle isCollapsed showLabel={false} />
        </div>
      </header>

      {/* =========================================================================
          SLIDE-IN MOBILE NAVIGATION DRAWER
         ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Sliding Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative flex h-full w-[290px] max-w-[85vw] flex-col justify-between border-r border-[#F1D5DE] bg-white shadow-2xl dark:border-[#2A2028] dark:bg-[#0B0B0F]"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#F1D5DE] p-4 dark:border-[#2A2028]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B91C1C] text-white shadow-xs">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm tracking-tight text-[#111111] dark:text-white uppercase">
                      MANAS SURAKSHA
                    </span>
                    <p className="text-[10px] text-[#64748B] dark:text-[#B8B8C2]">
                      Mind Protection
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation drawer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div className="space-y-1">
                  {CORE_NAVIGATION_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = resolveIsActive(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleLinkClick(item)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition cursor-pointer min-h-[44px] ${
                          isActive
                            ? 'bg-[#FCE7F3] text-[#111111] font-bold border border-[#F1D5DE] dark:bg-[#22141F] dark:text-white dark:border-[#3E1F32]'
                            : 'text-[#242424] hover:bg-[#FFF0F5] dark:text-[#B8B8C2] dark:hover:bg-[#17171D] dark:hover:text-white'
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#B91C1C] dark:text-[#F472B6]' : 'text-slate-400'}`} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-100 text-[#B91C1C] dark:bg-rose-950/60 dark:text-rose-300">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Staff Workspaces */}
                {isStaffRole && (
                  <div className="pt-2 border-t border-[#F1D5DE] dark:border-[#2A2028] space-y-1">
                    <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#B91C1C] dark:text-[#F472B6]">
                      Clinical & Governance
                    </span>
                    {STAFF_WORKSPACES.map(item => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onNavigate(item.id);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition cursor-pointer min-h-[44px] ${
                            isActive
                              ? 'bg-[#FCE7F3] text-[#111111] font-bold border border-[#F1D5DE] dark:bg-[#22141F] dark:text-white dark:border-[#3E1F32]'
                              : 'text-[#242424] hover:bg-[#FFF0F5] dark:text-[#B8B8C2] dark:hover:bg-[#17171D] dark:hover:text-white'
                          }`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#B91C1C] dark:text-[#F472B6]' : 'text-slate-400'}`} />
                          <span className="flex-1 truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-[#F1D5DE] p-3 space-y-2 bg-[#FFF7FA] dark:border-[#2A2028] dark:bg-[#0E0E13]">
                <ThemeToggle showLabel />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/80 text-xs font-bold transition min-h-[44px]"
                  >
                    <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Demo Scenarios</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      resetDemoData();
                      setIsOpen(false);
                    }}
                    title="Reset State"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-[#F1D5DE] text-slate-700 dark:bg-[#17171D] dark:border-[#2A2028] dark:text-slate-200"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsEmergencyModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold transition min-h-[44px]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>24/7 National Emergency (112)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
