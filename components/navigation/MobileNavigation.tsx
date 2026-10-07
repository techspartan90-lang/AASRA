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
  Search,
  Home,
  Activity,
  ClipboardCheck,
  Users,
  Radio,
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
  } = useApp();

  const isStaffRole = role !== 'victim';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#474747]/20 bg-white/90 px-3.5 backdrop-blur-md dark:border-white/10 dark:bg-[#1E1E1E]/95 md:hidden">
        {/* Left: Hamburger & Minimal Luxury Emblem */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#474747]/20 bg-black/5 text-[#333333] dark:border-white/10 dark:bg-white/5 dark:text-white transition cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-left cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#333333] to-[#474747] text-white shadow-xs border border-white/10">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs tracking-tight text-[#333333] dark:text-white uppercase">
                MANAS SURAKSHA
              </span>
              <p className="text-[10px] text-[#FD1053] font-semibold">
                Mind Protection
              </p>
            </div>
          </button>
        </div>

        {/* Right: Search & Emergency 112 */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#474747] dark:text-[#D6D6D6] hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            aria-label="24/7 Helpline"
            className="flex h-9 items-center gap-1 px-2.5 rounded-xl bg-[#FD1053] text-white font-bold text-xs shadow-xs"
          >
            <PhoneCall className="h-3.5 w-3.5 fill-white" />
            <span>112</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          LUXURY MOBILE BOTTOM NAVIGATION BAR (< md)
         ========================================================================= */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[#474747]/20 bg-white/95 px-2 backdrop-blur-xl dark:border-white/10 dark:bg-[#1E1E1E]/95 md:hidden"
      >
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition ${
            currentView === 'dashboard' || currentView === 'home'
              ? 'text-[#FD1053] font-bold'
              : 'text-[#6B7280] dark:text-[#A3A3A3]'
          }`}
        >
          <Home className="h-4 w-4" />
          <span className="mt-1">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('distress_score')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition ${
            currentView === 'distress_score'
              ? 'text-[#FD1053] font-bold'
              : 'text-[#6B7280] dark:text-[#A3A3A3]'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span className="mt-1">Distress</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('checkin_wizard')}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium"
        >
          <div className="flex h-9 w-9 -mt-4 items-center justify-center rounded-full bg-[#FD1053] text-white shadow-[0_2px_12px_rgba(253,16,83,0.5)]">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <span className="mt-1 text-[#FD1053] font-bold">Check-In</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('channels')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition ${
            currentView === 'channels'
              ? 'text-[#FD1053] font-bold'
              : 'text-[#6B7280] dark:text-[#A3A3A3]'
          }`}
        >
          <Radio className="h-4 w-4" />
          <span className="mt-1">Channels</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium text-[#6B7280] dark:text-[#A3A3A3]"
        >
          <Menu className="h-4 w-4" />
          <span className="mt-1">Menu</span>
        </button>
      </nav>

      {/* =========================================================================
          SLIDE-OVER LUXURY DRAWER (< md)
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
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-[#333333] text-white shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#333333] via-[#474747] to-[#1E1E1E] text-white shadow-xs border border-white/15">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                      MANAS SURAKSHA
                    </span>
                    <p className="text-[10px] text-[#FD1053] font-semibold">
                      Mind Protection · GOV CARE
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/15 transition cursor-pointer"
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
                            ? 'bg-[#FD1053]/15 text-[#FD1053] font-bold border border-[#FD1053]/35 shadow-[0_0_12px_rgba(253,16,83,0.15)]'
                            : 'text-[#D6D6D6] hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#FD1053]' : 'text-[#A3A3A3]'}`} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#FD1053]/20 text-[#FD1053] border border-[#FD1053]/30">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Staff Workspaces */}
                {isStaffRole && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#FD1053]">
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
                              ? 'bg-[#FD1053]/15 text-[#FD1053] font-bold border border-[#FD1053]/35'
                              : 'text-[#D6D6D6] hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#FD1053]' : 'text-[#A3A3A3]'}`} />
                          <span className="flex-1 truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-white/10 p-3 space-y-2 bg-[#252525]">
                <ThemeToggle showLabel />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold transition min-h-[44px]"
                  >
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Demo Scenarios</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      resetDemoData();
                      setIsOpen(false);
                    }}
                    title="Reset State"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#D6D6D6] hover:text-white"
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
                  className="flex w-full items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FD1053] hover:bg-[#e00b46] text-white text-xs font-bold transition min-h-[44px] shadow-[0_2px_10px_rgba(253,16,83,0.35)]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>24/7 Helpline (112)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
